// Curves

// Bezier Curve Implementation
// http://www.moshplant.com/direct-or/bezier/math.html
// https://www.desmos.com/calculator/cahqdxeshd

var curvePoints = [];
var numCurveVertices = 0;
var curveBuffer;

var lakituBuffer;
var numLakituVertices = 0;
var lakituPoints = [];

var curveVertices =
[
  [ [ 0.8, 0.7 ],   [ 0.3, 0.9 ],   [ 0.13, 0.13 ],  [ 0.71, 0.25 ] ],
  [ [ 1.1, 1.05 ],  [ 0.72, 1.3 ],  [ 0.3, 0.85 ],   [ 0.57, 0.65 ] ],
  [ [ 1.5, 1.1 ],   [ 1.3, 1.52 ],  [ 0.87, 1.269 ], [ 0.86, 1.05 ] ],
  [ [ 1.81, 0.96 ], [ 1.78, 1.17 ], [ 1.41, 1.19 ],  [ 1.25, 0.85 ] ],
  [ [ 1.85, 0.65 ], [ 2.1, 0.9 ],   [ 1.8, 1.0 ],    [ 1.65, 0.94 ] ],
  [ [ 1.3, 0.4 ],   [ 1.8, -0.2 ],  [ 2.3, 0.8 ],    [ 1.5, 0.7 ] ],
  [ [ 1.0, 0.33 ],  [ 1.1, 0.055 ], [ 1.4, 0.11 ],   [ 1.5, 0.3 ] ],
  [ [ 0.715, 0.5 ], [ 0.25, 0.15 ], [ 0.986, 0.0 ],  [ 1.1, 0.3 ] ]
];

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

function generateCurve()
{
  var accuracy = 0.1; //This'll give the bezier 10 segments, 0.01 for 100, etc.

  for( var it = 0; it < curveVertices.length; it++ )
  {
    // Add the starting vertex
    curve(true, 0, curveVertices[it][0][0], curveVertices[it][0][1],
                   curveVertices[it][1][0], curveVertices[it][1][1],
                   curveVertices[it][2][0], curveVertices[it][2][1],
                   curveVertices[it][3][0], curveVertices[it][3][1] );

    // Adds two of each inbetween vertex, so for end of previous segment and start of next segment
    for( var i = accuracy; i < 1 - accuracy; i += accuracy )
    {
      curve(false, i, curveVertices[it][0][0], curveVertices[it][0][1],
                      curveVertices[it][1][0], curveVertices[it][1][1],
                      curveVertices[it][2][0], curveVertices[it][2][1],
                      curveVertices[it][3][0], curveVertices[it][3][1] );
    }

    // Ending vertex
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
var cloud2_x = 3;

function drawCurve()
{
  // No lighting/texture needed here
  gl.disableVertexAttribArray(vNormal);
  gl.disableVertexAttribArray(texcoordLoc);

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, curveBuffer );
  // gl.bufferData( gl.ARRAY_BUFFER, flatten( curvePoints ), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );


  // Change the color to black
  gl.uniform4fv( currentColourLoc, colors[5] );


  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  modelTransformMatrix = translate( cloud1_x, 9.5, 25 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 3.0, 1.8, 2.0 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.LINES, 0, numCurveVertices );

  modelTransformMatrix = translate( cloud2_x, 5, 25 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 2.3, 1.3, 2.0 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.LINES, 0, numCurveVertices );

  // If it's paused, don't translate
  if( !isPaused )
  {
    cloud1_x -= 0.01;
    cloud2_x -= 0.01;
  }

  // Once it exits the view, pretend it went all the way around
  if( cloud1_x < -18 )
  {
    cloud1_x = 11;
  }
  if( cloud2_x < -17 )
  {
    cloud2_x = 12;
  }

  // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}

var lakituCloudVertices =
[
  [ [ -0.2, 0.2 ],   [ -0.36, 0.34 ],  [ -0.144, 0.5 ],  [ 0.0, 0.34 ] ],
  [ [ -0.14, 0.0 ],  [ -0.46, -0.06 ], [ -0.42, 0.3 ],   [ -0.2, 0.26 ] ],
  [ [ 0.08, -0.11 ], [ 0.0, -0.3 ],   [ -0.34, -0.22 ], [ -0.26, 0.1 ] ],
  [ [ 0.27, 0.0 ],   [ 0.36, -0.14 ],  [ 0.144, -0.3 ],  [ 0.0, -0.14 ] ],
  [ [ 0.14, 0.24 ],   [ 0.46, 0.26 ],   [ 0.42, -0.1 ],   [ 0.25, -0.06 ] ],
  [ [ -0.08, 0.33 ], [ 0.0, 0.52 ],    [ 0.34, 0.44 ],   [ 0.26, 0.15 ] ]
];

function lakituCurve( single, t, p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y )
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
  lakituPoints.push( vec4( x, y, 0, 1 ));
  numLakituVertices++;
  if( !single )
  {
    lakituPoints.push( vec4( x, y, 0, 1 ));
    numLakituVertices++;
  }
}

function generateLakituCurve()
{
  var accuracy = 0.1; //This'll give the bezier 10 segments, 0.01 for 100, etc.

  for( var it = 0; it < lakituCloudVertices.length; it++ )
  {
    // Add the starting vertex
    lakituCurve(true, 0, lakituCloudVertices[it][0][0], lakituCloudVertices[it][0][1],
                         lakituCloudVertices[it][1][0], lakituCloudVertices[it][1][1],
                         lakituCloudVertices[it][2][0], lakituCloudVertices[it][2][1],
                         lakituCloudVertices[it][3][0], lakituCloudVertices[it][3][1] );

    // Adds two of each inbetween vertex, so for end of previous segment and start of next segment
    for( var i = accuracy; i < 1 - accuracy; i += accuracy )
    {
      lakituCurve(false, i, lakituCloudVertices[it][0][0], lakituCloudVertices[it][0][1],
                            lakituCloudVertices[it][1][0], lakituCloudVertices[it][1][1],
                            lakituCloudVertices[it][2][0], lakituCloudVertices[it][2][1],
                            lakituCloudVertices[it][3][0], lakituCloudVertices[it][3][1] );
    }

    // Ending vertex
    lakituCurve(true, 1 - accuracy, lakituCloudVertices[it][0][0], lakituCloudVertices[it][0][1],
                                    lakituCloudVertices[it][1][0], lakituCloudVertices[it][1][1],
                                    lakituCloudVertices[it][2][0], lakituCloudVertices[it][2][1],
                                    lakituCloudVertices[it][3][0], lakituCloudVertices[it][3][1] );
  }

  lakituBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, lakituBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten( lakituPoints ), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );
}

