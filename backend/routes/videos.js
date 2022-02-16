var express = require('express');
var client = require('../dbConnection');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const connectionString = `mongodb+srv://roudy:4SM8xVtLkZrf5vO7@cluster0.f4x2o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');

const DIR = './public/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName)
  }
});
var upload = multer({
  storage: storage,
});

/* GET home page. */
client.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db("blackbox")
    const usersCollection = db.collection("users");
    router.get(
      '/',
      (req, res, next) => {
        var user = usersCollection.findOne({ email: req.user }, (err, docs) => {
          return res.json({ user: docs });

        });
      }
    );
    router.post(
      '/',
      upload.single('video'),
      (req, res, next) => {
        const url = req.protocol + '://' + req.get('host');
        const newVideo = { _id: ObjectId(), name: req.body.name, url: url + "/" + req.file.filename };
        usersCollection.findOneAndUpdate({ email: req.user },
          { '$push': { 'videos': newVideo } }, (err, docs) => {
            (!err) ? res.json({ video: newVideo }) : console.error('Error updating queue : ' + JSON.stringify(err, undefined, 2));
          });
      }
    );
    router.delete(
      '/:id',
      (req, res, next) => {
        usersCollection.findOneAndUpdate({ email: req.user },
          { '$pull': { 'videos': { _id: ObjectId(req.params.id) } } }, (err, docs) => {
            (!err) ? res.json({ video: docs }) : console.error('Error updating queue : ' + JSON.stringify(err, undefined, 2));
          });
      }
    );
    router.post(
      '/:id',
      (req, res, next) => {
        console.log('editing', req.params.id, req.body.name);
        usersCollection.updateOne({ email: req.user, 'videos._id': ObjectId(req.params.id) },
          {
            '$set': { 'videos.$.name': req.body.name },
          }, (err, docs) => {
            (!err) ? res.json({ video: docs }) : console.error('Error updating queue : ' + JSON.stringify(err, undefined, 2));
          });
      });
  })
module.exports = router;
