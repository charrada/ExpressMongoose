var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
const userModel = require('./Models/userModel')
require("dotenv").config();
const mongoose = require('mongoose')
const db = require('./db.json')

var contactsRouteurs = require('./routes/contacts');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { error } = require('console');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.URL_MONGO || db.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => { console.log('connect to BD'); }
).catch(
    (error) => { console.log(error.message); }
);


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contacts', contactsRouteurs)


app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json(err.message);
});

const server = http.createServer(app);
server.listen(4000, () => { console.log("app is runnig on port 5000") });