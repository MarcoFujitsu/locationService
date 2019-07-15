let convert =require("../server.js");
var assert = require("assert");

describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe("Math", function () {
  it("should return true if value is 9", function() {
      assert.equal(9, 3*3);
  });

  it("shoudl return true if value is -8", function() {
    assert.equal(-8, (3-4)*8);
  })
}
);

describe("Determineconfidence", function() {
  it("should return the highest confidence item of 98", function() {
      var results = [ 
        { confidence: 98, name: "test98"} ,
        { confidence: 97, name: "test97"} ,
        { confidence: 94, name: "test94"} 
      ]

      assert.equal(convert.getHighestConfidenceItem(results).confidence,  98);

  });

});

describe("QuickReply", function () {
  it("should generate quickreply with hello world",  function() {
      var a = convert.GenerateQuickReply("hello world");
      var result = {
        type: 'quickReplies',
        content: {
          title : "hello world"
        }
      };
      assert.equal(a.content.title,result.content.title);
  });
});