var lakitu_x = 2;
var lakitu_left = true;
var lakitu_y = 7.5;
var lakitu_up = true;

function drawLakituCurve()
{
  // No lighting/texture needed here
  gl.disableVertexAttribArray(vNormal);
  gl.disableVertexAttribArray(texcoordLoc);

  // Bind the current buffer to draw
  gl.bindBuffer( gl.ARRAY_BUFFER, lakituBuffer );
  // gl.bufferData( gl.ARRAY_BUFFER, flatten( lakituPoints ), gl.STATIC_DRAW );

  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );


  // Change the color to black
  gl.uniform4fv( currentColourLoc, colors[5] );


  // reset the camera transform matrix as well (was changed to move the cubes and player)
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(pathCameraTransformMatrix));

  // Set up transformations
  modelTransformMatrix = translate( lakitu_x, lakitu_y, 29 );
  modelTransformMatrix = mult( modelTransformMatrix, scalem( 3.0, 2.5, 2.5 ));
  gl.uniformMatrix4fv( modelTransformMatrixLoc, false, flatten( modelTransformMatrix ));

  gl.drawArrays( gl.LINES, 0, numLakituVertices );

  // If it's paused, don't translate
  if( !isPaused )
  {
    if( lakitu_left )
    {
      lakitu_x -= 0.03;
    }
    else
    {
      lakitu_x += 0.03;
    }

    if( lakitu_up )
    {
      lakitu_y += 0.01;
    }
    else
    {
      lakitu_y -= 0.01;
    }
  }

  // Move left and right
  if( lakitu_x < -6 || lakitu_x > 3.5 )
  {
    lakitu_left = !lakitu_left;
  }
  // Move up and down
  if( lakitu_y < 7 || lakitu_y > 8 )
  {
    lakitu_up = !lakitu_up;
  }

  // set the camera transform matrix to the actual translated state
  gl.uniformMatrix4fv(cameraTransformMatrixLoc, false, flatten(cameraTransformMatrix));
}
