

//@todo: players is not an array, but an Object!

module.exports = function(players) {
	this.allins = {}; // playerId => amount
	this.players = players;

	this.rewardWinner = function(winnerId) {
		this.fetchPots();
		var winner = this.players[winnerId];

		winner.chips += this.sumMainPot();

		//@todo: split pot between winners!

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

	// Count pot:
	this.sumPot = function() {
		var sum = 0;
		for(var p in this.players) {
			sum += this.players[p].chipsInPot;
		}
		return sum;
	},

	this.resetPot = function() {
		for(var p in this.players) {
			this.players[p].reset();
		}
	},

	this.resetBids = function() {
		for(var p in this.players) {
			this.players[p].chipsInBid = 0;
		}
	},

	this.isEqualized = function() {
		var eqbid = null;
		for(var p in this.players) {
			if(!eqbid)
				eqbid = this.players[p].chipsInPot;
			if(eqbid != this.players[p].chipsInPot)
				return false;
		}
		return true;
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
};