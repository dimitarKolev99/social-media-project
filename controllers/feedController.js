const User = require('../models/user');
const Post = require('../models/post');

exports.logRequestPaths = (req, res, next) => {
  console.log(`request made to: ${req.url}`);
  next();
 };
 
module.exports = {

  show: (req, res, next) => {
    Post.find({})
    .sort({createdAt: -1})
    .then(posts => {
        res.locals.posts = posts;
        next();
      })
      .catch(error => {
        console.log(`Error fetching posts:${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render("feed");
  },

  respondWebsite: (req, res) => {
    console.log('rendering feed');
    res.render("feed.ejs");
  }
};