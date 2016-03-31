var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Create the application
var app = express();

// Add Middleware necessary for REST API's - Intercept itself into the request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//app.use('/hello', function(req, res, next) {
//    res.send('Hello World!');
//    next();
//})


// Connect to MongoDB
if(env === 'development') {
    mongoose.connect('mongodb://localhost/finance');
} else {
    mongoose.connect('mongodb://hromero:hromerohromero@ds011810.mlab.com:11810/financedb');
}
mongoose.connection.once('open', function() {

// Load the models.
app.models = require('./models/index');

// Load the routes.
var routes = require('./routes');
_.each(routes, function(controller, route) {
    app.use(route, controller(app, route));
});

var port = process.env.PORT || 3000;
app.listen(port);
    console.log('Listening on port ' + port + ' ...');
});
