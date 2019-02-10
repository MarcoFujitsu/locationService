var express = require('express');
var app = express();
var request = require('request');
var unirest = require('unirest');
var bodyParser = require("body-parser");
var fs = require('fs');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/address", (req, res) => {
  const url = 'https://api.opencagedata.com';
    
    var key = process.env.geolocationkey;
    const path = '/geocode/v1/json?key=' + key +  '&pretty=1&q=';
   
    var data = encodeURIComponent(req.query["address"]); 
    var myBody =req.body.address;
    var data = encodeURIComponent(myBody);

    unirest.get(url+path+data)
    .end(function(response) {
      
      var answer = response.body;   
      
      var myItem = getHighestConfidenceItem(answer.results);
    
      if(myItem!=null) {
        
        var result = '{ "lat" : "' + myItem.geometry.lat + '", "lng" : "' + myItem.geometry.lng + '"}';
        result = '{  "replies": [ { "type": "text","content": "lat: ' + myItem.geometry.lat + ' lng: ' + myItem.geometry.lng + ' " } ] } ';
                
        a = { replies: [
          {
            type: 'quickReplies',
            content: {
              title : 'lat: ' + myItem.geometry.lat + ' lng: ' + myItem.geometry.lng 
            }
          }
          
        ],
        conversation : {
          language: "en",
          memory : {
            lat : myItem.geometry.lat,
            lng : myItem.geometry.lng
          }
        }
      }
      res.send(a);
        
/*        
        res.send(
          {
            type: 'quickReplies',
            content: {
              title: 'Sorry, but I could not find any results for your request',
              buttons: [{ title: 'Start over', value: 'Start over' }]
            }
          }
        );

*/
        
        /*result = '{    "type": "card",    "content": {      "title": "Your location",      "subtitle": "LOCATION",      "imageUrl": "http://open.mapquestapi.com/staticmap/v4/getmap?key=ENYNqiKYXC843j4cnbcezq4awv1UI5tB&size=400,400&zoom=16&center=52.0532588,4.4985999&pois=red_1,52.0532588,4.4985999,0,0",	"buttons": [        {          "title": "BUTTON_TITLE",          "type": "postback",          "value": "BUTTON_VALUE"        }      ]    }  }';
        console.log(result);
        res.send(result); */
      }  
    });
});

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