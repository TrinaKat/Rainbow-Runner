// Start, Pause, and Game Over Screens

var isStartScreen = 1;  // game starts with start screen; TODO
var isPauseScreen = 0;  // screen that displays when you pause; TOOD
var isEndScreen = 0;  // screen that displays for game over or when you quit from the pause screen; TODO
var isInstructionScreen = 0;  // screen that displays to show the instructions
var startScreen;
var pauseScreen;
var endScreen;
var instructionScreen;
var canvasSizeIndex =0;
var ifEnlargeCanvas = 0;
var gbCanvHeight = "0vh";
var gbCanvWidth = "0vh";
var gbCanvLeft = "40.88vh";
var gbCanvTop = "16.88vh";



function startGamePlay()
{
    document.getElementById("gameboyWhiteScreen").style.opacity = 0;
  if (!isStartScreen)
  {
      // exit the start screen and go to start sequence with lakitu or unpause
      isStartScreen = 1;
      if( !isMarioMode )
      {
          isPaused = false;
      }
      removeScreen(startScreen);
  }
  // restart the game
  if (isGameOver)
  {
      resetSequence();
      isStartScreen = true;
      isGameOver = false;
  }
}

function resizeCanvas()
{
    ifEnlargeCanvas = !ifEnlargeCanvas;

    var btnResize = document.getElementById ("gameResizeBtn");
    var btnStart = document.getElementById ("gameStartBtn");
    var gameBoyBackground = document.getElementById ("gameboyScreen");

    // Enlarge by factor of ~1.5
    // Calculate Left and Top by getting (New - Old)/2
    if (ifEnlargeCanvas)
    {
        gbCanvWidth = "88.5vh";
        gbCanvHeight = "88.5vh";
        gbCanvLeft = "28.13vh";
        gbCanvTop = "2vh";

        btnStart.style.width = "5.5vh";
        btnStart.style.height = "5.5vh";
        btnStart.style.left =  "3.9825vh";
        btnStart.style.top = "65.4vh";

        btnResize.style.width = "5.5vh";
        btnResize.style.height = "5.5vh";
        btnResize.style.left =  "3.9825vh";
        btnResize.style.top = "78.5vh";

        gameBoyBackground.style.width = "215.55vh";
        gameBoyBackground.style.height = "141.6vh";
        gameBoyBackground.style.left = "-33.925vh";
        gameBoyBackground.style.top = "-23.6vh";
    }
    else {
        gbCanvWidth = "59vh";
        gbCanvHeight = "59vh";
        gbCanvLeft = "40.88vh";
        gbCanvTop = "16.88vh";

        btnStart.style.width = "3.93vh";
        btnStart.style.height = "3.93vh";
        btnStart.style.left =  "25.38vh";
        btnStart.style.top = "58.88vh";

        btnResize.style.width = "3.93vh";
        btnResize.style.height = "3.93vh";
        btnResize.style.left =  "25.38vh";
        btnResize.style.top = "67.88vh";

        gameBoyBackground.style.width = "143.70vh";
        gameBoyBackground.style.height = "94.4vh";
        gameBoyBackground.style.left = "0vh";
        gameBoyBackground.style.top = "0vh";
    }

    for ( var i = 0; i < 6; i++ )
    {
        var mainCanvas = document.getElementsByTagName('canvas')[i];
        mainCanvas.style.height = gbCanvHeight;
        mainCanvas.style.width = gbCanvWidth;
        mainCanvas.style.left =  gbCanvLeft;
        mainCanvas.style.top = gbCanvTop;
    }

     //var ctx = gameBoycanvas.getContext("2d");
}

// game boy canvas
function displayGameBoyScreen()
{

    var gameBoycanvas = document.getElementById("gameboyScreen");
    var ctx = gameBoycanvas.getContext("2d");
    var gameboyimg = new Image();
    if (ifEnlargeCanvas){
        gameboyimg.src = "./Textures/gameBoySquare_zoomIn.png";
     }
    else
        gameboyimg.src = "./Textures/gameBoySquarer.jpg";
    ctx.drawImage(gameboyimg, 0, 0, 2688,1740);
}

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
    startScreen.font = "120px eightbit"
    startScreen.fillStyle = "#ffffff";  // we want white text
    startScreen.fillText("Rainbow", 140, 320);
    startScreen.fillText("Runner", 200, 470);
    // set the subtitle for the start screen
    startScreen.font = "32px eightbit"

    startScreen.fillText("<space> to Start", 310, 620);
    startScreen.fillText("<m> Toggle Mario Mode", 240, 680);
    startScreen.fillText("<i> for Instructions", 290, 740);

}

