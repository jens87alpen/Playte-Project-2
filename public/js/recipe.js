$(document).ready(function() {
  // Gets an optional query string from our url (i.e. ?recipeId=23)
  var url = window.location.search;
  var userId;
  // In localhost:8080/reciper?userId=1&recipeId=12, recipeId is 12
  // it asumes there is no recipe Id
  if (url.indexOf("?userId=") !== -1) {
    userId = url.split("=")[1];
  };
  //Change the href attribute
  $("#recipeList").attr("href", "/recipes?userId=" + userId);

  var recipeId;
  // Sets a flag for whether or not we're updating a recipe to be false initially
  var updating = false;
  // If we have this section in our url, we pull out the recipe id from the url
  // In localhost:8080/reciper?userId=1&recipeId=12, recipeId is 12
  if (url.indexOf("&recipeId=") !== -1) {
    recipeId = url.split("=")[1];
    getRecipeData(recipeId);
  }
  // Getting jQuery references to the recipe body, title, form, and category select
  var recipeForm = $("#recipe");
  var ingredientInput = $("#fIngredient");
  var spoonURLInput = $("#fSpoonURL");
  // Giving the spoonURLInput a default value
  spoonURLInput.val("");
  // Adding an event listener for when the form is submitted
  $(".getRecipe").on("click", function handleFormSubmit(event) {
    event.preventDefault();
    // https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?type=main+course&number=1&query=apple
    $.ajax({
      url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?type=main+course&number=1&query=" + ingredientInput.val(),
      headers: {
          "X-Mashape-Key": "0MkIQWGgjvmshwf338iKZi1IbGyjp10JZebjsn4CO7mQpBAsiB",
          "X-Mashape-Host": "spoonacular-recipe-food-nutrition-v1.p.mashape.com"
      },
      method: 'GET',
      dataType: 'json',
      success: function(data){
        if (data && data.results != null) {
          // If this recipe exists, prefill our recipe forms with its data
          var spoonId = data.results[0].id;
          if (spoonId == null) {
            alert("cannot find any recipe");
          } 
          else {
            getSpoonURL(spoonId);
          }
        }
      }
    }) 
 });
 
   
  function getSpoonURL(spoonId) {
    $.ajax({
      url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + spoonId + "/information",
      headers: {
          "X-Mashape-Key": "0MkIQWGgjvmshwf338iKZi1IbGyjp10JZebjsn4CO7mQpBAsiB",
          "X-Mashape-Host": "spoonacular-recipe-food-nutrition-v1.p.mashape.com"
      },
      method: 'GET',
      dataType: 'json',
      success: function(data){
        if (data) {
                  var sourceURL = data.sourceUrl;
                  if (sourceURL == null) {
                    alert("cannot find any recipe URL");
                  } else {
                    spoonURLInput.val(sourceURL);
                     spoonURLInput.attr("href", sourceURL);
                     spoonURLInput.text(sourceURL);
                      $("iframe#frame").show();
                     $("iframe#frame").attr('src',sourceURL);
                     $("button.submit").show();
                     $("button.getRecipe").hide();
                  }
        } 
        else {
                    alert("cannot find any recipe URL");
        }
      }
      
    }) 
  }
  $(recipeForm).on("submit", function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the recipe if we are missing an ingredent or an artist
    if (!ingredientInput.val().trim() ) {
      alert("ingredents cant't be blank");
      return;
    }
    // Constructing a newRecipe object to hand to the database
    var newRecipe = {
      fUserId: userId,
      fIngredient: ingredientInput.val().trim(),
      fSpoonURL: spoonURLInput.val().trim()
    };
    console.log(newRecipe);
    // If we're updating a recipe run updateRecipe to update a recipe
    // Otherwise run submitRecipe to create a whole new recipe
    if (updating) {
      newRecipe.fRecipeId = recipeId;
      updateRecipe(newRecipe);
    }
    else {
      submitRecipe(newRecipe);
    }
  });
  // Submits a new new recipe and brings user to recipes page upon completion
  function submitRecipe(recipe) {
    $.post("/api/users/" + userId + "/recipes", recipe, function() {
      window.location.href = "/recipes?userId=" + userId;
    });
  }
  // Gets recipe data for a user if we're editing
  function getRecipeData(userId, recipeId) {
    $.get("/api/users/" + userId + "/recipes/" + recipeId, function(data) {
      if (data) {
        // If this recipe exists, prefill our recipe forms with its data
        ingredientInput.val(data.ingredient);
        spoonURLInput.val(data.spoonURL);

        // If we have a recipe with this id, set a flag for us to know to update the recipe
        // when we hit submit
        updating = true;
      }
    });
  }
  // Update a given recipe, bring user to the recipes page when done
  function updateRecipe(recipe) {
    $.ajax({
      method: "PUT",
      url: "/api/users/" + recipe.fUserId + "/recipes/" + recipe.fRecipeId,
      data: recipe
    })
      .then(function() {
        window.location.href = "/recipes";
      });
  }
});

