const express = require('express');
const app = express();
const request = require('request');
const fs = require('fs');

app.get('/', (req, res) => {
    
    const url = 'https://api.opencagedata.com';
    const address ='Het Kwadrant 1 Maarssen, Holland';
    const path = '/geocode/v1/json?key=a58edd2883b64e25abc38a24148363d0&pretty=1&q=';

    var data = encodeURIComponent(address);
    
    var result = request(url+path+data,function (error, response, body) {
        
        var answer = JSON.parse(body);   
      
        var myItem = getHighestConfidenceItem(answer.results);
      
        if(myItem!=null) {
          var result = '{ "lat" : "' + myItem.geometry.lat + '", "lng" : "' + myItem.geometry.lng + '"}';
          console.log(result);
          res.send(result);
        }  
      });

    
  res.send('Hello from App Engine 1.3!');
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