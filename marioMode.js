// Mario Gameplay Mode

var isMarioMode = 0;  // by default the game is not in Mario mode
var isInvincible = 0;  // see if the player has entered invincible mode
var invincibilityTimer = 5;  // player has 5 seconds to be in invincible mode

function setupMarioEnvironment() {
	// make the background for the world sky blue
	gl.clearColor( 0.0, 0.746, 1.0, 1.0 );

	// TODO: assign the mario ground texture to the path (ground.png)

	// TODO: change the borders to green pipes

	// TODO: texture map the cubes so that they are bricks like in the mario game

	// TODO: in player.js, check to see if the player has collided with any special cubes by seeing if allCubeColours[i][j] is equal to colors[7] (this means that the player has hit a question mark cube)
		// need to set invincible mode to 1 and then start a timer to go back to regular mode
}

