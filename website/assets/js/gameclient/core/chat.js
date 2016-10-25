var Chat = {
	icons: ['beetle','bird-claw','butterfly','cat','dinosaur','dragon','dragonfly','eye-monster','fairy','fish','fox','gecko','hydra','insect-jaws','lion','love-howl','maggot','octopus','rabbit','raven','sea-serpent','seagull','shark','sheep','snail','snake','spider-face','spiked-tentacle','spiral-shell','suckered-tentacle','tentacle','two-dragons','venomous-snake','wyvern','wolf-head','wolf-howl'],

	init: function() {
		$('#btn-message').keypress(function(e){
			if(e.keyCode == 13) {
				Client.send("chat_message", $(this).val());
				$(this).val('');
			}
		});
	},

	receive: function(params) {
		var m = params.dbid % Chat.icons.length;
		var icon = Chat.icons[m];

		$('#chat-messages').append('<p><i class="ra ra-'+icon+'"></i> <strong>'+params.username+':</strong> '+params.message+'</p>');
	},
};
