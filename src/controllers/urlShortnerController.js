const urlModel = require("../models/urlModel");

const shortid = require('shortid');
var url = require('url');

const isValid = function (value) {
    if (typeof value == "undefined" || typeof value == null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}
regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

    let baseUrl = "http://localhost:3000"
const urlShortner = async (req, res) => {
    try {
        let { longUrl, ...rest } = req.body

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Req body is empty" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribut in request body" })
        if (!isValid(longUrl) || !regex.test(longUrl)) return res.status(400).send({ status: false, msg: "URL is Invalid" });
        

        let url = await urlModel.findOne({ longUrl: longUrl })
        if (url) {
            return res.json(url)
        }
        else {
            const urlId = shortid.generate();

            const shortUrl = baseUrl + '/' + urlId

            url = {
                urlCode: urlId,
                longUrl: longUrl,
                shortUrl: shortUrl
            }

            let savedDate = await urlModel.create(url)
            return res.status(201).send({ status: true, data: savedDate })


        }




    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}
module.exports.urlShortner = urlShortner