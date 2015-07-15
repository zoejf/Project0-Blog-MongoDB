var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PostSchema = new Schema ({
	title: {type: String, default: ""}, 
	content: {type: String, default: ""},
	author: [{
		type: Schema.Types.ObjectId,  //referencing the author
		ref: "Author"
	}], 
	comments: [{
		type: Schema.Types.ObjectId,  //referencing the comments
		ref: "Comment"
	}]  
});


var CommentSchema = newSchema ({
	text: {
		type: String,
		default: ""
	}
});

var AuthorSchema = new Schema ({
	name: {
		type: String, 
		default: ""
	}
});

var Post = mongoose.model('post', PostSchema);
var Comment = mongoose.model('comment', CommentSchema);
var Author = mongoose.model('author', AuthorSchema);


module.exports.Post = Post;
module.exports.Comment = Comment;
module.exports.Author = Author;
