
module.exports = function(seat, params) {
	// client info:
	this.playing = false;		//whether the play is in the room, playing or afk
	this.user_id = params.user_id;
	this.database_id = params.dbid;
	this.ai = false;

	// game info:
	this.seat = seat;
	this.username = params.username;
	this.hand = [];

	this.allin = false;
	this.chips = 0;
	this.chipsInPot = 0;
	this.chipsInMainPot = 0;
	this.chipsInSidePot = 0;

	this.addChips = function(chips) {
		this.chips += chips;
	};

	this.bet = function(chips) {
		if(this.chips < chips)
			return false;
		else if(this.chips == chips)
			this.allin = true;
		
		this.chips -= chips;
		this.chipsInPot += chips;

		return true;
	};

	/*
	this.winPot = function() {
		console.log(this.chips, this.chipsInMainPot, this.chipsInSidePot);

		this.chips += this.chipsInMainPot;
		this.chips += this.chipsInSidePot;
	};*/

	this.reset = function() {
		this.allin = false;
		this.chipsInPot = 0;
		this.chipsInMainPot = 0;
		this.chipsInSidePot = 0;
	};

	this.is = function(player) {
		return this.username == player.username;
	};
};