'use strict';

var chalk = require( 'chalk' );
var inquirer = require( 'inquirer' );
var q = require( 'q' );

module.exports = ( function () {
	function chooseOptionFromList( automatList ) {
		var _d = q.defer();

		inquirer.prompt( [{
			type: 'list',
			name: 'generator',
			message: chalk.blue('[Automat]') + ' Please choose a generator.',
			choices: automatList.map( function ( p ) {
				return {
					name: p.name + chalk.gray( !!p.description ? ' - ' + p.description :
						'' ),
					value: p.name
				};
			} )
		}], function ( results ) {
			_d.resolve( results.generator );
		} );

		return _d.promise;
	}

	return {
		chooseOptionFromList: chooseOptionFromList
	};
} )();
