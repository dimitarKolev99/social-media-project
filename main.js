const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const feedController = require("./controllers/feedController");
const profileController = require("./controllers/profileController");
const usersController = require("./controllers/usersController");
const imagesController = require('./controllers/imagesController');
const postController = require('./controllers/postController');

const Product = require('./models/product');

const user = require('./models/user');

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
const passport = require("passport");

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user; 
  next();
});


//Handling data from POST-request
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

app.get('/product', function(req, res, next) {
  Product.find({}).then(function(products) {
      res.send(products);
  });
});

app.get("/users", usersController.index, usersController.indexView);
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);

// app.get("/", homeController.respondWebsite);
app.get("/", profileController.login);
app.post("/", profileController.authenticate, profileController.redirectView);

app.get("/profile", profileController.indexView);
app.get("/profile/logout", profileController.logout, profileController.redirectView);

app.get("/signup", profileController.new);
app.post("/signup", profileController.validate, profileController.create, profileController.redirectView);

app.get("/profile/:id/edit", profileController.edit)
app.get("/profile/:id", profileController.show, profileController.showView);
app.put("/profile/:id/update", profileController.update, profileController.redirectView)

app.delete("/profile/:id/delete", profileController.delete, profileController.redirectView)

var uploadImage = multer({dest: __dirname + '/public/uploads'});

app.get("/feed", feedController.show, feedController.showView);
app.get("/feed/create", postController.indexView);

app.post('/upload/', uploadImage.single("NAME"), imagesController.uploadPostPic, postController.redirectView);

app.post("/feed/create", postController.new, postController.redirectView);



app.post('/upload/:id', uploadImage.single("NAME"), imagesController.uploadProfilePic,
 profileController.redirectView);

// app.use(express.static(path.join(__dirname, 'public')));

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: http://localhost:${app.get("port")}`);
});