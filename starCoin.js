// Star Coin

var coinAngle = 0;

var frontCoinPoints = [];
var backCoinPoints = [];
var sideCoinPoints = [];

var coinFrontNormals = [];
var coinBackNormals = [];
var coinSideNormals = [];

var frontCoinBuffer;  // 10 triangles
var backCoinBuffer;   // 10 triangles
var sideCoinBuffer;  // 20 triangles

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
  vec4(   0.35156,  0.35156, -0.1, 1.0 )   // 17 Upper Right
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

var sideCoinVertexOrder =
[
  10, 11, 2,
  10, 2, 1,

  11, 12, 3,
  11, 3, 2,

  12, 13, 4,
  12, 4, 3,

  13, 14, 5,
  13, 5, 4,

  14, 15, 6,
  14, 6, 5,

  15, 16, 7,
  15, 7, 6,

  16, 17, 8,
  16, 8, 7,

  17, 10, 1,
  17, 1, 8
];

function generateCoinNormals(a, b, c, face)
{
  var t1 = subtract(starCoinVertices[b], starCoinVertices[a]);
  var t2 = subtract(starCoinVertices[c], starCoinVertices[b]);
  var normal = cross(t1, t2);

  // Front
  if( face == 0 )
  {
    coinFrontNormals.push(normal);
    coinFrontNormals.push(normal);
    coinFrontNormals.push(normal);
  }
  // Back
  else if( face == 1 )
  {
    coinBackNormals.push(normal);
    coinBackNormals.push(normal);
    coinBackNormals.push(normal);
  }
  // Side
  else
  {
    coinSideNormals.push(normal);
    coinSideNormals.push(normal);
    coinSideNormals.push(normal);
  }
}

function generateCoinStar()
{
  for( var i = 0; i < 24; i++ )
  {
    frontCoinPoints.push( starCoinVertices[ frontCoinVertexOrder[i] ]);
    backCoinPoints.push( starCoinVertices[ backCoinVertexOrder[i] ]);
    coinCoords.push( coinTCoords[ frontCoinVertexOrder[i] ]);
    if( i % 3 == 0 )
    {
      generateCoinNormals(frontCoinVertexOrder[i], frontCoinVertexOrder[i+1], frontCoinVertexOrder[i+2], 0);
      generateCoinNormals(backCoinVertexOrder[i], backCoinVertexOrder[i+1], backCoinVertexOrder[i+2], 1);
    }
  }

  for( var it = 0; it < 48; it++ )
  {
    sideCoinPoints.push( starCoinVertices[ sideCoinVertexOrder[it] ]);

    if( it % 3 == 0 )
    {
      generateCoinNormals(sideCoinVertexOrder[it], sideCoinVertexOrder[it+1], sideCoinVertexOrder[it+2], 2);
    }
  }

  frontCoinBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, frontCoinBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(frontCoinPoints), gl.STATIC_DRAW );

  gl.enableVertexAttribArray( vPosition );

  backCoinBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, backCoinBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(backCoinPoints), gl.STATIC_DRAW );

  gl.enableVertexAttribArray( vPosition );

  sideCoinBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, sideCoinBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(sideCoinPoints), gl.STATIC_DRAW );

  gl.enableVertexAttribArray( vPosition );
}

function drawCoinFront()
{
  // Enable normals for lighting
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(coinFrontNormals), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal );

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, frontCoinBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to yellow
  gl.uniform4fv( currentColourLoc, colors[12] );

  gl.drawArrays( gl.TRIANGLES, 0, 24 );
}

function drawCoinBack()
{
  // Enable normals for lighting
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(coinBackNormals), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal );

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, backCoinBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to yellow
  gl.uniform4fv( currentColourLoc, colors[12] );

  gl.drawArrays( gl.TRIANGLES, 0, 24 );
}

function drawCoinSide()
{
  // Disable texturing
  gl.disableVertexAttribArray( texCoordLoc );

  // Enable normals for lighting
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(coinSideNormals), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal );

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, sideCoinBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to yellow
  gl.uniform4fv( currentColourLoc, colors[12] );

  gl.drawArrays( gl.TRIANGLES, 0, 48 );
}

function drawCoinStar()
{
  if( !isPaused )
  {
    // Increment rotation of star
    coinAngle += 1;//0.2;
    // Keep angle from growing forever
    coinAngle = coinAngle % 360;
  }

  modelTransformMatrix = mult( modelTransformMatrix, scalem( 1.5, 1.5, 1.5 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 0.5, 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( coinAngle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawCoinSide();

  // applyCoinTexture();
  // TODO TEXTURE
  applyTexture(coinCoords);

  drawCoinFront();
  drawCoinBack();

  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}
