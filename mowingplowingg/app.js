var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var providerRouter = require('./routes/provider');
var adminRouter    = require('./routes/admin');



var app = express();


app.use(cors());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, '/')));




//  app.get('/mowingplowing/',function(req,res){
//     return res.json('ok');
// })

app.use('/mowingplowing', indexRouter);
app.use('/mowingplowing/users', usersRouter);
app.use('/mowingplowing/provider',providerRouter);
app.use('/mowingplowing/admin',adminRouter);





// app.all("*", (req, res) => {
//   res.sendFile(path.join(__dirname,'..','index.html'));
// });


app.listen(3008,function(){
    console.log('server workinggggggggggg..')
})

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
