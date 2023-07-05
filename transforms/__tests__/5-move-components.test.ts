import {TestOptions, defineTest} from 'jscodeshift/src/testUtils';

const printOptions = {
    quote: 'single',
    trailingComma: true,
    objectCurlySpacing: false,
    wrapColumn: 120,
};
const testOptions: TestOptions = {
    parser: 'tsx',
};

defineTest(__dirname, '5-move-components', {printOptions}, '5-move-components/alias', testOptions);
defineTest(__dirname, '5-move-components', {printOptions}, '5-move-components/all', testOptions);
defineTest(__dirname, '5-move-components', {printOptions}, '5-move-components/mixed', testOptions);
defineTest(__dirname, '5-move-components', {printOptions}, '5-move-components/reuse', testOptions);
defineTest(__dirname, '5-move-components', {printOptions}, '5-move-components/type', testOptions);

