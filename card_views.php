
<?php if($rank == 2) { ?>
	<section class="card card--<?php echo $type; ?>" value="2">
		<div class="card__inner card__inner--centered">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>
	
<?php } else if($rank == 3) { ?>
	<section class="card card--<?php echo $type; ?>" value="3">
		<div class="card__inner card__inner--centered">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>
	
<?php } else if($rank == 4) { ?>
	<section class="card card--<?php echo $type; ?>" value="4">
		<div class="card__inner">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>
	
<?php } else if($rank == 5) { ?>
	<section class="card card--<?php echo $type; ?>" value="5">
		<div class="card__inner">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
			<div class="card__column card__column--centered">
				<div class="card__symbol"></div>
			</div>
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>
	
<?php } else if($rank == 6) { ?>
	<section class="card card--<?php echo $type; ?>" value="6">
		<div class="card__inner">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>
	
<?php } else if($rank == 7) { ?>
	<section class="card card--<?php echo $type; ?>" value="7">
		<div class="card__inner">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
			<div class="card__column card__column--centered">
				<div class="card__symbol card__symbol--huge"></div>
			</div>
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>
	
<?php } else if($rank == 8) { ?>
	<section class="card card--<?php echo $type; ?>" value="8">
		<div class="card__inner">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
			<div class="card__column card__column--centered">
				<div class="card__symbol card__symbol--big"></div>
				<div class="card__symbol card__symbol--big"></div>
			</div>
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>
	
<?php } else if($rank == 9) { ?>
	<section class="card card--<?php echo $type; ?>" value="9">
		<div class="card__inner">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol card__symbol--rotated"></div>
				<div class="card__symbol"></div>
			</div>
			<div class="card__column card__column--centered">
				<div class="card__symbol card__symbol"></div>
			</div>
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol card__symbol--rotated"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>
	
<?php } else if($rank == 10) { ?>
	<section class="card card--<?php echo $type; ?>" value="10">
		<div class="card__inner">
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol card__symbol--rotated"></div>
				<div class="card__symbol"></div>
			</div>
			<div class="card__column card__column--centered">
				<div class="card__symbol card__symbol--big"></div>
				<div class="card__symbol card__symbol--big"></div>
			</div>
			<div class="card__column">
				<div class="card__symbol"></div>
				<div class="card__symbol"></div>
				<div class="card__symbol card__symbol--rotated"></div>
				<div class="card__symbol"></div>
			</div>
		</div>
	</section>

<?php } else if($rank == 'J') { ?>
	<section class="card card--<?php echo $type; ?>" value="J">
		<div class="card__inner">
		</div>
	</section>

<?php } else if($rank == 'Q') { ?>
	<section class="card card--<?php echo $type; ?>" value="Q">
		<div class="card__inner">
		</div>
	</section>

<?php } else if($rank == 'K') { ?>
	<section class="card card--<?php echo $type; ?>" value="K">
		<div class="card__inner">
		</div>
	</section>

<?php } else if($rank == 'A') { ?>
	<section class="card card--<?php echo $type; ?>" value="A">
		<div class="card__inner">
			<div class="card__column">
			</div>
			<div class="card__column card__column--centered">
				<div class="card__symbol card__symbol--ace"></div>
			</div>
			<div class="card__column">
			</div>
		</div>
	</section>
<?php } ?>