// PIRANHA

// Set to wherever you want to translate piranha to
var piranha_x = 0;
var piranha_z = -2;

var isUpwards = true;
var piranhaTime = 0;
var piranhaStage = 0;
var piranhaHeights = [ 0, 0.1, 0.15, 0.2, 0.25, 0.3 ];

var headAngle = 0;
var turnLeft = false;

var upperLipCounter = 10;
var lowerLipCounter = 10;
var lipCountUp = true;
var moveLip = false;

var spotPositions =
[
  vec3( -0.9,   0.6,  0.8),
  vec3(  0.3,   0.9,  0.7),
  vec3(  0.5,  -0.9,  0.6),
  vec3( -1.2,  -0.6,  0.4),
  vec3(  1.2,   0.3,  0.6),
  vec3( -0.85,  0.1, -0.4),
  vec3(  1.25, -0.5, -0.1)
];

var spotSizes =
[
  1, 0.9, 1, 0.7, 0.8, 1.1, 0.7
];

var lipHeights =
[
  -0.1, -0.09, -0.08, -0.07, -0.06, -0.05, -0.04, -0.03, -0.02, -0.01, 
  0.0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1
]

var lowerTeethPositions =
[
  vec3( -0.7,   0.1,  0.05),
  vec3( -0.25,  0.0,  0.15),
  vec3(  0.25,  0.0,  0.15),
  vec3(  0.7,   0.1,  0.05)
];

var upperTeethPositions =
[
  vec3( -0.8,  0.0,  0.05),
  vec3( -0.4,  0.05, 0.15),
  vec3(  0.0,  0.05, 0.2),
  vec3(  0.4,  0.05, 0.15),
  vec3(  0.8,  0.0,  0.05)
];

var toothPoints =
[
  vec4( -0.5, 0.5, 0.0, 1.0 ),  // 0 Near left
  vec4(  0.5, 0.5, 0.0, 1.0 ),  // 1 Near right
  vec4(  0.0, 1, 0.0, 1.0 )   // 2 Far point
];

var piranhaToothBuffer;
var toothNormals = [];

