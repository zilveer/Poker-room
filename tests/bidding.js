var fs = require('fs');
var Pot = require('../Slayer-server/game/pot')
var TH = require('./testhelper');
var Player = require('../Slayer-server/game/player')

var cmp_arrays = function(a1,a2) {
	return a1.length==a2.length && a1.every(function(v,i) { return parseInt(v) === parseInt(a2[i])})
}

module.exports = {
	passed: 0,

	run: function() {
		if(!this.test_bidding())
			return;

		//if(!this.test_splitting())
		//	return;

		console.log('All ' + this.passed + ' Pot tests PASSED!');
	},

	test_bidding: function() {
		var bid_tables = fs.readFileSync(__dirname + '/files/bid_chips_tables.txt').toString().split('------\n');

		for(var bid_table of bid_tables) {
			var aa = bid_table.split('\n');

			var old_chips = aa.shift().split(',');
			var bets = aa.shift().split(',');
			var winner = parseInt(aa.shift());
			var new_chips = aa.shift().split(',');

			var players = {};
			for(var p=0;p<old_chips.length;p++) {
				var player = new Player(p, {
					user_id: p, dbid: p, username: p
				});

				player.addChips(parseInt(old_chips[p]));
				player.bet(parseInt(bets[p]));
				players[p] = player;
			}

			var pot = new Pot(players);
			pot.rewardWinner(winner);

			var ok = true;
			for(var p=0;p<old_chips.length;p++) {
				var act_gain = Math.max(0, players[p].chips - old_chips[p]);

				if(players[p].chips != new_chips[p]) {
					if(!TH.fail('chips ['+p+']', new_chips[p], players[p].chips)) {
						ok = false;
					}
				}
			}

			if(!ok)
				return ok;
			this.passed++;
		}

		return true;
	},

	/*test_splitting: function() {
		var bid_tables = fs.readFileSync(__dirname + '/files/bid_split_pot_tables.txt').toString().split('------\n');

		for(var bid_table of bid_tables) {
			var aa = bid_table.split('\n');
			var allins = aa.shift().split(',');
			var mainpot = aa.shift().split(',');

			var players = [];
			for(var p=0;p<allins.length;p++) {
				var player = new Player(p, {
					user_id: p, dbid: p, username: p
				});

				player.addChips(parseInt(allins[p]));
				player.bet(parseInt(allins[p]));
				players.push(player);
			}

			var pot = new Pot(players);
			pot.fetchPots();

			if(!cmp_arrays(mainpot, pot.mainPot)) {
				return TH.fail('mainPot', mainpot, pot.mainPot);
			}

			for(var i=0;i<aa.length-1;i++) {
				var sidepot = aa[i].split(',');

				if(!pot.sidePots[i] || !cmp_arrays(pot.sidePots[i], sidepot)) {
					return TH.fail('sidePot['+i+']', sidepot, pot.sidePots[i]);
				}
			}
		}

		this.passed += bid_tables.length;
		return true;
	},*/
};