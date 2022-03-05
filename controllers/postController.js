const User = require('../models/user');
const Post = require('../models/post');

const getUserParams = body => {
    return {
      content: body.text,
      fileUrl: body.file,
    }
  }

module.exports = {
    indexView: (req, res) => {
        res.render('posts/new');
    },

    new: (req, res, next) => {
        console.log(`REQUEST BODY: ${req.body}`);
        res.locals.redirect = '/feed';
        next();
    },

    redirectView: (req, res, next) => {
        console.log('Redirect View');
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
      },
};