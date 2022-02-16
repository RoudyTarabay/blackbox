var express = require('express');
var client = require('../dbConnection');
var router = express.Router();
const { validate, ValidationError, Joi } = require('express-validation');
var bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const connectionString = `mongodb+srv://roudy:4SM8xVtLkZrf5vO7@cluster0.f4x2o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'pgeZA9BxcHUpJuVH',
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
const signupValidation = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    password_confirmation: Joi.ref('password')
  }),
}

const loginValidation = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
  }),
}
client.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log("Connected to Database");
    const db = client.db("blackbox")
    const usersCollection = db.collection("users");
    router.post("/login", validate(loginValidation, { keyByField: true }, {}), (req, res) => {
      usersCollection.findOne({ email: req.body.email }).then(function (record) {
        if (record)
          bcrypt.compare(req.body.password, record.password, function (err, isPasswordMatch) {
            if (isPasswordMatch) {
              const token = jwt.sign({ user: req.body.email }, 'pgeZA9BxcHUpJuVH');
              return res.status(200).json({ token });
            }
            else {
              return res.status(401).json({ details: [{ password: "Wrong Email or password" }] })
            }
          });
        else
          return res.status(401).json({ details: [{ password: "Wrong Email or password" }] })
      });
    });
    router.post("/signup", validate(signupValidation, { keyByField: true }, {}), (req, res) => {
      usersCollection.findOne({ email: req.body.email }).then(function (record) {
        if (!record)
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
              usersCollection.insertOne({ email: req.body.email, password: hash })
                .then(result => {
                  return res.status(200).json();
                })
                .then(console.error);
            });
          })
        else
          return res.status(422).json({ details: [{ email: "Email Already Taken" }] })
      });
    });


  });

module.exports = router;
