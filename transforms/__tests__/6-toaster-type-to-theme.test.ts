import {defineTest} from 'jscodeshift/src/testUtils';

import {printOptions} from './constants';

const NAME = '6-toaster-type-to-theme';

defineTest(__dirname, NAME, {printOptions}, NAME + '/destructuring', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/property-no-import', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/property-normal', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/property-shorthand', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/type-import-alias', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/type-import-type-1', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/type-import-type-2', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/type-no-import', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/type-normal', {parser: 'tsx'});
defineTest(__dirname, NAME, {printOptions}, NAME + '/value-normal', {parser: 'tsx'});
