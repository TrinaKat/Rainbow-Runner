// Texture

/*********************/
//   CREATE TEXTURE  //
/*********************/
var textures;
var texCoordBuffer;
var texCoords;

function createTexture()
{
  // Create a texture
  textures = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textures);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/textures.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, textures);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  texCoordBuffer = gl.createBuffer();

  gl.uniform1i(textureLoc, 0);
}

/*********************/
//    COORDINATES    //
/*********************/

// textures.png is split into 16 regions
// To get the appropriate coordinates, take the coords and multiply by
// xCoords * 0.25 + xPos * 0.25 for the x coords
// yCoords * 0.25 + yPos * 0.25 for the y coords
// Bottom left texture would be at (xPos, yPos) = (0, 0)

// Star Coin
// coinTexCoords populated by generateCoinStar() in starCoin.js
var coinTCoords =
[
  // Front Center
  vec2( 0.5 * 0.25, 0.5 * 0.25 ),  // 0 Middle

  // Front Edge Points
  vec2(  0.5 * 0.25,     1.0 * 0.25 ),      // 1 Upper Middle
  vec2(  0.14843 * 0.25, 0.85156 * 0.25 ),  // 2 Upper Left
  vec2(  0.0 * 0.25,     0.5 * 0.25 ),      // 3 Middle Left
  vec2(  0.14843 * 0.25, 0.14843 * 0.25 ),  // 4 Lower Left
  vec2(  0.5 * 0.25,     0.0 * 0.25 ),      // 5 Lower Middle
  vec2(  0.85156 * 0.25, 0.14843 * 0.25 ),  // 6 Lower Right
  vec2(  1.0 * 0.25,     0.5 * 0.25 ),      // 7 Middle Right
  vec2(  0.85156 * 0.25, 0.85156 * 0.25 )   // 8 Upper Right
];

var coinCoords = [];

// Star
// starTexCoords populated by generateStar() in star.js
var starTCoords =
[
  // Points
  vec2(  0.5 * 0.25 + 0.25,    0.957 * 0.25 ),      // 0 Top Middle
  vec2(  0.0 * 0.25 + 0.25,    0.59375 * 0.25 ),    // 1 Upper Left
  vec2(  0.1953 * 0.25 + 0.25, 0.0 * 0.25 ),        // 2 Lower Left
  vec2(  0.8047 * 0.25 + 0.25, 0.0 * 0.25 ),        // 3 Lower Right
  vec2(  1.0 * 0.25 + 0.25,    0.59375 * 0.25 ),    // 4 Upper Right

  // Pentagon
  vec2(  0.3359 * 0.25 + 0.25, 0.6641 * 0.25 ),     // 5 Upper Left
  vec2(  0.2344 * 0.25 + 0.25, 0.34375 * 0.25 ),    // 6 Lower Left
  vec2(  0.5 * 0.25 + 0.25,    0.15234 * 0.25 ),    // 7 Bottom Middle
  vec2(  0.7656 * 0.25 + 0.25, 0.34375 * 0.25 ),    // 8 Lower Right
  vec2(  0.6641 * 0.25 + 0.25, 0.6641 * 0.25 )      // 9 Upper Right
];

var starCoords = [];

// Question, Brick
var tCoords_Q =
[
  vec2(0 * 0.25 + 0.5, 0 * 0.25), //0
  vec2(0 * 0.25 + 0.5, 1 * 0.25), //1
  vec2(1 * 0.25 + 0.5, 1 * 0.25), //2
  vec2(1 * 0.25 + 0.5, 0 * 0.25)  //3
];

var tCoords_B =
[
  vec2(0 * 0.25 + 0.75, 0 * 0.25), //0
  vec2(0 * 0.25 + 0.75, 1 * 0.25), //1
  vec2(1 * 0.25 + 0.75, 1 * 0.25), //2
  vec2(1 * 0.25 + 0.75, 0 * 0.25)  //3
];

var questionCoords = [];
var brickCoords = [];

