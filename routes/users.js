var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/new', (req, res, next) => {
  res.send('here');
});

module.exports = router;
