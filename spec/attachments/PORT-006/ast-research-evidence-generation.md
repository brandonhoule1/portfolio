# AST research: evidence generation

Command: fspec astgrep --pattern 'fs.writeFileSync($A, $B)' --lang js --path scripts/build.mjs

Observed matches: the static build writes generated requirements JSON/HTML and quality evidence JSON/HTML. The evidence page projection is produced from the report object by src/html.mjs.

Conclusion: the public evidence page is generated from a sanitized report during the build; CI creates that report only after running the quality checks.
