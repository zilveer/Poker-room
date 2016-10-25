var Room = {
	info: {
		room_id: null,
		player_id: null,
	},
	ok: false,

	init: function() {
		if(Room.info.room_id != null) {
			Connector.info("Joining room...");
			Client.send('Room', 'join_game', {room_id:Room.info.room_id});
		}
	},


	send: function(method, params) {
		Client.send('Game', method, $.extend({room_id:Room.info.room_id,player_id:Room.info.player_id}, params));
	},

	join_game_handler: function(info) {
		if(this.ok) return;

		Connector.info("Loaded match");

		Room.info.room_id = parseInt(info.room.room_id);
		Room.info.player_id = parseInt(info.room.player_id);

		Game.turn = info.turn;
		Game.status = info.status;

		Game.areas = info.map.areas;
		Game.players = info.map.players;

		Graphics.add_tiles(info.map.tiles);
		Loader.init();

		this.ok = true;
	},

	leave_room_handler: function(room) {
		//@todo implement
	},

	player_join_notify: function(username) {
		//@todo implement
		//GUI.remove_player(player_id);
	},

	player_leave_notify: function(player_id) {
		GUI.remove_player(player_id);
	},
};