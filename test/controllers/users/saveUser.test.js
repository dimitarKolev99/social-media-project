const {
  User,
  request
} = require('../../commonJest')

const testUserData = {
  username: "Test1",
  email: "Test1@test.de",
  password: "1234"
}
describe('profileController', function () {
  describe('SAVE User', function () {
    it('should save the posted user', function (done) {
      const testUser = new User(testCourseData)
      testUser.save()
        .then(() => {
          User.find({})
            .then(result => {
              expect(result.length).toBe(1)
              expect(result[0]).toHaveProperty('_id')
              done()
            })
        })
        .catch((error) => {
          done(error.message)
        })
    })
  })
})