function drawPiranha()
{
  // modelTransformMatrix = mat4();
  // modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 5, 30 ));

  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, 1.5, 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.3, 0.3, 0.3 ));
  var piranhaModelTransformMatrix = modelTransformMatrix;

  // HEAD

  modelTransformMatrix = piranhaModelTransformMatrix;
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 2, 2, 2 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere( 11 ); // red

  // SPOTS

  modelTransformMatrix = piranhaModelTransformMatrix;
  var spotModelTransformMatrix = modelTransformMatrix;

  for( var i = 0; i < 7; i++ )
  {
    modelTransformMatrix = spotModelTransformMatrix;
    modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
    modelTransformMatrix = mult( modelTransformMatrix, translate( spotPositions[i] ));
    modelTransformMatrix = mult( modelTransformMatrix, scalem( spotSizes[i], spotSizes[i], spotSizes[i] ));

    gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

    drawSphere( 0 ); // white
  }

  // MOUTH

  // Upper Mouth

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateZ( -5 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, lipHeights[upperLipCounter], 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( -0.6, -0.22, 1.2 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.3, 1 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere( 0 ); // white

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateZ( 5 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, lipHeights[upperLipCounter], 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0.6, -0.22, 1.2 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.3, 1 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere( 0 ); // white

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, lipHeights[upperLipCounter], 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, -0.25, 1.2 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.3, 1 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere( 0 ); // white

  // Lower Mouth

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateZ( 8 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, lipHeights[lowerLipCounter], 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( -0.4, -1, 0.9 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.3, 1 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere( 0 ); // white

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateZ( -8 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, lipHeights[lowerLipCounter], 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0.4, -1, 0.9 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.3, 1 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere( 0 ); // white

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, lipHeights[lowerLipCounter], 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, -1, 0.9 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.9, 0.3, 1 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere( 0 ); // white

  // Inner Mouth

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 0, -0.6, 1.3 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 1.3, 0.4, 0.63 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawSphere( 5 ); // black

  // TEETH - white or yellow

  modelTransformMatrix = piranhaModelTransformMatrix;
  var toothModelTransformMatrix = modelTransformMatrix;

  for( var it = 0; it < 4; it++ )
  {
    modelTransformMatrix = toothModelTransformMatrix;
    modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
    modelTransformMatrix = mult( modelTransformMatrix, translate( lowerTeethPositions[it] ));
    modelTransformMatrix = mult( modelTransformMatrix, translate( 0, lipHeights[lowerLipCounter], 0 ));
    modelTransformMatrix = mult( modelTransformMatrix, translate( 0, -1.2, 1.8 ));
    modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.5, 0.5, 0.5 ));

    gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

    drawPiranhaTooth(17); // yellow
  }

  for( var it = 0; it < 5; it++ )
  {
    modelTransformMatrix = toothModelTransformMatrix;
    modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
    modelTransformMatrix = mult( modelTransformMatrix, translate( upperTeethPositions[it] ));
    modelTransformMatrix = mult( modelTransformMatrix, translate( 0, lipHeights[upperLipCounter], 0 ));
    modelTransformMatrix = mult( modelTransformMatrix, translate( 0, -0.2, 1.8 ));
    modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.5, 0.5, 0.5 ));
    modelTransformMatrix = mult( modelTransformMatrix, rotateZ( 180 ));

    gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

    drawPiranhaTooth(17); // yellow
  }

  // STEM - green

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( -0.25, -5, 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.5, 3, 0.5 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawCube(18); // green

  // LEAVES - green

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( 1.5, -7, 1 ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateX( 30 ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( -30 ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateZ( -30 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.7, 7, 2 ));


  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawPiranhaTooth(18); // green

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, rotateY( headAngle ));
  modelTransformMatrix = mult( modelTransformMatrix, translate( -1.1, -6, 0 ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateX( 15 ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateY( 30 ));
  modelTransformMatrix = mult( modelTransformMatrix, rotateZ( 30 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 0.7, 5, 2 ));


  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  drawPiranhaTooth(18); // green

  // Pipe

  modelTransformMatrix = piranhaModelTransformMatrix;

  modelTransformMatrix = mult( modelTransformMatrix, translate( -0.75, -5, -0.4 ));
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 1.5, 1.5, 1.5 ));

  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  applyTexture(pipeCoords);
  drawCube(4);

  // if (!isPaused)
  // {
  if (headAngle == 30 )
  {
    turnLeft = false;
  }
  else if (headAngle == -30 )
  {
    turnLeft = true;
  }
  if (turnLeft)
  {
    headAngle += 0.5;
  }
  else
  {
    headAngle -= 0.5;
  }

  if (moveLip)
  {
    if (upperLipCounter == lipHeights.length - 1 )
    {
      lipCountUp = false;
    }
    else if (upperLipCounter == 0 )
    {
      lipCountUp = true;
    }
    if (lipCountUp)
    {
      upperLipCounter++;
      lowerLipCounter--;
    }
    else
    {
      upperLipCounter--;
      lowerLipCounter++;
    }
  }
  moveLip = !moveLip;
  // }
  
}

function generatePiranhaTooth()
{
  var t1 = subtract(toothPoints[1], toothPoints[0]);
  var t2 = subtract(toothPoints[2], toothPoints[1]);
  var normal = cross(t1, t2);

  toothNormals.push(normal);
  toothNormals.push(normal);
  toothNormals.push(normal);

  piranhaToothBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, piranhaToothBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(toothPoints), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
}

function drawPiranhaTooth(colorIndex)
{
  // Disable the texture
    gl.disableVertexAttribArray(texCoordLoc);

    enableTexture = false;
    gl.uniform1f(enableTextureLoc, enableTexture);

    // Enable normals for lighting
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(toothNormals), gl.STATIC_DRAW );

    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // Bind the current buffer to draw
    gl.bindBuffer( gl.ARRAY_BUFFER, piranhaToothBuffer );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

    // Set color
    gl.uniform4fv(currentColourLoc, colors[colorIndex]);

    gl.drawArrays( gl.TRIANGLES, 0, 3 );
}
