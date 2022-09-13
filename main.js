import * as THREE from "three";
import { OrbitControls } from "controls";
import { Cell } from "./cell.js";
import * as MAZE from "./maze.js"

var camera, scene, renderer;
var player;
var cells = [];

var walkState = ['outward', 'ccw', 'inward', 'cw'];
var index = 0;
var R = 0;
var deltaTheta = 0;

//	start from x-axis
var isoR = [
  [1, 1, 0, 1, 0, 1, 0, 0],
  [1, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1]
];

//	start from x-axis
var isoTheta = [
  [0, 0, 1],
  [1, 1, 0],
  [1, 0, 1],
  [0, 0, 1],
  [1, 1, 0],
  [0, 1, 0],
  [1, 0, 1],
  [1, 1, 0]
];

function onWindowResize() {

	var width = window.innerWidth;
	var height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

function onKeydown(event) {

	if (event.key == "ArrowLeft") {
		if (R === 0)
			deltaTheta += 1;
		else
			index = (index + 1) % 4;
	}
	if (event.key == "ArrowRight") {
		if (R === 0)
			deltaTheta -= 1;
		else
			index = (index - 1 + 4) % 4;
	}
	if (event.key == "ArrowUp") {
		switch (walkState[index]) {
			case 'ccw':
				deltaTheta += 1 / R;
				break;
			case 'cw':
				deltaTheta -= 1 / R;
				break;
			case 'outward':
				R += 1;
				break;
			case 'inward':
				if (R === 0) {
					R += 1;
					index -= 2;
					deltaTheta += isoTheta.length;
				} 
				else
					R -= 1;
				break;
		}
	}

	if (R > isoR.length * 2 - 1) R--;

	player.position.x = (25 * R) * Math.cos(2 * Math.PI / isoTheta.length / 2 * deltaTheta);
	player.position.z = (25 * R) * Math.sin(-2 * Math.PI / isoTheta.length / 2 * deltaTheta);

	player.rotation.y = Math.PI / isoTheta.length * deltaTheta + (Math.PI / 2 * index);

	console.log("R= "+R, " deltaTheta= "+deltaTheta);
	console.log("x.ceil= "+Math.ceil(player.position.x), " z.ceil= "+Math.ceil(player.position.z));
	console.log(Math.cos(2 * Math.PI / isoTheta.length / 2 * deltaTheta));
}

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x888888);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000000);
	camera.position.set(0, 400, 0);
	let controls = new OrbitControls(camera, renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onKeydown);
	////////////////////////////////////////////////////////////////
	var gridXZ = new THREE.GridHelper(400, 40, 'red', 'white');
	scene.add(gridXZ);
	var axes = new THREE.AxesHelper(100);
	scene.add(axes);

	MAZE.buildMaze();

	// floodfill
	/*
	for (var a = 0; a < isoTheta.length; a++) {
	if (isoR[0][a] == 0)
	  cells[0][a].floodfill(0, a);
	console.log('-----------');
	}
	console.log('-----------');
	*/
	//console.log(isoR);

	const geometry = new THREE.ConeGeometry(5, 20, 32);
	const material = new THREE.MeshBasicMaterial({
		color: 0xffff00
	});
	player = new THREE.Mesh(geometry, material);
	player.rotation.z = -Math.PI / 2;
	//player.rotation.y = Math.PI / isoTheta.length;
	scene.add(player);
}

function animate() {

	requestAnimationFrame(animate);
	render();
}

function render() {

	renderer.render(scene, camera);
}

export { init, animate, scene, isoR, isoTheta, cells };