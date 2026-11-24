'use strict';
/**
 * Route tests for the create-group page (US5).
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const request = require('supertest');
const { createApp } = require('../../src/app');
const { GroupManager } = require('../../src/model/group-manager');
const { readGroupForm } = require('../../src/routes/group-routes');

const VALID_FORM = {
  name: 'Loop Lovers',
  courseCode: 'CS101',
  capacity: '6',
  description: 'Practice loops',
  meetingTime: 'Tuesdays at 5 PM',
  location: 'Library room 204',
};

describe('readGroupForm', () => {
  test('copies every field as text and blanks missing or non-text values', () => {
    expect(readGroupForm({ name: 'A', capacity: ['1', '2'], extra: 'x' })).toEqual({
      name: 'A', courseCode: '', capacity: '', description: '', meetingTime: '', location: '',
    });
  });

  test('treats a missing body as an empty form', () => {
    expect(readGroupForm(undefined).name).toBe('');
  });
});

describe('GET /groups/new', () => {
  test('shows an empty form with every catalog course, Save and Cancel', async () => {
    const response = await request(createApp()).get('/groups/new');
    expect(response.status).toBe(200);
    for (const field of ['name', 'courseCode', 'capacity', 'description', 'meetingTime', 'location']) {
      expect(response.text).toContain(`name="${field}"`);
    }
    expect(response.text).toContain('value="ENG101"');
    expect(response.text).toContain('>Save</button>');
    expect(response.text).toContain('href="/groups">Cancel</a>');
  });

  test('is linked from the group list', async () => {
    const response = await request(createApp()).get('/groups');
    expect(response.text).toContain('href="/groups/new"');
  });
});

describe('POST /groups', () => {
  test('creates a valid group and returns to the list showing it', async () => {
    const groupManager = new GroupManager();
    const app = createApp({ groupManager });
    const response = await request(app).post('/groups').type('form').send(VALID_FORM);
    expect(response.status).toBe(303);
    expect(response.headers.location).toBe('/groups');
    expect(groupManager.getGroups()).toHaveLength(1);
    const list = await request(app).get('/groups');
    expect(list.text).toContain('Loop Lovers');
  });

  test.each([
    [{ courseCode: '' }, 'Select a course from the catalog.'],
    [{ capacity: 'six' }, 'Capacity must be a positive whole number.'],
    [{ capacity: '0' }, 'within the integer range'],
    [{ name: '   ' }, 'Name must not be blank.'],
    [{ location: '' }, 'Location must not be blank.'],
  ])('rejects %p, explains why and keeps the entered values', async (change, message) => {
    const groupManager = new GroupManager();
    const response = await request(createApp({ groupManager }))
      .post('/groups').type('form').send({ ...VALID_FORM, ...change });
    expect(response.status).toBe(400);
    expect(response.text).toContain(message);
    expect(response.text).toContain('value="Tuesdays at 5 PM"');
    expect(groupManager.getGroups()).toHaveLength(0);
  });

  test('keeps the chosen course selected after an error', async () => {
    const response = await request(createApp())
      .post('/groups').type('form').send({ ...VALID_FORM, courseCode: 'math101', capacity: '' });
    expect(response.text).toContain('value="MATH101" selected');
  });

  test('escapes entered text when showing the form again', async () => {
    const response = await request(createApp())
      .post('/groups').type('form').send({ ...VALID_FORM, capacity: '', name: '"><b>x</b>' });
    expect(response.text).not.toContain('<b>x</b>');
  });
});
