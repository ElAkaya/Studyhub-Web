'use strict';
/**
 * Unit tests for CourseCatalog.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const { Course } = require('../../src/model/course');
const { CourseCatalog } = require('../../src/model/course-catalog');

describe('CourseCatalog constructor', () => {
  test('defaults to the four demonstration courses in display order', () => {
    const codes = new CourseCatalog().getCourses().map((course) => course.code);
    expect(codes).toEqual(['CS101', 'CS201', 'MATH101', 'ENG101']);
  });

  test('accepts a custom list of courses', () => {
    const catalog = new CourseCatalog([new Course('BIO1107', 'Biology')]);
    expect(catalog.getCourses()).toHaveLength(1);
  });

  test.each([[[]], [null], ['CS101']])('rejects an empty or non-array list %p', (courses) => {
    expect(() => new CourseCatalog(courses)).toThrow('Must provide at least one course.');
  });

  test('rejects entries that are not courses', () => {
    expect(() => new CourseCatalog([{ code: 'CS101', title: 'Fake' }]))
      .toThrow('Every catalog entry must be a Course.');
  });

  test('rejects duplicate course codes', () => {
    const duplicates = [new Course('CS101', 'A'), new Course('cs101', 'B')];
    expect(() => new CourseCatalog(duplicates)).toThrow('Course codes in a catalog must be unique.');
  });

  test('cannot be changed through the returned list', () => {
    const courses = new CourseCatalog().getCourses();
    expect(Object.isFrozen(courses)).toBe(true);
  });
});

describe('CourseCatalog findByCode', () => {
  const catalog = new CourseCatalog();

  test('finds a course ignoring case and surrounding spaces', () => {
    expect(catalog.findByCode('  math101 ').title).toBe('College Algebra');
  });

  test.each(['', '   ', 'CS', 'CS1010', 'HIST101'])('returns null for blank, partial or unknown code %p', (code) => {
    expect(catalog.findByCode(code)).toBeNull();
  });

  test('rejects a missing code', () => {
    expect(() => catalog.findByCode(undefined)).toThrow('Must provide a course code to look up.');
  });
});
