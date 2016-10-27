
module.exports = function(players) {
	this.players = players;

	this.mainPot = 0;
	this.sidePot = 0;
	this.sidePots = [];//do we need this ?

	this.allins = {}; // playerId => amount

	this.fetchPots = function() {
		// Count main pot:
		var min_pot = this.players.reduce((player, pot) => {
			return player.pot < pot ? player.pot : pot;
		}, Infinity);

		var pN = Object.keys(this.players).length;
		this.mainPot = pN * min_pot;


		// Count side pots:
		

		//$$$ itt
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