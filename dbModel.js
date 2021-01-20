import mongoose from 'mongoose'

const debateSchema = mongoose.Schema({
    person1: String, 
    person2: String, 
    title: String, 
    topics: [String],
    imageUrl: String, 
    date: Date,
    color: String, 
    person1img: String, 
    person2img: String,  
    person1description: String,  
    person2description: String, 

});

export default mongoose.model('debatePosts', debateSchema);