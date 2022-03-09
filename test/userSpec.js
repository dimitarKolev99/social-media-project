process.env.NODE_ENV = 'test';

const User = require('../models/user.js');
const mongoose = require('mongoose');
const { expect } = require('chai');

require('../main');

beforeEach(done => {
  User.remove({})
    .then(() => {
      done();
    });
});

describe('SAVE user', () => {
  it('it should save one user', (done) => {
    let testUser = new User({
      username : 'Dimitar',
      email : 'dimitar@test.com'
    });

    testUser.save()
      .then(() => {
        User.find({})
          .then(result => {
            expect(result.length)
              .to.eq(1);
            expect(result[0])
              .to.have.property('_id');
              done();
          })
          .catch(done());

      })
      .catch(done());

  });
});
