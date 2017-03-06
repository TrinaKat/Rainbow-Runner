// Curves

// Bezier Curve Implementation
// http://www.moshplant.com/direct-or/bezier/math.html
// https://www.desmos.com/calculator/cahqdxeshd

var curvePoints = [];
var numCurveVertices = 0;
var curveBuffer;

// Two endpoints (p0 is origin endpoint, p3 is destination endpoint)
// Two control points (p1 and p2)
// Equations define the points on the curve, evaluated for an arbitrary number of values of t between 0 and 1
// Aka t = 0.01 means that in increments of 0.01 from 0 to 1 draw a segment for the curve
function curve( single, t, p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y )
{
  var cX = 3 * (p1_x - p0_x);
  var bX = 3 * (p2_x - p1_x) - cX;
  var aX = p3_x - p0_x - cX - bX;

  var cY = 3 * (p1_y - p0_y);
  var bY = 3 * (p2_y - p1_y) - cY;
  var aY = p3_y - p0_y - cY - bY;

  var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0_x;
  var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0_y;

  // Push point twice so it has ending vertice and starting vertice
  curvePoints.push( vec4( x, y, 0, 1 ));
  numCurveVertices++;
  if( !single )
  {
    curvePoints.push( vec4( x, y, 0, 1 ));
    numCurveVertices++;
  }
}

var curveVertices =
[
  [ [ 0.8, 0.7 ], [ 0.3, 0.9 ], [ 0.13, 0.13 ], [ 0.71, 0.25 ] ],
  [ [ 1.1, 1.05 ], [ 0.72, 1.3 ], [ 0.3, 0.85 ], [ 0.57, 0.65 ] ],
  [ [ 1.5, 1.1 ], [ 1.3, 1.52 ], [ 0.87, 1.269 ], [ 0.86, 1.05 ] ],
  [ [ 1.81, 0.95 ], [ 1.78, 1.17 ], [ 1.41, 1.19 ], [ 1.25, 0.85 ] ],
  [ [ 1.85, 0.6 ], [ 2.35, 1.0 ], [ 1.83, 1.1 ], [ 1.65, 0.84 ] ],
  [ [ 1.3, 0.4 ], [ 1.8, -0.2 ], [ 2.3, 0.8 ], [ 1.5, 0.7 ] ],
  [ [ 1.0, 0.33 ], [ 1.1, 0.055 ], [ 1.4, 0.11 ], [ 1.5, 0.3 ] ],
  [ [ 0.715, 0.5 ], [ 0.25, 0.15 ], [ 0.986, 0.0 ], [ 1.1, 0.3 ] ]
];

function generateCurve()
{
  var accuracy = 0.1; //this'll give the bezier 100 segments

  for( var it = 0; it < curveVertices.length; it++ )
  {
    curve(true, 0, curveVertices[it][0][0], curveVertices[it][0][1],
                   curveVertices[it][1][0], curveVertices[it][1][1],
                   curveVertices[it][2][0], curveVertices[it][2][1],
                   curveVertices[it][3][0], curveVertices[it][3][1] );

    for( var i = accuracy; i < 1 - accuracy; i += accuracy )
    {
      curve(false, i, curveVertices[it][0][0], curveVertices[it][0][1],
                      curveVertices[it][1][0], curveVertices[it][1][1],
                      curveVertices[it][2][0], curveVertices[it][2][1],
                      curveVertices[it][3][0], curveVertices[it][3][1] );
    }

    curve(true, 1 - accuracy, curveVertices[it][0][0], curveVertices[it][0][1],
                              curveVertices[it][1][0], curveVertices[it][1][1],
                              curveVertices[it][2][0], curveVertices[it][2][1],
                              curveVertices[it][3][0], curveVertices[it][3][1] );
  }

  curveBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, curveBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten( curvePoints ), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
}

var cloud1_x = -7;
var cloud2_x = 6;

function drawCurve()
{
  gl.disableVertexAttribArray(vNormal);
  gl.disableVertexAttribArray(texcoordLoc);

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, curveBuffer );
  // gl.bufferData( gl.ARRAY_BUFFER, flatten( curvePoints ), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
 

  // Change the color to RED TODO to be clearly visible
  gl.uniform4fv( currentColourLoc, colors[1] );


  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up star transformations
  modelTransformMatrix = translate( cloud1_x, 8, 29 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 3.0, 1.8, 2.0 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.LINES, 0, numCurveVertices );

  modelTransformMatrix = translate( cloud2_x, 6, 29 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 2.3, 1.3, 2.0 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.LINES, 0, numCurveVertices );

  if( !isPaused )
  {
    cloud1_x -= 0.01;
    cloud2_x -= 0.01;
  }

  if( cloud1_x < -15 )
  {
    cloud1_x = 9;
  }
  if( cloud2_x < -15 )
  {
    cloud2_x = 9;
  }

  // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));

  gl.enableVertexAttribArray(vNormal);
}
