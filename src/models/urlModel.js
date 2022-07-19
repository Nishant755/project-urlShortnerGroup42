const mongoose = require("mongoose")
// ================================================[Model]===================================================


const urlSchema = new mongoose.Schema({
    urlCode: { type: String, required: true, unique: true, lowercase: true, trim: true },
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true }
},{ versionKey: false,timestamps: false })


// ===================================================================================================
module.exports = mongoose.model("urlModel", urlSchema)