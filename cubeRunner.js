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
    [1.0, 1.0, 1.0, 1.0 ],  // white
    [0.7, 0.7, 0.7, 1.0],  // light grey
    [0.6, 0.6, 0.6, 1.0],   // light-medium grey
    [0.5, 0.5, 0.5, 1.0],  // medium grey
    [0.4, 0.4, 0.4, 1.0],  // dark grey (for cube borders)
    [0, 0, 0, 1.0]   // black (for cube outlines)

];
var currColour = 0;  // use this to index through the cube colours
var allCubeColours = [];  // array of array to store the colours for every cube generated (index into this the same way that you index into allCubeLineXPositions)
var isAllWhite = 0;  // 0: cubes are different shades of white and grey; 1: cubes are all white
var isForBorder = 0;
// VARIABLES NEEDED FOR PHONG LIGHTING
// the light is in front of the cube, which is located st z = 50
var lightPosition = vec4(20, 20, -25, 0.0 );
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
            case 112:  // 'p' key
                console.log("p key");
                isPaused = !isPaused;
                break;
            case 119:  // 'w' key
                console.log("w key");
                isAllWhite = !isAllWhite;
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

// Generate the random starting x positions of a line of cubes and push this into the array of all cube line positions; also pushes the starting position (always -cameraPositionZAxis since they start at the end of the screen)
function generateNewCubeLine()
{
    // Generate a random number of cubes in the line (7-10)
    var numCubes = 7 + Math.floor((Math.random() * 3) + 1);
    // Section the path into equal length segments
    var sectionPathWidth = Math.floor( (canvas.width/12) / numCubes );  // we only want to use one quarter of the canvas width so that the cubes are generated near the middle of the screen

    // Holds the unique x positions for the numCubes X positions
    var positions = [];
    var colours = [];

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

        // pick a random colour for the cube (index between 0 and 3)
        var cubeColour = Math.floor((Math.random() * (4)));
        colours.push(cubeColour);
    }

    // Push the array of X positions in the cube line to the array of all cube line positions
    allCubeLineXPositions.push( positions );
    allCubeLineZPositions.push( -cameraPositionZAxis );
    allCubeColours.push(colours);
}

// draw the cube outline in white
function drawOutline() {
    // bind the current buffer that we want to draw (the one with the points)
    gl.bindBuffer( gl.ARRAY_BUFFER, vOutlineBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(outlinePoints), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );  // tell attribute how to get data out of buffer and binds current buffer to the attribute; vPosition will always be bound to vBuffer now
    gl.enableVertexAttribArray( vPosition );
    if (isForBorder)
    {
        gl.uniform4fv(currentColourLoc, colors[0]);  // make the outline while
        isForBorder = 0;
    }
    else
    {
        gl.uniform4fv(currentColourLoc, colors[4]);  // make the outline black
    }
    gl.drawArrays( gl.LINES, 0, numOutlinePoints );
}

// draw the cube with a specified colour
function drawCube(colourIndex) {
    // bind the current buffer that we want to draw (the one with the points)
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );  // tell attribute how to get data out of buffer and binds current buffer to the attribute; vPosition will always be bound to vBuffer now
    gl.enableVertexAttribArray( vPosition );
    // change the colour for the cube (want to index between 0 and 3)
    if (!isAllWhite)
        gl.uniform4fv(currentColourLoc, colors[colourIndex]);
    else
        gl.uniform4fv(currentColourLoc, colors[0]);  // set the cubes all white
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );  // draw cube using triangle strip
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
            // set the colour for the cube
            drawCube(allCubeColours[r][c]);
        }
    }
}

function drawBorder() {
    // iterate through the whole length of the canvas and draw borders made of cubes on the sides
    for (var i = -cameraPositionZAxis; i < cameraPositionZAxis; i++) {
        // draw cube on left side
        transformCube( -canvas.width/12, i );
        drawOutline();  // draw the outline for the cube
        drawCube(4);  // draw the cube as dark grey
        // draw cube on right side
        transformCube( canvas.width/12, i );
        isForBorder = 1;
        drawOutline();  // draw the outline for the cube
        drawCube(4);  // draw the cube as dark grey
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
            allCubeColours.shift();
            // move the iterator back one so you don't miss the next element
            i--;
        }
        else
            break;  // since the z values decrease as you go through the array (later cube lines have smaller z values), then if the z position is not past the user for this cube line, then the rest of the cube lines will not be past the user either
    }
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

    // draw the cube border on both sides
    drawBorder();

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