// instruction screen accessible from the start screen
function displayInstructionScreen()
{
    var instructionScreenCanvas = document.getElementById( "instructionScreen" );
    instructionScreen = instructionScreenCanvas.getContext( "2d" );
    // clear the 2D canvas that has the start screen
    instructionScreen.clearRect(0, 0, instructionScreen.canvas.width, instructionScreen.canvas.height);
    // set the start screen to translucent black overlay
    instructionScreen.fillStyle = 'rgba(0, 0, 0, 0.84)';
    instructionScreen.fillRect(0, 0, instructionScreen.canvas.width, instructionScreen.canvas.height);
    // set the title for the start screen
    instructionScreen.font = "72px eightbit"
    instructionScreen.fillStyle = "#ffffff";

    // Title to Type size 110
    // Type to Text size 60
    // Text to Text size 50
    instructionScreen.fillText("Instructions", 90, 170);

    instructionScreen.font = "42px eightbit"
    instructionScreen.fillText("Theme/Design Settings", 130, 280);
    instructionScreen.font = "32px eightbit"
    instructionScreen.fillText(" - <m> for Mario Mode", 130, 340);
    instructionScreen.fillText(" - <s> to toggle Sound ", 130, 390);
    instructionScreen.fillText(" - <f> to flip Rainbow Road,", 130, 440);
    instructionScreen.fillText("        Regular Mode only", 130, 490);

    instructionScreen.font = "42px eightbit"
    instructionScreen.fillText("Navigation Controls", 130, 590);
    instructionScreen.font = "32px eightbit"
    instructionScreen.fillText(" - <LEFT> to move left", 130, 650);
    instructionScreen.fillText(" - <RIGHT> to move right", 130, 700);
    instructionScreen.fillText(" - <UP> to jump, Mario Mode only", 130, 750);

    instructionScreen.font = "42px eightbit"
    instructionScreen.fillText("Gameplay Controls", 130, 850);
    instructionScreen.font = "32px eightbit"
    instructionScreen.fillText(" - <1>  <2> or <3> to set Difficulty ", 130, 910);
    instructionScreen.fillText(" - <p> to Pause ", 130, 960);
    instructionScreen.fillText(" - <Q> to Quit", 130, 1010);
    instructionScreen.fillText(" - <i> to Go Back", 130, 1060);
}

// screen that player sees when pausing the game
function displayPauseScreen() {
	var pauseScreenCanvas = document.getElementById( "pauseScreen" );
	pauseScreen = pauseScreenCanvas.getContext( "2d" );
	// clear the 2D canvas that has the start screen
    pauseScreen.clearRect(0, 0, pauseScreen.canvas.width, pauseScreen.canvas.height);
    // set the pause screen to clear
    pauseScreen.fillStyle = 'rgba(0, 0, 0, 0.7)';
    pauseScreen.fillRect(0, 0, pauseScreen.canvas.width, pauseScreen.canvas.height);
    // set the title for the start screen
    pauseScreen.font = "84px eightbit"
    pauseScreen.fillStyle = "#ffffff";  // we want white text
    pauseScreen.fillText("Paused", 90, 130);
    // set the instructions to perform next
    pauseScreen.font = "32px eightbit"
    pauseScreen.fillText("<p> to Resume", 130, 210);
    pauseScreen.fillText("<Q> to Quit", 190, 260);
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
    endScreen.font = "bold 200px eightbit"
    endScreen.fillStyle = "#ffffff";  // we want white text
    endScreen.fillText("Game", 130, 360);
    endScreen.fillText("Over", 170, 600);
    endScreen.font = "32px eightbit"
    endScreen.fillText("<space> to Restart", 300, 750);

}

// remove the specified screen from the display
function removeScreen(screen)
{
	screen.clearRect(0, 0, startScreen.canvas.width, startScreen.canvas.height);
}

// remove the specified screen from the display
function removePauseScreen(p_screen)
{
    p_screen.clearRect(0, 0, pauseScreen.canvas.width, startScreen.canvas.height);
}

