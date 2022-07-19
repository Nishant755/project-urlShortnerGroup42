const urlModel = require("../models/urlModel");
// let axios = require("axios")//pakage
const shortid = require('shortid');//pakage

// ================================================[Validation]===================================================
const isValid = function (value) {
    if (typeof value == "undefined" || typeof value == null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}
// ================================================[Regex]===================================================

regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/


// ================================================[Create Url]===================================================

const urlShortner = async (req, res) => {
    try {
        // baseUrl = req.protocol + '://' + req.get('host')

        let { longUrl, ...rest } = req.body//req body 

        baseUrl = req.protocol + '://' + req.get('host')

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Req body is empty" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribut in request body" })
        if (!isValid(longUrl) || !regex.test(longUrl)) return res.status(400).send({ status: false, msg: "URL is Invalid" });


        let url = await urlModel.findOne({ longUrl: longUrl }).select({ "_id": 0, "createdAt": 0, "updatedAt": 0 })
        if (url) {
            return res.status(200).send({ status: true, data: url })
        }
        else {
            const urlId = shortid.generate();
            let shortUrl = baseUrl + '/' + urlId
            url = {
                urlCode: urlId,
                longUrl: longUrl,
                shortUrl: shortUrl
            }
            let savedData = await urlModel.create(url)   
                
            return res.status(201).send({ status: true, data:url })
        }
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

// ================================================[Get Url]===================================================

const getUrl=async (req,res)=>{
    try{
        let urlCode=req.params.urlCode
        if(!isValid(urlCode)) return res.status(400).send({status:false,message:"Invalid Code"})
        findUrl=await urlModel.findOne({urlCode:urlCode})
        longUrl=findUrl.longUrl

        if(!findUrl) return res.status(404).send({status:false,message:"No URL found"})

        return res.redirect(302,longUrl)

    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}
// ===================================================================================================


module.exports.urlShortner = urlShortner
module.exports.getUrl = getUrl
