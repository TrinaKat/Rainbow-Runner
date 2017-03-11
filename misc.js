// Border + Outline + Misc.

function playSound(soundID) {
    document.getElementById(soundID).play();
}

// Generate vertices for the cube outline
function generateCubeOutline()
{
    // Generate lines for front face of the cube
    outlinePoints.push(cubeVertices[0]);
    for (var i = 1; i < 4; i++)
    {
        outlinePoints.push(cubeVertices[i]);
        outlinePoints.push(cubeVertices[i]);
    }
    outlinePoints.push(cubeVertices[0]);

    // Generate lines for the back face of the cube
    outlinePoints.push(cubeVertices[4]);
    for (var j = 5; j < 8; j++)
    {
        outlinePoints.push(cubeVertices[j]);
        outlinePoints.push(cubeVertices[j]);
    }
    outlinePoints.push(cubeVertices[4]);

    // Generate four lines to connect the top face to the bottom face
    for (var k = 0; k < 4; k++)
    {
        outlinePoints.push(cubeVertices[k]);
        outlinePoints.push(cubeVertices[k+4]);
    }
}

// Draw the cube outline in black for normal cubes and white for border cubes
function drawOutline()
{
    // We don't need lighting or textures on outlines
    gl.disableVertexAttribArray(vNormal);
    gl.disableVertexAttribArray(texCoordLoc);

    // Bind the current buffer that we want to draw (the one with the points)
    gl.bindBuffer( gl.ARRAY_BUFFER, vOutlineBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(outlinePoints), gl.STATIC_DRAW );
    // Tell attribute how to get data out of buffer and binds current buffer to the attribute
    // vPosition will always be bound to vBuffer now
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    if (isMarioMode) {
    }

    if (isForBorder) {
        gl.uniform4fv(currentColourLoc, colors[0]);  // Make the outline white
        isForBorder = 0;
    }
    else {
        gl.uniform4fv(currentColourLoc, colors[4]);  // Make the outline black
    }
    gl.drawArrays( gl.LINES, 0, numOutlinePoints );
}

function drawBorder()
{
    // Left wall
    modelTransformMatrix = translate(-pathWidth, 0, -cameraPositionZAxis);
    modelTransformMatrix = mult(modelTransformMatrix, scalem(1,1,cameraPositionZAxis*2));
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

    if (isMarioMode)
    {
        applyPipeBorderTexture();
    }
    else
    {
        drawOutline();
    }

    drawCube(4);
    isForBorder = 1;

    // Right wall
    modelTransformMatrix = translate(pathWidth, 0, -cameraPositionZAxis);
    modelTransformMatrix = mult(modelTransformMatrix, scalem(1,1,cameraPositionZAxis*2));
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
    setUpCubeDraw();

    if (isMarioMode)
    {
        applyPipeBorderTexture();
    }
    else
    {
        drawOutline();
    }

    drawCube(4);
    isForBorder = 1;
}

