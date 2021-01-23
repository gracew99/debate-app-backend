const path = require("path");
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const { videoToken } = require('./tokens');
const mongoose = require('mongoose')
const DebatePosts = require('./dbModel.js')
var generator = require('generate-password');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dotenv = require('dotenv').config();


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(express.static(path.join(__dirname, "..", "build")));

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
  res.setHeader("Access-Control-Allow-Headers", "*"),
  next();
})
const connection_url = process.env.MONGO_URL;
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
};


app.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

// return list of topics to be rendered by DebateTopicList component
app.get('/v2/topics', (req, res) => {
  DebatePosts.find({}, function(err, data){
      if (err) {
          res.status(500).send(err);
      } else {
          const topicSet = new Set();
          data.forEach(item => {
              item.topics.forEach(topic => {
                  topicSet.add(topic);
              })
          })
          const topicsArr = [...topicSet];
          topicsArr.sort();
         res.status(200).send(topicsArr);
      }
  });
})

// get all upcoming debates in chronological order for a certain topic
app.get('/v2/topics/:topicName', (req, res) => {
  const topic = req.params.topicName;
  
  var getDebates = function(topic, callback) {
      DebatePosts.find({date : {$gte: new Date().setHours(0,0,0,0)}}, (err, data) => {})
          .where("topics", topic)
          .sort("date")
          .exec((err, data) => {
              callback(err, data);
          });
  };

  getDebates(topic, function(err, data) {
      if (err) { 
          res.status(500).send(err);
      } else {
          res.status(200).send(data)
      }
  });
})

// register a new debate
app.post('/v2/posts', (req, res) => {
  const dbDebatePosts = req.body;
  var password = generator.generate();
  console.log(password)

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      dbDebatePosts.password = hash;
      DebatePosts.create(dbDebatePosts, (err, data) => {
          if (err){
              res.status(500).send(err)
              console.log(err)
          } else{
              const copiedData = JSON.parse(JSON.stringify(data));
              copiedData.readablePassword = password;
              res.status(201).send(copiedData)
          }
      })
    });
  });


})

// get details for a specific debate
app.get('/v2/debates/:debateId', (req, res) => {
  const id = req.params.debateId;
  console.log(id);

  DebatePosts.find({_id: id}, function(err, data){
      if (err) {
          res.status(500).send(err);
      } else {
         res.status(200).send(data);

      }
  });
})

// // get number of attendees
// app.get('/v2/debates/signUp/:debateId', (req, res) => {
//   const debateId = req.params.debateId;
//   DebatePosts.find( { _id: debateId }, (err, data) => {
//       if (err){
//           res.status(500).send(err)
//           console.log(err)
//       } else{
//           const attendees = data[0].attendees ? data[0].attendees : 0;
//           const date = data[0].date;
//           const body = {}
//           body.attendees = attendees.toString();
//           body.date = date;
//           res.status(200).send(body) 
//       }
//   });
// })

// sign up to attend a debate
app.post('/v2/debates/signUp/:debateId', (req, res) => {
  const debateId = req.params.debateId;
  DebatePosts.updateOne( { _id: debateId },{ $inc: { attendees: 1 }}, (err, data) => {
      if (err){
          res.status(500).send(err)
          console.log(err)
      } else{
          res.sendStatus(201) 
      }
  });
})


// check whether passwords match
app.post('/v2/verify', (req, res) => {
  const body = req.body;
  const data = {success: false};
  bcrypt.compare(body.attempt, body.actual, function(err, result) {
    if (result){
      data.success = true;
    }
    res.status(201).send(data); 
  });
})


app.listen(config.port, () =>
  console.log(`Express server is running on localhost:${config.port}`)
);