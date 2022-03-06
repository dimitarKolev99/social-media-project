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

      delete: (req, res, next) => {
        const postId = req.params.id;
        Post.findByIdAndRemove(postId)
          .then(() => {
            req.flash("success", `Post deleted successfully!`);
            res.locals.redirect = `/profile/${req.user._id}`;
            next();
          })
          .catch(error => {
            console.log(`Error deleting post by ID: ${error.message}`);
            req.flash("error", `Failed to delete post because: ${error.message}`);
            next();
          });
      },
};