var route = require('./routes/index');
var path = require('path');
let express = require('express');
const database = require('./database/mongodb');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');

const { baseRespond } = require('./common/functions')
var methodOverride = require('method-override')
const authMiddlewares = require("./middlewares/auth.middlewares");
let port = process.env.PORT || 3000;
let KiotVietToken = require('./common/kiotviet_token');
const AppString = require('./common/app_string');
let app = express();
// Connect to DB
database.connect();
// Get KiotvietToken
KiotVietToken.getAccessToken()
// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// static path setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));


app.listen(port);
// Authentication
app.use(authMiddlewares.authenticateUser)
//Router
route(app);
// error handler
app.get('*', function(req , res,next) {
    res.status(404)
    next(AppString.pageNotFound)
  })
app.use(function (err, req, res, next) {
    res.render('error/error', {user: req.headers.userInfor,err,statusCode: res.statusCode})
    next(err)
})
console.log('RESTful API server started on: http://localhost:' + port);
