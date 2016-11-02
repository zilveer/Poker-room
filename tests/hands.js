var fs = require('fs');
var Poker = require('../Slayer-server/game/poker')
var TH = require('./testhelper');

module.exports = {
	run: function() {
		if(!this.test_hand_cmp())
			return;

		if(!this.test_hand_types())
			return;

		//if(!this.test_hand_split())
		//	return;
	},

	test_hand_split: function() {
		var handsContents = fs.readFileSync(__dirname + '/files/hands_split.csv').toString().split('\n');
		var hands = [];
		var i = 0;

		for(var handContent of handsContents) {
			var aa = handContent.split(',');
			var _hand = [
				new Poker.Card(parseInt(aa[0]), parseInt(aa[1])),
				new Poker.Card(parseInt(aa[2]), parseInt(aa[3])), 
				new Poker.Card(parseInt(aa[4]), parseInt(aa[5])), 
				new Poker.Card(parseInt(aa[6]), parseInt(aa[7])), 
				new Poker.Card(parseInt(aa[8]), parseInt(aa[9])), 
				new Poker.Card(parseInt(aa[10]), parseInt(aa[11])), 
				new Poker.Card(parseInt(aa[12]), parseInt(aa[13])), 
			];

			var hand = new Poker.Hand(_hand);

			hand.fetchType();
			hands.push({full_hand: hand, player_id:i++, expected_type: aa[14], expected_high: aa[15], expected_kicker:aa[16]});
		}
		return true;
	},

	test_hand_cmp: function() {
		var handsContents = fs.readFileSync(__dirname + '/files/hands_sm.csv').toString().split('\n');
		var hands = [];
		var i = 0;

		for(var handContent of handsContents) {
			var aa = handContent.split(',');
			var _hand = [
				new Poker.Card(parseInt(aa[0]), parseInt(aa[1])),
				new Poker.Card(parseInt(aa[2]), parseInt(aa[3])), 
				new Poker.Card(parseInt(aa[4]), parseInt(aa[5])), 
				new Poker.Card(parseInt(aa[6]), parseInt(aa[7])), 
				new Poker.Card(parseInt(aa[8]), parseInt(aa[9])), 
				new Poker.Card(parseInt(aa[10]), parseInt(aa[11])), 
				new Poker.Card(parseInt(aa[12]), parseInt(aa[13])), 
			];

			var hand = new Poker.Hand(_hand);

			hand.fetchType();
			hands.push({full_hand: hand, player_id:i++, expected_type: aa[14], expected_high: aa[15], expected_kicker:aa[16]});
		}

		hands.sort(function(a,b){
			return a.full_hand.compare( b.full_hand )
		});

		var j = 0;
		for(var hand of hands) {
			if(hand.full_hand.type != hand.expected_type) {
				return TH.fail('HandType['+hand.player_id+']', hand.expected_type, hand.full_hand.type);
			}
			
			if(hand.full_hand.high != hand.expected_high) {
				return TH.fail('High['+hand.player_id+']', hand.expected_high, hand.full_hand.high);
			}
			
			// $$$ ITT
			//@todo: check kicker null/0 comparision?
			if(hand.full_hand.kicker != hand.expected_kicker) {
				return TH.fail('Kicker['+hand.player_id+']', hand.expected_kicker, hand.full_hand.kicker);
			}
			j++;
		}

		console.log('All ' + j + ' Poker hand compare tests PASSED!');
		return true;
	},

	test_hand_types: function() {
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