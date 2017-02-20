// Path

// Generate vertices for the path
function generatePath() {
    // Generate the path with z: { -cameraPositionZaxis, cameraPositionZaxis }
    // Store the vertices needed for the path
    var pathVertices =
    [
        vec4( -canvas.width/2, 0, -cameraPositionZAxis, 1.0 ),  // lower left corner
        vec4( canvas.width/2, 0, -cameraPositionZAxis, 1.0 ),  // lower right corner
        vec4( -canvas.width/2, 0, cameraPositionZAxis, 1.0 ),  // top left corner
        vec4( canvas.width/2, 0, cameraPositionZAxis, 1.0 )  // top right corner
    ];

    // The order to draw with the path vertices
    var vertexOrder = [0, 2, 3, 0, 3, 1];

    for (var i = 0; i < 6; i++) {
        pathPoints.push(pathVertices[vertexOrder[i]]);
    }
}

// Draw the path for the cubes to travel on
function drawPath() {
    // Buffer and attributes for the path points
    gl.bindBuffer( gl.ARRAY_BUFFER, vPathBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pathPoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Reset the model transform matrix so the path is drawn at the origin
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(mat4()));
    // Reset the camera transform matrix as well (was changed to move the cubes)
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, numPathVertices );
    // Set the model transform back to its original value
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
}
