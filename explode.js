// Explode

// Outermost Layer
var explodePositions_x =
[ -0.5, -0.3, -0.4, -0.2, 0.1, 0.3, 0.1, 0.2, 0.4 ];

var explodePositions_y =
[ 0.5, 0.7, 0.9, 0.6, 1.2, 0.7, 0.5, 0.6, 0.9 ];

var explodePositions_z =
[ 0.0, -0.2, -0.5, -0.7, -0.3, -0.8, -0.1, -0.4, -0.7 ];

var explodeAngle =
[ 210, 160, 120, 80, 40, 30, -20, -10, 20 ];

// Middle Layer
var explodePositions2_x =
[ -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4 ];

var explodePositions2_y =
[ 0.2, 0.3, 0.4, 0.5, 0.6, 0.5, 0.4, 0.3, 0.2 ];

var explodePositions2_z =
[ 0.0, -0.2, -0.5, -0.7, -0.3, -0.8, -0.1, -0.4, -0.7 ];

var explodeAngle2 =
[ 210, 160, 120, 80, 60, 40, 20, -10, -30 ];

// Innermost Layer
var explodePositions3_x =
[ -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4 ];

var explodePositions3_y =
[ 0.2, 0.3, 0.4, 0.5, 0.6, 0.5, 0.4, 0.3, 0.2 ];

var explodePositions3_z =
[ -0.7, -0.4, -0.1, -0.7, -0.3, -0.8, -0.5, -0.2, 0.0 ];

var explodeAngle3 =
[ 210, 160, 120, 80, 60, 40, 20, -10, -30 ];


// Modify and apply the model transform matrix for the cubes
function transformExplodeCube( xPosition, yPosition, zPosition, scaleVal )
{
    modelTransformMatrix = mat4();
    modelTransformMatrix = mult( modelTransformMatrix, translate(xPosition, yPosition, zPosition));
    modelTransformMatrix = mult( modelTransformMatrix, translate(0, 0, cameraPositionZAxis - 10));

    modelTransformMatrix = mult( modelTransformMatrix, scalem( scaleVal, scaleVal, scaleVal ));

    gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));
}

function explodeCube( timeDiff, x )
{
  // If larger than 1.5, then stop drawing
  if( Math.abs( explodePositions_x[0] ) < 1.5 )
  {
    // Outermost layer of larger cubes
    for( var i = 0; i < explodePositions_x.length; i++ )
    {
      // Calculate translation position due to angle
      var angle = explodeAngle[i];
      explodePositions_x[i] = explodePositions_x[i] + 2.0 * timeDiff * Math.cos( radians( angle ));
      explodePositions_y[i] = explodePositions_y[i] + 2.0 * timeDiff * Math.sin( radians( angle ));

      // Move the cube to the correct position
      transformExplodeCube( explodePositions_x[i] + x, explodePositions_y[i], explodePositions_z[i], 0.2 );

      // Draw the cubes and outlines
      drawOutline();
      // Set the colour for the cube
      drawCube(5);
    }
    // Middle layer of medium cubes
    for( var it = 0; it < explodePositions2_x.length; it++ )
    {
      // Calculate translation position due to angle
      var angle2 = explodeAngle2[it];
      explodePositions2_x[it] = explodePositions2_x[it] + 1.3 * timeDiff * Math.cos( radians( angle2 ));
      explodePositions2_y[it] = explodePositions2_y[it] + 1.3 * timeDiff * Math.sin( radians( angle2 ));

      // Move the cube to the correct position
      transformExplodeCube( explodePositions2_x[it] + x, explodePositions2_y[it], explodePositions2_z[it], 0.14 );

      // Draw the cubes and outlines
      drawOutline();
      // Set the colour for the cube
      drawCube(4);
    }
    // Innermost layer of small cubes
    for( var iter = 0; iter < explodePositions3_x.length; iter++ )
    {
      // Calculate translation position due to angle
      var angle3 = explodeAngle3[iter];
      explodePositions3_x[iter] = explodePositions3_x[iter] + 0.6 * timeDiff * Math.cos( radians( angle3 ));
      explodePositions3_y[iter] = explodePositions3_y[iter] + 0.6 * timeDiff * Math.sin( radians( angle3 ));

      // Move the cube to the correct position
      transformExplodeCube( explodePositions3_x[iter] + x, explodePositions3_y[iter], explodePositions3_z[iter], 0.08 );

      // Draw the cubes and outlines
      drawOutline();
      // Set the colour for the cube
      drawCube(3);
    }
  }
  else
  {
    isExploded = false;

    explodePositions_x =
    [ -0.5, -0.3, -0.4, -0.2, 0.1, 0.3, 0.1, 0.2, 0.4 ];

    explodePositions_y =
    [ 0.5, 0.7, 0.9, 0.6, 1.2, 0.7, 0.5, 0.6, 0.9 ];

    explodePositions_z =
    [ 0.0, -0.2, -0.5, -0.7, -0.3, -0.8, -0.1, -0.4, -0.7 ];

    explodeAngle =
    [ 210, 160, 120, 80, 40, 30, -20, -10, 20 ];

    // Middle Layer
    explodePositions2_x =
    [ -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4 ];

    explodePositions2_y =
    [ 0.2, 0.3, 0.4, 0.5, 0.6, 0.5, 0.4, 0.3, 0.2 ];

    explodePositions2_z =
    [ 0.0, -0.2, -0.5, -0.7, -0.3, -0.8, -0.1, -0.4, -0.7 ];

    explodeAngle2 =
    [ 210, 160, 120, 80, 60, 40, 20, -10, -30 ];

    // Innermost Layer
    explodePositions3_x =
    [ -0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4 ];

    explodePositions3_y =
    [ 0.2, 0.3, 0.4, 0.5, 0.6, 0.5, 0.4, 0.3, 0.2 ];

    explodePositions3_z =
    [ -0.7, -0.4, -0.1, -0.7, -0.3, -0.8, -0.5, -0.2, 0.0 ];

    explodeAngle3 =
    [ 210, 160, 120, 80, 60, 40, 20, -10, -30 ];
  }
}
