// Border + Outline + Misc.

// Generate vertices for the cube outline
function generateCubeOutline()
{
    // Generate lines for front face of the cube
    outlinePoints.push(vertices[0]);
    for (var i = 1; i < 4; i++) {
        outlinePoints.push(vertices[i]);
        outlinePoints.push(vertices[i]);
    }
    outlinePoints.push(vertices[0]);

    // Generate lines for the back face of the cube
    outlinePoints.push(vertices[4]);
    for (var j = 5; j < 8; j++) {
        outlinePoints.push(vertices[j]);
        outlinePoints.push(vertices[j]);
    }
    outlinePoints.push(vertices[4]);

    // Generate four lines to connect the top face to the bottom face
    for (var k = 0; k < 4; k++) {
        outlinePoints.push(vertices[k]);
        outlinePoints.push(vertices[k+4]);
    }
}

// Draw the cube outline in black for normal cubes and white for border cubes
function drawOutline()
{
    // Bind the current buffer that we want to draw (the one with the points)
    gl.bindBuffer( gl.ARRAY_BUFFER, vOutlineBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(outlinePoints), gl.STATIC_DRAW );
    // Tell attribute how to get data out of buffer and binds current buffer to the attribute
    // vPosition will always be bound to vBuffer now
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);


    if (isForBorder)
    {
        gl.uniform4fv(currentColourLoc, colors[0]);  // Make the outline white
        isForBorder = 0;
    }
    else
    {
        gl.uniform4fv(currentColourLoc, colors[4]);  // Make the outline black
    }
    gl.drawArrays( gl.LINES, 0, numOutlinePoints );
}

function drawBorder()
{
    // Iterate through the whole length of the canvas and draw borders made of cubes on the sides
    for (var i = -cameraPositionZAxis; i < cameraPositionZAxis; i++) {
        // Draw cube on left side
        transformCube( -1 * (pathWidth + 1), i );
        isForBorder = 1;  // Sets bool to true, will draw Outline in white rather than black
        drawOutline();  // draw the outline for the cube
        drawCube(4);  // draw the cube as dark grey

        // Draw cube on right side
        transformCube( pathWidth, i );
        isForBorder = 1;  // Sets bool to true, will draw Outline in white rather than black
        drawOutline();  // draw the outline for the cube
        drawCube(4);  // draw the cube as dark grey
    }
}

