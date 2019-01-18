# locationService
provide an address (e.g. het kwadrant 1 maarssen) and get position back

Packages:
Express
Unirest
Body-parser

Routes:
App.Post('/address')

Expects a JSON object with 1  property:
{ "address" : "string" }
