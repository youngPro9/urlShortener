/*
 * Url Shortener - Microservice
 * 
 * Post to a URL with the domain name to make a short url version
 * ex)  "[host_name]/api/shorturl/new/[domain_name_to_convert_to_short_url]" 
 *      @ success 
 *        { 
 *          original_url: "domain_name_to_convert_to_short_url"
 *          short_url: Number 
 *        }
 *      @ fail 
 *        {
 *           "error": "The url is shortened already", 
 *           "original_url": urlParam,
 *           "short_url": queryResult._id
 *        }
 * 
 * To use the short url, simply access "[host_name]/api/shorturl/[Number]"
 * It will redirect to the original_url.
 * Number is given by the result object, short_url.
*/

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Url = require("./models/URL");
const finder = require("./urlFinder");
const dns = require("dns");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/urlShortDB", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDB connected..."))
.catch( (err) => console.log(err));


app.get("/api/shorturl/:url", (req, res) => {
    // parameter url is dns
    if(isNaN(Number(req.params.url))){
        res.redirect(301, "http://" + req.params.url);
    }
    else{
        Url.findOne({ _id: req.params.url }, (err, result) => {
            if(err) throw err;
    
            // if result url is found
            // result = short_url
            if(result){
                res.redirect("http://" + result.original_url, 301);
            }
            else{
                res.status(404).json({"error": "Short url does not exist."});
            }
        });
    }
    
});


app.post("/api/shorturl/new/*", (req, res) => {
    // get the url and parse the parameter.
    const urlParam = req.url.slice(18);

    dns.lookup(urlParam, (err, addr) => {
        if(err) throw err;
        
        // if the domain does not eixst, the cox redirects to 92.242.140.2
        if(addr === "92.242.140.2") {
            res.status(404).json({"error": "Domain name does not exist."});
        }
        else{
            finder.urlFinder(urlParam, res);
        }
    })
});

// Error Handling
app.all("*", (req, res) => {
    res.status(404).json({"error": "invalid URL"});
});


const port = 3000;

app.listen(port, "0.0.0.0", () => {
    console.log("Server is Running on Port " + port + "...");
});



