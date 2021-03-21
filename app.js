require('dotenv').config();
const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./config/passport.js');

const authRouter = require('./routes/auth');
const boardRouter = require('./routes/board');
const itemRouter = require('./routes/item');
const noteRouter = require('./routes/note');
const GlobalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use(
  '/boards',
  passport.authenticate('jwt', { session: false }),
  boardRouter
);
app.use('/items', passport.authenticate('jwt', { session: false }), itemRouter);
app.use('/notes', passport.authenticate('jwt', { session: false }), noteRouter);
app.use(GlobalErrorHandler);

module.exports = app;
