const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const Post = require('./post.js');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],

},
    {
        timestamps: true
    }
);

UserSchema.pre("save", function(next) {
    let user = this;

    bcrypt.hash(user.password, 10).then(hash =>{
        user.password = hash;
        next();
    })
    .catch(error => {
        console.log(`Error in hashing password: ${error.message}`);
        next(error);
    });
});

UserSchema.methods.passwordComparison = function(inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
};

UserSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

UserSchema.methods.findUser = function () {
    return this.model("User").find({
        username: this.username
    }).exec();  
};

UserSchema.methods.getInfo = function () {
    return `Username: ${this.username}
            Email: ${this.email}
            Password: ${this.password} 
            Posts: ${this.posts}
            ImageUrl: ${this.imageUrl}`;
};

UserSchema.methods.getUsername = function () {
    return this.username;
};

UserSchema.methods.getObjectId = function () {
    return this._id;
};

module.exports = mongoose.model("User", UserSchema);