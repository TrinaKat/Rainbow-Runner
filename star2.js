// Star

var angle = 0;

var frontPoints = [];
var backPoints = [];
var sidePoints1 = [];
var sidePoints2 = [];

var frontBuffer;  // 10 triangles
var backBuffer;   // 10 triangles
var sideBuffer1;  // 20 triangles
var sideBuffer2;

var star_x = 6;
var star_y = 8;
var star_z = 30;

var starVertices =
[
  // Front

  // Points
  vec4(  0.0,    1.0,    0.15, 1.0 ),  // 0 Top Point
  vec4( -1.0,    0.2734, 0.15, 1.0 ),  // 1 Upper Left
  vec4( -0.625, -0.8984, 0.15, 1.0 ),  // 2 Lower Left
  vec4(  0.625, -0.8984, 0.15, 1.0 ),  // 3 Lower Right
  vec4(  1.0,    0.2734, 0.15, 1.0 ),  // 4 Upper Right

  // Pentagon
  vec4( -0.3359,  0.4062, 0.15, 1.0 ),  // 5 Upper Left
  vec4( -0.5469, -0.2187, 0.15, 1.0 ),  // 6 Lower Left
  vec4(  0.0,    -0.6094, 0.15, 1.0 ),  // 7 Bottom Point
  vec4(  0.5469, -0.2187, 0.15, 1.0 ),  // 8 Lower Right
  vec4(  0.3359,  0.4062, 0.15, 1.0 ),  // 9 Upper Right

  // Adds 3D
  vec4( 0.0, 0.0, 0.35, 1.0 ),  // 10 Center Point Forwards

  // Back

  // Points
  vec4(  0.0,    1.0,    -0.15, 1.0 ),  // 11 Top Point
  vec4( -1.0,    0.2734, -0.15, 1.0 ),  // 12 Upper Left
  vec4( -0.625, -0.8984, -0.15, 1.0 ),  // 13 Lower Left
  vec4(  0.625, -0.8984, -0.15, 1.0 ),  // 14 Lower Right
  vec4(  1.0,    0.2734, -0.15, 1.0 ),  // 15 Upper Right

  // Pentagon
  vec4( -0.3359,  0.4062, -0.15, 1.0 ),  // 16 Upper Left
  vec4( -0.5469, -0.2187, -0.15, 1.0 ),  // 17 Lower Left
  vec4(  0.0,    -0.6094, -0.15, 1.0 ),  // 18 Bottom Point
  vec4(  0.5469, -0.2187, -0.15, 1.0 ),  // 19 Lower Right
  vec4(  0.3359,  0.4062, -0.15, 1.0 ),  // 20 Upper Right

  // Adds 3D
  vec4( 0.0, 0.0, -0.35, 1.0 )   // 21 Center Point Backwards
];

var frontVertexOrder =
[
  // Points
  0, 5, 9,
  1, 6, 5,
  2, 7, 6,
  3, 8, 7,
  4, 9, 8,

  // Pentagon
  5, 10, 9,
  6, 10, 5,
  7, 10, 6,
  8, 10, 7,
  9, 10, 8
];

var backVertexOrder =
[
  // Points
  11, 16, 20,
  12, 17, 16,
  13, 18, 17,
  14, 19, 18,
  15, 20, 19,

  // Pentagon
  16, 21, 20,
  17, 21, 16,
  18, 21, 17,
  19, 21, 18,
  20, 21, 19
];

var sideVertexOrder1 =
[
  11, 16, 5,
  11, 5, 0,

  16, 12, 1,
  16, 1, 5,

  12, 17, 6,
  12, 6, 1,

  17, 13, 2,
  17, 2, 6,

  13, 18, 7,
  13, 7, 2
];

var sideVertexOrder2 =
[
  18, 14, 3,
  18, 3, 7,

  14, 19, 8,
  14, 8, 3,

  19, 15, 4,
  19, 4, 8,

  15, 20, 9,
  15, 9, 4,

  20, 11, 0,
  20, 0, 9
];

