require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./config/passport.js');

const indexRouter = require('./routes/index');
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

// app.use('/', indexRouter);

app.use('/', authRouter);
app.use('/boards', boardRouter);
app.use('/items', itemRouter);
app.use('/notes', noteRouter);
app.use(GlobalErrorHandler);

module.exports = app;
