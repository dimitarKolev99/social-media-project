const User = require('../models/user');
const Post = require('../models/post');

const path = require('path');
const fs = require('fs');

module.exports = {

  uploadProfilePic: (req, res, next) => {
    if (req.files) {
      
      let userID = req.params.id;
      try {
        if (fs.existsSync(`./public/uploads/${userID}`)) {
          
          let avatar = req.files.NAME;
          const newFileName = `profile_pic${path.extname(avatar.name)}`;
          avatar.mv(path.join(`./public/uploads/${userID}`, newFileName));

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

        avatar.mv(path.join(path.dirname(avatar.name), '/public/images/', `preview${path.extname(avatar.name)}`));

        res.setHeader('Content-Type', 'application/json');
        res.end(`preview${path.extname(avatar.name)}`);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },

  uploadPostPic: (req, res, next) => {
    if (req.files) {
      const user = req.user;

      try {
        if (fs.existsSync(`./public/uploads/${user._id}`)) {

          var newFileName;

          var avatar = req.files.NAME;


          Post.create({
            authorId: req.user._id,
            content: req.body.content ? req.body.content : null,
            imageUrl: ``
          })
            .then(post => {
              const postID = post._id;
              newFileName = `${postID}${path.extname(avatar.name)}`;

              avatar.mv(path.join(`./public/uploads/${user._id}`, newFileName));

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
    else if (req.body.content) {
      Post.create({
        authorId: req.user._id,
        content: req.body.content ? req.body.content : '',
      })
      .then(() => {
        req.flash("success", "Your post has been created!");
        res.locals.redirect = '/feed';
        next();
      });
    } else {
      res.end('<h2>You cant upload an empty post</h2><a href="/">Go Back</a>');
    }
  },

};