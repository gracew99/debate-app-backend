import express from 'express'
import mongoose from 'mongoose'
import DebatePosts from './dbModel.js'

const app = express()
const port = 8000;

app.use(express.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader("Access-Control-Allow-Headers", "*"),
    next();
})


const connection_url = "mongodb+srv://admin:mv2kiH58dYfmXvfV@cluster0.b3bgw.mongodb.net/debate";
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


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
    DebatePosts.create(dbDebatePosts, (err, data) => {
        if (err){
            res.status(500).send(err)
            console.log(err)
        } else{
            res.status(201).send(data)
        }
    })
})

// get details for a specific debate
app.get('/v2/debates/:debateId', (req, res) => {

    const id = req.params.debateId;
    DebatePosts.find({_id: id}, function(err, data){
        if (err) {
            res.status(500).send(err);
        } else {
           res.status(200).send(data);

        }
    });
})


app.listen(port, () => {
    console.log('listening on port ' + port)
})