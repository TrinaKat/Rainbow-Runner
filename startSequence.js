function triangle(a, b, c) {
	sphereNormals.push(vec4(a[0], a[1], a[2]));
	sphereNormals.push(vec4(b[0], b[1], b[2]));
	sphereNormals.push(vec4(c[0], c[1], c[2]));

	sphereVertices.push(a);
	sphereVertices.push(b);
	sphereVertices.push(c);
}

function divideTriangle(a, b, c, count) {
	if (count > 0) {
		var ab = normalize(mix(a, b, 0.5), true);
		var ac = normalize(mix(a, c, 0.5), true);
		var bc = normalize(mix(b, c, 0.5), true);

		divideTriangle(a, ab, ac, count - 1);
		divideTriangle(ab, b, bc, count - 1);
		divideTriangle(bc, c, ac, count - 1);
		divideTriangle(ab, bc, ac, count - 1);
	}
}

function tetrahedron(a, b, c, d, n) {
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

function generateSphere() {
	// Tetrahedron points for sphere
	var va = vec4(0.0, 0.0, -1.0, 1);
	var vb = vec4(0.0, 0.942809, 0.333333, 1);
	var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
	var vd = vec4(0.816497, -0.471405, 0.333333, 1);
	tetrahedron(va, vb, vc, vd);
}

function startSequence() {
	// remove the game over screen
	if (isGameOver)
		removeScreen(endScreen);
    // delete all the cubes so we can generate new ones
    allCubeLineXPositions = [];
    allCubeLineZPositions = [];
    allCubeColours = [];
    // reset game play properties
    isPaused = false;
    isExploded = 0;
    hasHitBorder = 0;
    isGameOver = false;
    score = 0;
    // reset player properties
    playerXPos = 0;
    playerTilt = 0;  // no tilt by default
    currAmountTranslated = 0;
    amountToMove = 0;
    // reset the transformation matrices 
    cameraTransformMatrix = pathCameraTransformMatrix;
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
    projectionMatrix = playerProjectionMatrix;
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
}