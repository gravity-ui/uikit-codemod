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

defineTest(__dirname, 'TRANSFORM_NAME', {printOptions}, 'TEST_FILE_PREFIX', testOptions);

