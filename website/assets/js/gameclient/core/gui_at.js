var GUI = {
	//cached meshes to be picked, selected, moved, etc for animations
	selected_area: null,

	init: function() {
		$('#debug').hide();
		$('#game-screen-footer').show();
		
		this._turn_mine = $('.my-turn');
		this._turn_others = $('.not-my-turn');
		this._players = $('#gui-turn-players ul');

		this._status_loading = $('#gui-status-loading');
		this._status_starting = $('#gui-status-starting');
		this._status_playing = $('#gui-status-playing');

		this._area_income = $('#select-income');
		this._area_cost = $('#select-cost');
		this._area_gold = $('#select-gold');
		this._area_player = $('#select-player');

		//set up players tab
		this._players.html('');
		for(var player_id in Game.players) {
			GUI.add_player(player_id);
		}

		$('#btn-end-turn').click(Game.end_turn);

		//tabs GUI
		$('[role="pick-figure"]').click(function(){
			Graphics.pick_figure($(this).attr('figure_type'), $(this).attr('action'), null);
		});

		$(document).keyup(function(e) {
			//ESC:
			if (e.keyCode == 27) {
				Graphics.unpick_figure();
			}
		});

	},

	add_player: function(player_id) {
		this._players.append('<li class="gui-player" player-id="'+player_id+'"></li>');

		var l = Game.players[player_id].color.length;
		if(l > 6) {
			Game.players[player_id].color = Game.players[player_id].color.substring(l-6, l);
		}

		this.set_player(player_id);
	},

	set_player: function(player_id) {
		this._players.find('.gui-player[player-id="'+player_id+'"]').html(
			'<i style="color:#'+Game.players[player_id].color+'" class="ra ra-'+(Game.turn.current == player_id ? 'player' : 'aura')+'"></i>' + 
			' ' +
			Game.players[player_id].username +
			' ('+ player_id +')'
		).addClass('current');
	},

	remove_player: function(player_id) {
		this._players.find('.gui-player[player-id="'+player_id+'"]').remove();
	},

	select_area: function(area_id) {
		if(area_id == null || typeof Game.areas[area_id] === 'undefined')
			return;

		var area = Game.areas[area_id];
		var player = Game.players[area.owner_id];

		this._area_income.text(area_id);
		this._area_cost.text('');
		this._area_gold.text(area.gold);
		this._area_player.text(player.username);
	},

	deselect_area: function(area_id) {
		if(area_id == null || typeof Game.areas[area_id] === 'undefined')
			return;

		this._area_income.text('');
		this._area_cost.text('');
		this._area_gold.text('');
		this._area_player.text('');
	},

	//update previous and currenet player's GUI
	switch_turns: function() {
		if(/*Game.turn.current == Game.turn.previous || */Game.turn.current == null)
			return;

		if(Game.turn.previous != null && Game.turn.previous != -1) {
			this.set_player(Game.turn.previous);

			if(Room.info.player_id == Game.turn.previous) {
				this._turn_mine.hide();
				this._turn_others.show();
			}
		}

		this.set_player(Game.turn.current);
		if(Room.info.player_id == Game.turn.current) {
			this._turn_others.hide();
			this._turn_mine.show();			
		}
	},

	//1)
	set_status_loading: function() {
		this._status_loading.show();
	},

	//2)
	set_status_starting: function() {
		this._status_loading.hide();
		this._status_starting.show();

		GUI.switch_turns();

		if(Game.turn.current == Room.info.player_id) {
			Graphics.pick_figure('building1', 'create_start_area', null);
		}
	},

	//3)
	set_status_playing: function() {
		this._status_loading.hide();
		this._status_starting.hide();
		this._status_playing.show();

		GUI.switch_turns();
	},
};