'use strict';
/**
 * Route tests for the group details page (US3).
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const request = require('supertest');
const { createApp } = require('../../src/app');
const { GroupManager } = require('../../src/model/group-manager');

/**
 * Create an app holding one fully described CS201 group with id 1.
 *
 * @returns {import('express').Express} the app under test
 */
function appWithOneGroup() {
  const groupManager = new GroupManager();
  groupManager.createGroup({
    name: 'Tree Climbers',
    courseCode: 'CS201',
    capacity: '8',
    description: 'Binary trees and heaps',
    meetingTime: 'Thursdays at 6 PM',
    location: 'TLC 1110',
  });
  return createApp({ groupManager });
}

describe('GET /groups/:id', () => {
  test('shows every detail of the group', async () => {
    const response = await request(appWithOneGroup()).get('/groups/1');
    expect(response.status).toBe(200);
    for (const text of ['Tree Climbers', 'CS201 - Data Structures', 'Binary trees and heaps',
      'Thursdays at 6 PM', 'TLC 1110', '8']) {
      expect(response.text).toContain(text);
    }
  });

  test('offers a way back to the list', async () => {
    const response = await request(appWithOneGroup()).get('/groups/1');
    expect(response.text).toContain('href="/groups"');
  });

  test('is linked from the group list', async () => {
    const response = await request(appWithOneGroup()).get('/groups');
    expect(response.text).toContain('href="/groups/1"');
  });

  test.each(['2', '0', 'abc', '1.5'])('shows a not-found page for id %p', async (id) => {
    const response = await request(appWithOneGroup()).get(`/groups/${id}`);
    expect(response.status).toBe(404);
    expect(response.text).toContain('Group not found');
  });
});
