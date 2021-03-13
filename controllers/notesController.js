const Note = require('../models').note;

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
