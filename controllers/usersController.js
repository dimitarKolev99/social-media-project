const User = require("../models/user");

const getUserParams = body => {
    return {
      username: body.username,
      email: body.email,
      password: body.password
    }
  }

module.exports = {

    //Finding all users and redirecting
    index: (req, res, next) => {
        User.find({})
            .then(users => {
                    res.locals.users = users;
                    next();
            })
            .catch(error => {
                console.log(`Error fetching users: ${error.message}`);
                next(error);
            });
    },

    //Rendering index with the users from above
    indexView: (req, res, next) => {
        res.render("users/index");
    },

    //The new user page
    new: (req, res) => {
        res.render("users/new");
    },

    //Handling Post Request from the new user page and redirecting to index view
    create: (req, res, next) => {

        let userParams = getUserParams(req.body);

        User.create(userParams)
            .then(user => {
                req.flash("success", `${user.username}'s account created successfully!`);
                res.locals.redirect = "/users";
                res.locals.user = user;
                next();
            })
            .catch(error => {
                res.locals.redirect = "/users/new";
                req.flash("error",
                `Failed to create user account because: ${error.message}`);
                next();
            });
    },

    //Redirecting to index page or error
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
};
