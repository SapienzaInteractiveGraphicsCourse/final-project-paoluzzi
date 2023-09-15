import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

/***************************
 * CAMERA
***************************/

var camera;

const cameraDistance = 0.8; //0.8
const cameraHeight = 0.8;
const cameraLookAtOffset = new THREE.Vector3(0, 0.8, 0);

camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);


const cameraHitboxSize = new THREE.Vector3(0.5, 0.5, 0.5); // Adjust this size as needed
const cameraHitbox = new THREE.Box3();

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );


/***************************
 * LIGHT
***************************/


var lightProps = {
    "ambientColor": 0xffffff,
    "ambientIntensity": 0.1,
    "lightColor": 0xffffff,
    "lightIntensity": 0.5,
    "distance": 100,
}

var ambient = new THREE.AmbientLight(lightProps.ambientColor, lightProps.ambientIntensity)
scene.add(ambient)

const light = new THREE.DirectionalLight(0xffffff, 0.5);

light.position.set(10, 10, 10);
scene.add(light);

const spotlightColor = 0xffff00; // Yellow color
const spotlightIntensity = 5.0; // Adjust the intensity as needed

const spotlight = new THREE.SpotLight(spotlightColor, spotlightIntensity);
scene.add(spotlight);

const spotlightPosition = new THREE.Vector3(0.95, 1.6, 0.3); // Set the position of the spotlight

spotlight.position.copy(spotlightPosition);

const spotlightAngle = Math.PI / 6; // Cone angle in radians (adjust as needed)
const spotlightPenumbra = 0.2; // Softness of the spotlight edges (adjust as needed)

spotlight.angle = spotlightAngle;
spotlight.penumbra = spotlightPenumbra;

spotlight.castShadow = true;

const targetObject = new THREE.Object3D(); 
scene.add(targetObject);

spotlight.target = targetObject;



const spotlight2 = new THREE.SpotLight(spotlightColor, spotlightIntensity);
scene.add(spotlight2);

const spotlight2Position = new THREE.Vector3(0.5, 1.5, 8.5); // Set the position of the spotlight

spotlight2.position.copy(spotlight2Position);

const spotlight2Angle = Math.PI / 4; // Cone angle in radians (adjust as needed)
const spotlight2Penumbra = 0.2; // Softness of the spotlight edges (adjust as needed)

spotlight2.angle = spotlight2Angle;
spotlight2.penumbra = spotlight2Penumbra;

spotlight2.castShadow = true;

const target2Object = new THREE.Object3D(); 
target2Object.position.set(0.5, 0.0, 8.2)
scene.add(target2Object);

spotlight2.target = target2Object;

const spotlight3 = new THREE.SpotLight(0xffffff, spotlightIntensity);
scene.add(spotlight3);

const spotlight3Position = new THREE.Vector3(1.5, 2.0, 4.0); // Set the position of the spotlight

spotlight3.position.copy(spotlight3Position);

const spotlight3Angle = Math.PI/5;
const spotlight3Penumbra = 0.2; // Softness of the spotlight edges (adjust as needed)

spotlight3.angle = spotlight3Angle;
spotlight3.penumbra = spotlight3Penumbra;

spotlight3.castShadow = true;

const target3Object = new THREE.Object3D(); 
target3Object.position.set(0.5, 0.0, 4.0)
scene.add(target3Object);

spotlight3.target = target3Object;

const spotlights = []
spotlights.push(spotlight)
spotlights.push(spotlight2)
spotlights.push(spotlight3)



