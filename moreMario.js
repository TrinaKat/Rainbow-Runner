// More Mario Stuff (Clouds)

var squareTexCoords =
[
    vec2(0, 1), //1
    vec2(0, 0), //0
    vec2(1, 0), //3
    vec2(0, 1), //1
    vec2(1, 0), //3
    vec2(1, 1)  //2
];

var cloudFaceTexBuffer;
var lakituTexBuffer;
var cloudBigTexBuffer;
var cloudSmallTexBuffer;
var cloudLakituTexBuffer;

var cloudFaceTexture;
var lakituTexture;
var cloudBigTexture;
var cloudSmallTexture;
var cloudLakituTexture;

function createCloudFaceTexture()
{
  // Create a texture
  cloudFaceTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, cloudFaceTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/cloudFace.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, cloudFaceTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  cloudFaceTexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cloudFaceTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function applyCloudFaceTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, cloudFaceTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cloudFaceTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

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

  applyCloudFaceTexture();

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}





// LAKITU
function createLakituTexture()
{
  // Create a texture
  lakituTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, lakituTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/lakituTexture.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, lakituTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  lakituTexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lakituTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function applyLakituTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, lakituTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, lakituTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
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
  modelTransformMatrix = translate( lakitu_x - 2.25, lakitu_y - 0.75, 29 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 3.0, 3.0, 3.0 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  applyLakituTexture();

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}



// BIG CLOUD
function createCloudBigTexture()
{
  // Create a texture
  cloudBigTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, cloudBigTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/cloudTexture1.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, cloudBigTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  cloudBigTexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cloudBigTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function applyCloudBigTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, cloudBigTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cloudBigTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
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

  applyCloudBigTexture();

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}









// SMALL CLOUD
function createCloudSmallTexture()
{
  // Create a texture
  cloudSmallTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, cloudSmallTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/cloudTexture3.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, cloudSmallTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  cloudSmallTexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cloudSmallTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function applyCloudSmallTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, cloudSmallTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cloudSmallTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
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

  applyCloudSmallTexture();

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}







// LAKITU CLOUD
function createCloudLakituTexture()
{
  // Create a texture
  cloudLakituTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, cloudLakituTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/cloudTexture2.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, cloudLakituTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  cloudLakituTexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cloudLakituTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function applyCloudLakituTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, cloudLakituTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(squareTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cloudLakituTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
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

  applyCloudLakituTexture();

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

    // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

   // disable the texture before we draw something else later
  enableTexture = false;
  gl.uniform1f(enableTextureLoc, enableTexture);
}
