"use strict";

// SET UP WEBGL AND HTML CANVAS
var canvas;
var gl;
var program;

// DATA STORAGE FOR POINTS, COLOURS, ETC.

var currColour = 0;  // use this to index through the cube colours
var allCubeColours = [];  // array of array to store the colours for every cube generated (index into this the same way that you index into allCubeLineXPositions)

// BOOLEANS
var isAllWhite = 0;  // 0: cubes are different shades of white and grey; 1: cubes are all white
var isForBorder = 0;
var isExploded = 0;
var hasHitBorder = 0;
var isGameOver = false;
var isStartSequence = true;
var startSequenceTimer = 5;

// DECLARE VARIABLES FOR UNIFORM LOCATIONS
var modelTransformMatrixLoc;
var cameraTransformMatrixLoc;
var projectionMatrixLoc;
var currentColourLoc;
var enableTextureLoc;
var texCoordLoc;
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
var shadowBuffer;
var nBuffer;

// INITIALIZE VARIABLES
var currentFOV = 45;   // adjust this later for narrow or width FOV
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
var isPaused = 1;  // 0: not paused so all the cubes move; 1: paused so the cubes remain stationary

// NAVIGATION
var rotDegrees = 0;
var translateAmount = 0;
var playerTilt = 0;  // no tilt by default
var amountToTilt = 5;

// Stuff for navigation FSM
var rightKeyDown = false;
var leftKeyDown = false;
var upKeyDown = false;

var movementFSM = new MovementFSM();
var jumpFSM = new JumpFSM();

// SOUND
var isMusic = false;    // TODO Make true when on autoplay
var isFun = false;
var explodeSound = false;

// SCORE & 2D CANVAS
var ctx ;
var score = 0;
var highScore = 0;
var difficulty = 5;


var devModeOn = false;

// TODO
var isDrawBorder = 0;

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
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    //gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    // LOAD SHADERS AND INITIALIZE ATTRIBUTE BUFFERS
    program = initShaders( gl, "vertex-shader", "fragment-shader" );  // compile and link shaders, then return a pointer to the program
    gl.useProgram( program );


    // POPULATE THE POINTS,OUTLINE POINTS, AND PATH POINTS ARRAY
    generateCube();
    generateSphere();
    generateCubeOutline();
    generatePath();

    // PLAYER
    generatePlayer();

    // STAR
    generateStar();

    // TODO CLOUD
    generateCurve();
    generateLakituCurve();

    createCloudFaceTexture();
    generateCloudFaceSquare();

    createLakituTexture();
    createLakituStartTexture();
    generateLakituSquare();

    createCloudBigTexture();
    generateCloudBigSquare();

    createCloudSmallTexture();
    generateCloudSmallSquare();

    createCloudLakituTexture();
    generateCloudLakituSquare();

    createGoombaFaceTexture();
    generateGoombaFaceSquare();

    // TODO: REMOVE
    generateIntroCubes();

    // CREATE BUFFERS FOR THE CUBE, OUTLINE, AND PATH
    vBuffer = gl.createBuffer();
    vOutlineBuffer = gl.createBuffer();
    vPathBuffer = gl.createBuffer();
    shadowBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();
    sphereBuffer = gl.createBuffer();

    // SET VALUES FOR UNIFORMS FOR SHADERS
    modelTransformMatrixLoc = gl.getUniformLocation(program, "modelTransformMatrix");
    cameraTransformMatrixLoc = gl.getUniformLocation(program, "cameraTransformMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    currentColourLoc = gl.getUniformLocation(program, "currentColour");

    // GET ATTRIBUTE LOCATION
    vNormal = gl.getAttribLocation( program, "vNormal" );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    texCoordLoc = gl.getAttribLocation( program, "a_texcoord" );

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
    populateCubeTexCoords();
    populatePipeTexCoords();
    createBrickTexture();
    createQuestionTexture();
    createPipeBorderTexture();
    createPipeTexture();
    createDirtTexture();
    createGrassTexture();
    createCoinTexture();
    createPlayerLogoTexture();

    // Coin Star
    generateCoinStar();
    createStarTexture();

    eventListeners();

    // draw the first line of cubes
    generateNewCubeLine();

    // startSequence();
    render(0);
}

