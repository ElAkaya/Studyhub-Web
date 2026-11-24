'use strict';
/**
 * Route tests for deleting a group with confirmation (US6).
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const request = require('supertest');
const { createApp } = require('../../src/app');
const { GroupManager } = require('../../src/model/group-manager');

/**
 * Create a manager holding two ENG101 groups with ids 1 and 2.
 *
 * @returns {GroupManager} the manager under test
 */
function managerWithTwoGroups() {
  const groupManager = new GroupManager();
  const base = { courseCode: 'ENG101', capacity: '4', description: 'Essay review', meetingTime: 'Fridays', location: 'Writing center' };
  groupManager.createGroup({ ...base, name: 'Essay Editors' });
  groupManager.createGroup({ ...base, name: 'Thesis Thinkers' });
  return groupManager;
}

describe('GET /groups/:id/delete', () => {
  test('asks for confirmation naming the group, with Delete and Cancel', async () => {
    const response = await request(createApp({ groupManager: managerWithTwoGroups() })).get('/groups/1/delete');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Delete this study group?');
    expect(response.text).toContain('Essay Editors');
    expect(response.text).toContain('action="/groups/1/delete"');
    expect(response.text).toContain('href="/groups/1">Cancel</a>');
  });

  test('is linked from the details page', async () => {
    const response = await request(createApp({ groupManager: managerWithTwoGroups() })).get('/groups/1');
    expect(response.text).toContain('href="/groups/1/delete"');
  });

  test('shows not found for an unknown group', async () => {
    const response = await request(createApp()).get('/groups/9/delete');
    expect(response.status).toBe(404);
  });

  test('viewing the confirmation alone deletes nothing', async () => {
    const groupManager = managerWithTwoGroups();
    await request(createApp({ groupManager })).get('/groups/1/delete');
    expect(groupManager.getGroups()).toHaveLength(2);
  });
});

describe('POST /groups/:id/delete', () => {
  test('deletes only the confirmed group and returns to the list without it', async () => {
    const groupManager = managerWithTwoGroups();
    const app = createApp({ groupManager });
    const response = await request(app).post('/groups/1/delete');
    expect(response.status).toBe(303);
    expect(response.headers.location).toBe('/groups');
    const list = await request(app).get('/groups');
    expect(list.text).not.toContain('Essay Editors');
    expect(list.text).toContain('Thesis Thinkers');
  });

  test('a deleted group\'s page then shows not found', async () => {
    const app = createApp({ groupManager: managerWithTwoGroups() });
    await request(app).post('/groups/2/delete');
    const response = await request(app).get('/groups/2');
    expect(response.status).toBe(404);
  });

  test.each(['9', 'abc'])('responds not found for id %p and changes nothing', async (id) => {
    const groupManager = managerWithTwoGroups();
    const response = await request(createApp({ groupManager })).post(`/groups/${id}/delete`);
    expect(response.status).toBe(404);
    expect(groupManager.getGroups()).toHaveLength(2);
  });
});
