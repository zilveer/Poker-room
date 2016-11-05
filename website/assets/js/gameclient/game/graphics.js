
var GameGraphics = {
	ranks: {11:'J',12:'Q',13:'K',14:'A'},
	types: {1: 'heart', 2: 'spade', 3: 'diamond', 4:'club'},

	getRank: function(rank) {
		if(this.ranks[rank])
			return this.ranks[rank]
		return rank;
	},

	setup: function() {
		GameGraphics.update_cards();
		GameGraphics.update_hand();
	},

	show_hands: function(hands) {
		for(var h in hands) {
			this._render_pack(
				'.players .player[seat="'+h+'"] [data-name="cards"]', 
				hands[h]
			);
		}
	},

	update_cards: function() {
		this._render_pack('#table-cards', Game.room.cards);
	},

	update_hand: function() {
		this._render_pack('#hand-cards', Game.room.hand);
	},

	_render_pack: function(domId, cards) {
		$(domId).html('');

		for(var i in cards) {
			$(domId).append( this._render_card(cards[i].type, cards[i].rank) );
		}
	},

	_render_card: function(type, rank) {
		type = this.types[type];
		rank = this.getRank(rank);

		return '<section class="scard scard--'+ type +'" value="'+ rank +'">' +
			'<div class="scard__inner">' +
				'<div class="scard__symbol"></div>' +
			'</div>' +
		'</section>';
	},
};