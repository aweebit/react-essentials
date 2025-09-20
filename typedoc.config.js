import packageJson from './package.json' with { type: 'json' };

/** @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions} */
const config = {
  entryPoints: ['./src/index.ts'],
  out: '.',
  cleanOutputDir: false,
  gitRevision: `v${packageJson.version}`,
  plugin: ['typedoc-plugin-markdown'],
  router: 'module',
  hidePageHeader: true,
  hideGroupHeadings: true,
  useCodeBlocks: true,
  expandObjects: true,
  sort: ['source-order'],
  blockTagsPreserveOrder: ['@example'],
  classPropertiesFormat: 'table',
  enumMembersFormat: 'table',
  interfacePropertiesFormat: 'table',
  parametersFormat: 'table',
  propertyMembersFormat: 'table',
  typeAliasPropertiesFormat: 'table',
  typeDeclarationFormat: 'table',
  tableColumnSettings: {
    hideSources: true,
  },
  formatWithPrettier: true,
  prettierConfigFile: './prettier.config.js',
};

export default config;
