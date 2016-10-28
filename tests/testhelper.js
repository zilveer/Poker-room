
module.exports = {
	fail: function(at, expected, actual) {
		console.log('FAIL');
		console.log(' * at: ', at);
		console.log(' * expected: ', expected);
		console.log(' * actual: ', actual);

		return false;
	}
};