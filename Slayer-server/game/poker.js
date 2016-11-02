
const ArrayHelper = require('./arrayhelper');

const HandType = {
	NONE: 0, PAIR: 1, TWO_PAIRS: 2, DRILL: 3, POKER: 7,
	STRAIGHT: 4, FLUSH: 5, FULL_HOUSE: 6, 
	// @todo: do we need these two?
	STRAIGHT_FLUSH: 8, ROYAl_FLUSH: 9
};

const ACE = 14;

const Card = function(type, rank) {
	if(rank == 1) rank = ACE;
	this.type = type;
	this.rank = rank;
};

// Create a constant deck to spare memory
const deck = [];
// All ranks from 2 to Ace
for(var r = 2; r <= ACE; r++) {
	// All suits from hearts to clubs
	for(var t = 1; t <= 4; t++) {
		deck.push(new Card(t, r));
	}
}

module.exports.getBestHands = function(players) {
    players.sort(function(a,b){
        return a.hand.compare( b.hand )
    });

    var winners = [players.pop()];

    for(var player of players) {
    	if (player.hand.type == winners[0].hand.type && 
    		player.hand.high == winners[0].hand.high && 
    		player.hand.kicker == winners[0].hand.kicker
    	) {
			winners.push(player.player_id);
		}
    }

    return winners;
};

const Hand = function(cards) {
	this.cards = cards || [];
	this.size = cards ? cards.length : 0;

	this.type = HandType.NONE;
	this.high = null;
	this.kicker = 0;

	this.add = function(cards) {
		this.cards = this.cards.concat(cards);
		this.size += cards.length;
	};

	this.set = function(cards) {
		this.cards = cards;
		this.high = null;
		this.type = HandType.NONE;
		this.size = cards.length;
	};

	this.merge = function(hand) {
		return new Hand(this.cards.concat(hand.cards));
	};

	this.compare = function(hand) {
		var cmp = Math.sign(this.getType() - hand.getType());
		if(cmp == 0)
			cmp = Math.sign(this.high - hand.high);
		else if(cmp == 0)
			cmp = Math.sign(this.kicker - hand.kicker);
		return cmp;
	};

	this.getType = function() {
		if(!this.type)
			this.fetchType();
		return this.type;
	};

	this.getKicker = function() {
		return this.cards.reduce((high, item) => {
			return item.rank > high ? item.rank : high;
		}, 0);
	};

	/**
	 * Calculates the hand type from 2-7 cards O(7+9)
	 */
	this.fetchType = function() {
		this.type = HandType.NONE;
		this.high = null;

		var types = ArrayHelper.frequencies(this.cards, 'type');
		var ranks = ArrayHelper.frequencies(this.cards, 'rank');
		var aa = ArrayHelper.max_series(this.cards);
		var series_length = aa[0];
		var series_high = aa[1];

		for(var i=7;i>=5;i--) {
			// Flush:
			if(types[i]) {
				this.type = HandType.FLUSH;
				this.high = ArrayHelper.max( ArrayHelper.filter(this.cards, 'type', types[i]), 'rank' );
				this.kicker = 0;
			}

			// Straight:
			if(series_length >= i) {
				// Straight Flush:
				if(this.type == HandType.FLUSH) {
					this.type = HandType.STRAIGHT_FLUSH;
					this.high = series_high;
					this.kicker = 0;

					// Royal FLush
					if(this.high == ACE) {
						this.type = HandType.ROYAl_FLUSH;
					}
				}
				else {
					this.type = HandType.STRAIGHT;
					this.high = series_high;
					this.kicker = 0;
				}

			}
		}

		//@todo: get HIGH card method!

		if(this.type >= HandType.STRAIGHT_FLUSH )
			return this.type;

		// Four of a Kind
		else if(ranks[4]) {
			this.type = HandType.POKER;
			this.high = Math.max(...ranks[4]);
			this.kicker = this.getKicker();
		}

		// Full House
		else if(ranks[3] && ranks[2]) {
			this.type = HandType.FULL_HOUSE;
			this.high = Math.max(...ranks[3].concat(ranks[2]));
			this.kicker = 0;
		}

		if(this.type >= HandType.STRAIGHT)
			return this.type;
		
		// Drill
		else if(ranks[3]) {
			this.type = HandType.DRILL;
			this.high = Math.max(...ranks[3]);
			this.kicker = this.getKicker();
		}

		// Two Pairs
		else if(ranks[2] && ranks[2].length >= 2) {
			this.type = HandType.TWO_PAIRS;
			this.high = Math.max(...ranks[2]);
			this.kicker = this.getKicker();
		}

		// Pair
		else if(ranks[2]) {
			this.type = HandType.PAIR;
			this.high = Math.max(...ranks[2]);
			this.kicker = this.getKicker();
		}

		return this.type;
	};

	this.get_info = function() {
		return this.cards;
	};
};



// Constants
//module.exports.CardRank = CardRank;
//module.exports.CardType = CardType;
//module.exports.HandType = HandType;
//module.exports.StatusType = StatusType;
//module.exports.BetType = BetType;

module.exports.Card = Card;
module.exports.Hand = Hand;
module.exports.FrenchDeck = deck;