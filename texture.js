// Texture

// VARIABLES NEEDED FOR TEXTURES
var texture;
var textureFlipped;
var enableTexture = false;  // by default we do not use textures
var isFlipped = false;  // so have path scrolling by default
var texCoords =    // mapping between the texture coordinates (range from 0 to 1) and object
[
    vec2(0, 2), //1
    vec2(0, 0), //0
    vec2(2, 0), //3
    vec2(0, 2), //1
    vec2(2, 0), //3
    vec2(2, 2)  //2
];
var resetTexCoords =    // mapping between the texture coordinates (range from 0 to 1) and object
[
    vec2(0, 2), //1
    vec2(0, 0), //0
    vec2(2, 0), //3
    vec2(0, 2), //1
    vec2(2, 0), //3
    vec2(2, 2)  //2
];
var flippedTexCoords =  //210203
[
    vec2(3, 3), //2
    vec2(0, 3), //1
    vec2(0, 0), //0
    vec2(3, 3), //2
    vec2(0, 0), //0
    vec2(3, 0)  //3
]

// Apply texture to the rainbow road path
function applyTexture()
{
    // Create a buffer for texcoords
    vTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
}

function createTexture(imagePath)
{
    // Create a texture
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Fill the texture with a 1x1 blue pixel
    // Before we load the image so use blue image so we can start rendering immediately
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image
    var image = new Image();
    image.src = imagePath;
    image.addEventListener('load', function() {
        // Now that the image has loaded, make copy it to the texture.
        // Set texture properties
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    });

    applyTexture();
    gl.uniform1i(textureLoc, 0);
}

function createFlippedTexture(imagePath)
{
    // Create a texture
    textureFlipped = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureFlipped);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Fill the texture with a 1x1 blue pixel
    // Before we load the image so use blue image so we can start rendering immediately
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image
    var image = new Image();
    image.src = imagePath;
    image.addEventListener('load', function() {
        // Now that the image has loaded, make copy it to the texture.
        // Set texture properties
        gl.bindTexture(gl.TEXTURE_2D, textureFlipped);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    });

    applyFlippedTexture();
    gl.uniform1i(textureLoc, 0);
}

// Apply texture to the rainbow road path
function applyFlippedTexture()
{
    // Create a buffer for texcoords
    vTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(flippedTexCoords), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
}
