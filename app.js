var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var OSWrap = require('openstack-wrapper');
var keystone = new OSWrap.Keystone('http://192.168.1.51:5000/v3');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

keystone.getToken('admin', 'a10ac0db07954235', function(error, token){
  if(error)
  {
    console.log('an error occured', error);
  }
  else
  {
    console.log('A general token object has been retrived', token);
    global.token1=token.token;
    console.log(token1);

    keystone.listProjects('admin', token1, function(error, projects_array){
  if(error)
  {
    console.log('an error occured', error);
  }
  else
  {
    console.log('A list of projects was retrived', projects_array);
    //projects_array[n].id is required for many other calls and to generate a project specific token
  }
});
    
    //the token value (token.token) is required for project listing & getting project specific tokens
  }
});



module.exports = app;
