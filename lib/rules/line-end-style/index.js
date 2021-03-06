const { is_text_node } = require("../../knife/tag_utils");
const { get_lines } = require("../../knife/text_node_utils");
const { create_list_value_validator } = require("../../validate_option");

module.exports = {
  name: "line-end-style",
  on: "dom",
  validateConfig: create_list_value_validator(["cr", "lf", "crlf"], false)
};

const formats = {
  cr: /(^|[^\n\r])\r$/,
  lf: /(^|[^\n\r])\n$/,
  crlf: /(^|[^\n\r])\r\n$/
};

module.exports.lint = function(node, opts, { report }) {
  if (is_text_node(node) === false) {
    return;
  }
  const format = opts[this.name];

  let lines = get_lines(node, true);

  lines = lines.filter(({ text }) => !formats[format].test(text));
  Object.keys(formats)
    .filter(_ => _ !== format)
    .forEach(format => {
      lines.filter(({ text }) => formats[format].test(text))
        .forEach(line => {
          const start_line = node.loc.start.line + line.offset;
          const start_column = line.offset === 0 ? node.loc.start.column : 1;
          report({
            code: "E015",
            position: {
              start: {
                line: start_line,
                column: 1
              },
              end: {
                line: start_line,
                column: start_column + line.text.length
              }
            },
            meta: {
              data: {
                format: format
              }
            }
          });
        });
    });
};
