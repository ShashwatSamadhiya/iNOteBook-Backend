const express=require('express');
var cors=require('cors');
const connectToMongo=require ('./db');

connectToMongo();

const app=express()
const port =5000;

app.use(cors());
app.use(express.json());

//Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes/',require('./routes/notes'))
app.use('/',require('./routes/tester'))


app.listen(port,()=>{
    console.log(`iNoteBook app listening at port http://localhost:${port}`);
})