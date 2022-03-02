const mongoose = require("mongoose");
const User = require('./user.js');

const postSchema = mongoose.Schema({
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},

    content:{
        type: String,
        required: true
    },
    linked:{
        type: String
    }, 
    comments:{
        type: String,
    }, 
    rating:{
        type: Number
    },
    imageUrl: {
        type: String 
    }, 
},
    {
        timestamps: true
    }
);

/* postSchema.methods.findPost = function () {
    return this.model("Post").find({author: this.authorId}).exec();
} */

if (this.authorId) {
    postSchema.methods.methods.getAuthorId = function () {
        return this.authorId;
    }; 
}

if (this.authorName) {
    postSchema.methods.methods.getAuthorName = function () {
        return this.authorName;
    };

}

if (this._id) {
    postSchema.methods.methods.getObjectId = function () {
        return this._id;
    };     
}


module.exports = mongoose.model("Post", postSchema);