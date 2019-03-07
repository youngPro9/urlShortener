const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Url = require("./models/URL");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/urlShortDB", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDB connected..."))
.catch( (err) => console.log(err));


app.get("/api/shorturl/:url", (req, res) => {
    console.log(req.params.url);
    res.send("GET");
})

app.post("/api/shorturl/new/*", (req, res) => {
    // get the url and parse the parameter.
    const urlParam = req.url.slice(18);

    // Check duplicate of urlParam in DB
    // if already exists, return message
    // otherwise, insert a new document.
    // to be implemented...


    // count() to increment _id or short_url
    Url.countDocuments()
    .then(count => {
        let newCount = count + 1;   // short_url
        const urlModel = new Url({
            _id: newCount,
            original_url: urlParam
        });

        urlModel.save()
        .then( 
            res.json({
            "original_url": urlParam,
            "short_url": newCount 
            })
        );
    })
    .catch(err => console.log(err));
});

// Error Handling
app.all("*", (req, res, next) => {
    res.status(404).json({"error": "invalid URL"});
});


const port = 3000;

app.listen(port, "0.0.0.0", () => {
    console.log("Server is Running on Port " + port + "...");
});