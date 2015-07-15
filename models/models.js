var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var commentSchema = new Schema ({
	text: String
});

var authorSchema = new Schema ({
	name: String
});

var postSchema = new Schema ({
	title: String, 
	content: String,
	author: {
		type: Schema.Types.ObjectId,  //referencing the author
		ref: "author"
	}, 
	comments: [commentSchema]  //embedded list of comments
});


var Post = mongoose.model('post', postSchema);
var Comment = mongoose.model('comment', commentSchema);
var Author = mongoose.model('author', authorSchema);


module.exports.Post = Post;
module.exports.Comment = Comment;
module.exports.Author = Author;
