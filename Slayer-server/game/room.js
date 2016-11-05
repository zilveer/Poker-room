
const Player = require('./player');
const Poker = require('./poker');
const Pot = require('./pot');
const ArrayHelper = require('./arrayhelper');

const Delay = {
    bidRequest: 100,
    dealCards: 100,
    endTurn: 100,
    newTurn: 100,
};

const StatusType = {
    PREFLOP: 0, FLOP: 1, TURN: 2, RIVER: 3
};

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
    this.cardStatus = null;
    this.blind = room_info.blind || 2;
    this.sblind = this.blind / 2;
    this.minBid = this.blind;
};

Room.prototype.bidRequest = function() {
    var player = this.players[this.turn.current];
    console.log(player.turnId, " is bidding");

    if(!player.ai) {
        this.sendToAll('request_bid_notify', {
            player_id: this.turn.current
        });
    } else {
        player.ai.bidAction(this.minBid, this.call_bid.bind(this));
    }
};

Room.prototype.call_bid = function(user_id, params) {
    var player = this.getPlayer(user_id);

    if(!player || this.status != 'bidding' || !this.turn.isCurrent(player))
        return this.sendErrorTo(player.turnId, 'not_in_turn');

    var prev_chipsInBid = player.chipsInBid;
    if(!player.bid(params, this.minBid))
        return this.sendErrorTo(player.turnId, 'wrong_amount');

    if(params.type == 'raise' || params.type == 'bet')
        this.minBid = params.amount + prev_chipsInBid;

    console.log(player.turnId, 'has', params.type + 'ed', params.amount);
    this._bid_notify(this.turn.current, params.type, params.amount);
    this.nextAction();
};

Room.prototype._bid_notify = function(player_id, type, amount) {
    this.sendToAll('bid_notify', {
        pot: this.pot.sumPot(),
        minBid: this.minBid,
        player_id: player_id,
        type: type,
        amount: amount
    });
};

Room.prototype.call_fold = function(user_id, params) {
    var player = this.getPlayer(user_id);

    if(!player || this.status != 'bidding' || !this.turn.isCurrent(player))
        return this.sendErrorTo(player.turnId, 'not_in_turn');

    if(!player.fold(params))
        return this.sendErrorTo(player.turnId, 'cant_fold');

    console.log(player.turnId, 'has', 'folded');

    this.sendToAll('fold_notify', {
        player_id: player.turnId,
        show: params.show || false,
        cards: params.show ? player.hand.get_info() : false
    });
    this.nextAction();
};

Room.prototype.nextAction = function() {
    if(this.turn.isLast() && this.pot.isEqualized()) {
        this.pot.resetBids();
        this.minBid = 0;

        if(this.cardStatus == StatusType.RIVER) {
            // Finished turn, let's start all over again
            this.status = 'revealing';
            setTimeout(this.endTurn.bind(this), Delay.endTurn);
        } else {
            // Deal community cards
            this.status = 'dealing';
            setTimeout(this.dealCards.bind(this), Delay.dealCards);
        }
    } else {
        // Get next player to bid
        this.turn.fetchNext();

        this.status = 'bidding';
        setTimeout(this.bidRequest.bind(this), Delay.bidRequest);
    }
};

Room.prototype.dealCards = function() {
    console.log('dealCards')
    this.status = 'dealing';
    this.cardStatus++;

    if(this.cardStatus == StatusType.FLOP) {
        this.cards.add(this.deck.pop());
        this.cards.add(this.deck.pop());
        this.cards.add(this.deck.pop());
    } else {
        this.cards.add(this.deck.pop());
    }

    this.sendToAll('reveal_cards_notify', {
        cards: this.cards.get_info(),
        type: this.cardStatus
    });

    this.turn.fetchNext();
    this.status = 'bidding';
    setTimeout(this.bidRequest.bind(this), Delay.bidRequest);
};

Room.prototype.endTurn = function() {
    var hands = [];
    var whands = {};
    for(var p in this.players) {
        if(this.players[p].folded) continue;
        var hand = this.cards.merge(this.players[p].hand)

        hands.push({
            player_id: p,
            hand: hand,
        });
        whands[p] = this.players[p].hand.get_info();
    }

    var winners = Poker.getBestHands(hands);
    var win_amount = 0;

    this.sendToAll('winner_notify', {
        winner: winners[0],
        win_amount: win_amount,
        hands: whands
    });


    for(var player of hands) {
        console.log(player.player_id, ':', player.hand.type, player.hand.high, player.hand.kicker, '--', player.hand.toString());
    }

    console.log('Winner:');
    var player = winners[0];
    console.log(player.player_id, ':', player.hand.type, player.hand.high, player.hand.kicker, '--', player.hand.toString());


    console.log('New turn should be requested');

    /*if(winners.length == 1) {
        win_amount = this.pot.rewardWinner(winners[0].player_id);

        this.sendToAll('winner_notify', {
            type: 'single',
            winner: winners[0].player_id,
            amount: win_amount
        });
    } else {
        console.log('Split');
        win_amount = this.pot.rewardWinners(winners);

        this.sendToAll('winner_notify', {
            type: 'split',
            winners: winners,
            amount: win_amount
        });
    }

    // Find next player to become dealer
    this.turn.setStart( this.turn.getNext() );

    // Reset everything
    this.turn.reset();
    this.pot.reset();
    this.deck = null;
    this.minBid = 0;
    this.turn.dealer = null;
    this.turn.sblind = null;
    this.turn.blind = null;
    this.cardStatus = 'null';
    this.status = 'restarting';

    setTimeout(this.newTurn.bind(this), Delay.newTurn);
    /**/
};

