# AST research: unit test assertions

Command: fspec astgrep --pattern 'assert.equal($A, $B)' --lang js --path tests

Observed matches:

- tests/integration/catalog-build.test.mjs: catalog length and public status assertions.
- tests/unit/catalog.test.mjs: projected status and HTML escaping assertions.

Conclusion: unit behavior is covered by deterministic Node assertions; CI must fail when these assertions fail.
