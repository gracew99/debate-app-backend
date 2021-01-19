import mongoose from 'mongoose'

const debateSchema = mongoose.Schema({
    person1: String, 
    person2: String, 
    topic: String, 
    imageUrl: String, 
    date: String,
    color: String, 
    person1img: String, 
    person2img: String,  
    person1description: String,  
    person2description: String, 

});

export default mongoose.model('debatePosts', debateSchema);