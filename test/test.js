import test from 'ava';
import Automat from '../src/automat-base.js';
import inquirer from 'inquirer';
import nunjucks from 'nunjucks';

test('Automat :: nunjucks is loaded', t => {
    t.same(Automat.nunjucks, nunjucks, 'nunjucks loaded successfully');
});

test('Automat :: inquirer is loaded', t => {
    t.same(Automat.inquirer, inquirer, 'inquirer loaded successfully');
});

test('Automat :: testing renderString()', t => {
	let result = Automat.renderString('A {{ name }} template', {name:'nunjucks'});
	t.is(result, 'A nunjucks template')
});

test('Automat :: testing addHelper()', t => {

	var testFunc = function(str, count) {
	    return str.slice(0, count || 5);
	};
	Automat.addHelper('shorten',testFunc );
	t.same(testFunc, Automat.helpers.shorten);
});
