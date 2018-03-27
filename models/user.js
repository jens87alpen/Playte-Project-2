module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  }, {});
  User.associate = function(models) {
      //establishes association with recipe model
      //on delete, causes rows that are associated to delete as well.
      User.hasMany(models.Recipe, {onDelete: "cascade"});
  };
  return User;
};
// User.hasMany(Recipe, {as: 'Recipes'});
