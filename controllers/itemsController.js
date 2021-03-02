const Board = require('../models').board;
const Item = require('../models').item;
const User = require('../models').user;
const { Op } = require('sequelize');

exports.updatePositions = async (req, res, next) => {
  console.log(req.body);
  try {
    const board = await Board.findOne({
      where: { name: req.body.boardName, userId: req.user.id },
      attributes: ['id'],
    });

    const item = await Item.findOne({
      where: {
        boardId: board.id,
        orderIndex: req.body.sourceItemOrderIndex,
      },
    });

    const endItem = await Item.findOne({
      where: {
        boardId: board.id,
        orderIndex: req.body.destinationItemOrderIndex,
      },
    });

    const endItemForIndex = Object.assign({}, endItem);

    // fix for inverse

    let itemsToUpdate;
    if (
      item.dataValues.orderIndex < endItem.dataValues.orderIndex &&
      item.dataValues.orderIndex - endItem.dataValues.orderIndex === -1
    ) {
      itemsToUpdate = await board.getItems({
        where: {
          orderIndex: {
            [Op.gt]: req.body.sourceItemOrderIndex,
            [Op.lte]: req.body.destinationItemOrderIndex,
          },
        },
        attributes: ['id', 'orderIndex'],
      });

      await item.update({
        orderIndex: endItemForIndex.dataValues.orderIndex,
        status: req.body.destinationStatus,
      });

      for (let i = 0; i < itemsToUpdate.length; i++) {
        await itemsToUpdate[i].update({
          orderIndex: itemsToUpdate[i].dataValues.orderIndex - 1,
        });
      }
    } else if (
      item.dataValues.orderIndex > endItem.dataValues.orderIndex &&
      item.dataValues.orderIndex - endItem.dataValues.orderIndex === 1
    ) {
      itemsToUpdate = await board.getItems({
        where: {
          orderIndex: {
            [Op.gte]: req.body.destinationItemOrderIndex,
            [Op.lt]: req.body.sourceItemOrderIndex,
          },
        },
        attributes: ['id', 'orderIndex'],
      });

      await item.update({
        orderIndex: endItemForIndex.dataValues.orderIndex,
        status: req.body.destinationStatus,
      });

      for (let i = 0; i < itemsToUpdate.length; i++) {
        await itemsToUpdate[i].update({
          orderIndex: itemsToUpdate[i].dataValues.orderIndex + 1,
        });
      }
    } else if (item.dataValues.orderIndex < endItem.dataValues.orderIndex) {
      itemsToUpdate = await board.getItems({
        where: {
          orderIndex: {
            [Op.gt]: req.body.sourceItemOrderIndex,
            [Op.lte]: req.body.destinationItemOrderIndex,
          },
        },
        attributes: ['id', 'orderIndex'],
      });

      console.log(req.body);

      await item.update({
        orderIndex: endItemForIndex.dataValues.orderIndex,
        status: req.body.destinationStatus,
      });

      for (let i = 0; i < itemsToUpdate.length; i++) {
        await itemsToUpdate[i].update({
          orderIndex: itemsToUpdate[i].dataValues.orderIndex - 1,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      where: { name: req.body.boardName, userId: req.user.id },
      attributes: { include: ['id'] },
    });

    const item = await Item.create({
      name: req.body.name,
      status: req.body.status,
      notes: req.body.notes,
      boardId: board.dataValues.id,
    });

    await board.addItem(item);
    await board.save();
    delete item.dataValues.boardId;
    delete item.dataValues.id;
    res.status(201).json({
      status: 'success',
      item,
    });
  } catch (err) {
    console.log(err);
  }
};
