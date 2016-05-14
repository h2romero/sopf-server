var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Create the application
var app = express();

// Add Auth0
var jwt = require('express-jwt');
var cors = require('cors');

// Add Middleware necessary for REST API's - Intercept itself into the request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// Add Auth0
app.use(cors());

var authCheck = jwt({
    secret: new Buffer('Z5PvnaRqjKBr3JudkhnXHAq4t_GbLBXE6thziX87Wk9w_v6-hX2hycZ72aabmq3D','base64'),
    audience: 'Vd2v0braxVQxH0lASGPNci2LlthA8fgn'
})

app.get('/api/public', function(req,res){
    res.json({ message: "Hello from the PUBLIC endpoint! You don't need to be authenticated"});
});
app.get('/api/private', authCheck, function(req,res){
    res.json({ message: "Hello from the PRIVATE endpoint! You DO need to be authenticated"});
});

// CORS Support (Non-Auth0)
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
