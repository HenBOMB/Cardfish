var typeScriptVersion = '5.1.3';

System.config({
  transpiler: 'ts',
  typescriptOptions: {
    experimentalDecorators: true,
    target: 'ES5',
  },
  packages: {
    ".": {
      main: './spk-index.ts',
      defaultExtension: 'ts',
    }
  },
  meta: {
    'typescript': { 'exports': 'ts' }
  },
  paths: {
    'npm:': 'https://unpkg.com/'
  },
  map: {
    'ts': 'npm:plugin-typescript@8.0.0/lib/plugin.js',
    'typescript': 'npm:typescript@' + typeScriptVersion + '/lib/typescript.js'
  }
});

System.import('./spk.index')
  .catch(console.error.bind(console));
