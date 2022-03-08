const User = require('../models/user');
const Post = require('../models/post');

const path = require('path');
const fs = require('fs');
const user = require('../models/user');

var x = 0;

function increment() {
  x++;
}

function getX() {
  return x;
}

module.exports = {

  uploadProfilePic: (req, res, next) => {
    if (req.file) {
      const tempPath = req.file.path;
      const newFileName = `profile_pic${path.extname(req.file.originalname)}`;

      let userID = req.params.id;      
      try {
        if (fs.existsSync(`./public/uploads/${userID}`)) {

          const targetPath = path.join(
            path.dirname(req.file.originalname), `public/uploads/${userID}`, newFileName);
    
          fs.rename(tempPath, targetPath, err => {
            if (err) return console.log(`Error renaming file: ${err.message}`);
        
            User.findByIdAndUpdate(userID, {
              $set: { imageUrl: `../uploads/${userID}/${newFileName}` }
            })
              .then(user => {
                req.flash("success", 'Profile pic uploaded!');
                res.locals.redirect = `/profile/${userID}`;
                res.locals.user = user;
                next();
              })
              .catch(error => {
                console.log(`Error updating user by ID: ${error.message}`);
                next(error);
              });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    else throw 'error';
  },

  uploadPostPic: (req, res, next) => {
    if (req.file) {
      const tempPath = req.file.path;
      const newFileName = `upload${getX()}${path.extname(req.file.originalname)}`;
      const targetPath = path.join(
        path.dirname(req.file.originalname), 'public/uploads', newFileName);

      fs.rename(tempPath, targetPath, err => {
        if (err) return console.log(`Error renaming file: ${err.message}`);
        console.log(req.body);
        console.log(targetPath);

        Post.create({
          authorId: req.user._id,
          content: req.body.content,
          imageUrl: `../uploads/${newFileName}`
        })
          .then(post => {
            User.findByIdAndUpdate({ _id: req.user._id }, { $push: { posts : post._id } }, {new:true},
              function (error, success) {
              if (error) {
                req.logout();
                req.flash("error", "Creating post failed");
                res.locals.redirect = "/error";
                next();
                console.log(`Error updating user: ${error.message}`);
              }               
                req.flash("success", "Your post has been created!");
                res.locals.redirect = '/feed';
                next();
              
            });
          })
          .catch(error => {
            console.log(`Error inserting post: ${error.message}`);
            res.locals.redirect = `/feed/create`;
            next();
          });

      });
    }
    else throw 'error';
  },

};