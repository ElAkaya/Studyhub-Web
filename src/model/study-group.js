'use strict';
/**
 * Stores validated meeting information for a single campus study group.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */

/** The largest member limit accepted, matching Project 1's Java int range. */
const MAXIMUM_CAPACITY = 2147483647;

/**
 * Return the trimmed value of a required text field.
 *
 * @param {unknown} value the value to check
 * @param {string} fieldName the field's display name, used in the error message
 * @returns {string} the trimmed text
 * @throws {Error} if value is not a nonblank string
 */
function requireText(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} must not be blank.`);
  }
  return value.trim();
}

class StudyGroup {
  /**
   * Create a group with an identifier, course, member limit and meeting details.
   * Meeting time is descriptive text, not a parsed date or schedule.
   *
   * @precondition id is a positive integer; all text is nonblank;
   *               capacity is an integer from 1 to MAXIMUM_CAPACITY
   * @postcondition text is trimmed; courseCode is uppercase; the group is frozen
   * @param {object} details the group's values
   * @param {number} details.id the unique identifier used in page addresses
   * @param {string} details.name the group name
   * @param {string} details.courseCode the course code
   * @param {number} details.capacity the maximum number of members
   * @param {string} details.description the purpose or activities of the group
   * @param {string} details.meetingTime the descriptive meeting time, such as "Mondays at 3 PM"
   * @param {string} details.location the meeting place or online meeting information
   * @throws {Error} if any value is missing or invalid
   */
  constructor({ id, name, courseCode, capacity, description, meetingTime, location }) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Group id must be a positive whole number.');
    }
    if (!Number.isInteger(capacity) || capacity <= 0 || capacity > MAXIMUM_CAPACITY) {
      throw new Error('Capacity must be a positive whole number.');
    }
    this.id = id;
    this.name = requireText(name, 'Name');
    this.courseCode = requireText(courseCode, 'Course code').toUpperCase();
    this.capacity = capacity;
    this.description = requireText(description, 'Description');
    this.meetingTime = requireText(meetingTime, 'Meeting time');
    this.location = requireText(location, 'Location');
    Object.freeze(this);
  }

  /**
   * Summarize the group for lists, for example "CS101 Study Crew [CS101] seats: 5".
   *
   * @returns {string} the name, course code and capacity
   */
  toString() {
    return `${this.name} [${this.courseCode}] seats: ${this.capacity}`;
  }
}

module.exports = { StudyGroup, MAXIMUM_CAPACITY };
