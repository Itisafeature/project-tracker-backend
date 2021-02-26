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
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'item',
    }
  );

  Item.prototype.getBoardWithItems = async function () {
    return this.getBoard({
      include: {
        model: Item,
        as: 'items',
        attributes: ['orderIndex'],
        where: {
          status: this.status,
        },
        order: [['orderIndex', 'DESC']],
        limit: 1,
      },
    });
  };

  // Item.addScope('getBoardWithItems', {
  //   include: {
  //     model: Board
  //   }
  //   attributes: {
  //     exclude: ['id', 'userId'],
  //   },
  // });

  Item.addHook('beforeCreate', async (item, options) => {
    // const board = await item.getBoard({
    //   include: {
    //     model: Item,
    //     as: 'items',
    //     attributes: ['orderIndex'],
    //     where: {
    //       status: item.status,
    //     },
    //     order: [['orderIndex', 'DESC']],
    //     limit: 1,
    //   },
    // });

    const board = await item.getBoardWithItems();
    console.log(board);

    let previousStatus = item.status;
    // while (!board.items[0] || prevStatus === 'Icebox') {
    //   prevStatus =
    //     item.status === 'Completed'
    //       ? 'In-Progress'
    //       : item.status === 'In-Progress'
    //       ? 'Not Started'
    //       : item.status === 'Not Started'
    //       ? 'Icebox'
    //       : null;
    // }
  });

  // Item.addScope('defaultScope', {
  //   attributes: {
  //     exclude: ['id', 'boardId'],
  //   },
  // });

  return Item;
};
