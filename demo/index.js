import generate from '../src/generator/index.js';

const canvas = document.getElementById('map');
const context = canvas.getContext('2d');

const world = generate({
  width: 100,
  height: 100,
  tiles: 1000,
  water: 0.20,
  voronoi: true,
  shape: 'hexagon',
  coasts: {
    top: true,
    right: false,
    bottom: false,
    left: true
  }
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

function draw() {
  const width = canvas.width / world.width;
  const height = canvas.height / world.height;

  let water = 0;

  for (let x = 0; x < world.width; ++x) {
    for (let y = 0; y < world.height; ++y) {
      const tile = world.map[x][y];
      if (tile.ocean) {
        water++;
        context.fillStyle = '#82caff';
      } else if (tile.elevation < 0) {
        water++;
        context.fillStyle = '#2f9ceb';
      } else {
        context.fillStyle = `rgba(0,0,0, ${tile.elevation})`;
      }
      context.fillRect (x * width, y * height, width, height);
    }
  }
}
