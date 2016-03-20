import generate from '../src/generator/index.js';

const canvas = document.getElementById('map');
const context = canvas.getContext('2d');

const world = generate({
  width: 150,
  height: 100,
  water: 0.2,
  voronoi: {
    sites: 5000,
    relax: 2
  },
  shape: 'hexagon',
  rivers: {
    number: 200,
    minHeight: 0.5
  },
  coasts: {
    top: 1,
    right: 0,
    bottom: 0,
    left: 1
  }
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

function drawCell(cell, ratio) {
  if (cell.ocean) {
    context.fillStyle = '#82caff';
  } else if (cell.elevation < 0) {
    context.fillStyle = '#2f9ceb';
  } else {
    context.fillStyle = `rgba(0,0,0, ${cell.elevation})`;
  }

  context.beginPath();
  context.moveTo(ratio.width * cell.edges[0].start.x, ratio.height * cell.edges[0].start.y);
  cell.edges.forEach(edge => {
    context.lineTo(ratio.width * edge.end.x, ratio.height * edge.end.y);
  })
  context.closePath();
  context.fill();
  context.stroke();
}

function draw() {
  world.diagram.cells.forEach(cell => drawCell(cell, { width: canvas.width / world.width, height: canvas.height / world.height }));
}
