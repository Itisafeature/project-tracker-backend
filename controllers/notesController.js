const Note = require('../models').note;
const Board = require('../models').board;
const Item = require('../models').item;

export const getNotes = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      where: { name: req.query.boardName, userId: req.user.id },
      include: {
        model: Item,
        as: 'items',
        where: { name: req.params.itemName },
      },
    });
    const notes = await Note.findAll({
      where: { userId: req.user.id, itemId: board.items[0].id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      notes,
    });
  } catch (err) {
    console.log(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      content: req.body.note.content,
      userId: req.user.id,
      itemId: req.body.note.itemId,
    });

    res.status(201).json({
      status: 'success',
      note,
    });
  } catch (err) {
    console.log(err);
  }
};
