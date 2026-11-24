# StudyHub Web – Manual Verification

## Automated checks

- `npm run lint`: no errors.
- `npm test`: 137 tests passing in 9 suites (model and route tests).
- `npx jest --coverage`: 100% line coverage of `src/` (server entry point excluded).
- CI `build-and-test` passed on every pull request into `dev` (PRs #1–#8).

## Manual walkthrough – November 24, 2026 (macOS, Node.js 24.13.0, `npm start`)

Performed by Moria El Akaya at http://localhost:8080. All steps behaved as expected.

| # | Story | Action | Expected result | Result |
| --- | --- | --- | --- | --- |
| 1 | US1, US2 | Open the site with no groups | Redirects to /groups; demonstration catalog notice; "No study groups have been created yet." | Pass |
| 2 | US5 | Create a group, Save with an empty form | Error message; nothing created | Pass |
| 3 | US5 | Fill in the form (CS101, capacity 5) and Save | Returns to the list showing the new group | Pass |
| 4 | US5 | Create a second group for MATH101 | Both groups listed | Pass |
| 5 | US1, US2, US4 | Use the Course filter, search "cs", then Show all | List narrows to matching groups; Show all restores both | Pass |
| 6 | US3 | Open a group's details, then Close | All details shown; Close returns to the list | Pass |
| 7 | US6 | Delete group, then Cancel | Group is kept | Pass |
| 8 | US6 | Delete group, then Delete | Group no longer listed | Pass |

## Still to verify

- The same walkthrough on the VLab environment (the instructor's review environment).
- The same walkthrough on the deployed AWS site (task T9).
