'use strict';
/**
 * Routes for the study-group pages. Handlers only read the request, call
 * GroupManager and choose a page; all validation and filtering live in the model.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const express = require('express');

/**
 * Read a query-string value as text, treating missing or repeated values as blank.
 *
 * @param {unknown} value a value from request.query
 * @returns {string} the value if it is a string, otherwise an empty string
 */
function queryText(value) {
  return typeof value === 'string' ? value : '';
}

/**
 * Create the router for all /groups pages.
 *
 * @param {import('../model/group-manager').GroupManager} groupManager the groups shown and changed by these pages
 * @returns {import('express').Router} the configured router
 */
function createGroupRouter(groupManager) {
  const router = express.Router();

  router.get('/', (request, response) => {
    const selectedCourse = queryText(request.query.course).trim().toUpperCase();
    const search = queryText(request.query.search);
    response.render('groups', {
      title: 'Study groups',
      courses: groupManager.getCourses(),
      selectedCourse,
      search,
      groups: groupManager.findGroups(selectedCourse, search),
      totalGroups: groupManager.getGroups().length,
    });
  });

  return router;
}

module.exports = { createGroupRouter };
