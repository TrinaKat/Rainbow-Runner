var bumpMapBuffer;
var bumpMapNormalBuffer;
var bumpMapTexture;
var bumpMapVertexArray = [];
var bumpMaptexCorrdArray = [];

var numBumpMapVertices = 6;
var texSize = 512;

var normals = [];
var bumpMapNormals = [];

var bumpMapVertices = [
	vec4 (0, 0, 0, 1),
	vec4 (0, 1, 0, 1),
	vec4 (1, 1, 0, 1),
	vec4 (1, 0, 0, 1)
];


var bumpMaptexCorrd = [
	vec2(0,0),
	vec2(0,1),
	vec2(1,1),
	vec2 (1,0)
];


var bumpMapIndex = [
	0,1,3,
	1,3,2
];


function generateBumpMap (){

	for (var i = 0; i < numBumpMapVertices; i++)
	{
		bumpMapVertexArray.push(bumpMapVertices[bumpMapIndex[i]]);
		bumpMaptexCorrdArray.push(bumpMaptexCorrd[bumpMapIndex[i]]);
	}

	for (var i =0; i< numBumpMapVertices; i++)
	{
		bumpMapNormals.push (vec3(0,0,1));
	}

	
	bumpMapBuffer = gl.createBuffer();
	gl.bindBuffer (gl.ARRAY_BUFFER, bumpMapBuffer);
	gl.bufferData (gl.ARRAY_BUFFER, flatten(bumpMapVertexArray), gl.STATIC_DRAW);


	//Bump Data

	// Bump data
	var data = new Array()
	for (var i = 0; i <= texSize; ++i) {
		data[i] = new Array();
		for (var j = 0; j <= texSize; ++j){
			data[i][j] = 0.0;
		}
	}

	for (var i = texSize/4; i < 3*texSize/4; ++i) {
		for (var j = texSize/4; j < 3*texSize/4; ++j) {
			data[i][j] = 1.0;
		}
	}
	// Bump map normals
	var normalst = new Array()
	for (var i = 0; i < texSize; ++i) {
		normalst[i] = new Array();
		for (var j = 0; j < texSize; ++j) {
			normalst[i][j] = new Array();
			normalst[i][j][0] = data[i][j]-data[i+1][j];
			normalst[i][j][1] = data[i][j]-data[i][j+1];
			normalst[i][j][2] = 1;
		}
	}

		// Scale to texture coordinates
	for (var i = 0; i < texSize; ++i) {
		for (var j = 0; j < texSize; ++j) {
			var d = 0;
			for (var k = 0; k < 3 ; ++k) {
				d += normalst[i][j][k] * normalst[i][j][k];
				}
			d = Math.sqrt(d);
			for (k = 0; k < 3; ++k) {
				normalst[i][j][k] = 0.5 * normalst[i][j][k]/d + 0.5;
			}
		}
	}

	// Normal texture array
	normals = new Uint8Array(3*texSize*texSize);
	for (var i = 0; i < texSize; ++i) {
		for (var j = 0; j < texSize; ++j) {
			for (var k = 0; k < 3; ++k) {
				normals[3*texSize*i+3*j+k] = 255 * normalst[i][j][k];
				}
			}
		}

	bumpMapNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,bumpMapNormalBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );


}


function drawBumpMap (){


	gl.bindBuffer(gl.ARRAY_BUFFER,bumpMapBuffer);
	gl.bufferData (gl.ARRAY_BUFFER, flatten(bumpMapVertexArray),gl.STATIC_DRAW);
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0,0);
	gl.uniform4fv(currentColourLoc, colors[12]);

	gl.enableVertexAttribArray(vPosition);
  	
  	gl.disableVertexAttribArray(texcoordLoc);


  	gl.bindBuffer(gl.ARRAY_BUFFER,bumpMapNormalBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );;
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

  	modelTransformMatrix = translate(2, 0, cameraPositionZAxis - 10);
  	 gl.uniformMatrix4fv(modelTransformMatrixLoc, false, flatten(modelTransformMatrix));

  	gl.drawArrays(gl.TRIANGLES, 0, numBumpMapVertices);

  	applyBumpMapTexture();
}

var bumpMapTexCoordBuffer;

function createBumpMapTexture(){
 bumpMapTexture= gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, bumpMapTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Fill the texture with a 1x1 blue pixel
  // Before we load the image so use blue image so we can start rendering immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // Asynchronously load an image
  var image = new Image();
  image.src = "./Textures/8102-normal.jpg";
  image.addEventListener('load', function() {
      // Now that the image has loaded, make copy it to the texture.
      // Set texture properties
      gl.bindTexture(gl.TEXTURE_2D, bumpMapTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });

  // Create a buffer for texcoords
  bumpMapTexCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bumpMapTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten( bumpMaptexCorrdArray), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texcoordLoc);
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
}

function applyBumpMapTexture()
{
  // Bind the appropriate buffers and attributes for the texture
  gl.bindBuffer(gl.ARRAY_BUFFER, bumpMapTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(bumpMaptexCorrdArray), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texcoordLoc);
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bumpMapTexture);
  gl.uniform1i(textureLoc, 0);

  // Enable the texture before we draw
  // Tell the shader whether or not we want to enable textures
  enableTexture = true;
  gl.uniform1f(enableTextureLoc, enableTexture);
}







