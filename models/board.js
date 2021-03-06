'use strict';
const { Model, QueryInterface } = require('sequelize');
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
        as: 'items',
      });
    }
  }
  Board.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          isAlphanumeric: {
            args: true,
            msg: 'Must use only AlphaNumeric characters for Board Name',
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
      },
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
    include: 'items',
  });

  Board.addHook('afterCreate', async (board, options) => {
    const order = {
      Icebox: 1,
      'Not Started': 2,
      'In-Progress': 3,
      Completed: 4,
    };

    if (!board.items) return;

    const sortedItems = board.items.sort((item1, item2) => {
      if (item1.status === item2.status) {
        return item1.id - item2.id;
      }
      return order[item1.status] - order[item2.status];
    });

    for (let i = 0; i < sortedItems.length; i++) {
      await sortedItems[i].update({ orderIndex: i });
    }
  });

  return Board;
};
