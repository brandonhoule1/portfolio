export function renderSiteHeader(active = '') {
  const links = [
    ['/leadership.html', 'Leadership', 'leadership'],
    ['/ai-enablement.html', 'AI Enablement', 'ai-enablement'],
    ['/first-90-days.html', 'First 90 days', 'first-90-days'],
    ['/case-studies.html', 'Case studies', 'case-studies'],
    ['/how-this-should-be-made.html', 'How this should be made', 'process'],
    ['/independent/', 'Independent studies', 'independent'],
    ['/blog/', 'Blog', 'blog'],
    ['/contact/', 'Contact', 'contact'],
    ['/resume.html', 'Resume', 'resume']
  ];
  const nav = links.map(([href, label, id]) => '<a href="' + href + '"' + (active === id ? ' aria-current="page"' : '') + '>' + label + '</a>').join('');
  return '<header><a class="brand" href="/" aria-label="Brandon Houle, Technology Leader / Innovator"><span class="brand-name">Brandon Houle</span><span class="brand-role">Technology Leader / Innovator</span></a><nav aria-label="Main navigation">' + nav + '</nav></header>';
}

export function renderSiteFooter() {
  return '<footer class="site-footer"><div class="footer-intro"><a class="brand" href="/"><span class="brand-name">Brandon Houle</span><span class="brand-role">Technology Leader / Innovator</span></a><p>AI for routine work. People bring judgment, feeling, thinking, creativity, and decisions.</p></div><div class="footer-links"><span class="footer-label">PROFILE</span><a href="/recruiter/">Recruiter guide</a><a href="/resume.html">Online resume</a><a href="/downloads/Brandon-Houle-Resume.pdf">Download resume</a><a href="https://www.linkedin.com/in/brandon-houle">LinkedIn</a></div><div class="footer-links"><span class="footer-label">WORK & WRITING</span><a href="/leadership.html">Leadership</a><a href="/ai-enablement.html">AI Enablement</a><a href="/how-i-think-about-ai.html">How I think about AI</a><a href="/first-90-days.html">First 90 days</a><a href="/case-studies.html">Case studies</a><a href="/blog/">Blog</a><a href="/how-this-should-be-made.html">How this should be made</a></div><div class="footer-links"><span class="footer-label">INDEPENDENT STUDIES</span><a href="/independent/">Independent studies</a></div><div class="footer-links"><span class="footer-label">CONTACT</span><a href="/contact/">Contact form</a><a href="https://brandonhoule.com">brandonhoule.com</a></div><div class="footer-base"><span>Brandon Houle · Technology Leader / Innovator</span><span>Built in the open, with evidence.</span></div></footer>';
}

export function applySiteShell(html, active = '', options = {}) {
  const withHeader = replaceShellMarker(html, '<!--SITE_HEADER-->', renderSiteHeader(active));
  return options.includeFooter === false
    ? withHeader
    : replaceShellMarker(withHeader, '<!--SITE_FOOTER-->', renderSiteFooter());
}

function replaceShellMarker(html, marker, content) {
  const first = html.indexOf(marker);
  if (first < 0 || html.indexOf(marker, first + marker.length) >= 0) {
    throw new Error(`Expected exactly one ${marker} marker in page template.`);
  }
  return html.slice(0, first) + content + html.slice(first + marker.length);
}
