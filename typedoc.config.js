import packageJson from './package.json' with { type: 'json' };

/** @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions} */
const config = {
  entryPoints: ['./src/index.ts'],
  readme: './README-header.md',
  mergeReadme: true,
  out: '.',
  cleanOutputDir: false,
  gitRevision: `v${packageJson.version}`,
  plugin: ['typedoc-plugin-markdown'],
  router: 'module',
  hidePageHeader: true,
  hideGroupHeadings: true,
  groupOrder: ['Functions', 'Type Aliases'],
  useCodeBlocks: true,
  expandObjects: true,
  sort: ['source-order'],
  blockTagsPreserveOrder: ['@deprecated', '@example'],
  classPropertiesFormat: 'htmlTable',
  enumMembersFormat: 'htmlTable',
  interfacePropertiesFormat: 'htmlTable',
  parametersFormat: 'htmlTable',
  propertyMembersFormat: 'htmlTable',
  typeAliasPropertiesFormat: 'htmlTable',
  typeDeclarationFormat: 'htmlTable',
  tableColumnSettings: {
    hideSources: true,
  },
  formatWithPrettier: true,
  prettierConfigFile: './prettier.config.js',
  externalSymbolLinkMappings: {
    '@types/react': {
      'React.createContext': 'https://react.dev/reference/react/createContext',
      'React.useLayoutEffect':
        'https://react.dev/reference/react/useLayoutEffect',
      'React.useReducer': 'https://react.dev/reference/react/useReducer',
      'React.useRef': 'https://react.dev/reference/react/useRef',
      'React.useState': 'https://react.dev/reference/react/useState',
    },
  },
};

export default config;
