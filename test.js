
var tests = [
// PASSES:
	//'bidding',
	//'room',
	'hands',

// TO IMPLEMENT:
	//'currencies',
	//'rating',

// OPTIONAL:
	//'random',
	//'server_check',
	//'chat',
	//'rooms',
	//'seats',
];

for(var testName of tests) {
	var test = require("./tests/" + testName)
	test.run()	
}
