// Texture

// VARIABLES NEEDED FOR TEXTURES
var rainbowTexture;
var flippedRainbowTexture;
var rectangleTexCoordBuffer;

var pathTexCoords =    // mapping between the texture coordinates (range from 0 to 1) and object
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

var flippedRainbowTexCoords =  //210203
[
    vec2(3, 3), //2
    vec2(0, 3), //1
    vec2(0, 0), //0
    vec2(3, 3), //2
    vec2(0, 0), //0
    vec2(3, 0)  //3
]

function createRainbowTexture(imagePath)
{
    // Create a texture
    rainbowTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, rainbowTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Fill the texture with a 1x1 blue pixel
    // Before we load the image so use blue image so we can start rendering immediately
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image
    var image = new Image();
    image.src = "./Textures/rainbow.png";
    image.addEventListener('load', function() {
        // Now that the image has loaded, make copy it to the texture.
        // Set texture properties
        gl.bindTexture(gl.TEXTURE_2D, rainbowTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    });

    // Create a buffer for texcoords
    rectangleTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pathTexCoords), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(textureLoc, 0);
}

function createFlippedRainbowTexture(imagePath)
{
    // Create a texture
    flippedRainbowTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, flippedRainbowTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Fill the texture with a 1x1 blue pixel
    // Before we load the image so use blue image so we can start rendering immediately
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image
    var image = new Image();
    image.src = "./Textures/rainbow.png";
    image.addEventListener('load', function() {
        // Now that the image has loaded, make copy it to the texture.
        // Set texture properties
        gl.bindTexture(gl.TEXTURE_2D, flippedRainbowTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(flippedRainbowTexCoords), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(textureLoc, 0);
}
