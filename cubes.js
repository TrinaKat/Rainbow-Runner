// Cubes

var cubePoints = [];
var numCubeVertices = 36;

// Unit cube vertices
var cubeVertices =
[
    vec4( 0.0, 0.0, 1.0, 1.0 ),
    vec4( 0.0, 1.0, 1.0, 1.0 ),
    vec4( 1.0, 1.0, 1.0, 1.0 ),
    vec4( 1.0, 0.0, 1.0, 1.0 ),
    vec4( 0.0, 0.0, 0.0, 1.0 ),
    vec4( 0.0, 1.0, 0.0, 1.0 ),
    vec4( 1.0, 1.0, 0.0, 1.0 ),
    vec4( 1.0, 0.0, 0.0, 1.0 )
];

// Generate points for the cube
function generateCube()
{
    // RHR traversal from vertex 1 to 0 to 3 to 2, only colors one side
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );

    quad( 6, 5, 1, 2 );
}

// Called for each face of the cube
function quad( a, b, c, d )
{
     var t1 = subtract(cubeVertices[b], cubeVertices[a]);
     var t2 = subtract(cubeVertices[c], cubeVertices[b]);
     var normal = cross(t1, t2);

     var vertexOrder = [a, b, c, a, c, d];

     for (var i = 0; i < 6; i++) {
        cubePoints.push(cubeVertices[vertexOrder[i]]);
        normalsArray.push(normal);
     }
 }

// Generate the random starting x positions of a line of cubes and push this into the array of all cube line positions; also pushes the starting position (always -cameraPositionZAxis since they start at the end of the screen)
function generateNewCubeLine()
{
    // Different difficulties enabled with kepresses 1, 2, 3
    // Generate a random number of cubes in the line (5, 7, 10)
    var numCubes = difficulty + Math.floor(Math.random() * 3);
    // Section the path into equal length segments
    var sectionPathWidth = Math.floor( 83 / numCubes );  // we only want to use one quarter of the canvas width so that the cubes are generated near the middle of the screen

    // Holds the unique x positions for the numCubes X positions
    var positions = [];
    var colours = [];

    for( var i = 0; i < numCubes; i++ )
    {
        // Which section of the canvas
        var whichSection = (i * sectionPathWidth);
        // What index in the section of the canvas
        var indexInSection = Math.floor( Math.random() * (sectionPathWidth - 2)) + 1;
        // Initial offset on canvas
        var initialOffset = -1 * pathWidth;
        var randomPosition = whichSection + indexInSection + initialOffset;

        positions.push( randomPosition );

        // Pick a random colour for the cube (index between 0 and 3)
        var cubeColour = Math.floor((Math.random() * (4)));

        // change the colour and make this a special Mario question mark cube
        if (isMarioMode) {
            // decide which cube will be special question mark cube using modulo
            if (randomPosition % (13 + Math.floor(Math.random() * 10)) == 0) {
                if (Math.random() < 0.2)
                    cubeColour = marioQuestionCubeColourIndex;
            }
            else if (randomPosition % (7 + Math.floor(Math.random() * 5)) == 0) {
                if (Math.random() < 0.1)
                    cubeColour = starCoinCubeColorIndex;
            }
        }

        colours.push(cubeColour);
    }

    // Push the array of X positions in the cube line to the array of all cube line positions
    allCubeLineXPositions.push( positions );
    allCubeLineZPositions.push( -cameraPositionZAxis );
    allCubeColours.push(colours);
}

function setUpCubeDraw() {
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // Bind the current buffer that we want to draw (the one with the cubePoints)
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubePoints), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    if (!isMarioMode)
    {
        gl.disableVertexAttribArray(texCoordLoc);
    }
}

// Draw the cube with a specified colour
function drawCube(colourIndex)
{
    setUpCubeDraw();
    // Change the colour for the cube (want to index between 0 and 3)
    if (!isAllWhite) {
        gl.uniform4fv(currentColourLoc, colors[colourIndex]);
    } else {
        gl.uniform4fv(currentColourLoc, colors[0]);  // set the cubes all white
    }

    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}

// Draw lines of cubes and transform them
function drawAndMoveAllCubes()
{
    // Iterate through each row of cubes (one cube line at a time)
    for ( var r = 0; r < allCubeLineXPositions.length; r++ )
    {
        // Get the new z position for this row of cubes by adding amountToMove to the original z position
        allCubeLineZPositions[r] = allCubeLineZPositions[r] + amountToMove;

        // Iterate through all the cubes on a single cube line
        for ( var c = 0; c < allCubeLineXPositions[r].length; c++ )
        {
            // Move the cube to the correct position
            transformCube( allCubeLineXPositions[r][c], 0, allCubeLineZPositions[r] );

            // in Mario mode
            if (isMarioMode)
            {
                if ( allCubeColours[r][c] == marioQuestionCubeColourIndex )
                {
                    applyQuestionTexture();
                    drawCube(allCubeColours[r][c]);
                }
                else if ( allCubeColours[r][c] == starCoinCubeColorIndex )
                {
                    drawCoinStar();
                }
                else
                {
                    applyBrickTexture();
                    drawCube(allCubeColours[r][c]);
                }
            }
            else
            {
                // Draw the cubes and outlines
                drawOutline();
                // Set the colour for the cube
                drawCube(allCubeColours[r][c]);
            }

            // disable the texture before we draw something else later
            enableTexture = false;
            gl.uniform1f(enableTextureLoc, enableTexture);
        }
    }
}

// Modify and apply the model transform matrix for the cubes
function transformCube(xPosition, yPosition, zPosition)
{
    // Move the cubes to the correct x and z axis positions
    modelTransformMatrix = translate(xPosition, yPosition, zPosition);
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
}

// Once cubes have gone past the z position of the user, remove data from arrays
function destroyOutOfRangeCubes() {
    for ( var i = 0; i < allCubeLineZPositions.length; i++)
    {
        // Check to see if the z position is past that of the user
        if (allCubeLineZPositions[i] > cameraPositionZAxis)
        {
            // Delete the cube's data from XZ and color arrays
            allCubeLineZPositions.shift();
            allCubeLineXPositions.shift();
            allCubeColours.shift();
            // Move the iterator back one so you don't miss the next element
            i--;
        }
        else
            break;
            // Since the z values decrease as you go through the array
            // (later cube lines have smaller z values),
            // then if the z position is not past the user for this cube line,
            // then the rest of the cube lines will not be past the user either
    }
}
