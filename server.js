import express from 'express'
import mongoose from 'mongoose'
import Data from './data.js'
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

app.get('/', (req, res) => {
    res.status(200).send('hello')
})

app.get('/topics', (req, res) => {
    res.status(200).send('hello')
})


app.get('/v1/posts', (req, res) => {
    res.status(200).send(Data)
})

app.get('/v2/posts', (req, res) => {
    DebatePosts.find({}, function(err, data){
        if (err) {
            res.status(500).send(err);
        } else {
           res.status(200).send(data);

        }
    });
})

app.get('/v2/topics', (req, res) => {
    DebatePosts.find({}, function(err, data){
        if (err) {
            res.status(500).send(err);
        } else {
            // const topics = []
            // data.forEach(item => {
            //     topics.push(item.topics)
            // })
            const topics = data.map(item => item.topics);
           res.status(200).send(topics);
        }
    });
})


app.get('/v2/debates/:topic', (req, res) => {
    const topic = req.params.topic;
    DebatePosts.find({topics: topic }, function(err, data){
        if (err) {
            res.status(500).send(err);
        } else {
           res.status(200).send(data);

        }
    });
})


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
app.get('/v2/posts/:topic/:title', (req, res) => {
    const topic = req.params.topic;
    const title = req.params.title;

    console.log("topic" + topic)
    console.log("title " + title)
    DebatePosts.find({topics: topic, title: title}, function(err, data){
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