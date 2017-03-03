// Tweaks

var playerBuffer;
var playerOutlineBuffer;

var playerPoints = [];
var playerOutline = [];
var numPlayerVertices = 12;

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
}

function drawPlayer()
{
    // Bind the current buffer that we want to draw (the one with the points)
    playerBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, playerBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(playerPoints), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    // Change the colour for the cube (want to index between 0 and 3)
    gl.uniform4fv(currentColourLoc, colors[3]);

    modelTransformMatrix = translate(0, 0, cameraPositionZAxis - 10);
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
  // Bind the current buffer that we want to draw (the one with the points)
    playerOutlineBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, playerOutlineBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(playerOutline), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    // Change the colour for the cube (want to index between 0 and 3)

    gl.uniform4fv(currentColourLoc, colors[5]);

    modelTransformMatrix = translate(0, 0, cameraPositionZAxis - 10);
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

     // reset the projection matrix for the player so it doesn't move on the screen even if the cubes do
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(playerProjectionMatrix));

    gl.drawArrays( gl.LINES, 0, numPlayerVertices );
}
