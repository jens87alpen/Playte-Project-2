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

};