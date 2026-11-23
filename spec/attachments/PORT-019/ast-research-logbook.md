# AST research: editorial profile and development logbook

- Date: 2026-11-23
- Tool: `fspec astgrep --pattern 'execFileSync($$$)' --lang javascript --path src/history.mjs`
- Result: matched the fixed-argument `git log` invocation in `readCommitHistory`; companion searches matched `fs.writeFileSync` build outputs and the HTML escaping call in `renderCommitList`.
- Relevant findings: this project builds static HTML in `scripts/build.mjs`. Commit history is acquired from the checked-out branch's reachable history using a fixed executable and argument list, parsed against full-SHA and ISO-date formats, and subjects are escaped before rendering. This excludes local-only FSPEC checkpoint refs. The output includes the hash/date/subject/link, not author emails or raw logs. The public site receives generated static files, including `commits.json`, rather than runtime Git access.
- Existing integration points: homepage source in `public/index.html`; build artifacts in `dist/`; CI quality job in `.github/workflows/quality.yml`.
- Scope: confirms the static rendering and source-escaping path for the public commit history requirement.
