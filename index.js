const express = require("express");
const { connectToDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

let db;

connectToDB((error) => {
    if(!error){ 
        db = getDB();
        app.listen(3000, () => {
            console.log("server running on port 3000")
        })
    }
})

app.get("/books", async (req, res) => {
    const books = await db.collection('books').find().toArray();
    res.json({
        books
    })
})

// app.get("/books/:id", async (req, res) => {
//     const id = req.params.id;

//     try {
//         if(ObjectId.isValid(id)){
//             const book  = await db.collection('books').findOne({ _id: new ObjectId(id) })
//             res.status(200).json({
//                 book
//             })
//         }else{
//             res.status(404).json({
//                 msg: "book not found"
//             })
//         }
//     }catch (error){
//         res.status(500).json({
//             msg : error.message
//         })
//     }

// })

app.post("/books", async (req, res) => {
    const book = req.body;

    try{
        const result = await db.collection('books').insertOne(book)
        res.status(201).json({
            msg: "book inserted",
            result
        })
    }catch(error){
        res.status(500).json({
            msg: error.message
        })
    }
})

app.delete("/books/:id", async (req, res) => {
    const id = req.params.id
    try {
        if(ObjectId.isValid(id)){
            const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) })
            res.status(200).json({
                result
            })
        }else{
            res.status(404).json({
                msg: "book not found"
            })
        }
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})

app.put("/books/:id", async (req, res) => {
    const id = req.params.id
    const update = req.body
    try {
        if(ObjectId.isValid(id)){
            const result = await db.collection('books').updateOne({ _id: new ObjectId(id) }, { $set : update })
            res.status(200).json({
                result
            })
        }else{
            res.status(404).json({
                msg: "book not found"
            })
        }
    }catch(error){
        res.status(500).json({
            error: error.message
        })
    }
})

// pagination
app.get("/books/paginated/", async (req, res) => {

    const page = req.query.p || 0
    const pageSize = 3

    try{
        const result = await db.collection("books").find().skip(page * pageSize).limit(pageSize).toArray();
        res.status(200).json({
            ans : result
        })
    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
})
