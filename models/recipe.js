module.exports = function(sequelize, DataTypes) {
  var Recipe = sequelize.define("Recipe", {
    ingredient: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    spoonURL: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});
  // Recipe.associate = function(models) {
  //     Recipe.belongsTo(models.User, {
  //         //sets up a userId column that is used to associate the tables
  //         foreignKey: {
  //             //does not allow it to be null
  //             allowNull : false
  //         }
  //     })
  // };
  return Recipe;
};