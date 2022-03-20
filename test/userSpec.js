process.env.NODE_ENV = 'test'
const User = require('../models/user'),
  { expect } = require('chai');


/* beforeEach(function (done) {
  // console.log('global beforeEach')
  User.deleteMany({})
    .then(() => {
      // console.log('all User deleted')
      done();
    })
    .catch(error => {
      // console.log('error caught: ' + error.message)
      done(error.message);
    })
}) */

    it('it should save one user', function (done) {
        let testUser = new User({
            username: "Dimitar",
            email: "mitko@test.com",
            password: "1234",
        });

        testUser.save()
        .then(() => {
            User.find({})
                .then((result) => {
                    expect(result.length).to.eq(1);
                    done();
            });
        })

    });
