var Auth = {
	config: {
		username: null,
		login_token: null,
		role: null
	},
	
	init: function(conf) {
		Auth.config = conf;
	},

	validate: function() {
		Client.info("Authenticating...");
		Client.send('Auth:validate', Auth.config);
	},

	callback: function() {
		Client.error('Please provide an authentication callback function.');
	},

	validate_handler: function(client_id) {
		Auth.user_id = client_id;
		Client.client_id = client_id;
		Auth.callback();
	},

	validate_error: function() {
		Client.error("Authentication failed.");
	},
};