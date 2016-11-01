var GUI = {
	state: null,
	tabs: {},

	init: function(conf) {
		//@todo: use conf to define GUI states
		GUI.tabs.rooms = $('#tab-rooms');
		GUI.tabs.load = $('#tab-load');
		GUI.tabs.game = $('#tab-game');
		GUI.tabs.connect = $('#tab-connect');

		GUI.debug = $('#debug');

		for(var tab in GUI.tabs) {
			GUI.tabs[tab].hide();
		}
	},

	set_state: function(state) {
		if(GUI.state != null)
			GUI.tabs[GUI.state].hide();
		GUI.state = state;
		GUI.tabs[GUI.state].show();
	},

	add_state: function(state) {
		GUI.tabs[GUI.state] = $('#tab-' + state);
	},


};