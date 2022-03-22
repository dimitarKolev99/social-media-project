const User = require('../models/user');
const Post = require('../models/post');
const remove = require('../public/js/removeFolder.js');
const fs = require('fs');

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
    const postId = req.params.id;
    Post.findByIdAndRemove(postId)
      .then((post) => {
        if (post.imageUrl != null) {
          let imageID = post.imageUrl.substring(11, post.imageUrl.length);
  
           fs.unlink(`./public/uploads/${imageID}`, (err) => {
            if (err) throw err;
            req.flash("success", `Post deleted successfully!`);
            res.locals.redirect = `/profile/${req.user._id}`;
            next();
            console.log('successfully deleted /tmp/hello');
          });

        }

      })
      .catch(error => {
        console.log(`Error deleting post by ID: ${error.message}`);
        req.flash("error", `Failed to delete post because: ${error.message}`);
        next();
      });
  },

  deleteAllFromUser: (req, res, next) => {
    const userId = req.params.id;
    Post.deleteMany({ authorId : userId})
      .then(() => {
        req.flash("success", `Posts deleted successfully!`);
        res.locals.redirect = '/';
        next();
      })
      .catch(error => {
        console.log(`Error deleting all post by authorID: ${error.message}`);
        req.flash("error", `Failed to delete post because: ${error.message}`);
        next();
      });
  },

  redirectView: (req, res, next) => {
    console.log('Redirect View');
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
  
};