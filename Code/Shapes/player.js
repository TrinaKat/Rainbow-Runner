// Tweaks
var playerBuffer;
var playerOutlineBuffer;

var playerPoints = [];
var playerOutline = [];
var numPlayerVertices = 12;

var playerNormals = [];

// save player's position
var playerXPos = 0;  // the position of the center of the player along the x-axis
var playerYPos = 0;
var playerTipZPos;  // the position of the base edge of the player along the z-axis
var playerEdgeSlope = (1)/0.5;  // based on the player vertices below (for the side edges)

var playerVertices =
[
  vec4( -0.5, 0.5, 1.0, 1.0 ),  // 0 Near left
  vec4(  0.5, 0.5, 1.0, 1.0 ),  // 1 Near right
  vec4(  0.0, 0.7, 0.0, 1.0 ),  // 2 Far point
  vec4(  0.0, 0.8, 0.9, 1.0 )   // 3 Center
];

class JumpFSM {
  constructor() {
    // Constants
    this.maxJumpHeight = 4;
    this.jumpSpeed = .2;

    this.canHitCubeThreshold = 0.6;

    // State variables
    this.State = {
      UP: 1,
      DOWN: -1,
      NOT_JUMPING: 0
    }
    this.state = this.State.NOT_JUMPING;

    this.curHeight = 0;
  }

  verticalVelocity() {
    return this.jumpSpeed * this.state;
  }

  canHitCube() {
    return this.curHeight <= this.canHitCubeThreshold;
  }

  update(up) {
    switch(this.state) {
      case this.State.NOT_JUMPING:
        if (up) {
          this.state = this.State.UP;
          playSound('jump');
        }
        break;

      case this.State.UP:
        if (this.curHeight <= this.maxJumpHeight) {
          this.curHeight += this.jumpSpeed;
        }
        else {
          this.state = this.State.DOWN;
        }
        break;

      case this.State.DOWN:
        if (this.curHeight > 0) {
          this.curHeight -= this.jumpSpeed;
        }
        else {
          this.state = this.State.NOT_JUMPING;
        }
        break;

      default:
        break;
    }
  }
}

function generatePlayerNormals(a, b, c)
{
  var t1 = subtract(playerVertices[b], playerVertices[a]);
  var t2 = subtract(playerVertices[c], playerVertices[b]);
  var normal = cross(t1, t2);

  playerNormals.push(normal);
  playerNormals.push(normal);
  playerNormals.push(normal);
}

function generatePlayer()
{
  // Generate player body
  var vertexOrder = [ 0, 1, 2, 0, 3, 2, 2, 3, 1, 0, 1, 3 ];

  for (var i = 0; i < 12; i++)
  {
      playerPoints.push(playerVertices[vertexOrder[i]]);
      if( i % 3 == 0 )
      {
        generatePlayerNormals(vertexOrder[i], vertexOrder[i+1], vertexOrder[i+2]);
      }
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

function drawPlayerShadowsWithDepth()
{
    // Disable the texture
    gl.disableVertexAttribArray(texCoordLoc);

    // get the player's base edge's position in the z-axis (need to add one since located at z = +1 from the origin)
    playerTipZPos = cameraPositionZAxis - 10;

    modelTransformMatrix = translate(0, 0, playerTipZPos);

    // tilt the player if needed
    if (playerTilt == -1) {
      modelTransformMatrix = mult(modelTransformMatrix, rotate(amountToTilt, vec3(0, 0, 1)));
    }
    else if (playerTilt == 1) {
      modelTransformMatrix = mult(modelTransformMatrix, rotate(-1 * amountToTilt, vec3(0, 0, 1)));
    }

    var transformedPlayerPoints = [playerVertices[0], playerVertices[1], playerVertices[2]];
    for (var i = 0; i < 3; i++) {
      transformedPlayerPoints[i] = (mult(modelTransformMatrix, transformedPlayerPoints[i]));
      // lol hella jank
      transformedPlayerPoints[i][1] += playerYPos;
    }
    var centerPoint = mult(modelTransformMatrix, playerVertices[3]);

    // Draw shadow first for back to front rendering
    drawPlayerShadows(transformedPlayerPoints, centerPoint);
}

function drawPlayerBody()
{
    // Disable the texture
    gl.disableVertexAttribArray(texCoordLoc);

    enableTexture = false;
    gl.uniform1f(enableTextureLoc, enableTexture);

    // Enable normals for lighting
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(playerNormals), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // Bind the current buffer to draw
    gl.bindBuffer( gl.ARRAY_BUFFER, playerBuffer );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelTransformMatrix = translate(0, 0, playerTipZPos);

    // tilt the player if needed
    if (playerTilt == -1) {
      modelTransformMatrix = mult(modelTransformMatrix, rotate(amountToTilt, vec3(0, 0, 1)));
    }
    else if (playerTilt == 1) {
      modelTransformMatrix = mult(modelTransformMatrix, rotate(-1 * amountToTilt, vec3(0, 0, 1)));
    }

    // change the player's colour if it is invincible
    if (isInvincible && invincibilityTimer > 0 )
    {
      // set the player to red like Mario
      gl.uniform4fv(currentColourLoc, colors[11]);
      if ( invincibilityTimer < 1.5 )
      {
        // flash the colour of the player
        if (invincibleColourFlash)
        {
          gl.uniform4fv(currentColourLoc, colors[0]);
        }
        invincibleColourFlash = !invincibleColourFlash;
      }
    }
    else {
      gl.uniform4fv(currentColourLoc, colors[3]);
    }


    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

    // reset the camera and projection matrix for the player so it doesn't move on the screen even if the cubes do
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(playerProjectionMatrix));
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, numPlayerVertices );

    drawPlayerOutline();

    // reset the camera and projection matrix for the player so it doesn't move on the screen even if the cubes do
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}

function drawPlayerOutline()
{
  // We don't need lighting on the path because it is LIT AF already
  gl.disableVertexAttribArray(vNormal);

  // Disable the texture
  gl.disableVertexAttribArray(texCoordLoc);

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

function drawPlayerLogo()
{
  // We don't need lighting on the path because it is LIT AF already
  gl.disableVertexAttribArray(vNormal);

  var playerLogoPoints = [];
  playerLogoPoints.push(playerVertices[0]);
  playerLogoPoints.push(playerVertices[1]);
  playerLogoPoints.push(playerVertices[3]);

  // Player Triangle
  var playerLogoBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, playerLogoBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(playerLogoPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

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

  applyTexture(marioLogoCoords);

  gl.drawArrays( gl.TRIANGLES, 0, 3 );

  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);

  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

}
