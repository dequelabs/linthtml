const { expect } = require("chai");
const parse = require("../../lib/parser");

describe("linter", function() {
  it("should be a function", function() {
    expect(parse).to.be.an.instanceOf(Function);
  });

  describe("parse", function() {
    it("should return correct line and column numbers", function() {
      const output = parse(
        [
          "<body>\n",
          "  <div a=\"jofwei\">\n",
          "    TextTextText\n",
          "  </div>\n",
          "</body>\n"
        ].join("")
      );
      expect(output[0].open.loc)
        .to
        .deep
        .equal({
          start: {
            line: 1,
            column: 1
          },
          end: {
            line: 1,
            column: 7
          }
        });
      expect(output[0].close.loc)
        .to
        .deep
        .equal({
          start: {
            line: 5,
            column: 1
          },
          end: {
            line: 5,
            column: 8
          }
        });
      expect(output[0].children[1].open.loc)
        .to
        .deep
        .equal({
          start: {
            line: 2,
            column: 3
          },
          end: {
            line: 2,
            column: 19
          }
        });
      expect(output[0].children[1].close.loc)
        .to
        .deep
        .equal({
          start: {
            line: 4,
            column: 3
          },
          end: {
            line: 4,
            column: 9
          }
        });
    });
  });

  describe("onattribute", function() {
    it("should correctly extract all attributes", function() {
      const output = parse(
        [
          "<body>\n",
          "  <div class=\"hello\" id=\"identityDiv\" class=\"goodbye\">\n",
          "  </div>\n",
          "</body>\n"
        ].join("")
      );

      expect(output[0].children[1].attributes).to.have.lengthOf(3);
    });
  });
});
