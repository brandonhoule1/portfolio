# AST research: single navigation

Command: fspec astgrep --pattern 'await page.goto($URL)' --lang js --path tests

Observed matches: two GUI page checks and one performance route navigation.

Conclusion: the performance spec should target its own isolated test and make only one browser navigation to the selected route.
