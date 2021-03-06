#!/usr/bin/env node

'use strict';

var path = require('path');
var util = require('util');
var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var v8flags = require('v8flags');
var interpret = require('interpret');
var chalk = require('chalk');

var automat = require('./src/automat-base');
var logic = require('./src/logic');
var out = require('./src/console-out');
var globalPkg = require('./package.json');
var generator = argv._[0] || null;


var Automat = new Liftoff({
	name: 'automat',
	extensions: interpret.jsVariants,
	v8flags: v8flags
});

Automat.launch({
	cwd: argv.cwd,
	configPath: argv.automatfile,
	require: argv.require,
	completion: argv.completion,
	verbose: argv.verbose
}, run);

function run(env) {
	var generators, automatfilePath;

	// handle request for version number
	if (argv.version || argv.v) {
		if (env.modulePackage.version !== globalPkg.version) {
			console.log(chalk.yellow('CLI version'), globalPkg.version);
			console.log(chalk.yellow('Local version'), env.modulePackage.version);
		} else {
			console.log(globalPkg.version);
		}
		return;
	}

	// set the default base path to the automatfile directory
	automatfilePath = env.configPath;
	// abort if there's no automatfile found
	if (automatfilePath === null) {
		console.error(chalk.red('[AUTOMAT] ') + 'No automatfile found');
		process.exit(1);
	}
	automat.setAutomatfilePath(path.dirname(automatfilePath));

	// run the automatfile against the automat object
	require(automatfilePath)(automat);

	generators = automat.getGeneratorList();
	if (!generator) {
		out.chooseOptionFromList(generators).then(go);
	} else if (generators.map(function (v) { return v.name; }).indexOf(generator) > -1) {
		go(generator);
	} else {
		console.error(chalk.red('[AUTOMAT] ') + 'Generator "' + generator + '" not found in automatfile');
		process.exit(1);
	}
}

function go(generator) {
	logic.getAutomatData(generator)
		.then(logic.executeAutomat)
		.then(function (result) {
			result.changes.forEach(function (line) {
				console.log(chalk.green('[SUCCESS]'), line.type, line.path);
			});
			result.failures.forEach(function (line) {
				console.log(chalk.red('[FAILED]'), line.type, line.path, line.error);
			});
		})
		.fail(function (err) {
			console.error(chalk.red('[ERROR]'), err.message, err.stack);
			process.exit(1);
		});
}
