"use strict";

// SET UP WEBGL AND HTML CANVAS
var canvas;
var gl;
var program;

// Colors
// Use this to index through the cube colours
var currColour = 0;
// Array of array to store the colours for every cube generated
// (index into this the same way that you index into allCubeLineXPositions)
var allCubeColours = [];

// BOOLEANS for game states
var isAllWhite = 0;
var isForBorder = 0;
var isPaused = 1;
var isExploded = 0;
var hasHitBorder = 0;
var isGameOver = false;
var isStartSequence = true;
var startSequenceTimer = 4.3;
var enableTexture = false;
var isFlipped = false;
var gameOverSoundHasPlayed = false;
var gameHasStarted = false;

var devModeOn = false;

// SOUND
var isMusic = false;    // Make true when on autoplay
var isFun = false;
var explodeSound = false;

// SCORE
var ctx ;               // TODO move code to different file
var score = 0;
var highScore = 0;
var difficulty = 5;

// DECLARE VARIABLES FOR UNIFORM LOCATIONS
var modelTransformMatrixLoc;
var cameraTransformMatrixLoc;
var projectionMatrixLoc;
var currentColourLoc;
var enableTextureLoc;
var texCoordLoc;
var textureLoc;

// INITIALIZE ALL TRANSFORMATION MATRICES
var modelTransformMatrix = mat4();
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
var shadowBuffer;
var nBuffer;

// INITIALIZE CAMERA VARIABLES
var currentFOV = 45;
var currDegrees = 0;            // indicate current degree for the azimuth of the camera heading
var cameraPositionZAxis = 50;   // camera's initial position along the z-axis
var cameraPositionYAxis = 0;    // camera's initial position along the y-axis
var cameraPitch = 5;            // camera's pitch (want scene to be rotated down along x-axis so we can see the tops of the cubes)

// VARIABLES TO MOVE THE CUBES
var prevTime = 0;                        // Calculate the time difference between calls to render
var stepSize = 40;
var amountToMove = 0;
var allCubeLineXPositions = [];          // Array of arrays containing X positions for all cubes in a line
var allCubeLineZPositions = [];          // array containing the Z position for each cube line
var numCubeLines = (2 * cameraPositionZAxis) / stepSize;   // the total number of active cube lines we have displayed at a time
var cubeLineDistanceTraveled = 0;        // Keep track of Z distance traveled by each line (elements correspond to those in allCubeLineXPositions)

// NAVIGATION
var rotDegrees = 0;
var translateAmount = 0;
var playerTilt = 0;
var amountToTilt = 5;

// Stuff for navigation FSM
var rightKeyDown = false;
var leftKeyDown = false;
var upKeyDown = false;

var movementFSM = new MovementFSM();
var jumpFSM = new JumpFSM();

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

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    // LOAD SHADERS AND INITIALIZE ATTRIBUTE BUFFERS
    program = initShaders( gl, "vertex-shader", "fragment-shader" );  // compile and link shaders, then return a pointer to the program
    gl.useProgram( program );

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

    eventListeners();

    // Populate all the points, create all the textures
    generateEverything();

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
    if (isStartScreen)
    {
        displayStartScreen();
    }

    // play the intro sequence if we are just starting the game
    if (isIntroTransition)
    {
        introTransition();
    }

    // display the game over screen
    if (isGameOver)
    {
        displayEndScreen();
        isPaused = true;
        if( !gameOverSoundHasPlayed && isMarioMode )
        {
            document.getElementById('dieSound').play();
            gameOverSoundHasPlayed = true;
        }
    }

    // first, get the time difference since the last call to render
    // must divide by 1000 since measured in milliseconds
    var timeDiff = (timeStamp - prevTime)/1000;

    if( isMarioMode )
    {
        goombaJumpTime += timeDiff;
    }

    if (!isPaused)
    {
        // move the cubes forward at a constant speed
        // amount to move the cubes by in order to maintain constant speed down the screen
        amountToMove = stepSize * timeDiff;
        prevTime = timeStamp;
        cubeLineDistanceTraveled += amountToMove;

        // incrementing the score if the cube is running / not paused / start sequence
        if( !isMarioMode || (isMarioMode && !isStartSequence))
        {
            score += timeDiff;
        }
        // if( isMarioMode )
        // {
        //     goombaJumpTime += timeDiff;
        // }
    }
    // if the game is paused, don't move the cubes
    // make sure to keep updating the timer
    else
    {
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
        if ( !isStarCoinLastExploded && !isGoombaLastExploded && ( !isInvincible || hasHitBorder ))
        {   // if invincible, don't pause after hitting a cube
            isPaused = true;
            isGameOver = true;
            if( Math.floor( score ) > highScore )
            {
                highScore = Math.floor( score );
            }
        }
        if( !explodeSound && !isStarCoinLastExploded)
        {
            playCubeCrashMusic();
        }
        explodeCube( timeDiff, playerXPos );
    }

    // Update lateral movement
    movementFSM.update(rightKeyDown, leftKeyDown);
    var velocity = movementFSM.velocity * timeDiff;

    var verticalVelocity = 0;

    if (isMarioMode && !isPaused )
    {
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
    // gl.disable(gl.DEPTH_TEST);
    drawPath(timeDiff * 0.4);

    // To keep path from scrolling
    // drawPath(0);

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
    // If jumping, draw shadow on top as player will be on top
    if (allCubeLineZPositions[closestCubeLine] > playerTipPosZ && !jumpFSM.state)
    {
        // Draw player shadow AFTER path because we want transparent shadows but BEFORE cubes
        drawPlayerShadowsWithDepth();
        drewShadow = true;
    }

    // Draw the clouds
    if( isMarioMode )
    {
        // drawGoomba();

        // Back to Front Order

        drawCloudBig();
        drawCloudSmall();

        drawCloudLakitu();
        drawLakituCurve();
        drawCloudFace();
        drawLakitu();

        drawCurve();

        if( isStartSequence && !isStartScreen && !isInstructionScreen )
        {
            lakituStartSequence();
            startSequenceTimer -= timeDiff;
        }
    }


    // draw the cube border on both sides
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

    if (devModeOn)
    {
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
        drawPlayerLogo();
    }

    // TODO MOVE THIS placing the text on the canvas
    ctx.font = "24px eightbit"
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Score: " + Math.floor( score ), 50, 50);
    ctx.fillText("High Score: " + highScore, 760, 50);

    // render again (repeatedly as long as program is running or the game isn't paused)
    requestAnimationFrame( render );
}
