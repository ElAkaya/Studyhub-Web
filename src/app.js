'use strict';
/**
 * Builds the StudyHub web application without starting a server, so tests can
 * exercise every route in memory.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const path = require('node:path');
const express = require('express');
const { GroupManager } = require('./model/group-manager');
const { createGroupRouter } = require('./routes/group-routes');

/**
 * Create a configured Express application.
 *
 * @param {object} [options] application settings
 * @param {GroupManager} [options.groupManager] the group collection to use; a new empty one by default
 * @returns {import('express').Express} an app with views, static files and routes registered
 */
function createApp({ groupManager = new GroupManager() } = {}) {
  const app = express();
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/', (request, response) => {
    response.redirect('/groups');
  });
  app.use('/groups', createGroupRouter(groupManager));

  app.use((request, response) => {
    response.status(404).render('not-found', { title: 'Page not found' });
  });

  return app;
}

module.exports = { createApp };