function populateCubeTexCoords()
{
  for( var i = 0; i < 6; i++ )
  {
    questionCoords.push(tCoords_Q[1]);
    questionCoords.push(tCoords_Q[0]);
    questionCoords.push(tCoords_Q[3]);
    questionCoords.push(tCoords_Q[1]);
    questionCoords.push(tCoords_Q[3]);
    questionCoords.push(tCoords_Q[2]);

    brickCoords.push(tCoords_B[1]);
    brickCoords.push(tCoords_B[0]);
    brickCoords.push(tCoords_B[3]);
    brickCoords.push(tCoords_B[1]);
    brickCoords.push(tCoords_B[3]);
    brickCoords.push(tCoords_B[2]);
  }
}

// Mario Logo
var marioLogoCoords =
[
  vec2(0.0 * 0.25, 0.3 * 0.25 + 0.25),
  vec2(1.0 * 0.25, 0.3 * 0.25 + 0.25),
  vec2(0.5 * 0.25, 0.8 * 0.25 + 0.25)
];

// Single Pipes
var pipeSideCoords =
[
  vec2(0.0 * 0.25 + 0.25, 0.0 * 0.25 + 0.25), //0
  vec2(0.0 * 0.25 + 0.25, 0.5 * 0.25 + 0.25), //1
  vec2(0.5 * 0.25 + 0.25, 0.5 * 0.25 + 0.25), //2
  vec2(0.5 * 0.25 + 0.25, 0.0 * 0.25 + 0.25)  //3
];

var pipeTopCoords =
[
  vec2(0.5 * 0.25 + 0.25, 0.0 * 0.25 + 0.25),   //0
  vec2(0.5 * 0.25 + 0.25, 0.5 * 0.25 + 0.25), //1
  vec2(1.0 * 0.25 + 0.25, 0.5 * 0.25 + 0.25), //2
  vec2(1.0 * 0.25 + 0.25, 0.0 * 0.25 + 0.25)    //3
];

var pipeCoords = [];

function populatePipeTexCoords()
{
  for( var i = 0; i < 5; i++ )
  {
    pipeCoords.push(pipeSideCoords[1]);
    pipeCoords.push(pipeSideCoords[0]);
    pipeCoords.push(pipeSideCoords[3]);
    pipeCoords.push(pipeSideCoords[1]);
    pipeCoords.push(pipeSideCoords[3]);
    pipeCoords.push(pipeSideCoords[2]);
  }
  pipeCoords.push(pipeTopCoords[1]);
  pipeCoords.push(pipeTopCoords[0]);
  pipeCoords.push(pipeTopCoords[3]);
  pipeCoords.push(pipeTopCoords[1]);
  pipeCoords.push(pipeTopCoords[3]);
  pipeCoords.push(pipeTopCoords[2]);
}

// Goomba, Cloud Face, Lakitu, Lakitu Start, Cloud 1-3
var goombaCoords =
[
    vec2(0 * 0.25 + 0.5, 1 * 0.25 + 0.5), //1
    vec2(0 * 0.25 + 0.5, 0 * 0.25 + 0.5), //0
    vec2(1 * 0.25 + 0.5, 0 * 0.25 + 0.5), //3
    vec2(0 * 0.25 + 0.5, 1 * 0.25 + 0.5), //1
    vec2(1 * 0.25 + 0.5, 0 * 0.25 + 0.5), //3
    vec2(1 * 0.25 + 0.5, 1 * 0.25 + 0.5)  //2
];

var lakituCoords =
[
    vec2(0 * 0.25 + 0.5, 1 * 0.25 + 0.25), //1
    vec2(0 * 0.25 + 0.5, 0 * 0.25 + 0.25), //0
    vec2(1 * 0.25 + 0.5, 0 * 0.25 + 0.25), //3
    vec2(0 * 0.25 + 0.5, 1 * 0.25 + 0.25), //1
    vec2(1 * 0.25 + 0.5, 0 * 0.25 + 0.25), //3
    vec2(1 * 0.25 + 0.5, 1 * 0.25 + 0.25)  //2
];

