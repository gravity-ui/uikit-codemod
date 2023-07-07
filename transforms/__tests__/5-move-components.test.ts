import {defineTest} from 'jscodeshift/src/testUtils';

import {printOptions} from './constants';

const NAME = '5-move-components';


defineTest(__dirname, NAME, {printOptions}, NAME + '/alias', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/all', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/mixed', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/reuse', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/type', {parser: 'tsx'});

