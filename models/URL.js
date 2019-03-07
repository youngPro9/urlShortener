const mongoose = require("mongoose");

// _id is the short version of the original_url
const urlShcema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    original_url: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model("Url", urlShcema);