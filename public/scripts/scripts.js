$(function() {

 //form to create a new post
 var $newPostForm = $("#new_post_form"); 
 
 // underscore function to compile the html template
 var postingTemplate = _.template($('#post-template').html());

 //element to hold all of the posts
 var $postsSection = $("#posts-section");

//DECLARING FUNCTIONS

   //render any post to the html page
   function render(noteHtml) {
      var $note = $(postingTemplate(noteHtml));
      $postsSection.append($note)
    }

     //render all existing posts to the page
   function all() {
     // send GET request to server to get all notes in 'posts' array
     $.get('/api/posts', function(data) {
       var allNotes = data;
       
       // iterate through each note
       _.each(allNotes, function(note) {
         render(note);
       });
     });
   };

   //create new post and render to the page 
   function create (post_title, post_content) {
      var postData = {title: post_title, content: post_content};
      
      // send POST request to server to create new note on API 
     $.post('/api/posts', postData, function(data) {
        var newPost = data;
        render(newPost);
      });
   }

    //edit an existing post
    function update (noteId, updatedTitle, updatedContent) {
        // send PUT request to server to update note
        $.ajax({
          type: 'PUT',
          url: '/api/posts/' + noteId,
          data: {
            title: updatedTitle,
            content: updatedContent
          },
          success: function(data) {
            var updatedNote = data;

            // replace existing note in view with new note 
            var $noteHtml = $(postingTemplate(updatedNote));
            $('#note-' + noteId).replaceWith($noteHtml);
          }
        });
    };

    //delete a specific post
    function remove (noteId) {
      $.ajax({
              type: 'DELETE',
              url: '/api/posts/' + noteId,
              success: function(data) {
                console.log("data: " + data);
                console.log("note id: " + noteId);
                $('#note-' + noteId).remove();
              }
            });
    };
    //END OF DECLARING FUNCTIONS

  //call 'all' function upon page load
  all();


  // listen for the click on the 'Post a Note' button
  $("#newNoteButton").on('click', function() { 
    // show form to post a new note
    $(".form-section").toggleClass("display"); 
    $('#postTitle').focus();
  }); 


  //listen for a click on the submit button
  $newPostForm.on('submit', function(event) {
     event.preventDefault();

    // create new note object from form data and render to the page
    var noteName = $('#postTitle').val();
    var noteContent = $('#postContent').val();
    create(noteName, noteContent);


    // reset the form
    $newPostForm[0].reset();
    $('#postTitle').focus();

    //Form disappears from view
    $(".form-section").toggleClass("display"); 

    //if welcome message was showing, hide it

    // $(".welcome").addClass("display");

  });

  //listen for a submit of an 'edit note' form
  $postsSection.on('submit', '.update-note', function(event) {
      event.preventDefault();
      
      // find the note's id (stored in HTML as `data-id`)
      var noteId = $(this).closest('.note').attr('data-id');
      
      // udpate the note with form data
      var updatedTitle = $(this).find('.updated-title').val();
      var updatedContent = $(this).find('.updated-content').val();
      console.log("updated Title: " + updatedTitle + "updated Content: " + updatedContent);
      update(noteId, updatedTitle, updatedContent);
    })

  //listen for a click on a 'delete note' button
  $postsSection.on('click', '.delete-note',  function(event) {

            // find the note's id (stored in HTML as `data-id`)
            var noteId = $(this).closest('.postBox').attr('data-id');
            console.log(this);
            console.log($(this).closest('.postBox'));
            
            console.log("noteId (client-side): " + noteId)
            
            // delete the note
            remove(noteId);
          });

// end of page
});