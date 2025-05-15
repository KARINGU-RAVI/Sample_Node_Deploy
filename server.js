const express = require('express');
const app =  express(); 
app.use(express.json());
let port = process.env.PORT || 3000;

app.get('/api/',(req,res)=>{
    res.status(200).json({message:"Hello this is from API Path"});
})



app.get('/',(req,res)=>{
    res.status(200).json({message:"Hello this is from GET Home Page"});
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})