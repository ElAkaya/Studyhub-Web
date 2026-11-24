'use strict';
/**
 * An immutable course identified by a normalized code and a display title.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
class Course {
  /**
   * Create a course, trimming both values and uppercasing its code.
   *
   * @precondition code and title are nonblank strings
   * @postcondition code is the trimmed uppercase code; title is the trimmed title
   * @param {string} code the course identifier, such as CS101
   * @param {string} title the readable course title
   * @throws {Error} if either value is missing or blank
   */
  constructor(code, title) {
    if (typeof code !== 'string' || code.trim() === '') {
      throw new Error('Must provide a nonblank course code.');
    }
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Must provide a nonblank course title.');
    }
    this.code = code.trim().toUpperCase();
    this.title = title.trim();
    Object.freeze(this);
  }

  /**
   * Describe the course for selection lists, for example "CS101 - Introduction to Programming".
   *
   * @returns {string} the code, a separator and the title
   */
  toString() {
    return `${this.code} - ${this.title}`;
  }
}

module.exports = { Course };
