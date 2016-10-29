
module.exports = function(seat, params) {
	// @Interface for Slayer/core/*
	this.playing = false;		//whether the play is in the room, playing or afk
	this.user_id = params.user_id;
	this.database_id = params.dbid;
	this.ai = false;
	this.username = params.username;

	// @Interface for game/room
	this.hand = []; //@Var game/poker/Hand

	// @Interface for game/Pot
	this.allin = false;
	this.chips = 0;
	this.chipsInPot = 0;
	this.chipsInMainPot = 0;
	this.chipsInSidePot = 0;

	// @Interface for game/room
	this.addChips = function(chips) {
		this.chips += chips;
	};

	// @Interface for game/room
	this.bet = function(chips) {
		if(this.chips < chips)
			return false;
		else if(this.chips == chips)
			this.allin = true;
		
		this.chips -= chips;
		this.chipsInPot += chips;

		return true;
	};

	// @Interface for game/Pot.js
	this.reset = function() {
		this.allin = false;
		this.chipsInPot = 0;
		this.chipsInMainPot = 0;
		this.chipsInSidePot = 0;
	};

	// @Interface for game/Pot.js
	this.is = function(player) {
		return this.username == player.username;
	};

	// @Interface for core/turns
	this.turnId = seat;
	this.isPlaying = function() {
		return this.turnId != null && this.chips > 0;
	};

	this.get_info = function() {
		var ai = typeof this.ai !== 'undefined' ? true : false;
		return {
			ai: ai,
			username: this.username,
			allin: this.allin,
			chips: this.chips,
			chipsInPot: this.chipsInPot,
			chipsInMainPot: this.chipsInMainPot,
			chipsInSidePot: this.chipsInSidePot,
		};
	};
};