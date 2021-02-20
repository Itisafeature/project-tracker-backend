const Board = require('../models').board;
const Item = require('../models').item;
const User = require('../models').user;

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
