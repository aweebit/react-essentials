import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const rootDir = join(import.meta.dirname, '..');

const headerPath = join(rootDir, 'README-header.md');
const readmePath = join(rootDir, 'README.md');

const [header, readme] = await Promise.all([
  readFile(headerPath, 'utf8'),
  readFile(readmePath, 'utf8'),
]);

const newReadme =
  header +
  readme
    .slice(header.length)
    .replaceAll(
      /\(#(useeventlistener|createrequiredcontext)((?:-1)?)\)/g,
      (match, /** @type {string} */ name, /** @type {string} */ suffix) => {
        return `(#${name}${suffix ? '' : '-1'})`;
      },
    );

await writeFile(readmePath, newReadme);
