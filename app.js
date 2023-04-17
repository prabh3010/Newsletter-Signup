const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("/", function(req,res){
  res.sendFile( __dirname + "/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.first;
  const lastName = req.body.last;
  const email = req.body.email;
  //console.log(firstName +" " + lastName + " " + email);
  const data = {
    members:[{
        email_address: email,
        status: "subscribed",
        merge_fields :{
          FNAME: firstName,
          LNAME : lastName
        }

    }
  ]
};

const jsonData = JSON.stringify(data);
console.log(data.members[0].merge_fields);
const url = "https://us8.api.mailchimp.com/3.0/lists/d54d90fecb";
const options = {
  method: "POST",
  auth: "prabh:bbb364858a12a0909fd33d19d68fe6dc-us8"
}

const request = https.request(url, options, function(response){

  if (response.statusCode === 200){
    res.sendFile(__dirname + "/success.html");
  }
  else{
    res.sendFile(__dirname + "/failure.html");
  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  })
})

request.write(jsonData);
request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is listening to port 3000.");
});
