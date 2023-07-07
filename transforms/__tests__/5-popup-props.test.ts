import {defineTest} from 'jscodeshift/src/testUtils';

import {printOptions} from './constants';

const NAME = '5-popup-props';

defineTest(__dirname, NAME, {printOptions}, NAME + '/normal', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/no-import', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/other-import', {parser: 'tsx'});

