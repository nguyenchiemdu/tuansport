var route = require('./routes/index');
var path = require('path');
let express = require('express');
const database = require('./database/mongodb');
var bodyParser = require('body-parser')
const { baseRespond } = require('./common/functions')
let port = process.env.PORT || 3000;

let app = express();
// Connect to DB
database.connect();
// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// static path setup
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port);
//Router
route(app);
// error handler
app.use(function (err, req, res, next) {
    console.log(err)
    res.json(baseRespond(false, err))
})
console.log('RESTful API server started on: http://localhost:' + port);
