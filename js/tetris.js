var blockHeight = 4;
var blockWidth = 4;
var left = 48;
var totalWidth = 100;
var totalHeight = 92;

function initPuzzle() {
	var board = new PuzzleBoard();
	createNewPuzzle(board);
}

function PuzzleBoard() {
	this.filledBlocks = createEmptyArray(totalWidth / blockWidth, totalHeight
			/ blockHeight);
}

function Puzzle(board) {
	var that = this;
	this.puzzleBoard = board;
	this.colors = [ '#32a4fa', '#38C44F', '#FFAC1C', '#FF6600', '#CC54C4',
			'#999', '#FF0000' ];
	this.puzzles = [ [ [ 0, 0, 1 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
			[ [ 1, 0, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
			[ [ 0, 1, 1 ], [ 1, 1, 0 ], [ 0, 0, 0 ] ],
			[ [ 1, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ] ],
			[ [ 0, 1, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ], [ [ 1, 1 ], [ 1, 1 ] ],
			[ [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ] ] ];

	this.elements = [];
	this.previousPosition = [];

	this.createPuzzle = function(puzzle) {
		var puzzleType = random(this.puzzles.length);
		var nextPuzzle = this.puzzles[puzzleType];
		var background = this.colors[random(this.colors.length)];

		for (var y = 0; y < nextPuzzle.length; y++) {
			for (var x = 0; x < nextPuzzle[y].length; x++) {
				if (nextPuzzle[y][x]) {
					var el = document.createElement("div");
					el.id = "block" + puzzleType;
					el.className = 'block';
					el.style.left = (left + (x * blockWidth)) + '%';
					el.style.top = (y * blockHeight) + '%';
					el.style.background = background;
					document.getElementById("tetris-area").appendChild(el);
					this.elements.push(el);
				}
			}
		}

		var id = setInterval(function() {
			that.moveDown(id);
		}, 500);
	}

	this.moveDown = function(id) {
		var moveBlock = this.mayMove();
		if (moveBlock) {
			for (var i = 0; i < that.elements.length; i++) {
				var block = that.elements[i];
				var blockTop = parseFloat(block.style.top);

				that.updatePuzzleBoard(block, i);

				if (blockTop <= 92) {
					block.style.top = (blockTop + blockHeight) + '%';
				} else {
					clearInterval(id);
				}
			}

		}

		that.clearPreviousPositions();

	}

	this.moveRight = function() {
		that.clearPreviousPositions();
		for (var i = 0; i < that.elements.length; i++) {
			var block = this.elements[i];
			var blockLeft = parseFloat(block.style.left);

			if (blockLeft <= 100) {
				block.style.left = (blockLeft + blockWidth) + '%';
			}

			that.updatePuzzleBoard(block, i);

		}
	}

	this.moveLeft = function() {
		that.clearPreviousPositions();
		for (var i = 0; i < that.elements.length; i++) {
			var block = this.elements[i];
			var blockLeft = parseFloat(block.style.left);

			if (blockLeft >= 0) {
				block.style.left = (blockLeft - blockWidth) + '%';
			}
			that.updatePuzzleBoard(block, i);
		}
	}

	this.clearPreviousPositions = function() {
		for (var i = 0; i < that.previousPosition.length; i++) {
			x = that.previousPosition[i][0];
			y = that.previousPosition[i][1];
			that.puzzleBoard.filledBlocks[x][y] = 0;
		}
	}

	this.mayMove = function() {

		for (var i = 0; i < that.elements.length; i++) {
			var block = this.elements[i];
			var blockLeft = parseFloat(block.style.left);
			var blockTop = parseFloat(block.style.top);

			x = blockLeft / 4;
			y = blockTop / 4;

			if (that.puzzleBoard.filledBlocks[x + 1][y + 1] != 0) {
				return false;
			}

		}

		return true;

	}

	this.updatePuzzleBoard = function(block, i) {
		var blockLeft = parseFloat(block.style.left);
		var blockTop = parseFloat(block.style.top);

		var x = blockLeft / 4;
		var y = blockTop / 4;

		that.puzzleBoard.filledBlocks[x][y] = block;
		that.previousPosition[i] = [ x, y ];
	}
}

function createNewPuzzle(board) {
	var puzzle = new Puzzle(board);
	document.addEventListener("keydown", function(e) {
		onKeyDown(e, puzzle);
	}, false);
	puzzle.createPuzzle();
}

function onKeyDown(e, puzzle) {
	switch (e.keyCode) {
	case 39: // Right Key
	{
		puzzle.moveRight();
		break;
	}

	case 37: // Left Key
	{
		puzzle.moveLeft();
		break;
	}

	}
}
