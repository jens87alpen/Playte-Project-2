$(document).ready(function() {
  var blogContainer = $(".recipe-container");
  var ingredient = $("#ingredient");

  function getRecipes(userId) {
    // from api-routes "/api/users/:id/recipes"
    $.get("/api/users/" + userId + "/recipes", function(data) {
      console.log("recipes", data);
      var recipes = data;
      if (!recipes || !recipes.length) {
        displayEmpty();
      }
      else {
        initializeRows(recipes);
      }
    });
  }
  // InitializeRows handles appending all of our constructed Recipe HTML inside
  // blogContainer
  function initializeRows(recipes) {
    blogContainer.empty();
    var recipesToAdd = [];
    for (var i = 0; i < recipes.length; i++) {
      recipesToAdd.push(createNewRow(recipes[i]));
    }
    blogContainer.append(recipesToAdd);
  }
  // This function does an API call to delete recipes
  // delete("/api/users/:userId/recipes/:recipeId"
  function deleteRecipe(recipe, currentRow) {
    $.ajax({
      method: "DELETE",
      url: "/api/users/" + recipe.UserId + "/recipes/" + recipe.id
    })
      .then(function() {
            currentRow.remove();
      });
  }
 
  // This function constructs a Recipe's HTML
  function createNewRow(recipe) {
    var newRecipePanel = $("<div>");
    newRecipePanel.addClass("panel panel-default");
    var newRecipePanelHeading = $("<div>");
    newRecipePanelHeading.addClass("panel-heading");

    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-default");

    var ingredientElement = $("<h4>");
    ingredientElement.text(recipe.ingredient + " ");

    var spoonURLElement = $("<a>");
    spoonURLElement.attr("href", recipe.spoonURL); 
    spoonURLElement.attr("target", "_blank");
    spoonURLElement.text(recipe.spoonURL);
    spoonURLElement.css({
      float: "left",
      "font-weight": "700",
      "margin-top":
      "-15px"
    });

    var newRecipePanelBody = $("<div>");
    newRecipePanelBody.addClass("panel-body");
 
    var newRecipeBody = $("<p>");
    newRecipeBody.text(recipe.artist);

    var formattedDate = new Date(recipe.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var dateElement = $("<small>");
    dateElement.text(formattedDate);
    // ingredient.append(artist);
    newRecipePanelHeading.append(deleteBtn);
    // newRecipePanelHeading.append(editBtn);
    newRecipePanelHeading.append(ingredientElement);
    newRecipePanel.append(newRecipePanelHeading);

    newRecipePanelBody.append(spoonURLElement);
    newRecipePanelBody.append(dateElement);

    newRecipePanel.append(newRecipePanelBody);
    // save recipe json in data which is hidden
    newRecipePanel.data("recipe", recipe);
    return newRecipePanel;
  }
  // This function figures out which recipe we want to delete and then calls
  // deleterecipe
  function handleRecipeDelete() {
    var currentRow = $(this);
    var currentRecipe = currentRow.parent().data("recipe");
    if (currentRecipe == undefined) {
     var currentRecipe = currentRow.parent().parent().data("recipe");     
    }
    deleteRecipe(currentRecipe,currentRow.parent().parent());
  }
  // This function figures out which Recipe we want to edit and takes it to the
  // Appropriate url
  function handleRecipeEdit() {
    var currentRecipe = $(this)
      .parent()
      .parent()
      .data("recipe");
    window.location.href = "/recipe?userId=" + data.userId + "&recipeId=" + recipe.id;
  }
  // This function displays a messgae when there are no recipes
  function displayEmpty() {
    blogContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    // messageh2.html("No recipes yet for this category, navigate <a href='/cms'>here</a> in order to create a new Recipe.");
    blogContainer.append(messageh2);
  }
  // This function handles reloading new recipes when the category changes
  // function handleCategoryChange() {
  //   var spoonURL = $(this).val();
  //   getRecipes(spoonURL);
  // }
   // Getting the initial list of recipes
  /* global moment */
  // blogContainer holds all of our recipes
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleRecipeDelete);
  $(document).on("click", "button.edit", handleRecipeEdit);

  // Here is the main logic after all functions are defined
  var url = window.location.search;
  var userId;
  if (url.indexOf("?userId=") !== -1) {
    userId = url.split("=")[1];
  };

  
  //Change the href attribute
  $("#newRecipeLink").attr("href", "/recipe?userId=" + userId);
  // ingredient.on("change", handleCategoryChange);
  // This function grabs recipes from the database and updates the view
  getRecipes(userId);
});