const mongoose= require('mongoose');
// const mongoURI= "mongodb://localhost:27017/iNotebookDB";
const mongoURI= "mongodb+srv://admin-Shashwat:Shashwat123@cluster0.iyxfm.mongodb.net/iNotebookDB";

const connectToMongo= async ()=>{
    await mongoose.connect(mongoURI, {useNewUrlParser: true},()=>{
        console.log("Connected to mongo successfully ");
    })
}

module.exports=connectToMongo;