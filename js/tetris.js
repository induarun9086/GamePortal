var blockHeight = 4;
var blockWidth = 4;
var left = 48;
var totalWidth = 100;
var totalHeight = 92;

function initPuzzle() {
	var puzzle = new Puzzle();
	document.addEventListener("keydown", function(e) {
		onKeyDown(e, puzzle);
	}, false);
	puzzle.createPuzzle();
}

function Puzzle() {
	var that = this;
	this.colors = [ '#32a4fa', '#38C44F', '#FFAC1C', '#FF6600', '#CC54C4',
			'999', '#FF0000' ];
	this.puzzles = [ [ [ 0, 0, 1 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
			[ [ 1, 0, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ],
			[ [ 0, 1, 1 ], [ 1, 1, 0 ], [ 0, 0, 0 ] ],
			[ [ 1, 1, 0 ], [ 0, 1, 1 ], [ 0, 0, 0 ] ],
			[ [ 0, 1, 0 ], [ 1, 1, 1 ], [ 0, 0, 0 ] ], [ [ 1, 1 ], [ 1, 1 ] ],
			[ [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ] ] ];

	this.filledBlocks = createEmptyArray(totalWidth / blockWidth, totalHeight
			/ blockHeight);

	this.elements = [];

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

		var previousPosition = [];

		setInterval(function() {
			that.moveDown(previousPosition);
		}, 500);
	}

	this.moveDown = function(previousPosition) {
		
		for (var i = 0; i < previousPosition.length; i++) {
			x = previousPosition[i][0];
			y = previousPosition[i][1];
			console.log(that.filledBlocks[x][y]);
			that.filledBlocks[x][y] = 0;
		}
		
		for (var i = 0; i < that.elements.length; i++) {
			var block = that.elements[i];
			var blockLeft = parseFloat(block.style.left);
			var blockTop = parseFloat(block.style.top);

			x = blockLeft / 4;
			y = blockTop / 4;

			that.filledBlocks[x][y] = block;

			if (blockTop <= 92) {
				block.style.top = (blockTop + blockHeight) + '%';
			}

			previousPosition[i] = [ x, y ];
		}
	}

}

function random(i) {
	return Math.floor(Math.random() * i);
}

function createEmptyArray(y, x) {
	var array = [];
	for (var y2 = 0; y2 < y; y2++) {
		array.push(new Array());
		for (var x2 = 0; x2 < x; x2++) {
			array[y2].push(0);
		}
	}
	return array;
}

function onKeyDown(e, puzzle) {
	switch (e.keyCode) {
	case 39: // Right Key
	{
		for (var i = 0; i < puzzle.elements.length; i++) {
			var block = puzzle.elements[i];
			var blockLeft = parseFloat(block.style.left);

			if (blockLeft <= 100) {
				block.style.left = (blockLeft + blockWidth) + '%';
			}
		}

		break;
	}

	case 37: // Left Key
	{
		for (var i = 0; i < puzzle.elements.length; i++) {
			var block = puzzle.elements[i];
			var blockLeft = parseFloat(block.style.left);

			if (blockLeft >= 0) {
				block.style.left = (blockLeft - blockWidth) + '%';
			}
		}
	}

	}
}
