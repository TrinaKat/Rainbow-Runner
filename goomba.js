// GOOMBA

var sphereBuffer;

// Set to wherever you want to translate goomba to
var goomba_x = 0;
var goomba_z = -2;

var stepLeft = true;
var swapFeet = 1;  // Swap every second, based on timeDiff in cubeRunner.js

// variables needed to rotate goomba
var goombaAngle = 0;
var goombaJumpUp = true;  // need to be 0 so the goomba starts with jumping up

// function generateGoombaNormals(a, b, c, part) {}

function drawGoombaBody()
{
  var goombaModelTransformMatrix = modelTransformMatrix;

  // HEAD

  // Set up headTop transformations
  modelTransformMatrix = goombaModelTransformMatrix;
  // modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0.7, 40 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0.7, 0 ));
  modelTransformMatrix = mult(modelTransformMatrix, rotateY( goombaAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.4, 0.4, 0.4 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere(13);

  // Set up headBottom transformations
  modelTransformMatrix = goombaModelTransformMatrix;
  // modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0.45, 40 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0.45, 0 ));
  modelTransformMatrix = mult(modelTransformMatrix, rotateY( goombaAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.55, 0.3, 0.55 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere(13);


  // BODY

  // Set up body transformations
  modelTransformMatrix = goombaModelTransformMatrix;
  // modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0.2, 40 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0.2, 0 ));
  modelTransformMatrix = mult(modelTransformMatrix, rotateY( goombaAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.25, 0.25, 0.25 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere(14);


  // FEET

  // LEFT FOOT
  // Set up feet transformations
  modelTransformMatrix = goombaModelTransformMatrix;
  // modelTransformMatrix = mult( modelTransformMatrix, translate( -0.23, 0, 40.1 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( -0.23, 0, 0.1 ));
  modelTransformMatrix = mult(modelTransformMatrix, rotateY( goombaAngle ));

  if (stepLeft)
  {
    modelTransformMatrix = mult( modelTransformMatrix, rotateZ( 15 ));
  }
  else
  {
    modelTransformMatrix = mult( modelTransformMatrix, rotateZ( -30 ));
  }

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( -50 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.3, 0.15, 0.15 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere(15);


  // RIGHT FOOT
  // Set up feet transformations
  modelTransformMatrix = goombaModelTransformMatrix;
  // modelTransformMatrix = mult( modelTransformMatrix, translate( 0.23, 0, 40.1 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0.23, 0, 0.1 ));
  modelTransformMatrix = mult(modelTransformMatrix, rotateY( goombaAngle ));

  if (!stepLeft)
  {
    modelTransformMatrix = mult( modelTransformMatrix, rotateZ( -15 ));
  }
  else
  {
    modelTransformMatrix = mult( modelTransformMatrix, rotateZ( 30 ));
  }

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( 50 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.3, 0.15, 0.15 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere(15);

  modelTransformMatrix = goombaModelTransformMatrix;
}

var isClockwise = true;
var goombaJumpTime = 0;
var goombaJumpStage = 0;
var goombaJumpHeights = [ 0, 0.01, 0.03, 0.06, 0.08, 0.12 ];

function drawGoomba()
{
  gl.disableVertexAttribArray( texCoordLoc );

  // rotate the goombas and make them jump
  if( !isPaused )
  {
    if( goombaAngle > 45 )
    {
      isClockwise = false;
    }
    else if (goombaAngle < -45 )
    {
      isClockwise = true;
    }

    if( isClockwise )
    {
      goombaAngle += 0.3;
    }
    else
    {
      goombaAngle -= 0.3;
    }

    if( goombaJumpTime >= 0.1 )
    {
      if( goombaJumpUp )
      {
        goombaJumpStage++;
      }
      else
      {
        goombaJumpStage--;
      }
      goombaJumpTime = 0;
    }

    // For some reason it kept going into negatives so I made this more foolproof
    if( goombaJumpStage <= 0 )
    {
      goombaJumpStage = 0;
      goombaJumpUp = true;
    }
    else if( goombaJumpStage >= 5 )
    {
      goombaJumpStage = 5;
      goombaJumpUp = false;
    }
  }

  modelTransformMatrix = mult(modelTransformMatrix, scalem(1.2, 1.2, 1.0));
  modelTransformMatrix = mult(modelTransformMatrix, translate(0.0, 0.3, 0.0));
  modelTransformMatrix = mult(modelTransformMatrix, translate( 0, goombaJumpHeights[goombaJumpStage], 0 ));

  drawGoombaBody();

  // Enable Blending
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.depthMask(false);

  drawGoombaFace();

  gl.depthMask(true);
  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
}



// GOOMBA TEXTURE

var goombaFaceTexture;
var goombaFaceTexBuffer;

function createGoombaFaceTexture()
{
  // Create a texture
  goombaFaceTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, goombaFaceTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/goombaTexture.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, goombaFaceTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  goombaFaceTexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, goombaFaceTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function applyGoombaFaceTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, goombaFaceTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, goombaFaceTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

var goombaFacePoints = [];
var goombaFaceBuffer;

function generateGoombaFaceSquare()
{
    // Store the vertices needed for the square
    var goombaFaceVertices =
    [
        vec4( 0, 0, 0, 1.0 ),
        vec4( 0, 1, 0, 1.0 ),
        vec4( 1, 1, 0, 1.0 ),
        vec4( 1, 0, 0, 1.0 )
    ];

    // The order to draw with the path vertices
    var vertexOrder = [1, 0, 3, 1, 3, 2];

    for (var i = 0; i < 6; i++)
    {
        goombaFacePoints.push(goombaFaceVertices[vertexOrder[i]]);
    }

    goombaFaceBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, goombaFaceBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(goombaFacePoints), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function drawGoombaFace()
{
  // We don't need lighting
  gl.disableVertexAttribArray(vNormal);

  // Buffer and attributes for the path points
  gl.bindBuffer( gl.ARRAY_BUFFER, goombaFaceBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(goombaFacePoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to light gray
  gl.uniform4fv( currentColourLoc, colors[1] );

  // // reset the camera transform matrix as well (was changed to move the cubes and player)
  // gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  // modelTransformMatrix = mult( modelTransformMatrix, translate( -0.45, 0.23, 40 ));

  modelTransformMatrix = mult(modelTransformMatrix, rotateY( goombaAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( -0.45, 0.23, 0.3 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.9, 0.9 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  applyTexture(goombaCoords);


  gl.drawArrays( gl.TRIANGLES, 0, 6 );

  //   // set the camera transform matrix to the actual translated state
  // gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}
