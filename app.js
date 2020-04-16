const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
var path = require('path');
const config = require('./config.json'); //get apidata

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", function(req, res){
    const firstName = String(req.body.firstName);
    const lastName = String(req.body.lastName);
    const email = String(req.body.email);
    
    console.log(firstName);

    // sending data to mail chimp - making a json
    var data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    }
    var jsonData = JSON.stringify(data); // this is what we are sending to mail chimp
    // making our request
    

    const serverNumber = "19"; 
    const listid = "58ea38128f";
    const url = "https://us" + serverNumber + ".api.mailchimp.com/3.0/lists/"+listid
    const options = {
        method: "POST",
        auth: "joshua1:20ff461046a76752c220b773d71ef6f2-us19"
    }
    const request = https.request(url, options, function(response){

        if (response.statusCode == 200){
            res.sendFile(__dirname + '/public/html/success.html');
        } else {
            res.sendFile(__dirname+'/public/html/failure.html');
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server started on port 3000")
    console.log(config.apiKey)
});


// mailchimp api key
//20ff461046a76752c220b773d71ef6f2-us19
//mailchimp server id
// 19
// audience id
// 58ea38128f
//change