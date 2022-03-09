const chai = require('chai'),
  { expect } = chai,
  profileController = require('../controllers/profileController.js');

describe("profileController", () => {
  describe("getUserParams", () => {
    it("should convert request body to contain describe block.the name attributes of the user object", () => {
         var body = {
           username : 'Dimitar',
           email : 'mitko@test.com',
           password : 1234,
         };

         expect(profileController.getUserParams(body)).to.deep.include(
           {username : 'Dimitar',
           email : 'mitko@test.com',
           password : 1234,}
         );

       });

       it('should return an empty object with empty request body input', () =>{
         var emptyBody = {};
         expect(profileController.getUserParams(emptyBody)).to.deep.include({});
       });
  });
});
