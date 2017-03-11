// Mario

var cubeTexCoordBuffer;
var cubeTexCoords = [];

var pipeBorderTexCoordBuffer;
var pipeBorderTexCoords = [];

var pipeTexCoordBuffer;
var pipeTexCoords = [];

var marioLogoTexBuffer;

// Mapping between the texture coordinates (range from 0 to 1) and object
var tCoords =
[
  vec2(0, 0), //0
  vec2(0, 1), //1
  vec2(1, 1), //2
  vec2(1, 0)  //3
];

var numPipeBorderRepeats = 100; //2 * cameraPositionZAxis;  // cubeRunner.js is added after mario.js

var pipeBorderCoords =
[
  vec2(0.0, 0.5), //0
  vec2(0.0, 1.0), //1
  vec2(numPipeBorderRepeats, 1.0), //2
  vec2(numPipeBorderRepeats, 0.5)  //3
];

var pipeBorderTopCoords =
[
  vec2(0.0, 0.0), //0
  vec2(0.0, 0.5), //1
  vec2(numPipeBorderRepeats, 0.5), //2
  vec2(numPipeBorderRepeats, 0)  //3
];

var pipeCoords =
[
  vec2(0.0, 0.5), //0
  vec2(0.0, 1.0), //1
  vec2(1.0, 1.0), //2
  vec2(1.0, 0.5)  //3
];

var pipeTopCoords =
[
  vec2(0.0, 0.0),   //0
  vec2(0.0, 0.5), //1
  vec2(1.0, 0.5), //2
  vec2(1.0, 0)    //3
];

var marioLogoTexCoords =
[
  vec2(0.0, 0.3),
  vec2(1.0, 0.3),
  vec2(0.5, 0.8)
];

var brickTexture;
var questionTexture;
var pipeBorderTexture;
var pipeTexture;
var dirtTexture;
var playerLogoTexture;

function populateCubeTexCoords()
{
  for( var i = 0; i < 6; i++ )
  {
    cubeTexCoords.push(tCoords[1]);
    cubeTexCoords.push(tCoords[0]);
    cubeTexCoords.push(tCoords[3]);
    cubeTexCoords.push(tCoords[1]);
    cubeTexCoords.push(tCoords[3]);
    cubeTexCoords.push(tCoords[2]);
  }
}

function populatePipeTexCoords()
{
  for( var i = 0; i < 5; i++ )
  {
    // For path borders
    pipeBorderTexCoords.push(pipeBorderCoords[1]);
    pipeBorderTexCoords.push(pipeBorderCoords[0]);
    pipeBorderTexCoords.push(pipeBorderCoords[3]);
    pipeBorderTexCoords.push(pipeBorderCoords[1]);
    pipeBorderTexCoords.push(pipeBorderCoords[3]);
    pipeBorderTexCoords.push(pipeBorderCoords[2]);

    // For intro borders
    pipeTexCoords.push(pipeCoords[1]);
    pipeTexCoords.push(pipeCoords[0]);
    pipeTexCoords.push(pipeCoords[3]);
    pipeTexCoords.push(pipeCoords[1]);
    pipeTexCoords.push(pipeCoords[3]);
    pipeTexCoords.push(pipeCoords[2]);
  }

  // For path borders
  pipeBorderTexCoords.push(pipeBorderTopCoords[1]);
  pipeBorderTexCoords.push(pipeBorderTopCoords[0]);
  pipeBorderTexCoords.push(pipeBorderTopCoords[3]);
  pipeBorderTexCoords.push(pipeBorderTopCoords[1]);
  pipeBorderTexCoords.push(pipeBorderTopCoords[3]);
  pipeBorderTexCoords.push(pipeBorderTopCoords[2]);

  // For intro borders
  pipeTexCoords.push(pipeTopCoords[1]);
  pipeTexCoords.push(pipeTopCoords[0]);
  pipeTexCoords.push(pipeTopCoords[3]);
  pipeTexCoords.push(pipeTopCoords[1]);
  pipeTexCoords.push(pipeTopCoords[3]);
  pipeTexCoords.push(pipeTopCoords[2]);
}

// CREATE TEXTURES

function createBrickTexture()
{
  // Create a texture
  brickTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, brickTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/bricks.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, brickTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  cubeTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( cubeTexCoords ), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function createQuestionTexture()
{
  // Create a texture
  questionTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, questionTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/question.jpg";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, questionTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Bind buffer for texcoords
  // Already created with brick texture
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( cubeTexCoords ), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function createPipeBorderTexture()
{
  // Create a texture
  pipeBorderTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, pipeBorderTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/marioPipesRepeat.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, pipeBorderTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Bind buffer for texcoords
  pipeBorderTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pipeBorderTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( pipeBorderTexCoords ), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function createPipeTexture()
{
  // Create a texture
  pipeTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, pipeTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/marioPipesRepeat.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, pipeTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Bind buffer for texcoords
  pipeTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pipeTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( pipeTexCoords ), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function createDirtTexture()
{
  // Create a texture
  dirtTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, dirtTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/ground.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, dirtTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  // Already created with rainbow texture
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pathTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function createGrassTexture()
{
  // Create a texture
  grassTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, grassTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/grass.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, grassTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  // Already created with rainbow texture
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pathTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}

function createPlayerLogoTexture()
{
  // Create a texture
  playerLogoTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, playerLogoTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/Mario/whiteMarioLogo.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, playerLogoTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  marioLogoTexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, marioLogoTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(marioLogoTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(textureLoc, 0);
}



// APPLY TEXTURES

function applyBrickTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, brickTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

function applyQuestionTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, questionTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

function applyPipeBorderTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, pipeBorderTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pipeBorderTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, pipeBorderTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

function applyPipeTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, pipeTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pipeTexCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, pipeTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

function applyDirtTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pathTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, dirtTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

function applyGrassTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pathTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, grassTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

function applyPlayerLogoTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, marioLogoTexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(marioLogoTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, playerLogoTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

function applyRainbowTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pathTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, rainbowTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}

function applyFlippedRainbowTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(flippedTexCoords), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureFlipped);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}
