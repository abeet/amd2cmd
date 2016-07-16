/**
 * string editor class
 *
 * @export
 * @class StringEditor
 */
export default class StringEditor {
  /**
   * Creates an instance of StringEditor.
   *
   * @param {String} content
   * @param {Number} [start=0]
   * @param {Number} [end=content.length]
   */
  constructor(content, start, end) {
    this.content = content;
    this.start = start || 0;
    this.end = end || content.length;
    this.replaceActions = [];
  }

  /**
   * replace content[begin, end) to newContent
   *
   * @param {Number} begin
   * @param {Number} end
   * @param {String|StringEditor} newContent
   */
  replace(begin, end, newContent) {
    this.replaceActions.push({
      range: [begin, end],
      newContent,
    });
  }

  /**
   * get value
   *
   * @returns return content value
   */
  toString() {
    let value = '';
    let start = this.start;

    for (const action of this.replaceActions) {
      value += this.content.substring(start, action.range[0]);
      value += action.newContent.toString();
      start = action.range[1];
    }

    value += this.content.substring(start, this.end);
    return value;
  }
}
