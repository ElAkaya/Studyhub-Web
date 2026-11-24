'use strict';
/**
 * Manages the study groups for one running server: creating, finding, looking
 * up and deleting groups. Data is kept in memory and resets when the server
 * restarts, as in Project 1.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const { CourseCatalog } = require('./course-catalog');
const { StudyGroup, MAXIMUM_CAPACITY } = require('./study-group');

/**
 * Convert capacity form text into a whole number of members.
 *
 * @param {unknown} capacityText the text the user entered
 * @returns {number} the positive whole number entered
 * @throws {Error} if the text is not a positive whole number within range
 */
function parseCapacity(capacityText) {
  const text = typeof capacityText === 'string' ? capacityText.trim() : '';
  if (!/^\d+$/.test(text)) {
    throw new Error('Capacity must be a positive whole number.');
  }
  const capacity = Number(text);
  if (capacity <= 0 || capacity > MAXIMUM_CAPACITY) {
    throw new Error('Capacity must be a positive whole number within the integer range.');
  }
  return capacity;
}

/**
 * Convert an id taken from a page address into a number.
 *
 * @param {unknown} idText the id from the address, such as "3"
 * @returns {number|null} the id, or null if the text is not a positive whole number
 */
function parseGroupId(idText) {
  const text = typeof idText === 'string' ? idText.trim() : String(idText ?? '');
  return /^[1-9]\d*$/.test(text) ? Number(text) : null;
}

class GroupManager {
  /**
   * Create an empty group collection for the given catalog.
   *
   * @precondition catalog is a CourseCatalog
   * @postcondition getGroups() is empty; getCourses() returns the catalog's courses
   * @param {CourseCatalog} [catalog] the courses available for groups; defaults to the demonstration catalog
   * @throws {Error} if catalog is not a CourseCatalog
   */
  constructor(catalog = new CourseCatalog()) {
    if (!(catalog instanceof CourseCatalog)) {
      throw new Error('Must provide a course catalog.');
    }
    this.catalog = catalog;
    this.groups = [];
    this.nextId = 1;
  }

  /**
   * Return the courses available when creating and filtering groups.
   *
   * @returns {readonly import('./course').Course[]} the catalog's courses in display order
   */
  getCourses() {
    return this.catalog.getCourses();
  }

  /**
   * Return a snapshot of all groups in creation order.
   *
   * @postcondition later changes to the manager do not change the returned array
   * @returns {StudyGroup[]} a copy of the current groups
   */
  getGroups() {
    return [...this.groups];
  }

  /**
   * Validate form values and create a group only when every value is valid.
   * The course must be a complete catalog code; capacity is the text the user typed.
   *
   * @precondition form holds the create-group form's text values
   * @postcondition a valid group is added with the next id; invalid input changes nothing
   * @param {object} form the submitted form values
   * @param {string} form.name the group name
   * @param {string} form.courseCode the selected catalog course code
   * @param {string} form.capacity the maximum members, as entered
   * @param {string} form.description the group's purpose
   * @param {string} form.meetingTime the descriptive meeting time
   * @param {string} form.location the meeting place or online meeting information
   * @returns {StudyGroup} the newly created group
   * @throws {Error} with a message for the user if any value is invalid
   */
  createGroup({ name, courseCode, capacity, description, meetingTime, location } = {}) {
    const course = typeof courseCode === 'string' ? this.catalog.findByCode(courseCode) : null;
    if (course === null) {
      throw new Error('Select a course from the catalog.');
    }
    const group = new StudyGroup({
      id: this.nextId,
      name,
      courseCode: course.code,
      capacity: parseCapacity(capacity),
      description,
      meetingTime,
      location,
    });
    this.groups.push(group);
    this.nextId += 1;
    return group;
  }

  /**
   * Find groups matching both a selected course and a partial course-code search.
   * A blank selection means all courses; a blank search matches every group the
   * selection allows. Both ignore case and surrounding whitespace.
   *
   * @precondition none
   * @postcondition the stored groups are unchanged
   * @param {string} [selectedCourseCode] a complete course code, or blank for all courses
   * @param {string} [searchText] part of a course code, such as "CS"
   * @returns {StudyGroup[]} the matching groups in creation order
   */
  findGroups(selectedCourseCode = '', searchText = '') {
    const selected = typeof selectedCourseCode === 'string' ? selectedCourseCode.trim().toUpperCase() : '';
    const query = typeof searchText === 'string' ? searchText.trim().toUpperCase() : '';
    return this.groups.filter((group) =>
      (selected === '' || group.courseCode === selected) && group.courseCode.includes(query));
  }

  /**
   * Look up a group by the id from its page address.
   *
   * @param {string|number} id the group's id
   * @returns {StudyGroup|null} the group, or null if no group has that id
   */
  findGroupById(id) {
    const groupId = parseGroupId(id);
    return this.groups.find((group) => group.id === groupId) ?? null;
  }

  /**
   * Remove the group with the given id. The caller is responsible for asking
   * the user to confirm first.
   *
   * @postcondition the group is removed if it existed; other groups are unchanged
   * @param {string|number} id the id of the group to delete
   * @returns {boolean} true if a group was removed, false if none had that id
   */
  deleteGroup(id) {
    const group = this.findGroupById(id);
    if (group === null) {
      return false;
    }
    this.groups = this.groups.filter((candidate) => candidate !== group);
    return true;
  }
}

module.exports = { GroupManager, parseCapacity, parseGroupId };
