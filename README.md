# StudyHub Web

StudyHub is a campus study-group finder. Students browse the demonstration
semester's courses, find study groups for a course, search by course code,
view a group's meeting details, create a group with a member limit and delete
a group. Project 2 reimplements the Project 1 JavaFX MVP as a Node.js web
application.

## Documentation

- [Product backlog](documentation/Product-Backlog.md)
- [Sprint backlog](documentation/Sprint-Backlog.md)

## Requirements

- Node.js 20.19 or newer (developed and tested in CI with Node.js 24.13.0 and npm 11.14.0)

## Run the application (VLab or any computer)

```bash
npm install
npm start
```

Open http://localhost:8080. Press Ctrl+C in the terminal to stop the server.
To use another port: `PORT=8081 npm start` (macOS/Linux) or
`set PORT=8081 && npm start` (Windows Command Prompt).

## Checks

```bash
npm run lint   # compile check: ESLint parses every file and reports errors
npm test       # Jest unit and route tests
```

## Branching and CI

- `dev` is the default branch; `release` holds reviewed releases.
- Both branches are protected: changes arrive only through pull requests, and
  the `build-and-test` CI check must pass.
- Work happens on `feature/<task-name>` branches created from `dev` and merged
  back into `dev` through a pull request.
- CI (`.github/workflows/ci.yml`) runs on every push and pull request to `dev`
  and `release`: install, ESLint compile check, then all tests.

## AI assistance

This project was developed with assistance from Claude (Anthropic). Claude
generated initial implementations, tests and documentation and guided the
repository, CI and deployment setup. Moria El Akaya reviewed, ran and
committed all code. Files with AI-drafted content say so in their header
docstring.