Room.prototype.newTurn = function() {
    this.turn.dealer = this.turn.getFromEnd(2);
    this.turn.sblind = this.turn.getFromEnd(1);
    this.turn.blind = this.turn.last;

    // Special case for heads-up: dealer is small blind
    if(Object.keys(this.players).length == 2)
        this.turn.dealer = this.turn.sblind;

    // Small blind
    var SB = this.players[this.turn.sblind];
    if(SB.bid({amount: this.sblind, type:'sblind'}, this.sblind))
        this._bid_notify(this.turn.sblind, 'sblind', this.sblind);

    // Big blind
    this.minBid = this.blind;
    var BB = this.players[this.turn.blind];
    if(BB.bid({amount: this.blind, type:'blind'}, this.blind))
        this._bid_notify(this.turn.blind, 'blind', this.blind);
  
    console.log('Blinds:', this.blind, this.sblind);

    // Deal cards
    this.deck = ArrayHelper.shuffle(Poker.FrenchDeck);
    this.cardStatus = 0;

    this.sendToAll('new_turn_notify', {
        dealer: this.turn.dealer,
        sblind: this.turn.sblind,
        blind: this.turn.blind,
        start: this.turn.start,
        minBid: this.minBid
    });

    for(var player of this.turn.iterate(this.turn.sblind)) {
        // @todo: move this to player join
        player.hand = new Poker.Hand();
        player.hand.set([
            this.deck.pop(),
            this.deck.pop()
        ]);

        this.sendTo(player.turnId, 'reveal_hand_handler', {
            cards: player.hand.get_info()
        });
    }

    this.status = 'bidding';
    this.bidRequest();
};

Room.prototype.call_chat_message = function(user_id, params) {

};

Room.prototype.call_join_room = function(user_id, params) {
    var user = Server.getUser(user_id);
    var seat = null;
    var player = null;

    // find old seat of player or reserve an empty seat
    for(seat=0; seat<this.seats; seat++) {
        if(typeof this.players[seat] === 'undefined'){
            player = new Player(seat, user);
            player.chips = 1000;
            player.playing = true;
            this.players[seat] = player;
            break;
        } else if(this.players[seat].username == user.username) {
            user.room_id = params.room_id;
            player = this.players[seat];
            player.user_id = user_id;
            player.playing = true;
            break;
        }
    }

    if(!player) {
        Server.sendTo(user_id, {
            group: 'Room',
            method: 'join_room_error',
            params: 'Unable to join room.',
            response: 'Unable to join room.'
        });
        return;
    }

    var game_info = this.get_game_info();
    game_info.player_id = seat;
    game_info.hand = player.hand ? player.hand.get_info() : null;

    Server.sendTo(user_id, {
        group: 'Room',
        method: 'join_room_handler',
        params: game_info
    });

    // Notify others 
    if(len(this.players) > 1) {
        this.sendExceptTo(user_id, 'join_room_notify',
            this.players[seat].get_info()
        );

        // (re)start the room
        if(this.status == 'waiting') {
            this.status = 'starting';
            this.turn.init(0);
            setTimeout(this.newTurn.bind(this), Delay.newTurn);
        }
    }
};

Room.prototype.call_leave_room = function(user_id, params) {

};

Room.prototype.call_take_seat = function(user_id, params) {

};

Room.prototype.call_leave_seat = function(user_id, params) {

};

Room.prototype.getPlayer = function(user_id) {
    //@todo: write Hash helper for faster search
    for(var p in this.players) {
        if(this.players[p].user_id == user_id)
            return this.players[p];
    }

    return false;
};

Room.prototype.get_info = function() {
    return {
        room_id : this.room_id, name : this.name,
        seats : this.seats, type : this.type,
        players_number : len(this.players),
        blind : this.blind, sblind: this.sblind, currency: this.currency,
    };
};

Room.prototype.get_game_info = function() {
    var info = this.get_info();

    // Bidding
    info.minBid = this.minBid;
    info.pot = this.pot.sumPot();

    // Turns
    info.turn = this.turn.get_info();
    info.turn.sblind = this.turn.sblind;
    info.turn.blind = this.turn.blind;
    info.turn.dealer = this.turn.dealer;

    // Cards
    info.cards = this.cards.get_info();

    // Players, chips
    info.players = {};
    for(var p in this.players) {
        info.players[p] = this.players[p].get_info();
    }

    return info;
};

Room.prototype.sendToAll = function(method, params) {
    params.room_id = this.room_id;
    var msg = {
        group : 'Game',
        method : method,
        params : params,
    };

    for (var p in this.players) {
        if(!this.players[p].ai) {
            Server.sendTo(this.players[p].user_id, msg);
        }
    }
};

Room.prototype.sendExceptTo = function(user_id, method, params) {
    params.room_id = this.room_id;
    var msg = {
        group : 'Game',
        method : method,
        params : params,
    };

    for (var p in this.players) {
        if(!this.players[p].ai && this.players[p].user_id != user_id) {
            Server.sendTo(this.players[p].user_id, msg);
        }
    }
};

Room.prototype.sendTo = function(player_id, method, params) {
    params.room_id = this.room_id;
    var player = this.players[player_id];
    if(player.ai) return;

    Server.sendTo(player.user_id, {
        group : 'Game',
        method : method,
        params : params,
    });
};

Room.prototype.sendErrorTo = function(player_id, str) {
    var player = this.players[player_id];
    if(player.ai) return;

    Server.sendTo(player.user_id, {
        group : 'Game',
        method : 'game_error',
        params : str,
    });
};

module.exports = Room;