
var Game = {
	init: function(conf) {
		Room.join_room_handler = Game.join_room_handler;

		Client.connect();
	},

	start: function() {
		console.log('load completed');
	},

	join_room_handler: function(room) {
		GUI.set_state('game');

		console.log(room);
	},

	join_room_notity: function(player) {
		$('#player-cards').append('<div player_id="'+player.turnId+'">' + player.username + '</div>');
	},

	leave_room_handler: function() {
		$('#player-cards').find('[player_id="'+player.turnId+'"]').remove();
	},

};