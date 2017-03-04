// Star

//  Math.cos/ sin only takes radiants. converting to degree
function cos (degree)
{
  return  Math.cos((degree/180)* Math.PI);
}

function sin (degree)
{
  return  Math.sin((degree/180)* Math.PI);
}

var outsideDimension = sin(54)+ 1.1756;
var starPoints = [];
var starBuffer;
var numStarVertices = 60;

var angle = 0;

var starVertices = [
  // front side
  //Indise layer
  vec4(0.0, 0.0, 0.5, 1.0),    // center.   0
  vec4(cos(54),sin(54),0.5,1.0),   //top right    1
  vec4(cos(126), sin(126),0.5,1.0), // top left 2
  vec4(cos(198), sin(198),0.5,1.0), // button left  3
  vec4( cos(270), sin(270),0.5,1.0), //bottom center  4
  vec4( cos(342), sin(342),0.5,1.0),  // bottom right   5

  //Outside Layer
  vec4(outsideDimension* cos(18), outsideDimension* sin(18),0.5,1.0),   //top right.    6
  vec4(outsideDimension* cos(90), outsideDimension* sin(90),0.5,1.0),  // top       7
  vec4(outsideDimension* cos(162), outsideDimension* sin(162),0.5,1.0),  // top left    8
  vec4(outsideDimension* cos(234), outsideDimension* sin(234),0.5,1.0),  //bottom left  9
  vec4(outsideDimension* cos(306), outsideDimension* sin(306),0.5,1.0),  // bottom right  10

  //Back
  vec4(cos(54),  sin(54),0,1.0),   //top right    1
  vec4(cos(126),  sin(126),0,1.0), // top left  2
  vec4(cos(198),  sin(198),0,1.0), // button left 3
  vec4( cos(270),  sin(270),0,1.0), //bottom center 4
  vec4( cos(342),  sin(342),0,1.0),  // bottom right  5

  //Outside Layer
  vec4(outsideDimension* cos(18), outsideDimension* sin(18),0,1.0),   //top right
  vec4(outsideDimension* cos(90), outsideDimension* sin(90),0,1.0),  // top
  vec4(outsideDimension* cos(162), outsideDimension* sin(162),0,1.0),  // top left
  vec4(outsideDimension* cos(234), outsideDimension* sin(234),0,1.0),  //bottom left
  vec4(outsideDimension* cos(306), outsideDimension* sin(306),0,1.0),  // bottom right
  vec4(0.0, 0.0, 0, 1.0)          // center.    0
];

var starVerticeOrder = [

  // front
  0,1,2,
  0,2,3,
  0,3,4,
  0,4,5,
  0,5,1,

  5,1,6,
  1,2,7,
  2,3,8,
  3,4,9,
  4,5,10,

  // back
  21,11,12,
  21,12,13,
  21,13,14,
  21,14,15,
  21,15,11,

  15,11,16,
  11,12,17,
  12,13,18,
  13,14,19,
  14,15,20
];


function generateStar ()
{

  starBuffer = gl.createBuffer();
  gl.bindBuffer (gl.ARRAY_BUFFER,starBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(starPoints),gl.STATIC_DRAW);


  for (var i = 0; i < numStarVertices; i ++)
  {
    starPoints.push (starVertices[starVerticeOrder[i]]);
  }
  // gl.disableVertexAttribArray (vNormal);
}

function drawStar()
{

  angle+= 0.2;
  gl.bindBuffer (gl.ARRAY_BUFFER,starBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(starPoints),gl.STATIC_DRAW);
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0,0);
  gl.enableVertexAttribArray(vPosition);
  // gl.disableVertexAttribArray(vNormal);
  gl.disableVertexAttribArray(texcoordLoc);


  gl.uniform4fv(currentColourLoc, colors[6]);
  modelTransformMatrix = mat4();
  modelTransformMatrix = mult(modelTransformMatrix, translate(-3, 7, cameraPositionZAxis-10));
  modelTransformMatrix = mult(modelTransformMatrix, scalem(0.2, 0.2, 0.2));
  modelTransformMatrix = mult(modelTransformMatrix, rotateY(angle));
  gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

  gl.drawArrays(gl.TRIANGLES, 0, numStarVertices);

  //modelTransformMatrix = mult(modelTransformMatrix, translate(0, -3, 0));

  //modelTransformMatrix = mult(modelTransformMatrix, rotate(72, 0, 0, cameraPositionZAxis-10));
  //gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

  //gl.drawArrays(gl.TRIANGLES, 0, numStarVertices);
}
