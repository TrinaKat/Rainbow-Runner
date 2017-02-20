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
// the light is in front of the cube, which is located st z = 50
var lightPosition = vec4(20, 20, -5, 0.0 );
var lightAmbient = vec4(0.6, 0.6, 0.6, 1.0 );   // pink lighting
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
var pathCameraTransformMatrix = mat4();

// SET UP BUFFER AND ATTRIBUTES
var vPosition;
var vBuffer;
var vOutlineBuffer;
var vPathBuffer;
var vTexcoordBuffer;

// INITIALIZE VARIABLES
var currentFOV = 50;   // adjust this later for narrow or width FOV
var currDegrees = 0;  // indicate current degree for the azimuth of the camera heading
var cameraPositionZAxis = 50;  // camera's initial position along the z-axis
var cameraPositionYAxis = 0;  // camera's initial position along the y-axis
var cameraPitch = 5;  // camera's pitch (want scene to be rotated down along x-axis so we can see the tops of the cubes)

// VARIABLES TO MOVE THE CUBES
var prevTime = 0;  // so we can calculate the time difference between calls to render
var stepSize = 40;
var currAmountTranslated = 0;
var amountToMove = 0;
var allCubeLineXPositions = [];  // Array of arrays containing X positions for all cubes in a line
var allCubeLineZPositions = [];  // array containing the Z position for each cube line
var numCubeLines = (2 * cameraPositionZAxis) / stepSize;   // the total number of active cube lines we have displayed at a time
// Keep track of Z distance traveled by each line (elements correspond to those in allCubeLineXPositions)
var cubeLineDistanceTraveled = 0;
var isPaused = 0;  // 0: not paused so all the cubes move; 1: paused so the cubes remain stationary

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

    // want to move camera in the +z direction since you are looking down the -z axis
    // in reality, since we are taking the inverse matrix, we are moving all the objects in the -z direction
    cameraTransformMatrix = mult(cameraTransformMatrix, inverse(translate(0, cameraPositionYAxis, cameraPositionZAxis)));
    // change the pitch of the camera so we can see the tops of the cubes
    cameraTransformMatrix = mult(cameraTransformMatrix, inverse(rotate(-cameraPitch, vec3(1, 0, 0))));
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
    // save the value of the camera matrix to use when drawing the rainbow road path
    pathCameraTransformMatrix = cameraTransformMatrix;  

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
            case 112:  // 'p' key
                console.log("p key");
                isPaused = !isPaused;
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

    // draw the first line of cubes
    generateNewCubeLine();

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

// Generate the random starting x positions of a line of cubes and push this into the array of all cube line positions; also pushes the starting position (always -cameraZPosition since they start at the end of the screen)
function generateNewCubeLine()
{
    // Generate a random number of cubes in the line (7-10)
    var numCubes = 7 + Math.floor((Math.random() * 3) + 1);
    // Section the path into equal length segments
    var sectionPathWidth = Math.floor( (canvas.width/12) / numCubes );  // we only want to use one quarter of the canvas width so that the cubes are generated near the middle of the screen

    // Holds the unique x positions for the numCubes X positions
    var positions = [];

    for( var i = 0; i < numCubes; i++ )
    {
        // which section of the canvas
        var whichSection = (i * sectionPathWidth);
        // what index in the section of the canvas
        var indexInSection = Math.floor( Math.random() * (sectionPathWidth - 2)) + 1;
        // initial offset on canvas 
        var initialOffset = - canvas.width / 24; 
        var randomPosition = whichSection + indexInSection + initialOffset;
        positions.push( randomPosition );
    }

    // Push the array of X positions in the cube line to the array of all cube line positions
    allCubeLineXPositions.push( positions );
    allCubeLineZPositions.push( -cameraPositionZAxis );
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
    // reset the camera transform matrix as well (was changed to move the cubes)
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, numPathVertices );  // draw cube using triangle strip
    // set the model transform back to its original value
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
}

// THIS WORKS BUT ONLY DRAWS ONE CUBE
// draw and move all cubes forward at a constant speed
function drawAndMoveCubes() {
    // draw a single cube
    transformCube(1, -cameraPositionZAxis);
    // apply the camera transformation so the cubes all move forward
    cameraTransformMatrix = mult(translate(0, 0, amountToMove), cameraTransformMatrix);
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
    drawOutline();
    drawCube();
}

// THIS WORKS FOR ONE LINE OF CUBES
// Draw line of cubes and transform them
function drawAndMoveAllCubes()
{
    // iterate through each row of cubes (one cube line at a time)
    for ( var r = 0; r < allCubeLineXPositions.length; r++ )
    {
        // get the new z position for this row of cubes by adding amountToMove to the original z position
         allCubeLineZPositions[r] = allCubeLineZPositions[r] + amountToMove;

        // iterate through all the cubes on a single cube line
        for ( var c = 0; c < allCubeLineXPositions[r].length; c++ )
        {
            // move the cube to the correct position 
            transformCube( allCubeLineXPositions[r][c],  allCubeLineZPositions[r] );
            // draw the cubes and outlines
            drawOutline();
            drawCube();
        }
    }
}


// modify and apply the model transform matrix for the cubes
function transformCube(xPosition, zPosition) {
    // move the cubes to the correct x and z axis positions
    modelTransformMatrix = translate(xPosition, 0, zPosition);
    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
}

function destroyOutOfRangeCubes() {
    for ( var i = 0; i < allCubeLineZPositions.length; i++) {
        // check to see if the z position is past that of the user
        if (allCubeLineZPositions[i] > cameraPositionZAxis) {
            // delete the cube's data from both arrays
            allCubeLineZPositions.shift();
            allCubeLineXPositions.shift();
            // move the iterator back one so you don't miss the next element
            i--;
        }
        else
            break;  // since the z values decrease as you go through the array (later cube lines have smaller z values), then if the z position is not past the user for this cube line, then the rest of the cube lines will not be past the user either
    }
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

    if (!isPaused) {
        // move the cubes forward at a constant speed
        // first, get the time difference since the last call to render
        var timeDiff = (timeStamp - prevTime)/1000;  // must divide by 1000 since measured in milliseconds
        amountToMove = stepSize * timeDiff;  // amount to move the cubes by in order to maintain constant speed down the screen
        prevTime = timeStamp;  // set the previous time for the next iteration equal to the current time
        cubeLineDistanceTraveled += amountToMove;
    }
    else {  // if the game is paused, don't move the cubes, but make sure to keep updating thw timer
        amountToMove = 0;
        prevTime = timeStamp;
    }

    // enable the texture before we draw
    enableTexture = true;
    gl.uniform1f(enableTextureLoc, enableTexture);  // tell the shader whether or not we want to enable textures
    // draw the path
    drawPath();
    // disable the texture before we draw something else later
    enableTexture = false;
    gl.uniform1f(enableTextureLoc, enableTexture);

    // check to see if you have moved the current cube line far anough and you should generate a new cube line
    // 5 means that we want to have a 5 unit separation between each cube line
    if (cubeLineDistanceTraveled >= 5) {
        generateNewCubeLine();
        cubeLineDistanceTraveled = 0;  // reset the value
    }

    // draw all of the cubes and move them forward at constant rate
    drawAndMoveAllCubes();

    // check to see if any of the cubes have moved past the camera and are now out of range; if so, delete them
    destroyOutOfRangeCubes();

    // render again (repeatedly as long as program is running or the game isn't paused)
    requestAnimationFrame( render );
}
