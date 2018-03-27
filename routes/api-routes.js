// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************
// Dependencies
// =============================================================
// Requiring our Todo model
var db = require("../models");
// Routes
// =============================================================
module.exports = function(app) {
  // GET route for user login
  app.post("/api/login/", function(req, res) {
   console.log(req.body);
   if (req.body.userEmail) {
      db.User.findOne({
        where: {
          user_email: req.body.userEmail
        }      
      })
      .then(function(dbUser) {
        if (dbUser != null) {
          console.log("findOne  w " + dbUser)
            // db.UserRecipe.findAll({})
            // .then(function(doUserRecipes) {
            //   res.json(doUserRecipes);
            // })

            res.json(dbUser);
        } 
        else {
          db.User.create({
            user_email: req.body.userEmail
          })
          .then(function(dbUser) {
            console.log("created w " + dbUser);
            // Get the newly created user id and use it to get its recipes 
            // db.UserRecipe.findAll({})
            // .then(function(doUserRecipes) {
            //   res.json(doUserRecipes);
            // })
            res.json(dbUser);
          })
        }
      })
      .catch(function (err) {
      });
    }
  });

  // GET route for getting all of the recipes for the user
  app.get("/api/users/:userId/recipes", function(req, res) {
    console.log(req.body);
    console.log(req.params);
    console.log(req.params.userId);
    db.Recipe.findAll({
      where: {
        userId: req.params.userId
      }
    })
    .then(function(dbResult) {
      console.log(dbResult);
      res.json(dbResult);
    });

  });
  // Get route for returning a specific recipe for the user
  app.get("/api/users/:userId/recipes/:recipeId", function(req, res) {
    console.log(req.body);
    db.Recipe.findOne({
      where: {
        userId: req.params.fUserId,
        id: req.params.fRecipeId
      }
    })
    .then(function(dbResult) {
      res.json(dbResult);
    });

  });
  // POST route for saving a new user recipe
  app.post("/api/users/:id/recipes", function(req, res) {
    console.log(req.body);
    db.Recipe.create({
      userId: req.body.fUserId,
      UserId: req.body.fUserId,
      ingredient: req.body.fIngredient,
      artist: req.body.fArtist,
      spoonURL: req.body.fSpoonURL,
      spotifyURL: req.body.fSpotifyURL
    })
      .then(function(dbResult) {
        res.json(dbResult);
      });
  });
  // DELETE route for deleting recipe
  app.delete("/api/users/:userId/recipes/:recipeId", function(req, res) {
    console.log(req.body);
    console.log(req.params);
    // console.log(req.params.userId);
    db.Recipe.destroy({
      where: {
        userId: req.params.userId,
        id: req.params.recipeId
      }

    })
      .then(function(dbResult) {
        res.json(dbResult);
      });
  });
  // PUT route for updating a recipe
  app.put("/api/users/:userId/recipes/:recipeId", function(req, res) {
    db.Recipe.update({
        ingredient: req.body.fIngredient,
        artist: req.body.fArtist,
        spoonURL: req.body.fSpoonURL,
        spotifyURL: req.body.fSpotifyURL
      },
      {
        where: {
          userId: req.body.fUserId,
          id: req.body.fRecipeId
        }
      })
      .then(function(dbResult) {
        res.json(dbResult);
      });
  });
};