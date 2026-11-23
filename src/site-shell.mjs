export function renderSiteHeader(active = '') {
  const links = [
    ['/#leadership', 'Leadership', 'leadership'],
    ['/#plan', 'First 90 days', 'plan'],
    ['/#case-studies', 'Case studies', 'case-studies'],
    ['/field-notes.html', 'Field Notes', 'field-notes'],
    ['/blog.html', 'Blog', 'blog'],
    ['/resume.html', 'Resume', 'resume']
  ];
  return `<header><a class="brand" href="/" aria-label="Brandon Houle, Technology Leader / Innovator"><span class="brand-name">Brandon Houle</span><span class="brand-role">Technology Leader / Innovator</span></a><nav aria-label="Main navigation">${links.map(([href,label,id]) => `<a href="${href}"${active === id ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav></header>`;
}

export function renderSiteFooter() {
  return `<footer class="site-footer"><div class="footer-intro"><a class="brand" href="/"><span class="brand-name">Brandon Houle</span><span class="brand-role">Technology Leader / Innovator</span></a><p>AI is for routine work, so people have more room to do what they do best: think.</p></div><div class="footer-links"><span class="footer-label">PROFILE</span><a href="/resume.html">Online resume</a><a href="/downloads/Brandon-Houle-Resume.pdf">Download resume</a><a href="https://www.linkedin.com/in/brandon-houle">LinkedIn</a></div><div class="footer-links"><span class="footer-label">WRITING & PROCESS</span><a href="/field-notes.html">Field Notes</a><a href="/blog.html">Blog</a><a href="/how-this-should-be-made.html">How this should be made</a></div><div class="footer-links"><span class="footer-label">CONTACT</span><a href="mailto:brandonhoule@gmail.com">brandonhoule@gmail.com</a><a href="https://brandonhoule.com">brandonhoule.com</a></div><div class="footer-base"><span>Brandon Houle · Technology Leader / Innovator</span><span>Built in the open, with evidence.</span></div></footer>`;
}

export function applySiteShell(html, active = '') {
  return html
    .replace('<!--SITE_HEADER-->', renderSiteHeader(active))
    .replace('<!--SITE_FOOTER-->', renderSiteFooter())
    .replace(/<header>[\s\S]*?<\/header>/, renderSiteHeader(active))
    .replace(/<footer>[\s\S]*?<\/footer>/, renderSiteFooter());
}
