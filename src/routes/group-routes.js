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

/** Form fields in the order they appear on the create-group page. */
const FORM_FIELDS = ['name', 'courseCode', 'capacity', 'description', 'meetingTime', 'location'];

/**
 * Copy the create-group form fields from a request body as text.
 *
 * @param {object} body the parsed form body
 * @returns {object} one string per form field, blank when missing
 */
function readGroupForm(body) {
  const form = {};
  for (const field of FORM_FIELDS) {
    form[field] = queryText(body?.[field]);
  }
  return form;
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

  router.get('/new', (request, response) => {
    response.render('group-form', {
      title: 'Create a study group',
      courses: groupManager.getCourses(),
      form: readGroupForm({}),
      error: null,
    });
  });

  router.post('/', (request, response) => {
    const form = readGroupForm(request.body);
    try {
      groupManager.createGroup(form);
      response.redirect(303, '/groups');
    } catch (error) {
      response.status(400).render('group-form', {
        title: 'Create a study group',
        courses: groupManager.getCourses(),
        form,
        error: error.message,
      });
    }
  });

  router.get('/:id', (request, response) => {
    const group = groupManager.findGroupById(request.params.id);
    if (group === null) {
      response.status(404).render('group-not-found', { title: 'Group not found' });
      return;
    }
    const course = groupManager.getCourses().find((candidate) => candidate.code === group.courseCode);
    response.render('group-details', { title: group.name, group, course });
  });

  return router;
}

module.exports = { createGroupRouter, readGroupForm };
