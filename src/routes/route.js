const express = require("express")
const urlShortController=require("../controllers/urlShortnerController")

const router = express.Router()

router.post("/url/shorten", urlShortController.urlShortner);
router.get("/:urlCode",urlShortController.getUrl)


router.all("/**",function(req,res){return res.status(404).send({status:false,message:"Requested Api is Not Available"})})
module.exports = router