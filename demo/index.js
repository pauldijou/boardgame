import generate from '../src/generator/index.js';

// Elements
const generater = document.getElementById('generater');
const refresher = document.getElementById('refresher');
const opener = document.getElementById('opener');
const closer = document.getElementById('closer');
const configPanel = document.getElementById('config');
const grid = document.getElementById('grid');
const context = grid.getContext('2d');

const inputWidth = document.getElementById('inputWidth');
const inputHeight = document.getElementById('inputHeight');
const inputWater = document.getElementById('inputWater');
const gridTypeVoronoi = document.getElementById('gridTypeVoronoi');
const gridTypeHexagon = document.getElementById('gridTypeHexagon');
const inputCoastTop = document.getElementById('inputCoastTop');
const inputCoastBottom = document.getElementById('inputCoastBottom');
const inputCoastLeft = document.getElementById('inputCoastLeft');
const inputCoastRight = document.getElementById('inputCoastRight');

// Events
generater.addEventListener('click', () => {
  updateConfig();
  refresh();
}, false);

refresher.addEventListener('click', refresh, false);

opener.addEventListener('click', () => {
  configPanel.classList.add('open');
}, false);

closer.addEventListener('click', () => {
  configPanel.classList.remove('open');
}, false);

window.addEventListener('resize', resize, false);

// Default config
let config;
let world;

// Main
function resize() {
  grid.width = window.innerWidth;
  grid.height = window.innerHeight;
  draw();
}

function refresh() {
  grid.classList.add('hide');
  let tries = 0;
  world = undefined;

  while (!world) {
    try {
      tries++;
      world = generate(config);
    } catch (e) {
      console.error('Failed to generate world, trying again for the', tries, 'times');
      if (tries >= 5) {
        throw e;
      }
    }
  }
  resize();
  grid.classList.remove('hide');
}

// Init
inputWidth.value = 100 * window.innerWidth / window.innerHeight;
inputHeight.value = 100;
inputWater.value = 0.2;
updateConfig();
refresh();

// Config
function updateConfig() {
  config = {
    width: parseInt(inputWidth.value, 10),
    height: parseInt(inputHeight.value, 10),
    water: parseFloat(inputWater.value),
    coasts: {
      top: inputCoastTop.checked,
      bottom: inputCoastBottom.checked,
      left: inputCoastLeft.checked,
      right: inputCoastRight.checked
    },
    rivers: {
      number: 10,
      minHeight: 0.6
    },
    volcanos: {
      number: 2,
      minHeight: 0.8
    }
  };

  if (gridTypeVoronoi.checked) {
    config.voronoi = {
      sites: 5000,
      relax: 2
    };
  } else if (gridTypeHexagon.checked) {
    config.shape = 'hexagon';
  }
}

// Utils
function format(ratios, point) {
  // return {
  //   x: ratios.width * (point.x + 2/3),
  //   y: ratios.height * (point.x / 2 + point.y + 1/2)
  // };
  return {
    x: ratios.width * point.x,
    y: ratios.height * point.y
  };
}

function drawCell(cell, ratios) {
  if (cell.ocean) {
    context.fillStyle = '#82caff';
  } else if (cell.elevation < 0) {
    context.fillStyle = '#2f9ceb';
  } else {
    context.fillStyle = `rgba(0,0,0, ${cell.elevation})`;
  }

  context.beginPath();
  const start = format(ratios, cell.edges[0].start);
  context.moveTo(start.x, start.y);

  cell.edges.forEach(edge => {
    const end = format(ratios, edge.end);
    context.lineTo(end.x, end.y);
  })
  context.fill();
  context.closePath();
}

function drawEdge(edge, ratios) {
  if (edge.rivers) {
    context.strokeStyle = '#369eea';
    context.lineWidth = 1 + 2 * edge.rivers.length;
  } else {
    context.strokeStyle = '#000';
    context.lineWidth = 1;
  }

  context.beginPath();
  const v1 = format(ratios, edge.v1);
  const v2 = format(ratios, edge.v2);
  context.moveTo(v1.x, v1.y);
  context.lineTo(v2.x, v2.y);
  context.stroke();
  context.closePath();
}

function draw() {
  const start = performance.now();
  const ratios = { width: grid.width / config.width, height: grid.height / config.height };
  world.grid.cells.forEach(cell => drawCell(cell, ratios));
  world.grid.edges.forEach(edge => drawEdge(edge, ratios));
  console.debug('Duration world drawing:', Math.round(performance.now() - start), 'ms');
}
