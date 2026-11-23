# AST research: browser navigation

Command: fspec astgrep --pattern 'await page.goto($URL)' --lang js --path tests

Observed matches: requirements page, evidence page, and home route single-pass performance navigation.

Conclusion: Playwright browser checks reach each intended public page through the running static server.
