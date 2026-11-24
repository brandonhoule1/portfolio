# AST research — shared portfolio navigation

Command: `fspec astgrep --pattern "function renderSiteHeader" --lang js --path src/site-shell.mjs`

Finding:
- src/site-shell.mjs:1:8:function renderSiteHeader(active = '') { 

This shared header function is the integration point for making the new route discoverable. `scripts/build.mjs` produces direct-addressable pages and applies the shared header to each route.
