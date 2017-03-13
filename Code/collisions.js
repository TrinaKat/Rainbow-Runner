// COLLISIONS

// check if the two lines intersect
function checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, secondLineIsHorizontal, secondLineValue, leftCubeXPosition, backCubeZPosition) {
  var playerRightXPos = playerLeftXPos + 1;
  var rightCubeXPosition = leftCubeXPosition + 1;
  var frontCubeZPosition = backCubeZPosition + 1;

  // the two intercepts for the left edge equation and the right edge equation
  var bLeft = playerBaseZPos - playerEdgeSlope * playerLeftXPos;
  var bRight = playerBaseZPos - (-1 * playerEdgeSlope) * playerRightXPos;

  // checking either the front face or the back face of the cube
  if (secondLineIsHorizontal)
  {
      // check and see for which x-value the player edge equations intersect the cube lines
      // z = mx + b so set the z values equal, and solve using x = (z-b)/m
      // check intersection with the left edge of the player
      var x1 = (secondLineValue - bLeft)/playerEdgeSlope;
      // check intersection with the right edge of the player
      var x2 = (secondLineValue - bRight)/(-1 * playerEdgeSlope);

      if ((x1 >= leftCubeXPosition && x1 <= rightCubeXPosition) ||
          (x2 >= leftCubeXPosition && x2 <= rightCubeXPosition))
      {
        return 1;
      }
  }
  // checking either the left or right side of the cube
  else
  {
      // check and see for which z-value the player edge equations intersect the cube lines
      // z = mx + b so just plug in the values and find what z is
      var z1 = playerEdgeSlope * secondLineValue + bLeft;
      var z2 = -1 * playerEdgeSlope * secondLineValue + bRight;
      if ((z1 >= backCubeZPosition && z1 <= frontCubeZPosition) ||
          (z2 >= backCubeZPosition && z2 <= frontCubeZPosition))
      {
        return 1;
    }
  }
  return 0;
}

// check if the player has collided into any cubes
function playerCollisionDetection() {
  // we only need to check the two front forward edges of the player since it is a triangular shape and it will only ever being moving forward, and we only care about the (x,z) coordinates of the player
  // the player's original coordinates: near left point = (-0.5, 1.0), near right point = (0.5, 1.0), tip = (0, 0.0)
  // get the player's new x-coordinates
  var playerLeftXPos = playerXPos - 0.5;
  var playerRightXPos = playerXPos + 0.5;
  var playerBaseZPos = playerTipZPos + 1;


  // check if the player has hit the borders
  if (playerLeftXPos <= -1* pathWidth || playerRightXPos >= pathWidth)
  {
      isGameOver = true;
      if( !hasHitBorder)
      {
        isExploded = 1;
      }
      if( !explodeSound )
      {
        playCubeCrashMusic();
      }
      hasHitBorder = 1;
  }

  var isLowEnough = jumpFSM.canHitCube();

  // If you are jumping high, then don't need to run collision detection
  //  for the cubes
  if ((isMarioMode && isLowEnough) || !isMarioMode)
  {
    // need to check all of the cubes that are now in the same z position range as the player and check if they overlap with the player
    for (var i = 0; i < allCubeLineZPositions.length; i++)
    {
      // the cube is in the z position range of the player
      // allCubeLineZPositions[i] is the z-value of the back face of the cube, and allCubeLineZPositions[i] + 1 is the z-value of the front face of the cube
      if (allCubeLineZPositions[i] < playerBaseZPos && (allCubeLineZPositions[i] + 1) > playerTipZPos)
      {
        // get all the x positions of the cubes in this cube line
        var allXPositions = allCubeLineXPositions[i];

        // check if the x position is in between the front side edges of the player given the exact z-value (use the slope and some math)
        for (var j = 0; j < allXPositions.length; j++)
        {
          // the left x-position of the cube is allXPositions[j] and the right x-position of the cube is allXPositions[j] + 1
          // check if any of the sides of the square (the top/bottom face of the cube) intersect with the front two edges of the player

          // the cube is out of range for x values, so ignore it
          if (allXPositions[j] + 1 < playerLeftXPos || allXPositions[j] > playerRightXPos)
            continue;

          if( allCubeColours[i][j] == starCoinCubeColorIndex )
            {
              score += 20;
              isStarCoinLastExploded = true;
              document.getElementById('chaCHING').play();
            }

          if( allCubeColours[i][j] == goombaColourIndex )
            {
              isGoombaLastExploded = true;
            }

          // check if any of the faces intersect
          if ( !isStarCoinLastExploded && checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, 1, allCubeLineZPositions[i] + 1, allXPositions[j], allCubeLineZPositions[i]) ||
            checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, 1, allCubeLineZPositions[i], allXPositions[j], allCubeLineZPositions[i]) ||
            checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, 0, allXPositions[j], allXPositions[j], allCubeLineZPositions[i]) ||
            checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, 0, allXPositions[j] + 1, allXPositions[j], allCubeLineZPositions[i]))
          {
            isExploded = 1;
            // make the cube disappear since we have collided with it
            allCubeLineXPositions[i].splice(j, 1);
            if( !explodeSound )
            {
              playCubeCrashMusic();
            }

            // check to see if you collided with an question mark cube
            if (allCubeColours[i][j] == marioQuestionCubeColourIndex)
            {
              isInvincible = 1;
              isQuestionCubeLastExploded = 1;  // the last cube that we hit was a special question mark cube

              document.getElementById('starSong').play();
              document.getElementById('funSong').pause();
              document.getElementById('themeSong').pause();
              document.getElementById('rainbowRoad').pause();

              invincibilityTimer = maxInvincibleTime;
            }
            // the player is not invincible
            if (!isInvincible && !isStarCoinLastExploded)
            {
              isGameOver = true;
            }
          }
        }
      }
    }
  }
}
