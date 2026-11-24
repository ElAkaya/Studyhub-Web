'use strict';
/**
 * A fixed demonstration semester catalog, not an official university listing.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const { Course } = require('./course');

/** The four example courses offered in the demonstration semester, in display order. */
const DEMONSTRATION_COURSES = Object.freeze([
  new Course('CS101', 'Introduction to Programming'),
  new Course('CS201', 'Data Structures'),
  new Course('MATH101', 'College Algebra'),
  new Course('ENG101', 'College Writing'),
]);

class CourseCatalog {
  /**
   * Create a catalog holding the given courses, which default to the demonstration semester.
   *
   * @precondition courses is a nonempty array of Course objects with distinct codes
   * @postcondition getCourses() returns the courses in the order given
   * @param {Course[]} [courses] the courses offered
   * @throws {Error} if courses is empty, holds a non-Course, or repeats a code
   */
  constructor(courses = DEMONSTRATION_COURSES) {
    if (!Array.isArray(courses) || courses.length === 0) {
      throw new Error('Must provide at least one course.');
    }
    if (!courses.every((course) => course instanceof Course)) {
      throw new Error('Every catalog entry must be a Course.');
    }
    const codes = new Set(courses.map((course) => course.code));
    if (codes.size !== courses.length) {
      throw new Error('Course codes in a catalog must be unique.');
    }
    this.courses = Object.freeze([...courses]);
  }

  /**
   * Return the catalog's courses in display order.
   *
   * @returns {readonly Course[]} a frozen array of immutable courses
   */
  getCourses() {
    return this.courses;
  }

  /**
   * Look up a complete course code, ignoring case and surrounding whitespace.
   * Blank, partial and unknown codes produce null.
   *
   * @precondition code is a string
   * @postcondition the catalog is unchanged
   * @param {string} code the complete code to find
   * @returns {Course|null} the matching course, or null if there is none
   * @throws {Error} if code is not a string
   */
  findByCode(code) {
    if (typeof code !== 'string') {
      throw new Error('Must provide a course code to look up.');
    }
    const wanted = code.trim().toUpperCase();
    return this.courses.find((course) => course.code === wanted) ?? null;
  }
}

module.exports = { CourseCatalog, DEMONSTRATION_COURSES };
