const User = require('../models/user');
const Post = require('../models/post');

const path = require('path');
const fs = require('fs');
const { get } = require('superagent');

var x = 0;

function increment() {
  x++;
}

function getX() {
  return x;
}

module.exports = {

uploadProfilePic: (req, res, next) => {
  console.log(req.file);
  if(req.file) {
    console.log(req.file.path);
    const tempPath = req.file.path;
    // const newFileName = `upload${getX()}.jpg`;
        const newFileName = `upload${path.extname(req.file.originalname)}`;
        const targetPath = path.join(
          path.dirname(req.file.originalname), 'public/uploads', newFileName);
    
          fs.rename(tempPath, targetPath, err => {
            if (err) return console.log(`Error renaming file: ${err.message}`);

            let userId = req.params.id;

            User.findByIdAndUpdate(userId, {
              $set: { imageUrl: `../uploads/${newFileName}` }
            })
            .then(user => {
              req.flash("success", 'Profile pic uploaded!');
              res.locals.redirect = `/profile/${userId}`;
              res.locals.user = user;
              increment();
              next();
            })
            .catch(error => {
              console.log(`Error updating user by ID: ${error.message}`);
              next(error);
            });
          });
    }
    else throw 'error';
  },

  uploadPostPic: (req, res, next) => {
    if(req.file) {
      console.log("req file");
      const tempPath = req.file.path;
          const newFileName = `upload${getX()}${path.extname(req.file.originalname)}`;
          const targetPath = path.join(
            path.dirname(req.file.originalname), 'public/uploads', newFileName);
      
            fs.rename(tempPath, targetPath, err => {
              if (err) return console.log(`Error renaming file: ${err.message}`);
              // res.locals.redirect = `/feed`;
              // next();
              /* let userId = req.params.id;
  
              User.findByIdAndUpdate(userId, {
                $set: { imageUrl: `../uploads/${newFileName}` }
              })
              .then(user => {
                req.flash("success", 'Profile pic uploaded!');
                res.locals.redirect = `/profile/${userId}`;
                res.locals.user = user;
                increment();
                next();
              })
              .catch(error => {
                console.log(`Error updating user by ID: ${error.message}`);
                next(error);
              }); */
            });
      }
      else throw 'error';
    },

};