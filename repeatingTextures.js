// REPEATING TEXTURES

var repeatingTexCoordBuffer;
var textureRepeats;

var scrollingTexCoordBuffer;
var textureScrolls;

// Rainbow
var rainbowCoords =
[
    vec2(0 * 0.25 + 0.5, 1), //1
    vec2(0 * 0.25 + 0.5, 0), //0
    vec2(1 * 0.25 + 0.5, 0), //3
    vec2(0 * 0.25 + 0.5, 1), //1
    vec2(1 * 0.25 + 0.5, 0), //3
    vec2(1 * 0.25 + 0.5, 1)  //2
];

var rainbowResetCoords =
[
    vec2(0 * 0.25 + 0.5, 1), //1
    vec2(0 * 0.25 + 0.5, 0), //0
    vec2(1 * 0.25 + 0.5, 0), //3
    vec2(0 * 0.25 + 0.5, 1), //1
    vec2(1 * 0.25 + 0.5, 0), //3
    vec2(1 * 0.25 + 0.5, 1)  //2
];

// Grass
var grassCoords =
[
    vec2(0 * 0.25, 1), //1
    vec2(0 * 0.25, 0), //0
    vec2(1 * 0.25, 0), //3
    vec2(0 * 0.25, 1), //1
    vec2(1 * 0.25, 0), //3
    vec2(1 * 0.25, 1)  //2
];

var grassResetCoords =
[
    vec2(0 * 0.25, 1), //1
    vec2(0 * 0.25, 0), //0
    vec2(1 * 0.25, 0), //3
    vec2(0 * 0.25, 1), //1
    vec2(1 * 0.25, 0), //3
    vec2(1 * 0.25, 1)  //2
];

// Flipped Rainbow
var flippedRainbowCoords =
[
    vec2(1, 1 * 0.5 + 0.5), //2
    vec2(0, 1 * 0.5 + 0.5), //1
    vec2(0, 0 * 0.5 + 0.5), //0
    vec2(1, 1 * 0.5 + 0.5), //2
    vec2(0, 0 * 0.5 + 0.5), //0
    vec2(1, 0 * 0.5 + 0.5)  //3
];

var numPipeRepeats = [ 100, 16, 12, 10, 8 ];

var pipeBorderSideCoords =
[
  vec2(0.0, 0.25), //0
  vec2(0.0, 0.5), //1
  vec2(numPipeRepeats[0], 0.5), //2
  vec2(numPipeRepeats[0], 0.25)  //3
];

var pipeBorderTopCoords =
[
  vec2(0.0, 0.0), //0
  vec2(0.0, 0.25), //1
  vec2(numPipeRepeats[0], 0.25), //2
  vec2(numPipeRepeats[0], 0)  //3
];

var pipeSideCoords_16 =
[
  vec2(0.0, 0.25), //0
  vec2(0.0, 0.5), //1
  vec2(numPipeRepeats[1], 0.5), //2
  vec2(numPipeRepeats[1], 0.25)  //3
];

var pipeTopCoords_16 =
[
  vec2(0.0, 0.0), //0
  vec2(0.0, 0.25), //1
  vec2(numPipeRepeats[1], 0.25), //2
  vec2(numPipeRepeats[1], 0)  //3
];

var pipeSideCoords_12 =
[
  vec2(0.0, 0.25), //0
  vec2(0.0, 0.5), //1
  vec2(numPipeRepeats[2], 0.5), //2
  vec2(numPipeRepeats[2], 0.25)  //3
];

var pipeTopCoords_12 =
[
  vec2(0.0, 0.0), //0
  vec2(0.0, 0.25), //1
  vec2(numPipeRepeats[2], 0.25), //2
  vec2(numPipeRepeats[2], 0)  //3
];

var pipeSideCoords_10 =
[
  vec2(0.0, 0.25), //0
  vec2(0.0, 0.5), //1
  vec2(numPipeRepeats[3], 0.5), //2
  vec2(numPipeRepeats[3], 0.25)  //3
];

var pipeTopCoords_10 =
[
  vec2(0.0, 0.0), //0
  vec2(0.0, 0.25), //1
  vec2(numPipeRepeats[3], 0.25), //2
  vec2(numPipeRepeats[3], 0)  //3
];

var pipeSideCoords_8 =
[
  vec2(0.0, 0.25), //0
  vec2(0.0, 0.5), //1
  vec2(numPipeRepeats[4], 0.5), //2
  vec2(numPipeRepeats[4], 0.25)  //3
];

var pipeTopCoords_8 =
[
  vec2(0.0, 0.0), //0
  vec2(0.0, 0.25), //1
  vec2(numPipeRepeats[4], 0.25), //2
  vec2(numPipeRepeats[4], 0)  //3
];

var pipeBorderCoords = [];
var pipeCoords_16 = [];
var pipeCoords_12 = [];
var pipeCoords_10 = [];
var pipeCoords_8 = [];

function populateRepeatingPipeTexCoords()
{
  var verticeOrder = [ 1, 0, 3, 1, 3, 2 ]
  for( var i = 0; i < 5; i++ )
  {
    for( var it = 0; it < 6; it++ )
    {
      pipeBorderCoords.push(pipeBorderSideCoords[verticeOrder[it]]);
      pipeCoords_16.push(pipeSideCoords_16[verticeOrder[it]]);
      pipeCoords_12.push(pipeSideCoords_12[verticeOrder[it]]);
      pipeCoords_10.push(pipeSideCoords_10[verticeOrder[it]]);
      pipeCoords_8.push(pipeSideCoords_8[verticeOrder[it]]);
    }
  }

  for( var iter = 0; iter < 6; iter++ )
  {
    pipeBorderCoords.push(pipeBorderTopCoords[verticeOrder[iter]]);
    pipeCoords_16.push(pipeTopCoords_16[verticeOrder[iter]]);
    pipeCoords_12.push(pipeTopCoords_12[verticeOrder[iter]]);
    pipeCoords_10.push(pipeTopCoords_10[verticeOrder[iter]]);
    pipeCoords_8.push(pipeTopCoords_8[verticeOrder[iter]]);
  }
}

function createRepeatTexture()
{
  // Create a texture
  textureRepeats = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureRepeats);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/textureRepeats.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, textureRepeats);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  repeatingTexCoordBuffer = gl.createBuffer();

  gl.uniform1i(textureLoc, 0);
}

function createScrollTexture()
{
  // Create a texture
  textureScrolls = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureScrolls);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/textureScrolls.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, textureScrolls);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  scrollingTexCoordBuffer = gl.createBuffer();

  gl.uniform1i(textureLoc, 0);
}

function createRepeatTexture()
{
  // Create a texture
  textureRepeats = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureRepeats);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/textureRepeats.png";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, textureRepeats);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
      gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
  });

  // Create a buffer for texcoords
  repeatingTexCoordBuffer = gl.createBuffer();

  gl.uniform1i(textureLoc, 0);
}

function applyRepeatingTexture(textureCoords)
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, repeatingTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( textureCoords ), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureRepeats);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);

  // Enable blending for transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function applyScrollingTexture(textureCoords)
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, repeatingTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( textureCoords ), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordLoc);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureScrolls);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);

  // Enable blending for transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}
