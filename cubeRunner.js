"use strict";

// SET UP WEBGL AND HTML CANVAS
var canvas;
var gl;
var program;

// DATA STORAGE FOR POINTS, COLOURS, ETC.
var points = [];
var numVertices = 36;

var outlinePoints = [];
var numOutlinePoints = 24;

var pathPoints = [];
var numPathVertices = 6;  // only need 6 points to draw path since it is a rectangle (2 triangles)

var vertices =    // manually plan out unit cube
[
    vec4( 0, 0, +1, 1.0 ),
    vec4( 0, +1, +1, 1.0 ),
    vec4( +1, +1, +1, 1.0 ),
    vec4( +1, 0, +1, 1.0 ),
    vec4( 0, 0, 0, 1.0 ),
    vec4( 0, +1, 0, 1.0 ),
    vec4( +1, +1, 0, 1.0 ),
    vec4( +1, 0, 0, 1.0 )
];

var colors =
[
    [ 1.0, 1.0, 1.0, 1.0 ],  // white
    [0.875, 0.875, 0.875, 1.0],  // light grey #1
    [0.75, 0.75, 0.75, 1.0],  // light grey #2
    [0.625, 0.625, 0.625, 1.0],  // medium grey
    [1.0, 1.0, 1.0, 1.0]   // black
];
var numColors = 4;

// VARIABLES NEEDED FOR PHONG LIGHTING
// the light is in front of the cube, which is located st z = 5
var lightPosition = vec4(10, 20, 35, 0.0 );
var lightAmbient = vec4(0.8, 0.8, 0.8, 1.0 );   // pink lighting
// var lightAmbient = vec4(0.0, 0.0, 1.0, 1.0);    // dark blue lighting
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

// variables needed for the material of the cube
var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

var ambientProduct, diffuseProduct, specularProduct;
var viewerPos;
var normalsArray = [];

// VARIABLES NEEDED FOR TEXTURES
var enableTexture = false;  // by default we do not use textures
var texCoords =    // mapping between the texture coordinates (range from 0 to 1) and object
[
    // square, so just use two triangles
    // triangle #1
    vec2(0.0,  1.0),
    vec2(0.0,  0.0),
    vec2(1.0,  0.0),
    // triangle #2
    vec2(0.0,  1.0),
    vec2(1.0,  0.0),
    vec2(1.0,  1.0)
];

// DECLARE VARIABLES FOR UNIFORM LOCATIONS
var modelTransformMatrixLoc;
var cameraTransformMatrixLoc;
var projectionMatrixLoc;
var currentColourLoc;
var enableTextureLoc;
var texcoordLoc;

// INITIALIZE ALL TRANSFORMATION MATRICES
var modelTransformMatrix = mat4();  // identity matrix
var projectionMatrix = mat4();
var cameraTransformMatrix = mat4();

// SET UP BUFFER AND ATTRIBUTES
var vPosition;
var vBuffer;
var vOutlineBuffer;
var vPathBuffer;
var vTexcoordBuffer;

// VARIABLE TO MOVE THE CUBES
var stepSize = 20;
var currAmountTranslated = 0;
var amountToMove = 0;

// INITIALIZE MISCELLANEOUS VARIABLES
var currentFOV = 50;   // adjust this later for narrow or width FOV
var currDegrees = 0;  // indicate current degree for the azimuth of the camera heading
var cameraPositionZAxis = 50;  // camera's initial position along the z-axis
var cameraPositionYAxis = 10;  // camera's initial position along the y-axis
var cameraPitch = 10;  // camera's pitch (want scene to be rotated down along x-axis so we can see the tops of the cubes)
var prevTime = 0;

