# AST research: leadership portfolio site

- Date: 2026-11-23
- Tool: `fspec astgrep --pattern 'function $FUNC($ARGS) { $$$BODY }' --lang javascript --path src`
- Result: matched `loadCatalog` in `src/catalog.mjs`, plus `escapeHtml` and `renderEvidence` in `src/html.mjs`.
- Relevant findings: the static site already has a centralized HTML escaping helper and a catalog projection that selects explicitly public `PORT-` work units. The new unified page extends that rendering path; the static build remains the output boundary. No client-side unsanitized HTML insertion path is introduced.
- Scope: source structure was reviewed before the new Gherkin scenarios were associated with the portfolio requirements.
