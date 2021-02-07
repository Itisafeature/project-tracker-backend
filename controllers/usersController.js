const User = require('../models').User;

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.params);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(data.errors);
  }
};