/*
function createLaserBeam() {
  const laserBeamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 5, 16); // Adjust dimensions as needed
  const laserBeamMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000, // Adjust the color as needed (red in this case)
    emissive: 0xff0000, // Emissive color makes the material self-illuminated
    emissiveIntensity: 2, // Adjust the intensity of the self-illumination
  });
  const laserBeamMesh = new THREE.Mesh(laserBeamGeometry, laserBeamMaterial);
  scene.add(laserBeamMesh);
  return laserBeamMesh;
}

const numberOfLasers = 20; // Adjust the number of lasers as needed
const laserSpacing = 0.2; // Adjust the distance between lasers as needed
const lasers = [];
for (let i = 0; i < numberOfLasers; i++) {
  const laser = createLaserBeam();
  var randomAngle = Math.random() * Math.PI *2/3 - Math.PI/3;
  laser.rotation.set(0, 0, randomAngle)
  laser.position.set(i * laserSpacing - 2.0, 0, 0);
  lasers.push(laser);
}

const spotlightColorLaser = 0xff0000; // Red color
const spotlightIntensityLaser = 0.0; // Adjust the intensity of the spotlight

const spotlights = [];
lasers.forEach((laser) => {
  const spotlightLaser = new THREE.SpotLight(spotlightColorLaser, spotlightIntensityLaser);
  scene.add(spotlightLaser);
  spotlightLaser.position.copy(laser.position);
  spotlightLaser.target.position.set(laser.position.x, laser.position.y, laser.position.z - 10); // Set target position in front of the laser
  spotlights.push(spotlightLaser);
});
*/
/***************************
 * MODEL
***************************/

var characterBoundingBox;
const initialCharacterRotation = new THREE.Euler();

var guy;
var body;
var head;
var chest;
var upperArmLeft;
var forearmLeft;
var upperArmRight;
var forearmRight;
var hips;
var thighLeft;
var shinLeft;
var thighRight;
var shinRight;

const loader = new GLTFLoader();

var wallsHitBox = [];
var interactableHitBox = [];
var lamps = [];

const wireframeGeometries = [];

function addWall(position, size){
  var boundingBox = new THREE.Box3().setFromCenterAndSize(position, size);
  wallsHitBox.push(boundingBox);
  return boundingBox;
}

function addInteractable(position, size){
  var boundingBox = new THREE.Box3().setFromCenterAndSize(position, size);
  interactableHitBox.push(boundingBox);
  return boundingBox;
}

loader.load( './models/environment_ally/untitled.gltf', function ( gltf ) {

  var alley =  gltf.scene;

  alley.traverse(function (child) {
    if (child.isMesh) {
      child.receiveShadow = true;
      child.castShadow = true;
    }
  });

  /*********
   * WALLS *
   *********/

  addWall(new THREE.Vector3(3.5, 0.0, -3.0), new THREE.Vector3(3.0, 10.0, 6.0));
  addWall(new THREE.Vector3(3.5, 0.0, 0.0), new THREE.Vector3(2.7, 10.0, 18.0));

  addWall(new THREE.Vector3(-3.5, 0.0, 2.0), new THREE.Vector3(3.4, 10.0, 7.0));
  addWall(new THREE.Vector3(-3.5, 0.0, -3.0), new THREE.Vector3(3.6, 10.0, 3.2));
  addWall(new THREE.Vector3(-3.5, 0.0, -4.0), new THREE.Vector3(3.8, 10.0, 3.2));


  addWall(new THREE.Vector3(0.0, 0.0, -5.0), new THREE.Vector3(10.0, 10.0, 0.5));

  addWall(new THREE.Vector3(0.0, 0.0, 9.15), new THREE.Vector3(10.0, 10.0, 0.5));

  addWall(new THREE.Vector3(-5.3, 0.0, 7.4), new THREE.Vector3(1.0, 10.0, 10.0));

  /***********
   * OBJECTS *
   ***********/

  addWall(new THREE.Vector3(2.2, 0.0, 2.0), new THREE.Vector3(1.0, 1.0, 1.0));
  addWall(new THREE.Vector3(2.2, 0.0, 2.6), new THREE.Vector3(1.2, 1.0, 0.2));

  addWall(new THREE.Vector3(1.9, 0.0, -4.5), new THREE.Vector3(1.0, 1.0, 0.2));

  addWall(new THREE.Vector3(-1.9, 0.0, -0.7), new THREE.Vector3(1.0, 1.0, 0.3)); 
  
  addWall(new THREE.Vector3(-2.0, 0.0, 4.1), new THREE.Vector3(1.0, 1.0, 0.3)); 

  addWall(new THREE.Vector3(2.1, 0.0, 8.9), new THREE.Vector3(1.0, 1.0, 0.2));

  lamps.push(alley.getObjectByName('Cylinder006_Material025_0'));
  lamps.push(alley.getObjectByName('Cylinder006_Material026_0'));


  wallsHitBox.forEach((boundingBox) => {
    const wireframeGeometry = new THREE.Box3Helper(boundingBox, 0xff0000); // Use a red color for visualization
    wireframeGeometries.push(wireframeGeometry);
  });

  wireframeGeometries.forEach((wireframeGeometry) => {
    scene.add(wireframeGeometry);
  });

	scene.add(alley);

}, undefined, function ( error ) {

	console.error( error );

} );

