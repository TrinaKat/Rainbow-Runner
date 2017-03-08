var sphereIndex = 0;

function triangle(a, b, c)
{
	sphereNormals.push(a[0],a[1], a[2], 0.0);
    sphereNormals.push(a[0],a[1], a[2], 0.0);
    sphereNormals.push(a[0],a[1], a[2], 0.0);

	sphereVertices.push(a);
	sphereVertices.push(b);
	sphereVertices.push(c);

    sphereIndex += 3;
}

function divideTriangle(a, b, c, count)
{
    if (count > 0)
    {
    	var ab = normalize(mix(a, b, 0.5), true);
    	var ac = normalize(mix(a, c, 0.5), true);
    	var bc = normalize(mix(b, c, 0.5), true);

    	divideTriangle(a, ab, ac, count - 1);
    	divideTriangle(ab, b, bc, count - 1);
    	divideTriangle(bc, c, ac, count - 1);
    	divideTriangle(ab, bc, ac, count - 1);
    }
    else
    {
        triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n)
{
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

function generateSphere()
{
	// Tetrahedron points for sphere
	var va = vec4(0.0, 0.0, -1.0, 1);
	var vb = vec4(0.0, 0.942809, 0.333333, 1);
	var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
	var vd = vec4(0.816497, -0.471405, 0.333333, 1);
	tetrahedron(va, vb, vc, vd, 3);
}

function resetSequence() {
	// remove the game over screen
	if (isGameOver)
		removeScreen(endScreen);
    // delete all the cubes so we can generate new ones
    allCubeLineXPositions = [];
    allCubeLineZPositions = [];
    allCubeColours = [];
    // reset game play properties
    isStartSequence = true;
    if( isMarioMode )
    {
        isPaused = true;
    }
    else
    {
        isPaused = false;
    }
    isExploded = 0;
    hasHitBorder = 0;
    isGameOver = false;
    score = 0;
    // Reset clouds
    lakitu_x = 2;
    lakitu_left = true;
    lakitu_y = 7.5;
    lakitu_up = true;
    cloud1_x = -7;
    cloud2_x = 3;
    // reset player properties
    playerXPos = 0;
    playerTilt = 0;  // no tilt by default
    currAmountTranslated = 0;
    amountToMove = 0;

    movementFSM = new MovementFSM();
    jumpFSM = new JumpFSM();

    playerXPos = 0;
    playerYPos = 0;

    // reset the transformation matrices
    cameraTransformMatrix = pathCameraTransformMatrix;
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
    projectionMatrix = playerProjectionMatrix;
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    // play the intro transition sequence again
    restartIntroTransition();
}

var numLit = 0;

function lakituStartSequence()
{
    if (startSequenceTimer <= 4 && startSequenceTimer > 3)
    {
        numLit = 1;
    }
    else if (startSequenceTimer <= 3 && startSequenceTimer > 2)
    {
        numLit = 2;
    }
    else if (startSequenceTimer <= 2 && startSequenceTimer > 1 )
    {
        numLit = 3;
    }
    else if (startSequenceTimer <= 1 && startSequenceTimer > 0 )
    {
        numLit = 4;
    }
    else if (startSequenceTimer < 0 )
    {
        numLit = 0;
        startSequenceTimer = 5;
        isStartSequence = false;
        isPaused = false;
    }

    var color_left = 2;
    var color_middle = 2;
    var color_right = 2;

    switch (numLit)
    {
        case 0:
            // All spheres are dull gray
            break;
        case 1:
            // Left-most is colored
            color_left = 16;
            break;
        case 2:
            // Left and middle are colored
            color_left = 16;
            color_middle = 17;
            break;
        case 3:
            // All are colored RYG
            color_left = 16;
            color_middle = 17;
            color_right = 18;
            break;
        case 4:
            // All flash green
            color_left = 18;
            color_middle = 18;
            color_right = 18;
            break;
    }

    // reset the camera transform matrix as well (was changed to move the cubes and player)
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

    // RED

    // Set up transformations
    modelTransformMatrix = translate( lakitu_x, lakitu_y, 29 );
    modelTransformMatrix = mult( modelTransformMatrix, translate( -3.05, -1.22, 0 ));
    modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.3, 0.3, 0.3 ));
    gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

    drawSphere(color_left);


    // YELLOW

    // Set up transformations
    modelTransformMatrix = translate( lakitu_x, lakitu_y, 29 );
    modelTransformMatrix = mult( modelTransformMatrix, translate( -2.5, -1.27, 0 ));
    modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.3, 0.3, 0.3 ));
    gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

    drawSphere(color_middle);


    // GREEN

    // Set up transformations
    modelTransformMatrix = translate( lakitu_x, lakitu_y, 29 );
    modelTransformMatrix = mult( modelTransformMatrix, translate( -1.9, -1.31, 0 ));
    modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.3, 0.3, 0.3 ));
    gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

    drawSphere(color_right);

    // set the camera transform matrix to the actual translated state
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}

function drawSphere(colorIndex)
{
    gl.disableVertexAttribArray(texCoordLoc);

    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereNormals), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // Bind the current buffer that we want to draw (the one with the points)
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereVertices), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Set color
    gl.uniform4fv(currentColourLoc, colors[colorIndex]);


    gl.drawArrays( gl.TRIANGLES, 0, sphereIndex );
}

