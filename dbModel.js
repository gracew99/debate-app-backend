const mongoose = require('mongoose')

const debateSchema = mongoose.Schema({
    person1: String, 
    person2: String, 
    title: String, 
    topics: [String],
    imageUrl: String, 
    date: Date,
    person1img: String, 
    person2img: String,  
    person1description: String,  
    person2description: String, 
    attendees: Number,
    password: String
});

module.exports = mongoose.model('debatePosts', debateSchema);