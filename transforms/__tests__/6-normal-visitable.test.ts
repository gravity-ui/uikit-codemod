import {defineTest} from 'jscodeshift/src/testUtils';

import {printOptions} from './constants';

const NAME = '6-normal-visitable';

defineTest(__dirname, NAME, {printOptions}, NAME + '/link', {parser: 'tsx'});
