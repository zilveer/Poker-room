

//@todo: players is not an array, but an Object!

module.exports = function(players) {
	this.allins = {}; // playerId => amount
	this.players = players;

	this.rewardWinner = function(winnerId) {
		this.fetchPots();
		var winner = this.players[winnerId];

		winner.chips += this.sumMainPot();

		//if(this.hasAllin || winner.allin) {
			for(var p in this.players) {
				var player = this.players[p];

				var win = Math.min(player.chipsInSidePot, winner.chipsInSidePot);

				winner.chips += win;

				// give back chips towards losers who bet more than the winner
				if(!player.is(winner)) {
					player.chipsInSidePot -= win;
					player.chips += player.chipsInSidePot;
				}
			}
		//}
	},

	// Count main pot:
	this.sumMainPot = function() {
		var sum = 0;
		for(var p in this.players) {
			sum += this.players[p].chipsInMainPot;
		}
		return sum;
	},

	this.resetPot = function() {
		for(var p in this.players) {
			this.players[p].reset();
		}
	},

	this.fetchPots = function() {
		var remaining = [];
		for(var p in this.players) {
			remaining.push(this.players[p].chipsInPot);
		}

		var minPot = 0, i = 0;
		do {
			minPot = remaining.reduce((minPot, chips) => {
				return (chips < minPot && chips != 0) ? chips : minPot;
			}, Infinity);

			var sumSidePot = 0;
			for(var p in remaining) {
				var remPot = remaining[p] >= minPot ? minPot : 0;
				remaining[p] -= remPot;

				if(i==0)
					this.players[p].chipsInMainPot += remPot;
				else
					this.players[p].chipsInSidePot += remPot;
				sumSidePot += remPot;
			}

			i++;
		} while(minPot != sumSidePot && sumSidePot != 0)
	}

	// Add chips to pot from player
	this.add = function(playerId, amount) {
		if(this.players[playerId].chips < amount)
			return false;
		
		// All-in
		if(this.players[playerId].chips == amount) {
			this.allins[playerId] = amount;
		}

		this.players[playerId].chips -= amount;
		this.pot += amount;

		return true;
	};

	// Give pot to player
	this.give = function(playerId) {
		this.players[playerId].chips += this.pot;
		this.pot = 0;

		//@todo: how does allin work?
		return true;
	};

	// Split pot between players
};