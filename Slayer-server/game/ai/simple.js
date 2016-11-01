

module.exports = function(player) {
	this.player = player;
	this.name = 'Stupid MF';

	this.bidAction = function(minBid, bidCall) {
		var minCall = minBid - this.player.chipsInBid;

		bidCall(this.player.user_id, {
			type: minCall == 0 ? 'check' : 'call',
			amount: minCall
		});
	}
}