window.onload = function init()
{
    // SET UP WEBGL
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    // LOAD SHADERS AND INITIALIZE ATTRIBUTE BUFFERS
    program = initShaders( gl, "vertex-shader", "fragment-shader" );  // compile and link shaders, then return a pointer to the program
    gl.useProgram( program );

    // POPULATE THE POINTS,OUTLINE POINTS, AND PATH POINTS ARRAY
    generateCube();
    generateCubeOutline();
    generatePath();

    // BUFFER AND ATTRIBUTES FOR THE NORMALS
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // CREATE BUFFERS FOR THE CUBE, OUTLINE, AND PATH
    vBuffer = gl.createBuffer();
    vOutlineBuffer = gl.createBuffer();
    vPathBuffer = gl.createBuffer();

    // SET VALUES FOR UNIFORMS FOR SHADERS
    modelTransformMatrixLoc = gl.getUniformLocation(program, "modelTransformMatrix");
    cameraTransformMatrixLoc = gl.getUniformLocation(program, "cameraTransformMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    currentColourLoc = gl.getUniformLocation(program, "currentColour");

    // INITIALIZE THE TRANSFORMATION MATRICES
    // gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
    // move cube away from the origin to check if perspective is correct
    // TODO: remove this
    modelTransformMatrix = mult(modelTransformMatrix, translate(5, 5, 5));
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

    // want to move camera in the +z direction since you are looking down the -z axis
    // in reality, since we are taking the inverse matrix, we are moving all the objects in the -z direction
    cameraTransformMatrix = mult(cameraTransformMatrix, inverse(translate(0, cameraPositionYAxis, cameraPositionZAxis)));
    // change the pitch of the camera so we can see the tops of the cubes
    cameraTransformMatrix = mult(cameraTransformMatrix, inverse(rotate(-cameraPitch, vec3(1, 0, 0))));
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

    // apply symmetric perspective projection
    projectionMatrix = perspective(currentFOV, 1, 1, 100);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // SET VARIABLES FOR LIGHTING
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    enableTextureLoc = gl.getUniformLocation(program, "enableTexture"); //TEXTURE
    // assign rainbow road texture to the path
    applyTexture("Textures/rainbow.png");

    // ADD EVENT LISTENERS
    // for ASCII character keys
    addEventListener("keypress", function(event) {
        switch (event.keyCode) {
            case 99:  // ’c’ key
                console.log("c key");
                ++colourIndexOffset;
                if (colourIndexOffset == 8) {
                    colourIndexOffset = 0;
                }
                break;
            case 105:  // 'i' key
                console.log("i key");
                cameraTransformMatrix = mult(cameraTransformMatrix, inverse(translate(0.25*Math.sin(radians(currDegrees)), 0, -0.25*Math.cos(radians(currDegrees)))));
                gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
                break;
            case 106:  // 'j' key
                console.log("j key");
                cameraTransformMatrix = mult(cameraTransformMatrix, inverse(translate(-0.25*Math.cos(radians(currDegrees)), 0, -0.25*Math.sin(radians(currDegrees)))));
                gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
                break;
            case 107:  // 'k' key
                console.log("k key");
                cameraTransformMatrix = mult(cameraTransformMatrix, inverse(translate(0.25*Math.cos(radians(currDegrees)), 0, 0.25*Math.sin(radians(currDegrees)))));
                gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
                break;
            case 109:  // 'm' key
                console.log("m key");
                cameraTransformMatrix = mult(cameraTransformMatrix, inverse(translate(-0.25*Math.sin(radians(currDegrees)), 0, 0.25*Math.cos(radians(currDegrees)))));
                gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
                break;
        }
    });

    // TODO: for testing purposes, remove after
    // for UP, DOWN, LEFT, RIGHT keys (no ASCII code since they are physical keys)
    addEventListener("keydown", function(event) {
        switch(event.keyCode) {
            // rotate the heading/azimuth left by 4 degrees
            case 37:  // LEFT key
                // currDegrees has opposite sign of rotation degree because we are facing in opposite direction to rotation
                currDegrees += 4;
                console.log("RIGHT");
                projectionMatrix = mult(projectionMatrix, rotate(-4, vec3(0, 1, 0)));
                gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
                break;
            // move position of the Y-axis up by 0.25 units
            case 38:  // UP key
                console.log("UP");
                cameraTransformMatrix = mult(cameraTransformMatrix, inverse(translate(0, 0.25, 0)));
                gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
                break;
            // rotate the heading/azimuth right by 4 degrees
            case 39:  // RIGHT key
                currDegrees -= 4;
                console.log("LEFT");
                projectionMatrix = mult(projectionMatrix, rotate(4, vec3(0, 1, 0)));
                gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
                break;
            // move position of the Y-axis down by 0.25 units
            case 40:  // DOWN key
                console.log("DOWN");
                cameraTransformMatrix = mult(cameraTransformMatrix, inverse(translate(0, -0.25, 0)));
                gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
                break;
        }
    });


    render(0);
}

// returns whether value is a power of 2 or not
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

// called for each face of the cube
function quad( a, b, c, d )
{
     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);

     var vertexOrder = [a, b, c, a, c, d];

     for (var i = 0; i < 6; i++) {
        points.push(vertices[vertexOrder[i]]);
        normalsArray.push(normal);
     }
 }