var table;
loader.load( './models/stylized_rusty_car/scene.gltf', function ( gltf ) {

  table = gltf.scene;
  table.scale.set(0.0035, 0.0035, 0.0035);
  table.position.set(-0.1, 0.18, 3.0);
	scene.add(table);
  table.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }

  });
  var interactablePosition = new THREE.Vector3(table.position.x - 0.4, table.position.y, table.position.z + 1.0);
  var wallPosition = new THREE.Vector3(table.position.x, table.position.y, table.position.z + 1.0);
  var bound = addInteractable(interactablePosition, new THREE.Vector3(1.5, 0.3, 2.8));
  var bound2 = addWall(wallPosition, new THREE.Vector3(1.1, 0.3, 2.5));

  const wireframeGeometry2 = new THREE.Box3Helper(bound, 0xff0000); // Use a red color for visualization
  wireframeGeometries.push(wireframeGeometry2);

  scene.add(wireframeGeometry2);

  const wireframeGeometry3 = new THREE.Box3Helper(bound2, 0xff0000); // Use a red color for visualization
  wireframeGeometries.push(wireframeGeometry3);

  scene.add(wireframeGeometry3);
}, undefined, function ( error ) {

	console.error( error );

} );

const boxWidth = 1; // Adjust the width as needed
const boxHeight = 2.52; // Adjust the height as needed
const boxDepth = 2.22; // Adjust the depth as needed
const boxPosition = new THREE.Vector3(-5.3, 0.0, 7.4); // Set the x, y, and z coordinates as needed

const blackBoxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const blackBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Use black color (hex value) for the material
const blackBoxMesh = new THREE.Mesh(blackBoxGeometry, blackBoxMaterial);

blackBoxMesh.position.copy(boxPosition);

scene.add(blackBoxMesh);


var exclamation;
var guyInitialPosition = new THREE.Vector3(0.0, 0.075, -2.0);

loader.load( './models/exclamation_mark_3d_icon/scene.gltf', function ( gltf ) {

  exclamation = gltf.scene;
  exclamation.scale.set(0.1, 0.1, 0.1);
  exclamation.position.set(guyInitialPosition.x, guyInitialPosition.y + 0.9, guyInitialPosition.z);
  exclamation.visible = false;
	scene.add(exclamation);

}, undefined, function ( error ) {

	console.error( error );

} );

loader.load( './models/bad_guy/untitled.gltf', function ( gltf ) {

  guy = gltf.scene;
  guy.position.y = -2;
  guy.scale.set(0.4, 0.4, 0.4);
  guy.position.set(guyInitialPosition.x, guyInitialPosition.y, guyInitialPosition.z);
	scene.add(guy);
  guy.traverse(function (child) {
      if (child.isMesh) {
        //child.castShadow = true;
        child.receiveShadow = true;
      }
  });

    body = guy.getObjectByName('Bone_31');
    head = guy.getObjectByName('head_0');
    chest = guy.getObjectByName('chest_8');
    upperArmLeft = guy.getObjectByName('upper_armL_3');
    forearmLeft = guy.getObjectByName('forearmL_2');
    upperArmRight = guy.getObjectByName('upper_armR_6');
    forearmRight = guy.getObjectByName('forearmR_5');
    hips = guy.getObjectByName('hips_14');
    thighLeft = guy.getObjectByName('thighL_11');
    shinLeft = guy.getObjectByName('shinL_10');
    thighRight = guy.getObjectByName('thighR_13');
    shinRight = guy.getObjectByName('shinR_12');

    characterBoundingBox = new THREE.Box3().setFromObject(guy);

    upperArmLeft.rotation.x = 1.2;
    upperArmRight.rotation.x = 1.2;

    const wireframeGeometry = new THREE.Box3Helper(characterBoundingBox, 0xff0000); // Use a red color for visualization
    wireframeGeometries.push(wireframeGeometry);

    initialCharacterRotation.copy(guy.rotation);

}, undefined, function ( error ) {

	console.error( error );

} );


