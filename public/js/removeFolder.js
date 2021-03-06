const fs = require("fs");

module.exports = {
  removeDir: function(path) {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path);
  
      if (files.length > 0) {
        files.forEach(function(filename) {
          if (fs.statSync(path + "/" + filename).isDirectory()) {
            removeDir(path + "/" + filename);
          } else {
            fs.unlinkSync(path + "/" + filename);
          }
        })
        fs.rmdirSync(path);
      } else {
        fs.rmdirSync(path);
      }
    } else {
      console.log("Directory path not found.");
    }
  },

  removeFile: function(path) {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);      
    } else {
      console.log("File not found.");
    }
  },
  
  
} 
