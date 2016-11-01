
const ArrayHelper = require('./arrayhelper');

const HandType = {
	NONE: 0, PAIR: 1, TWO_PAIRS: 2, DRILL: 3, POKER: 7,
	STRAIGHT: 4, FLUSH: 5, FULL_HOUSE: 6, 
	// @todo: do we need these two?
	STRAIGHT_FLUSH: 8, ROYAl_FLUSH: 9
};
const CardRank = {
	2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10,
	'J':11, 'Q':12, 'K':13, 'A':14
	//, 'S': 1 // the fuck?
};
const CardType = {
	HEART: 1, SPADE: 2, DIAMOND: 3, CLUB: 4
};
const StatusType = {
	PREFLOP: 0, FLOP: 1, TURN: 2, RIVER: 3
};
const BetType = {
	CHECK: 'check', RAISE: 'raise', BET: 'bet', CALL: 'call'
};


const Card = function(type, rank) {
	if(rank == 1)
		rank = 14;
	this.type = type;
	this.rank = rank;
};

// Create a constant deck to spare memory
const deck = [];
for(var r in CardRank) {
	for(var t in CardType) {
		deck.push(new Card(t,r));
	}
}

const Hand = function(cards) {
	this.cards = cards || [];
	this.size = cards ? cards.length : 0;

	this.type = HandType.NONE;
	this.high = null;
	this.kicker = null;

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
			cmp = Math.sign(this.getHigh() - hand.getHigh());
		else if(cmp == 0)
			cmp = Math.sign(this.getKicker() - hand.getKicker());
		return cmp;
	};

	this.getType = function() {
		if(!this.type)
			this.fetchType();
		return this.type;
	};

	this.getHigh = function() {
		return this.high;
	};

	this.getHighest = function(arr) {
		var max_i = null;
		for(var a of arr) {
			if(max_i == null || CardRank[a] > CardRank[max_i])
				max_i = a;
		}
		return max_i;
	};

	// Gets the largest card in the deck
	this.getKicker = function() {
		if(!this.kicker)
			this.fetchKicker();
		return this.kicker;
	};

	this.fetchKicker = function() {
		// 5 length hands have no kickers
		if(this.type >= HandType.STRAIGHT && this.type != HandType.POKER) {
			this.kicker = null;
		} else {
			this.kicker = this.cards.reduce((high, item) => {
				return item.rank > high ? item.rank : high;
			}, 0);			
		}
		return kicker;
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

		// $$$ITT
		//@TODO: series length & high 1-el kevesebb!
		console.log(series_length, series_high);

		for(var i=7;i>=5;i--) {
			// Flush:
			if(types[i]) {
				this.type = HandType.FLUSH;
				// @todo: get high for flush!
				//this.high = this.getHighestFlush(this.types[i]);
			}

			// Straight:
			if(series_length >= i) {
				// Straight Flush:
				if(this.type == HandType.FLUSH) {
					this.type = HandType.STRAIGHT_FLUSH;
					this.high = series_high;

					// Royal FLush
					if(this.high == CardRank.A) {
						this.type = HandType.ROYAl_FLUSH;
					}
				}
				else {
					//@todo: high card counts here?
					this.type = HandType.STRAIGHT;
					this.high = series_high;
				}

			}
		}

		//@todo: get HIGH card method!

		if(this.type >= HandType.STRAIGHT_FLUSH )
			return this.type;

		// Four of a Kind
		else if(ranks[4]) {
			this.type = HandType.POKER;
			this.high = this.getHighest(ranks[4]);
		}

		// Full House
		else if(ranks[3] && ranks[2]) {
			this.type = HandType.FULL_HOUSE;
			this.high = this.getHighest(ranks[3].concat(ranks[2]));
		}

		if(this.type >= HandType.STRAIGHT)
			return this.type;
		
		// Drill
		else if(ranks[3]) {
			this.type = HandType.DRILL;
			this.high = this.getHighest(ranks[3]);
		}

		// Two Pairs
		else if(ranks[2] && ranks[2].length >= 2) {
			this.type = HandType.TWO_PAIRS;
			this.high = this.getHighest(ranks[2]);
		}

		// Pair
		else if(ranks[2]) {
			this.type = HandType.PAIR;
			this.high = this.getHighest(ranks[2]);
		}

		return this.type;
	};

	this.get_info = function() {
		return this.cards;
	};
};



// Constants
module.exports.CardRank = CardRank;
module.exports.CardType = CardType;
module.exports.HandType = HandType;
module.exports.StatusType = StatusType;
module.exports.BetType = BetType;

module.exports.Card = Card;
module.exports.Hand = Hand;
module.exports.FrenchDeck = deck;
