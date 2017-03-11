// Level Transitions
var isIntroTransition = 1;
var introCubesXPositions = [];
var introCubesZPositions = [];
// draw the cubes in groups of two, more and more narrow
var maxWidth;
var mid1Width;
var mid2Width;
var minWidth;
var longLength = 14;

function generateIntroCubes() {
	// initialize variables
	maxWidth = 16;
	mid1Width = 12;
	mid2Width = 10;
	minWidth = 8;
	var currZPosition = cameraPositionZAxis - 30;
	// curve in
	for (var x = maxWidth; x >= minWidth; x--) {
		// draw the straight segments
		if (x == maxWidth || x == mid1Width || x == mid2Width || x == minWidth) {
				// store the x positions for this row of cubes
				var xPositions = [];
				// store pairs of cubes (one for each side)
				xPositions.push(x);
				xPositions.push(-1 * x);
				// add the cube positions to the arrays
				introCubesXPositions.push(xPositions);
				// want the long cube to centered correctly before we scale
				introCubesZPositions.push(currZPosition - longLength + 1);
				// make sure that subsequent cubes are located in the correct positions
				currZPosition = currZPosition - longLength;
		}
		// draw the diagonal curving in segments
		else {
			// store the x positions for this row of cubes
			var xPositions = [];
			// store pairs of cubes (one for each side)
			xPositions.push(x);
			xPositions.push(x - 1);
			xPositions.push(-1 * x + 1);
			xPositions.push(-1 * x);
			// add the cube positions to the arrays
			introCubesXPositions.push(xPositions);
			introCubesZPositions.push(currZPosition);
			currZPosition--;
		}
	}
}

// draw the cubes needed
function introTransition() {
	// Iterate through each row of cubes (one cube line at a time)
    for ( var r = 0; r < introCubesXPositions.length; r++ )
    {
        // Get the new z position for this row of cubes by adding amountToMove to the original z position
        introCubesZPositions[r] = introCubesZPositions[r] + amountToMove;

        // Iterate through all the cubes on a single cube line
        for ( var c = 0; c < introCubesXPositions[r].length; c++ )
        {
          // Move the cube to the correct position
          transformCube( introCubesXPositions[r][c], 0, introCubesZPositions[r] );

          // apply scaling to the long cube to form straight segment
          if (introCubesXPositions[r][0] == maxWidth ||
              introCubesXPositions[r][0] == mid1Width ||
              introCubesXPositions[r][0] == mid2Width ||
              introCubesXPositions[r][0] == minWidth)
          {
	           gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(mult(modelTransformMatrix, scalem(1, 1, longLength))));
	   	    }

          // Draw the cubes and outlines
	        drawOutline();

          // in Mario mode
          if (isMarioMode)
          {
            var length = introCubesXPositions[r][0];
            switch( length )
            {
              case maxWidth:
                applyRepeatingTexture(pipeCoords_16, pipeRepeatTexture);
                break;
              case mid1Width:
                applyRepeatingTexture(pipeCoords_12, pipeRepeatTexture);
                break;
              case mid2Width:
                applyRepeatingTexture(pipeCoords_10, pipeRepeatTexture);
                break;
              case minWidth:
                applyRepeatingTexture(pipeCoords_8, pipeRepeatTexture);
                break;
              default:
                applyTexture(pipeCoords);
                break;
            }
          }

	        // Set the colour for the cubes
	        drawCube(4);

	        // check if the player has collided with the cubes
	        // the tip of the player is between the z-positions of this line
	        if (playerTipZPos > introCubesZPositions[r] && playerTipZPos < introCubesZPositions[r] + 1)
          {
	        	// the positive distance is always stored first, so introCubesXPositions[r][0] > 0
		        if (playerXPos > introCubesXPositions[r][0] || playerXPos < -1 * introCubesXPositions[r][0])
            {
  			      isGameOver = true;
  			      if( !hasHitBorder)
  			      {
  			        isExploded = 1;
  			      }
  			      hasHitBorder = 1;
		        }
		    }
	    }
	}
	// backmost element is past the player
	if (introCubesZPositions[introCubesZPositions.length - 1] > cameraPositionZAxis) {
		isIntroTransition = 0;
		// free the memory
		introCubesXPositions = [];
		introCubesZPositions = [];
		isDrawBorder = 1;
	}
}

// restart the intro transition if someone quits the game
function restartIntroTransition() {
	introCubesXPositions = [];
	introCubesZPositions = [];
	isIntroTransition = 1;
	generateIntroCubes();
}
