import fs from 'node:fs';
for (const folder of ['dist', 'test-results', 'playwright-report']) fs.rmSync(folder, { recursive: true, force: true });
