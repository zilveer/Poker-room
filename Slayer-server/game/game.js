
var Player = require('./player')
var AI = require('./ai/factory')

module.exports = {

	init: function(conf) {
		this.config = conf;
		for(var room_type of this.config.room_options) {
			for(var i=0; i<room_type.number; i++) {
				Game.create_room(room_type);
			}
		}

		for(var p=0;p<2;p++) {
			Game.rooms[0].players[p] = new Player(p, {});
			var player = Game.rooms[0].players[p];
			player.ai = AI.createSimpleton(player);
			player.username = "bot " + p;
			player.user_id = -p -1;
			player.playing = true;
			player.chips = 100000;
		}
	},
};