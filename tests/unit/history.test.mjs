import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, parseCommitLog, readPublishedHistory } from '../../src/history.mjs';

test('commit parser keeps valid revisions and drops malformed records', () => {
  const sha = 'a'.repeat(40);
  const commits = parseCommitLog(`${sha}\t2026-11-23\tA & <b> change\nnot-a-sha\t2026-11-23\tbad`);
  assert.equal(commits.length, 1);
  assert.equal(commits[0].shortSha, 'aaaaaaa');
  assert.equal(commits[0].subject, 'A & <b> change');
});

test('commit subject HTML is escaped before rendering', () => {
  assert.equal(escapeHtml('<script src="x">'), '&lt;script src=&quot;x&quot;&gt;');
});

test('published history reads all public commit data without exposing author metadata', async () => {
  const sha = 'b'.repeat(40);
  const calls = [];
  const commits = await readPublishedHistory('.', async url => {
    calls.push(url);
    return { ok: true, json: async () => [{
      sha,
      commit: { author: { date: '2026-11-23T12:00:00Z', email: 'private@example.com' }, message: 'First line\nLong body' },
      author: { login: 'public-user' }
    }] };
  });
  assert.equal(calls.length, 1);
  assert.equal(commits.length, 1);
  assert.deepEqual(commits[0], { sha, shortSha: 'bbbbbbb', date: '2026-11-23', subject: 'First line' });
});
