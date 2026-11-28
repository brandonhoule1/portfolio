const resumeControls = document.querySelector('.resume-detail-controls');

resumeControls?.addEventListener('click', event => {
  const button = event.target.closest('[data-resume-toggle]');
  if (!button) return;
  const expand = button.dataset.resumeToggle === 'expand';
  const details = document.querySelectorAll('.resume-page details.resume-detail');
  details.forEach(detail => { detail.open = expand; });
  resumeControls.querySelector('.resume-detail-status').textContent = expand
    ? `All ${details.length} detail sections expanded.`
    : `All ${details.length} detail sections collapsed.`;
});
