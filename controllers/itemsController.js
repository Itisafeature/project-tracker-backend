const Board = require('../models').board;
const Item = require('../models').item;
const User = require('../models').user;
const Note = require('../models').note;

const { Op } = require('sequelize');

// TEST ROUTE
// exports.getItem = async (req, res, next) => {
//   try {
//     const NoteAssociation = Item.hasMany(Note);
//     const item = await Item.findOne({
//       where: { id: req.params.id },
//     });

//     res.status(200).json({
//       item,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

exports.updatePositions = async (req, res, next) => {
  console.log(req.body);
  try {
    const board = await Board.findOne({
      where: { name: req.body.boardName, userId: req.user.id },
      attributes: ['id'],
    });
    const { items } = req.body;

    for (let i = 0; i < items.length; i++) {
      const item = await Item.findOne({
        where: {
          name: items[i].name,
          boardId: board.id,
        },
      });
      await item.update({
        status: items[i].status,
        orderIndex: items[i].orderIndex,
      });
    }

    res.status(200).json({
      status: 'success',
    });
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
