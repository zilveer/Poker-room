
var Game = {
	room: null,
	seat: null,

	init: function(conf) {
		Room.join_room_handler = Game.join_room_handler;
		//GameGraphics.init();
		GameGUI.init();

		Client.connect();
	},

	start: function() {
		console.log('load completed');
	},

	request_bid_notify: function(params) {
		Game.room.turn.current = params.player_id;
		GameGUI.update_interface();
	},

	// Blinds and betting
	bid_notify: function(params) {
		Game.room.pot = params.pot;
		Game.room.minBid = params.minBid;
		Game.room.players[params.player_id].chips -= params.amount;
		Game.room.players[params.player_id].chipsInBid += params.amount;
		Game.room.players[params.player_id].chipsInPot += params.amount;

		GameGUI.bid_notify(params.player_id, params.type);
		GameGUI.update_interface();
	},

	new_turn_notify: function(params) {
		Game.room.minBid = params.minBid;

		Game.room.turn.blind = params.blind;
		Game.room.turn.sblind = params.sblind;
		Game.room.turn.dealer = params.dealer;
		Game.room.turn.start = params.start;

		GameGUI.setup();
	},

	join_room_handler: function(room) {
		GUI.set_state('game');
		Game.room = room;

		GameGUI.setup();
		GameGraphics.setup();
	},

	// Revealed community cards
	reveal_cards_notify: function(params) {
		// reset players
		for(var p in this.room.players) {
			Game.room.players[p].chipsInBid = 0;
		}
		GameGUI.setup();

		// set cards
		Game.room.cards = params.cards;
		GameGraphics.update_cards();
	},

	// Got hand from server
	reveal_hand_handler: function(params) {
		Game.room.hand = params.cards;
		GameGraphics.update_hand();
	},

	join_room_notify: function(player) {
		//$('#player-cards').append('<div player_id="'+player.turnId+'">' + player.username + '</div>');
	},

	leave_room_handler: function() {
		//$('#player-cards').find('[player_id="'+player.turnId+'"]').remove();
	},

	game_error: function(str) {
		$('#connector').text(str);
	},
};