// Texture

// Apply texture to the rainbow road path
function applyTexture(imagePath)
{
    // Create a buffer for texcoords
    vTexcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vTexcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

    // Create the texture by loading an image
    createTexture(imagePath);
}

function createTexture(imagePath)
{
    // Create a texture
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    });

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}
