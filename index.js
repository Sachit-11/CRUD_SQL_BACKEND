import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

// Config
dotenv.config({path:"./config/config.env"});

const app = express();

// This middleware allows us to send json file from any client
app.use(express.json());
// This middleware allows other website to fetch data, make requests
app.use(cors());

const db = mysql2.createConnection({
    host: "containers-us-west-152.railway.app",
    port: 6881,
    user: "root",
    password: `${process.env.PASSWORD}`,
    database: "railway"
})

db.connect((err) => {
    if (err){
        console.log(err);
    }
    console.log("db connected");
})

app.get("/", (req, res) => {
    res.json("hello this is the backend")
})

app.get("/books", (req, res) => {
    const q = "Select * from books";
    db.query(q, (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "select * from books where id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err){
            console.log(err);
        }
        res.json(data);
    })
})

app.post("/books", (req, res) => {
    const q = "INSERT Into books (`title`, `desc`, `price`, `cover`) Values (?)";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover
    ];

    db.query(q, [values], (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json("Book has been created successfully");
    })
})

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "delete from books where id = ?";
    
    db.query(q, [bookId], (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json("Book has been deleted successfully");
    })
})

app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "update books set `title` = ?, `desc` = ?, `price` = ?, `cover` = ? where id = ?";
    
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover
    ];

    db.query(q, [...values, bookId], (err, data) => {
        if (err){
            return res.json(err);
        }
        return res.json("Book has been updated successfully");
    })
})

// To check default server (on which it is currently running) we are using server.address()
// app.listen() defines the port that acts as an interface bw actual server and frontend
// process.env.PORT has some default value when hosting on sites like railway.app or heroku
var server = app.listen(process.env.PORT, () => {
    console.log(server.address());
    console.log("Connected to backend!");
})