'use strict';
/**
 * Unit tests for GroupManager and its form-parsing helpers.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const { Course } = require('../../src/model/course');
const { CourseCatalog } = require('../../src/model/course-catalog');
const { GroupManager, parseCapacity, parseGroupId } = require('../../src/model/group-manager');

/**
 * Build a valid create-group form, replacing any fields given in overrides.
 *
 * @param {object} overrides the fields to change
 * @returns {object} form values as text, as a browser submits them
 */
function form(overrides = {}) {
  return {
    name: 'Study Crew',
    courseCode: 'CS101',
    capacity: '5',
    description: 'Weekly practice',
    meetingTime: 'Mondays at 3 PM',
    location: 'Library',
    ...overrides,
  };
}

describe('parseCapacity', () => {
  test.each([['1', 1], [' 12 ', 12], ['2147483647', 2147483647]])('accepts %p', (text, expected) => {
    expect(parseCapacity(text)).toBe(expected);
  });

  test.each(['', '   ', 'abc', '-1', '2.5', '1e3', undefined])('rejects %p as not a whole number', (text) => {
    expect(() => parseCapacity(text)).toThrow('Capacity must be a positive whole number.');
  });

  test.each(['0', '2147483648'])('rejects %p as out of range', (text) => {
    expect(() => parseCapacity(text)).toThrow('within the integer range');
  });
});

describe('parseGroupId', () => {
  test.each([['1', 1], ['42', 42], [7, 7]])('reads %p', (text, expected) => {
    expect(parseGroupId(text)).toBe(expected);
  });

  test.each(['0', '-1', '01', 'abc', '', undefined, '1.5'])('returns null for %p', (text) => {
    expect(parseGroupId(text)).toBeNull();
  });
});

describe('GroupManager constructor', () => {
  test('starts empty with the demonstration courses', () => {
    const manager = new GroupManager();
    expect(manager.getGroups()).toEqual([]);
    expect(manager.getCourses().map((course) => course.code)).toEqual(['CS101', 'CS201', 'MATH101', 'ENG101']);
  });

  test('uses a supplied catalog', () => {
    const manager = new GroupManager(new CourseCatalog([new Course('BIO1107', 'Biology')]));
    expect(manager.getCourses()[0].code).toBe('BIO1107');
  });

  test('rejects anything that is not a catalog', () => {
    expect(() => new GroupManager({})).toThrow('Must provide a course catalog.');
  });
});

describe('GroupManager createGroup', () => {
  test('adds a valid group with increasing ids', () => {
    const manager = new GroupManager();
    const first = manager.createGroup(form());
    const second = manager.createGroup(form({ courseCode: ' math101 ' }));
    expect(first.id).toBe(1);
    expect(second.id).toBe(2);
    expect(second.courseCode).toBe('MATH101');
    expect(manager.getGroups()).toEqual([first, second]);
  });

  test.each([undefined, '', 'CS', 'HIST101'])('rejects course %p and adds nothing', (courseCode) => {
    const manager = new GroupManager();
    expect(() => manager.createGroup(form({ courseCode }))).toThrow('Select a course from the catalog.');
    expect(manager.getGroups()).toEqual([]);
  });

  test('rejects invalid capacity text and adds nothing', () => {
    const manager = new GroupManager();
    expect(() => manager.createGroup(form({ capacity: 'ten' }))).toThrow('Capacity must be a positive whole number.');
    expect(manager.getGroups()).toEqual([]);
  });

  test('rejects blank text fields and does not use up an id', () => {
    const manager = new GroupManager();
    expect(() => manager.createGroup(form({ location: '  ' }))).toThrow('Location must not be blank.');
    expect(manager.createGroup(form()).id).toBe(1);
  });

  test('rejects a missing form', () => {
    expect(() => new GroupManager().createGroup()).toThrow('Select a course from the catalog.');
  });

  test('returned snapshot is not affected by later changes', () => {
    const manager = new GroupManager();
    const snapshot = manager.getGroups();
    manager.createGroup(form());
    expect(snapshot).toEqual([]);
  });
});

describe('GroupManager findGroups', () => {
  const manager = new GroupManager();
  const cs101 = manager.createGroup(form({ courseCode: 'CS101' }));
  const cs201 = manager.createGroup(form({ courseCode: 'CS201' }));
  const math = manager.createGroup(form({ courseCode: 'MATH101' }));

  test('blank selection and search return every group in creation order', () => {
    expect(manager.findGroups()).toEqual([cs101, cs201, math]);
    expect(manager.findGroups('  ', '  ')).toEqual([cs101, cs201, math]);
  });

  test('a selected course shows only its groups', () => {
    expect(manager.findGroups('cs201', '')).toEqual([cs201]);
  });

  test('partial search ignores case and spaces', () => {
    expect(manager.findGroups('', ' cs ')).toEqual([cs101, cs201]);
    expect(manager.findGroups('', '101')).toEqual([cs101, math]);
  });

  test('selection and search combine', () => {
    expect(manager.findGroups('CS101', 'CS')).toEqual([cs101]);
    expect(manager.findGroups('CS101', 'MATH')).toEqual([]);
  });

  test('a course with no groups gives an empty result', () => {
    expect(manager.findGroups('ENG101', '')).toEqual([]);
  });

  test('non-text arguments are treated as blank', () => {
    expect(manager.findGroups(null, undefined)).toHaveLength(3);
  });
});

describe('GroupManager findGroupById and deleteGroup', () => {
  test('finds a group by numeric or text id', () => {
    const manager = new GroupManager();
    const group = manager.createGroup(form());
    expect(manager.findGroupById(1)).toBe(group);
    expect(manager.findGroupById('1')).toBe(group);
  });

  test.each(['2', 'abc', '0', undefined])('returns null for unknown id %p', (id) => {
    const manager = new GroupManager();
    manager.createGroup(form());
    expect(manager.findGroupById(id)).toBeNull();
  });

  test('deletes only the chosen group, even when another looks identical', () => {
    const manager = new GroupManager();
    const first = manager.createGroup(form());
    const twin = manager.createGroup(form());
    expect(manager.deleteGroup('1')).toBe(true);
    expect(manager.getGroups()).toEqual([twin]);
    expect(manager.findGroupById(first.id)).toBeNull();
  });

  test('returns false and changes nothing for an unknown id', () => {
    const manager = new GroupManager();
    manager.createGroup(form());
    expect(manager.deleteGroup('99')).toBe(false);
    expect(manager.getGroups()).toHaveLength(1);
  });

  test('ids are not reused after a delete', () => {
    const manager = new GroupManager();
    manager.createGroup(form());
    manager.deleteGroup(1);
    expect(manager.createGroup(form()).id).toBe(2);
  });
});
