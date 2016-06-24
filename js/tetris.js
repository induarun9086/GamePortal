var colors = [ '#32a4fa', '#38C44F', '#FFAC1C', '#FF6600', '#CC54C4', '#999',
		'#FF0000' ];

var puzzles = [ [ [ 0, 0, 1 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
		[ [ 1, 0, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
		[ [ 0, 1, 1 ], [ 1, 1, 0 ], [ 0, 0, 0 ] ],
		[ [ 1, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ] ],
		[ [ 0, 1, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ], [ [ 1, 1 ], [ 1, 1 ] ],
		[ [ 0, 0, 0, 0 ], [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] ];

var curr_state_initial = 1;
var curr_state_moving = 2;
var curr_state_game_over = 3;

var blockHeight = 4;
var blockWidth = 4;
var left = 48;
var totalWidth = 100;
var totalHeight = 100;

var filledBlocks = createEmptyArray(totalWidth / blockWidth, totalHeight
		/ blockHeight);

function initPuzzle() {

	var game = new TetrisGame();
	document.addEventListener("keydown", function(e) {
		onKeyDown(e, game);
	}, false);

	setInterval(function() {

		if (game.currentState == curr_state_initial) {
			createNewPuzzle(game);
			game.currentState = curr_state_moving;
			game.previousPositions = [];
		} else if (game.currentState == curr_state_moving) {
			moveDown(game);
		}
	}, 300);
}

function TetrisGame() {
	this.currentState = curr_state_initial;
	this.currentObject = null;
	this.previousPositions = [];
	this.currentPuzzle = [];
}

function createNewPuzzle(game) {

	var puzzleType = random(this.puzzles.length);
	//var puzzleType = 1;
	var puzzle = puzzles[puzzleType];
	var background = colors[random(this.colors.length)];

	var elements = [];
	var puzzleNumber = 0;
	for (var y = 0; y < puzzle.length; y++) {
		for (var x = 0; x < puzzle[y].length; x++) {
			if (puzzle[y][x]) {
				var el = document.createElement("div");
				el.id = "block" + puzzleType + puzzleNumber;
				el.className = 'block';
				el.style.left = (left + (x * blockWidth)) + '%';
				el.style.top = (y * blockHeight) + '%';
				el.style.background = background;
				document.getElementById("tetris-area").appendChild(el);
				elements.push(el);
				puzzle[y][x] = el;
				puzzleNumber = puzzleNumber + 1;
			}
		}
	}
	elements = sortElements(elements);
	game.currentObject = elements;
	game.currentPuzzle = puzzle;
}

function sortElements(elements) {
	elements = elements.sort(function(a, b) {
		return parseFloat(b.style.top) - parseFloat(a.style.top);
	});
	return elements;
}

function moveDown(game) {
	var currentObject = game.currentObject;
	if (!mayMoveDown(currentObject)) {
		game.currentState = curr_state_initial;
		return;
	}
	if (isBottomBoundary(currentObject)) {
		game.currentState = curr_state_initial;
		return;
	}
	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockTop = parseFloat(block.style.top);

		if (isCurrentObjectIntersecting(currentObject, block, 'down')
				&& blockTop <= 96) {
			block.style.top = (blockTop + blockHeight) + '%';
		} else {
			game.currentState = curr_state_initial;
		}
		updatePuzzleBoard(game, block, i);
	}

	removeFullLine(game);

}

function isCurrentObjectIntersecting(currentObject, block, direction) {

	var blockLeft = parseFloat(block.style.left);
	var blockTop = parseFloat(block.style.top);

	var x = blockLeft / 4;
	var y = blockTop / 4;

	var element = filledBlocks[x][y];

	switch (direction) {
	case ('down'):
		element = filledBlocks[x][y + 1];
		break;

	case ('left'):
		element = filledBlocks[x - 1][y];
		break;

	case ('right'):
		element = filledBlocks[x + 1][y];
		break;
	}

	if (element != 0 && !isInArray(element, currentObject)) {
		return false;
	}

	return true;
}

function isBottomBoundary(currentObject) {

	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockTop = parseFloat(block.style.top);

		if (blockTop >= 96) {
			return true;
		}
	}
	return false;
}

function isRightBoundary(currentObject) {

	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockLeft = parseFloat(block.style.left);

		if (blockLeft >= 96) {
			return true;
		}
	}
	return false;
}

function mayMoveDown(currentObject) {
	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockLeft = parseFloat(block.style.left);
		var blockTop = parseFloat(block.style.top);

		var x = blockLeft / 4;
		var y = blockTop / 4;

		element = filledBlocks[x][y + 1];

		if (element == 0 || isInArray(element, currentObject)) {
			continue;
		} else {
			return false;
		}
	}
	return true;
}

function removeFullLine(game) {

	var lineRemoved = false;

	var parent = document.getElementById('tetris-area');
	for (var y = filledBlocks.length - 1; y > 0; y--) {
		var removeLine = false;
		var count = 0;
		for (var x = 0; x < filledBlocks.length; x++) {
			if (filledBlocks[x][y] != 0) {
				count = count + 1;
			}
			if (count == filledBlocks.length)
				removeLine = true;
		}
		if (removeLine) {
			for (var x = 0; x < filledBlocks.length; x++) {
				var block = filledBlocks[x][y];
				parent.removeChild(block);
				filledBlocks[x][y] = 0;
				lineRemoved = true;
			}
		}
	}
	if (lineRemoved) {
		for (var y = filledBlocks.length - 1; y > 0; y--) {
			for (var x = 0; x < filledBlocks.length; x++) {
				var el = filledBlocks[x][y];
				if (el !== 0) {
					el.style.top = parseFloat(el.style.top) + blockHeight + '%';
					filledBlocks[x][y] = 0;

					var blockLeft = parseFloat(el.style.left);
					var blockTop = parseFloat(el.style.top);

					var i = blockLeft / 4;
					var j = blockTop / 4;

					filledBlocks[i][j] = block;
				}
			}
		}
	}

}

function updatePuzzleBoard(game, block, i) {
	var blockLeft = parseFloat(block.style.left);
	var blockTop = parseFloat(block.style.top);

	var x = blockLeft / 4;
	var y = blockTop / 4;

	clearPreviousPositions(game, block);
	filledBlocks[x][y] = block;
	game.previousPositions[i] = [ block, x, y ];
}

function clearPreviousPositions(game, block) {
	var previousPositions = game.previousPositions;
	for (var i = 0; i < previousPositions.length; i++) {
		if (previousPositions[i][0] === block) {
			x = previousPositions[i][1];
			y = previousPositions[i][2];
			filledBlocks[x][y] = 0;
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
	case 38: // Up arrow
	{
		rotate(game);
		break;
	}
	}
}

function moveRight(game) {
	var currentObject = game.currentObject;

	if (isRightBoundary(currentObject)) {
		return;
	}

	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockLeft = parseFloat(block.style.left);

		if (isCurrentObjectIntersecting(currentObject, block, 'right')
				&& blockLeft <= 96) {
			block.style.left = (blockLeft + blockWidth) + '%';
		}

		updatePuzzleBoard(game, block, i);
	}
}

function moveLeft(game) {
	var currentObject = game.currentObject;
	for (var i = 0; i < currentObject.length; i++) {
		var block = currentObject[i];
		var blockLeft = parseFloat(block.style.left);

		if (isCurrentObjectIntersecting(currentObject, block, 'left')
				&& blockLeft >= 0) {
			block.style.left = (blockLeft - blockWidth) + '%';
		}

		updatePuzzleBoard(game, block, i);
	}
}

function rotate(game) {
	var currentPuzzle = game.currentPuzzle;
	var puzzle = createEmptyArray(currentPuzzle.length, currentPuzzle[0].length);
	var elements = [];
	for (var y = 0; y < currentPuzzle.length; y++) {
		for (var x = 0; x < currentPuzzle[y].length; x++) {
			if (currentPuzzle[y][x]) {
				var newY = puzzle.length - 1 - x;
				var newX = y;
				var el = currentPuzzle[y][x];
				var moveY = newY - y;
				var moveX = newX - x;
				el.style.left = parseFloat(el.style.left)
						+ (moveX * blockWidth) + '%';
				el.style.top = parseFloat(el.style.top) + (moveY * blockHeight)
						+ "%";
				puzzle[newY][newX] = el;
				elements.push(el);
			}
		}
	}
	elements = sortElements(elements);
	game.currentObject = elements;
	game.currentPuzzle = puzzle;

	var copyArray = game.previousPositions.slice();
	for (var i = 0; i < elements.length; i++) {
		for (var j = 0; j < copyArray.length; j++) {
			if (copyArray[j][0] === elements[i])
				game.previousPositions[i] = copyArray[j];
		}
	}

	for (var i = 0; i < elements.length; i++) {
		updatePuzzleBoard(game, elements[i], i);
	}
}