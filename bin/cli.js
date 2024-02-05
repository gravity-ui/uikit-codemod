import fs from 'fs';
import module from 'module';
import path from 'path';
import url from 'url';

import chalk from 'chalk';
import {execaSync} from 'execa';
import {globby} from 'globby';
import meow from 'meow';

const require = module.createRequire(import.meta.url);
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const transformerDirectory = path.join(__dirname, '../', 'transforms');
const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');

const TRANSFORMERS = [
    '5-move-components',
    '5-progress-props',
    '5-popup-props',
    '6-positive-to-success',
    '6-normal-visitable',
    '6-change-side',
    '6-toaster-type-to-theme',
];

function expandFilePathsIfNeeded(filesBeforeExpansion) {
    const shouldExpandFiles = filesBeforeExpansion.some((file) => file.includes('*'));
    return shouldExpandFiles ? globby.sync(filesBeforeExpansion) : filesBeforeExpansion;
}

function getTransformerPath(transformer) {
    const normalPath = path.join(transformerDirectory, `${transformer}.ts`);
    const indexPath = path.join(transformerDirectory, transformer, 'index.ts');

    return fs.existsSync(indexPath) ? indexPath : normalPath;
}

export function runTransform({transformer, parser, flags, files}) {
    const transformerPath = getTransformerPath(transformer);

    let args = [];

    const {dry, print} = flags;

    if (dry) {
        args.push('--dry');
    }
    if (print) {
        args.push('--print');
    }

    args.push('--verbose=2');

    args.push('--ignore-pattern=**/node_modules/**');

    args.push('--parser', parser);

    if (parser === 'tsx') {
        args.push('--extensions=tsx,ts,jsx,js');
    } else {
        args.push('--extensions=jsx,js');
    }

    args = args.concat(['--transform', transformerPath]);

    if (flags.jscodeshift) {
        args = args.concat(flags.jscodeshift);
    }

    args = args.concat(files);

    console.log(`Executing command: jscodeshift ${args.join(' ')}`);

    execaSync(jscodeshiftExecutable, args, {
        stdio: 'inherit',
        stripEof: false,
    });
}

export function run() {
    const cli = meow(
        `
        Usage:
          $ npx @gravity-ui/uikit-codemod <transform> <path> <...options>
            transform       It's only one option here: replace-lego
            path            Files or directory to transform. Can be a glob like src/**.test.js
        Options:
          -d, --dry         Dry run (no changes are made to files)
                            (default: false)
          --help            Print this help and exit
          --jscodeshift     (Advanced) Pass options directly to jscodeshift
          --parser          The parser to use for parsing the source files
                            (default: tsx)
          -p, --print       Print transformed files to your terminal
        `,
        {
            importMeta: import.meta,
            flags: {
                dry: {
                    type: 'boolean',
                    default: false,
                    shortFlag: 'd',
                },
                parser: {
                    type: 'string',
                    default: 'tsx',
                },
                print: {
                    type: 'boolean',
                    default: false,
                    shortFlag: 'p',
                },
            },
        },
    );

    const parser = cli.flags.parser;
    const transformer = cli.input[0];
    const filesBeforeExpansion = cli.input.slice(1);

    if (!transformer) {
        console.log(chalk.red('Error: Transformer is not provided.'));
        return cli.showHelp(1);
    }

    if (!TRANSFORMERS.includes(transformer)) {
        console.log(chalk.red('Error: Unknown transformer.'));
        return cli.showHelp(1);
    }

    if (filesBeforeExpansion.length === 0) {
        console.log(chalk.red('Error: No files or directory to transform.'));
        return cli.showHelp(1);
    }

    const filesExpanded = expandFilePathsIfNeeded(filesBeforeExpansion);

    return runTransform({
        transformer,
        parser,
        flags: cli.flags,
        files: filesExpanded,
    });
}
