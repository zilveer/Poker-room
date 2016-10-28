var fs = require('fs');
var Poker = require('../Slayer-server/game/poker')
var TH = require('./testhelper');

module.exports = {
	run: function() {
		var handsContents = fs.readFileSync(__dirname + '/files/hands.csv').toString().split('\n');

		for(var handContent of handsContents) {
			var aa = handContent.split(',');

			var _hand = [
				new Poker.Card(aa[0], aa[1]),
				new Poker.Card(aa[2], aa[3]), 
				new Poker.Card(aa[4], aa[5]), 
				new Poker.Card(aa[6], aa[7]), 
				new Poker.Card(aa[8], aa[9]), 
			];
			var hand = new Poker.Hand(_hand);
			var expected = aa[10];

			var actual = hand.fetchType();

			if(expected != actual) {
				return TH.fail(handContent, expected, actual);
			}
		}

		console.log('All ' + handsContents.length + ' Poker hand tests PASSED!');
	}
};