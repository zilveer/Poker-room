<?php

class CardPresenter {
	protected static $_types = [
		1 => 'heart',
		2 => 'spade',
		3 => 'diamond',
		4 => 'club'
	];

	protected static $_ranks = [
		'_none',
		'A',2,3,4,5,6,7,8,9,10,'J','Q','K'
	];

	protected static $_hands = [
      'Nothing in hand; not a recognized poker hand',
      'One pair; one pair of equal ranks', 
      'Two pairs; two pairs of equal ranks',
      'Three of a kind; three equal ranks',
      'Straight; five cards, sequentially ranked with no gaps',
      'Flush; five cards with the same suit',
      'Full house; pair + different rank three of a kind',
      'Four of a kind; four equal ranks',
      'Straight flush; straight + flush',
      'Royal flush; {Ace, King, Queen, Jack, Ten} + flush',
	];

	public static function render_hand($hand) {
		$a = explode(',', $hand);

		$str = '';
		$str .= '<section class="cards">';

		for($i=0;$i<10;$i+=2) {
			$type = self::$_types[ $a[$i + 0] ];
			$rank = self::$_ranks[ $a[$i + 1] ];

			$str .= self::render_card($type, $rank);
		}
		$str .= '</section>';

		$hand = self::$_hands[ trim($a[10]) ];
		$str .= '<br/>'.$hand.'<br/><br/><hr/>';

		return $str;
	}

	public static function render_card($type, $rank) {
		ob_start();
		include 'card_views.php';
		$content = ob_get_contents();
		ob_end_clean();

		return $content;
	}
}