const { is_text_node } = require("../../knife/tag_utils");

module.exports = {
  name: "line-no-trailing-whitespace",
  on: "dom"
};

module.exports.lint = function(node, opts, { report }) {
  if (is_text_node(node) === false) {
    return;
  }
  const sibling_line = node.nextSibling ? node.nextSibling.loc.start.line : -1;
  const node_start_line = node.loc.start.line;
  const parent_close_line = node.parent ? node.parent.loc.end.line : -1;
  const lines = node.data.split(/\n/);
  lines.forEach((text, offset) => {
    const text_line = node_start_line + offset;
    const match = /( )+$/.exec(text);
    if (match && text_line !== sibling_line && text_line !== parent_close_line) {
      report({
        code: "E055",
        position: {
          start: {
            line: node.loc.start.line + offset,
            column: match.index + 1
          },
          end: {
            line: node.loc.start.line + offset,
            column: text.length + 1
          }
        }
      });
    }
  });
};
