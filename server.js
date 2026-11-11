const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
// Static Image Middleware (4% of grade)
app.use('/images', (req, res) => {
    const filePath = path.join(__dirname, 'images', req.url);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: "Image not found" });
        }
        res.sendFile(filePath);
    });
});
app.use(cors());
app.use(express.json());

// Logger Middleware (4% of grade)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
});

// MongoDB Connection
const uri = "mongodb+srv://adonyedon_db_user:Ozil456hh7@cluster0.dazkbgd.mongodb.net/";
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("afterschool");
        console.log("Connected to MongoDB Atlas successfully!");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
}
connectDB();

// GET /lessons (2% of grade)
app.get('/lessons', async (req, res) => {
    try {
        const lessons = await db.collection('lesson').find({}).toArray();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

// POST /orders (2% of grade)
app.post('/orders', async (req, res) => {
    try {
        const result = await db.collection('order').insertOne(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to save order" });
    }
});

// PUT /lessons/:id (3% of grade)
app.put('/lessons/:id', async (req, res) => {
    try {
        const result = await db.collection('lesson').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to update lesson" });
    }
});
// Temporary route to insert 10 university courses into MongoDB
app.get('/seed', async (req, res) => {
    const courses = [
        { subject: "Web Development", location: "Hendon Campus", price: 120, spaces: 5, icon: "fas fa-code" },
        { subject: "Artificial Intelligence", location: "Colindale Lab", price: 150, spaces: 5, icon: "fas fa-robot" },
        { subject: "Cyber Security", location: "Hendon Campus", price: 140, spaces: 5, icon: "fas fa-shield-alt" },
        { subject: "Data Science", location: "Online Live", price: 130, spaces: 5, icon: "fas fa-chart-bar" },
        { subject: "Mobile App Design", location: "Brent Cross Hub", price: 110, spaces: 5, icon: "fas fa-mobile-alt" },
        { subject: "Cloud Computing", location: "Hendon Campus", price: 145, spaces: 5, icon: "fas fa-cloud" },
        { subject: "Database Systems", location: "Colindale Lab", price: 100, spaces: 5, icon: "fas fa-database" },
        { subject: "Software Engineering", location: "Hendon Campus", price: 125, spaces: 5, icon: "fas fa-laptop-code" },
        { subject: "Game Development", location: "Brent Cross Hub", price: 135, spaces: 5, icon: "fas fa-gamepad" },
        { subject: "UI/UX Prototyping", location: "Online Live", price: 95, spaces: 5, icon: "fas fa-pencil-ruler" }
    ];
    await db.collection('lesson').deleteMany({});
    const result = await db.collection('lesson').insertMany(courses);
    res.json({ message: "Inserted 10 university courses!", count: result.insertedCount });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});<!-- Commit 2 --><!-- Commit 3 --><!-- Commit 4--><!-- Commit 5--><!-- Commit 6-->
