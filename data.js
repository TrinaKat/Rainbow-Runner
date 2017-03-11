// Data

// COLORS
var colors =
[
    [ 1.0, 1.0, 1.0, 1.0 ],   // 0 white
    [ 0.7, 0.7, 0.7, 1.0 ],   // 1 light grey
    [ 0.6, 0.6, 0.6, 1.0 ],   // 2 light-medium grey
    [ 0.5, 0.5, 0.5, 1.0 ],   // 3 medium grey
    [ 0.4, 0.4, 0.4, 1.0 ],   // 4 dark grey (for cube borders)
    [ 0.0, 0.0, 0.0, 1.0 ],   // 5 black (for cube outlines)
    [ 1.0, 0.9, 0.0, 1.0 ],   // 6 yellow for the star
    [ 0.0, 0.76, 0.76, 1.0 ], // 7 cyan to indicate this is a special Mario question cube
    [ 1.0, 0.5, 0.0, 1.0 ],   // 8 orange (needed for exploding cube)
    [ 1.0, 0.97, 0.51, 1.0 ], // 9 light yellow (needed for exploding cube)
    [ 0.0, 0.5, 0,5, 1.0 ],   // 10 teal (to flash the player in invincible mode)
    [ 1.0, 0.0, 0.0, 1.0 ],   // 11 red
    [ 1.0, 0.6, 0.0, 1.0 ],   // 12 orange-yellow
    // Goompa
    [ 135/255, 80/255, 45/255, 1.0 ],    // 13 Medium Brown
    [ 240/255, 220/255, 180/255, 1.0 ],  // 14 Light Brown
    [ 100/255, 60/255, 30/255, 1.0 ],    // 15 Dark Brown
    // Start Screen Lakitu
    [ 1.0, 0.0, 0.0, 1.0 ],  // 16 red
    [ 1.0, 1.0, 0.0, 1.0 ],  // 17 yellow
    [ 0.0, 1.0, 0.0, 1.0 ]   // 18 green
];

// LIGHTING

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

function generateEverything()
{
  // POPULATE ALL THE POINTS
  generateCube();
  generateSphere();
  generateCubeOutline();
  generatePath();
  generatePlayer();
  generateStar();
  generateCoinStar();

  // CLOUDS
  generateCurve();
  generateLakituCurve();
  generateCloudFaceSquare();
  generateLakituSquare();
  generateCloudBigSquare();
  generateCloudSmallSquare();
  generateCloudLakituSquare();
  generateGoombaFaceSquare();

  // CLOUD TEXTURES
  createCloudFaceTexture();
  createLakituTexture();
  createLakituStartTexture();
  createCloudBigTexture();
  createCloudSmallTexture();
  createCloudLakituTexture();
  createGoombaFaceTexture();

  // Intro sequence with cubes
  generateIntroCubes();

  // Assign rainbow road texture to the path
  createRainbowTexture();
  createFlippedRainbowTexture();

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
  createStarTexture();

  // Draw the first line of cubes
  generateNewCubeLine();
}
