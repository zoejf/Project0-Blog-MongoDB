var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PostsSchema = new Schema ({
	title: String, 
	content: String
});

var Post = mongoose.model('post', PostsSchema);

module.exports = Post;