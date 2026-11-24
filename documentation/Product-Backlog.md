# StudyHub Web – Product Backlog

StudyHub is a campus study-group finder. Project 2 reimplements the Project 1
MVP (stories US1–US6, approved October 11, 2026) as a Node.js web application.
Stories are listed in priority order. Items marked **Deferred** are outside the
Project 2 scope and are kept here so the backlog stays complete.

| ID | User story | Acceptance criteria | Priority | Status |
| --- | --- | --- | --- | --- |
| US1 | As a student, I want to browse the courses offered this semester so that I can find groups for my classes. | A clearly labeled demonstration catalog (CS101, CS201, MATH101, ENG101) is shown. Choosing a course filters the group list. No university integration is implied. | 1 | Project 2 |
| US2 | As a student, I want to see the study groups for a course so that I can pick one that fits me. | Only the chosen course's groups are listed, with a clear message when there are none and a way to show all groups again. | 2 | Project 2 |
| US3 | As a student, I want to view a group's details so that I know when and where it meets. | A details page shows name, course, description, meeting time, location and capacity. An unknown group shows a not-found message. | 3 | Project 2 |
| US4 | As a student, I want to search groups by course code so that I can find groups quickly. | Search trims input and ignores case. Partial codes match (for example "CS"). Empty search shows every group allowed by the course filter. Course filter and search combine. No matches shows an empty state. | 4 | Project 2 |
| US5 | As a student, I want to create a study group with a member limit so that classmates can join it. | The form requires a catalog course, a nonblank name, description, meeting time and location, and a positive whole-number capacity. Invalid input keeps the entered values and explains the problem. Cancel changes nothing. | 5 | Project 2 |
| US6 | As a group leader, I want to delete a group so that outdated groups are removed. | Deleting asks for confirmation first. Cancel keeps the group. After confirming, the list no longer shows it. | 6 | Project 2 |
| US7 | As a student, I want to join and leave a group so that the leader knows who is attending. | Members are tracked and capacity is enforced. | 7 | Deferred |
| US8 | As a group leader, I want to post announcements so that members get updates. | Announcements appear on the group's page. | 8 | Deferred |
| US9 | As a group leader, I want to edit my group's meeting time and location so that details stay current. | Edits are validated like creation. | 9 | Deferred |
| US10 | As a student, I want an account so that my groups are tied to me. | Sign-up, login and per-user ownership of groups. | 10 | Deferred |
| US11 | As an administrator, I want to moderate groups and users so that the platform stays safe. | Administrators can remove groups and suspend users. | 11 | Deferred |
| US12 | As a student, I want my groups saved between visits so that nothing is lost. | Groups persist in a database across server restarts. | 12 | Deferred |

## Known limitations of the Project 2 scope

- Data is kept in memory on the server and resets when the server restarts, as in Project 1.
- The course catalog is a fixed demonstration list, not an official university catalog.
- There are no accounts, so any visitor can create or delete groups.
- Meeting time is descriptive text, not a scheduling engine.
