const express=require('express');
var cors=require('cors');
const connectToMongo=require ('./db');

connectToMongo();

const app=express()


app.use(cors());
app.use(express.json());

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes/',require('./routes/notes'))
app.use('/',require('./routes/tester'))

let port =process.env.PORT;
if(port==null || port==""){
    port=5000;
}

app.listen(port,()=>{
    console.log(`iNoteBook app Server started at port http://localhost:${port}`);
})