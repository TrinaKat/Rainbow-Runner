// Path

// Generate vertices for the path
function generatePath() {
    // Generate the path with z: { -cameraPositionZaxis, cameraPositionZaxis }
    // Store the vertices needed for the path
    var pathVertices =
    [
        vec4( -40, 0, cameraPositionZAxis, 1.0 ),   // near left corner   // 0
        vec4( -40, 0, -cameraPositionZAxis, 1.0 ),  // far left corner    // 1
        vec4( 40, 0, -cameraPositionZAxis, 1.0 ),   // far right corner   // 2
        vec4( 40, 0, cameraPositionZAxis, 1.0 )     // near right corner  // 3
    ];

    // The order to draw with the path vertices
    var vertexOrder = [1, 0, 3, 1, 3, 2];

    for (var i = 0; i < 6; i++) {
        pathPoints.push(pathVertices[vertexOrder[i]]);
    }
}

// Draw the path for the cubes to travel on
function drawPath(scrollAmount) {
    // Buffer and attributes for the path points
    gl.bindBuffer( gl.ARRAY_BUFFER, vPathBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pathPoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Reset the camera transform matrix as well (was changed to move the cubes)
    // gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

    // Enable the texture before we draw
    enableTexture = true;
    gl.uniform1f(enableTextureLoc, enableTexture);  // tell the shader whether or not we want to enable textures

    if (!isFlipped)
    {
         // Add scrolling rainbow road texture
         if (!isPaused)
         {
            // Don't grow forever
            if( texCoords[0][1] > 60 )
            {
                texCoords = [];
                for( var i = 0; i < 6; i++ )
                {
                    texCoords.push(resetTexCoords[i]);
                }
            }

            for( var v = 0; v < 6; v++ )
            {
                texCoords[ v ] = add( texCoords[ v ], vec2( 0, scrollAmount ));
            }
        }

        // Bind the appropriate buffers and attributes for the texture
        // TODO choose flipped or normal texcoords
        gl.bindBuffer(gl.ARRAY_BUFFER, vTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(texcoordLoc);
        gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

        // Bind the texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(textureLoc, 0);
    }
    else
    {
        // Bind the appropriate buffers and attributes for the texture
        // TODO choose flipped or normal texcoords
        gl.bindBuffer(gl.ARRAY_BUFFER, vTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(flippedTexCoords), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(texcoordLoc);
        gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

        // Bind the texture
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textureFlipped);
        gl.uniform1i(textureLoc, 1);
    }

    // Reset the model transform matrix so the path is drawn at the origin
    modelTransformMatrix = mat4();
    // Add in rotation due to left/right keypress
    // modelTransformMatrix = mult( modelTransformMatrix, rotate( rotDegrees, vec3( 0, 0, 1 )));
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));


    gl.drawArrays( gl.TRIANGLES, 0, numPathVertices );

    // Set the model transform back to its original value
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

     // disable the texture before we draw something else later
    enableTexture = false;
    gl.uniform1f(enableTextureLoc, enableTexture);

    gl.bindTexture(gl.TEXTURE_2D, null);
}
