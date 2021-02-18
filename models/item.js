'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.belongsTo(models.board, {
        foreignKey: 'boardId',
        onDelete: 'CASCADE',
      });
    }
  }
  Item.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      notes: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Icebox', 'Not Started', 'In-Progress', 'Completed'],
        validate: {
          notNull: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'item',
    }
  );

  Item.addScope('defaultScope', {
    attributes: {
      exclude: ['id', 'boardId'],
    },
  });

  return Item;
};
