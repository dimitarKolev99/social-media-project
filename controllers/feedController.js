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
        Post.populate(posts, 'authorId')
        .catch(error => console.log(`Error POPULATING: ${error.message}`))
        .then(posts => {
          res.locals.posts = posts;
          next();
        });
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
  },

  upload: (req, res) => {
    if(req.file) {
        res.send(`${req.file.path}`);
        res.json(req.file);
    }
    else throw 'error';
  }
};