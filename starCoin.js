// Star Coin

var coinTexCoordBuffer;
var coinTexCoords = [];   // TODO
var coinTexture;

function generateStarCoin()
{
  var starEyeVertices =
  [
    vec4( -0.3,  0.3, 0, 1.0 ), // 1
    vec4( -0.3, -0.3, 0, 1.0 ), // 0
    vec4(  0.3, -0.3, 0, 1.0 ), // 3
    vec4( -0.3,  0.3, 0, 1.0 ), // 1
    vec4(  0.3, -0.3, 0, 1.0 ), // 3
    vec4(  0.3,  0.3, 0, 1.0 )  // 2

  ];

  for (var i = 0; i < 6; i++)
  {
      starEyesPoints.push(starEyeVertices[i]);
  }

  starEyesBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, starEyesBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(starEyesPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
}

function drawStarCoin()
{
  // Buffer and attributes for the path points
  gl.bindBuffer( gl.ARRAY_BUFFER, starEyesBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(starEyesPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Reset the model transform matrix so the path is drawn at the origin
  modelTransformMatrix = translate( star_x, star_y, star_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( angle ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0, 0.3 ));
  gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0, -0.6 ));
  gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

  // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}

function createCoinTexture()
{
  // Create a texture
  coinTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, coinTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/marioStarCoin.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, coinTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });

  // Create a buffer for texcoords
  coinTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coinTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( coinTexCoords ), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texcoordLoc);
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
}

function applyCoinTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, coinTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(coinTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texcoordLoc);
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, coinTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}
