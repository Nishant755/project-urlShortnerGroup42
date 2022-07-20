const urlModel = require("../models/urlModel");
const shortid = require('shortid');
const redis = require("redis")
const { promisify } = require("util");

// ============================================================================================================
// remote dict server
// minimize the network call
// in memory

// =================================================[Redis]====================================================
//Connect to redis
const redisClient = redis.createClient(
    15180,
    "redis-15180.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);

redisClient.auth("h5MXPadhX8yjXvj9IqQmT3Etiwa6VpZ9", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const isValid = function (value) {
    if (typeof value == "undefined" || typeof value == null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

// ===================================================[Regex]==================================================


regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/


// ===================================================[Create Short Url]=======================================
const urlShortner = async (req, res) => {
    try {
        let { longUrl, ...rest } = req.body

        baseUrl = req.protocol + '://' + req.get('host')

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Req body is empty" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribut in request body" })

        // https:        //                   babeljs.io
        const urlparts = longUrl.split('//')
        const part1 = urlparts[0]
        const part2 = urlparts[1]

        if (!isValid(longUrl)) return res.status(400).send({ status: false, msg: "URL is Invalid" });
        if (!(((part1 == "http:") || (part1 == "https:")) && (part1.trim().length) )) {
            return res.status(400).send({ status: false, msg: "URL is Invalid ,Http is missing in URL" });
        }
        if (!regex.test(longUrl)) return res.status(400).send({ status: false, msg: "URL is Invalid" });

        let url = await urlModel.findOne({ longUrl: longUrl }).select({ "_id": 0, "createdAt": 0, "updatedAt": 0 })
        if (url) {
            return res.status(200).send({ status: true, data: url })
        }
        else {
            let urlCode = shortid.generate();

            let findUrlCode = await urlModel.findOne({ urlCode: urlCode })
            if (findUrlCode) return res.status(400).send({ status: false, message: "URL code must me unique for every url." })

            let shortUrl = baseUrl + '/' + urlCode
            url = {
                urlCode: urlCode,
                longUrl: longUrl,
                shortUrl: shortUrl
            }
            let savedData = await urlModel.create(url)

            //await SET_ASYNC(`${urlCode}`, JSON.stringify(longUrl))
            await SET_ASYNC(urlCode.toLowerCase(), longUrl)

            return res.status(201).send({ status: true, data: savedData })
        }
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }

}
// ===================================================[Get Url]================================================
const getUrl = async (req, res) => {
    try {
        let urlCode = req.params.urlCode

        if (!isValid(urlCode)) return res.status(400).send({ status: false, message: "Invalid Code" })
        if (!shortid.isValid(urlCode)) return res.status(400).send({ status: false, message: "Invalid Code" })

        let cahcedUrlData = await GET_ASYNC(urlCode.toLowerCase())
        if (cahcedUrlData) {
            //return res.redirect(302, cahcedUrlData)
            //console.log(cahcedUrlData)
            return res.status(302).redirect(cahcedUrlData)
        }
        else {
            let findUrl = await urlModel.findOne({ urlCode: urlCode })
            if (!findUrl) return res.status(404).send({ status: false, message: "No URL found" })
            longUrl = findUrl.longUrl
            await SET_ASYNC(urlCode.toLowerCase(), longUrl)
            return res.status(302).redirect(findUrl.longUrl)
        }

    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}
// ===============================================================================================================

module.exports = {urlShortner, getUrl}