// generate points for the cube
function generateCube()
{
    // RHR traversal from vertex 1 to 0 to 3 to 2, only colors one side
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

// generate vertices for the cube outline
function generateCubeOutline() {
    // generate lines for front face of the cube
    outlinePoints.push(vertices[0]);
    for (var i = 1; i < 4; i++) {
        outlinePoints.push(vertices[i]);
        outlinePoints.push(vertices[i]);
    }
    outlinePoints.push(vertices[0]);
    // generate lines for the back face of the cube
    outlinePoints.push(vertices[4]);
    for (var j = 5; j < 8; j++) {
        outlinePoints.push(vertices[j]);
        outlinePoints.push(vertices[j]);
    }
    outlinePoints.push(vertices[4]);
    // generate four lines to connect the top face to the bottom face
    for (var k = 0; k < 4; k++) {
        outlinePoints.push(vertices[k]);
        outlinePoints.push(vertices[k+4]);
    }
}

// generate vertices for the path
function generatePath() {
    // generate the path with z = 0 (this means that all of the cubes and other objects in the scene must be drawn with positive z-value)
    var pathVertices =    // store the vertices needed for the path
    [
        vec4( -canvas.width/2, 0, -cameraPositionZAxis, 1.0 ),  // lower left corner
        vec4( canvas.width/2, 0, -cameraPositionZAxis, 1.0 ),  // lower right corner
        vec4( -canvas.width/2, 0, cameraPositionZAxis, 1.0 ),  // top left corner
        vec4( canvas.width/2, 0, cameraPositionZAxis, 1.0 )  // top right corner
    ];

    var vertexOrder = [0, 2, 3, 0, 3, 1];  // the order to draw with the path vertices

    for (var i = 0; i < 6; i++) {
        pathPoints.push(pathVertices[vertexOrder[i]]);
    }
}

// draw the cube outline in white
function drawOutline() {
    // bind the current buffer that we want to draw (the one with the points)
    gl.bindBuffer( gl.ARRAY_BUFFER, vOutlineBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(outlinePoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );  // tell attribute how to get data out of buffer and binds current buffer to the attribute; vPosition will always be bound to vBuffer now
    gl.enableVertexAttribArray( vPosition );
    gl.uniform4fv(currentColourLoc, colors[4]);  // make the outline black
    gl.drawArrays( gl.LINES, 0, numOutlinePoints );
}

// draw the cube with a specified colour
function drawCube() {
    // bind the current buffer that we want to draw (the one with the points)
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );  // tell attribute how to get data out of buffer and binds current buffer to the attribute; vPosition will always be bound to vBuffer now
    gl.enableVertexAttribArray( vPosition );
    // change the colour for the cube
    // TODO: change it from default to cyan
    gl.uniform4fv(currentColourLoc, colors[0]);
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );  // draw cube using triangle strip
}

// draw the path for the cubes to travel on
function drawPath() {
    // buffer and attributes for the path points
    gl.bindBuffer( gl.ARRAY_BUFFER, vPathBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pathPoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // reset the model transform matrix so the path is drawn at the origin
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(mat4()));
    gl.drawArrays( gl.TRIANGLES, 0, numPathVertices );  // draw cube using triangle strip
    // set the model transform back to its original value
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
}

function drawAndMoveCubes() {
    // draw a single cube
    applyTransformation();
    // translate the cubes forward
    // apply the transformation so the cubes all move forward
    var previousCameraTransformMatrix = cameraTransformMatrix;
    cameraTransformMatrix = mult(translate(0, 0, amountToMove), cameraTransformMatrix);
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
    drawOutline();
    drawCube();
    // reset the cubes back to where they were
    cameraTransformMatrix = previousCameraTransformMatrix;
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}

// modify and apply the model, camera, and projection transformations
// TODO: pass in parameters??
function applyTransformation() {
    // reset the matrices before applying transformations
    modelTransformMatrix = mat4();
    // move cube away from the origin to check if perspective is correct
    // TODO: remove this
    modelTransformMatrix = mult(modelTransformMatrix, translate(1, 0, -cameraPositionZAxis));
    modelTransformMatrix = mult(modelTransformMatrix, scalem(1, 1, 1));
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
}

// use this to apply texture to the rainbow road path
function applyTexture(imagePath) {
    texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
    // create a buffer for texcoords
    vTexcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vTexcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);
    // create the texture by loading an image
    createTexture(imagePath);
}

function createTexture(imagePath) {
    // create a texture
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);  
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // fill the texture with a 1x1 blue pixel (before we load the texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    // asynchronously load an image
    var image = new Image();
    image.src = imagePath;
    image.addEventListener('load', function() {
        // Now that the image has loaded, make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    });

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

// called repeatedly to render and draw our scene
function render(timeStamp)
{
    // clear colour buffer and depth buffer
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // move the cubes forward at a constant speed
    // first, get the time difference since the last call to render
    var timeDiff = (timeStamp - prevTime)/1000;  // must divide by 1000 since measured in milliseconds
    amountToMove = amountToMove + stepSize * (timeDiff) % cameraPositionZAxis;  // must apply modulo so that we do not overflow the variable
    prevTime = timeStamp;  // set the previous time for the next iteration equal to the current time

    // enable the texture before we draw
    enableTexture = true;
    gl.uniform1f(enableTextureLoc, enableTexture);  // tell the shader whether or not we want to enable textures
    // draw the path
    drawPath();
    // disable the texture before we draw something else later
    enableTexture = false;
    gl.uniform1f(enableTextureLoc, enableTexture);

    // draw all of the cubes and move them forward at constant rate
    drawAndMoveCubes();

    // render again (repeatedly as long as program is running)
    requestAnimationFrame( render );
}
