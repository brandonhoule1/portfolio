import { execFileSync } from 'node:child_process';

export function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function parseCommitLog(raw) {
  return raw.split(/\r?\n/).filter(Boolean).map(line => {
    const [sha, date, ...subject] = line.split('\t');
    if (!/^[a-f0-9]{40}$/i.test(sha || '') || !/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return null;
    return { sha, shortSha: sha.slice(0, 7), date, subject: subject.join('\t').slice(0, 240) };
  }).filter(Boolean);
}

export function readCommitHistory(cwd) {
  try {
    const raw = execFileSync('git', ['log', '--date=short', '--pretty=format:%H%x09%ad%x09%s'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return parseCommitLog(raw);
  } catch {
    return [];
  }
}

export function renderCommitList(commits) {
  return commits.map(commit => `<li><time datetime="${commit.date}">${commit.date}</time><a href="https://github.com/brandonhoule1/portfolio/commit/${commit.sha}">${escapeHtml(commit.subject)}</a><code>${commit.shortSha}</code></li>`).join('\n');
}
