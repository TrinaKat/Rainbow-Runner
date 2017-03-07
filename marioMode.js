// Mario Gameplay Mode

var marioQuestionCubeColourIndex = 7;   // flag to indicate whether to draw the cube using question texture
var starCoinCubeColorIndex = 11;        // flag to indicate whether to draw star coin
var isMarioMode = 0;                    // by default the game is not in Mario mode
var isInvincible = 0;                   // see if the player has entered invincible mode
var maxInvincibleTime = 5;
var invincibilityTimer = maxInvincibleTime;  // player has 5 seconds to be in invincible mode
var invincibleColourFlash = 0;

function setupMarioEnvironment()
{
// make the background for the world sky blue
gl.clearColor( 0.0, 0.746, 1.0, 1.0 );

// TODO: assign the mario ground texture to the path (ground.png)
}

