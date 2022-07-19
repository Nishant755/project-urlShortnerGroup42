const express = require('express');//framework
const bodyParser = require('body-parser');//middleware(Function in Express Pakage)
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');//pakage

// ===================================================================================================
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================================================[MongoDb Connection]===================================================
mongoose.connect("mongodb+srv://tech-guru:Job7563@cluster0.ivxxx.mongodb.net/group45Database?retryWrites=true&w=majority", {
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


// ===================================================================================================


app.use('/', route);
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))//port
});