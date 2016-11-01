
var GameGraphics = {
	setup: function() {
		GameGraphics.update_cards();
		GameGraphics.update_hand();
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
		type = type.toLowerCase();
		rank = rank.toUpperCase();

		return '<section class="scard scard--'+ type +'" value="'+ rank +'">' +
			'<div class="scard__inner">' +
				'<div class="scard__symbol"></div>' +
			'</div>' +
		'</section>';
	},
};