// Start, Pause, and Game Over Screens

var isStartScreen = 1;  // game starts with start screen; TODO
var isPauseScreen = 0;  // screen that displays when you pause; TOOD
var isEndScreen = 0;  // screen that displays for game over or when you quit from the pause screen; TODO
var startScreen;
var pauseScreen;
var endScreen;



// game boy canvas 
function displayGameBoyScreen() {
    var gameBoycanvas = document.getElementById("gameboyScreen");
    var ctx = gameBoycanvas.getContext("2d");
    var gameboyimg = new Image();
    gameboyimg.src = "./Textures/gameBoy.png";
   ctx.drawImage(gameboyimg, 0, 0, 3121,1851.8);
};
// start screen that the player sees at the very beginning


function displayStartScreen() {
	var startScreenCanvas = document.getElementById( "startScreen" );
	startScreen = startScreenCanvas.getContext( "2d" );
	// clear the 2D canvas that has the start screen
    startScreen.clearRect(0, 0, startScreen.canvas.width, startScreen.canvas.height);
    // set the start screen to translucent black overlay
    startScreen.fillStyle = 'rgba(0, 0, 0, 0.7)';
    startScreen.fillRect(0, 0, startScreen.canvas.width, startScreen.canvas.height);
    // set the title for the start screen
    startScreen.font = "84px eightbit"
    startScreen.fillStyle = "#ffffff";  // we want white text
    startScreen.fillText("Rainbow", 200, 320);
    startScreen.fillText("Runner", 240, 420);
    // set the subtitle for the start screen
    startScreen.font = "32px eightbit"
   
    startScreen.fillText("<space> to Start", 240, 580);
    startScreen.fillText("<m> Toggle Mario Mode", 170, 640);
    startScreen.fillText("<i> for instructions", 220, 700);

}

// screen that player sees when pausing the game
function displayPauseScreen() {
	var pauseScreenCanvas = document.getElementById( "pauseScreen" );
	pauseScreen = pauseScreenCanvas.getContext( "2d" );
	// clear the 2D canvas that has the start screen
    pauseScreen.clearRect(0, 0, pauseScreen.canvas.width, pauseScreen.canvas.height);
    // set the start screen to translucent black overlay
    pauseScreen.fillStyle = 'rgba(0, 0, 0, 0.7)';
    pauseScreen.fillRect(0, 0, pauseScreen.canvas.width, pauseScreen.canvas.height);
    // set the title for the start screen
    pauseScreen.font = "84px eightbit"
    pauseScreen.fillStyle = "#ffffff";  // we want white text
    pauseScreen.fillText("Paused", 240, 420);
    // set the instructions to perform next
    pauseScreen.font = "32px eightbit"
    pauseScreen.fillText("<p> to Resume", 280, 580);
    pauseScreen.fillText("<Q> to Quit", 330, 640);
}

// sfreen that player sees when exiting from pause mode or quitting the game
function displayEndScreen() {
	var endScreenCanvas = document.getElementById( "endScreen" );
	endScreen = endScreenCanvas.getContext( "2d" );
	// clear the 2D canvas that has the start screen
    endScreen.clearRect(0, 0, endScreen.canvas.width, endScreen.canvas.height);
    // set the start screen to translucent black overlay
    endScreen.fillStyle = 'rgba(0, 0, 0, 0.7)';
    endScreen.fillRect(0, 0, endScreen.canvas.width, endScreen.canvas.height);
    // set the title for the start screen
    endScreen.font = "bold 120px eightbit"
    endScreen.fillStyle = "#ffffff";  // we want white text
    endScreen.fillText("Game", 220, 320);
    endScreen.fillText("Over", 250, 460);
    endScreen.font = "32px eightbit"
    endScreen.fillText("<space> to Restart", 210, 620);

}

// remove the specified screen from the display
function removeScreen(screen) {
	screen.clearRect(0, 0, startScreen.canvas.width, startScreen.canvas.height);
}

