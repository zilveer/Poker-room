var fs = require('fs');
var Room = require('../Slayer-server/game/room')
var TH = require('./testhelper');
var Player = require('../Slayer-server/game/player')
global.TurnHandler = require('../Slayer-server/core/turns/turnhandler')

module.exports = {
	passed: 0,

	run: function() {
		if(!this.test_turns())
			return;
		
		if(!this.test_new_turns())
			return;

		if(!this.test_three_turns())
			return;
		
		if(!this.test_two_turns())
			return;

		//if(!this.test_blinds())
		//	return;

		//if(!this.test_seats())
		//	return;

		//if(!this.test_timeout())
		//	return;

		console.log('All ' + this.passed + ' Turn tests PASSED!');
	},

	init: function(pN) {
		this.room = new Room(0, {seats: pN});
		for(var p=0;p<pN;p++) {
			var player = new Player(p, {
				user_id: p, dbid: p, username: p
			});

			player.addChips(1000);
			this.room.players[p] = player;
		}

		this.room.turn.init();
	},

	check: function(a,b,c,d,e) {
		if(this.room.turn.current != a)
			return TH.fail('current ['+a+']', a, this.room.turn.current);
		if(this.room.turn.next != b)
			return TH.fail('next ['+b+']', b, this.room.turn.next);
		if(this.room.turn.previous != c)
			return TH.fail('previous ['+c+']', c, this.room.turn.previous);
		if(this.room.turn.start != d)
			return TH.fail('start ['+d+']', d, this.room.turn.start);
		if(this.room.turn.last != e)
			return TH.fail('last ['+e+']', e, this.room.turn.last);
		return true;
	},

	test_turns: function() {
		this.init(6);

		if(!this.check(0, 1, null, 0, 5))
			return false;

		this.passed++;
		this.room.turn.fetchNext();

		if(!this.check(1, 2, 0, 0, 5))
			return false;

		this.room.turn.fetchNext();
		this.room.turn.fetchNext();
		this.room.turn.fetchNext();
		this.room.turn.fetchNext();

		if(!this.check(5, 0, 4, 0, 5))
			return false;

		this.passed++;

		this.room.turn.fetchNext();

		if(!this.check(0, 1, 5, 0, 5))
			return false;
		return true;
	},

	test_new_turns: function() {
		// current: 2, previous: 0
		this.room.turn.setStart(2);
		this.room.turn.reset();

		if(!this.check(2, 3, 0, 2, 1))
			return false;
		this.passed++;

		this.room.turn.fetchNext();
		if(!this.check(3, 4, 2, 2, 1))
			return false;
		this.passed++;

		this.room.turn.setStart(5);
		this.room.turn.reset();

		if(!this.check(5, 0, 3, 5, 4))
			return false;

		this.passed++;
		this.room.turn.fetchNext();

		return true;
	},

	// test a 3 player game
	test_three_turns: function() {
		this.init(3);

		if(!this.check(0, 1, null, 0, 2))
			return false;
		this.passed++;

		this.room.turn.fetchNext();
		if(!this.check(1, 2, 0, 0, 2))
			return false;
		this.passed++;

		this.room.turn.fetchNext();
		if(!this.check(2, 0, 1, 0, 2))
			return false;
		this.passed++;

		return true;
	},

	// test a heads-up
	test_two_turns: function() {
		this.init(2);

		if(!this.check(0, 1, 1, 0, 1))
			return false;
		this.passed++;

		this.room.turn.fetchNext();
		if(!this.check(1, 0, 0, 0, 1))
			return false;
		this.passed++;

		this.room.turn.fetchNext();
		if(!this.check(0, 1, 1, 0, 1))
			return false;
		this.passed++;

		return true;
	},

	test_blinds: function() {

	},

	test_seats: function() {

	},

	test_timeout: function() {

	},
};