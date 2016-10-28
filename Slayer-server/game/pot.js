

//@todo: players is not an array, but an Object!

module.exports = function(players) {
	this.allins = {}; // playerId => amount
	this.players = players;

	this.rewardWinner = function(winnerId) {
		this.fetchPots();
		var winner = this.players[winnerId];

		winner.chips += this.sumMainPot();

		//if(this.hasAllin || winner.allin) {
			for(var player of this.players) {
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
		return this.players.reduce((sum, player) => {
			return sum + player.chipsInMainPot;
		}, 0);
	},

	this.resetPot = function() {
		for(var player of this.players) {
			player.reset();
		}
	},

	this.fetchPots = function() {
		// Count main pot:
		var remaining = this.players.reduce((cont, player) => {
			cont.push(player.chipsInPot)
			return cont;
		}, []);

		var minPot = 0, i = 0;
		do {
			minPot = this._getMinPot(remaining);

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

	this._getMinPot = function(pot) {
		return pot.reduce((minPot, chips) => {
			return (chips < minPot && chips != 0) ? chips : minPot;
		}, Infinity);
	}

	// @UNUSED
	this._getSumPot = function(pot) {
		return pot.reduce((sum, chips) => {
			return sum + parseInt(chips);
		}, 0);
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