const http = require('http');
// const debug = require('debug')('rocketpower:server');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
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
    res.render('error');
});


/* ------ Launch Server ------ */

(() => {
    const envStatus = app.get('env').charAt(0).toUpperCase() + app.get('env').slice(1);

    process.stdout.write('\x1bc'); // Clear console
    console.log('\x1b[48;5;4m\x1b[30m%s\x1b[0m\x1b[38;5;4m%s\x1b[0m\x1b[38;5;4m\x1b[2m%s\x1b[0m',
        ' DONE ',
        ' Rocket Power | ',
        envStatus); // Uses ANSI color codes
    http.createServer(app).listen(process.env.PORT, () => {
        console.log('\n  ∴ API running at:  http://localhost:\x1b[38;5;4m%s\x1b[0m', process.env.PORT);
        console.log(' ___________________________________________\n');
    });
})();


module.exports = app;
