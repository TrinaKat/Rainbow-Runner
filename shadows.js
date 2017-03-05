// Returns a set of shadow vertices projected onto a y=ontoY plane
// Should be called with ontoY = 0, b/c that's where our ground plane is
function createShadows(vertices, lightSource, ontoY) {
	var shadows = [];
	for (var i = 0; i < vertices.length; i++) {
		var x, y, z, w;

		// We are not calculating the real shadow from our light source,
		// 	instead just pretending it is directly overhead
		x = vertices[i][0] - (vertices[i][1] / lightSource[1]);

		// Raise the y a little above
		y = ontoY+0.01;
		z = vertices[i][2] - (vertices[i][1] / lightSource[1]);
		w = 1;

		shadows.push( vec4(x, y, z, w) );
	}

	return shadows;
}

function drawPlayerShadows(transformedPlayerPoints) {
	// We want the shadow to be transparent, need to fix things up
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.depthMask(false);

	var	shadowPoints = createShadows(transformedPlayerPoints, lightPosition, 0);

	var shadowColor = vec4(0, 0, 0, 0.7);

	// Load shadow points into buffer
	shadowBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, shadowBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(shadowPoints), gl.STATIC_DRAW);

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.uniform4fv(currentColourLoc, shadowColor);

    // Note that we completely ignore transformations because shadows
    // are based off the player's final (transformed) vertices
    var eye = mat4();
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(eye));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(playerProjectionMatrix));
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, shadowPoints.length);

    // Reset camera and projection matrices
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
}
