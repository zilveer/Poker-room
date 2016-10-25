var Client = {
	socket: null,
	id: null,
	config: {
		address: '127.0.0.1:8000'
	},
	hidden: false,

	reset: function() {
		this.progress(0);
	},
	
	hide: function() {
		if(!this.hidden) {
			//this._parent.modal("hide");
			this.hidden = true;
		}
	},

	show: function() {
		if(this.hidden) {
			//this._parent.modal("show");
			this.hidden = false;
		}
	},

	init: function(conf) {
		Client.config = conf;
		this._parent = $('#connector');
		this._progress = $('#connector-progress .progress-bar');
		this._out = $('#connector-response');
		this._title = $('#connector-title');
	},

	connect: function() {
		GUI.set_state('connect');
		Client.info("Connecting to server...");

		Client.socket = new WebSocket('ws:' + Client.config.address);
		Client.socket.onopen = Auth.validate;
		Client.socket.onclose = Client.disconnected;
		Client.socket.onerror = Client.disconnected;
		Client.socket.onmessage = Client.received;
	},
	
	disconnected: function() {
		Client.error("Disconnected from server.");
	},
	
	error: function(str) {
		this._connector.show();
		this._out.html('<span class="text text-danger"><i class="fa fa-exclamation-triangle"></i> '+str+'</span> <a href="profile">Back to website</a>');
		this._progress.removeClass('progress-bar-primary');
		this._progress.addClass('progress-bar-danger');
		this._progress.text('Error!');	
	},

	info: function(str) {
		console.info(str);
		this._out.html('<span class="text text-info"><i class="fa fa-info-circle"></i> '+str+'</span>');
		this._progress.removeClass('progress-bar-danger');
		this._progress.addClass('progress-bar-primary');
	},

	send: function(group, method, params) {
		if(typeof(params) === 'undefined') {
			params = method;
			var splt = group.split(':');
			group = splt[0];
			method = splt[1];
		}
		
		console.log(' <-- ', group, method, params);

		var str = JSON.stringify({
			"group": group,
			"method": method,
			"params": params
		});
		
		Client.log(group+"."+method + '  <i class="fa fa-arrow-right"></i>');
		Client.socket.send(str);
	},

	received: function(e){
		var data = jQuery.parseJSON(e.data);

		if(typeof Client.routing === 'function') 
			data = Client.routing(data);
		
		console.log(' --> ', data.group, data.method, data.params);

		if(typeof window[data.group] === 'undefined' || typeof window[data.group][data.method] === 'undefined') {
			Client.error("Client error: invalid method or group requested from server ("+ data.group +"."+ data.method +")");
			return;
		}

		//Client.log('<i class="fa fa-arrow-right"></i> '+data.group+"."+data.method);

		try {
			window[data.group][data.method](data.params);
		} catch(e) {
			console.error(e);
		}
	},
	
	log: function(str) {
		$('#debug').prepend('<li class="list-group-item">'+str+'</li>');
	},
};