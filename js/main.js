$(function () {
	FastClick.attach(document.body);
});

var positions = [];
var tiles = [];
var degrees = {};
var mode = 'swap';
var tile_number = 26;
var selected_tile1 = '';
var selected_tile2 = '';

$(document).ready(function () {
	$("#grid").swipe({
		// swipe: function (event, direction, distance, duration, fingerCount) {
		// 	if (event.button == 0) {
		// 		console.log("You swiped " + direction);
		// 		moveSwipedTile(direction);
		// 	}
		// },
		// threshold: 20
	});
	// startGame();
});

// $(document).on('touchstart click', '.tile', function (e) {
$(document).on('click', '.tile', function (e) {
	if (mode == 'n-puzzle') {
		var num = $(this).attr('num');
		var tile = getTile(num);
		tile.move();
	}
	else {
		if (selected_tile1 == '') {
			var num = $(this).attr('num');
			selected_tile1 = num;
			$('#tile-' + num).css({
				'opacity': 0.5
			})
		}
		else if (selected_tile1 == $(this).attr('num')) {
			$('#tile-' + selected_tile1).css({
				'opacity': ''
			})
			selected_tile1 = ''
		}
		else {
			var num = $(this).attr('num');
			selected_tile2 = num;
			$('#tile-' + num).css({
				'opacity': 0.5
			})
			$('#tile-' + selected_tile1).css({
				'opacity': ''
			})
			$('#tile-' + selected_tile2).css({
				'opacity': ''
			})
			swapTiles();
			selected_tile1 = '';
			selected_tile2 = '';
		}
	}
});

$(document).on('contextmenu', '.tile', function (e) {
	e.preventDefault();
	degrees[$(this).attr('id')] += 90;
	$(this).css({
		'-webkit-transform': 'rotate(' + degrees[$(this).attr('id')] + 'deg)',
		'-moz-transform': 'rotate(' + degrees[$(this).attr('id')] + 'deg)',
		'-ms-transform': 'rotate(' + degrees[$(this).attr('id')] + 'deg)',
		'-o-transform': 'rotate(' + degrees[$(this).attr('id')] + 'deg)',
		'transform': 'rotate(' + degrees[$(this).attr('id')] + 'deg)'
	});
});

$(document).on('click', '#reset-button', function () {
	resetGame();
});

$(document).on('click', '#mode-button', function () {
	if (mode == 'n-puzzle') {
		mode = 'swap';
		$('#pc-swap-instr').show();
		$('#pc-n-puzzle-instr').hide();
		// $('#mobile-swap-instr').show();
		// $('#mobile-n-puzzle-instr').hide();
		$('#mode').text('Swap 模式');
		tile_number = 26;
		resetContents();
	}
	else {
		mode = 'n-puzzle';
		$('#pc-n-puzzle-instr').show();
		$('#pc-swap-instr').hide();
		// $('#mobile-n-puzzle-instr').show();
		// $('#mobile-swap-instr').hide();
		$('#mode').text('N Puzzle 模式');
		tile_number = 25;
		resetContents();
	}
});

function startGame() {
	resetContents();
}

function resetGame() {
	resetContents();
}

function resetContents() {
	tiles = [];
	degrees = {};
	positions = loadPositions();
	drawGridCells();
	generateTiles(positions);
}

function drawGridCells() {
	if (mode == 'n-puzzle') {
		for (var i = 1; i < 6; i++) {
			for (var j = 1; j < 6; j++) {
				$('#position-' + i + '-' + j).removeClass('dark-grid-cell');
				$('#position-' + i + '-' + j).addClass('light-grid-cell');
			}
		}
	}
	else {
		for (var i = 1; i < 6; i++) {
			for (var j = 1; j < 6; j++) {
				$('#position-' + i + '-' + j).removeClass('light-grid-cell');
				$('#position-' + i + '-' + j).addClass('dark-grid-cell');
			}
		}
	}
}

function generateTiles(positions) {
	console.log('Generating tiles');
	var position = null;
	var tile = null;
	$('#tiles-container').empty();
	for (var i = 1; i < tile_number; i++) {
		degrees['tile-' + i] = 0;
		position = getRandomFreePosition(positions);
		tile = new Tile(position.x, position.y, i);
		tiles.push(tile);
		tile.insertTile();
		position.free = false;
		position = null;
		tile = null;
		$('#tile-' + i).css({
			'-webkit-transform': 'rotate(0deg)',
			'-moz-transform': 'rotate(0deg)',
			'-ms-transform': 'rotate(0deg)',
			'-o-transform': 'rotate(0deg)',
			'transform': 'rotate(0deg)'
		});
	}
}

$(document).keydown(function (e) {
	if (mode == 'n-puzzle') {
		var tile = null;
		var position = getFreePosition();
		switch (e.which) {
			case 37: // left
				e.preventDefault();
				console.log('left');
				if (position.y < 5) {
					tile = getTileInPosition(position.x, position.y + 1);
					tile.move();
				}
				break;
			case 38: // up
				e.preventDefault();
				console.log('up');
				if (position.x < 5) {
					tile = getTileInPosition(position.x + 1, position.y);
					tile.move();
				}
				break;
			case 39: // right
				e.preventDefault();
				console.log('right');
				if (position.y > 1) {
					tile = getTileInPosition(position.x, position.y - 1);
					tile.move();
				}
				break;
			case 40: // down
				e.preventDefault();
				console.log('down');
				if (position.x > 1) {
					tile = getTileInPosition(position.x - 1, position.y);
					tile.move();
				}
				break;
			default: return;
		}
	}
});

// function moveSwipedTile(direction) {
// 	var pos = getFreePosition();
// 	var tile = null;
// 	switch (direction) {
// 		case 'left':
// 			if (pos.y < 5) {
// 				tile = getTileInPosition(pos.x, pos.y + 1);
// 				tile.move();
// 			}
// 			break;
// 		case 'right':
// 			if (pos.y > 1) {
// 				tile = getTileInPosition(pos.x, pos.y - 1);
// 				tile.move();
// 			}
// 			break;
// 		case 'up':
// 			if (pos.x < 5) {
// 				tile = getTileInPosition(pos.x + 1, pos.y);
// 				tile.move();
// 			}
// 			break;
// 		case 'down':
// 			if (pos.x > 1) {
// 				tile = getTileInPosition(pos.x - 1, pos.y);
// 				tile.move();
// 			}
// 			break;
// 		default:
// 			break;
// 	}
// }
