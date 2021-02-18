'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Board.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });

      Board.hasMany(models.item, {
        foreignKey: 'boardId',
      });
    }
  }
  Board.init(
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'board',
    }
  );

  Board.addScope('defaultScope', {
    attributes: {
      exclude: ['id', 'userId'],
    },
  });
  return Board;
};
