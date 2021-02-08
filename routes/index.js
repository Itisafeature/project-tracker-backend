var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST signup */
// router.post('/signup', async (req, res, next) => {
//   try {
//     const user = await User.create(req.params);
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json(data.errors);
//   }
// });

module.exports = router;
