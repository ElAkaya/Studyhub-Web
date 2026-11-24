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

/**
 * Create a configured Express application.
 *
 * @returns {import('express').Express} an app with views, static files and routes registered
 */
function createApp() {
  const app = express();
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/', (request, response) => {
    response.render('index', { title: 'StudyHub' });
  });

  app.use((request, response) => {
    response.status(404).render('not-found', { title: 'Page not found' });
  });

  return app;
}

module.exports = { createApp };
