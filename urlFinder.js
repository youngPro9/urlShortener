const mongoose = require("mongoose");
const Url = require("./models/URL");

// Check duplicate of urlParam in DB
module.exports.urlFinder = function (urlParam, res){
    Url.findOne({original_url: urlParam}, (err, queryResult) => {
        if(err) throw err;
        
        // if queryResult is not null,
        // the original_url name already exists
        if(queryResult){
            res.json({
                "error": "The url is shortened already", 
                "original_url": urlParam,
                "short_url": queryResult._id
            });
        }
        else{  
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
        }
    });
}
