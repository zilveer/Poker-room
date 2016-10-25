

//imitates Server behavior for fast testing
var FauxServer = {
	send: function(params) {
		Client.received({data:JSON.stringify(params)});
	},

	Auth_validate: function(params) {
		this.send({
			"group": 'Auth',
			"method": 'auth_success',
			"params": "asd1",
			"response": 'Welcome, '+params.username+'!'
		})
	},

	Room_join_room: function(params) {
		this.send({
			"group": 'Room',
			"method": 'join_room_handler',
			"params": {
				room_id : 0,
				user_id : 1,
				playing : true,
				map : 'Atlantis',
				name : "nobody's massacre",
				players : [Client.info.username],
				max_players : 6,
				mode : 'ext',
				size : 'normal',
				last_activity : (new Date()).getTime(),
			},
		})
	},

	Room_join_load_room: function(params) {
		this.send({
			"group": 'Room',
			"method": 'join_load_room_handler',
			"params": {
				room: {room_id:0, player_id:0},
				map: {
					'players': [{
						username:'Me', player_id:0,
						color:'bada55'
					}],
					'areas' : [],
					'tiles' : [
						{"q":-5,"r":1,"s":4,"h":10,"walkable":true,"userData":{}},
						{"q":-5,"r":2,"s":3,"h":10,"walkable":true,"userData":{}},
						{"q":-5,"r":3,"s":2,"h":10,"walkable":true,"userData":{}},
						{"q":-4,"r":0,"s":4,"h":10,"walkable":true,"userData":{}},
						{"q":-4,"r":1,"s":3,"h":10,"walkable":true,"userData":{}},
						{"q":-4,"r":2,"s":2,"h":10,"walkable":true,"userData":{}},
					],
				},
				status: 'playing',
				turn: {
					initial: false,
					current: 0,
					previous: null,
					number: 1,					
				},
			},
		});
	},




/* NOT IMPLEMENTED ON SERVER: - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */




	Game_move_figure: function(params) {
		this.send({
			"group": 'Game',
			"method": 'load_map_handler',
			"params": {
			}
		});
	},
	Game_create_figure: function(params) {
		this.send({
			"group": 'Game',
			"method": 'load_map_handler',
			"params": {
			}
		});
	},
	Game_destroy_tile: function(params) {
		this.send({
			"group": 'Game',
			"method": 'load_map_handler',
			"params": {
			}
		});
	},


	Match_player_turn: function(params) {
		this.send({
			"group": 'Match',
			"method": 'player_turn_handler',
			"params": {
			}
		});
	},
	Match_your_turn: function(params) {
		this.send({
			"group": 'Match',
			"method": 'your_turn_handler',
			"params": {
			}
		});
	},
	Match_resign: function(params) {
		this.send({
			"group": 'Match',
			"method": 'resign_handler',
			"params": {
			}
		});
	},
	Match_chat: function(params) {
		this.send({
			"group": 'Match',
			"method": 'chat_handler',
			"params": {
			}
		});
	},

};

Client.connect = function() {Client.connected();};
//Client.disconnect = function() {};
Client.send = function(sgroup, smethod, sparams) {
	if(typeof FauxServer[sgroup + "_" + smethod] !== 'undefined')
		FauxServer[sgroup + "_" + smethod](sparams);
	else
		console.log(sgroup, smethod, "is not found on FauxServer!");
};



