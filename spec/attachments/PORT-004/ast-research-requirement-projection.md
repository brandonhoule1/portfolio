# AST research: requirement projection

Command: fspec astgrep --pattern 'projectRequirements($UNITS, $META)' --lang js --path src

Observed match: src/catalog.mjs:14, where repository work units and the public metadata map are projected.

Conclusion: integration coverage should exercise the repository-backed projection and generated HTML.
