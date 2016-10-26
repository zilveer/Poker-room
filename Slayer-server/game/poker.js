
const ArrayHelper = require('./arrayhelper');

var HandType = {
	NONE: 0, PAIR: 1, TWO_PAIRS: 2, DRILL: 3, POKER: 7,
	STRAIGHT: 4, FLUSH: 5, FULL_HOUSE: 6, 
	// @todo: do we need these two?
	STRAIGHT_FLUSH: 8, ROYAl_FLUSH: 9
};
var CardRank = {
	2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10,
	'J':11, 'Q':12, 'K':13, 'A':14, 'S': 1
};
var CardType = {
	HEART: 1, SPADE: 2, DIAMOND: 3, CLUB: 4
};
var Card = function(type, rank) {
	if(rank == 1)
		rank = 14;
	this.type = type;
	this.rank = rank;
};

var Hand = function(cards) {
	this.cards = cards;
	this.size = cards.length;
	this.high = null;
	this.type = HandType.NONE;

	this.getType = function() {
		if(!this.type)
			this.fetchType();
		return this.type;
	};

	/**
	 * Calculates the largest card in the deck O(7)
	 */
	this.getHigh = function() {
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
			if(types[i])
				this.type = HandType.FLUSH;

			// Straight:
			if(series_length >= i) {
				// Straight Flush:
				if(this.type == HandType.FLUSH) {
					this.type = HandType.STRAIGHT_FLUSH;
					this.high = series_high;

					//console.log(this.high, CardRank.A);
					// Royal FLush
					if(this.high == CardRank.A)
						this.type = HandType.ROYAl_FLUSH;
				}
				else
					this.type = HandType.STRAIGHT;

			}
		}

		//@todo: get HIGH card method!

		if(this.type >= HandType.STRAIGHT_FLUSH )
			return this.type;

		// Four of a Kind
		else if(ranks[4]) {
			this.type = HandType.POKER;
		}

		// Full House
		else if(ranks[3] && ranks[2]) {
			this.type = HandType.FULL_HOUSE;
		}

		if(this.type >= HandType.STRAIGHT)
			return this.type;
		
		// Drill
		else if(ranks[3])
			this.type = HandType.DRILL;

		// Two Pairs
		else if(ranks[2] && ranks[2].length >= 2)
			this.type = HandType.TWO_PAIRS;

		// Pair
		else if(ranks[2])
			this.type = HandType.PAIR;

		return this.type;
	};

	this.merge = function(hand) {
		return new Hand(this.cards.concat(hand.cards));
	};
};


// Constants

module.exports.CardRank = CardRank;
module.exports.CardType = CardType;
module.exports.HandType = HandType;
module.exports.Card = Card;
module.exports.Hand = Hand;
