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
    [1.0, 1.0, 1.0, 1.0 ],  // 0 white
    [0.7, 0.7, 0.7, 1.0],   // 1 light grey
    [0.6, 0.6, 0.6, 1.0],   // 2 light-medium grey
    [0.5, 0.5, 0.5, 1.0],   // 3 medium grey
    [0.4, 0.4, 0.4, 1.0],   // 4 dark grey (for cube borders)
    [0, 0, 0, 1.0],         // 5 black (for cube outlines)
    [1, 0.9, 0, 1.0],       // 6 yellow for the star
    [0, 0.76, 0.76, 1.0],   // 7 cyan to indicate this is a special Mario question cube
    [ 1.0, 0.5, 0.0, 1.0 ], // 8 orange (needed for exploding cube)
    [ 1.0, 0.976, 0.51, 1.0 ],  // 9 light yellow (needed for exploding cube)
    [ 0, 0.5, 0,5, 1.0 ]    // 10 teal (to flash the player in invincible mode)
];

var rainbowColors =
[
    [ 1.0, 0.0, 0.0, 1.0 ],  // red
    [ 1.0, 0.5, 0.0, 1.0 ],  // orange
    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
    [ 0.0, 1.0, 0.0, 1.0 ],  // green
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    [ 0.6, 0.0, 0.6, 1.0 ],  // purple
    [ 1.0, 0.1, 0.5, 1.0 ]   // pink
];

var currColour = 0;  // use this to index through the cube colours
var allCubeColours = [];  // array of array to store the colours for every cube generated (index into this the same way that you index into allCubeLineXPositions)
var isAllWhite = 0;  // 0: cubes are different shades of white and grey; 1: cubes are all white
var isForBorder = 0;
var isRainbow = 0;
var isExploded = 0;
var hasHitBorder = 0;

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

// DECLARE VARIABLES FOR UNIFORM LOCATIONS
var modelTransformMatrixLoc;
var cameraTransformMatrixLoc;
var projectionMatrixLoc;
var currentColourLoc;
var enableTextureLoc;
var texcoordLoc;
var textureLoc;

// INITIALIZE ALL TRANSFORMATION MATRICES
var modelTransformMatrix = mat4();  // identity matrix
var projectionMatrix = mat4();
var cameraTransformMatrix = mat4();
var pathCameraTransformMatrix = mat4();
var playerProjectionMatrix = mat4();

// SET UP BUFFER AND ATTRIBUTES
var vPosition;
var vNormal;
var vBuffer;
var vOutlineBuffer;
var vPathBuffer;
var vTexCoordBuffer;

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

// NAVIGATION
var rotDegrees = 0;
var translateAmount = 0;
var playerTilt = 0;  // no tilt by default
var amountToTilt = 5;

// Stuff for navigation FSM
var rightKeyDown = false;
var leftKeyDown = false;

var movementFSM = new MovementFSM();

// TODO SOUND
var isMusic = true;    //TODO make true when on autoplay
var isFun = false;
var explodeSound = false;

// SCORE & 2D CANVAS
var ctx ;
var score = 0;
var highScore = 0;
var difficulty = 5;

// SCREEN MODES
var isStartScreen = 1;  // game starts with start screen; TODO
var isPauseScreen = 0;  // screen that displays when you pause; TOOD
var isEndScreen = 0;  // screen that displays for game over or when you quit from the pause screen; TODO
var startScreen;

