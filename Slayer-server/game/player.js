
module.exports = function(seat, params) {
	// @Interface for Slayer/core/*
	this.user_id = params.user_id;
	this.database_id = params.dbid;
	this.username = params.username;

	// @Interface for game/room
	this.hand = null; //@Var game/poker/Hand
	this.playing = false; // has the player not folded?
	this.allin = false; // chips == 0
	this.ai = false;

	// @Interface for game/Pot
	this.chips = 0; // chips at hand
	this.chipsInBid = 0; // chips in pot for the round
	this.chipsInPot = 0; // chips in pot for the turn
	this.chipsInMainPot = 0; // chips that the player can win for the turn 
	this.chipsInSidePot = 0; // used by the sidepot algorithm for all-ins

	// @Interface for game/room
	this.bid = function(params, minBid) {
		var minCall = minBid - this.chipsInBid;
		var amount = 0;
		var type = params.type;

		if(params.type == 'check')
			amount = 0;
		else if(params.type == 'call')
			amount = minCall;
		else // raise, bet, sblind, blind
			amount = parseInt(params.amount);
			//@todo: raise/bet must be at least twice the amount of big blind ?

		if(amount < minCall || amount > this.chips)
			return false;

		params.amount = amount;

		if(this.chips == amount)
			this.allin = true;
		this.chips -= amount;
		this.chipsInBid += amount;
		this.chipsInPot += amount;

		return true;
	};

	/*this.transferBid = function() {
		this.chipsInPot = this.chipsInBid;
		this.chipsInBid = 0;
	};*/

	// @Interface for game/Pot.js
	this.reset = function() {
		this.allin = false;
		this.chipsInPot = 0;
		this.chipsInBid = 0;
		this.chipsInMainPot = 0;
		this.chipsInSidePot = 0;
	};

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
			chipsInBid: this.chipsInBid,
			chipsInMainPot: this.chipsInMainPot,
			chipsInSidePot: this.chipsInSidePot,
		};
	};
};