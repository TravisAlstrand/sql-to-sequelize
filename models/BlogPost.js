const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class BlogPost extends Model {}

  BlogPost.init(
    {
      title: {
        type: DataTypes.STRING,
      },
      body: {
        type: DataTypes.TEXT,
      },
    },
    { sequelize }
  );

  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, {
      as: "author",
      foreignKey: {
        fieldName: "userId",
      },
    });
  };

  return BlogPost;
};
