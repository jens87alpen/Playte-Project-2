$(document).ready(function() {
  // Gets an optional query string from our url (i.e. ?post_id=23)
  var url = window.location.search;
   var userEmailInput = $("#userEmail");
   var loginForm = $("#login");
  
  // Adding an event listener for when the form is submitted
  $(loginForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body or a title
    if (!userEmailInput.val().trim()) {
      alert("Email Input can not be empty");
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {
      userEmail: userEmailInput.val().trim(),
    };
    console.log(newPost);
    submitPost(newPost);
  });
  // Submits a new post and brings user to blog page upon completion
  function submitPost(Post) {
    $.post("/api/login/", Post, function(data) {
      if (data) {

        // window.location.href = "/users/" + data.id + "/recipes";
        window.location.href = "/recipe?userId=" + data.id ;


      }
    });
  }

});