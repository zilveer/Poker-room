
var HandType = {
	NONE: 0, PAIR: 1, TWO_PAIRS: 2, DRILL: 3, POKER: 7,
	STRAIGHT: 4, FLUSH: 5, FULL_HOUSE: 6, 
	// @todo: do we need these two?
	STRAIGHT_FLUSH: 8, ROYAl_FLUSH: 9
};
var CardRank = {
	2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10,
	'J':11, 'Q':12, 'K':13, 'A':1
};
var CardType = {
	HEART: 1, SPADE: 2, DIAMOND: 3, CLUB: 4
};
var Card = function(type, rank) {
	this.type = type;
	this.rank = rank;
};


module.exports.Hand = function(cards) {
	this.cards = cards;
	this.size = cards.length;
	this.type = null;

	this.getType = function() {
		if(!this.type)
			this.type = this.fetchType();
		return this.type;
	};

	/**
	 * Calculates the hand type from 2-7 cards
	 *
	 * O(7+9)
	 */
	this.fetchType = function() {
		/*
			- pairs:  		max same ranks (L=2,3,4)
			- flush: 		max same types (L=5)
			- straight: 	rank sequence
			- full house: 	
		*/
		var type_freqs = {};
		var rank_freqs = {};

		for(var card of this.cards) {
			type_freqs[card.type] = (!type_freqs[card.type] ? 0 : type_freqs[card.type]+1);
			rank_freqs[card.rank] = (!rank_freqs[card.rank] ? 0 : rank_freqs[card.rank]+1);
		}

		var best_type = Object.keys(type_freqs).sort(function(a,b){return type_freqs[a]-type_freqs[b]});
		var best_rank = Object.keys(rank_freqs).sort(function(a,b){return rank_freqs[a]-rank_freqs[b]});


		// @todo sort by values
		// @todo check max in each
		// @todo extra case for royal flush and full house
	};

	this.merge = function(hand) {
		// @todo: implement
		return this;
	};
};


// Constants

module.exports.CardRank = CardRank;
module.exports.CardType = CardType;
module.exports.HandType = HandType;
module.exports.Card = Card;
