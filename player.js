// Tweaks
var playerBuffer;
var playerOutlineBuffer;

var playerPoints = [];
var playerOutline = [];
var numPlayerVertices = 12;

// save player's position
var playerXPos = 0;  // the position of the center of the player along the x-axis
var playerTipZPos;  // the position of the base edge of the player along the z-axis
var playerEdgeSlope = (1)/0.5;  // based on the player vertices below (for the side edges)

var playerVertices =
  [
    vec4( -0.5, 0.5, 1.0, 1.0 ),  // 0 Near left
    vec4(  0.5, 0.5, 1.0, 1.0 ),  // 1 Near right
    vec4(  0.0, 0.7, 0.0, 1.0 ),  // 2 Far point
    vec4(  0.0, 0.8, 0.9, 1.0 )   // 3 Center
  ];

function generatePlayer()
{
  // Generate player body
  var vertexOrder = [ 0, 1, 2, 0, 3, 2, 2, 3, 1, 0, 1, 3 ];

  for (var i = 0; i < 12; i++)
  {
      playerPoints.push(playerVertices[vertexOrder[i]]);
  }

  // Generate player outline
  var outlineOrder = [ 0, 1, 1, 2, 2, 0, 0, 3, 1, 3, 2, 3 ];
  for (var i = 0; i < 12; i++)
  {
      playerOutline.push(playerVertices[outlineOrder[i]]);
  }

  // Player
  playerBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, playerBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(playerPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Player Outline
  playerOutlineBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, playerOutlineBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(playerOutline), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

}

function drawPlayer()
{
    // Disable the texture before we draw something else later
    enableTexture = false;
    gl.uniform1f(enableTextureLoc, enableTexture);
  
    // Bind the current buffer to draw
    gl.bindBuffer( gl.ARRAY_BUFFER, playerBuffer );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // get the player's base edge's position in the z-axis (need to add one since located at z = +1 from the origin)
    playerTipZPos = cameraPositionZAxis - 10;

    // Change the colour for the cube (want to index between 0 and 3)
    gl.uniform4fv(currentColourLoc, colors[3]);

    modelTransformMatrix = translate(0, 0, playerTipZPos);

    // tilt the player if needed
    if (playerTilt == -1) {
      modelTransformMatrix = mult(modelTransformMatrix, rotate(amountToTilt, vec3(0, 0, 1)));
    }
    else if (playerTilt == 1) {
      modelTransformMatrix = mult(modelTransformMatrix, rotate(-1 * amountToTilt, vec3(0, 0, 1)));
    }

    var transformedPlayerPoints = [];
    for (var i = 0; i < playerPoints.length; i++) {
      transformedPlayerPoints.push(mult(modelTransformMatrix, playerPoints[i]));
    }

    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

    // reset the camera and projection matrix for the player so it doesn't move on the screen even if the cubes do
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(playerProjectionMatrix));
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, numPlayerVertices );

    drawPlayerOutline();
    drawPlayerShadows(transformedPlayerPoints);

    // reset the camera and projection matrix for the player so it doesn't move on the screen even if the cubes do
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}

function drawPlayerOutline()
{
  // Bind the current buffer that we want to draw (the one with the points)
  gl.bindBuffer( gl.ARRAY_BUFFER, playerOutlineBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the colour for the cube (want to index between 0 and 3)
  gl.uniform4fv(currentColourLoc, colors[5]);

  modelTransformMatrix = translate(0, 0, cameraPositionZAxis - 10);

  // tilt the player if needed
  if (playerTilt == -1) {
    modelTransformMatrix = mult(modelTransformMatrix, rotate(amountToTilt, vec3(0, 0, 1)));
  }
  else if (playerTilt == 1) {
    modelTransformMatrix = mult(modelTransformMatrix, rotate(-1 * amountToTilt, vec3(0, 0, 1)));
  }

  gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

   // reset the projection matrix for the player so it doesn't move on the screen even if the cubes do
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(playerProjectionMatrix));
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  gl.drawArrays( gl.LINES, 0, numPlayerVertices );

  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}

