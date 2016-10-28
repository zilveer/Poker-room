
var tests = [
// PASSES:
	//'hands',
	//'bidding',

// TO IMPLEMENT:
	'turns',
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
