const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    //we need to turn this js object to JSON
    const jsonData = JSON.stringify(data);
    const options = {
        method: "POST",
        auth: "manan1:333b7fce8a9e79a71a3d2f931a393afb-us5"
    }
    const url = "https://us5.api.mailchimp.com/3.0/lists/3622503b9b";
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on('data', function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post('/failure', function (req, res) {
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
})

//api key
//f72d662e9ebcf39572c79d8f45758f40-us5
//List id
// 3622503b9b
