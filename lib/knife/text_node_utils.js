/**
 *
 *
 * @param {*} node
 */
// TODO: throw error if not text node
function get_lines(node, include_EOL = false) {
  const { data } = node;
  const R = /(\r\n|\r|\n)/g;
  let match;
  const lines = [];
  let previous_index = 0;
  let offset = 0;
  while ((match = R.exec(data)) !== null) {
    const EOL = match[0];
    const extra_cut = include_EOL
      ? EOL.length
      : 0;
    lines.push({
      offset: offset++,
      text: data.slice(previous_index, match.index + extra_cut)
    });
    previous_index = match.index + EOL.length;
  }
  if (previous_index !== data.length) {
    lines.push({
      offset,
      text: data.slice(previous_index)
    });
  }
  return lines;
}

module.exports = {
  get_lines
};