/***************************
 * CONTROLS
***************************/

var movement = false;
var leftMovement = false;
var rightMovement = false;
var upMovement = false;
var downMovement = false;
var leftCamera = false;
var rightCamera = false;
var hidden = false;

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
    switch (event.code) {
      case 'KeyW':
        upMovement = true;
        break;
      case 'KeyS':
        downMovement = true;
        break;
      case 'KeyA':
        leftMovement = true;
        break;
      case 'KeyD':
        rightMovement = true;
        break;
      case 'ArrowLeft':
        leftCamera = true;
        break;
      case 'ArrowRight':
        rightCamera = true;
        break;
      case 'ShiftLeft':
        hidden = true;
        break;
    }
}
  
function onKeyUp(event) {
    switch (event.code) {
      case 'KeyW':
        upMovement = false;
        break;
      case 'KeyS':
        downMovement = false;
        break;
      case 'KeyA':
        leftMovement = false;
        break;
      case 'KeyD':
        rightMovement = false;
        break;
      case 'ArrowLeft':
        leftCamera = false;
        break;
      case 'ArrowRight':
        rightCamera = false;
        break;
      case 'ShiftLeft':
        hidden = false;
        break;
    }
}
  
let targetCharacterRotation = 0;
let currentCharacterRotation = 0;

function checkCollision(movementVector) {

  var charBound = false;
  guy.position.add(movementVector);
  
  characterBoundingBox.setFromObject(guy);

  var cameraBound = false;
  const newPos = new THREE.Vector3();

  newPos.x = guy.position.x + cameraDistance * Math.cos(cameraAngle);
  newPos.y = guy.position.y + cameraHeight;
  newPos.z = guy.position.z + cameraDistance * Math.sin(cameraAngle);
  cameraHitbox.setFromCenterAndSize(newPos, cameraHitboxSize);

  wallsHitBox.forEach((childBoundingBox) => {
    if (characterBoundingBox.intersectsBox(childBoundingBox) && !charBound) {
      guy.position.add(movementVector.negate());
      characterBoundingBox.setFromObject(guy);
      charBound = true;
    }

    if (cameraHitbox.intersectsBox(childBoundingBox) && !cameraBound) {
      cameraBound = true;
    }
  });

  if(!charBound) exclamation.position.add(movementVector);
  if(!cameraBound){
    camera.position.set(newPos.x, newPos.y, newPos.z);
    cameraHitbox.setFromCenterAndSize(camera.position, cameraHitboxSize);
  } else{
    const angleOffset = calculateAngleBetweenCharacterAndCamera(guy.position, camera.position);
    cameraAngle += angleOffset * 0.5 % (Math.PI * 2);
  }
}

function calculateAngleBetweenCharacterAndCamera(characterPosition, cameraPosition) {
  const characterToCameraVector = cameraPosition.clone().sub(characterPosition);
  const cameraDirection = new THREE.Vector3(0, 0, -1); // Assuming the camera looks along the negative z-axis
  characterToCameraVector.normalize();
  cameraDirection.normalize();

  const dotProduct = characterToCameraVector.dot(cameraDirection);
  const angleRadians = Math.acos(dotProduct);

  return angleRadians;
}

let cameraAngle = Math.PI * 3/2; // Initialize camera angle (in radians) around Y-axis

function moveCharacter() {

  const movementSpeed = 0.05; 
  const movementVector = new THREE.Vector3();
  if (upMovement) movementVector.z -= movementSpeed;
  if (downMovement) movementVector.z += movementSpeed;
  if (leftMovement) movementVector.x -= movementSpeed;
  if (rightMovement) movementVector.x += movementSpeed;

  const movementVectorCamera = movementVector.clone();
  movementVectorCamera.applyQuaternion(camera.quaternion);

  if(movementVectorCamera.z != 0.0 || movementVectorCamera.x != 0.0){
    movement = true;
    const angle = Math.atan2(movementVectorCamera.x, movementVectorCamera.z);
    targetCharacterRotation = initialCharacterRotation.y + angle;
  }
  else
    movement = false;


  const cameraRotationSpeed = 0.05; // Adjust this value for desired rotation speed

  if(leftCamera) cameraAngle -= cameraRotationSpeed % (Math.PI * 2);
  if(rightCamera) cameraAngle += cameraRotationSpeed % (Math.PI * 2);



  // Smoothly rotate the character's model to face the direction of movement
  const rotationSpeed = 0.2; // Adjust this value for desired rotation speed
  var angularDistance = targetCharacterRotation - currentCharacterRotation ;
  currentCharacterRotation += rotationSpeed * angularDistance;

  guy.rotation.y = currentCharacterRotation;

  checkCollision(movementVectorCamera);

  const lookAtPosition = guy.position.clone().add(cameraLookAtOffset);

  camera.lookAt(lookAtPosition);
}


