var express = require('express');
const User = require('../models').User;
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST signup */
router.post('/signup', async (req, res, next) => {
  try {
    const user = User.create(req.params);
    res.send('created');
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
