# Brandon Houle Portfolio

Static portfolio and public engineering evidence site.

## Local quality run

Requirements: Node.js 22 or newer.

    npm ci
    npx playwright install chromium
    npm run ci:quality

The quality command runs unit tests, the build-backed integration tests, source and dependency security checks, Playwright GUI checks, and one single-pass browser performance observation. It writes a sanitized report to public/evidence.json and builds the public site in dist/.

The production branch history appears in the “How this should be made” area. Builds retrieve public repository history and fall back to the checked-out Git history. Commit subjects are HTML-escaped before publication; author email addresses and CI logs are excluded.

## Deployment

The GitHub Actions workflow runs for pull requests and pushes to main/master. Cloudflare Pages uses the same quality command as its build command and publishes dist/ only when it exits successfully. Raw reports and traces are retained as GitHub Actions artifacts; the site receives the sanitized summary.

## Requirements and issue tracking

FSPEC work units are the source for status, title, description, and relationships. spec/public-requirements.json explicitly selects public requirements and provides their acceptance criteria and linked GitHub issue numbers. Internal setup work is excluded from the public catalog.

The current work is tracked in [GitHub issues #1–#10](https://github.com/brandonhoule1/portfolio/issues).