function resetPositions() {
  // Reset character position
  guy.position.set(guyInitialPosition.x, guyInitialPosition.y, guyInitialPosition.z);// Adjust this to your desired initial position
  exclamation.position.set(guyInitialPosition.x, guyInitialPosition.y + 0.9, guyInitialPosition.z);
  characterBoundingBox.setFromObject(guy);

  // Reset character rotation
  guy.rotation.set(0.0, initialCharacterRotation.y, 0.0);

  targetCharacterRotation = 0;
  currentCharacterRotation = 0;

  // Reset camera position and rotation
  const initialCameraPosition = new THREE.Vector3(0, cameraHeight, cameraDistance);
  const cameraLookAtPosition = guy.position.clone().add(cameraLookAtOffset);
  cameraAngle = Math.PI * 3/2;
  camera.position.copy(initialCameraPosition);
  camera.lookAt(cameraLookAtPosition);
  cameraHitbox.setFromCenterAndSize(camera.position, cameraHitboxSize);

  characterHealth = 100;
  updateHealthBar();

}


/***************************
 * ANIMATION
***************************/

var time = 0;
var frequency = 5.0;
var upperAmplitude = 1.0;
var lowerAmplitude = 0.8;
var centerAmplitude = 0.5;

var idleTime = 0;
var idleFrequency = 1.0;

function walk(){
  hips.rotation.x = 0;
  chest.rotation.x = 0;
  head.rotation.x = 0;
  chest.rotation.y = centerAmplitude * Math.sin(time * frequency);
  head.rotation.y = - 0.7 * centerAmplitude * Math.sin(time * frequency) - 0.7 * centerAmplitude * Math.sin(idleTime * idleFrequency);
  upperArmLeft.rotation.x = 1.2;
  upperArmRight.rotation.x = 1.2;

  var forearmRotation = upperAmplitude * Math.sin(time * frequency);
  if(forearmRotation <= 0)
      forearmLeft.rotation.x =  - forearmRotation;
  else
      forearmRight.rotation.x = forearmRotation;
  
  var thighRotation = lowerAmplitude * Math.sin(time * frequency);
  thighLeft.rotation.x = Math.PI - thighRotation;
  thighRight.rotation.x = Math.PI + thighRotation;
  if(thighRotation <= -Math.PI / 4)
      shinLeft.rotation.x = - 0.5 * thighRotation;
  else if(thighRotation >= Math.PI / 4)
      shinRight.rotation.x = 0.5 * thighRotation;

  time += 0.01;
}

function idle(){
  hips.rotation.x = 0;
  chest.rotation.x = 0;
  head.rotation.x = 0;
  chest.rotation.y = 0;
  head.rotation.y = - 0.7 * centerAmplitude * Math.sin(idleTime * idleFrequency) - 0.7 * centerAmplitude * Math.sin(time * frequency);
  upperArmLeft.rotation.x = 1.2;
  upperArmRight.rotation.x = 1.2;

  forearmLeft.rotation.x = 0;
  
  forearmRight.rotation.x = 0;
  
  thighLeft.rotation.x = Math.PI;
  thighRight.rotation.x = Math.PI;
  shinLeft.rotation.x = 0;
  shinRight.rotation.x = 0;

  idleTime += 0.01;
}

