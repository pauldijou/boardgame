// ---------------------------------
// Please, don't read this file...
// this is quick and dirty pure JavaScript
// in order to bind the demo UI to the generator
// ---------------------------------

import generate from '../src/generator/index.js';

import * as $ from './js/elements';
import draw from './js/draw';

// Global mutable YOLO stuff (told you it was dirty...)
let config = {};
let world;

try {
  const params = {};
  const searches = location.search.substr(1).split('=');
  for (let i = 0; i < searches.length; i += 2) {
    params[decodeURIComponent(searches[i])] = decodeURIComponent(searches[i + 1]);
  }

  if (params.config) {
    config = JSON.parse(params.config);
  }
} catch (e) {

}

function defaultConfig(key, fallback) {
  return key.split('.').reduce((res, part) => {
    if (res !== undefined && res[part] !== undefined) {
      return res[part];
    }
    return fallback;
  }, config);
}

// Default values
$.inputs.noiseTypeDefault.checked = !config.noise;
$.inputs.noiseTypeCustom.checked = !!config.noise;
$.inputs.noise.shapeFlat.checked = !config.noise || config.noise.shape === 'flat';
$.inputs.noise.shapeCylindrical.checked = config.noise && config.noise.shape === 'cylindrical';
$.inputs.noise.shapeSpherical.checked = config.noise && config.noise.shape === 'spherical';
$.inputs.noise.circumference.value = defaultConfig('noise.circumference', 50);
$.inputs.noise.amplitude.value = defaultConfig('noise.amplitude', 1);
$.inputs.noise.octaves.value = defaultConfig('noise.octaves', 6);
$.inputs.noise.frequency.value = defaultConfig('noise.frequency', 0.02);
$.inputs.noise.persistence.value = defaultConfig('noise.persistence', 0.2);

if ($.inputs.gridTypeVoronoi.checked) {
  $.inputs.height.value = defaultConfig('height', 150);
} else {
  $.inputs.height.value = defaultConfig('height', 60);
}
$.inputs.width.value = defaultConfig('width', $.inputs.height.value * window.innerWidth / window.innerHeight);
$.inputs.max.value = defaultConfig('max', 1);
$.inputs.min.value = defaultConfig('min', -0.2);
$.inputs.gridTypeHexagon.checked = config.shape === 'hexagon';
$.inputs.gridTypeVoronoi.checked = !!config.voronoi;
$.inputs.voronoi.sites.value = defaultConfig('voronoi.sites', 7500);
$.inputs.voronoi.relax.value = defaultConfig('voronoi.relax', 2);
$.inputs.coasts.top.checked = defaultConfig('coasts.top', true);
$.inputs.coasts.bottom.checked = defaultConfig('coasts.bottom', true);
$.inputs.coasts.left.checked = defaultConfig('coasts.left', true);
$.inputs.coasts.right.checked = defaultConfig('coasts.right', true);

// Init UI
updateConfig();
updateUI();
refresh();

// Events
function openConfig() { $.configPanel.classList.add('open'); }
function closeConfig() { $.configPanel.classList.remove('open'); }

$.generater.addEventListener('click', () => {
  updateConfig();
  refresh();
}, false);

$.refresher.addEventListener('click', refresh, false);

$.opener.addEventListener('click', openConfig, false);
$.closer.addEventListener('click', closeConfig, false);
$.grid.addEventListener('click', closeConfig, false);

window.addEventListener('resize', resize, false);

[
  $.inputs.width,
  $.inputs.height,
  $.inputs.max,
  $.inputs.min,
  $.inputs.voronoi.sites,
  $.inputs.voronoi.relax,
].forEach(input => {
  input.addEventListener('input', updateUI);
});

[
  $.inputs.noiseTypeDefault,
  $.inputs.noiseTypeCustom,
  $.inputs.noise.shapeFlat,
  $.inputs.noise.shapeCylindrical,
  $.inputs.noise.shapeSpherical,
  $.inputs.gridTypeVoronoi,
  $.inputs.gridTypeHexagon,
].forEach(input => {
  input.addEventListener('change', updateUI);
});

// Main
function resize() {
  grid.width = window.innerWidth;
  grid.height = window.innerHeight;
  draw(world, config);
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
  history.pushState({}, 'boardgame', '?config=' + JSON.stringify(config));
  grid.classList.remove('hide');
}

function updateUI() {
  if ($.inputs.noiseTypeCustom.checked) {
    $.forEachNode($.details.noise, $.show);
  } else {
    $.forEachNode($.details.noise, $.hide);
  }

  if($.inputs.noise.shapeCylindrical.checked
    || $.inputs.noise.shapeSpherical.checked) {
    $.forEachNode($.details.noiseCircumference, $.show);
  } else {
    $.forEachNode($.details.noiseCircumference, $.hide);
  }

  $.labels.width.innerHTML = `Width: ${$.inputs.width.value}`;
  $.labels.height.innerHTML = `Height: ${$.inputs.height.value}`;
  $.labels.max.innerHTML = `Max: ${$.inputs.max.value}`;
  $.labels.min.innerHTML = `Min: ${$.inputs.min.value}`;
  $.labels.voronoi.sites.innerHTML = `Sites: ${$.inputs.voronoi.sites.value}`;
  $.labels.voronoi.relax.innerHTML = `Relax: ${$.inputs.voronoi.relax.value}`;

  if ($.inputs.gridTypeVoronoi.checked) {
    $.forEachNode($.details.voronoi, $.show);
  } else {
    $.forEachNode($.details.voronoi, $.hide);
  }
  if ($.inputs.gridTypeHexagon.checked) {
    $.forEachNode($.details.hexagons, $.show);
  } else {
    $.forEachNode($.details.hexagons, $.hide);
  }
}

function updateConfig() {
  config = {
    width: parseInt($.inputs.width.value, 10),
    height: parseInt($.inputs.height.value, 10),
    max: parseFloat($.inputs.max.value),
    min: parseFloat($.inputs.min.value),
    coasts: {
      top: $.inputs.coasts.top.checked,
      bottom: $.inputs.coasts.bottom.checked,
      left: $.inputs.coasts.left.checked,
      right: $.inputs.coasts.right.checked
    },
    rivers: {
      number: 10,
      minHeight: 0.6
    },
    // volcanos: {
    //   number: 2,
    //   minHeight: 0.8
    // }
  };

  if ($.inputs.noiseTypeCustom.checked) {
    config.noise = {
      shape: ($.inputs.noise.shapeCylindrical.checked && 'cylindrical')
        || ($.inputs.noise.shapeSpherical.checked && 'spherical')
        || 'flat',
      amplitude: parseFloat($.inputs.noise.amplitude.value),
      octaves: parseInt($.inputs.noise.octaves.value, 10),
      frequency: parseFloat($.inputs.noise.frequency.value),
      persistence: parseFloat($.inputs.noise.persistence.value),
    };

    if($.inputs.noise.shapeCylindrical.checked
      || $.inputs.noise.shapeSpherical.checked) {
      config.noise.circumference = $.inputs.noise.circumference.value;
    }
  }

  if ($.inputs.gridTypeVoronoi.checked) {
    config.voronoi = {
      shape: 'random',
      sites: parseInt($.inputs.voronoi.sites.value, 10),
      relax: parseInt($.inputs.voronoi.relax.value, 10)
    };
  } else if ($.inputs.gridTypeHexagon.checked) {
    config.shape = 'hexagon';
  }
}
