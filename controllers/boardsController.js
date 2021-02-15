const Board = require('../models').Board;
const Item = require('../models').Item;
const User = require('../models').User;

exports.createBoard = async (req, res, next) => {
  try {
    const board = await Board.create(
      {
        name: req.body.board.name,
        userId: req.user.id,
        items: req.body.items,
      },
      {
        include: [Item],
      }
    );

    delete board.dataValues.id;
    delete board.dataValues.userId;
    res.status(201).json({
      status: 'success',
      board,
    });
  } catch (err) {
    next(err);
  }
};
