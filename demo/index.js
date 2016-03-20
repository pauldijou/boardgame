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
    number: 10,
    minHeight: 0.5
  },
  volcanos: {
    number: 2,
    minHeight: 0.8
  },
  coasts: {
    top: 1,
    right: 1,
    bottom: 1,
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

function drawCell(cell, ratios) {
  if (cell.ocean) {
    context.fillStyle = '#82caff';
  } else if (cell.elevation < 0) {
    context.fillStyle = '#2f9ceb';
  } else {
    context.fillStyle = `rgba(0,0,0, ${cell.elevation})`;
  }

  context.beginPath();
  context.moveTo(ratios.width * cell.edges[0].start.x, ratios.height * cell.edges[0].start.y);
  cell.edges.forEach(edge => {
    context.lineTo(ratios.width * edge.end.x, ratios.height * edge.end.y);
  })
  context.fill();
  context.closePath();
}

function drawEdge(edge, ratios) {
  // if (edge.river) {
  //   context.strokeStyle = '#369eea';
  //   context.lineWidth = 2 + edge.river;
  // } else {
  //   context.strokeStyle = '#000';
  //   context.lineWidth = 1;
  // }

  context.beginPath();
  context.moveTo(ratios.width * edge.v1.x, ratios.height * edge.v1.y);
  context.lineTo(ratios.width * edge.v2.x, ratios.height * edge.v2.y);
  context.stroke();
  context.closePath();
}

function draw() {
  const ratios = { width: canvas.width / world.width, height: canvas.height / world.height };
  world.diagram.cells.forEach(cell => drawCell(cell, ratios));
  world.diagram.edges.forEach(edge => drawEdge(edge, ratios));
}
