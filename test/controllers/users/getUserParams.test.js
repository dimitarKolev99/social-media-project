  const userController = require('../../../controllers/profileController')

  describe('userController', function () {
    describe('getUserParams', function () {
      it('should extract User parameters from request body ', function () {
        const expected = {
          username: "Test1",
          email: "Test1@test.de",
          password: "1234"
        }
        const body = {
          ...{
            a: 'b',
            c: 'd',
            ...expected
          }
        } // in this simple example without nesting, its mostly the same.
        expect(userController.getUserParams(body)).toStrictEqual(expected)
      })
      it('should return an empty object with empty request', function () {
        const emptyBody = {}
        expect(userController.getUserParams(emptyBody)).toStrictEqual({})
      })
    })
  })