// check if the two lines intersect
function checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, secondLineIsHorizontal, secondLineValue, leftCubeXPosition, backCubeZPosition) {
  var playerRightXPos = playerLeftXPos + 1;
  var rightCubeXPosition = leftCubeXPosition + 1;
  var frontCubeZPosition = backCubeZPosition + 1;

  console.log("player left x pos: " + playerLeftXPos);

  // the two intercepts for the left edge equation and the right edge equation
  var bLeft = playerBaseZPos - playerEdgeSlope * playerLeftXPos;
  var bRight = playerBaseZPos - (-1 * playerEdgeSlope) * playerRightXPos;

  // console.log("bLeft: " + bLeft);
  // console.log("bRight: " + bRight);

  // checking either the front face or the back face of the cube
  if (secondLineIsHorizontal) {
      // check and see for which x-value the player edge equations intersect the cube lines
      // z = mx + b so set the z values equal, and solve using x = (z-b)/m
      // check intersection with the left edge of the player
      var x1 = (secondLineValue - bLeft)/playerEdgeSlope;
      // check intersection with the right edge of the player
      var x2 = (secondLineValue - bRight)/(-1 * playerEdgeSlope);

      // console.log("x1: " + x1);
      // console.log("x2: " + x2);

      if ((x1 >= leftCubeXPosition && x1 <= rightCubeXPosition) || (x2 >= leftCubeXPosition && x2 <= rightCubeXPosition)) {
        return 1;
      }
  }
  // checking either the left or right side of the cube
  else {
      // check and see for which z-value the player edge equations intersect the cube lines
      // z = mx + b so just plug in the values and find what z is
      var z1 = playerEdgeSlope * secondLineValue + bLeft;
      var z2 = -1 * playerEdgeSlope * secondLineValue + bRight;
      if ((z1 >= backCubeZPosition && z1 <= frontCubeZPosition) || (z2 >= backCubeZPosition && z2 <= frontCubeZPosition)) {
        return 1;
    }
  }
  return 0;
}

// check if the player has collided into any cubes
function playerCollisionDetection() {
  // we only need to check the two front forward edges of the player since it is a triangular shape and it will only ever being moving forward, and we only care about the (x,z) coordinates of the player
  // the player's original coordinates: near left point = (-0.5, 1.0), near right point = (0.5, 1.0), tip = (0, 0.0)
  // get the player's new x-coordinates
  var playerLeftXPos = playerXPos - 0.5;
  var playerRightXPos = playerXPos + 0.5;
  var playerBaseZPos = playerTipZPos + 1;

  // check if the player has hit the borders
  if (playerLeftXPos <= -1* pathWidth || playerRightXPos >= pathWidth) {
      console.log("border collision");
      isExploded = 1;
  }

  // need to check all of the cubes that are now in the same z position range as the player and check if they overlap with the player
  for (var i = 0; i < allCubeLineZPositions.length; i++) {
    // the cube is in the z position range of the player
    // allCubeLineZPositions[i] is the z-value of the back face of the cube, and allCubeLineZPositions[i] + 1 is the z-value of the front face of the cube
    if (allCubeLineZPositions[i] < playerBaseZPos && (allCubeLineZPositions[i] + 1) > playerTipZPos) {
      // get all the x positions of the cubes in this cube line
      var allXPositions = allCubeLineXPositions[i];

      // check if the x position is in between the front side edges of the player given the exact z-value (use the slope and some math)
      for (var j = 0; j < allXPositions.length; j++) {
        // the left x-position of the cube is allXPositions[j] and the right x-position of the cube is allXPositions[j] + 1
        // check if any of the sides of the square (the top/bottom face of the cube) intersect with the front two edges of the player

        // the cube is out of range for x values, so ignore it
        if (allXPositions[j] + 1 < playerLeftXPos || allXPositions[j] > playerRightXPos)
          continue;

        // check if any of the faces intersect
        if (checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, 1, allCubeLineZPositions[i] + 1, allXPositions[j], allCubeLineZPositions[i]) || 
          checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, 1, allCubeLineZPositions[i], allXPositions[j], allCubeLineZPositions[i]) ||
          checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, 0, allXPositions[j], allXPositions[j], allCubeLineZPositions[i]) ||
          checkLinesIntersect(playerBaseZPos, playerLeftXPos, playerEdgeSlope, 0, allXPositions[j] + 1, allXPositions[j], allCubeLineZPositions[i])) {
          console.log("collision");
          isExploded = 1;
          // make the cube disappear since we have collided with it
          allCubeLineXPositions[i].splice(j, 1);
          // check to see if you collided with an question mark cube
          if (allCubeColours[i][j] == marioQuestionCubeColourIndex) {
            isInvincible = 1;
            invincibilityTimer = maxInvincibleTime;
          }
        }
      }
    }
  }
}
