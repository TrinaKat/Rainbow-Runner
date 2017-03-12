// Event Listeners

function eventListeners()
{
  // ADD EVENT LISTENERS
  // for ASCII character keys
  addEventListener("keypress", function(event) {
      switch (event.keyCode) {
          case 105:  // 'i' key
              if(  devModeOn )
              {
                  console.log("i key");
              }
              if( isPaused )
              {
                  if( isStartScreen )
                  {
                      removeScreen(startScreen);
                      displayInstructionScreen();

                      isStartScreen = !isStartScreen;
                      isInstructionScreen = !isInstructionScreen;
                  }
                  else if( isInstructionScreen )
                  {
                      removeScreen(instructionScreen);
                      displayStartScreen();

                      isStartScreen = !isStartScreen;
                      isInstructionScreen = !isInstructionScreen;
                  }
              }
              break;
          case 109:  // 'm' key
              if( devModeOn)
              {
                  console.log("m key");
              }
              if( isStartScreen ) {
                  isMarioMode = !isMarioMode;
              }
              break;
          case 112:  // 'p' key
              if( devModeOn )
              {
                  console.log("p key");
              }
              if( !isStartScreen && !isGameOver && !isInstructionScreen )
              {
                  if( (isMarioMode && !isStartSequence) || !isMarioMode )
                  {
                      isPaused = !isPaused;
                      if( isPaused)
                      {
                          displayPauseScreen();
                      }
                      else
                      {
                          removePauseScreen(pauseScreen);
                      }
                  }
              }
              break;
          case 113:  // 'q' key
              if( devModeOn )
              {
                  console.log("q key");
              }
              if( !isInstructionScreen && !isStartScreen )
              {
                  isGameOver = true;
              }
              if( isPaused )
              {
                  removePauseScreen(pauseScreen);
              }
              document.getElementById('quitSound').play();

              break;
          case 119:  // 'w' key
              if( devModeOn )
              {
                  console.log("w key");
              }
              isAllWhite = !isAllWhite;
              break;
          case 102:  // 'f' key
              if( devModeOn )
              {
                  console.log("f key");
              }
              isFlipped = !isFlipped;
              break;
          case 115:  // 's' key
              if( devModeOn )
              {
                  console.log("s key");
              }
              isMusic = !isMusic;
              break;
          case 122:   // 'z' key
              if( devModeOn )
              {
                  console.log("z key");
              }
              isFun = !isFun;
              break;
          case 49:    // '1'
              if( devModeOn )
              {
                  console.log("Difficulty 1");
              }
              difficulty = 5;
              break;
          case 50:    // '2'
              if( devModeOn )
              {
                  console.log("Difficulty 2");
              }
              difficulty = 7;
              break;
          case 51:    // '3'
              if( devModeOn )
              {
                  console.log("Difficulty 3");
              }
              difficulty = 10;
              break;
          case 120:   // x key
              if( devModeOn )
              {
                  console.log('Dev mode turned off.');
                  devModeOn = false;
              }
              else
              {
                  console.log('Dev mode turned on.');
                  // devModeOn = true;
                  // Disabled for actual game
              }
              break;
          default:
              break;
      }
  });

  // for UP, DOWN, LEFT, RIGHT keys (no ASCII code since they are physical keys)
  addEventListener("keydown", function(event)
  {
    switch(event.keyCode)
    {
      //  GAME NAVIGATION
      case 32:  // space key
          // Prevent browser default action
          event.preventDefault();
          // start the game
          if( isStartScreen )
          {
              // exit the start screen and go to start sequence with lakitu or unpause
              isStartScreen = 0;
              if( !isMarioMode )
              {
                  isPaused = false;
              }
              removeScreen(startScreen);
          }
          // restart the game
          if( isGameOver )
          {
              resetSequence();
              isStartScreen = true;
              isGameOver = false;
          }
          break;
      case 37:  // LEFT key
          // Prevent browser default action
          event.preventDefault();
          if( !isPaused && !isGameOver )
          {
            leftKeyDown = true;
          }
          break;
      case 39:  // RIGHT key
          // Prevent browser default action
          event.preventDefault();
          if( !isPaused && !isGameOver )
          {
              rightKeyDown = true;
          }
          break;
      case 38: // UP key
          // Prevent browser default action
          event.preventDefault();
          if( !isPaused && !isGameOver && !isIntroTransition )
          {
              upKeyDown = true;
          }
          break;
      default:
          break;
    }
  });

  addEventListener("keyup", function(event)
  {
    switch(event.keyCode)
    {
      case 37: // LEFT key
          leftKeyDown = false;
          break;
      case 39: // RIGHT key
          rightKeyDown = false;
          break;
      case 38: // UP key
          upKeyDown = false;
          break;
      default:
          break;
    }
  });
}
