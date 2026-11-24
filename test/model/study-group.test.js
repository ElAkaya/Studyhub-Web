'use strict';
/**
 * Unit tests for StudyGroup.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const { StudyGroup, MAXIMUM_CAPACITY } = require('../../src/model/study-group');

/**
 * Build valid constructor values, replacing any fields given in overrides.
 *
 * @param {object} overrides the fields to change
 * @returns {object} details for the StudyGroup constructor
 */
function details(overrides = {}) {
  return {
    id: 1,
    name: 'CS101 Study Crew',
    courseCode: 'cs101',
    capacity: 5,
    description: 'Practice loops and functions',
    meetingTime: 'Mondays at 3 PM',
    location: 'Library room 204',
    ...overrides,
  };
}

describe('StudyGroup constructor', () => {
  test('stores trimmed values and an uppercase course code', () => {
    const group = new StudyGroup(details({ name: '  Crew  ', location: ' Online ' }));
    expect(group).toMatchObject({
      id: 1,
      name: 'Crew',
      courseCode: 'CS101',
      capacity: 5,
      description: 'Practice loops and functions',
      meetingTime: 'Mondays at 3 PM',
      location: 'Online',
    });
  });

  test('is immutable', () => {
    expect(Object.isFrozen(new StudyGroup(details()))).toBe(true);
  });

  test.each([
    ['name', 'Name'],
    ['courseCode', 'Course code'],
    ['description', 'Description'],
    ['meetingTime', 'Meeting time'],
    ['location', 'Location'],
  ])('rejects a blank or missing %s', (field, label) => {
    for (const bad of [undefined, null, '', '   ', 42]) {
      expect(() => new StudyGroup(details({ [field]: bad }))).toThrow(`${label} must not be blank.`);
    }
  });

  test.each([1, 25, MAXIMUM_CAPACITY])('accepts capacity %p', (capacity) => {
    expect(new StudyGroup(details({ capacity })).capacity).toBe(capacity);
  });

  test.each([0, -1, 2.5, MAXIMUM_CAPACITY + 1, '5', undefined, NaN])('rejects capacity %p', (capacity) => {
    expect(() => new StudyGroup(details({ capacity }))).toThrow('Capacity must be a positive whole number.');
  });

  test.each([0, -3, 1.5, '1', undefined])('rejects id %p', (id) => {
    expect(() => new StudyGroup(details({ id }))).toThrow('Group id must be a positive whole number.');
  });
});

describe('StudyGroup toString', () => {
  test('shows name, course code and capacity', () => {
    expect(new StudyGroup(details()).toString()).toBe('CS101 Study Crew [CS101] seats: 5');
  });
});
