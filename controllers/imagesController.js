const User = require('../models/user');
const Post = require('../models/post');

const path = require('path');
const fs = require('fs');

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

  previewPic: (req, res, next) => {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
        let avatar = req.files.NAME;

        avatar.mv(path.join('./public/images/', avatar.name));

        res.setHeader('Content-Type', 'application/json');
        res.end(avatar.name);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  uploadPostPic: (req, res, next) => {
    if (req.file) {
      const user = req.user;
      const tempPath = req.file.path;

      try {
        if (fs.existsSync(`./public/uploads/${user._id}`)) {

          var newFileName;

          Post.create({
            authorId: req.user._id,
            content: req.body.content,
            imageUrl: ``
          })
            .then(post => {
              const postID = post._id;
              newFileName = `${postID}${path.extname(req.file.originalname)}`;

              fs.rename(
                tempPath, path.join(
                  path.dirname(req.file.originalname), `public/uploads/${user._id}`, newFileName),
                err => {
                  if (err) return console.log(`Error renaming file: ${err.message}`);

                  Post.findByIdAndUpdate(
                    { _id: postID },
                    { imageUrl: `../uploads/${user._id}/${newFileName}` },
                    function (err) {
                      if (err) {

                        req.logout();
                        req.flash("error", "Creating post failed");
                        res.locals.redirect = "/error";
                        next();
                        console.log(`Error updating post: ${error.message}`);

                      }

                      User.findByIdAndUpdate(
                        { _id: req.user._id },
                        { $push: { posts: postID } },
                        { new: true },
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


                    }
                  )
                    .catch(error => {
                      console.log(`Error updating post: ${error.message}`);
                      res.locals.redirect = `/feed/create`;
                      next();
                    });

                });

            })
            .catch(error => {
              console.log(`Error inserting post: ${error.message}`);
              res.locals.redirect = `/feed/create`;
              next();
            });


        }
      } catch (err) {
        console.log(`ERROR: ${err.message}`);
      }


    }
    else {
      res.end('<h2>Error uploading file</h2> ');
    };
  },

};