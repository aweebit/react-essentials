const pattern = '*.{js,jsx,ts,tsx}';

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  [pattern]: [
    'npm run prettier:base --',
    'npm run lint --',
    () => 'tsc -b --noEmit',
  ],
  [`!${pattern}`]: 'npm run prettier:base -- --ignore-unknown',
};
