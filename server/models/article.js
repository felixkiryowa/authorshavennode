'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    slug: DataTypes.STRING,
    body: DataTypes.TEXT,
    author: DataTypes.STRING,
    image: DataTypes.STRING
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
    Article.belongsTo(models.User, {
      foreignKey:'author',
      onDelete: 'CASCADE',
    });
  };
  return Article;
};
