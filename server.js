const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

let port = process.env.PORT || 3000;

let mongoSchema = mongoose.Schema({
    name: String,
    age: Number
})

let userModel = mongoose.model('user', mongoSchema);

app.get('/', (req, res) => {
    userModel.find({}).then((data) => res.json(data)).catch((err) => {
        console.log("Error", err);
    })

})

app.post('/', (req, res) => {
    let user = new userModel(req.body);
    userModel.insertOne(user).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error inserting data" });
    })
})

mongoose.connect("mongodb+srv://karinguravi:KaringuRavi%402004@ravi.g7rvchp.mongodb.net/demo1?retryWrites=true&w=majority")
.then(() => {
    console.log("Connected Successfully");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
})
.catch(()=> console.log("Error connecting to MongoDB"));