var lakituStartCoords =
[
    vec2(0 * 0.25 + 0.75, 1 * 0.25 + 0.25), //1
    vec2(0 * 0.25 + 0.75, 0 * 0.25 + 0.25), //0
    vec2(1 * 0.25 + 0.75, 0 * 0.25 + 0.25), //3
    vec2(0 * 0.25 + 0.75, 1 * 0.25 + 0.25), //1
    vec2(1 * 0.25 + 0.75, 0 * 0.25 + 0.25), //3
    vec2(1 * 0.25 + 0.75, 1 * 0.25 + 0.25)  //2
];

var cloudFaceCoords =
[
    vec2(0 * 0.25 + 0.75, 1 * 0.25 + 0.75), //1
    vec2(0 * 0.25 + 0.75, 0 * 0.25 + 0.75), //0
    vec2(1 * 0.25 + 0.75, 0 * 0.25 + 0.75), //3
    vec2(0 * 0.25 + 0.75, 1 * 0.25 + 0.75), //1
    vec2(1 * 0.25 + 0.75, 0 * 0.25 + 0.75), //3
    vec2(1 * 0.25 + 0.75, 1 * 0.25 + 0.75)  //2
];

var cloudSmallCoords =
[
    vec2(0 * 0.25 + 0.5, 1 * 0.25 + 0.75), //1
    vec2(0 * 0.25 + 0.5, 0 * 0.25 + 0.75), //0
    vec2(1 * 0.25 + 0.5, 0 * 0.25 + 0.75), //3
    vec2(0 * 0.25 + 0.5, 1 * 0.25 + 0.75), //1
    vec2(1 * 0.25 + 0.5, 0 * 0.25 + 0.75), //3
    vec2(1 * 0.25 + 0.5, 1 * 0.25 + 0.75)  //2
];

var cloudBigCoords =
[
    vec2(0 * 0.25, 1 * 0.25 + 0.75), //1
    vec2(0 * 0.25, 0 * 0.25 + 0.75), //0
    vec2(1 * 0.25, 0 * 0.25 + 0.75), //3
    vec2(0 * 0.25, 1 * 0.25 + 0.75), //1
    vec2(1 * 0.25, 0 * 0.25 + 0.75), //3
    vec2(1 * 0.25, 1 * 0.25 + 0.75)  //2
];

var cloudLakituCoords =
[
    vec2(0 * 0.25 + 0.25, 1 * 0.25 + 0.75), //1
    vec2(0 * 0.25 + 0.25, 0 * 0.25 + 0.75), //0
    vec2(1 * 0.25 + 0.25, 0 * 0.25 + 0.75), //3
    vec2(0 * 0.25 + 0.25, 1 * 0.25 + 0.75), //1
    vec2(1 * 0.25 + 0.25, 0 * 0.25 + 0.75), //3
    vec2(1 * 0.25 + 0.25, 1 * 0.25 + 0.75)  //2
];


/*********************/
//   APPLY TEXTURE   //
/*********************/

function applyTexture(textureCoords)
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( textureCoords ), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);

  // Enable blending for transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  if( textureCoords == lakituCoords ||
      textureCoords == lakituStartCoords ||
      textureCoords == cloudFaceCoords ||
      textureCoords == cloudLakituCoords)
  {
    gl.depthMask(false);
  }
}

/*********************/
//   Drawing Shape   //
/*********************/

var cloudFacePoints = [];
var cloudFaceBuffer;

