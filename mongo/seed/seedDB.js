const mongoURI = process.env.dbUrl || "mongodb://localhost:27017/socialMedia_db";
const mongoose = require('mongoose')
const User = require('../../models/user')
mongoose.Promise = global.Promise
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

const seedUsers = require('./seedUser')



User.deleteMany({})
  .then(() => {
    console.log('all Users deleted')
  })
  .then(() => {
    return User.create(seedUsers)
  })
  .catch(error => console.log(error.message))
  .then(createdUser => {
    // console.log(createdUser.length + ' Users created')
    mongoose.connection.close()
  })