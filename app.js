var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var message = require('./routes/message');
var question = require('./routes/question');
var admin  = require('./routes/admin')
var client = require('./routes/client')

var globalConfig = require('./config/config');

var sendMail   = require('./utils/mail');

var cookieParser = require('cookie-parser');
var csrf = require('csurf');

var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })


// sendMail("157062357@qq.com","from nodejs","i want to more money");

global.globalConfig = globalConfig;
global.sendMail     = sendMail;


i18n = require("i18n");
// console.log(globalConfig.config)
i18n.configure({
  locales:['en', 'zh-CN'],
  directory: path.join(__dirname, globalConfig.config.langFile)
});

console.log(i18n.__('Welcome')); 
var app = express();

var sessionConfig = {
  secret: 'joyfort-session-config#$#$#!',
  rolling: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 * 480 }
}
app.use(session(sessionConfig))
app.use(cookieParser())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.configure(function() {


// app.use(globalConfig)
  // default: using 'accept-language' header to guess language settings
app.use(i18n.init);
// });
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use(function(req, res, next) {
  console.log("维护状态:"+globalConfig.config.maintain)
  if(globalConfig.config.maintain ) {
      // res.render("",{"send":"maintain"});
      var err = new Error('maintain');
      err.status = 200;
      next(err);
   } else {
      if(!req.session.username ) {
        console.log("username:"+req.session.username)
        // res.redirect("/admin/login")
        
      } else {
        console.log("logined:"+req.session.username)
        global.username = req.session.username
      }
    res.locals.req = req
    
    //  next
    next()
   }
  //  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/message', message);
app.use('/question',question);
app.use('/admin',admin);
app.use('/client',client);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('./error');
  // res.render(err.message)
});

module.exports = app;