function generateStar()
{
  for( var i = 0; i < 30; i++ )
  {
    frontPoints.push( starVertices[ frontVertexOrder[i] ]);
    backPoints.push( starVertices[ backVertexOrder[i] ]);
    sidePoints1.push( starVertices[ sideVertexOrder1[i] ]);
    sidePoints2.push( starVertices[ sideVertexOrder2[i] ]);
  }

  frontBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, frontBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(frontPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  backBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, backBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(backPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  sideBuffer1 = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, sideBuffer1 );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(sidePoints1), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  sideBuffer2 = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, sideBuffer2 );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(sidePoints2), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
}

function drawFront()
{
  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, frontBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color for the cube to yellow
  gl.uniform4fv( currentColourLoc, colors[6] );

  // Set up star transformations
  modelTransformMatrix = translate( star_x, star_y, star_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( angle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 30 );
}

function drawBack()
{
  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, backBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color for the cube to yellow
  gl.uniform4fv( currentColourLoc, colors[6] );

  // Set up star transformations
  modelTransformMatrix = translate( star_x, star_y, star_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( angle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 30 );
}

function drawSide()
{
  // Side 1

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, sideBuffer1 );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color for the cube to yellow
  gl.uniform4fv( currentColourLoc, colors[6] );

  // Set up star transformations
  modelTransformMatrix = translate( star_x, star_y, star_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( angle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 30 );

  // Side 2

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, sideBuffer2 );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color for the cube to yellow
  gl.uniform4fv( currentColourLoc, colors[6] );

  // Set up star transformations
  modelTransformMatrix = translate( star_x, star_y, star_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( angle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 30 );
}

function drawStar()
{
  // Increment rotation of star
  angle += 0.5;//0.2;
  // Keep angle from growing forever
  angle = angle % 360;

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  drawFront();
  drawBack();
  drawSide();

  // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}

// TODO FIX THIS

var numStarVertices = 120;  // 40 triangles
var starPoints = [];
var starBuffer;

var starVertexOrder =
[
  // Front Face

  // Points
  0, 5, 9,
  1, 6, 5,
  2, 7, 6,
  3, 8, 7,
  4, 9, 8,

  // Pentagon
  5, 10, 9,
  6, 10, 5,
  7, 10, 6,
  8, 10, 7,
  9, 10, 8,

  // Back Face

  // Points
  11, 16, 20,
  12, 17, 16,
  13, 18, 17,
  14, 19, 18,
  15, 20, 19,

  // Pentagon
  16, 21, 20,
  17, 21, 16,
  18, 21, 17,
  19, 21, 18,
  20, 21, 19,

  // Side Rectangles
  11, 16, 5,
  11, 5, 0,

  16, 12, 1,
  16, 1, 5,

  12, 17, 6,
  12, 6, 1,

  17, 13, 2,
  17, 2, 6,

  13, 18, 7,
  13, 7, 2,

  18, 14, 3,
  18, 3, 7,

  14, 19, 8,
  14, 8, 3,

  19, 15, 4,
  19, 4, 8,

  15, 20, 9,
  15, 9, 4,

  20, 11, 0,
  20, 0, 9

];

function generateStar2()
{
  for ( var i = 0; i < 120; i++ )
  {
    starPoints.push( starVertices[ starVertexOrder[i] ]);
  }

  // Star
  starBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, starBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(starPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // TODO Outlines?

}

function drawStar2()
{
  // Increment rotation of star
  angle += 0.5//0.2;
  // Keep angle from growing forever
  angle = angle % 360;

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, starBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color for the cube to yellow
  gl.uniform4fv( currentColourLoc, colors[6] );

  // Set up star transformations
  modelTransformMatrix = translate( star_x, star_y, star_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( angle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, numStarVertices );
}
