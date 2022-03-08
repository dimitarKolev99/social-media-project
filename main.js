const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const feedController = require("./controllers/feedController");
const profileController = require("./controllers/profileController");
const usersController = require("./controllers/usersController");
const imagesController = require('./controllers/imagesController');
const postController = require('./controllers/postController');

const Product = require('./models/product');

const User = require('./models/user');

const methodOverride = require('method-override')

//Sessions, Cookies, Flash messages
const expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash");
//

const fs = require('fs');
const multer = require("multer");
// const upload = multer();
const expressValidator = require("express-validator");  //npm i express-validator@5.3.0 OTHERWISE THERE MIGHT BE ERRORS

require('dotenv').config();
// dbUrl = process.env.dbUrl ||"mongodb://localhost:27017/socialMedia_db" ;
const express = require("express"),
  path = require("path"),
  app = express(),
  layouts = require("express-ejs-layouts");

const mongoose = require("mongoose");


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log(err));



app.use(cookieParser("secret_passcode"));
app.use(expressSession({
  secret: "secret_passcode",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
}));
app.use(connectFlash());

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware to associate connectFlash to to flashes on response
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user; 
  next();
});
//

//Parsing data from POST-request
app.use(express.json());
app.use(express.urlencoded({
  extended: true
})); 
// app.use(upload.array());
//


app.use(expressValidator());
app.set("view engine", "ejs");

var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.set("port", port);
app.use(layouts);

app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));

app.use(express.static('public'));

var uploadImage = multer({dest: __dirname + '/public/uploads'});

app.get('/product', function(req, res, next) {
  Product.find({}).then(function(products) {
      res.send(products);
  });
});
app.get("/", profileController.login);
app.post("/", profileController.authenticate);

/* app.get("/users", usersController.index, usersController.indexView);
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);
 */
// app.get("/", homeController.respondWebsite);

app.get("/profile", profileController.indexView);
app.get("/profile/logout", profileController.logout, profileController.redirectView);

//Sign up routes
app.get("/signup", profileController.new);
app.post("/signup", profileController.validate, profileController.create,
 profileController.redirectView);
//

app.get("/profile/:id", profileController.show, profileController.showView);
app.post('/upload/:id', uploadImage.single("NAME"), imagesController.uploadProfilePic,
profileController.redirectView);

app.get("/profile/:id/edit", profileController.edit);

app.put("/profile/:id/update", profileController.update, profileController.redirectView);

app.delete("/profile/:id/delete", profileController.delete, postController.deleteAllFromUser,
profileController.redirectView);

//Feed routes
app.get("/feed", feedController.show, feedController.showView);
app.get("/feed/create", postController.indexView);

app.post('/upload/', uploadImage.single("NAME"), imagesController.uploadPostPic,
postController.redirectView);
 
app.delete("/feed/:id/delete", postController.delete,postController.redirectView);
//


app.get('/error', errorController.index);

app.post("/feed/create", postController.new, postController.redirectView);




// app.use(express.static(path.join(__dirname, 'public')));

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: http://localhost:${app.get("port")}`);
});