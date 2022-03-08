httpStatus = require('http-status-codes')
const passport = require('passport');
const User = require("../models/user");
const Post = require("../models/post");
const fs = require('fs');
const path = require('path');

const removeDir = require('../public/js/removeFolder.js');

const getUserParams = body => {
  return {
    username: body.username,
    email: body.email,
    password: body.password
  }
}

module.exports = {
  index: (req, res) => {
    User.find({})
      .then(users => {
        res.locals.users = users;
        next();
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      })
  },
  indexView: (req, res) => {
    res.render("profile/index");
  },

  new: (req, res) => {
    console.log('new');
    res.render("signup");
  },

  
  redirectView: (req, res, next) => {
    console.log('Redirect View');
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
  
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        // res.locals.user = user;

        User.populate(user, "posts")
        .then(user => {
          res.locals.user = user;
          next();
        })
        .catch(error => {
          console.log(`Error populating by ID:${error.message}`);
          next(error);
        });
        
      })
      .catch(error => {
        console.log(`Error fetching user by ID:${error.message}`);
        next(error);
      });
    },

  showView: (req, res) => {
    res.render("profile/index");
  },
  
  edit: (req, res, next) => {
    const userId = req.params.id
    User.findById(userId)
      .then(user => {
        res.render('profile/edit', {
          user: user
        })
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`)
        next(error)
      })
  },

  update: (req, res, next) => {
    const userId = req.params.id
    const userParams = getUserParams(req.body)
    User.findByIdAndUpdate(userId, {
        $set: userParams
      })
      .then(user => {
        req.flash("success", `${user.username}'s account changes successfully!`)
        res.locals.redirect = `/profile/${userId}`
        res.locals.user = user;
        next();
      })
      .catch(error => {
        req.flash("error", `Failed to change ${user.username}'s account!`);
        console.log(`Error updating user by ID: ${error.message}`)
        next(error);
      })
  },
  
  delete: (req, res, next) => {
    const userId = req.params.id
    User.findByIdAndRemove(userId)
      .then((user) => {
        
        try {
          if (fs.existsSync(`./public/uploads/${userId}`)) {
            removeDir.removeDir(`./public/uploads/${userId}`);
            req.flash("success", `${user.username}'s account deleted successfully!`);
            next();
          }
        } catch (err) {
          console.log(`ERROR deleting folder and files: ${err.message}`);
        }

      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`)
        req.flash("error", `Failed to delete user account because: ${error.message}`)
        next(error);
      })
  },

  login: (req, res) => {
    res.render('index');
  },


  authenticate: passport.authenticate("local", {
    failureRedirect: "/error",
    faliureFlash: "Failed to login.",
    successRedirect: "/feed",
    successFlash: "Logged in!"
  }),

  /* authenticate: (req, res, next) => {
    User.findOne( { email : req.body.email } )
      .then((user) => {
        if (user) {
          user.passwordComparison(req.body.password)
          .then(passwordMatch =>{
            if (passwordMatch) {
              res.locals.redirect = '/feed';
              req.flash("success", `${user.username}'s logged in successfully!`);
              req.user = user;
            } else {
              req.flash("error", "Your account or password is incorrect. Please try again or contact your system administrator!");
              res.locals.redirect = '/';
            }
            next();
          });       
        } else {
          req.flash("error", "Failed to log in user account: Useraccount not found.");
          res.locals.redirect = "/users/login";
          next();
        }
      })
      .catch(error => {
        console.log(`Error: ${error.message}`);
        next(error);
      });
  }, */

  logout: (req, res, next) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  },
  
  //Creating New User
  validate: (req, res, next) => {
    req.sanitizeBody("email").normalizeEmail({
      all_lowercase: true
    }).trim();
    req.check("email", "Email is invalid").isEmail();
    req.check("password", "Password is to short!").notEmpty().isLength({min: 4}).equals(req.body.password);

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/signup";
        next();
      } else {
        next();
      }
    });
  },

  create: (req, res, next) => {
    if (req.skip) {next();}
    let newUser = new User( getUserParams(req.body) );

    User.register(newUser, req.body.password, (error, user) => {
      if(user) {
        let folderName = `./public/uploads/${user._id}`;

        try {
          if (!fs.existsSync(folderName)) {

            fs.mkdirSync(folderName);

            User.findByIdAndUpdate(user._id, {
              $set: { imageUrl: `../images/fb_default.jpg` }
            })
            .then(user => {
              req.flash("success", `${user.username}'s account created successfully!`);
              res.locals.redirect = "/";
              next();
            })
            .catch(error => {
              console.log(`Error registering: ${error.message}`);
              res.locals.redirect = "/signup";
              next();
            });

          }
        } catch (err) {
          req.flash("error", `Failed to create user account because: ${err.message}.`)
          res.locals.redirect = "/signup";
          next();  
        } 
        
      } else { 
        req.flash("error", `Failed to create user account because: ${error.message}.`)
        res.locals.redirect = "/signup";
        next();
      }
    })
  },

}