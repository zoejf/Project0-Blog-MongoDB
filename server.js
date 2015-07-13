// require express framework, mongoose, and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require("underscore");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/microblog');

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

//connect to postModel
var Post = require('./models/postModel');

// get js and css files from public folder
app.use(express.static(__dirname + '/public'));

//STATIC ROUTES

	//root route to display main html page
	app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/views/index.html');
	});

	//route to display all 'posts' data - in JSON 
	// app.get('/posts', function (req, res) {
	// 	res.json(posts);
	// });
	//route to display data for one post - in JSON
	// app.get('/posts/:id', function (req, res) {
	// 	var targetId = parseInt(req.params.id);
	// 	var foundPost = _.findWhere(posts, {id: targetId});
	// 	console.log(foundPost);
	// 	res.json(foundPost);
	// });

//MONGO DB ROUTES
	//respond to $.get request from client
	//get all phrases from database using .find function
	app.get('/api/posts', function (req, res) {
		Post.find(function (err, posts) {
		res.json(posts);
		});
	});

	//respond to $.post request from client
	//create a new post with info from form
	app.post('/api/posts', function (req, res) {
		newNote = new Post ({
			title: req.body.title,
			content: req.body.content
		});
		newNote.save(function (err, savedNote) {
			res.json(savedNote);
		});
	});

	//get one post by the specific id 
	app.get('/api/posts/:id', function (req, res) {

		//set the value of the id
		var targetId = req.params.id;
		console.log("targetId: " + targetId);
		//find correct post in the db by id
		Post.findOne({_id: targetId}, function (err, foundNote) {
			res.json(foundNote);
		});
	});

	//

//API ROUTES

	//respond to $.ajax put request to edit existing note
	app.put('/api/posts/:id', function (req, res) {
		// set the value of the id
		var targetId = parseInt(req.params.id);

		// find item in `posts` array matching the id and set variable
		var foundPost = _.findWhere(posts, {id: targetId});

		// update the note's title 
		foundPost.title = req.body.title;

		// update the note's content
		foundPost.content = req.body.content;

		console.log(foundPost);
		// send back edited object
		res.json(foundPost);
	});

	//respond to $.ajax delete request to delete a specific note
	app.delete('/api/posts/:id', function (req, res) {
	  console.log(posts);
	  // set the value of the id and find it in 'posts' array
	  var targetId = parseInt(req.params.id);
	  console.log(targetId);
	  var foundPost = _.findWhere(posts, {id: targetId});
	  console.log('foundPost 1:' + foundPost);

	  // get the index value of the found post
	  var index = posts.indexOf(foundPost);
	  console.log("index: " + index);
	  
	  // remove the item at that index, only remove 1 item
	  posts.splice(index, 1);
	  console.log(posts);
	  
	  // send back deleted object
	  console.log('foundPost2: ' + foundPost);
	  res.json(foundPost);
	});


// listen on port 3000
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});