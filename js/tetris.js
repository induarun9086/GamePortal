var colors = [ '#32a4fa', '#38C44F', '#FFAC1C', '#FF6600', '#CC54C4', '#999',
		'#FF0000' ];
var puzzles = [ [ [ 0, 0, 1 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
		[ [ 1, 0, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
		[ [ 0, 1, 1 ], [ 1, 1, 0 ], [ 0, 0, 0 ] ],
		[ [ 1, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ] ],
		[ [ 0, 1, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ], [ [ 1, 1 ], [ 1, 1 ] ],
		[ [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ] ] ];

var curr_state_initial = 1;
var curr_state_moving = 2;
var curr_state_game_over = 3;

var blockHeight = 4;
var blockWidth = 4;
var left = 48;
var totalWidth = 100;
var totalHeight = 92;

function initPuzzle() {
	var game = new TetrisGame();
	document.addEventListener("keydown", function(e) {
		onKeyDown(e, game);
	}, false);

	setInterval(function() {
		if (game.currentState == curr_state_initial) {
			game.currentObject = createNewPuzzle();
			game.currentState = curr_state_moving;
		} else if (game.currentState == curr_state_moving) {
			moveDown(game);
		}
	}, 500);
}

function TetrisGame() {
	this.currentState = curr_state_initial;
	this.currentObject = null;
}

function createNewPuzzle() {
	var puzzleType = random(this.puzzles.length);
	var puzzle = puzzles[puzzleType];
	var background = colors[random(this.colors.length)];
	var elements = [];
	for (var y = 0; y < puzzle.length; y++) {
		for (var x = 0; x < puzzle[y].length; x++) {
			if (puzzle[y][x]) {
				var el = document.createElement("div");
				el.id = "block" + puzzleType;
				el.className = 'block';
				el.style.left = (left + (x * blockWidth)) + '%';
				el.style.top = (y * blockHeight) + '%';
				el.style.background = background;
				document.getElementById("tetris-area").appendChild(el);
				elements.push(el);
			}
		}
	}
	return elements;
}

function moveDown(game) {
	var currentObject = game.currentObject;
	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockTop = parseFloat(block.style.top);

		var blockLeft = parseFloat(block.style.left);
		var blockTop = parseFloat(block.style.top);

		var x = blockLeft / 4;
		var y = blockTop / 4;

		if (blockTop <= 92) {
			block.style.top = (blockTop + blockHeight) + '%';
		} else {
			game.currentState = curr_state_initial;
		}
	}
}

function onKeyDown(e, game) {
	switch (e.keyCode) {
	case 39: // Right Key
	{
		moveRight(game);
		break;
	}

	case 37: // Left Key
	{
		moveLeft(game);
		break;
	}

	}
}

function moveRight(game) {
	var currentObject = game.currentObject;
	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockLeft = parseFloat(block.style.left);

		if (blockLeft <= 100) {
			block.style.left = (blockLeft + blockWidth) + '%';
		}
	}
}

function moveLeft(game) {
	var currentObject = game.currentObject;
	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockLeft = parseFloat(block.style.left);

		if (blockLeft >= 0) {
			block.style.left = (blockLeft - blockWidth) + '%';
		}
	}
}