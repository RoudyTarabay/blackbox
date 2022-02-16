const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const { ValidationError } = require('express-validation');
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const password = "4SM8xVtLkZrf5vO7";
const connectionString = `mongodb+srv://roudy:4SM8xVtLkZrf5vO7@cluster0.f4x2o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

var usersRouter = require('./routes/users');
var videosRouter = require('./routes/videos');


app.listen(3001, () => {
    app.use('/auth', usersRouter);
    app.use('/videos', passport.authenticate('jwt', { session: false }), videosRouter);
    app.use(function (err, req, res, next) {
        if (err instanceof ValidationError) {
            return res.status(422).json(err)
        }
        return res.status(500).json(err)
    })
    console.log("listening on 3001")
});
