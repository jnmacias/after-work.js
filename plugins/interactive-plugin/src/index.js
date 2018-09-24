const inquirer = require('inquirer');
const checkboxPlus = require('inquirer-checkbox-plus-prompt');

const fuzzy = require('fuzzy');
const importCwd = require('import-cwd');
const globby = require('globby');

const prompt = inquirer.createPromptModule({ output: process.stderr });
prompt.registerPrompt('checkbox-plus', checkboxPlus);

const searchPackages = (input, packages) => {
  input = input || '';
  return new Promise((resolve) => {
    setTimeout(() => {
      const fuzzyResult = fuzzy.filter(input, packages);
      const val = fuzzyResult.map(el => el.original);
      resolve(val);
    });
  });
};

const searchTestFiles = (runner, answers, input) => {
  input = input || '';
  return new Promise((resolve) => {
    setTimeout(() => {
      const fuzzyResult = fuzzy.filter(input, runner.testFiles);
      const val = fuzzyResult.map(el => el.original);
      resolve(val);
    });
  });
};

const refreshPkgs = () => {
  const pkg = importCwd('./package.json');
  const findPkgs = g => globby.sync(`${g}/package.json`);
  const reducePkgs = (acc, curr) => acc.concat(curr.map(c => c.slice(0, -13)));
  const workspaces = (pkg.workspaces || []).map(findPkgs).reduce(reducePkgs, []);
  const lerna = importCwd.silent('./lerna.json');
  const lernaPkgs = ((lerna && lerna.packages) || []).map(findPkgs).reduce(reducePkgs, []);
  return {
    workspaces,
    lernaPkgs,
  };
};


const promptMainMenu = async (runner) => {
  const { workspaces, lernaPkgs } = await refreshPkgs();
  const unmatchedSnapshots = [...runner.snapshotStates.values()].filter(v => v.unmatched > 0).length;
  const snapshotChoice = unmatchedSnapshots ? [{ key: 'u', name: 'Snapshots', value: 'snapshots' }] : [];
  const workspacesChoice = workspaces.length ? [{ key: 'w', name: 'Workspaces', value: 'workspaces' }] : [];
  const lernaPkgsChoice = lernaPkgs.length ? [{ key: 'p', name: 'Packages', value: 'packages' }] : [];
  const { interactive } = await prompt([{
    type: 'expand',
    name: 'interactive',
    message: 'Interactive usage',
    choices: [
      ...snapshotChoice,
      ...workspacesChoice,
      ...lernaPkgsChoice,
      { key: 'f', name: 'Filter', value: 'filter' },
      { key: 'q', name: 'Quit', value: 'quit' },
    ],
  }]);
  return {
    interactive,
    packages: [...workspaces, ...lernaPkgs],
  };
};

const promptPackages = async (runner, packages, message) => {
  const { pkgs } = await prompt([
    {
      type: 'checkbox-plus',
      name: 'pkgs',
      message,
      source: (_, input) => searchPackages(input, packages),
      pageSize: 4,
      highlight: true,
      searchable: true,
    },
  ]);
  return pkgs;
};

const promptTestFiles = async (runner, packages) => {
  const { testFiles } = await prompt([
    {
      type: 'checkbox-plus',
      name: 'testFiles',
      message: 'Which test files?',
      source: (answersSoFar, input) => searchTestFiles(runner, answersSoFar, input, packages),
      pageSize: 4,
      highlight: true,
      searchable: true,
    },
  ]);
  return testFiles;
};

const onInteractive = (runner) => {
  (async () => {
    const { interactive, packages } = await promptMainMenu(runner);
    if (interactive === 'quit') {
      runner.exit();
    }
    if (interactive === 'workspaces' || interactive === 'packages') {
      const message = interactive === 'workspaces' ? 'Which workspaces?' : 'Which packages';
      const pkgs = await promptPackages(runner, packages, message);
      if (!Array.isArray(pkgs)) {
        onInteractive(runner);
        return;
      }
      let test = [];
      let src = [];
      pkgs.forEach((p) => {
        test = [...test, `${p}/test/**/*.spec.{js,ts}`];
        src = [...src, `${p}/src/**/*.{js,ts}`];
      });
      if (test.length) {
        runner.setTestFiles(test);
        runner.setSrcFiles(src);
        if (runner.testFiles.length) {
          runner.run();
        } else {
          onInteractive(runner);
        }
      }
    }
    if (interactive === 'filter') {
      const testFiles = await promptTestFiles(runner, packages);
      if (Array.isArray(testFiles) && testFiles.length) {
        runner.setupAndRunTests(testFiles, []);
      } else {
        onInteractive(runner);
      }
    }
  })();
};

module.exports = function interactivePlugin(runner) {
  runner.on('watchEnd', () => onInteractive(runner));
  runner.on('interactive', () => onInteractive(runner));
};
