# StudyHub Web – Sprint Backlog (Project 2)

Sprint: November 24 – December 4, 2026. Estimates are planning hours. The
"remaining" columns are filled in at each weekly checkpoint with the hours
still left on each task; past observations are never rewritten.

| Task | Story | Description | Estimate (h) | Depends on | Remaining Nov 30 | Remaining Dec 4 |
| --- | --- | --- | ---: | --- | ---: | ---: |
| S0 | All | Set up repository: documentation, base Node.js project, dev/release branches, branch protection, CI | 2 | None | | |
| T1 | US1 | Course and CourseCatalog modules with unit tests | 1.5 | S0 | | |
| T2 | US3, US5 | StudyGroup module with constructor validation and unit tests | 1.5 | S0 | | |
| T3 | US2, US4, US5, US6 | GroupManager: create, find (course filter + search), look up and delete groups, with unit tests | 2 | T1, T2 | | |
| T4 | US1, US2, US4 | Groups page: course filter, course-code search, group list and empty states | 2 | T3 | | |
| T5 | US5 | Create-group page: form, validation messages that keep entered values, Cancel | 1.5 | T3, T4 | | |
| T6 | US3 | Group details page and not-found page | 1 | T3, T4 | | |
| T7 | US6 | Delete confirmation page, Cancel, and removal | 1 | T3, T6 | | |
| T8 | All | Route tests for every page, regression run, manual verification on VLab | 1.5 | T4–T7 | | |
| T9 | All | Deploy to AWS Elastic Beanstalk with continuous deployment from release | 1.5 | T8 | | |
| T10 | All | Update README and backlogs, final dev → release pull request | 1 | T9 | | |
| Total | | | 16.5 | | | |

## Working process

1. Create `feature/<task-name>` from the latest `dev`.
2. Write tests alongside the code; keep significant logic out of route handlers.
3. Run `npm run lint` and `npm test` locally before pushing.
4. Open a pull request into `dev`; merge only after CI passes.
5. Commit one coherent change at a time: a subject of about 50 characters, a
   blank line, then what changed and why. A fix references the commit it corrects.

## Progress record – November 24, 2026

The Nov 30 and Dec 4 checkpoint columns stay blank until those dates.

| Task | Status | Evidence |
| --- | --- | --- |
| S0 | Complete | PR #1; dev and release protected, `build-and-test` required |
| T1 | Complete | PR #2 – Course, CourseCatalog |
| T2 | Complete | PR #3 – StudyGroup |
| T3 | Complete | PR #4 – GroupManager |
| T4 | Complete | PR #5 – group list page, home redirect |
| T5 | Complete | PR #6 – create-group page |
| T6 | Complete | PR #7 – group details and not-found pages |
| T7 | Complete | PR #8 – delete with confirmation |
| T8 | Complete on macOS; VLab check pending | 137 passing tests, 100% line coverage; manual walkthrough in [Verification.md](Verification.md) |
| T9 | Complete | PR #10 – deploy workflow; environment `Studyhub-web-env` (us-east-2) created and checked on Nov 24 |
| T10 | Complete | This documentation update and the final dev → release pull request |
