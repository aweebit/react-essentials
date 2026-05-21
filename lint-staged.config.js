const pattern = '*.{js,jsx,ts,tsx}';
const docCommands = [() => 'npm run doc', () => 'git add README.md'];

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  [pattern]: [
    'npm run prettier:base --',
    'npm run lint --',
    () => 'tsc -b --noEmit',
    ...docCommands,
  ],
  [`!${pattern}`]: 'npm run prettier:base -- --ignore-unknown',
  'package.json': [
    () => 'npm i',
    () => 'git add package-lock.json',
    ...docCommands,
  ],
};

export default config;
