
module.exports = {

	init: function(conf) {
		this.config = conf;

		for(var room_type of this.config.room_options) {
			for(var i=0; i<room_type.number; i++) {
				Game.create_room(room_type);
			}
		}
	},
};