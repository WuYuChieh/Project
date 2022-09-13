import * as THREE from "three";
import { Cell } from "./cell.js";
import { scene, isoR, isoTheta, cells } from "./main.js";

function subIsoR(col, start) {
	if (start === isoTheta.length-1) return isoTheta.length;
	var end = start;
	while (isoR[col][end] === 1)
		end++;
	return end;
}

function buildMaze() {
  //	radius wall
  for (var r = 0; r < isoR.length; r++) {
    for (var theta = 0; theta < isoTheta.length; theta++) {
      if (isoR[r][theta] == 1) {
        
		/***
		let geometry = new THREE.CylinderGeometry(50 * (r + 1), 50 * (r + 1), 20, 32, 1, true, 2 * Math.PI / isoTheta.length * (theta + isoTheta.length / 4), 2 * Math.PI / isoTheta.length);
        let material = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide
        });
        let maze = new THREE.Mesh(geometry, material);
        maze.position.y = 10;
        scene.add(maze);
		***/
		
		let end = subIsoR(r, theta);
			
		let shape = new THREE.Shape();
		shape.moveTo( ((r+1)*50-3) * Math.cos(2*Math.PI * (1/isoTheta.length) * theta), ((r+1)*50-3) * Math.sin(2*Math.PI * (1/isoTheta.length) * theta) );
		shape.absarc( 0, 0, (r+1)*50-3, 2*Math.PI * (1/isoTheta.length) * theta, 2*Math.PI * (1/isoTheta.length) * end );
		shape.lineTo( ((r+1)*50+3) * Math.cos(2*Math.PI * (1/isoTheta.length) * end), ((r+1)*50+3) * Math.sin(2*Math.PI * (1/isoTheta.length) * end) );
		shape.absarc( 0, 0, (r+1)*50+3, 2*Math.PI * (1/isoTheta.length) * end, 2*Math.PI * (1/isoTheta.length) * theta, true);	// true:clockwise is ccw
		
		theta = --end;

		let shapeSettings = {
			steps: 1,
			depth: 10,
			bevelEnabled: false,
			curveSegments: 200
		};
		
		let geometry = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, shapeSettings), new THREE.MeshBasicMaterial({
			color: 0x003060
		}));
		geometry.rotation.x = -Math.PI / 2;
		
		scene.add(geometry);
      }
    }
  }

  //	theta wall
  for (var theta = 0; theta < isoTheta.length; theta++) {
    for (var r = 0; r < isoR.length - 1; r++) {
      if (isoTheta[theta][r] == 1) {
        let geometry = new THREE.BoxGeometry(50+6, 10, 8);
        let material = new THREE.MeshBasicMaterial({
			color: 0x003060
        });
        let wall = new THREE.Mesh(geometry, material);
        wall.rotation.y = 2 * Math.PI / isoTheta.length * theta;
        wall.position.y = 5;
        wall.position.x = (25 + 50 * (r + 1)) * Math.cos(2 * Math.PI / isoTheta.length * theta);
        wall.position.z = (25 + 50 * (r + 1)) * Math.sin(-2 * Math.PI / isoTheta.length * theta);
        scene.add(wall);
      }
    }
  }

  //	cell array
  for (var i = 0; i < isoR.length - 1; i++) {
    let c0 = [];
    for (var j = 0; j < isoTheta.length; j++) {
      let c = new Cell();
      c0.push(c);
    }
    cells.push(c0);
  }
}

export {buildMaze};