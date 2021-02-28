const Board = require('../models').board;
const Item = require('../models').item;
const User = require('../models').user;
const { Op } = require('sequelize');

exports.updatePositions = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      where: { name: req.body.boardName, userId: req.user.id },
      attributes: ['id'],
    });

    const item = await Item.findOne({
      boardId: board.id,
      orderIndex: req.body.sourceIndex,
    });

    const itemsToUpdate = await board.getItems({
      where: {
        orderIndex: {
          [Op.gt]: req.body.sourceIndex,
          [Op.lte]: req.body.destinationIndex,
        },
      },
      attributes: ['id', 'orderIndex'],
    });
    console.log(item);
    await item.update({
      orderIndex: req.body.destinationIndex,
      status: req.body.destinationStatus,
    });

    for (let i = 0; i < itemsToUpdate.length; i++) {
      await itemsToUpdate[i].update({
        orderIndex: itemsToUpdate[i].orderIndex - 1,
      });
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
