const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

app.use(cors({
    origin: '*', // or specify only your frontend origin like 'http://localhost:3000'
    methods: ['GET', 'POST'], // allow only necessary methods
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
const port = process.env.PORT || 5000;

// Schema
const mongoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true, default: "0000000000" },
    age: { type: Number, required: true },
});

// Model
const userModel = mongoose.model('user', mongoSchema);

// Ensure indexes are created

app.delete('/api/user/:id', async (req,res) =>{
    try{
        const user  = await userModel.findByIdAndDelete(req.params.id)
        if (!user){
            return res.status(404).json({message: "User not found"});
        }   
        res.status(200).json({message: "User deleted successfully"});   

    }
    catch(err){
        res.status(500).json({message: "Error in deleting data"});
    }
})

// Update
app.put('/api/user/:id', async (req,res)=>{
    try{
        const user  =  await userModel.findByIdAndUpdate(req.params.id,req.body);
        if(!user){
            return res.status(404).json({message: " user not found"});
        }
        res.status(200).json(user);
    } catch(err){
        res.status(500).json({message : "Error in Updating data"});
    }
});

app.get("/api/user/:id", async (req,res)=>{ 
    try{
        const user = await userModel.findById(req.params.id)
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({message: "Error fetching data"});
    }
})

// GET Route
app.get('/', async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching data", err);
        res.status(500).json({ message: "Error fetching data" });
    }
});

// POST Route
app.post('/', async (req, res) => {
    try {
        const user = new userModel(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            res.status(400).json({ message: `Duplicate entry: ${duplicateField} already exists` });
        } else if (err.name === "ValidationError") {
            res.status(400).json({ message: err.message });
        } else {
            console.error(err);
            res.status(500).json({ message: "Error inserting data" });
        }
    }
});

// MongoDB Connection
mongoose.connect("mongodb+srv://karinguravi:KaringuRavi%402004@ravi.g7rvchp.mongodb.net/demo1?retryWrites=true&w=majority")
    .then(() => {
        console.log("✅ Connected Successfully to MongoDB");
        app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    })
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
