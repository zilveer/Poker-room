
var Game = {
	init: function(conf) {
		Room.join_room_handler = function(room) {
			GUI.set_state('game');
		};

		Client.connect();
	},

	start: function() {
		console.log('load completed');
	}
};