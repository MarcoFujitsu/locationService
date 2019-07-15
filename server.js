let convert = {};
var express = require('express');
var app = express();
var request = require('request');
var unirest = require('unirest');
var bodyParser = require("body-parser");
var fs = require('fs');

-
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.post("/address", (req, res) => {
  console.log('address request');
  const url = 'https://api.opencagedata.com';

  var key = process.env.geolocationkey;
  const path = '/geocode/v1/json?key=' + key + '&pretty=1&q=';

  var data = encodeURIComponent(req.query["address"]);
  var myBody = req.body.address;
  var data = encodeURIComponent(myBody);

  unirest.get(url + path + data)
    .end(function (response) {

      var answer = response.body;

      var myItem = convert.getHighestConfidenceItem(answer.results);

      if (myItem != null) {

        var result = '{ "lat" : "' + myItem.geometry.lat + '", "lng" : "' + myItem.geometry.lng + '"}';
        result = '{  "replies": [ { "type": "text","content": "lat: ' + myItem.geometry.lat + ' lng: ' + myItem.geometry.lng + ' " } ] } ';

        a = {
          replies: [
            convert.GenerateQuickReply('lat: ' + myItem.geometry.lat + ' lng: ' + myItem.geometry.lng)

          ],
          conversation: {
            language: "en",
            memory: {
              lat: myItem.geometry.lat,
              lng: myItem.geometry.lng
            }
          }
        }

      } else {
        a = {
          replies: [{
            "type": "text",
            "content": "No location found"
          }]
        }
      }
      res.send(a);
    });
});

convert.GenerateQuickReply = function (content) {
  var result = {
    type: 'quickReplies',
    content: {
      title: content
    }
  };
  return result;
}

convert.GenerateMemory = function (content) {
  var result = {};

}

convert.getHighestConfidenceItem = function (results)
// function getHighestConfidenceItem(results)
{
  var result;
  var highestConfidence = 0;

  for (i = 0; i < results.length; i++) {
    if (results[i].confidence > highestConfidence) {
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

module.exports = convert;