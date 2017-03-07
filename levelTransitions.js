// Level Transitions
var isIntroTransition = 1;
var introCubesXPositions = [];
var introCubesZPositions = [];

function generateIntroCubes() {
	// draw the cubes in groups of two, more and more narrow
	var maxWidth = canvas.width/60;
	var mid1Width = canvas.width/80;
	var mid2Width = canvas.width/100;   
	var minWidth = canvas.width/120;
	var currZPosition = cameraPositionZAxis - 40;

	// curve in
	for (var x = maxWidth; x >= minWidth; x--) {
		// draw the straight segments
		if (x == maxWidth || x == mid1Width || x == mid2Width || x == minWidth) {
			for (var i = 0; i < 40; i++) {
				// store the x positions for this row of cubes
				var xPositions = [];
				// store pairs of cubes (one for each side)
				xPositions.push(-1 * x);
				xPositions.push(x);
				// add the cube positions to the arrays
				introCubesXPositions.push(xPositions);
				introCubesZPositions.push(currZPosition);
				currZPosition--;
			}
		}
		// draw the diagonal curving in segments
		else {
			// store the x positions for this row of cubes
			var xPositions = [];
			// store pairs of cubes (one for each side)
			xPositions.push(-1 * x);
			xPositions.push(-1 * x + 1);
			xPositions.push(x);
			xPositions.push(x - 1);
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

            // in Mario mode
            if (isMarioMode) {
            	applyPipeTexture();
            }
	        // Draw the cubes and outlines
	        drawOutline();
	        // Set the colour for the cubes
	        drawCube(4);  
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