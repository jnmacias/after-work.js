module.exports = {
  config: {
    description: 'Path to config file',
    type: 'string',
    default: null,
    alias: 'c',
  },
  glob: {
    description: 'Glob pattern',
    default: ['test/**/*.spec.{js,ts}'],
    type: 'array',
  },
  src: {
    description: 'Glob pattern for all source files',
    default: ['src/**/*.{js,ts}'],
    type: 'array',
  },
  require: {
    description: 'Require path',
    default: [],
    type: 'array',
  },
  watch: {
    description: 'Watch changes',
    default: false,
    type: 'boolean',
    alias: 'w',
  },
  watchGlob: {
    description: 'Watch glob',
    default: ['src/**/*.{js,ts}', 'test/**/*.spec.{js,ts}'],
    type: 'array',
    alias: 'wg',
  },
  coverage: {
    description: 'Generate coverage',
    default: false,
    type: 'boolean',
  },
  exit: {
    description: 'Force its own process to exit once it was finished executing all tests',
    default: false,
    type: 'boolean',
  },
  updateSnapshot: {
    description: 'Update snapshots',
    default: false,
    type: 'boolean',
    alias: 'u',
  },
  hookRequire: {
    description: 'Hook require to be able to mock and transform files',
    default: true,
    type: 'boolean',
  },
  'babel.enable': {
    description: 'Enable babel',
    default: true,
    type: 'boolean',
  },
  'babel.core': {
    description: 'Path to babel core module',
    default: '',
    type: 'string',
  },
  'babel.babelPluginIstanbul': {
    description: 'Path to babel plugin istanbul module',
    default: 'babel-plugin-istanbul',
    type: 'string',
  },
  'babel.options': {
    description: 'Babel options',
    default: {
    },
    type: 'object',
  },
  'babel.typescript': {
    description: 'Path to typescript compiler module',
    default: 'typescript',
    type: 'string',
  },
  mocks: {
    description: 'Automagically mock modules',
    default: [['*.{scss,less,css}']],
    type: 'array',
  },
  'mocha.reporter': {
    description: 'Which reporter to use',
    default: undefined,
    type: 'string',
  },
  'mocha.bail': {
    description: 'Bails on failure',
    default: true,
    type: 'boolean',
  },
  'mocha.timeout': {
    description: 'Timeout',
    default: undefined,
    type: 'number',
  },
  'nyc.hookRequire': {
    description: 'Hook require',
    default: false,
    type: 'boolean',
  },
  'nyc.hookRunInContext': {
    description: 'Hook require',
    default: false,
    type: 'boolean',
  },
  'nyc.hookRunInThisContext': {
    description: 'Hook require',
    default: false,
    type: 'boolean',
  },
  'nyc.require': {
    description: 'Require path',
    default: [],
    type: 'array',
  },
  'nyc.include': {
    description: 'Include glob',
    default: [],
    type: 'array',
  },
  'nyc.exclude': {
    description: 'Exclude glob',
    default: ['**/coverage/**', '**/dist/**', '**/*.spec.{js,ts}'],
    type: 'array',
  },
  'nyc.sourceMap': {
    description: 'Sets if NYC should handle source maps.',
    default: false,
    type: 'boolean',
  },
  'nyc.tempDirectory': {
    description: 'Directory to output raw coverage information to',
    default: './coverage/.nyc_output',
    type: 'string',
  },
  'nyc.reporter': {
    description: 'Coverage reporter(s) to use',
    default: ['lcov', 'text-summary'],
    type: 'array',
  },
  'nyc.reportDir': {
    description: 'Directory to output coverage reports in',
    default: 'coverage',
    type: 'string',
  },
};
