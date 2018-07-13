### NodeJS Express Caching Application

Cache
> Cache in memory for Json responses
> Cache in files for pages

Tech
> Blade
> Javascript
> Nodemon (Watch the files and updates them while developing like Gulp)

Environment
> node v.8.9.1

Generate Express Project
> npm install -g express-generator
> express -c stylus project_name

Run the project
> npm install
> DEBUG=nodejs_caching:* npm start (Linux)
> set DEBUG=nodejs_caching:* & npm start (Win)
>   if it doesn't watch the files
>   DEBUG=nodejs_caching:* & nodemon npm start

Seperate to Route files
> new route-file
```script
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { 'args': args,... });
});

module.export = router;
```
> in app.js
```script
var index = require('../path-to-file');
app.use('/prefix-route or just "/" ',index)
```