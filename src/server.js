'use strict';
/**
 * Starts the StudyHub web server. The port comes from the PORT environment
 * variable (set by cloud hosts) and defaults to 8080 for local use.
 *
 * @author Moria El Akaya
 * AI assistance: initial version drafted with Claude (Anthropic); reviewed,
 * run and tested by Moria El Akaya.
 */
const { createApp } = require('./app');

const DEFAULT_PORT = 8080;
const port = Number(process.env.PORT) || DEFAULT_PORT;

createApp().listen(port, () => {
  console.log(`StudyHub is running at http://localhost:${port}`);
});
