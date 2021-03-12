'use strict';
const { Model, Op } = require('sequelize');
const Note = require('./note').note;
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

      Item.hasMany(models.note, {
        foreignKey: 'itemId',
        as: 'notes',
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

  Item.addScope('defaultScope', {
    attributes: ['name', 'status', 'orderIndex', 'createdAt', 'updatedAt'],
    include: 'notes',
  });

  Item.prototype.getBoardWithItems = async function (status) {
    return this.getBoard({
      include: {
        model: Item,
        as: 'items',
        attributes: ['orderIndex'],
        where: {
          status: status,
        },
        order: [['orderIndex', 'DESC']],
        limit: 1,
      },
    });
  };

  Item.addHook('beforeCreate', async (item, options) => {
    if (options.parentRecord) return;
    let board;
    const statusOptions = ['Icebox', 'Not Started', 'In-Progress', 'Completed'];
    const endIndex = statusOptions.findIndex(status => status === item.status);
    const slicedOptions = statusOptions.slice(0, endIndex + 1).reverse();

    for (let i = 0; i < slicedOptions.length; i++) {
      if (board === undefined || board.items.length === 0) {
        board = await item.getBoardWithItems(slicedOptions[i]);
      }
    }

    item.orderIndex =
      board.items.length > 0 ? board.items[0].dataValues.orderIndex + 1 : 0;

    const items = await board.getItems({
      where: {
        orderIndex: {
          [Op.gte]: item.orderIndex,
        },
      },
      attributes: ['id', 'orderIndex'],
    });

    for (let i = 0; i < items.length; i++) {
      const laterItem = items[i];
      laterItem.update({ orderIndex: laterItem.orderIndex + 1 });
    }
  });

  return Item;
};
