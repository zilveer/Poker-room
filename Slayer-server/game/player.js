
module.exports = function(seat, params) {
	// @Interface for Slayer/core/*
	this.user_id = params.user_id;
	this.database_id = params.dbid;
	this.username = params.username;

	// @Interface for game/room
	this.playing = false;
	this.allin = false; // chips == 0
	this.folded = false; // has the player folded?
	this.ai = false;
	this.hand = null; //@Var game/poker/Hand

	// @Interface for game/Pot
	this.chips = 0; // chips at hand
	this.chipsInBid = 0; // chips in pot for the round
	this.chipsInPot = 0; // chips in pot for the turn
	this.chipsInMainPot = 0; // chips that the player can win for the turn 
	this.chipsInSidePot = 0; // used by the sidepot algorithm for all-ins

	// @Interface for game/room
	this.bid = function(params, minBid) {
		if(this.folded || !this.playing)
			return false;

		var minCall = minBid - this.chipsInBid;
		var amount = 0;
		var type = params.type;
		params.amount = parseInt(params.amount);

		if(params.type == 'check')
			amount = 0;
		else if(params.type == 'call')
			amount = minCall;
		else // raise, bet, sblind, blind
			amount = params.amount;
			//@todo: raise/bet must be at least twice the amount of big blind ?

		// All in
		if(amount <= minCall && amount == this.chips) {
			this.allin = true;
		}

		// Little naughty poker player wants to bet less than he could
		else if(amount < minCall || amount > this.chips)
			return false;

		this.chips -= amount;
		this.chipsInBid += amount;
		this.chipsInPot += amount;

		return true;
	};

	// @Interface for game/room
	this.fold = function(params) {
		this.folded = true;

		return true;
	};

	// @Interface for game/Pot.js
	this.reset = function() {
		this.allin = false;
		this.folded = false;

		this.chipsInPot = 0;
		this.chipsInBid = 0;
		this.chipsInMainPot = 0;
		this.chipsInSidePot = 0;

		this.hand = null;

		if(this.chips == 0) {
			this.playing = false;
			this.turnId = null;
		}
	};

	// @Interface for core/turns
	this.turnId = seat;
	// Returns whether the player can take a bid action
	this.isPlaying = function() {
		return !this.allin && !this.folded && this.turnId != null && this.chips > 0 && this.playing;
	};

	this.is = function(player) {
		return this.username == player.username;
	};

	this.get_info = function() {
		var ai = typeof this.ai !== 'undefined' ? true : false;
		return {
			ai: ai,
			username: this.username,
			allin: this.allin,
			chips: this.chips,
			chipsInPot: this.chipsInPot,
			chipsInBid: this.chipsInBid,
			chipsInMainPot: this.chipsInMainPot,
			chipsInSidePot: this.chipsInSidePot,
		};
	};
};