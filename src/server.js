/* eslint linebreak-style: ["error", "windows"] */
const express = require("express");
const unirest = require("unirest");
const bodyParser = require("body-parser");

const convert = {};
const app = express();

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

app.post("/address", (req, res) => {
  const url = "https://api.opencagedata.com";

  const key = process.env.geolocationkey;
  const path = `/geocode/v1/json?key=${key}&pretty=1&q=`;
  const data = encodeURIComponent(req.body.address);

  unirest.get(url + path + data)
    .end((response) => {
      const answer = response.body;

      const myItem = convert.getHighestConfidenceItem(answer.results);

      if (myItem != null) {
        const myAnswer = {
          replies: [
            convert.GenerateQuickReply(`lat: ${myItem.geometry.lat} lng: ${myItem.geometry.lng}`),
          ],
          conversation: {
            memory: {
              lat: myItem.geometry.lat,
              lng: myItem.geometry.lng,
            },
          },
        };
        res.status(201).send(myAnswer);
      } else {
        const myAnswer = {
          replies: [{
            type: "text",
            content: "No location found",
          }],
        };
        res.status(404).send(myAnswer);
      }
    });
});

convert.GenerateQuickReply = function quickReply(content) {
  const result = {
    type: "quickReplies",
    content: {
      title: content,
    },
  };
  return result;
};

convert.getHighestConfidenceItem = function gethighestitem(results) {
  let result;
  let highestConfidence = 0;

  for (let i = 0; i < results.length; i += 1) {
    if (results[i].confidence > highestConfidence) {
      result = results[i];
      highestConfidence = results[i].confidence;
    }
    return result;
  }
  return result;
};

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = convert;
