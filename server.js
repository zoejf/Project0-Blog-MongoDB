// require express framework, mongoose, and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require("underscore");

//require mongoose and connect to our database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/microblog');

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

//connect to models for posts, comments, authors
var db = require('./models/models');


// get js and css files from public folder
app.use(express.static(__dirname + '/public'));

//STATIC ROUTES

	//root route to display main html page
	app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/views/index.html');
	});

//MONGO DB ROUTES -- Relationship Refactoring
	//respond to $.get request from client
	//get all phrases from database using .find function
	app.get('/api/posts', function (req, res) {
		db.Post.find(function (err, posts) {
			if(err) {
				console.log("error: ", err);
				res.status(500).send(err);
			} else {
				console.log(posts);
				res.json(posts);
			}; 
		});
	});

	//old MONGO DB ROUTE
	// app.get('/api/posts', function (req, res) {
	// 	Post.find({}, function (err, posts) {
	// 		if(err) {
	// 			console.log("error: ", err);
	// 			res.status(500).send(err);
	// 		} else {
	// 			res.json(posts);
	// 		};
	// 	});
	// });

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
		//find correct post in the db by id
		Post.findOne({_id: targetId}, function (err, foundNote) {
			if (err) {
				console.log("error: ", err);
				res.status(500).send(err);
			} else {
				res.json(foundNote);
			}
		});
	});

	//respond to $.put request from client
	//update a post document in db
	app.put('/api/posts/:id', function (req, res) {
		//set the value of the desired id
		var targetId = req.params.id;
		//find correct post in the db by the id
		Post.findOne({_id: targetId}, function (err, foundPost) {
			//update the post's title and content
			foundPost.title = req.body.title,
			foundPost.content = req.body.content;

			foundPost.save (function (err, savedPost) {
				if (err) {
					console.log("error: ", err);
					res.status(500).send(err);
				} else {
					res.json(savedPost);
				};
			});
		});
	});

	//respond to $.delete request from client
	//delete a post document from the db
	app.delete('/api/posts/:id', function (req, res) {
		//set the value of the desired id
		var targetId = req.params.id;
		//find the correct post in the db and remove it
		Post.findOneAndRemove({_id: targetId}, function (err, deletedPost) {
			res.json(deletedPost);
		});
	});


// listen on port 3000
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});