import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const rootDir = join(import.meta.dirname, '..');

const headerPath = join(rootDir, 'README-header.md');
const readmePath = join(rootDir, 'README.md');

const header = await readFile(headerPath, 'utf8');
const readme = await readFile(readmePath, 'utf8');

const newReadme =
  header +
  readme
    .slice(header.length)
    .replaceAll(
      /\(#useeventlistener((?:-1)?)\)/g,
      (match, /** @type {string} */ suffix) => {
        return `(#useeventlistener${suffix ? '' : '-1'})`;
      },
    );

await writeFile(readmePath, newReadme);
