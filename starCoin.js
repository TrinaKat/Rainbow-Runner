// Star Coin

var coinAngle = 0;

var frontCoinPoints = [];
var backCoinPoints = [];
var sideCoinPoints1 = [];
var sideCoinPoints2 = [];

var frontCoinBuffer;  // 10 triangles
var backCoinBuffer;   // 10 triangles
var sideCoinBuffer1;  // 20 triangles
var sideCoinBuffer2;

var coin_x = 0;
var coin_y = 2;
var coin_z = 40;

var starCoinVertices =
[
  // Front

  // Front Center
  vec4( 0.0, 0.0, 0.1, 1.0 ),  // 0 Middle

  // Front Edge Points
  vec4(   0.0,      0.5,     0.1, 1.0 ),  // 1 Upper Middle
  vec4(  -0.35156,  0.35156, 0.1, 1.0 ),  // 2 Upper Left
  vec4(  -0.5,      0.0,     0.1, 1.0 ),  // 3 Middle Left
  vec4(  -0.35156, -0.35156, 0.1, 1.0 ),  // 4 Lower Left
  vec4(   0.0,     -0.5,     0.1, 1.0 ),  // 5 Lower Middle
  vec4(   0.35156, -0.35156, 0.1, 1.0 ),  // 6 Lower Right
  vec4(   0.5,      0.0,     0.1, 1.0 ),  // 7 Middle Right
  vec4(   0.35156,  0.35156, 0.1, 1.0 ),  // 8 Upper Right

  // Back

  // Back Center
  vec4( 0.0, 0.0, -0.1, 1.0 ),  // 9 Middle

  // Back Edge Points
  vec4(   0.0,      0.5,     -0.1, 1.0 ),  // 10 Upper Middle
  vec4(  -0.35156,  0.35156, -0.1, 1.0 ),  // 11 Upper Left
  vec4(  -0.5,      0.0,     -0.1, 1.0 ),  // 12 Middle Left
  vec4(  -0.35156, -0.35156, -0.1, 1.0 ),  // 13 Lower Left
  vec4(   0.0,     -0.5,     -0.1, 1.0 ),  // 14 Lower Middle
  vec4(   0.35156, -0.35156, -0.1, 1.0 ),  // 15 Lower Right
  vec4(   0.5,      0.0,     -0.1, 1.0 ),  // 16 Middle Right
  vec4(   0.35156,  0.35156, -0.1, 1.0 ),  // 17 Upper Right
];

var frontCoinVertexOrder =
[
  1, 0, 8,
  2, 0, 1,
  3, 0, 2,
  4, 0, 3,
  5, 0, 4,
  6, 0, 5,
  7, 0, 6,
  8, 0, 7
];

var backCoinVertexOrder =
[
  10, 9, 17,
  11, 9, 10,
  12, 9, 11,
  13, 9, 12,
  14, 9, 13,
  15, 9, 14,
  16, 9, 15,
  17, 9, 16
];

var sideCoinVertexOrder1 =
[
  10, 11, 2,
  10, 2, 1,

  11, 12, 3,
  11, 3, 2,

  12, 13, 4,
  12, 4, 3,

  13, 14, 5,
  13, 5, 4
];

var sideCoinVertexOrder2 =
[
  14, 15, 6,
  14, 6, 5,

  15, 16, 7,
  15, 7, 6,

  16, 17, 8,
  16, 8, 7,

  17, 10, 1,
  17, 1, 8
];

function generateCoinStar()
{
  for( var i = 0; i < 24; i++ )
  {
    frontCoinPoints.push( starCoinVertices[ frontCoinVertexOrder[i] ]);
    backCoinPoints.push( starCoinVertices[ backCoinVertexOrder[i] ]);
    sideCoinPoints1.push( starCoinVertices[ sideCoinVertexOrder1[i] ]);
    sideCoinPoints2.push( starCoinVertices[ sideCoinVertexOrder2[i] ]);
    coinTexCoords.push( coinTCoords[ frontCoinVertexOrder[i] ]);
  }

  frontCoinBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, frontCoinBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(frontCoinPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  backCoinBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, backCoinBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(backCoinPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  sideCoinBuffer1 = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, sideCoinBuffer1 );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(sideCoinPoints1), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  sideCoinBuffer2 = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, sideCoinBuffer2 );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(sideCoinPoints2), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
}

function drawCoinFront()
{
  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, frontCoinBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to yellow
  gl.uniform4fv( currentColourLoc, colors[12] );

  // Set up star coin transformations
  modelTransformMatrix = translate( coin_x, coin_y, coin_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( coinAngle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 24 );
}

function drawCoinBack()
{
  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, backCoinBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to yellow
  gl.uniform4fv( currentColourLoc, colors[12] );

  // Set up star coin transformations
  modelTransformMatrix = translate( coin_x, coin_y, coin_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( coinAngle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 24 );
}

function drawCoinSide()
{
  // Side 1

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, sideCoinBuffer1 );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to yellow
  gl.uniform4fv( currentColourLoc, colors[12] );

  // Set up star coin transformations
  modelTransformMatrix = translate( coin_x, coin_y, coin_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( coinAngle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 24 );

  // Side 2

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, sideCoinBuffer2 );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to yellow
  gl.uniform4fv( currentColourLoc, colors[12] );

  // Set up star coin transformations
  modelTransformMatrix = translate( coin_x, coin_y, coin_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( coinAngle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 24 );
}

function drawCoinStar()
{
  if( !isPaused )
  {
    // Increment rotation of star
    coinAngle += 0.5;//0.2;
    // Keep angle from growing forever
    coinAngle = coinAngle % 360;
  }

  applyCoinTexture();

  drawCoinFront();
  drawCoinBack();

  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);

  drawCoinSide();
}







var coinTCoords =
[
  // Front

  // Front Center
  vec2( 0.5, 0.5 ),  // 0 Middle

  // Front Edge Points
  vec2(  0.5,     1.0 ),      // 1 Upper Middle
  vec2(  0.14843, 0.85156 ),  // 2 Upper Left
  vec2(  0.0,     0.5 ),      // 3 Middle Left
  vec2(  0.14843, 0.14843 ),  // 4 Lower Left
  vec2(  0.5,     0.0 ),      // 5 Lower Middle
  vec2(  0.85156, 0.14843 ),  // 6 Lower Right
  vec2(  1.0,     0.5 ),      // 7 Middle Right
  vec2(  0.85156, 0.85156 )   // 8 Upper Right
];

var coinTexCoordBuffer;
var coinTexCoords = [];   // TODO
var coinTexture;

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
