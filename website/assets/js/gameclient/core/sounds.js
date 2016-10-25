var Sounds = {
	init: function() {
		Sounds.click= new buzz.sound(url_base + "assets/sounds/menu/click.wav");
		Sounds.challenge= new buzz.sound(url_base + "assets/sounds/menu/challenge.wav");
		Sounds.lockin= new buzz.sound(url_base + "assets/sounds/menu/lockin.wav");
		Sounds.start= new buzz.sound(url_base + "assets/sounds/menu/start.wav");
		Sounds.error= new buzz.sound(url_base + "assets/sounds/menu/error.wav");
	}
};