// Returns a set of shadow vertices projected onto a y=ontoY plane
// Should be called with ontoY = 0, b/c that's where our ground plane is
function createShadows(vertices, centerPoint, ontoY) {
	var shadows = [];
	for (var i = 0; i < vertices.length; i++) {
		var x, y, z, w;

		var vx = vertices[i][0];
		var vy = vertices[i][1];
		var vz = vertices[i][2];

		var lightSourceHeight = 20;

		var lx = centerPoint[0];
		var ly = centerPoint[1] + lightSourceHeight;
		var lz = centerPoint[2];

		if ( (lx - vx) == 0) {
			x = lx;
		} else {
			x = vx + (ontoY - vy) * ( (lx - vx) / (ly - vy) );
		}
		// Raise the y a little above
		y = ontoY+0.01;
		if ( (lz - vz) == 0) {
			z = lz;
		} else {
			z = vz + (ontoY - vy) * ( (lz - vz) / (ly - vy) );
		}
		w = 1;

		shadows.push( vec4(x, y, z, w) );
	}

	return shadows;
}

function drawPlayerShadows(transformedPlayerPoints, centerPoint)
{
	enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);

	// We want the shadow to be transparent, need to fix things up
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.depthMask(false);

	var	shadowPoints = createShadows(transformedPlayerPoints, centerPoint, 0);

	var shadowColor = vec4(0, 0, 0, 0.7);

	// Load shadow points into buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, shadowBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(shadowPoints), gl.STATIC_DRAW);

	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	gl.uniform4fv(currentColourLoc, shadowColor);

	// Note that we completely ignore transformations because shadows
	// are based off the player's final (transformed) vertices
	// Actually, translate it so it's clearly under the player
	var eye = translate( 0, 0, -0.1);	//mat4();
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
