const Board = require('../models').board;
const Item = require('../models').item;
const User = require('../models').user;
const Note = require('../models').note;

exports.getBoards = async (req, res, next) => {
  try {
    const boards = await req.user.getBoards();
    res.status(200).json({
      status: 'success',
      boards,
    });
  } catch (err) {
    next(err);
  }
};

exports.getBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      where: { name: req.params.boardName, userId: req.user.id },
      attributes: ['name'],
    });

    if (board) {
      res.status(200).json({
        status: 'success',
        board,
      });
    } else {
      res.status(404).json({
        status: 'fail',
        msg: 'No Board Found',
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.createBoard = async (req, res, next) => {
  try {
    let board;
    if (req.body.items) {
      const ItemAssociation = Board.hasMany(Item);
      const NoteAssociation = Item.hasMany(Note);
      board = await Board.create(
        {
          name: req.body.board.name,
          userId: req.user.id,
          items: req.body.items,
        },
        {
          include: [
            {
              association: ItemAssociation,
              attributes: { exclude: ['id', 'boardId'] },
              include: {
                association: NoteAssociation,
                attributes: { exclude: ['id', 'itemId', 'userId'] },
              },
            },
          ],
        }
      );
    } else {
      board = await Board.create({
        name: req.body.board.name,
        userId: req.user.id,
      });
    }

    delete board.dataValues.id;
    delete board.dataValues.userId;
    //   if (board.item)
    //     for (let i = 0; i < board.items.length; i++) {
    //       delete board.items[i].dataValues.id;
    //       delete board.items[i].dataValues.boardId;
    //     }
    res.status(201).json({
      status: 'success',
      board,
    });
  } catch (err) {
    next(err);
  }
};
