import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const rootDir = join(import.meta.dirname, '..');

const headerPath = join(rootDir, 'README-header.md');
const readmePath = join(rootDir, 'README.md');

const [header, readme] = await Promise.all([
  readFile(headerPath, 'utf8'),
  readFile(readmePath, 'utf8'),
]);

let newReadme =
  header +
  readme
    .slice(header.length)
    .replaceAll(
      /\(#(useeventlistener|createrequiredcontext)((?:-1)?)\)/g,
      (match, /** @type {string} */ name, /** @type {string} */ suffix) => {
        return `(#${name}${suffix ? '' : '-1'})`;
      },
    );

console.log('debug');

const delimiter = '---\n\n## ';
const parts = newReadme.split(delimiter);
const firstTypeIndex =
  parts.findLastIndex((part) => part[0] === part[0]?.toLowerCase()) + 1;
parts[firstTypeIndex] =
  '---\n\n<details>\n<summary>\n<h1>Types</h1>\n</summary>\n\n## ' +
  parts[firstTypeIndex];
parts[parts.length - 1] += '\n</details>\n';
newReadme =
  parts.slice(0, firstTypeIndex).join(delimiter) +
  parts.slice(firstTypeIndex).join(delimiter);

await writeFile(readmePath, newReadme);
