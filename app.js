var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');

////////////
// Setup //
//////////

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

////////////
// Cache //
//////////

var mcache = require('memory-cache');
/**
 * Cache Middleware
 * @param minutes number : cache(5) => will save for 5 minutes
 */
var cache = (minutes) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      // return cached response and return
      res.send(cachedBody)
      return
    } else {
      // save in cache and next()
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, minutes * 60 * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}


/////////////
// Routes //
///////////

/**
 * PAGES ROUTES
 */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/number', cache(1), function(req, res, next) {
  let number = Math.floor(Math.random() * 100);
  res.render('number', { number: number });
});

/**
 * JSON/API ROUTES
 */
app.get('/json', cache(1), function(req, res, next) {
  let number = Math.floor(Math.random() * 100);
  let result = {'number': number};
  res.send(result);
});


/////////////
// ERRORS //
///////////

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

module.exports = app;
