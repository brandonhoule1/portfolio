export function renderSiteHeader(active = '') {
  const links = [
    ['/leadership.html', 'Leadership', 'leadership'],
    ['/first-90-days.html', 'First 90 days', 'first-90-days'],
    ['/case-studies.html', 'Case studies', 'case-studies'],
    ['/blog/', 'Blog', 'blog'],
    ['/contact/', 'Contact', 'contact'],
    ['/resume.html', 'Resume', 'resume']
  ];
  return `<header><a class="brand" href="/" aria-label="Brandon Houle, Technology Leader / Innovator"><span class="brand-name">Brandon Houle</span><span class="brand-role">Technology Leader / Innovator</span></a><nav aria-label="Main navigation">${links.map(([href,label,id]) => `<a href="${href}"${active === id ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav></header>`;
}

export function renderSiteFooter() {
  return `<footer class="site-footer"><div class="footer-intro"><a class="brand" href="/"><span class="brand-name">Brandon Houle</span><span class="brand-role">Technology Leader / Innovator</span></a><p>AI can take on routine work. People need time to think.</p></div><div class="footer-links"><span class="footer-label">PROFILE</span><a href="/resume.html">Online resume</a><a href="/downloads/Brandon-Houle-Resume.pdf">Download resume</a><a href="https://www.linkedin.com/in/brandon-houle">LinkedIn</a></div><div class="footer-links"><span class="footer-label">WORK & WRITING</span><a href="/leadership.html">Leadership</a><a href="/first-90-days.html">First 90 days</a><a href="/case-studies.html">Case studies</a><a href="/blog/">Blog</a><a href="/how-this-should-be-made.html">Development record</a></div><div class="footer-links"><span class="footer-label">CONTACT</span><a href="/contact/">Contact form</a><a href="https://brandonhoule.com">brandonhoule.com</a></div><div class="footer-base"><span>Brandon Houle · Technology Leader / Innovator</span><span>Built in the open, with evidence.</span></div></footer>`;
}

export function applySiteShell(html, active = '') {
  return html
    .replace('<!--SITE_HEADER-->', renderSiteHeader(active))
    .replace('<!--SITE_FOOTER-->', renderSiteFooter())
    .replace(/<header>[\s\S]*?<\/header>/, renderSiteHeader(active))
    .replace(/<footer>[\s\S]*?<\/footer>/, renderSiteFooter());
}
