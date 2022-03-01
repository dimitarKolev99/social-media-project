  process.env.NODE_ENV = 'test'
  const chai = require('chai')
  chai.use(require('chai-http'))
  const User = require('../models/user')
  module.exports = {
    chai: chai,
    expect: chai.expect,
    app: require('../app'),
    User: User
  }
  beforeEach(function (done) {
    // console.log('global beforeEach')
    User.deleteMany({})
      .then(() => {
        // console.log('all User deleted')
        done()
      })
      .catch(error => {
        // console.log('error caught: ' + error.message)
        done(error.message)
      })
  })