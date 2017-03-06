// Start, Pause, and Game Over Screens

var isStartScreen = 1;  // game starts with start screen; TODO
var isPauseScreen = 0;  // screen that displays when you pause; TOOD
var isEndScreen = 0;  // screen that displays for game over or when you quit from the pause screen; TODO
var startScreen;
var pauseScreen;
var endScreen;

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
    startScreen.font = "bold 72px Courier"
    startScreen.fillStyle = "#ffffff";  // we want white text
    startScreen.fillText("Rainbow Runner", 180, 360);
    // set the subtitle for the start screen
    startScreen.font = "48px Courier"
    startScreen.fillText("Press <space> to Start", 170, 480);
    startScreen.fillText("Press <m> for Mario Mode", 140, 540);
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
    pauseScreen.font = "bold 72px Courier"
    pauseScreen.fillStyle = "#ffffff";  // we want white text
    pauseScreen.fillText("Paused", 360, 300);
    // set the instructions to perform next
    pauseScreen.font = "48px Courier"
    pauseScreen.fillText("Press <space> to Resume", 170, 460);
    pauseScreen.fillText("Press <q> to Quit", 240, 520);
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
    endScreen.font = "bold 84px Courier"
    endScreen.fillStyle = "#ffffff";  // we want white text
    endScreen.fillText("Game Over", 240, 360);
    endScreen.font = "48px Courier"
    endScreen.fillText("Press <space> to Restart", 170, 460);

}

// remove the specified screen from the display
function removeScreen(screen) {
	screen.clearRect(0, 0, startScreen.canvas.width, startScreen.canvas.height);
}