// called repeatedly to render and draw our scene
function render(timeStamp)
{
    // clear colour buffer and depth buffer
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Clear the 2D canvas that has the text
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    displayGameBoyScreen();
    // display the start screen
    if (isStartScreen) {
        displayStartScreen();
    }

    // play the intro sequence if we are just starting the game
    if (isIntroTransition)
        introTransition();

    // display the game over screen
    if (isGameOver) {
        displayEndScreen();
        // if the user crashed into a cube, it will pause but there will be no remove screen
        isPaused = true;
    }

    // first, get the time difference since the last call to render
    var timeDiff = (timeStamp - prevTime)/1000;  // must divide by 1000 since measured in milliseconds

    if (!isPaused) {
        // move the cubes forward at a constant speed
        amountToMove = stepSize * timeDiff;  // amount to move the cubes by in order to maintain constant speed down the screen
        prevTime = timeStamp;  // set the previous time for the next iteration equal to the current time
        cubeLineDistanceTraveled += amountToMove;

        // incrementing the score if the cube is running / not paused / start sequence
        if( !isMarioMode || (isMarioMode && !isStartSequence))
        {
            score += timeDiff;
        }
    }
    else {  // if the game is paused, don't move the cubes, but make sure to keep updating thw timer
        amountToMove = 0;
        prevTime = timeStamp;
    }

    // set up Mario gameplay mode
    if (isMarioMode)
    {
        setupMarioEnvironment();

        playMarioMusic();

        if( !isPaused )
        {
            swapFeet -= timeDiff;
            if (swapFeet < 0)
            {
                swapFeet = 1;
                stepLeft = !stepLeft;
            }
        }
    }
    else
    {
        gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

        playRegularMusic();
    }

    // check if in invicibility mode
    if (isInvincible)
    {
        if( !isPaused )
        {
            invincibilityTimer -= timeDiff;  // count down until return back to regular Mario mode
        }
        // Give them a little leeway after flashing ends TODO make sure this is best time
        if( invincibilityTimer < -0.8 )
        {
            isInvincible = 0;
            invincibilityTimer = maxInvincibleTime;  // reset the invincibility mode timer
        }
        else if (invincibilityTimer < 0)
        {
            stopInvincibilityMusic();
        }

    }

    // Exploding cube upon collision
    if( isExploded )
    {
        if ( !isStarCoinLastExploded && ( !isInvincible || hasHitBorder ))
        {   // if invincible, don't pause after hitting a cube
            isPaused = true;
            isGameOver = true;
            if( Math.floor( score ) > highScore )
            {
                highScore = Math.floor( score );
            }
        }
        if( !explodeSound && !isStarCoinLastExploded )
        {
            playCubeCrashMusic();
        }
        explodeCube( timeDiff, playerXPos );
    }

    // Update lateral movement
    movementFSM.update(rightKeyDown, leftKeyDown);
    var velocity = movementFSM.velocity * timeDiff;

    var verticalVelocity = 0;

    if (isMarioMode && !isPaused ) {
        // Update jumping
        jumpFSM.update(upKeyDown);
        var verticalVelocity = jumpFSM.verticalVelocity();
    }

    cameraTransformMatrix = mult(inverse(translate(velocity, verticalVelocity, 0)), cameraTransformMatrix);
    gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
    playerXPos += velocity;
    playerYPos += verticalVelocity;

    if (velocity > 0)
    {
        playerTilt = 1;
    }
    else if (velocity < 0)
    {
        playerTilt = -1;
    }
    else
    {
        playerTilt = 0;
    }

    drawStar();

    // Draw the path
    // Step size of 0.8 units, moves at a constant rate
    drawPath(timeDiff * 0.8);

    // TODO REMOVE keep path from scrolling
    drawPath(0);

    // Determine which is the closest cube line right now
    var closestCubeLine = 1;
    var playerTipPosZ = cameraPositionZAxis - 10;
    var dist_1 = Math.abs(allCubeLineZPositions[0] - playerTipPosZ);
    var dist_2 = Math.abs(allCubeLineZPositions[1] - playerTipPosZ);    // Generally is this one
    var dist_3 = Math.abs(allCubeLineZPositions[2] - playerTipPosZ);

    if ( dist_2 < dist_2 && dist_2 < dist_3 )
    {
        closestCubeLine = 2;
    }
    else if (dist_3 < dist_1 && dist_3 < dist_2)
    {
        closestCubeLine = 3;
    }

    // If you didn't draw shadow, draw it later
    var drewShadow = false;

    // If cube is behind player (closer to camera), draw player shadow first
    if (allCubeLineZPositions[closestCubeLine] > playerTipPosZ && !jumpFSM.state) // If jumping, draw shadow as player will be on top
    {
        // Draw player shadow AFTER path because we want transparent shadows but BEFORE cubes
        drawPlayerShadowsWithDepth();
        drewShadow = true;
    }

    // Draw the clouds
    if( isMarioMode )
    {
        drawGoomba();

        // Back to Front Order
        // Enable Blending
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);

        drawCloudBig();
        drawCloudSmall();

        drawCloudLakitu();
        drawLakituCurve();
        drawCloudFace();
        drawLakitu();

        gl.depthMask(true);
        gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);

        drawCurve();

        if( isStartSequence && !isStartScreen && !isInstructionScreen )
        {
            lakituStartSequence();
            startSequenceTimer -= timeDiff;
        }
    }


    // draw the cube border on both sides
    if (isDrawBorder)
        drawBorder();

    // check to see if you have moved the current cube line far anough and you should generate a new cube line
    // 5 means that we want to have a 5 unit separation between each cube line
    if (cubeLineDistanceTraveled >= 5)
    {
        generateNewCubeLine();
        cubeLineDistanceTraveled = 0;  // reset the value
    }

    // draw all of the cubes and move them forward at constant rate
    drawAndMoveAllCubes();

    // check to see if any of the cubes have moved past the camera and are now out of range; if so, delete them
    destroyOutOfRangeCubes();

    // check to see if the player has collided with any cubes --> game over
    playerCollisionDetection();

    if (devModeOn) {
        isExploded = false;
        isGameOver = false;
        isPaused = false;
        hasHitBorder = false;
        isStartSequence = false;
    }

    // If cube is in front of player (ahead of player point), draw cubes first
    if (!drewShadow)
    {
        // Draw player shadow AFTER path because we want transparent shadows
        drawPlayerShadowsWithDepth();
    }

    // Draw player AFTER path because we want transparent shadows but BEFORE cubes
    drawPlayerBody();

    if (isMarioMode)
    {
        // Enable Blending
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);

        drawPlayerLogo();

        gl.depthMask(true);
        gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
    }

    //placing the text on the canvas
    ctx.font = "24px eightbit"
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Score: " + Math.floor( score ), 50, 50);
    ctx.fillText("High Score: " + highScore, 660, 50);

    // render again (repeatedly as long as program is running or the game isn't paused)
    requestAnimationFrame( render );
}