function generateCloudFaceSquare()
{
    // Store the vertices needed for the square
    var cloudFaceVertices =
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
        cloudFacePoints.push(cloudFaceVertices[vertexOrder[i]]);
    }

    cloudFaceBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cloudFaceBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cloudFacePoints), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function drawCloudFace()
{
  // We don't need lighting
  gl.disableVertexAttribArray(vNormal);

  // Buffer and attributes for the path points
  gl.bindBuffer( gl.ARRAY_BUFFER, cloudFaceBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(cloudFacePoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to light gray
  gl.uniform4fv( currentColourLoc, colors[1] );

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  modelTransformMatrix = translate( lakitu_x - 0.45, lakitu_y - 0.25, 29 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.9, 0.9 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  applyTexture(cloudFaceCoords);

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);

  gl.depthMask(true);
}

var lakituSquarePoints = [];
var lakituSquareBuffer;

function generateLakituSquare()
{
    // Store the vertices needed for the square
    var lakituSquareVertices =
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
        lakituSquarePoints.push(lakituSquareVertices[vertexOrder[i]]);
    }

    lakituSquareBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, lakituSquareBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(lakituSquarePoints), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function drawLakitu()
{
  // We don't need lighting
  gl.disableVertexAttribArray(vNormal);

  // Buffer and attributes for the path points
  gl.bindBuffer( gl.ARRAY_BUFFER, lakituSquareBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(lakituSquarePoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to light gray
  gl.uniform4fv( currentColourLoc, colors[1] );

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  modelTransformMatrix = translate( lakitu_x - 3.8, lakitu_y - 2.0, 29 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 5.0, 5.0, 5.0 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  if (isStartSequence)
  {
    applyTexture(lakituStartCoords);
  }
  else
  {
    applyTexture(lakituCoords);
  }

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
  gl.depthMask(true);
}

var cloudBigPoints = [];
var cloudBigBuffer;

function generateCloudBigSquare()
{
    // Store the vertices needed for the square
    var cloudBigVertices =
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
        cloudBigPoints.push(cloudBigVertices[vertexOrder[i]]);
    }

    cloudBigBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cloudBigBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cloudBigPoints), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function drawCloudBig()
{
  // We don't need lighting
  gl.disableVertexAttribArray(vNormal);

  // Buffer and attributes for the path points
  gl.bindBuffer( gl.ARRAY_BUFFER, cloudBigBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(cloudBigPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to light gray
  gl.uniform4fv( currentColourLoc, colors[1] );

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  modelTransformMatrix = translate( cloud1_x + 1, 8.25, 25 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 5.0, 5.0, 5.0 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  applyTexture(cloudBigCoords);

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

var cloudSmallPoints = [];
var cloudSmallBuffer;

function generateCloudSmallSquare()
{
    // Store the vertices needed for the square
    var cloudSmallVertices =
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
        cloudSmallPoints.push(cloudSmallVertices[vertexOrder[i]]);
    }

    cloudSmallBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cloudSmallBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cloudSmallPoints), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function drawCloudSmall()
{
  // We don't need lighting
  gl.disableVertexAttribArray(vNormal);

  // Buffer and attributes for the path points
  gl.bindBuffer( gl.ARRAY_BUFFER, cloudSmallBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(cloudSmallPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to light gray
  gl.uniform4fv( currentColourLoc, colors[1] );

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  modelTransformMatrix = translate( cloud2_x + 0.76, 4.02, 25 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 3.85, 3.85, 3.85 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  applyTexture(cloudSmallCoords);

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

var cloudLakituPoints = [];
var cloudLakituBuffer;

function generateCloudLakituSquare()
{
    // Store the vertices needed for the square
    var cloudLakituVertices =
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
        cloudLakituPoints.push(cloudLakituVertices[vertexOrder[i]]);
    }

    cloudLakituBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cloudLakituBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cloudLakituPoints), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function drawCloudLakitu()
{
  // We don't need lighting
  gl.disableVertexAttribArray(vNormal);

  // Buffer and attributes for the path points
  gl.bindBuffer( gl.ARRAY_BUFFER, cloudLakituBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(cloudLakituPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // Change the color to light gray
  gl.uniform4fv( currentColourLoc, colors[1] );

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  modelTransformMatrix = translate( lakitu_x - 1.18, lakitu_y - 0.98, 29 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 2.45, 2.45, 2.45 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  applyTexture(cloudLakituCoords);

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
  gl.depthMask(true);
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

  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  modelTransformMatrix = mult( modelTransformMatrix, translate( -0.45, 0.23, 40 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.9, 0.9 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  applyTexture(goombaCoords);

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}
