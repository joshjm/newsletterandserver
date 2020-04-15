const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
var path = require('path');

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
        auth: "joshua1:f8c1a3bc73d877060c044e98065f0000-us19"
    }
    const request = https.request(url, options, function(response){

        if (response.statusCode == 200){
            res.send("Success")
        } else {
            res.send("Error")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.listen(3000, function(){
    console.log("server started on port 3000")
});


// mailchimp api key
//f8c1a3bc73d877060c044e98065f0000-us19
//mailchimp server id
// 19
// audience id
// 58ea38128f