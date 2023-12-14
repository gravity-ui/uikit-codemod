import {defineTest} from 'jscodeshift/src/testUtils';

import {printOptions} from './constants';

const NAME = '6-positive-to-success';

defineTest(__dirname, NAME, {printOptions}, NAME + '/alert-card', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/alert', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/card', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/other-component', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/other-prop', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/other-value', {parser: 'tsx'});
