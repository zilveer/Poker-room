
const Player = require('./player');
const Poker = require('./poker');
const Pot = require('./pot');
const ArrayHelper = require('./arrayhelper');

var Room = function(id, room_info) {
    this.room_id = id;
    this.name = room_info.name || 'Game ' + id;
    this.players = {};
    this.turn = TurnHandler.create_handler(this.players);
    this.pot = new Pot(this.players);
    this.cards = new Poker.Hand([]);
    this.deck = [];
    this.seats = room_info.seats || 1;
    this.pokerType = room_info.pokerType || 'texas';
    this.type = room_info.type || 'sit & go';
    this.currency = room_info.currency || 'rws';
    this.status = "waiting";

    this.blind = room_info.blind || 2;
    this.sblind = this.blind / 2;

    this.commStatus = null;
    this.community = [
        {type: 'preflop', number: 0},
        {type: 'flop', number: 3},
        {type: 'turn', number: 1},
        {type: 'river', number: 1}
    ];
};

Room.prototype.newTurn = function() {
    // find next player to become dealer
    var next = this.turn.getNext();
    this.turn.setStart(next);
    this.turn.reset();

    this.deck = ArrayHelper.shuffle(Poker.FrenchDeck);
    this.commStatus = 0;

    // set dealer and blinds
    // $$ TODO: itt, nem jó ...
    this.turn.dealer = this.turn.getFromEnd(2);
    this.turn.sblind = this.turn.getFromEnd(1);
    this.turn.blind = this.turn.last;

    console.log(this.turn.current);
    console.log(this.turn.dealer);
    console.log(this.turn.sblind);
    console.log(this.turn.blind);

    this.request_bid();
};

Room.prototype.request_bid = function() {
    this.status = 'bidding';

    this.turn.fetchNext();

    this.sendToAll('request_bid_notify', {
        player_id: this.turn.current
    });
};

Room.prototype.call_bid = function(user_id, params) {
    var player = this.getPlayer(user_id);
    if(!player || this.status != 'bidding')
        return;



    //@todo: implement currency handling
    // $$$ITT , @todo:
    // clear everything of prev. round
    // request bidding
    // set status

    if(this.turn.end) {
        this.newTurn();
    } else {
        this.requestBid();
    }
};




Room.prototype.call_chat_message = function(user_id, params) {

};

Room.prototype.getPlayer = function(user_id) {
    //@todo: write Hash helper for faster search
    var arr = this.players.filter(function(v) {
        return v.user_id === user_id;
    });
    return arr.length > 0 ? arr : false;
};

// @todo: unused and shouldn't be used
/*Room.prototype.fetchBestHand = function() {
    // @todo: implement splitting !
    // @todo: it would be better first to make the client and start calling methods
    var bestPlayer = null;
    var bestHandType = null;

    for(var player in this.players) {
        var hand = this.cards.merge(this.player.hand);

        var handType = hand.getType();
        if(handType > bestHandType) {
            bestHandType = handType;
            bestPlayer = player;
        }
    }

    return [bestHandType, bestPlayer];
};*/

Room.prototype.sendToAll = function(method, params) {
    params.room_id = this.room_id;
    var p = {
        group : 'Game',
        method : method,
        params : params,
    };
    for (var user_id in this.users) {
        if(!this.players[this.users[user_id].player_id].ai) {
            Server.sendTo(user_id, p);
        }
    }
};

Room.prototype.sendExceptTo = function(user_id0, params) {
    params.room_id = this.room_id

    if(typeof params.group === 'undefined')
        params.group = 'Game';

    for (var user_id in this.users) {
        if(user_id != user_id0) {
            Server.sendTo(user_id, params);
        }
    }
};

Room.prototype.get_info = function() {
    return {
        room_id : this.room_id, name : this.name,
        seats : this.seats, type : this.type,
        players_number : len(this.players),
        turn : this.turn.get_info(),
        blind : this.blind, sblind: this.sblind, currency: this.currency,
        avg_pot : 0,
    };
};

Room.prototype.get_game_info = function() {
    var info = this.get_info();

    info.players = {};
    for(var p in this.players) {
        info.players[p] = this.players[p].get_info();
    }

    return info;
};

Room.prototype.call_join_room = function(user_id, params) {
    var user = Server.getUser(user_id);
    var joined = false;
    var seat = null;

    // find old seat of player or reserve an empty seat
    for(seat=0; seat<this.seats; seat++) {
        if(
            typeof this.players[seat] === 'undefined' 
            ||this.players[seat].username == user.username
        ) {
            user.room_id = params.room_id;
            this.players[seat] = new Player(seat, user);

            //@todo: temporal
            user.seat = params.seat;
            this.players[seat].playing = true;
            this.players[seat].chips = 1000;

            joined = true;
            break;
        }
    }

    if(!joined) {
        Server.sendTo(user_id, {
            group: 'Room',
            method: 'join_room_error',
            params: 'Unable to join room.',
            response: 'Unable to join room.'
        });
        return;
    }

    Server.sendTo(user_id, {
        group: 'Room',
        method: 'join_room_handler',
        params: this.get_game_info()
    });

    // Notify others 
    if(len(this.players) > 1) {
        this.sendExceptTo(user_id, {
            group : 'Room',
            method : 'join_room_notify',
            params : this.players[user_id]
        });

        // (re)start the room
        if(len(this.players) > 2) {
            this.turn.init();
            this.newTurn();
        }
    }
};

Room.prototype.call_leave_room = function(user_id, params) {

};

Room.prototype.call_leave_seat = function(user_id, params) {

};

Room.prototype.call_take_seat = function(user_id, params) {

};

Room.prototype.call_leave_seat = function(user_id, params) {

};

module.exports = Room;