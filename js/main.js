var delay = 15;
var space = false;
var screenWidth = 100;
var screenHeight = 100;
var ballDirectionThreshold = 8;
var defaultCircleBottom = 5;

function init() {
	initValues();
	document.addEventListener("keydown", onKeyDown, false);
}

// Function to set styles for the paddle and the ball
function initValues() {
	var paddle = document.getElementById('paddle');
	paddle.style.left = '41%';
	paddle.style.width = '18%';
	paddle.style.height = '4%';

	var circle = document.getElementById('circle');
	circle.style.left = '49%';
	circle.style.bottom = defaultCircleBottom + '%';
	circle.style.width = '2.5%';
	circle.style.height = '5%';
}
function onKeyDown(e) {
	var paddle = document.getElementById('paddle');
	var left = parseFloat(paddle.style.left);

	var circle = document.getElementById('circle');
	var circleLeft = parseFloat(circle.style.left);
	var circleHeight = parseFloat(circle.style.height);

	switch (e.keyCode) {
	case 39: // Left Key
	{
		if (left < (screenWidth - parseFloat(paddle.style.width))) {
			paddle.style.left = (left + 0.5) + '%';
			if (space == false) {
				circle.style.left = (circleLeft + 0.5) + '%';
			}

		}
		break;
	}
	case 37: // Right Key
	{
		if (left > 0) {
			paddle.style.left = (left - 0.5) + '%';
			if (space == false) {
				circle.style.left = (circleLeft - 0.5) + '%';
			}
		}
		break;
	}
	case 32: // Space
	{
		space = true;

		var circleBottom = parseFloat(circle.style.bottom);
		var newThreshold = parseFloat(circle.style.height);

		var bounceBallDir = circleLeft - left;
		var angle;
		// Bounce ball in the right side
		if (bounceBallDir < ballDirectionThreshold) {
			bounceBallRightward();
		}
		// Bounce ball in the left side
		else if (bounceBallDir > ballDirectionThreshold) {
			bounceBallLeftward();
		}
		// Bounce ball vertically
		else {
			bounceBallVertically();
		}

		space = false;
		break;
	}
	}

	function bounceBallRightward() {

		var bounceBallToPaddle = function() {

			circleLeft = (circleLeft + Math.cos((3 * Math.PI) / 4));
			circle.style.left = circleLeft + '%';

			circleBottom = (circleBottom - Math.sin((3 * Math.PI) / 4));
			circle.style.bottom = circleBottom + '%';

			setTimeout(function() {
				// If the ball touches the paddle stop bouncing the ball
				if (circleBottom > newThreshold) {
					bounceBallToPaddle();
				} else {
					fadeOutBall(circle, paddle);
				}
			}, delay);
		}

		var bounceBallDownwards = function() {

			circleLeft = (circleLeft - Math.cos((3 * Math.PI) / 4));
			circle.style.left = circleLeft + '%';

			circleBottom = (circleBottom - Math.sin((3 * Math.PI) / 4));
			circle.style.bottom = circleBottom + '%';

			setTimeout(
					function() {
						// bounce the ball downwards if it reaches the top of
						// the screen
						if (circleLeft <= (screenWidth - parseFloat(circle.style.width))) {
							bounceBallDownwards();
						}
						// bounce the ball to the paddle if it hits the screen
						else if (circleLeft > (screenWidth - parseFloat(circle.style.width))) {
							bounceBallToPaddle();
						}
					}, delay);
		}

		var retreatBallUpwards = function() {

			circleLeft = (circleLeft + Math.cos((Math.PI) / 4));
			circle.style.left = circleLeft + '%';

			circleBottom = (circleBottom + Math.sin((Math.PI) / 4));
			circle.style.bottom = circleBottom + '%';

			setTimeout(
					function() {
						// bounce the ball upwards if it hits the screen
						if (circleBottom < (screenHeight - parseFloat(circle.style.height))) {
							retreatBallUpwards();
						}
						// bounce the ball downwards if it reaches the top of
						// the screen
						else if (circleBottom > newThreshold) {
							bounceBallDownwards();
						}
					}, delay);
		};

		var bounceBallRight = function() {

			circleLeft = (circleLeft - Math.cos(Math.PI / 4));
			circle.style.left = circleLeft + '%';

			circleBottom = (circleBottom + Math.sin(Math.PI / 4));
			circle.style.bottom = circleBottom + '%';

			setTimeout(function() {
				// bounce the ball right side if the ball is in the RHS of the
				// paddle
				if (circleLeft >= 0) {
					bounceBallRight();
				}
				// bounce the ball upwards if it hits the side of the screen
				else if (circleLeft < 0) {
					retreatBallUpwards();
				}
			}, delay);
		};
		bounceBallRight();
	}

	function bounceBallVertically() {

		var retreatBallVertically = function() {
			circle.style.left = (circleLeft - Math.cos(Math.PI / 2)) + '%';
			circleBottom = (circleBottom - Math.sin(Math.PI / 2));
			circle.style.bottom = circleBottom + '%';

			setTimeout(function() {
				// If the ball touches the paddle stop bouncing
				if (circleBottom > newThreshold) {
					retreatBallVertically();
				} else {
					fadeOutBall(circle, paddle);
				}
			}, delay);

		};

		var end = false;
		var moveBallVertically = function() {

			circle.style.left = (circleLeft - Math.cos(Math.PI / 2)) + '%';
			circleBottom = (circleBottom + Math.sin(Math.PI / 2));
			circle.style.bottom = circleBottom + '%';

			setTimeout(
					function() {
						// If the ball reaches the top of the screen, bounce it
						// downwards
						if (circleBottom < (screenHeight - parseFloat(circle.style.height))) {
							moveBallVertically();
						}
						// If the ball touches the paddle stop bouncing
						else if (circleBottom > newThreshold) {
							retreatBallVertically();
						}
					}, delay);
		};
		moveBallVertically();
	}

	function bounceBallLeftward() {
		var bounceBallToPaddle = function() {

			circleLeft = (circleLeft - Math.cos((3 * Math.PI) / 4));
			circle.style.left = circleLeft + '%';

			circleBottom = (circleBottom - Math.sin((3 * Math.PI) / 4));
			circle.style.bottom = circleBottom + '%';

			setTimeout(function() {
				// If the ball touches the paddle stop bouncing
				if (circleBottom > newThreshold) {
					bounceBallToPaddle();
				} else {
					fadeOutBall(circle, paddle);
				}
			}, delay);
		}

		var bounceBallDownwards = function() {

			circleLeft = (circleLeft + Math.cos((3 * Math.PI) / 4));
			circle.style.left = circleLeft + '%';

			circleBottom = (circleBottom - Math.sin((3 * Math.PI) / 4));
			circle.style.bottom = circleBottom + '%';

			setTimeout(function() {
				// If the ball reaches the top of the screen bounce downwards
				if (circleLeft >= 0) {
					bounceBallDownwards();
				}
				// If the ball reaches the hits the side of the screen
				// bounce to the paddle
				else if (circleLeft < 0) {
					bounceBallToPaddle();
				}
			}, delay);
		}

		var retreatBallUpwards = function() {

			circleLeft = (circleLeft - Math.cos((Math.PI) / 4));
			circle.style.left = circleLeft + '%';

			circleBottom = (circleBottom + Math.sin((Math.PI) / 4));
			circle.style.bottom = circleBottom + '%';

			setTimeout(
					function() {
						// If the ball touches the sides bounce it upwards
						if (circleBottom < (screenHeight - parseFloat(circle.style.height))) {
							retreatBallUpwards();
						}
						// If the ball hits top of the screen bounce it
						// downwards
						else if (circleBottom > newThreshold) {
							bounceBallDownwards();
						}
					}, delay);
		};

		var bounceBallLeft = function() {

			circleLeft = (circleLeft + Math.cos(Math.PI / 4));
			circle.style.left = circleLeft + '%';

			circleBottom = (circleBottom + Math.sin(Math.PI / 4));
			circle.style.bottom = circleBottom + '%';

			setTimeout(
					function() {
						// bounce the ball left side if the ball is in the LHS
						// of the paddle
						if (circleLeft <= (screenWidth - parseFloat(circle.style.width))) {
							bounceBallLeft();
						}
						// If the ball hits the sides of the screen bouce it
						// upwards
						else if (circleLeft > (screenWidth - parseFloat(circle.style.width))) {
							retreatBallUpwards();
						}
					}, delay);
		};
		bounceBallLeft();
	}
}

function fadeOutBall(circle, paddle) {
	if (parseFloat(circle.style.bottom) == defaultCircleBottom) {
		circleLeft = parseFloat(circle.style.left);
		paddleLeft = parseFloat(paddle.style.left);

		paddleWidth = parseFloat(paddle.style.width);
		circleWidth = parseFloat(circle.style.width);

		if (!(((circleLeft + circleWidth) >= paddleLeft) && ((circleLeft +  circleWidth) < (paddleLeft + paddleWidth))))
			circle.style.display = 'none';
	}

}