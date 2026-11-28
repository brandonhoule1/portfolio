import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Feature: spec/features/portfolio-security-hardening.feature
test('Pages security headers are built and executable scripts are self-hosted', () => {
  // @step Given the portfolio has been built for Cloudflare Pages
  const headers = fs.readFileSync(path.join('dist', '_headers'), 'utf8');
  assert.equal(headers, fs.readFileSync(path.join('public', '_headers'), 'utf8'));
  assert.match(headers, /^\/\*\s*$/m);
  assert.match(headers, /Content-Security-Policy:.*default-src 'self'/);
  assert.match(headers, /script-src 'self' https:\/\/challenges\.cloudflare\.com/);
  assert.match(headers, /frame-src https:\/\/challenges\.cloudflare\.com/);
  assert.match(headers, /connect-src 'self' https:\/\/challenges\.cloudflare\.com/);
  assert.doesNotMatch(headers, /unsafe-inline|unsafe-eval/);
  for (const directive of [
    'Strict-Transport-Security: max-age=31536000',
    'X-Content-Type-Options: nosniff',
    'X-Frame-Options: DENY',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Permissions-Policy:'
  ]) assert.ok(headers.includes(directive), `Missing ${directive}`);
  // @step Then each static response includes the content security policy and baseline browser security headers
  assert.match(headers, /X-Content-Type-Options: nosniff/);

  for (const file of ['contact/index.html', 'resume.html']) {
    const html = fs.readFileSync(path.join('dist', file), 'utf8');
    assert.match(html, /<script src="\/scripts\/(?:contact|resume)\.js" defer><\/script>/);
  }
  for (const file of walkHtml('dist')) {
    const html = fs.readFileSync(file, 'utf8');
    const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    assert.ok(scripts.every(([, attributes, body]) =>
      /\bsrc\s*=/.test(attributes) || /\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes) || !body.trim()
    ), `${file} contains executable inline script`);
  }
  // @step And contact and resume behavior loads from same-origin JavaScript without inline scripts
  assert.ok(fs.existsSync(path.join('dist', 'scripts', 'contact.js')));
  assert.ok(fs.existsSync(path.join('dist', 'scripts', 'resume.js')));
});

function* walkHtml(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walkHtml(filename);
    else if (entry.name.endsWith('.html')) yield filename;
  }
}
