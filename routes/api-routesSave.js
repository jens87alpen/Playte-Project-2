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
            db.UserRecipe.findAll({})
            .then(function(doUserRecipes) {
              res.json(doUserRecipes);
            })
        } 
        else {
          db.User.create({
            user_email: req.body.userEmail
          })
          .then(function(dbUser) {
            console.log("created w " + dbUser);
            // Get the newly created user id and use it to get its recipes 
            db.UserRecipe.findAll({})
            .then(function(doUserRecipes) {
              res.json(doUserRecipes);
            })
            // res.json(dbUser);
          })
        }
      })
      .catch(function (err) {
      });
    }
  });

  // GET route for getting all of the posts
  app.get("/api/posts/", function(req, res) {
    db.Post.findAll({})
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });
  // Get route for returning posts of a specific category
  app.get("/api/posts/category/:category", function(req, res) {
    db.Post.findAll({
      where: {
        category: req.params.category
      }
    })
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });
  // Get rotue for retrieving a single post
  app.get("/api/posts/:id", function(req, res) {
    db.Post.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });
  // POST route for saving a new post
  app.post("/api/posts", function(req, res) {
    console.log(req.body);
    db.Post.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body.category
    })
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });
  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });
  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    db.Post.update(req.body,
      {
        where: {
          id: req.body.id
        }
      })
      .then(function(dbPost) {
        res.json(dbPost);
      });
  });
};