'use strict';
/**
 * Route tests for the base StudyHub web application.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const request = require('supertest');
const { createApp } = require('../src/app');

describe('base application', () => {
  test('home page responds with the StudyHub heading', async () => {
    const response = await request(createApp()).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<h1>StudyHub</h1>');
  });

  test('stylesheet is served from the public folder', async () => {
    const response = await request(createApp()).get('/styles.css');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/css/);
  });

  test('unknown paths respond with a 404 page', async () => {
    const response = await request(createApp()).get('/no-such-page');
    expect(response.status).toBe(404);
    expect(response.text).toContain('Page not found');
  });
});
