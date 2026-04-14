# CarStory

CarStory is a static, mobile-first dashboard for tracking a single car and its service history.

## Deployment

The project is configured for GitHub Pages with a GitHub Actions workflow.
Each push to `main` triggers deployment of the static site.

If GitHub Pages is not active yet, open the repository settings and set the Pages source to `GitHub Actions`.

## Structure

```text
Car Info/
|- index.html
|- src/
|  |- css/
|  |  \- app.css
|  \- js/
|     |- app.js
|     \- firebase-config.js
|- assets/
|  |- favicons/
|  \- icons/
|     |- navigation/
|     \- status/
|- docs/
|  \- project-plan.txt
|- firebase.json
\- firestore.rules.txt
```

## Files

- index.html - root entry point for the static app
- src/css/app.css - UI styling and responsive layout
- src/js/app.js - UI rendering, local state, and Firebase sync hooks
- src/js/firebase-config.js - Firebase app initialization for the client
- assets/icons/navigation/ - bottom navigation icons
- assets/icons/status/ - service status icons used in cards
- assets/favicons/ - favicon files used by the app shell
- docs/project-plan.txt - project notes and implementation plan
- firebase.json - Firebase project configuration
- firestore.rules.txt - Firestore security rules

## Run

Open index.html in the repository root in a browser.
