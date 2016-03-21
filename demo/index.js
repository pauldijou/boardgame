import generate from '../src/generator/index.js';

// Elements
function byId(id) {
  return document.getElementById(id)
}

const $ = {
  generater: byId('generater'),
  refresher: byId('refresher'),
  opener: byId('opener'),
  closer: byId('closer'),
  configPanel: byId('config'),
  grid: byId('grid'),
  inputs: {
    width: byId('inputWidth'),
    height: byId('inputHeight'),
    water: byId('inputWater'),
    gridTypeVoronoi: byId('gridTypeVoronoi'),
    gridTypeHexagon: byId('gridTypeHexagon'),
    voronoi: {
      sites: byId('inputVoronoiSites'),
      relax: byId('inputVoronoiRelax'),
    },
    coastTop: byId('inputCoastTop'),
    coastBottom: byId('inputCoastBottom'),
    coastLeft: byId('inputCoastLeft'),
    coastRight: byId('inputCoastRight'),
  },
  labels: {
    width: byId('labelWidth'),
    height: byId('labelHeight'),
    water: byId('labelWater'),
    voronoi: {
      sites: byId('labelVoronoiSites'),
      relax: byId('labelVoronoiRelax'),
    }
  },
  details: {
    voronoi: document.querySelectorAll('.voronoi'),
    hexagons: document.querySelectorAll('.hexagons')
  }
};

$.context = $.grid.getContext('2d');

// Events
$.generater.addEventListener('click', () => {
  updateConfig();
  refresh();
}, false);

$.refresher.addEventListener('click', refresh, false);

$.opener.addEventListener('click', () => {
  $.configPanel.classList.add('open');
}, false);

$.closer.addEventListener('click', () => {
  $.configPanel.classList.remove('open');
}, false);

window.addEventListener('resize', resize, false);

[
  $.inputs.width,
  $.inputs.height,
  $.inputs.water,
  $.inputs.voronoi.sites,
  $.inputs.voronoi.relax,
].forEach(input => {
  input.addEventListener('input', updateUI);
});

[
  $.inputs.gridTypeVoronoi,
  $.inputs.gridTypeHexagon,
].forEach(input => {
  input.addEventListener('change', updateUI);
});

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
      console.log('Config', config);
      world = generate(config);
      console.log('World', world);
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
if ($.inputs.gridTypeVoronoi.checked) {
  $.inputs.height.value = 150;
} else {
  $.inputs.height.value = 60;
}
$.inputs.width.value = $.inputs.height.value * window.innerWidth / window.innerHeight;
$.inputs.water.value = 0.2;
$.inputs.voronoi.sites.value = 7500;
$.inputs.voronoi.relax.value = 2;
updateConfig();
updateUI();
refresh();

// Config
function show(elem) { elem.classList.remove('hidden'); }
function hide(elem) { elem.classList.add('hidden'); }

function forEachNode(nodes, func) {
  for (let i = 0, l = nodes.length; i < l; ++i) {
    func(nodes[i]);
  }
}

function updateUI() {
  console.log('UPDATE UI');
  $.labels.width.innerHTML = `Width: ${$.inputs.width.value}`;
  $.labels.height.innerHTML = `Height: ${$.inputs.height.value}`;
  $.labels.water.innerHTML = `Water: ${$.inputs.water.value}`;
  $.labels.voronoi.sites.innerHTML = `Sites: ${$.inputs.voronoi.sites.value}`;
  $.labels.voronoi.relax.innerHTML = `Relax: ${$.inputs.voronoi.relax.value}`;

  if ($.inputs.gridTypeVoronoi.checked) {
    forEachNode($.details.voronoi, show);
  } else {
    forEachNode($.details.voronoi, hide);
  }
  if ($.inputs.gridTypeHexagon.checked) {
    forEachNode($.details.hexagons, show);
  } else {
    forEachNode($.details.hexagons, hide);
  }
}

function updateConfig() {
  config = {
    width: parseInt($.inputs.width.value, 10),
    height: parseInt($.inputs.height.value, 10),
    water: parseFloat($.inputs.water.value),
    coasts: {
      top: $.inputs.coastTop.checked,
      bottom: $.inputs.coastBottom.checked,
      left: $.inputs.coastLeft.checked,
      right: $.inputs.coastRight.checked
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

  if ($.inputs.gridTypeVoronoi.checked) {
    config.voronoi = {
      sites: parseInt($.inputs.voronoi.sites.value, 10),
      relax: parseInt($.inputs.voronoi.relax.value, 10)
    };
  } else if ($.inputs.gridTypeHexagon.checked) {
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
    $.context.fillStyle = `rgba(13,71,161, ${0.4 + Math.abs(cell.elevation)})`;
  } else if (cell.elevation < 0) {
    $.context.fillStyle = '#2f9ceb';
  } else {
    $.context.fillStyle = `rgba(0,0,0, ${cell.elevation})`;
  }

  $.context.beginPath();
  const start = format(ratios, cell.edges[0].start);
  $.context.moveTo(start.x, start.y);

  cell.edges.forEach(edge => {
    const end = format(ratios, edge.end);
    $.context.lineTo(end.x, end.y);
  })
  $.context.fill();
  $.context.closePath();
}

function drawEdge(edge, ratios) {
  if (edge.rivers) {
    $.context.strokeStyle = '#369eea';
    $.context.lineWidth = 1 + 2 * edge.rivers.length;
  } else {
    $.context.strokeStyle = '#000';
    $.context.lineWidth = 1;
  }

  $.context.beginPath();
  const v1 = format(ratios, edge.v1);
  const v2 = format(ratios, edge.v2);
  $.context.moveTo(v1.x, v1.y);
  $.context.lineTo(v2.x, v2.y);
  $.context.stroke();
  $.context.closePath();
}

function draw() {
  const start = performance.now();
  const ratios = { width: grid.width / config.width, height: grid.height / config.height };
  world.grid.cells.forEach(cell => drawCell(cell, ratios));
  world.grid.edges.forEach(edge => drawEdge(edge, ratios));
  console.debug('Duration world drawing:', Math.round(performance.now() - start), 'ms');
}
