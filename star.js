// Star

var angle = 0;

var frontPoints = [];
var backPoints = [];
var sidePoints = [];

var starFrontNormals = [];
var starBackNormals = [];
var starSideNormals = [];

var frontBuffer;  // 10 triangles
var backBuffer;   // 10 triangles
var sideBuffer;  // 20 triangles

var star_x = 6;
var star_y = 8;
var star_z = 30;

var starVertices =
[
  // Front

  // Points
  vec4(  0.0,     0.9141, 0.15, 1.0 ),   // 0 Top Point
  vec4( -1.0,     0.1875, 0.15, 1.0 ),   // 1 Upper Left
  vec4( -.6094,  -1.0,    0.15, 1.0 ),   // 2 Lower Left
  vec4(  0.6094, -1.0,    0.15, 1.0 ),   // 3 Lower Right
  vec4(  1.0,     0.1875, 0.15, 1.0 ),   // 4 Upper Right

  // Pentagon
  vec4( -0.3281,   0.3281, 0.15, 1.0 ),  // 5 Upper Left
  vec4( -0.53125, -0.3125, 0.15, 1.0 ),  // 6 Lower Left
  vec4(  0.0,     -0.6953, 0.15, 1.0 ),  // 7 Bottom Point
  vec4(  0.53125, -0.3125, 0.15, 1.0 ),  // 8 Lower Right
  vec4(  0.3281,   0.3281, 0.15, 1.0 ),  // 9 Upper Right

  // Back

  // Points
  vec4(  0.0,     0.9141, -0.15, 1.0 ),   // 10 Top Point
  vec4( -1.0,     0.1875, -0.15, 1.0 ),   // 11 Upper Left
  vec4( -.6094,  -1.0,    -0.15, 1.0 ),   // 12 Lower Left
  vec4(  0.6094, -1.0,    -0.15, 1.0 ),   // 13 Lower Right
  vec4(  1.0,     0.1875, -0.15, 1.0 ),   // 14 Upper Right

  // Pentagon
  vec4( -0.3281,   0.3281, -0.15, 1.0 ),  // 15 Upper Left
  vec4( -0.53125, -0.3125, -0.15, 1.0 ),  // 16 Lower Left
  vec4(  0.0,     -0.6953, -0.15, 1.0 ),  // 17 Bottom Point
  vec4(  0.53125, -0.3125, -0.15, 1.0 ),  // 18 Lower Right
  vec4(  0.3281,   0.3281, -0.15, 1.0 )   // 19 Upper Right
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
  5, 6, 7,
  5, 7, 9,
  9, 7, 8
];

var backVertexOrder =
[
  // Points
  10, 15, 19,
  11, 16, 15,
  12, 17, 16,
  13, 18, 17,
  14, 19, 18,

  // Pentagon
  15, 16, 17,
  15, 17, 19,
  19, 17, 18
];

var sideVertexOrder =
[
  10, 15, 5,
  10, 5, 0,

  15, 11, 1,
  15, 1, 5,

  11, 16, 6,
  11, 6, 1,

  16, 12, 2,
  16, 2, 6,

  12, 17, 7,
  12, 7, 2,

  17, 13, 3,
  17, 3, 7,

  13, 18, 8,
  13, 8, 3,

  18, 14, 4,
  18, 4, 8,

  14, 19, 9,
  14, 9, 4,

  19, 10, 0,
  19, 0, 9
];

function generateStarNormals(a, b, c, face)
{
  var t1 = subtract(starVertices[b], starVertices[a]);
  var t2 = subtract(starVertices[c], starVertices[b]);
  var normal = cross(t1, t2);

  // Front
  if( face == 0 )
  {
    starFrontNormals.push(normal);
    starFrontNormals.push(normal);
    starFrontNormals.push(normal);
  }
  // Back
  else if( face == 1 )
  {
    starBackNormals.push(normal);
    starBackNormals.push(normal);
    starBackNormals.push(normal);
  }
  // Side
  else
  {
    starSideNormals.push(normal);
    starSideNormals.push(normal);
    starSideNormals.push(normal);
  }
}

function generateStar()
{
  for( var i = 0; i < 24; i++ )
  {
    frontPoints.push( starVertices[ frontVertexOrder[i] ]);
    backPoints.push( starVertices[ backVertexOrder[i] ]);
    starTexCoords.push( starTCoords[ frontVertexOrder[i] ]);
    if( i % 3 == 0 )
    {
      generateStarNormals(frontVertexOrder[i], frontVertexOrder[i+1], frontVertexOrder[i+2], 0);
      generateStarNormals(backVertexOrder[i], backVertexOrder[i+1], backVertexOrder[i+2], 1);
    }
  }

  for( var it = 0; it < 60; it++ )
  {
    sidePoints.push( starVertices[ sideVertexOrder[it] ]);

    if( it % 3 == 0 )
    {
      generateStarNormals(sideVertexOrder[it], sideVertexOrder[it+1], sideVertexOrder[it+2], 2);
    }
  }

  frontBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, frontBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(frontPoints), gl.STATIC_DRAW );

  gl.enableVertexAttribArray( vPosition );

  backBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, backBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(backPoints), gl.STATIC_DRAW );

  gl.enableVertexAttribArray( vPosition );

  sideBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, sideBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(sidePoints), gl.STATIC_DRAW );

  gl.enableVertexAttribArray( vPosition );
}

function drawFront()
{
  // Enable normals for lighting
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(starFrontNormals), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal );

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

  gl.drawArrays( gl.TRIANGLES, 0, 24 );
}

function drawBack()
{
  // Enable normals for lighting
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(starBackNormals), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal );

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

  gl.drawArrays( gl.TRIANGLES, 0, 24 );
}

function drawSide()
{
  // Disable texturing
  gl.disableVertexAttribArray( texCoordLoc );

  // Enable normals for lighting
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(starSideNormals), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal );

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, sideBuffer );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color for the cube to yellow
  gl.uniform4fv( currentColourLoc, colors[6] );

  // Set up star transformations
  modelTransformMatrix = translate( star_x, star_y, star_z );
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( angle ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.TRIANGLES, 0, 60 );
}

function drawStar()
{

  if( !isPaused )
  {
    // Increment rotation of star
    angle += 0.5;//0.2;
    // Keep angle from growing forever
    angle = angle % 360;
  }

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  drawSide();

  applyStarTexture();

  drawFront();
  drawBack();

  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);

  // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

}

var starTCoords =
[
  // Front

  // Points
  vec2(  0.5,    0.957 ),      // 0 Top Middle
  vec2(  0.0,    0.59375 ),    // 1 Upper Left
  vec2(  0.1953, 0.0 ),        // 2 Lower Left
  vec2(  0.8047, 0.0 ),        // 3 Lower Right
  vec2(  1.0,    0.59375 ),    // 4 Upper Right

  // Pentagon
  vec2(  0.3359, 0.6641 ),     // 5 Upper Left
  vec2(  0.2344, 0.34375 ),    // 6 Lower Left
  vec2(  0.5,    0.15234 ),    // 7 Bottom Middle
  vec2(  0.7656, 0.34375 ),    // 8 Lower Right
  vec2(  0.6641, 0.6641 )      // 9 Upper Right
];

var starTexCoordBuffer;
var starTexCoords = [];
var starTexture;

function createStarTexture()
{
  // Create a texture
  starTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, starTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/marioStarTexture.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, starTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  starTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, starTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( starTexCoords ), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);

}

function applyStarTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, starTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(starTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, starTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);

}
