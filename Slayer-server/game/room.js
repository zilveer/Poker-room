
var Player = require('./player');
var Poker = require('./poker');

var Room = function(id, room_info) {
    this.room_id = id;
    this.name = room_info.name ? room_info.name : 'Game ' + id;
    this.players = {};
    this.turn = TurnHandler.create_handler(this.turn_timeout, this.players);
    this.seats = room_info.seats ? room_info.seats : 1;
    this.blind = room_info.blind;
    this.sblind = this.blind / 2;
    this.type = 'Sit & go';
    this.currency = room_info.currency;
    this.cards = null;
};

Room.prototype.fetchBestHand = function() {
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
};

Room.prototype.get_info = function() {
    return {
        room_id : this.room_id, name : this.name,
        seats : this.seats, type : this.type, players : this.players,
        turn : this.turn.get_info(),
        blind : this.blind, sblind: this.sblind, currency: this.currency,
        avg_pot : 0,
    };
};

Room.prototype.get_game_info = function() {
    return this.get_info();
};

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

Room.prototype.call_join_room = function(user_id, params) {
    var user = Server.getUser(user_id);
    var joined = false;

    // find old seat of player or reserve an empty seat
    for(var seat=0; seat<this.seats; seat++) {
        if(
            typeof this.players[seat] === 'undefined' 
            ||this.players[seat].username == user.username
        ) {
            user.room_id = params.room_id;
            user.seat = params.seat;
    
            this.players[seat] = new Player(seat, user);

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

    this.sendExceptTo(user_id, {
        group : 'Room',
        method : 'join_room_notify',
        params : this.players[user_id]
    });
};

module.exports = Room;