
module.exports = function(seat, params) {
	// client info:
	this.playing = false;		//whether the play is in the room, playing or afk
	this.client_id = params.user_id;
	this.database_id = params.dbid;
	this.ai = false;

	// game info:
	this.seat = seat;
	this.username = params.username;
	this.chips = 1000; // @todo: query from... somewhere
	this.hand = [];
};