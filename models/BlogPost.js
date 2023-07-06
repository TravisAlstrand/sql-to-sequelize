const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  class BlogPost extends Model { }

  BlogPost.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A blog title is required"
        },
        notEmpty: {
          msg: "Please provide a blog title"
        }
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A blog body is required"
        },
        notEmpty: {
          msg: "Please provide a blog body"
        }
      }
    }
  }, { sequelize });

  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, {
      as: 'author',
      foreignKey: {
        fieldName: 'userId',
      }
    });
  };

  return BlogPost;

};
