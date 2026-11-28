import { manualCases, renderManualCasesTable } from './manual-cases.mjs';

export { manualCases };

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

export function renderRequirements(requirements, report = {}) {
  const cards = requirements.map(item => `<article class="card" id="${escapeHtml(item.id)}"><div class="card-top"><span class="id">${escapeHtml(item.id)}</span><span class="status">${escapeHtml(item.status)}</span></div><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description)}</p><h3>Acceptance criteria</h3><ul>${item.acceptanceCriteria.map(ac => `<li>${escapeHtml(ac)}</li>`).join('')}</ul>${item.relatesTo.length ? `<p class="related">Relates to: ${item.relatesTo.map(id => `<a href="#${escapeHtml(id)}">${escapeHtml(id)}</a>`).join(', ')}</p>` : ''}<a href="https://github.com/brandonhoule1/portfolio/issues/${item.githubIssue}">GitHub issue #${item.githubIssue}</a></article>`).join('\n');
  const evidenceRows = Object.entries(report.checks ?? {}).map(([name, result]) => `<tr><th scope="row">${escapeHtml(name)}</th><td>${escapeHtml(result.status)}</td><td>${escapeHtml(result.summary)}</td></tr>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Portfolio requirements, acceptance criteria, current status, and quality evidence.">
  <title>How this should be made | Brandon Houle</title>
  <link rel="stylesheet" href="/site.css">
</head>
<body>
<!--SITE_HEADER-->
<main>
  <p class="eyebrow">OPEN PROCESS · TRACEABLE WORK</p>
  <h1>How this should be made</h1>
  <p class="intro">A single view of the requirements, test evidence, and decisions shaping this portfolio. Requirements are sourced from the project specification; statuses link to the work tracked in GitHub.</p>
  <div class="actions compact">
    <a class="button" href="/manual-test-cases.md" download>Download manual test cases · Markdown</a>
    <a class="button secondary" href="/manual-test-cases.csv" download>Download CSV</a>
  </div>
  <section>
    <div class="section-heading"><div><p class="eyebrow">REQUIREMENTS</p><h2>What this portfolio needs to do</h2></div><span class="note">Grid · status · acceptance criteria · relationships</span></div>
    <div class="grid" aria-label="Public requirements">${cards}</div>
  </section>
  <section class="section evidence-block">
    <div class="section-heading"><div><p class="eyebrow">QUALITY EVIDENCE</p><h2>What has been checked</h2></div><span class="note">Commit-scoped · sanitized</span></div>
    <p class="intro">Evidence corresponds to the revision shown below. A local revision is a workspace snapshot, not production evidence. Performance figures are one-pass observations, not load tests or statistical benchmarks.</p>
    <p class="note">Generated: <time>${escapeHtml(report.generatedAt ?? 'Not yet run')}</time> · Revision: <code>${escapeHtml(report.revision ?? 'local')}</code></p>
    <div class="table-wrap"><table><thead><tr><th>Check</th><th>Status</th><th>Summary</th></tr></thead><tbody>${evidenceRows || '<tr><td colspan="3">Checks have not run yet.</td></tr>'}</tbody></table></div>
    <p><a href="/evidence.json">Download machine-readable evidence (JSON)</a></p>
  </section>
  <section class="section">
    <p class="eyebrow">MANUAL REVIEW</p><h2>Cases to run by hand</h2>
    <p>These cases cover positive, negative, data, integration, edge, usability, performance, and security paths. They are a test plan, not a record of completed execution; each currently reads <strong>Not run</strong>.</p>
    <div class="table-wrap"><table><thead><tr><th>ID</th><th>Category</th><th>Priority</th><th>Scenario</th><th>Status</th></tr></thead><tbody>${renderManualCasesTable()}</tbody></table></div>
    <p class="note">The downloadable files include setup, steps, and expected results for every case.</p>
  </section>
  <p class="note">Only explicitly public requirements appear here. Internal setup records and raw CI logs remain out of the public catalog.</p>
</main>
<!--SITE_FOOTER-->
</body>
</html>`;
}

export function renderEvidence(report) {
  const rows = Object.entries(report.checks ?? {}).map(([name, result]) => '<tr><th scope="row">' + escapeHtml(name) + '</th><td><span class="pill ' + (result.status === 'passed' ? 'passed' : 'pending') + '">' + escapeHtml(result.status) + '</span></td><td>' + escapeHtml(result.summary) + ((result.details ?? []).length ? '<ul>' + result.details.map(item => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>' : '') + '</td></tr>').join('');
  const suggestions = (report.securitySuggestions ?? []).map(item => '<li>' + escapeHtml(item) + '</li>').join('');
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Sanitized CI, test, performance, and security evidence."><title>Quality evidence | Brandon Houle</title><link rel="stylesheet" href="/site.css"></head><body><header><a class="brand" href="/"><span class=brand-name>Brandon Houle</span><span class=brand-role>Technology Leader</span></a><nav><a href="/requirements.html">Requirements</a><a href="/evidence.html" aria-current="page">Quality evidence</a></nav></header><main><p class="eyebrow">ENGINEERING EVIDENCE</p><h1>Quality evidence</h1><p class="intro">Evidence corresponds to the revision shown below. A local revision is a workspace snapshot, not production evidence. Performance figures are one-pass observations, not load tests or statistical benchmarks.</p><p class="note">Generated: <time>' + escapeHtml(report.generatedAt ?? 'Not yet run') + '</time> · Revision: <code>' + escapeHtml(report.revision ?? 'local') + '</code></p><div class="table-wrap"><table><thead><tr><th>Check</th><th>Status</th><th>Summary</th></tr></thead><tbody>' + (rows || '<tr><td colspan="3">Checks have not run yet.</td></tr>') + '</tbody></table></div><h2>Security suggestions</h2><ul>' + (suggestions || '<li>Review dependency and source scan results in the CI summary.</li>') + '</ul><p class="note">Detailed logs, browser traces, and security scanner output remain in CI artifacts. Public summaries omit credentials and exploit details.</p></main><footer>Published evidence comes from deployment builds and is tied to the source revision shown above.</footer></body></html>';
}
