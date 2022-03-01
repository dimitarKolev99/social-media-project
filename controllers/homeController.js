exports.logRequestPaths = (req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next();
   };

exports.respondWebsite = (req,res) =>{
  console.log('homeController.respondWebsite');
  res.render("index.ejs");
}

exports.userSignUpProcessor = (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("Contact information submitted successfully.");
   };