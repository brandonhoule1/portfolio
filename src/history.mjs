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

export async function readPublishedHistory(cwd, fetchImpl = fetch) {
  try {
    const commits = [];
    for (let page = 1; ; page += 1) {
      const response = await fetchImpl(`https://api.github.com/repos/brandonhoule1/portfolio/commits?per_page=100&page=${page}`, {
        headers: { accept: 'application/vnd.github+json', 'user-agent': 'houleb-portfolio-build' },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const batch = await response.json();
      if (!Array.isArray(batch)) throw new Error('GitHub API returned an unexpected response');
      for (const entry of batch) {
        const sha = entry?.sha;
        const date = entry?.commit?.author?.date?.slice(0, 10);
        const subject = entry?.commit?.message?.split(/\r?\n/, 1)[0] ?? '';
        if (/^[a-f0-9]{40}$/i.test(sha ?? '') && /^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
          commits.push({ sha, shortSha: sha.slice(0, 7), date, subject: subject.slice(0, 240) });
        }
      }
      if (batch.length < 100) return commits;
    }
  } catch {
    return readCommitHistory(cwd);
  }
}

export function renderCommitList(commits) {
  return commits.map(commit => `<li><time datetime="${commit.date}">${commit.date}</time><a href="https://github.com/brandonhoule1/portfolio/commit/${commit.sha}">${escapeHtml(commit.subject)}</a><code>${commit.shortSha}</code></li>`).join('\n');
}
