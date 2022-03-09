const assert = require('assert');

let add = (x, y) => {
  return x + y;
}

assert.equal(add(5, 4), 9, '5 plus 4 should equal 9');
