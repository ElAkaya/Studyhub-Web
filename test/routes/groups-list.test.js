'use strict';
/**
 * Route tests for the group list page (US1, US2, US4).
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const request = require('supertest');
const { createApp } = require('../../src/app');
const { GroupManager } = require('../../src/model/group-manager');

/**
 * Create an app whose manager already holds one CS101 group and one MATH101 group.
 *
 * @returns {import('express').Express} the app under test
 */
function appWithGroups() {
  const groupManager = new GroupManager();
  const base = { capacity: '5', description: 'Practice', meetingTime: 'Mondays at 3 PM', location: 'Library' };
  groupManager.createGroup({ ...base, name: 'Loop Lovers', courseCode: 'CS101' });
  groupManager.createGroup({ ...base, name: 'Algebra Aces', courseCode: 'MATH101' });
  return createApp({ groupManager });
}

describe('GET /groups', () => {
  test('lists the demonstration courses in the course filter', async () => {
    const response = await request(createApp()).get('/groups');
    expect(response.status).toBe(200);
    for (const code of ['CS101', 'CS201', 'MATH101', 'ENG101']) {
      expect(response.text).toContain(`value="${code}"`);
    }
    expect(response.text).toContain('Demonstration semester catalog');
  });

  test('shows an empty state when no groups exist', async () => {
    const response = await request(createApp()).get('/groups');
    expect(response.text).toContain('No study groups have been created yet.');
    expect(response.text).toContain('0 groups shown');
  });

  test('shows every group when no filter is chosen', async () => {
    const response = await request(appWithGroups()).get('/groups');
    expect(response.text).toContain('Loop Lovers');
    expect(response.text).toContain('Algebra Aces');
    expect(response.text).toContain('2 groups shown');
  });

  test('filters by the selected course and keeps it selected', async () => {
    const response = await request(appWithGroups()).get('/groups?course=math101');
    expect(response.text).toContain('Algebra Aces');
    expect(response.text).not.toContain('Loop Lovers');
    expect(response.text).toContain('value="MATH101" selected');
    expect(response.text).toContain('1 group shown');
  });

  test('searches by partial course code and keeps the search text', async () => {
    const response = await request(appWithGroups()).get('/groups?search=cs');
    expect(response.text).toContain('Loop Lovers');
    expect(response.text).not.toContain('Algebra Aces');
    expect(response.text).toContain('value="cs"');
  });

  test('shows a no-match message when filters exclude every group', async () => {
    const response = await request(appWithGroups()).get('/groups?course=ENG101');
    expect(response.text).toContain('No groups match this course and search.');
  });

  test('ignores repeated query values instead of failing', async () => {
    const response = await request(appWithGroups()).get('/groups?search=cs&search=math');
    expect(response.status).toBe(200);
    expect(response.text).toContain('2 groups shown');
  });

  test('escapes user text in the page', async () => {
    const groupManager = new GroupManager();
    groupManager.createGroup({
      name: '<script>x</script>', courseCode: 'CS101', capacity: '3',
      description: 'd', meetingTime: 't', location: 'l',
    });
    const response = await request(createApp({ groupManager })).get('/groups');
    expect(response.text).not.toContain('<script>x</script>');
    expect(response.text).toContain('&lt;script&gt;');
  });
});
