module.exports = ( function () {
	'use strict';
	var inquirer = require( 'inquirer' );
	var handlebars = require( 'handlebars' );
	var nunjucks = require( 'nunjucks' );
	var changeCase = require( 'change-case' );
	var env = new nunjucks.Environment();

	env.addFilter( 'shorten', function ( str, count ) {
		return str.slice( 0, count || 5 );
	} );

	var automatfilePath = '';
	var generators = {};
	var pkgJson = {};
	var partials = {};
	var helpers = {
		camelCase: changeCase.camel,
		snakeCase: changeCase.snake,
		dashCase: changeCase.param,
		kabobCase: changeCase.param,
		dotCase: changeCase.dot,
		pathCase: changeCase.path,
		properCase: changeCase.pascal,
		pascalCase: changeCase.pascal,
		lowerCase: changeCase.lower,
		sentenceCase: changeCase.sentence,
		constantCase: changeCase.constant,
		titleCase: changeCase.title,
		pkg: function ( key ) {
			return pkgJson[ key ];
		}
	};

	var debug = false;

	function addPrompt( name, prompt ) {
		inquirer.registerPrompt( name, prompt );
	}

	function addHelper( name, fn ) {
		helpers[ name ] = fn;
	}

	function addPartial( name, str ) {
		partials[ name ] = str;
	}

	function renderString( template, data ) {
		var t = template,
			h, p;

		for ( h in helpers ) {
			if ( !helpers.hasOwnProperty( h ) ) {
				continue;
			}
			env.addFilter( h, helpers[ h ] );
		}

		return env.renderString( t, data );
	}

	function setGenerator( name, config ) {
		generators[ name ] = config;
	}

	function getGenerator( name ) {
		return generators[ name ];
	}

	function getGeneratorList() {
		return Object.keys( generators ).map( function ( gName ) {
			return {
				name: gName,
				description: generators[ gName ].description || ''
			};
		} );
	}

	function setAutomatfilePath( path ) {
		try {
			pkgJson = require( path + '/package.json' );
		} catch ( err ) {}

		automatfilePath = path;
	}

	function getAutomatfilePath() {
		return automatfilePath;
	}


	return {
		addHelper: addHelper,
		addPartial: addPartial,
		addPrompt: addPrompt,
		renderString: renderString,

		setGenerator: setGenerator,
		getGenerator: getGenerator,
		getGeneratorList: getGeneratorList,

		setAutomatfilePath: setAutomatfilePath,
		getAutomatfilePath: getAutomatfilePath,

		inquirer: inquirer,
		nunjucks: nunjucks,
		helpers: helpers
	};
} )();
