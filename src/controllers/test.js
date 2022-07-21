// console.time('time');
// // const url = require('url');
// const urlInfo = url.parse("htt:www.google.co.in/imghp");
// console.timeEnd('time');

//time: 0.840ms;
// console.log(urlInfo.hostname) //www.google.co.in


function isValid(url){
    try {
     
        new URL(url)
        console.log(true)
        return true

    } catch (error) {
        console.log(false)
        return false
    }
}
url="https:/www.google.com"

if(!isValid(url)){
    url="http://"+url
    console.log(url)
}


if (urlInfo.hostname == null) {
    return res.status(400).send({ status: false, msg: "URL is Invalid " });
}

if (urlInfo.protocol == null && urlInfo.hostname !== null) {
    longUrl = req.protocol + '://' + longUrl
}

if (!(urlInfo.protocol == null) && !['https:', 'http:'].includes(urlInfo.protocol)) {
    return res.status(400).send({ status: false, msg: "URL is Invalid ,Http protocol is missing in URL" });
}