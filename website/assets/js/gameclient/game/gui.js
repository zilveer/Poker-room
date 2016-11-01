
var GameGUI = {
	state: 0,

	init: function() {
		$('[role="bid-btn"]').click(this.click_bid);
		$('[role="fold-btn"]').click(this.click_fold);
		$('#bid-input').change(this.set_bid);
	},

	setup: function() {
		GameGUI.update_table();

		for(var p in Game.room.players) {
			GameGUI.update_player(p);
		}
		GameGUI.update_interface();
	},

	bid_notify: function(p, bid_type) {
		console.log('bid notify', p);
		GameGUI.update_table();
		GameGUI.update_player(p);
	},

	update_table: function() {
		$('#pot').text(Game.room.pot + '$');
	},

	update_player: function(p) {
		$('.player[player-id="'+p+'"] .name').text(Game.room.players[p].username);
		$('.player[player-id="'+p+'"] .chips').text(Game.room.players[p].chips + '$');
		$('.player[player-id="'+p+'"] .bid').text(Game.room.players[p].chipsInBid + '$');

		if(Game.room.turn.dealer == p)
			$('.player[player-id="'+p+'"] .role').text('D');
		else if(Game.room.turn.sblind == p)
			$('.player[player-id="'+p+'"] .role').text('SB');
		else if(Game.room.turn.blind == p)
			$('.player[player-id="'+p+'"] .role').text('BB');
		else 
			$('.player[player-id="'+p+'"] .role').text('');

		if(Game.room.turn.current == p)
			$('.player[player-id="'+p+'"] .turn').text('<<');
		else if(Game.room.turn.start == p)
			$('.player[player-id="'+p+'"] .turn').text('ST');
		else 
			$('.player[player-id="'+p+'"] .turn').text('');
	},

	update_interface: function() {
		if(Game.room.turn.current != Game.room.player_id) {
			GameGUI.set_state(0);
			return;
		}

		var player = Game.room.players[Game.room.player_id];
		var toCall = Game.room.minBid - player.chipsInBid;

		// Buttons
		if(toCall == 0) {
			// Check / Bet
			$('[role="bid-bet-amount"]').text(Game.room.blind);
			GameGUI.set_state(1);
		} else if(toCall >= player.chips) {
			// All in
			$('[role="bid-allin-amount"]').text(player.chips);
			GameGUI.set_state(1);
		} else {
			// Call / Raise
			$('[role="bid-call-amount"]').text(toCall);
			$('[role="bid-raise-amount"]').text(Game.room.minBid*2);
			GameGUI.set_state(2);
		}

		$('#bid-input').attr('min', toCall);
		$('#bid-input').attr('max', player.chips);
		$('#bid-input').val(Game.room.minBid * 2);

		//@todo: +if all-in
	},

	// Bid options clicked
	click_bid: function(e) {
		var type = $(this).attr('bid-type');
		if(type == 'bet' || type == 'raise')
			var amount = $('#bid-input').val();

		Room.send('bid', {
			type: type,
			amount: amount,
		});
	},

	set_bid: function(e) {
		var amount = $(this).val();
		$('[role="bid-bet-amount"]').text(amount);
		$('[role="bid-call-amount"]').text(amount);
		$('[role="bid-raise-amount"]').text(amount);
	},

	// Fold option clicked
	click_fold: function(e) {
		Room.send('bid', {
			type: 'fold',
			reveal: false
		});
	},

	set_state: function(state) {
		$('.bid-stage[stage="'+this.state+'"]').hide();
		this.state = state;
		$('.bid-stage[stage="'+this.state+'"]').show();

		if(state == 0) {
			$('.bid-stage[stage="R"]').hide();
		} else {
			$('.bid-stage[stage="R"]').show();
		}
	},



	//@todo: these belong to a diff class
	// Add flop or show cards for newcomers
	set_comm_cards: function() {
		//for(var )
		//@todo: Game.room
	},

	// Expand the cards on the table
	add_comm_cards: function(cards) {

	},

	// Set my hand
	set_hand_cards: function(cards) {

	},
};