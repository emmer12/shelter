var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs=require('express-handlebars')
var validator=require('express-validator');
var session=require('express-session');
var passport = require('passport');
let mongoose = require('mongoose');
var flash=require("connect-flash");
var Property=require('./modules/property');
var paginate=require('express-paginate');
const fs = require('fs');
var app = express();

var index = require('./routes/index');
var agent = require('./routes/agent');
var property = require('./routes/property');
var admin = require('./routes/admin');
var land = require('./routes/land');

fs.readdir('./public/uploads/images',function(err,file) {
  console.log(file.length);
})
// datab     ase connection
mongoose.connect("mongodb://localhost/shelter");
let db=mongoose.connection;
db.once('open',function(){
  console.log("connected");
});
db.on('error',function(err) {
     console.log(err);
});



// view engine setup
app.engine('.hbs',expressHbs({defaultLayout:'layout', extname:'.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser('this is my secret'));
app.use(session({
  secret:'this is my secret',
  saveUninitialized:true,
  resave:true
}))
app.use(require("connect-flash")());
app.use(paginate.middleware(2,10))
// passport middleware
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport-admin')
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next) {
  res.locals.login=req.isAuthenticated();
  res.locals.agent=req.user;
  next();
})

app.use("/",index);
app.use("/agent",agent);
app.use("/property",property);
app.use("/admin",admin);
app.use("/land",land);
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
  Property.find({})
  .limit(4)
  .sort({created_at:-1})
 .exec(function(errs,properties){
 if (err) {
   console.log(errs);
 }
  res.render('error',{properties:properties});
});
});

module.exports = app;
