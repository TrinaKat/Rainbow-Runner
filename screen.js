// Start, Pause, and Game Over Screens

var isStartScreen = 1;  // game starts with start screen; TODO
var isPauseScreen = 0;  // screen that displays when you pause; TOOD
var isEndScreen = 0;  // screen that displays for game over or when you quit from the pause screen; TODO
var isInstructionScreen = 0;  // screen that displays to show the instructions
var startScreen;
var pauseScreen;
var endScreen;
var instructionScreen;


// game boy canvas 
function displayGameBoyScreen() {
    var gameBoycanvas = document.getElementById("gameboyScreen");
    var ctx = gameBoycanvas.getContext("2d");
    var gameboyimg = new Image();
    gameboyimg.src = "./Textures/gameBoySquarer.png";
   ctx.drawImage(gameboyimg, 0, 0, 2688,1740);
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
    startScreen.fillText("Rainbow", 220, 320);
    startScreen.fillText("Runner", 260, 420);
    // set the subtitle for the start screen
    startScreen.font = "32px eightbit"
   
    startScreen.fillText("<space> to Start", 260, 580);
    startScreen.fillText("<m> Toggle Mario Mode", 190, 640);
    startScreen.fillText("<i> for instructions", 240, 700);

}

// instruction screen accessible from the start screen
function displayInstructionScreen() {
    var instructionScreenCanvas = document.getElementById( "instructionScreen" );
    instructionScreen = instructionScreenCanvas.getContext( "2d" );
    // clear the 2D canvas that has the start screen
    instructionScreen.clearRect(0, 0, instructionScreen.canvas.width, instructionScreen.canvas.height);
    // set the start screen to translucent black overlay
    instructionScreen.fillStyle = 'rgba(0, 0, 0, 0.84)';
    instructionScreen.fillRect(0, 0, instructionScreen.canvas.width, instructionScreen.canvas.height);
    // set the title for the start screen
    instructionScreen.font = "72px eightbit"
    instructionScreen.fillStyle = "#ffffff";  // we want white text
    instructionScreen.fillText("Instructions", 100, 140);
    // set the instructions to perform next
    instructionScreen.font = "42px eightbit"
    instructionScreen.fillText("Navigation", 100, 300);
    instructionScreen.font = "32px eightbit"
    instructionScreen.fillText(" - <LEFT> to move left", 100, 370);
    instructionScreen.fillText(" - <RIGHT> to move right", 100, 420);
    instructionScreen.font = "42px eightbit"
    instructionScreen.fillText("Toggle Settings", 100, 570);
    instructionScreen.font = "32px eightbit"
    instructionScreen.fillText(" - <m> for Mario Mode", 100, 640);
    // TODO MORE TOGGLE SETTINGS
    instructionScreen.font = "42px eightbit"
    instructionScreen.fillText("Gameplay Settings", 100, 800);
    instructionScreen.font = "32px eightbit"
    instructionScreen.fillText(" - <p> to Pause ", 100, 850);
    instructionScreen.fillText(" - <Q> to Quit", 100, 900);
    instructionScreen.fillText(" - <i> to Go back", 100, 950);
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

// screen that player sees when exiting from pause mode or quitting the game
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

