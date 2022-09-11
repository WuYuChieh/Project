import * as THREE from "three";

class Cell {
  constructor() {
    this.color = "white";
  }

  floodfill(i, j) {
    if (this.color === 'gray') return;

    this.color = 'gray';

    console.log(i, j, this.color);

    if (isoR[i][j] === 0 && i != 0) cells[i - 1][j].floodfill(i - 1, j);

    if (isoR[i + 1][j] === 0) cells[i + 1][j].floodfill(i + 1, j);

    if (isoTheta[j][i] === 0) cells[i][(j - 1 + isoTheta.length) % isoTheta.length].floodfill(i, (j - 1 + isoTheta.length) % isoTheta.length);

    if (isoTheta[(j + 1) % isoTheta.length][i] === 0) cells[i][(j + 1) % isoTheta.length].floodfill(i, (j + 1) % isoTheta.length);
  }
}

export { Cell };