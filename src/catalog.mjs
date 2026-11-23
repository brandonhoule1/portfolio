import fs from 'node:fs';

export function projectRequirements(workUnits, publicMetadata) {
  const units = workUnits.workUnits ?? workUnits;
  return publicMetadata.filter(({ id }) => id.startsWith('PORT-') && units[id]).map(({ id, githubIssue, acceptanceCriteria }) => {
    const unit = units[id];
    return { id, title: unit.title, status: unit.status, description: unit.description, acceptanceCriteria, relatesTo: unit.relatesTo ?? [], githubIssue: Number(githubIssue) };
  });
}

export function loadCatalog(root = process.cwd()) {
  const units = JSON.parse(fs.readFileSync(root + '/spec/work-units.json', 'utf8'));
  const metadata = JSON.parse(fs.readFileSync(root + '/spec/public-requirements.json', 'utf8'));
  return projectRequirements(units, metadata);
}
