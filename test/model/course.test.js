'use strict';
/**
 * Unit tests for Course.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const { Course } = require('../../src/model/course');

describe('Course constructor', () => {
  test('stores a trimmed uppercase code and a trimmed title', () => {
    const course = new Course('  cs101 ', '  Introduction to Programming ');
    expect(course.code).toBe('CS101');
    expect(course.title).toBe('Introduction to Programming');
  });

  test.each([undefined, null, '', '   ', 101])('rejects code %p', (code) => {
    expect(() => new Course(code, 'Title')).toThrow('Must provide a nonblank course code.');
  });

  test.each([undefined, null, '', '   ', 5])('rejects title %p', (title) => {
    expect(() => new Course('CS101', title)).toThrow('Must provide a nonblank course title.');
  });

  test('is immutable', () => {
    const course = new Course('CS101', 'Intro');
    expect(Object.isFrozen(course)).toBe(true);
  });
});

describe('Course toString', () => {
  test('joins code and title with a separator', () => {
    expect(new Course('cs201', 'Data Structures').toString()).toBe('CS201 - Data Structures');
  });
});