function crouch(){
  hips.rotation.x = - Math.PI/6;
  chest.rotation.x = Math.PI/2;
  chest.rotation.y = 0;
  head.rotation.x = - Math.PI/4;
  head.rotation.y = - 0.7 * centerAmplitude * Math.sin(time * frequency) - 0.7 * centerAmplitude * Math.sin(idleTime * idleFrequency);

  var forearmRotation = upperAmplitude * Math.sin(time * frequency);
  if(forearmRotation <= 0){
      forearmLeft.rotation.x = Math.PI/4  - forearmRotation;
  }
  else{
      forearmRight.rotation.x = Math.PI/4 + forearmRotation;
  }
  upperArmLeft.rotation.x = 1.2 - 0.4 * Math.sin(time * frequency);
  upperArmRight.rotation.x = 1.2 + 0.4 * Math.sin(time * frequency);
  
  var thighRotation = lowerAmplitude * Math.sin(time * frequency);
  thighLeft.rotation.x = - Math.PI*5/6 - thighRotation;
  thighRight.rotation.x = - Math.PI*5/6 + thighRotation;
  if(thighRotation <= -Math.PI / 4)
      shinLeft.rotation.x = - Math.PI/2 * thighRotation;
  else if(thighRotation >= Math.PI / 4)
      shinRight.rotation.x = Math.PI/2 * thighRotation;

  time += 0.01;
}

function crouchIdle(){
  hips.rotation.x = - Math.PI/6;
  chest.rotation.x = Math.PI/2;
  chest.rotation.y = 0;
  head.rotation.x = - Math.PI/4;
  head.rotation.y = - 0.7 * centerAmplitude * Math.sin(idleTime * idleFrequency) - 0.7 * centerAmplitude * Math.sin(time * frequency);

  forearmLeft.rotation.x = Math.PI/4 + upperAmplitude;
  forearmRight.rotation.x = Math.PI/4 + upperAmplitude;

  thighLeft.rotation.x = - Math.PI*5/6 - lowerAmplitude;
  thighRight.rotation.x = - Math.PI*5/6 - lowerAmplitude;
  shinLeft.rotation.x =  Math.PI/2 * lowerAmplitude;
  shinRight.rotation.x =  Math.PI/2 * lowerAmplitude;


  idleTime += 0.01;
}
let characterHealth = 100;

function updateHealthBar() {
  const healthBar = document.getElementById('healthBar');
  healthBar.style.width = `${characterHealth}%`;
}
var lampTime = 0;
var lampFrequency = 4.0;

function checkSpotlight(spotlight0, underTheLight){
  let characterPosition = guy.position.clone();
  let spotlightPosition = spotlight0.position.clone();
  let spotlightTarget = spotlight0.target.position.clone();
  let spotlightDirection = spotlightTarget.clone().sub(spotlightPosition).normalize();
  let characterToSpotlight = characterPosition.clone().sub(spotlightPosition);
  let angleToSpotlight = characterToSpotlight.angleTo(spotlightDirection);
  let distanceToSpotlight = characterToSpotlight.length();

  // Angle and distance thresholds to trigger the alert
  let angleThreshold = spotlight0.angle; // Adjust this value as needed
  let distanceThreshold = 5; // Adjust this value as needed

  // Check if the character is under the spotlight
  if (angleToSpotlight < angleThreshold && distanceToSpotlight < distanceThreshold) {
    underTheLight = true;
    var interacting = false;

    interactableHitBox.forEach((childBoundingBox) => {
      if (characterBoundingBox.intersectsBox(childBoundingBox)) {
        if(hidden)
          interacting = true;
      }
    });

  }
  return underTheLight && !interacting;
}
function animate() {
	requestAnimationFrame( animate );

  var lampRotation = 0.7 * Math.sin(lampTime * lampFrequency);
  if(lamps[0]){
    lamps[0].rotation.z = -0.4 + lampRotation;
    lamps[1].rotation.z = -0.4 + lampRotation;
  }

  targetObject.position.x =  0.4 + lampRotation;


  lampTime += 0.01;
  //controls.update();
  moveCharacter();
  if(movement)
    if(hidden)
      crouch();
    else
      walk();
  else
    if(hidden)
      crouchIdle();
    else
      idle();
      // Check if character is under the spotlight

      let underTheLight = false;
  spotlights.forEach((spot) => {
    underTheLight = checkSpotlight(spot, underTheLight);
  });

  if(underTheLight) {
    exclamation.visible = true;
    characterHealth -= 1;
    updateHealthBar();
    if(characterHealth == 0)
      resetPositions();
  } else
    exclamation.visible = false;
	renderer.render( scene, camera );
}

animate();