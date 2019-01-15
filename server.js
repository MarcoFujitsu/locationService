const express = require('express');
const app = express();
const request = require('request');
const unirest = require('unirest');
const bodyParser = require("body-parser");
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/address', (req, res) => {
  const url = 'https://api.opencagedata.com';
    //const address ='Het Kwadrant 1 Maarssen, Holland';
    const path = '/geocode/v1/json?key=a58edd2883b64e25abc38a24148363d0&pretty=1&q=';
    var address = "de linge 34, 3448 CV Woerden, Holland";
    var data = encodeURIComponent(req.query["address"]);

    var myBody =req.body.address;
    var data = encodeURIComponent(myBody);

    unirest.get(url+path+data)
    .end(function(response) {
      
      var answer = response.body;   
      
      var myItem = getHighestConfidenceItem(answer.results);
    
      if(myItem!=null) {
        
        var result = '{ "lat" : "' + myItem.geometry.lat + '", "lng" : "' + myItem.geometry.lng + '"}';
        // result = '{  "replies": [ { "type": "text","content": "lat: ' + myItem.geometry.lat + ' lng: ' + myItem.geometry.lng + ' " } ] } ';
        result = '{    "type": "card",    "content": {      "title": "Your location",      "subtitle": "LOCATION",      "imageUrl": "http://open.mapquestapi.com/staticmap/v4/getmap?key=ENYNqiKYXC843j4cnbcezq4awv1UI5tB&size=400,400&zoom=16&center=52.0532588,4.4985999&pois=red_1,52.0532588,4.4985999,0,0",	"buttons": [        {          "title": "BUTTON_TITLE",          "type": "postback",          "value": "BUTTON_VALUE"        }      ]    }  }';
        console.log(result);
        res.send(result);
      }  
    });
});


app.get('/', (req, res) => {
    
    const url = 'https://api.opencagedata.com';
    //const address ='Het Kwadrant 1 Maarssen, Holland';
    const path = '/geocode/v1/json?key=a58edd2883b64e25abc38a24148363d0&pretty=1&q=';
    var address = "Het kwadrant 1 , maarssen, holland";
    var data = encodeURIComponent(address);
    console.log(req.body);
    
    var result = request(url+path+data,function (error, response, body) {

      console.log(body);
        
        var answer = JSON.parse(body);   
      
        var myItem = getHighestConfidenceItem(answer.results);
      
        if(myItem!=null) {
          var result = '{ "lat" : "' + myItem.geometry.lat + '", "lng" : "' + myItem.geometry.lng + '"}';
          var a = JSON.parse(result);
          res.json(result);
        }  
      }).end(function(res) { 
          if (res.error) {
            console.log('GET error', res.error)
          } else {
            console.log('GET response', res.body)
          }
      });

});

function getCoordinates(myAddress) {
  const url = 'https://api.opencagedata.com';
    //const address ='Het Kwadrant 1 Maarssen, Holland';
    const path = '/geocode/v1/json?key=a58edd2883b64e25abc38a24148363d0&pretty=1&q=';
    var address = "de linge 34, 3448 CV Woerden, Holland";
    var data = encodeURIComponent(myAddress);

    unirest.get(url+path+data)
    .end(function(response) {
      console.log(response.body);
      var answer = response.body;   
      
      var myItem = getHighestConfidenceItem(answer.results);
    
      if(myItem!=null) {
        var result = '{ "lat" : "' + myItem.geometry.lat + '", "lng" : "' + myItem.geometry.lng + '"}';
        var a = JSON.parse(result);
        return result;
      }  
    });
    /*
    var result = request(url+path+data,function (error, response, body) {
        
        var answer = JSON.parse(body);   
      
        var myItem = getHighestConfidenceItem(answer.results);
      
        if(myItem!=null) {
          var result = '{ "lat" : "' + myItem.geometry.lat + '", "lng" : "' + myItem.geometry.lng + '"}';
          var a = JSON.parse(result);
          return result;
        }  
      });*/
}
function getHighestConfidenceItem(results)
{
    var result;
    var highestConfidence = 0;
  
    for(i=0;i<results.length;i++) {
      if( results[i].confidence > highestConfidence)
      {
        result = results[i];
        highestConfidence = results[i].confidence;

      }
      
      return result;
    }

}



// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});