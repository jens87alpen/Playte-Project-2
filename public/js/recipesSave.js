$(document).ready(function() {
  /* global moment */
  // blogContainer holds all of our recipes
  var blogContainer = $(".recipe-container");
  var ingredient = $("#ingredient");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handlePostDelete);
  $(document).on("click", "button.edit", handlePostEdit);
  ingredient.on("change", handleCategoryChange);
  var recipes;
  // This function grabs recipes from the database and updates the view
  function getRecipes(category) {
    var categoryString = category || "";
    if (categoryString) {
      categoryString = "/category/" + categoryString;
    }
    $.get("/api/recipes" + categoryString, function(data) {
      console.log("recipes", data);
      recipes = data;
      if (!recipes || !recipes.length) {
        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }
  // This function does an API call to delete recipes
  function deletePost(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/recipes/" + id
    })
      .then(function() {
        getRecipes(ingredient.val());
      });
  }
  // Getting the initial list of recipes
  getRecipes();
  // InitializeRows handles appending all of our constructed post HTML inside
  // blogContainer
  function initializeRows() {
    blogContainer.empty();
    var recipesToAdd = [];
    for (var i = 0; i < recipes.length; i++) {
      recipesToAdd.push(createNewRow(recipes[i]));
    }
    blogContainer.append(recipesToAdd);
  }
  // This function constructs a post's HTML
  function createNewRow(post) {
    var newPostPanel = $("<div>");
    newPostPanel.addClass("panel panel-default");
    var newPostPanelHeading = $("<div>");
    newPostPanelHeading.addClass("panel-heading");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-default");
    var newPostTitle = $("<h2>");
    var newPostDate = $("<small>");
    var newPostCategory = $("<h5>");
    newPostCategory.text(post.category);
    newPostCategory.css({
      float: "right",
      "font-weight": "700",
      "margin-top":
      "-15px"
    });
    var newPostPanelBody = $("<div>");
    newPostPanelBody.addClass("panel-body");
    var newPostBody = $("<p>");
    newPostTitle.text(post.title + " ");
    newPostBody.text(post.body);
    var formattedDate = new Date(post.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    newPostDate.text(formattedDate);
    newPostTitle.append(newPostDate);
    newPostPanelHeading.append(deleteBtn);
    newPostPanelHeading.append(editBtn);
    newPostPanelHeading.append(newPostTitle);
    newPostPanelHeading.append(newPostCategory);
    newPostPanelBody.append(newPostBody);
    newPostPanel.append(newPostPanelHeading);
    newPostPanel.append(newPostPanelBody);
    newPostPanel.data("post", post);
    return newPostPanel;
  }
  // This function figures out which post we want to delete and then calls
  // deletePost
  function handlePostDelete() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    deletePost(currentPost.id);
  }
  // This function figures out which post we want to edit and takes it to the
  // Appropriate url
  function handlePostEdit() {
    var currentPost = $(this)
      .parent()
      .parent()
      .data("post");
    window.location.href = "/cms?post_id=" + currentPost.id;
  }
  // This function displays a messgae when there are no recipes
  function displayEmpty() {
    blogContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    // messageh2.html("No recipes yet for this category, navigate <a href='/cms'>here</a> in order to create a new post.");
    blogContainer.append(messageh2);
  }
  // This function handles reloading new recipes when the category changes
  function handleCategoryChange() {
    var newPostCategory = $(this).val();
    getRecipes(newPostCategory);
  }
});