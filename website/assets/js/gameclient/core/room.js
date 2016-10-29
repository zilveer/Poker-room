var Room = {
	templates: {},
	views: {},
	config: {
		room_id: null
	},

	init: function(config) {
		Auth.callback = Room.start;
		Room.config = config;
		Client.routing = Room.routing;

		// Listing
		Room.templates.room_list_item = Handlebars.compile($('#template-room-list-item').html());
		Room.views.room_list = $('#room-list');
		Room.views.create_btn = $('#room-list-btn-create');
		Room.views.create_btn.click(function(e) {
			Room.send('create_room');
		});

		// View
		Room.templates.room_view = Handlebars.compile($('#template-room-view').html());
		Room.views.room_view = $('#room-view');
	},

	start: function() {
		if(Room.config.room_id != null) {
			//GUI.set_state("game");
			//Client.info("Joining room...");
			//Room.send('join_room');
		}

		else {
			GUI.set_state("rooms");
			Client.info("Listing rooms...");
			Room.send('list_rooms');
		}
	},

	routing: function(data) {
		if(Object.keys(Room).indexOf(data.method) !== -1) {
			data.group = 'Room';
		}
		return data;
	},

	join_room: function(room_id) {
		Room.config.room_id = room_id;
		Room.send('join_room');
	},

	join_room_error: function(str) {
		Room.config.room_id = null;
		Client.error(str);
		//Room.list_rooms();
	},

	list_rooms_handler: function(rooms) {
		Client.hide();

		for(var room_id in rooms) {
			Room.create_room_notify(rooms[room_id]);
		}
	},

	join_room_handler: function(room) {
		//room.players_number = Object.keys(room.players).length;
		room.creator = Auth.user_id == room.user_id;

		// best variable name 2016 no kappa
		var roomViewView = Room.templates.room_view( room );
		Room.views.room_view.find('#room-view-content').html(roomViewView);
		Room.views.room_view.modal('show');
		Room.views.room_view.find("#room-view-btn-start").click(Room.start_room);
	},

	start_room: function(e) {
		Room.send('start_room');
	},

	start_room_notify: function(params) {
		Client.error('Undefined room start function.');
	},

	start_game_notify: function(params) {
		Client.error('Undefined game start function.');
	},

	create_room_handler: function(room) {
		Room.join_room(room.room_id);
	},

	create_room_notify: function(room) {
		//room.players_number = Object.keys(room.players).length;
		var roomEntryView = Room.templates.room_list_item( room );
		Room.views.room_list.append( roomEntryView );

		$('.room-list-item[room_id="'+room.room_id+'"]').click(function(){
			var room_id = $(this).attr('room_id');
			Room.join_room(room_id);
		});
	},

	remove_room_notify: function(params) {
		Room.views.room_list.find('tr[room-id="' + params.room_id + '"]').remove();
	},

	send: function(group, method, params) {
		if(typeof(params) === 'undefined') {
			if(typeof(method) === 'array') {
				method = group;
				group = 'Game';
				params = method;
				if(Room.config.room_id !== null)
					params.room_id = Room.config.room_id;
			}
			else if(typeof(params) === 'undefined') {
				method = group;
				group = 'Game';
				if(Room.config.room_id !== null)
					params = {room_id:Room.config.room_id};
			}
		}

		Client.send(group, method, params);
	}
};