<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="assets/css/cards.css">
</head>
<body>
<?php
	// beolvas par sort a tanito adathalmazbol, es outputolja oket

	require 'CardPresenter.php';


	$hands_content = file_get_contents('datasets/hands.sample.csv');
	$hands = explode("\n", $hands_content);

	foreach ($hands as $hand) {
		print( CardPresenter::render_hand($hand) );
	}

	include 'read_dataset.php';
?>
</body>
</html>