window.onload = function init()
{
    // SET UP WEBGL
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // look up the text canvas.
    var textCanvas = document.getElementById( "text" );

    // make a 2D context for it
    ctx = textCanvas.getContext( "2d" );

    // TODO: make the start screen

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

    // PLAYER
    generatePlayer();

    // STAR
    generateStar();

    // BUFFER AND ATTRIBUTES FOR THE NORMALS
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

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
    // save the projection matrix for the player (since the player will remain in the same place on the screen the whole game)
    playerProjectionMatrix = projectionMatrix;
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
    textureLoc = gl.getUniformLocation(program, "u_texture");

    // assign rainbow road texture to the path
    createTexture("Textures/rainbow.png");
    createFlippedTexture("Textures/rainbow.png");

    // Mario Textures
    generateStarEyesSquare();
    populateCubeTexCoords();
    createBrickTexture();
    createQuestionTexture();
    createPipeTexture();
    createDirtTexture();
    createGrassTexture();
    createCoinTexture();
    createStarEyesTexture();

    // TODO REMOVE??? DOES IT BLEND?
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    // ADD EVENT LISTENERS
    // for ASCII character keys
    addEventListener("keypress", function(event) {
        switch (event.keyCode) {
            case 103:  // 'g' key
                console.log("g key");
                isMarioMode = !isMarioMode;
                break;
            // TODO REMOVE THIS IS JUST FOR TESTING INVINCIBLE MODE
            case 105:  // 'i' key
                console.log("i key");
                isInvincible = !isInvincible;
                // invincibilityTimer = 5;  // set the invincibility timer
                break;
            case 112:  // 'p' key
                console.log("p key");
                isPaused = !isPaused;
                break;
            case 119:  // 'w' key
                console.log("w key");
                isAllWhite = !isAllWhite;
                break;
            case 102:  // 'f' key
                console.log("f key");
                isFlipped = !isFlipped;
                break;
            case 115:  // 's' key
                console.log("s key");
                document.getElementById('happySound').play();
                break;
            case 109:  // 'm' key
                console.log("m key");
                if( !isMusic )
                {
                    if( isFun )
                    {
                        document.getElementById('funSong').play();
                    }
                    else
                    {
                        document.getElementById('themeSong').play();
                    }
                }
                else
                {
                    document.getElementById('funSong').pause();
                    document.getElementById('themeSong').pause();
                }
                isMusic = !isMusic;
                break;
            case 113:  // 'q' key
                console.log("q key");
                document.getElementById('quitSound').play();
                // TODO RESET
                break;
            case 114:  // 'r' key
                console.log("r key");
                document.getElementById('frackOffSound').play();
                // TODO
                break;
            case 99:   // 'c' key
                console.log("c key");
                document.getElementById('crashSound').play();
                // TODO
                break;
            case 122:   // 'z' key
                console.log("z key");
                isFun = !isFun;
                if( isMusic )
                {
                    if( isFun )
                    {
                        document.getElementById('themeSong').pause();
                        document.getElementById('funSong').play();
                    }
                    else
                    {
                        document.getElementById('funSong').pause();
                        document.getElementById('themeSong').play();
                    }
                }
                break;
            case 101:   // 'e' key
                console.log("e key");
                isExploded = !isExploded;
                break;
            case 49:    // '1'
                console.log("Difficulty 1");
                difficulty = 5;
                break;
            case 50:    // '2'
                console.log("Difficulty 2");
                difficulty = 7;
                break;
            case 51:    // '3'
                console.log("Difficulty 3");
                difficulty = 10;
                break;
        }
    });

    // TODO: for testing purposes, remove after
    // for UP, DOWN, LEFT, RIGHT keys (no ASCII code since they are physical keys)
    addEventListener("keydown", function(event) {
        switch(event.keyCode) {
            // TODO REMOVE only for testing
            case 188:   // ',' key aka <
                // currDegrees has opposite sign of rotation degree because we are facing in opposite direction to rotation
                currDegrees += 4;
                console.log("<");
                projectionMatrix = mult(projectionMatrix, rotate(-4, vec3(0, 1, 0)));
                gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
                break;
            case 190:   // '.' key aka >
                currDegrees -= 4;
                console.log(">");
                projectionMatrix = mult(projectionMatrix, rotate(4, vec3(0, 1, 0)));
                gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
                break;

            // KEEP FOR GAME NAVIGATION
            case 37:  // LEFT key
                leftKeyDown = true;
                break;
            case 39:  // RIGHT key
                rightKeyDown = true;
                break;
        }
    });

    addEventListener("keyup", function(event) {
        switch(event.keyCode) {
        case 37: // LEFT key
            leftKeyDown = false;
            break;
        case 39: // RIGHT key
            rightKeyDown = false;
            break;
        }
    });

    // draw the first line of cubes
    generateNewCubeLine();

    render(0);
}

// called repeatedly to render and draw our scene
function render(timeStamp)
{
    // clear colour buffer and depth buffer
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Clear the 2D canvas that has the text
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // first, get the time difference since the last call to render
    var timeDiff = (timeStamp - prevTime)/1000;  // must divide by 1000 since measured in milliseconds

    if (!isPaused) {
        // move the cubes forward at a constant speed
        amountToMove = stepSize * timeDiff;  // amount to move the cubes by in order to maintain constant speed down the screen
        prevTime = timeStamp;  // set the previous time for the next iteration equal to the current time
        cubeLineDistanceTraveled += amountToMove;

        // incrementing the score if the cube is running / not paused
        score += timeDiff;
    }
    else {  // if the game is paused, don't move the cubes, but make sure to keep updating thw timer
        amountToMove = 0;
        prevTime = timeStamp;
    }

    // set up Mario gameplay mode
    if (isMarioMode)
    {
        setupMarioEnvironment();
    }
    else
    {
        gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    }

    // check if in invicibility mode
    if (isInvincible) {
        invincibilityTimer -= timeDiff;  // count down until return back to regular Mario mode
        if (invincibilityTimer < 0) {
            isInvincible = 0;
            invincibilityTimer = maxInvincibleTime;  // reset the invincibility mode timer
        }
    }

    // TODO exploding cube upon collision
    if( isExploded )
    {
        if (isMarioMode) {
            // applyBrickTexture();     // TODO: why does this look jank?
        }

        if (!isInvincible || hasHitBorder ) {   // if invincible, don't pause after hitting a cube
            isPaused = true;
            if( Math.floor( score ) > highScore )
            {
                highScore = Math.floor( score );
            }
        }
        explodeCube( timeDiff, playerXPos );
        if( !explodeSound )
        {
            document.getElementById('crashSound').play();
            explodeSound = true;
        }
    }

    // Update lateral movement
    movementFSM.update(rightKeyDown, leftKeyDown);
    var velocity = movementFSM.velocity;
    cameraTransformMatrix = mult(inverse(translate(velocity, 0, 0)), cameraTransformMatrix);
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
    playerXPos += velocity;

    if (velocity > 0) {
        playerTilt = 1;
    }
    else if (velocity < 0) {
        playerTilt = -1;
    }
    else {
        playerTilt = 0;
    }

    // TODO REMOVE testing textures for mario
    drawMarioCubes();

    drawStar();

    // Draw the path
    // Step size of 1 unit, moves at a constant rate
    drawPath(timeDiff);
    // TODO REMOVE keep path from scrolling
    // drawPath(0);

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

    // check to see if the player has collided with any cubes --> game over
    playerCollisionDetection();

    // Draw player last because we want transparent shadows
    drawPlayer();

    //placing the text on the canvas
    ctx.font = "bold 24px Courier"
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Score: " + Math.floor( score ), 50, 50);
    ctx.fillText("High Score: " + highScore, 725, 50);



    // render again (repeatedly as long as program is running or the game isn't paused)
    requestAnimationFrame( render );
}
