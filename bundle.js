/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _index = __webpack_require__(1);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Elements
	function byId(id) {
	  return document.getElementById(id);
	}

	var $ = {
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
	      relax: byId('inputVoronoiRelax')
	    },
	    coastTop: byId('inputCoastTop'),
	    coastBottom: byId('inputCoastBottom'),
	    coastLeft: byId('inputCoastLeft'),
	    coastRight: byId('inputCoastRight')
	  },
	  labels: {
	    width: byId('labelWidth'),
	    height: byId('labelHeight'),
	    water: byId('labelWater'),
	    voronoi: {
	      sites: byId('labelVoronoiSites'),
	      relax: byId('labelVoronoiRelax')
	    }
	  },
	  details: {
	    voronoi: document.querySelectorAll('.voronoi'),
	    hexagons: document.querySelectorAll('.hexagons')
	  }
	};

	$.context = $.grid.getContext('2d');

	// Events
	$.generater.addEventListener('click', function () {
	  updateConfig();
	  refresh();
	}, false);

	$.refresher.addEventListener('click', refresh, false);

	$.opener.addEventListener('click', function () {
	  $.configPanel.classList.add('open');
	}, false);

	$.closer.addEventListener('click', function () {
	  $.configPanel.classList.remove('open');
	}, false);

	window.addEventListener('resize', resize, false);

	[$.inputs.width, $.inputs.height, $.inputs.water, $.inputs.voronoi.sites, $.inputs.voronoi.relax].forEach(function (input) {
	  input.addEventListener('input', updateUI);
	});

	[$.inputs.gridTypeVoronoi, $.inputs.gridTypeHexagon].forEach(function (input) {
	  input.addEventListener('change', updateUI);
	});

	// Default config
	var config = void 0;
	var world = void 0;

	// Main
	function resize() {
	  grid.width = window.innerWidth;
	  grid.height = window.innerHeight;
	  draw();
	}

	function refresh() {
	  grid.classList.add('hide');
	  var tries = 0;
	  world = undefined;

	  while (!world) {
	    try {
	      tries++;
	      console.log('Config', config);
	      world = (0, _index2.default)(config);
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
	function show(elem) {
	  elem.classList.remove('hidden');
	}
	function hide(elem) {
	  elem.classList.add('hidden');
	}

	function forEachNode(nodes, func) {
	  for (var i = 0, l = nodes.length; i < l; ++i) {
	    func(nodes[i]);
	  }
	}

	function updateUI() {
	  console.log('UPDATE UI');
	  $.labels.width.innerHTML = 'Width: ' + $.inputs.width.value;
	  $.labels.height.innerHTML = 'Height: ' + $.inputs.height.value;
	  $.labels.water.innerHTML = 'Water: ' + $.inputs.water.value;
	  $.labels.voronoi.sites.innerHTML = 'Sites: ' + $.inputs.voronoi.sites.value;
	  $.labels.voronoi.relax.innerHTML = 'Relax: ' + $.inputs.voronoi.relax.value;

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
	    $.context.fillStyle = 'rgba(13,71,161, ' + (0.4 + Math.abs(cell.elevation)) + ')';
	  } else if (cell.elevation < 0) {
	    $.context.fillStyle = '#2f9ceb';
	  } else {
	    $.context.fillStyle = 'rgba(0,0,0, ' + cell.elevation + ')';
	  }

	  $.context.beginPath();
	  var start = format(ratios, cell.edges[0].start);
	  $.context.moveTo(start.x, start.y);

	  cell.edges.forEach(function (edge) {
	    var end = format(ratios, edge.end);
	    $.context.lineTo(end.x, end.y);
	  });
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
	  var v1 = format(ratios, edge.v1);
	  var v2 = format(ratios, edge.v2);
	  $.context.moveTo(v1.x, v1.y);
	  $.context.lineTo(v2.x, v2.y);
	  $.context.stroke();
	  $.context.closePath();
	}

	function draw() {
	  var start = performance.now();
	  var ratios = { width: grid.width / config.width, height: grid.height / config.height };
	  world.grid.cells.forEach(function (cell) {
	    return drawCell(cell, ratios);
	  });
	  world.grid.edges.forEach(function (edge) {
	    return drawEdge(edge, ratios);
	  });
	  console.debug('Duration world drawing:', Math.round(performance.now() - start), 'ms');
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = generate;

	var _fastSimplexNoise = __webpack_require__(2);

	var _fastSimplexNoise2 = _interopRequireDefault(_fastSimplexNoise);

	var _maths = __webpack_require__(3);

	var Maths = _interopRequireWildcard(_maths);

	var _water = __webpack_require__(4);

	var _debug = __webpack_require__(5);

	var Debug = _interopRequireWildcard(_debug);

	var _grid = __webpack_require__(6);

	var Grid = _interopRequireWildcard(_grid);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function generate() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var start = performance.now();

	  var width = options.width;
	  var height = options.height;
	  var _options$coasts = options.coasts;
	  var coasts = _options$coasts === undefined ? {} : _options$coasts;
	  var _options$water = options.water;
	  var water = _options$water === undefined ? 0.2 : _options$water;
	  var shape = options.shape;
	  var voronoi = options.voronoi;
	  var rivers = options.rivers;
	  var volcanos = options.volcanos;


	  var world = {
	    map: {}
	  };

	  var distance = !voronoi && shape === 'hexagon' ? Maths.distanceHexagon2D : Maths.distanceSquare2D;

	  var noise = new _fastSimplexNoise2.default({
	    min: -water,
	    max: 1,
	    // amplitude: 0.2,
	    octaves: 6,
	    frequency: 0.03,
	    persistence: 0.2
	  });

	  var hasCoast = coasts.left || coasts.top || coasts.bottom || coasts.right;
	  var coastElv = hasCoast ? (0, _water.coastElevation)({ width: width, height: height, coasts: coasts, distance: distance }) : function () {
	    return 0;
	  };

	  var grid = voronoi && Grid.voronoi(Object.assign({}, voronoi, { width: width, height: height })) || Grid.hexagon({ width: width, height: height });

	  console.log('Grid valid?', Grid.validate(grid));

	  // Assign elevations
	  grid.cells.forEach(function (cell) {
	    cell.elevation = noise.in2D(cell.x, cell.y) - coastElv(cell.x, cell.y);
	  });

	  grid.edges.forEach(function (edge) {
	    edge.elevation = ((edge.c1 ? edge.c1.elevation : 0) + (edge.c2 ? edge.c2.elevation : 0)) / ((edge.c1 ? 1 : 0) + (edge.c2 ? 1 : 0));
	  });

	  // Ocean
	  if (hasCoast) {
	    (0, _water.tagOcean)(grid.cells, width, height, coasts, distance);
	    (0, _water.removeCoastalLakes)(grid.cells, coastElv);
	  }

	  // Rivers
	  if (rivers) {
	    var riverEdges = grid.edges.filter(function (edge) {
	      return edge.elevation > rivers.minHeight;
	    });

	    if (riverEdges.length > 0) {
	      (function () {
	        var hasWater = function hasWater(edge) {
	          return edge.c1 && (0, _water.isWater)(edge.c1) || edge.c2 && (0, _water.isWater)(edge.c2);
	        };

	        var areTouching = function areTouching(e1, e2) {
	          return e1.v1 === e2.v1 || e1.v1 === e2.v2 || e1.v2 === e2.v1 || e1.v2 === e2.v2;
	        };

	        var isValid = function isValid(reference) {
	          return function (edge) {
	            return edge.elevation < reference.elevation && !hasWater(edge) && areTouching(reference, edge);
	          };
	        };

	        var neighborEdges = function neighborEdges(edge) {
	          var res = [];

	          if (edge.c1) {
	            res = res.concat(edge.c1.edges);
	          }
	          if (edge.c2) {
	            res = res.concat(edge.c2.edges);
	          }

	          return res.map(function (e) {
	            return e.edge;
	          }).filter(isValid(edge));
	        };

	        var removeRiver = function removeRiver(river) {
	          river.forEach(function (edge) {
	            edge.rivers = edge.rivers.filter(function (r) {
	              return r !== river;
	            });
	            if (edge.rivers.length === 0) {
	              edge.rivers = undefined;
	            }
	          });
	        };

	        var riverStarts = [];

	        for (var i = 0; i < rivers.number; ++i) {
	          var edge = riverEdges[Math.floor(Math.random() * (riverEdges.length - 1))];
	          if (edge.rivers === undefined) {
	            var river = [edge];
	            edge.rivers = [river];
	            riverStarts.push(river);
	          }
	        }

	        riverStarts.forEach(function (river) {
	          var next = river[0];
	          while (next) {
	            next = neighborEdges(next).reduce(function (res, e) {
	              if (!res) return e;
	              return e.elevation < res.elevation ? e : res;
	            }, false);

	            if (next) {
	              river.push(next);
	              if (next.rivers) {
	                next.rivers.push(river);
	              } else {
	                next.rivers = [river];
	              }
	            }
	          }
	        });

	        var finalRivers = riverStarts.filter(function (river) {
	          if (river.length < 4) {
	            removeRiver(river);
	            return false;
	          }
	          return true;
	        });
	      })();
	    }
	  }

	  world.grid = grid;

	  // Debug.repartition(tiles);
	  console.debug("Duration world generation:", Math.round(performance.now() - start), 'ms');
	  return world;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * A speed-improved simplex noise algorithm for 2D, 3D and 4D in JavaScript.
	 *
	 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
	 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
	 * Better rank ordering method by Stefan Gustavson in 2012.
	 *
	 * This code was placed in the public domain by its original author,
	 * Stefan Gustavson. You may use it as you see fit, but
	 * attribution is appreciated.
	 */

	// Data ------------------------------------------------------------------------

	var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
	var G3 = 1.0 / 6.0;
	var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

	var GRAD3 = [
	  [ 1, 1, 0], [-1, 1, 0], [ 1,-1, 0], [-1,-1, 0],
	  [ 1, 0, 1], [-1, 0, 1], [ 1, 0,-1], [-1, 0,-1],
	  [ 0, 1, 1], [ 0,-1,-1], [ 0, 1,-1], [ 0,-1,-1]
	];

	var GRAD4 = [
	  [ 0, 1, 1, 1], [ 0, 1, 1,-1], [ 0, 1,-1, 1], [ 0, 1,-1,-1],
	  [ 0,-1, 1, 1], [ 0,-1, 1,-1], [ 0,-1,-1, 1], [ 0,-1,-1,-1],
	  [ 1, 0, 1, 1], [ 1, 0, 1,-1], [ 1, 0,-1, 1], [ 1, 0,-1,-1],
	  [-1, 0, 1, 1], [-1, 0, 1,-1], [-1, 0,-1, 1], [-1, 0,-1,-1],
	  [ 1, 1, 0, 1], [ 1, 1, 0,-1], [ 1,-1, 0, 1], [ 1,-1, 0,-1],
	  [-1, 1, 0, 1], [-1, 1, 0,-1], [-1,-1, 0, 1], [-1,-1, 0,-1],
	  [ 1, 1, 1, 0], [ 1, 1,-1, 0], [ 1,-1, 1, 0], [ 1,-1,-1, 0],
	  [-1, 1, 1, 0], [-1, 1,-1, 0], [-1,-1, 1, 0], [-1,-1,-1, 0]
	];

	// Exports ---------------------------------------------------------------------

	if (true) module.exports = FastSimplexNoise;

	// Functions -------------------------------------------------------------------

	function FastSimplexNoise(options) {
	  if (!options) options = {};

	  this.amplitude = options.amplitude || 1.0;
	  this.frequency = options.frequency || 1.0;
	  this.octaves = parseInt(options.octaves || 1);
	  this.persistence = options.persistence || 0.5;
	  this.random = options.random || Math.random;

	  if (typeof options.min === 'number' && typeof options.max === 'number') {
	    if (options.min >= options.max) {
	      console.error('options.min must be less than options.max');
	    } else {
	      var min = parseFloat(options.min);
	      var max = parseFloat(options.max);
	      var range = max - min;
	      this.scale = function (value) {
	        return min + ((value + 1) / 2) * range;
	      };
	    }
	  }

	  var i;
	  var p = new Uint8Array(256);
	  for (i = 0; i < 256; i++) {
	    p[i] = i;
	  }

	  var n, q;
	  for (i = 255; i > 0; i--) {
	    n = Math.floor((i + 1) * this.random());
	    q = p[i];
	    p[i] = p[n];
	    p[n] = q;
	  }

	  // To remove the need for index wrapping, double the permutation table length
	  this.perm = new Uint8Array(512);
	  this.permMod12 = new Uint8Array(512);
	  for (i = 0; i < 512; i++) {
	    this.perm[i] = p[i & 255];
	    this.permMod12[i] = this.perm[i] % 12;
	  }
	}

	FastSimplexNoise.prototype.cylindrical2D = function (c, x, y) {
	  var nx = x / c;
	  var r = c / (2 * Math.PI);
	  var rdx = nx * 2 * Math.PI;
	  var a = r * Math.sin(rdx);
	  var b = r * Math.cos(rdx);

	  return this.in3D(a, b, y);
	};

	FastSimplexNoise.prototype.cylindrical3D = function (c, x, y, z) {
	  var nx = x / c;
	  var r = c / (2 * Math.PI);
	  var rdx = nx * 2 * Math.PI;
	  var a = r * Math.sin(rdx);
	  var b = r * Math.cos(rdx);

	  return this.in4D(a, b, y, z);
	};

	FastSimplexNoise.prototype.in2D = function (x, y) {
	  var amplitude = this.amplitude;
	  var frequency = this.frequency;
	  var maxAmplitude = 0;
	  var noise = 0;
	  var persistence = this.persistence;

	  for (var i = 0; i < this.octaves; i++) {
	    noise += this.raw2D(x * frequency, y * frequency) * amplitude;
	    maxAmplitude += amplitude;
	    amplitude *= persistence;
	    frequency *= 2;
	  }

	  var value = noise / maxAmplitude;
	  return this.scale ? this.scale(value) : value;
	};

	FastSimplexNoise.prototype.in3D = function (x, y, z) {
	  var amplitude = this.amplitude;
	  var frequency = this.frequency;
	  var maxAmplitude = 0;
	  var noise = 0;
	  var persistence = this.persistence;

	  for (var i = 0; i < this.octaves; i++) {
	    noise += this.raw3D(x * frequency, y * frequency, z * frequency) * amplitude;
	    maxAmplitude += amplitude;
	    amplitude *= persistence;
	    frequency *= 2;
	  }

	  var value = noise / maxAmplitude;
	  return this.scale ? this.scale(value) : value;
	};

	FastSimplexNoise.prototype.in4D = function (x, y, z, w) {
	  var amplitude = this.amplitude;
	  var frequency = this.frequency;
	  var maxAmplitude = 0;
	  var noise = 0;
	  var persistence = this.persistence;

	  for (var i = 0; i < this.octaves; i++) {
	    noise += this.raw4D(x * frequency, y * frequency, z * frequency, w * frequency) * amplitude;
	    maxAmplitude += amplitude;
	    amplitude *= persistence;
	    frequency *= 2;
	  }

	  var value = noise / maxAmplitude;
	  return this.scale ? this.scale(value) : value;
	};

	FastSimplexNoise.prototype.raw2D = function (x, y) {
	  var perm = this.perm;
	  var permMod12 = this.permMod12;

	  var n0, n1, n2; // Noise contributions from the three corners

	  // Skew the input space to determine which simplex cell we're in
	  var s = (x + y) * 0.5 * (Math.sqrt(3.0) - 1.0); // Hairy factor for 2D
	  var i = Math.floor(x + s);
	  var j = Math.floor(y + s);
	  var t = (i + j) * G2;
	  var X0 = i - t; // Unskew the cell origin back to (x,y) space
	  var Y0 = j - t;
	  var x0 = x - X0; // The x,y distances from the cell origin
	  var y0 = y - Y0;

	  // For the 2D case, the simplex shape is an equilateral triangle.
	  // Determine which simplex we are in.
	  var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	  if (x0 > y0) { // Lower triangle, XY order: (0,0)->(1,0)->(1,1)
	    i1 = 1;
	    j1 = 0;
	  } else { // Upper triangle, YX order: (0,0)->(0,1)->(1,1)
	    i1 = 0;
	    j1 = 1;
	  }

	  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	  // c = (3 - sqrt(3)) / 6

	  var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	  var y1 = y0 - j1 + G2;
	  var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
	  var y2 = y0 - 1.0 + 2.0 * G2;

	  // Work out the hashed gradient indices of the three simplex corners
	  var ii = i & 255;
	  var jj = j & 255;
	  var gi0 = permMod12[ii + perm[jj]];
	  var gi1 = permMod12[ii + i1 + perm[jj + j1]];
	  var gi2 = permMod12[ii + 1 + perm[jj + 1]];

	  // Calculate the contribution from the three corners
	  var t0 = 0.5 - x0 * x0 - y0 * y0;
	  if (t0 < 0) {
	    n0 = 0.0;
	  } else {
	    t0 *= t0;
	    // (x,y) of 3D gradient used for 2D gradient
	    n0 = t0 * t0 * dot2D(GRAD3[gi0], x0, y0);
	  }
	  var t1 = 0.5 - x1 * x1 - y1 * y1;
	  if (t1 < 0) {
	    n1 = 0.0;
	  } else {
	    t1 *= t1;
	    n1 = t1 * t1 * dot2D(GRAD3[gi1], x1, y1);
	  }
	  var t2 = 0.5 - x2 * x2 - y2 * y2;
	  if (t2 < 0) {
	    n2 = 0.0;
	  } else {
	    t2 *= t2;
	    n2 = t2 * t2 * dot2D(GRAD3[gi2], x2, y2);
	  }

	  // Add contributions from each corner to get the final noise value.
	  // The result is scaled to return values in the interval [-1, 1];
	  return 70.14805770654148 * (n0 + n1 + n2);
	};

	FastSimplexNoise.prototype.raw3D = function (x, y, z) {
	  var perm = this.perm;
	  var permMod12 = this.permMod12;

	  var n0, n1, n2, n3; // Noise contributions from the four corners

	  // Skew the input space to determine which simplex cell we're in
	  var s = (x + y + z) / 3.0; // Very nice and simple skew factor for 3D
	  var i = Math.floor(x + s);
	  var j = Math.floor(y + s);
	  var k = Math.floor(z + s);
	  var t = (i + j + k) * G3;
	  var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
	  var Y0 = j - t;
	  var Z0 = k - t;
	  var x0 = x - X0; // The x,y,z distances from the cell origin
	  var y0 = y - Y0;
	  var z0 = z - Z0;

	  // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
	  // Determine which simplex we are in.
	  var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
	  var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
	  if (x0 >= y0) {
	    if( y0 >= z0) { // X Y Z order
	      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
	    } else if (x0 >= z0) { // X Z Y order
	      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
	    } else { // Z X Y order
	      i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
	    }
	  } else { // x0 < y0
	    if (y0 < z0) { // Z Y X order
	      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
	    } else if (x0 < z0) { // Y Z X order
	      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
	    } else { // Y X Z order
	      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
	    }
	  }

	  // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
	  // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
	  // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
	  // c = 1/6.
	  var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
	  var y1 = y0 - j1 + G3;
	  var z1 = z0 - k1 + G3;
	  var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
	  var y2 = y0 - j2 + 2.0 * G3;
	  var z2 = z0 - k2 + 2.0 * G3;
	  var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
	  var y3 = y0 - 1.0 + 3.0 * G3;
	  var z3 = z0 - 1.0 + 3.0 * G3;

	  // Work out the hashed gradient indices of the four simplex corners
	  var ii = i & 255;
	  var jj = j & 255;
	  var kk = k & 255;
	  var gi0 = permMod12[ii + perm[jj + perm[kk]]];
	  var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
	  var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
	  var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

	  // Calculate the contribution from the four corners
	  var t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0;
	  if (t0 < 0) {
	    n0 = 0.0;
	  } else {
	    t0 *= t0;
	    n0 = t0 * t0 * dot3D(GRAD3[gi0], x0, y0, z0);
	  }
	  var t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1;
	  if (t1 < 0) {
	    n1 = 0.0;
	  } else {
	    t1 *= t1;
	    n1 = t1 * t1 * dot3D(GRAD3[gi1], x1, y1, z1);
	  }
	  var t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2;
	  if (t2 < 0) {
	    n2 = 0.0;
	  } else {
	    t2 *= t2;
	    n2 = t2 * t2 * dot3D(GRAD3[gi2], x2, y2, z2);
	  }
	  var t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3;
	  if (t3 < 0) {
	    n3 = 0.0;
	  } else {
	    t3 *= t3;
	    n3 = t3 * t3 * dot3D(GRAD3[gi3], x3, y3, z3);
	  }

	  // Add contributions from each corner to get the final noise value.
	  // The result is scaled to stay just inside [-1,1]
	  return 94.68493150681972 * (n0 + n1 + n2 + n3);
	};

	FastSimplexNoise.prototype.raw4D = function (x, y, z, w) {
	  var perm = this.perm;
	  var permMod12 = this.permMod12;

	  var n0, n1, n2, n3, n4; // Noise contributions from the five corners

	  // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
	  var s = (x + y + z + w) * (Math.sqrt(5.0) - 1.0) / 4.0; // Factor for 4D skewing
	  var i = Math.floor(x + s);
	  var j = Math.floor(y + s);
	  var k = Math.floor(z + s);
	  var l = Math.floor(w + s);
	  var t = (i + j + k + l) * G4; // Factor for 4D unskewing
	  var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
	  var Y0 = j - t;
	  var Z0 = k - t;
	  var W0 = l - t;
	  var x0 = x - X0;  // The x,y,z,w distances from the cell origin
	  var y0 = y - Y0;
	  var z0 = z - Z0;
	  var w0 = w - W0;

	  // For the 4D case, the simplex is a 4D shape I won't even try to describe.
	  // To find out which of the 24 possible simplices we're in, we need to
	  // determine the magnitude ordering of x0, y0, z0 and w0.
	  // Six pair-wise comparisons are performed between each possible pair
	  // of the four coordinates, and the results are used to rank the numbers.
	  var rankx = 0;
	  var ranky = 0;
	  var rankz = 0;
	  var rankw = 0;
	  if (x0 > y0) {
	    rankx++;
	  } else {
	    ranky++;
	  }
	  if (x0 > z0) {
	    rankx++;
	  } else {
	    rankz++;
	  }
	  if (x0 > w0) {
	    rankx++;
	  } else {
	    rankw++;
	  }
	  if (y0 > z0) {
	    ranky++;
	  } else {
	    rankz++;
	  }
	  if (y0 > w0) {
	    ranky++;
	  } else {
	    rankw++;
	  }
	  if (z0 > w0) {
	    rankz++;
	  } else {
	    rankw++;
	  }
	  var i1, j1, k1, l1; // The integer offsets for the second simplex corner
	  var i2, j2, k2, l2; // The integer offsets for the third simplex corner
	  var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner

	  // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
	  // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
	  // impossible. Only the 24 indices which have non-zero entries make any sense.
	  // We use a thresholding to set the coordinates in turn from the largest magnitude.
	  // Rank 3 denotes the largest coordinate.
	  i1 = rankx >= 3 ? 1 : 0;
	  j1 = ranky >= 3 ? 1 : 0;
	  k1 = rankz >= 3 ? 1 : 0;
	  l1 = rankw >= 3 ? 1 : 0;
	  // Rank 2 denotes the second largest coordinate.
	  i2 = rankx >= 2 ? 1 : 0;
	  j2 = ranky >= 2 ? 1 : 0;
	  k2 = rankz >= 2 ? 1 : 0;
	  l2 = rankw >= 2 ? 1 : 0;
	  // Rank 1 denotes the second smallest coordinate.
	  i3 = rankx >= 1 ? 1 : 0;
	  j3 = ranky >= 1 ? 1 : 0;
	  k3 = rankz >= 1 ? 1 : 0;
	  l3 = rankw >= 1 ? 1 : 0;

	  // The fifth corner has all coordinate offsets = 1, so no need to compute that.
	  var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
	  var y1 = y0 - j1 + G4;
	  var z1 = z0 - k1 + G4;
	  var w1 = w0 - l1 + G4;
	  var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
	  var y2 = y0 - j2 + 2.0 * G4;
	  var z2 = z0 - k2 + 2.0 * G4;
	  var w2 = w0 - l2 + 2.0 * G4;
	  var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
	  var y3 = y0 - j3 + 3.0 * G4;
	  var z3 = z0 - k3 + 3.0 * G4;
	  var w3 = w0 - l3 + 3.0 * G4;
	  var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
	  var y4 = y0 - 1.0 + 4.0 * G4;
	  var z4 = z0 - 1.0 + 4.0 * G4;
	  var w4 = w0 - 1.0 + 4.0 * G4;

	  // Work out the hashed gradient indices of the five simplex corners
	  var ii = i & 255;
	  var jj = j & 255;
	  var kk = k & 255;
	  var ll = l & 255;
	  var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32;
	  var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32;
	  var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32;
	  var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32;
	  var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32;

	  // Calculate the contribution from the five corners
	  var t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
	  if (t0 < 0) {
	    n0 = 0.0;
	  } else {
	    t0 *= t0;
	    n0 = t0 * t0 * dot4D(GRAD4[gi0], x0, y0, z0, w0);
	  }
	  var t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
	  if (t1 < 0) {
	    n1 = 0.0;
	  } else {
	    t1 *= t1;
	    n1 = t1 * t1 * dot4D(GRAD4[gi1], x1, y1, z1, w1);
	  }
	  var t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
	  if (t2 < 0) {
	    n2 = 0.0;
	  } else {
	    t2 *= t2;
	    n2 = t2 * t2 * dot4D(GRAD4[gi2], x2, y2, z2, w2);
	  }
	  var t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
	  if (t3 < 0) {
	    n3 = 0.0;
	  } else {
	    t3 *= t3;
	    n3 = t3 * t3 * dot4D(GRAD4[gi3], x3, y3, z3, w3);
	  }
	  var t4 = 0.5 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
	  if (t4 < 0) {
	    n4 = 0.0;
	  } else {
	    t4 *= t4;
	    n4 = t4 * t4 * dot4D(GRAD4[gi4], x4, y4, z4, w4);
	  }

	  // Sum up and scale the result to cover the range [-1,1]
	  return 72.37857097679466 * (n0 + n1 + n2 + n3 + n4);
	};

	FastSimplexNoise.prototype.spherical2D = function (c, x, y) {
	  var nx = x / c;
	  var ny = y / c;
	  var rdx = nx * 2 * Math.PI;
	  var rdy = ny * Math.PI;
	  var sinY = Math.sin(rdy + Math.PI);
	  var sinRds = 2 * Math.PI;
	  var a = sinRds * Math.sin(rdx) * sinY;
	  var b = sinRds * Math.cos(rdx) * sinY;
	  var d = sinRds * Math.cos(rdy);

	  return this.in3D(a, b, d);
	};

	FastSimplexNoise.prototype.spherical3D = function (c, x, y, z) {
	  var nx = x / c;
	  var ny = y / c;
	  var rdx = nx * 2 * Math.PI;
	  var rdy = ny * Math.PI;
	  var sinY = Math.sin(rdy + Math.PI);
	  var sinRds = 2 * Math.PI;
	  var a = sinRds * Math.sin(rdx) * sinY;
	  var b = sinRds * Math.cos(rdx) * sinY;
	  var d = sinRds * Math.cos(rdy);

	  return this.in4D(a, b, d, z);
	};

	function dot2D(g, x, y) {
	  return g[0] * x + g[1] * y;
	}

	function dot3D(g, x, y, z) {
	  return g[0] * x + g[1] * y + g[2] * z;
	}

	function dot4D(g, x, y, z, w) {
	  return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.neighborsSquare2D = neighborsSquare2D;
	exports.neighborsHegaxon2D = neighborsHegaxon2D;
	exports.distanceSquare2D = distanceSquare2D;
	exports.distanceHexagon2D = distanceHexagon2D;
	function neighborsSquare2D(x, y) {
	  return [{ x: x + 1, y: y }, { x: x - 1, y: y }, { x: x, y: y - 1 }, { x: x, y: y + 1 }];
	}

	function neighborsHegaxon2D(x, y) {
	  return [{ x: x + 1, y: y }, { x: x + 1, y: y - 1 }, { x: x, y: y - 1 }, { x: x - 1, y: y }, { x: x - 1, y: y + 1 }, { x: x, y: y + 1 }];
	}

	function distanceSquare2D(x1, y1, x2, y2) {
	  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

	function distanceHexagon2D(x1, y1, x2, y2) {
	  return (Math.abs(x1 - x2) + Math.abs(x1 + y1 - x2 - y2) + Math.abs(y1 - y2)) / 2;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isWater = isWater;
	exports.filterWater = filterWater;
	exports.filterOcean = filterOcean;
	exports.coastElevation = coastElevation;
	exports.tagOcean = tagOcean;
	exports.removeCoastalLakes = removeCoastalLakes;
	exports.normalizeWaterLevel = normalizeWaterLevel;
	function isWater(tile) {
	  return tile.elevation < 0;
	}

	function filterWater(tiles) {
	  return tiles.filter(isWater);
	}

	function filterOcean(tiles) {
	  return tiles.filter(function (tile) {
	    return tile.ocean;
	  });
	}

	function coastElevation(_ref) {
	  var width = _ref.width;
	  var height = _ref.height;
	  var coasts = _ref.coasts;
	  var distance = _ref.distance;

	  var cx = width / 2;
	  var cy = height / 2;

	  // FIXME center tile always return 0 => always keep water
	  // FIXME ponderate if width !== height
	  return function (x, y) {
	    return Math.pow(distance(coasts.left && x < cx || coasts.right && x >= cx ? x : cx, coasts.top && y < cy || coasts.bottom && y >= cy ? y : cy, cx, cy) / Math.min(cx, cy), 3);
	  };
	}

	function tagOcean(cells, width, height, coasts, distance) {
	  var starts = [];

	  var distTopLeft = function distTopLeft(cell) {
	    return distance(0, 0, cell.x, cell.y);
	  };
	  var distTopRight = function distTopRight(cell) {
	    return distance(width, 0, cell.x, cell.y);
	  };
	  var distBottomLeft = function distBottomLeft(cell) {
	    return distance(0, height, cell.x, cell.y);
	  };
	  var distBottomRight = function distBottomRight(cell) {
	    return distance(width, height, cell.x, cell.y);
	  };

	  var _cells$reduce = cells.reduce(function (res, cell) {
	    if (distTopLeft(cell) < distTopLeft(res.topLeft)) {
	      res.topLeft = cell;
	    }
	    if (distTopRight(cell) < distTopRight(res.topRight)) {
	      res.topRight = cell;
	    }
	    if (distBottomLeft(cell) < distBottomLeft(res.bottomLeft)) {
	      res.bottomLeft = cell;
	    }
	    if (distBottomRight(cell) < distBottomRight(res.bottomRight)) {
	      res.bottomRight = cell;
	    }
	    return res;
	  }, {
	    topLeft: cells[0], topRight: cells[0], bottomLeft: cells[0], bottomRight: cells[0]
	  });

	  var topLeft = _cells$reduce.topLeft;
	  var topRight = _cells$reduce.topRight;
	  var bottomLeft = _cells$reduce.bottomLeft;
	  var bottomRight = _cells$reduce.bottomRight;


	  if (coasts.top) {
	    starts.push(topLeft);
	    starts.push(topRight);
	  }
	  if (coasts.bottom) {
	    starts.push(bottomLeft);
	    starts.push(bottomRight);
	  }
	  if (coasts.left) {
	    starts.push(topLeft);
	    starts.push(bottomLeft);
	  }
	  if (coasts.right) {
	    starts.push(topRight);
	    starts.push(bottomRight);
	  }

	  var deeper = 0;
	  var ocean = starts.filter(isWater).map(function (t) {
	    t.ocean = true;return t;
	  });
	  while (ocean.length) {
	    var next = ocean.shift();
	    deeper = Math.min(deeper, next.elevation);
	    next.neighbors.forEach(function (cell) {
	      if (cell && cell.ocean === undefined) {
	        cell.ocean = isWater(cell);
	        if (cell.ocean) {
	          ocean.push(cell);
	        }
	      }
	    });
	  }

	  deeper = Math.abs(deeper);
	  cells.filter(function (c) {
	    return c.ocean;
	  }).forEach(function (cell) {
	    cell.elevation /= deeper;
	  });
	}

	function removeCoastalLakes(cells, coastElv) {
	  filterWater(cells).forEach(function (cell) {
	    if (!cell.ocean && coastElv(cell.x, cell.y) > 0) {
	      cell.elevation = 0.01;
	    }
	  });
	}

	function normalizeWaterLevel(tiles, water) {
	  var _loop = function _loop(i) {
	    console.log(i, '->', i + 0.1, ':', tiles.filter(function (t) {
	      return t.elevation >= i && t.elevation < i + 0.1;
	    }).length / tiles.length * 100);
	  };

	  // debug
	  for (var i = 0; i < 1; i += 0.1) {
	    _loop(i);
	  }

	  // Regulate water percentage
	  var maxHeight = 1;
	  var waterPercentage = filterWater(tiles).length / tiles.length;
	  var waterStep = 0.01;

	  if (waterPercentage < water) {
	    while (waterPercentage < water) {
	      maxHeight -= waterStep;
	      tiles.forEach(function (tile) {
	        return tile.elevation -= waterStep;
	      });
	      waterPercentage = filterWater(tiles).length / tiles.length;
	    }
	  } else {
	    while (waterPercentage > water) {
	      maxHeight += waterStep;
	      tiles.forEach(function (tile) {
	        return tile.elevation += waterStep;
	      });
	      waterPercentage = filterWater(tiles).length / tiles.length;
	    }
	  }

	  // Normalize height
	  tiles.forEach(function (tile) {
	    return tile.elevation /= maxHeight;
	  });
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.repartition = repartition;
	function repartition(tiles) {
	  var waterTiles = 0;
	  var lowTiles = 0;
	  var mediumTiles = 0;
	  var highTiles = 0;
	  var veryhighTiles = 0;
	  tiles.forEach(function (_ref) {
	    var elevation = _ref.elevation;

	    if (elevation < 0) {
	      waterTiles++;
	    } else if (elevation < 0.25) {
	      lowTiles++;
	    } else if (elevation < 0.50) {
	      mediumTiles++;
	    } else if (elevation < 0.75) {
	      highTiles++;
	    } else {
	      veryhighTiles++;
	    }
	  });
	  console.log(100 * waterTiles / tiles.length, 100 * lowTiles / tiles.length, 100 * mediumTiles / tiles.length, 100 * highTiles / tiles.length, 100 * veryhighTiles / tiles.length);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _hexagon = __webpack_require__(7);

	Object.defineProperty(exports, 'hexagon', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_hexagon).default;
	  }
	});

	var _validate = __webpack_require__(8);

	Object.defineProperty(exports, 'validate', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_validate).default;
	  }
	});

	var _voronoi = __webpack_require__(9);

	Object.defineProperty(exports, 'voronoi', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_voronoi).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = generateHexagonGrid;
	function hashVertex(vertex) {
	  return '' + vertex.x + '_' + ('' + vertex.y);
	}

	function hashEdge(edge) {
	  return hashVertex(edge.v1) + '__' + hashVertex(edge.v2);
	}

	function hashEdgeAlt(edge) {
	  return hashVertex(edge.v2) + '__' + hashVertex(edge.v1);
	}

	function getVertices(x, y) {
	  return [{ x: x - 1 / 3, y: y - 1 / 3 }, { x: x - 2 / 3, y: y + 1 / 3 }, { x: x - 1 / 3, y: y + 2 / 3 }, { x: x + 1 / 3, y: y + 1 / 3 }, { x: x + 2 / 3, y: y - 1 / 3 }, { x: x + 1 / 3, y: y - 2 / 3 }];
	}

	function round(num) {
	  return Math.floor(10000 * num) / 10000;
	}

	function generateHexagonGrid() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var width = options.width;
	  var height = options.height;
	  var _options$isFlat = options.isFlat;
	  var isFlat = _options$isFlat === undefined ? true : _options$isFlat;

	  var vertices = {};
	  var edges = {};
	  var cells = [];

	  for (var x = 0; x < width; ++x) {
	    var startY = x === 0 ? 0 : -1 * Math.floor(x / 2);
	    var endY = startY + height;

	    for (var y = startY; y < endY; ++y) {
	      var cell = { x: x, y: y, edges: [], neighbors: [] };

	      var hexagonVertices = getVertices(x, y).map(function (vertex) {
	        return {
	          x: round(vertex.x),
	          y: round(vertex.y)
	        };
	      });

	      for (var i = 0; i < 6; ++i) {
	        var hash = hashVertex(hexagonVertices[i]);
	        if (vertices[hash]) {
	          hexagonVertices[i] = vertices[hash];
	        } else {
	          vertices[hash] = hexagonVertices[i];
	        }
	      }

	      var hexagonEdges = [];

	      for (var _i = 0; _i < 6; ++_i) {
	        hexagonEdges.push({
	          v1: hexagonVertices[_i % 6],
	          v2: hexagonVertices[(_i + 1) % 6]
	        });
	      }

	      for (var _i2 = 0; _i2 < 6; ++_i2) {
	        var hash1 = hashEdge(hexagonEdges[_i2]);
	        var hash2 = hashEdgeAlt(hexagonEdges[_i2]);

	        if (edges[hash1] || edges[hash2]) {
	          hexagonEdges[_i2] = edges[hash1] || edges[hash2];
	          hexagonEdges[_i2].c2 = cell;
	        } else {
	          edges[hash1] = hexagonEdges[_i2];
	          hexagonEdges[_i2].c1 = cell;
	        }
	      }

	      for (var _i3 = 0; _i3 < 6; ++_i3) {
	        cell.edges.push({
	          start: hexagonVertices[_i3],
	          end: hexagonVertices[(_i3 + 1) % 6],
	          edge: hexagonEdges[_i3]
	        });
	      }

	      cells.push(cell);
	    }
	  }

	  var grid = {
	    vertices: Object.keys(vertices).map(function (key) {
	      return vertices[key];
	    }),
	    edges: Object.keys(edges).map(function (key) {
	      return edges[key];
	    }),
	    cells: cells
	  };

	  grid.edges.forEach(function (edge) {
	    if (edge.c1 && edge.c2) {
	      edge.c1.neighbors.push(edge.c2);
	      edge.c2.neighbors.push(edge.c1);
	    }
	  });

	  return grid;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = validate;
	// Schema
	// {
	// vertices: [{x, y}, ...],
	// edges: [{v1: Vertex, v1: Vertex, c1: Cell, c2: Cell}],
	// cells: [{
	//   x,
	//   y,
	//   neighbors: [Cell, ...],
	//   edges: [{start: Vertex, end: Vertex, edge: Edge}, ...]
	// }, ...]
	// }

	function isVertex(vertex) {
	  return vertex && typeof vertex.x === 'number' && typeof vertex.y === 'number';
	}

	function hasVertices(grid) {
	  return Array.isArray(grid.vertices) && grid.vertices.every(isVertex);
	}

	function isCell(cell) {
	  return cell && Array.isArray(cell.edges) && cell.edges.every(isOrientedEdge) && typeof cell.x === 'number' && typeof cell.y === 'number' && Array.isArray(cell.neighbors) && cell.neighbors.length > 0;
	}

	function hasCells(grid) {
	  return Array.isArray(grid.cells) && grid.cells.every(isCell);
	}

	function isOrientedEdge(edge) {
	  return edge && isVertex(edge.start) && isVertex(edge.end) && isEdge(edge.edge);
	}

	function isEdge(edge) {
	  return edge && isVertex(edge.v1) && isVertex(edge.v2);
	}

	function hasEdges(grid) {
	  return Array.isArray(grid.edges) && grid.edges.every(isEdge);
	}

	function validate(grid) {
	  return (typeof grid === 'undefined' ? 'undefined' : _typeof(grid)) === 'object' && hasVertices(grid) && hasCells(grid) && hasEdges(grid);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = generateVoronoiGrid;

	var _voronoi = __webpack_require__(10);

	var _voronoi2 = _interopRequireDefault(_voronoi);

	var _maths = __webpack_require__(3);

	var Maths = _interopRequireWildcard(_maths);

	var _validate = __webpack_require__(8);

	var _validate2 = _interopRequireDefault(_validate);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var sqrt3 = Math.sqrt(3);

	function hexagonSide(area) {
	  return Math.sqrt(2 * area / (3 * sqrt3));
	}

	function generateSites(number, shape, width, height) {
	  var sites = [];
	  if (shape === 'random') {
	    for (var i = 0; i < number; ++i) {
	      sites.push({
	        x: Math.floor(Math.random() * width),
	        y: Math.floor(Math.random() * height)
	      });
	    }
	  } else {
	    var area = width * height / number;
	    var delta = shape === 'hexagon' ? { x: 2 * hexagonSide(area), y: sqrt3 * hexagonSide(area) } : { x: Math.sqrt(area), y: Math.sqrt(area) };

	    console.log(delta);
	    var x = 0.5;
	    var y = 0.5;
	    for (var _i = 0; _i < number; ++_i) {
	      sites.push({
	        x: Math.max(Math.min(Math.round(x * delta.x), width), 0),
	        y: Math.max(Math.min(Math.round(y * delta.y), height), 0)
	      });
	      console.log(sites[sites.length - 1]);
	      x++;
	      if (x * delta.x > width) {
	        // start a new line
	        x = shape === 'square' || y % 2 === 1 ? 0.5 : 1.5;
	        y++;
	      }
	    }
	  }
	  return sites;
	}

	function generateDiagram(voronoi, sites, previousDiagram, width, height) {
	  if (previousDiagram) {
	    voronoi.recycle(previousDiagram);
	  }
	  var area = { xl: 0, xr: width, yt: 0, yb: height };
	  return voronoi.compute(sites, area);
	}

	function getCellArea(cell) {
	  return cell.halfedges.reduce(function (area, edge) {
	    var start = edge.getStartpoint();
	    var end = edge.getEndpoint();
	    return area + start.x * end.y - start.y * end.x;
	  }, 0) / 2;
	}

	function getCellCentroid(cell) {
	  var area = getCellArea(cell) * 6;
	  var centroid = cell.halfedges.reduce(function (cent, edge) {
	    var start = edge.getStartpoint();
	    var end = edge.getEndpoint();
	    var localArea = start.x * end.y - end.x * start.y;
	    cent.x += (start.x + end.x) * localArea;
	    cent.y += (start.y + end.y) * localArea;
	    return cent;
	  }, { x: 0, y: 0 });

	  return {
	    x: centroid.x / area,
	    y: centroid.y / area
	  };
	}

	function relaxDiagram(voronoi, diagram, width, height) {
	  var prob = 0.1 / diagram.cells.length;
	  var sites = [];

	  diagram.cells.forEach(function (cell) {
	    var rand = Math.random();
	    if (rand < prob) {
	      // apoptosis
	      return;
	    }

	    var site = getCellCentroid(cell);
	    var distance = Maths.distanceSquare2D(site.x, site.y, cell.site.x, cell.site.y);

	    if (distance > 2) {
	      site.x = (site.x + cell.site.x) / 2;
	      site.y = (site.y + cell.site.y) / 2;
	    }

	    if (rand > 1 - prob) {
	      // mytosis
	      sites.push({
	        x: site.x + 2 * (site.x - cell.site.x) / distance,
	        y: site.y + 2 * (site.y - cell.site.y) / distance
	      });
	    }

	    sites.push(site);
	  });

	  return generateDiagram(voronoi, sites, diagram, width, height);
	}

	function normalizeDiagram(diagram) {
	  diagram.cells.forEach(function (cell) {
	    cell.site.cell = cell;
	    cell.x = cell.site.x;
	    cell.y = cell.site.y;
	    cell.neighbors = [];
	    cell.edges = cell.halfedges;
	    cell.edges.forEach(function (edge) {
	      edge.start = edge.getStartpoint();
	      edge.end = edge.getEndpoint();
	    });
	  });

	  diagram.edges.forEach(function (edge) {
	    var lCell = edge.lSite && edge.lSite.cell;
	    var rCell = edge.rSite && edge.rSite.cell;
	    if (lCell && rCell) {
	      lCell.neighbors.push(rCell);
	      rCell.neighbors.push(lCell);
	    }

	    edge.v1 = edge.va;
	    edge.v2 = edge.vb;
	    edge.c1 = lCell;
	    edge.c2 = rCell;
	  });

	  return diagram;
	}

	function generateVoronoiGrid() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var width = // random | square | hexagon
	  options.width;
	  var // the total grid width
	  height = options.height;
	  var numberOfSites = options.sites;
	  var _options$relax = options.relax;
	  var // the number of cells/polygons to generate
	  relax = _options$relax === undefined ? 2 : _options$relax;
	  var _options$shape = options.shape;
	  var // the number of relaxation phases to apply, the more, the smoother the cells
	  shape = _options$shape === undefined ? 'random' : _options$shape;


	  var voronoi = new _voronoi2.default();
	  var sites = generateSites(numberOfSites, shape, width, height);
	  var diagram = generateDiagram(voronoi, sites, undefined, width, height);
	  for (var i = 0; i < relax; ++i) {
	    diagram = relaxDiagram(voronoi, diagram, width, height);
	  }

	  return normalizeDiagram(diagram);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	Copyright (C) 2010-2013 Raymond Hill: https://github.com/gorhill/Javascript-Voronoi
	MIT License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
	*/
	/*
	Author: Raymond Hill (rhill@raymondhill.net)
	Contributor: Jesse Morgan (morgajel@gmail.com)
	File: rhill-voronoi-core.js
	Version: 0.98
	Date: January 21, 2013
	Description: This is my personal Javascript implementation of
	Steven Fortune's algorithm to compute Voronoi diagrams.

	License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
	Credits: See https://github.com/gorhill/Javascript-Voronoi/CREDITS.md
	History: See https://github.com/gorhill/Javascript-Voronoi/CHANGELOG.md

	## Usage:

	  var sites = [{x:300,y:300}, {x:100,y:100}, {x:200,y:500}, {x:250,y:450}, {x:600,y:150}];
	  // xl, xr means x left, x right
	  // yt, yb means y top, y bottom
	  var bbox = {xl:0, xr:800, yt:0, yb:600};
	  var voronoi = new Voronoi();
	  // pass an object which exhibits xl, xr, yt, yb properties. The bounding
	  // box will be used to connect unbound edges, and to close open cells
	  result = voronoi.compute(sites, bbox);
	  // render, further analyze, etc.

	Return value:
	  An object with the following properties:

	  result.vertices = an array of unordered, unique Voronoi.Vertex objects making
	    up the Voronoi diagram.
	  result.edges = an array of unordered, unique Voronoi.Edge objects making up
	    the Voronoi diagram.
	  result.cells = an array of Voronoi.Cell object making up the Voronoi diagram.
	    A Cell object might have an empty array of halfedges, meaning no Voronoi
	    cell could be computed for a particular cell.
	  result.execTime = the time it took to compute the Voronoi diagram, in
	    milliseconds.

	Voronoi.Vertex object:
	  x: The x position of the vertex.
	  y: The y position of the vertex.

	Voronoi.Edge object:
	  lSite: the Voronoi site object at the left of this Voronoi.Edge object.
	  rSite: the Voronoi site object at the right of this Voronoi.Edge object (can
	    be null).
	  va: an object with an 'x' and a 'y' property defining the start point
	    (relative to the Voronoi site on the left) of this Voronoi.Edge object.
	  vb: an object with an 'x' and a 'y' property defining the end point
	    (relative to Voronoi site on the left) of this Voronoi.Edge object.

	  For edges which are used to close open cells (using the supplied bounding
	  box), the rSite property will be null.

	Voronoi.Cell object:
	  site: the Voronoi site object associated with the Voronoi cell.
	  halfedges: an array of Voronoi.Halfedge objects, ordered counterclockwise,
	    defining the polygon for this Voronoi cell.

	Voronoi.Halfedge object:
	  site: the Voronoi site object owning this Voronoi.Halfedge object.
	  edge: a reference to the unique Voronoi.Edge object underlying this
	    Voronoi.Halfedge object.
	  getStartpoint(): a method returning an object with an 'x' and a 'y' property
	    for the start point of this halfedge. Keep in mind halfedges are always
	    countercockwise.
	  getEndpoint(): a method returning an object with an 'x' and a 'y' property
	    for the end point of this halfedge. Keep in mind halfedges are always
	    countercockwise.

	TODO: Identify opportunities for performance improvement.

	TODO: Let the user close the Voronoi cells, do not do it automatically. Not only let
	      him close the cells, but also allow him to close more than once using a different
	      bounding box for the same Voronoi diagram.
	*/

	/*global Math */

	// ---------------------------------------------------------------------------

	function Voronoi() {
	    this.vertices = null;
	    this.edges = null;
	    this.cells = null;
	    this.toRecycle = null;
	    this.beachsectionJunkyard = [];
	    this.circleEventJunkyard = [];
	    this.vertexJunkyard = [];
	    this.edgeJunkyard = [];
	    this.cellJunkyard = [];
	    }

	// ---------------------------------------------------------------------------

	Voronoi.prototype.reset = function() {
	    if (!this.beachline) {
	        this.beachline = new this.RBTree();
	        }
	    // Move leftover beachsections to the beachsection junkyard.
	    if (this.beachline.root) {
	        var beachsection = this.beachline.getFirst(this.beachline.root);
	        while (beachsection) {
	            this.beachsectionJunkyard.push(beachsection); // mark for reuse
	            beachsection = beachsection.rbNext;
	            }
	        }
	    this.beachline.root = null;
	    if (!this.circleEvents) {
	        this.circleEvents = new this.RBTree();
	        }
	    this.circleEvents.root = this.firstCircleEvent = null;
	    this.vertices = [];
	    this.edges = [];
	    this.cells = [];
	    };

	Voronoi.prototype.sqrt = Math.sqrt;
	Voronoi.prototype.abs = Math.abs;
	Voronoi.prototype.ε = Voronoi.ε = 1e-9;
	Voronoi.prototype.invε = Voronoi.invε = 1.0 / Voronoi.ε;
	Voronoi.prototype.equalWithEpsilon = function(a,b){return this.abs(a-b)<1e-9;};
	Voronoi.prototype.greaterThanWithEpsilon = function(a,b){return a-b>1e-9;};
	Voronoi.prototype.greaterThanOrEqualWithEpsilon = function(a,b){return b-a<1e-9;};
	Voronoi.prototype.lessThanWithEpsilon = function(a,b){return b-a>1e-9;};
	Voronoi.prototype.lessThanOrEqualWithEpsilon = function(a,b){return a-b<1e-9;};

	// ---------------------------------------------------------------------------
	// Red-Black tree code (based on C version of "rbtree" by Franck Bui-Huu
	// https://github.com/fbuihuu/libtree/blob/master/rb.c

	Voronoi.prototype.RBTree = function() {
	    this.root = null;
	    };

	Voronoi.prototype.RBTree.prototype.rbInsertSuccessor = function(node, successor) {
	    var parent;
	    if (node) {
	        // >>> rhill 2011-05-27: Performance: cache previous/next nodes
	        successor.rbPrevious = node;
	        successor.rbNext = node.rbNext;
	        if (node.rbNext) {
	            node.rbNext.rbPrevious = successor;
	            }
	        node.rbNext = successor;
	        // <<<
	        if (node.rbRight) {
	            // in-place expansion of node.rbRight.getFirst();
	            node = node.rbRight;
	            while (node.rbLeft) {node = node.rbLeft;}
	            node.rbLeft = successor;
	            }
	        else {
	            node.rbRight = successor;
	            }
	        parent = node;
	        }
	    // rhill 2011-06-07: if node is null, successor must be inserted
	    // to the left-most part of the tree
	    else if (this.root) {
	        node = this.getFirst(this.root);
	        // >>> Performance: cache previous/next nodes
	        successor.rbPrevious = null;
	        successor.rbNext = node;
	        node.rbPrevious = successor;
	        // <<<
	        node.rbLeft = successor;
	        parent = node;
	        }
	    else {
	        // >>> Performance: cache previous/next nodes
	        successor.rbPrevious = successor.rbNext = null;
	        // <<<
	        this.root = successor;
	        parent = null;
	        }
	    successor.rbLeft = successor.rbRight = null;
	    successor.rbParent = parent;
	    successor.rbRed = true;
	    // Fixup the modified tree by recoloring nodes and performing
	    // rotations (2 at most) hence the red-black tree properties are
	    // preserved.
	    var grandpa, uncle;
	    node = successor;
	    while (parent && parent.rbRed) {
	        grandpa = parent.rbParent;
	        if (parent === grandpa.rbLeft) {
	            uncle = grandpa.rbRight;
	            if (uncle && uncle.rbRed) {
	                parent.rbRed = uncle.rbRed = false;
	                grandpa.rbRed = true;
	                node = grandpa;
	                }
	            else {
	                if (node === parent.rbRight) {
	                    this.rbRotateLeft(parent);
	                    node = parent;
	                    parent = node.rbParent;
	                    }
	                parent.rbRed = false;
	                grandpa.rbRed = true;
	                this.rbRotateRight(grandpa);
	                }
	            }
	        else {
	            uncle = grandpa.rbLeft;
	            if (uncle && uncle.rbRed) {
	                parent.rbRed = uncle.rbRed = false;
	                grandpa.rbRed = true;
	                node = grandpa;
	                }
	            else {
	                if (node === parent.rbLeft) {
	                    this.rbRotateRight(parent);
	                    node = parent;
	                    parent = node.rbParent;
	                    }
	                parent.rbRed = false;
	                grandpa.rbRed = true;
	                this.rbRotateLeft(grandpa);
	                }
	            }
	        parent = node.rbParent;
	        }
	    this.root.rbRed = false;
	    };

	Voronoi.prototype.RBTree.prototype.rbRemoveNode = function(node) {
	    // >>> rhill 2011-05-27: Performance: cache previous/next nodes
	    if (node.rbNext) {
	        node.rbNext.rbPrevious = node.rbPrevious;
	        }
	    if (node.rbPrevious) {
	        node.rbPrevious.rbNext = node.rbNext;
	        }
	    node.rbNext = node.rbPrevious = null;
	    // <<<
	    var parent = node.rbParent,
	        left = node.rbLeft,
	        right = node.rbRight,
	        next;
	    if (!left) {
	        next = right;
	        }
	    else if (!right) {
	        next = left;
	        }
	    else {
	        next = this.getFirst(right);
	        }
	    if (parent) {
	        if (parent.rbLeft === node) {
	            parent.rbLeft = next;
	            }
	        else {
	            parent.rbRight = next;
	            }
	        }
	    else {
	        this.root = next;
	        }
	    // enforce red-black rules
	    var isRed;
	    if (left && right) {
	        isRed = next.rbRed;
	        next.rbRed = node.rbRed;
	        next.rbLeft = left;
	        left.rbParent = next;
	        if (next !== right) {
	            parent = next.rbParent;
	            next.rbParent = node.rbParent;
	            node = next.rbRight;
	            parent.rbLeft = node;
	            next.rbRight = right;
	            right.rbParent = next;
	            }
	        else {
	            next.rbParent = parent;
	            parent = next;
	            node = next.rbRight;
	            }
	        }
	    else {
	        isRed = node.rbRed;
	        node = next;
	        }
	    // 'node' is now the sole successor's child and 'parent' its
	    // new parent (since the successor can have been moved)
	    if (node) {
	        node.rbParent = parent;
	        }
	    // the 'easy' cases
	    if (isRed) {return;}
	    if (node && node.rbRed) {
	        node.rbRed = false;
	        return;
	        }
	    // the other cases
	    var sibling;
	    do {
	        if (node === this.root) {
	            break;
	            }
	        if (node === parent.rbLeft) {
	            sibling = parent.rbRight;
	            if (sibling.rbRed) {
	                sibling.rbRed = false;
	                parent.rbRed = true;
	                this.rbRotateLeft(parent);
	                sibling = parent.rbRight;
	                }
	            if ((sibling.rbLeft && sibling.rbLeft.rbRed) || (sibling.rbRight && sibling.rbRight.rbRed)) {
	                if (!sibling.rbRight || !sibling.rbRight.rbRed) {
	                    sibling.rbLeft.rbRed = false;
	                    sibling.rbRed = true;
	                    this.rbRotateRight(sibling);
	                    sibling = parent.rbRight;
	                    }
	                sibling.rbRed = parent.rbRed;
	                parent.rbRed = sibling.rbRight.rbRed = false;
	                this.rbRotateLeft(parent);
	                node = this.root;
	                break;
	                }
	            }
	        else {
	            sibling = parent.rbLeft;
	            if (sibling.rbRed) {
	                sibling.rbRed = false;
	                parent.rbRed = true;
	                this.rbRotateRight(parent);
	                sibling = parent.rbLeft;
	                }
	            if ((sibling.rbLeft && sibling.rbLeft.rbRed) || (sibling.rbRight && sibling.rbRight.rbRed)) {
	                if (!sibling.rbLeft || !sibling.rbLeft.rbRed) {
	                    sibling.rbRight.rbRed = false;
	                    sibling.rbRed = true;
	                    this.rbRotateLeft(sibling);
	                    sibling = parent.rbLeft;
	                    }
	                sibling.rbRed = parent.rbRed;
	                parent.rbRed = sibling.rbLeft.rbRed = false;
	                this.rbRotateRight(parent);
	                node = this.root;
	                break;
	                }
	            }
	        sibling.rbRed = true;
	        node = parent;
	        parent = parent.rbParent;
	    } while (!node.rbRed);
	    if (node) {node.rbRed = false;}
	    };

	Voronoi.prototype.RBTree.prototype.rbRotateLeft = function(node) {
	    var p = node,
	        q = node.rbRight, // can't be null
	        parent = p.rbParent;
	    if (parent) {
	        if (parent.rbLeft === p) {
	            parent.rbLeft = q;
	            }
	        else {
	            parent.rbRight = q;
	            }
	        }
	    else {
	        this.root = q;
	        }
	    q.rbParent = parent;
	    p.rbParent = q;
	    p.rbRight = q.rbLeft;
	    if (p.rbRight) {
	        p.rbRight.rbParent = p;
	        }
	    q.rbLeft = p;
	    };

	Voronoi.prototype.RBTree.prototype.rbRotateRight = function(node) {
	    var p = node,
	        q = node.rbLeft, // can't be null
	        parent = p.rbParent;
	    if (parent) {
	        if (parent.rbLeft === p) {
	            parent.rbLeft = q;
	            }
	        else {
	            parent.rbRight = q;
	            }
	        }
	    else {
	        this.root = q;
	        }
	    q.rbParent = parent;
	    p.rbParent = q;
	    p.rbLeft = q.rbRight;
	    if (p.rbLeft) {
	        p.rbLeft.rbParent = p;
	        }
	    q.rbRight = p;
	    };

	Voronoi.prototype.RBTree.prototype.getFirst = function(node) {
	    while (node.rbLeft) {
	        node = node.rbLeft;
	        }
	    return node;
	    };

	Voronoi.prototype.RBTree.prototype.getLast = function(node) {
	    while (node.rbRight) {
	        node = node.rbRight;
	        }
	    return node;
	    };

	// ---------------------------------------------------------------------------
	// Diagram methods

	Voronoi.prototype.Diagram = function(site) {
	    this.site = site;
	    };

	// ---------------------------------------------------------------------------
	// Cell methods

	Voronoi.prototype.Cell = function(site) {
	    this.site = site;
	    this.halfedges = [];
	    this.closeMe = false;
	    };

	Voronoi.prototype.Cell.prototype.init = function(site) {
	    this.site = site;
	    this.halfedges = [];
	    this.closeMe = false;
	    return this;
	    };

	Voronoi.prototype.createCell = function(site) {
	    var cell = this.cellJunkyard.pop();
	    if ( cell ) {
	        return cell.init(site);
	        }
	    return new this.Cell(site);
	    };

	Voronoi.prototype.Cell.prototype.prepareHalfedges = function() {
	    var halfedges = this.halfedges,
	        iHalfedge = halfedges.length,
	        edge;
	    // get rid of unused halfedges
	    // rhill 2011-05-27: Keep it simple, no point here in trying
	    // to be fancy: dangling edges are a typically a minority.
	    while (iHalfedge--) {
	        edge = halfedges[iHalfedge].edge;
	        if (!edge.vb || !edge.va) {
	            halfedges.splice(iHalfedge,1);
	            }
	        }

	    // rhill 2011-05-26: I tried to use a binary search at insertion
	    // time to keep the array sorted on-the-fly (in Cell.addHalfedge()).
	    // There was no real benefits in doing so, performance on
	    // Firefox 3.6 was improved marginally, while performance on
	    // Opera 11 was penalized marginally.
	    halfedges.sort(function(a,b){return b.angle-a.angle;});
	    return halfedges.length;
	    };

	// Return a list of the neighbor Ids
	Voronoi.prototype.Cell.prototype.getNeighborIds = function() {
	    var neighbors = [],
	        iHalfedge = this.halfedges.length,
	        edge;
	    while (iHalfedge--){
	        edge = this.halfedges[iHalfedge].edge;
	        if (edge.lSite !== null && edge.lSite.voronoiId != this.site.voronoiId) {
	            neighbors.push(edge.lSite.voronoiId);
	            }
	        else if (edge.rSite !== null && edge.rSite.voronoiId != this.site.voronoiId){
	            neighbors.push(edge.rSite.voronoiId);
	            }
	        }
	    return neighbors;
	    };

	// Compute bounding box
	//
	Voronoi.prototype.Cell.prototype.getBbox = function() {
	    var halfedges = this.halfedges,
	        iHalfedge = halfedges.length,
	        xmin = Infinity,
	        ymin = Infinity,
	        xmax = -Infinity,
	        ymax = -Infinity,
	        v, vx, vy;
	    while (iHalfedge--) {
	        v = halfedges[iHalfedge].getStartpoint();
	        vx = v.x;
	        vy = v.y;
	        if (vx < xmin) {xmin = vx;}
	        if (vy < ymin) {ymin = vy;}
	        if (vx > xmax) {xmax = vx;}
	        if (vy > ymax) {ymax = vy;}
	        // we dont need to take into account end point,
	        // since each end point matches a start point
	        }
	    return {
	        x: xmin,
	        y: ymin,
	        width: xmax-xmin,
	        height: ymax-ymin
	        };
	    };

	// Return whether a point is inside, on, or outside the cell:
	//   -1: point is outside the perimeter of the cell
	//    0: point is on the perimeter of the cell
	//    1: point is inside the perimeter of the cell
	//
	Voronoi.prototype.Cell.prototype.pointIntersection = function(x, y) {
	    // Check if point in polygon. Since all polygons of a Voronoi
	    // diagram are convex, then:
	    // http://paulbourke.net/geometry/polygonmesh/
	    // Solution 3 (2D):
	    //   "If the polygon is convex then one can consider the polygon
	    //   "as a 'path' from the first vertex. A point is on the interior
	    //   "of this polygons if it is always on the same side of all the
	    //   "line segments making up the path. ...
	    //   "(y - y0) (x1 - x0) - (x - x0) (y1 - y0)
	    //   "if it is less than 0 then P is to the right of the line segment,
	    //   "if greater than 0 it is to the left, if equal to 0 then it lies
	    //   "on the line segment"
	    var halfedges = this.halfedges,
	        iHalfedge = halfedges.length,
	        halfedge,
	        p0, p1, r;
	    while (iHalfedge--) {
	        halfedge = halfedges[iHalfedge];
	        p0 = halfedge.getStartpoint();
	        p1 = halfedge.getEndpoint();
	        r = (y-p0.y)*(p1.x-p0.x)-(x-p0.x)*(p1.y-p0.y);
	        if (!r) {
	            return 0;
	            }
	        if (r > 0) {
	            return -1;
	            }
	        }
	    return 1;
	    };

	// ---------------------------------------------------------------------------
	// Edge methods
	//

	Voronoi.prototype.Vertex = function(x, y) {
	    this.x = x;
	    this.y = y;
	    };

	Voronoi.prototype.Edge = function(lSite, rSite) {
	    this.lSite = lSite;
	    this.rSite = rSite;
	    this.va = this.vb = null;
	    };

	Voronoi.prototype.Halfedge = function(edge, lSite, rSite) {
	    this.site = lSite;
	    this.edge = edge;
	    // 'angle' is a value to be used for properly sorting the
	    // halfsegments counterclockwise. By convention, we will
	    // use the angle of the line defined by the 'site to the left'
	    // to the 'site to the right'.
	    // However, border edges have no 'site to the right': thus we
	    // use the angle of line perpendicular to the halfsegment (the
	    // edge should have both end points defined in such case.)
	    if (rSite) {
	        this.angle = Math.atan2(rSite.y-lSite.y, rSite.x-lSite.x);
	        }
	    else {
	        var va = edge.va,
	            vb = edge.vb;
	        // rhill 2011-05-31: used to call getStartpoint()/getEndpoint(),
	        // but for performance purpose, these are expanded in place here.
	        this.angle = edge.lSite === lSite ?
	            Math.atan2(vb.x-va.x, va.y-vb.y) :
	            Math.atan2(va.x-vb.x, vb.y-va.y);
	        }
	    };

	Voronoi.prototype.createHalfedge = function(edge, lSite, rSite) {
	    return new this.Halfedge(edge, lSite, rSite);
	    };

	Voronoi.prototype.Halfedge.prototype.getStartpoint = function() {
	    return this.edge.lSite === this.site ? this.edge.va : this.edge.vb;
	    };

	Voronoi.prototype.Halfedge.prototype.getEndpoint = function() {
	    return this.edge.lSite === this.site ? this.edge.vb : this.edge.va;
	    };



	// this create and add a vertex to the internal collection

	Voronoi.prototype.createVertex = function(x, y) {
	    var v = this.vertexJunkyard.pop();
	    if ( !v ) {
	        v = new this.Vertex(x, y);
	        }
	    else {
	        v.x = x;
	        v.y = y;
	        }
	    this.vertices.push(v);
	    return v;
	    };

	// this create and add an edge to internal collection, and also create
	// two halfedges which are added to each site's counterclockwise array
	// of halfedges.

	Voronoi.prototype.createEdge = function(lSite, rSite, va, vb) {
	    var edge = this.edgeJunkyard.pop();
	    if ( !edge ) {
	        edge = new this.Edge(lSite, rSite);
	        }
	    else {
	        edge.lSite = lSite;
	        edge.rSite = rSite;
	        edge.va = edge.vb = null;
	        }

	    this.edges.push(edge);
	    if (va) {
	        this.setEdgeStartpoint(edge, lSite, rSite, va);
	        }
	    if (vb) {
	        this.setEdgeEndpoint(edge, lSite, rSite, vb);
	        }
	    this.cells[lSite.voronoiId].halfedges.push(this.createHalfedge(edge, lSite, rSite));
	    this.cells[rSite.voronoiId].halfedges.push(this.createHalfedge(edge, rSite, lSite));
	    return edge;
	    };

	Voronoi.prototype.createBorderEdge = function(lSite, va, vb) {
	    var edge = this.edgeJunkyard.pop();
	    if ( !edge ) {
	        edge = new this.Edge(lSite, null);
	        }
	    else {
	        edge.lSite = lSite;
	        edge.rSite = null;
	        }
	    edge.va = va;
	    edge.vb = vb;
	    this.edges.push(edge);
	    return edge;
	    };

	Voronoi.prototype.setEdgeStartpoint = function(edge, lSite, rSite, vertex) {
	    if (!edge.va && !edge.vb) {
	        edge.va = vertex;
	        edge.lSite = lSite;
	        edge.rSite = rSite;
	        }
	    else if (edge.lSite === rSite) {
	        edge.vb = vertex;
	        }
	    else {
	        edge.va = vertex;
	        }
	    };

	Voronoi.prototype.setEdgeEndpoint = function(edge, lSite, rSite, vertex) {
	    this.setEdgeStartpoint(edge, rSite, lSite, vertex);
	    };

	// ---------------------------------------------------------------------------
	// Beachline methods

	// rhill 2011-06-07: For some reasons, performance suffers significantly
	// when instanciating a literal object instead of an empty ctor
	Voronoi.prototype.Beachsection = function() {
	    };

	// rhill 2011-06-02: A lot of Beachsection instanciations
	// occur during the computation of the Voronoi diagram,
	// somewhere between the number of sites and twice the
	// number of sites, while the number of Beachsections on the
	// beachline at any given time is comparatively low. For this
	// reason, we reuse already created Beachsections, in order
	// to avoid new memory allocation. This resulted in a measurable
	// performance gain.

	Voronoi.prototype.createBeachsection = function(site) {
	    var beachsection = this.beachsectionJunkyard.pop();
	    if (!beachsection) {
	        beachsection = new this.Beachsection();
	        }
	    beachsection.site = site;
	    return beachsection;
	    };

	// calculate the left break point of a particular beach section,
	// given a particular sweep line
	Voronoi.prototype.leftBreakPoint = function(arc, directrix) {
	    // http://en.wikipedia.org/wiki/Parabola
	    // http://en.wikipedia.org/wiki/Quadratic_equation
	    // h1 = x1,
	    // k1 = (y1+directrix)/2,
	    // h2 = x2,
	    // k2 = (y2+directrix)/2,
	    // p1 = k1-directrix,
	    // a1 = 1/(4*p1),
	    // b1 = -h1/(2*p1),
	    // c1 = h1*h1/(4*p1)+k1,
	    // p2 = k2-directrix,
	    // a2 = 1/(4*p2),
	    // b2 = -h2/(2*p2),
	    // c2 = h2*h2/(4*p2)+k2,
	    // x = (-(b2-b1) + Math.sqrt((b2-b1)*(b2-b1) - 4*(a2-a1)*(c2-c1))) / (2*(a2-a1))
	    // When x1 become the x-origin:
	    // h1 = 0,
	    // k1 = (y1+directrix)/2,
	    // h2 = x2-x1,
	    // k2 = (y2+directrix)/2,
	    // p1 = k1-directrix,
	    // a1 = 1/(4*p1),
	    // b1 = 0,
	    // c1 = k1,
	    // p2 = k2-directrix,
	    // a2 = 1/(4*p2),
	    // b2 = -h2/(2*p2),
	    // c2 = h2*h2/(4*p2)+k2,
	    // x = (-b2 + Math.sqrt(b2*b2 - 4*(a2-a1)*(c2-k1))) / (2*(a2-a1)) + x1

	    // change code below at your own risk: care has been taken to
	    // reduce errors due to computers' finite arithmetic precision.
	    // Maybe can still be improved, will see if any more of this
	    // kind of errors pop up again.
	    var site = arc.site,
	        rfocx = site.x,
	        rfocy = site.y,
	        pby2 = rfocy-directrix;
	    // parabola in degenerate case where focus is on directrix
	    if (!pby2) {
	        return rfocx;
	        }
	    var lArc = arc.rbPrevious;
	    if (!lArc) {
	        return -Infinity;
	        }
	    site = lArc.site;
	    var lfocx = site.x,
	        lfocy = site.y,
	        plby2 = lfocy-directrix;
	    // parabola in degenerate case where focus is on directrix
	    if (!plby2) {
	        return lfocx;
	        }
	    var hl = lfocx-rfocx,
	        aby2 = 1/pby2-1/plby2,
	        b = hl/plby2;
	    if (aby2) {
	        return (-b+this.sqrt(b*b-2*aby2*(hl*hl/(-2*plby2)-lfocy+plby2/2+rfocy-pby2/2)))/aby2+rfocx;
	        }
	    // both parabolas have same distance to directrix, thus break point is midway
	    return (rfocx+lfocx)/2;
	    };

	// calculate the right break point of a particular beach section,
	// given a particular directrix
	Voronoi.prototype.rightBreakPoint = function(arc, directrix) {
	    var rArc = arc.rbNext;
	    if (rArc) {
	        return this.leftBreakPoint(rArc, directrix);
	        }
	    var site = arc.site;
	    return site.y === directrix ? site.x : Infinity;
	    };

	Voronoi.prototype.detachBeachsection = function(beachsection) {
	    this.detachCircleEvent(beachsection); // detach potentially attached circle event
	    this.beachline.rbRemoveNode(beachsection); // remove from RB-tree
	    this.beachsectionJunkyard.push(beachsection); // mark for reuse
	    };

	Voronoi.prototype.removeBeachsection = function(beachsection) {
	    var circle = beachsection.circleEvent,
	        x = circle.x,
	        y = circle.ycenter,
	        vertex = this.createVertex(x, y),
	        previous = beachsection.rbPrevious,
	        next = beachsection.rbNext,
	        disappearingTransitions = [beachsection],
	        abs_fn = Math.abs;

	    // remove collapsed beachsection from beachline
	    this.detachBeachsection(beachsection);

	    // there could be more than one empty arc at the deletion point, this
	    // happens when more than two edges are linked by the same vertex,
	    // so we will collect all those edges by looking up both sides of
	    // the deletion point.
	    // by the way, there is *always* a predecessor/successor to any collapsed
	    // beach section, it's just impossible to have a collapsing first/last
	    // beach sections on the beachline, since they obviously are unconstrained
	    // on their left/right side.

	    // look left
	    var lArc = previous;
	    while (lArc.circleEvent && abs_fn(x-lArc.circleEvent.x)<1e-9 && abs_fn(y-lArc.circleEvent.ycenter)<1e-9) {
	        previous = lArc.rbPrevious;
	        disappearingTransitions.unshift(lArc);
	        this.detachBeachsection(lArc); // mark for reuse
	        lArc = previous;
	        }
	    // even though it is not disappearing, I will also add the beach section
	    // immediately to the left of the left-most collapsed beach section, for
	    // convenience, since we need to refer to it later as this beach section
	    // is the 'left' site of an edge for which a start point is set.
	    disappearingTransitions.unshift(lArc);
	    this.detachCircleEvent(lArc);

	    // look right
	    var rArc = next;
	    while (rArc.circleEvent && abs_fn(x-rArc.circleEvent.x)<1e-9 && abs_fn(y-rArc.circleEvent.ycenter)<1e-9) {
	        next = rArc.rbNext;
	        disappearingTransitions.push(rArc);
	        this.detachBeachsection(rArc); // mark for reuse
	        rArc = next;
	        }
	    // we also have to add the beach section immediately to the right of the
	    // right-most collapsed beach section, since there is also a disappearing
	    // transition representing an edge's start point on its left.
	    disappearingTransitions.push(rArc);
	    this.detachCircleEvent(rArc);

	    // walk through all the disappearing transitions between beach sections and
	    // set the start point of their (implied) edge.
	    var nArcs = disappearingTransitions.length,
	        iArc;
	    for (iArc=1; iArc<nArcs; iArc++) {
	        rArc = disappearingTransitions[iArc];
	        lArc = disappearingTransitions[iArc-1];
	        this.setEdgeStartpoint(rArc.edge, lArc.site, rArc.site, vertex);
	        }

	    // create a new edge as we have now a new transition between
	    // two beach sections which were previously not adjacent.
	    // since this edge appears as a new vertex is defined, the vertex
	    // actually define an end point of the edge (relative to the site
	    // on the left)
	    lArc = disappearingTransitions[0];
	    rArc = disappearingTransitions[nArcs-1];
	    rArc.edge = this.createEdge(lArc.site, rArc.site, undefined, vertex);

	    // create circle events if any for beach sections left in the beachline
	    // adjacent to collapsed sections
	    this.attachCircleEvent(lArc);
	    this.attachCircleEvent(rArc);
	    };

	Voronoi.prototype.addBeachsection = function(site) {
	    var x = site.x,
	        directrix = site.y;

	    // find the left and right beach sections which will surround the newly
	    // created beach section.
	    // rhill 2011-06-01: This loop is one of the most often executed,
	    // hence we expand in-place the comparison-against-epsilon calls.
	    var lArc, rArc,
	        dxl, dxr,
	        node = this.beachline.root;

	    while (node) {
	        dxl = this.leftBreakPoint(node,directrix)-x;
	        // x lessThanWithEpsilon xl => falls somewhere before the left edge of the beachsection
	        if (dxl > 1e-9) {
	            // this case should never happen
	            // if (!node.rbLeft) {
	            //    rArc = node.rbLeft;
	            //    break;
	            //    }
	            node = node.rbLeft;
	            }
	        else {
	            dxr = x-this.rightBreakPoint(node,directrix);
	            // x greaterThanWithEpsilon xr => falls somewhere after the right edge of the beachsection
	            if (dxr > 1e-9) {
	                if (!node.rbRight) {
	                    lArc = node;
	                    break;
	                    }
	                node = node.rbRight;
	                }
	            else {
	                // x equalWithEpsilon xl => falls exactly on the left edge of the beachsection
	                if (dxl > -1e-9) {
	                    lArc = node.rbPrevious;
	                    rArc = node;
	                    }
	                // x equalWithEpsilon xr => falls exactly on the right edge of the beachsection
	                else if (dxr > -1e-9) {
	                    lArc = node;
	                    rArc = node.rbNext;
	                    }
	                // falls exactly somewhere in the middle of the beachsection
	                else {
	                    lArc = rArc = node;
	                    }
	                break;
	                }
	            }
	        }
	    // at this point, keep in mind that lArc and/or rArc could be
	    // undefined or null.

	    // create a new beach section object for the site and add it to RB-tree
	    var newArc = this.createBeachsection(site);
	    this.beachline.rbInsertSuccessor(lArc, newArc);

	    // cases:
	    //

	    // [null,null]
	    // least likely case: new beach section is the first beach section on the
	    // beachline.
	    // This case means:
	    //   no new transition appears
	    //   no collapsing beach section
	    //   new beachsection become root of the RB-tree
	    if (!lArc && !rArc) {
	        return;
	        }

	    // [lArc,rArc] where lArc == rArc
	    // most likely case: new beach section split an existing beach
	    // section.
	    // This case means:
	    //   one new transition appears
	    //   the left and right beach section might be collapsing as a result
	    //   two new nodes added to the RB-tree
	    if (lArc === rArc) {
	        // invalidate circle event of split beach section
	        this.detachCircleEvent(lArc);

	        // split the beach section into two separate beach sections
	        rArc = this.createBeachsection(lArc.site);
	        this.beachline.rbInsertSuccessor(newArc, rArc);

	        // since we have a new transition between two beach sections,
	        // a new edge is born
	        newArc.edge = rArc.edge = this.createEdge(lArc.site, newArc.site);

	        // check whether the left and right beach sections are collapsing
	        // and if so create circle events, to be notified when the point of
	        // collapse is reached.
	        this.attachCircleEvent(lArc);
	        this.attachCircleEvent(rArc);
	        return;
	        }

	    // [lArc,null]
	    // even less likely case: new beach section is the *last* beach section
	    // on the beachline -- this can happen *only* if *all* the previous beach
	    // sections currently on the beachline share the same y value as
	    // the new beach section.
	    // This case means:
	    //   one new transition appears
	    //   no collapsing beach section as a result
	    //   new beach section become right-most node of the RB-tree
	    if (lArc && !rArc) {
	        newArc.edge = this.createEdge(lArc.site,newArc.site);
	        return;
	        }

	    // [null,rArc]
	    // impossible case: because sites are strictly processed from top to bottom,
	    // and left to right, which guarantees that there will always be a beach section
	    // on the left -- except of course when there are no beach section at all on
	    // the beach line, which case was handled above.
	    // rhill 2011-06-02: No point testing in non-debug version
	    //if (!lArc && rArc) {
	    //    throw "Voronoi.addBeachsection(): What is this I don't even";
	    //    }

	    // [lArc,rArc] where lArc != rArc
	    // somewhat less likely case: new beach section falls *exactly* in between two
	    // existing beach sections
	    // This case means:
	    //   one transition disappears
	    //   two new transitions appear
	    //   the left and right beach section might be collapsing as a result
	    //   only one new node added to the RB-tree
	    if (lArc !== rArc) {
	        // invalidate circle events of left and right sites
	        this.detachCircleEvent(lArc);
	        this.detachCircleEvent(rArc);

	        // an existing transition disappears, meaning a vertex is defined at
	        // the disappearance point.
	        // since the disappearance is caused by the new beachsection, the
	        // vertex is at the center of the circumscribed circle of the left,
	        // new and right beachsections.
	        // http://mathforum.org/library/drmath/view/55002.html
	        // Except that I bring the origin at A to simplify
	        // calculation
	        var lSite = lArc.site,
	            ax = lSite.x,
	            ay = lSite.y,
	            bx=site.x-ax,
	            by=site.y-ay,
	            rSite = rArc.site,
	            cx=rSite.x-ax,
	            cy=rSite.y-ay,
	            d=2*(bx*cy-by*cx),
	            hb=bx*bx+by*by,
	            hc=cx*cx+cy*cy,
	            vertex = this.createVertex((cy*hb-by*hc)/d+ax, (bx*hc-cx*hb)/d+ay);

	        // one transition disappear
	        this.setEdgeStartpoint(rArc.edge, lSite, rSite, vertex);

	        // two new transitions appear at the new vertex location
	        newArc.edge = this.createEdge(lSite, site, undefined, vertex);
	        rArc.edge = this.createEdge(site, rSite, undefined, vertex);

	        // check whether the left and right beach sections are collapsing
	        // and if so create circle events, to handle the point of collapse.
	        this.attachCircleEvent(lArc);
	        this.attachCircleEvent(rArc);
	        return;
	        }
	    };

	// ---------------------------------------------------------------------------
	// Circle event methods

	// rhill 2011-06-07: For some reasons, performance suffers significantly
	// when instanciating a literal object instead of an empty ctor
	Voronoi.prototype.CircleEvent = function() {
	    // rhill 2013-10-12: it helps to state exactly what we are at ctor time.
	    this.arc = null;
	    this.rbLeft = null;
	    this.rbNext = null;
	    this.rbParent = null;
	    this.rbPrevious = null;
	    this.rbRed = false;
	    this.rbRight = null;
	    this.site = null;
	    this.x = this.y = this.ycenter = 0;
	    };

	Voronoi.prototype.attachCircleEvent = function(arc) {
	    var lArc = arc.rbPrevious,
	        rArc = arc.rbNext;
	    if (!lArc || !rArc) {return;} // does that ever happen?
	    var lSite = lArc.site,
	        cSite = arc.site,
	        rSite = rArc.site;

	    // If site of left beachsection is same as site of
	    // right beachsection, there can't be convergence
	    if (lSite===rSite) {return;}

	    // Find the circumscribed circle for the three sites associated
	    // with the beachsection triplet.
	    // rhill 2011-05-26: It is more efficient to calculate in-place
	    // rather than getting the resulting circumscribed circle from an
	    // object returned by calling Voronoi.circumcircle()
	    // http://mathforum.org/library/drmath/view/55002.html
	    // Except that I bring the origin at cSite to simplify calculations.
	    // The bottom-most part of the circumcircle is our Fortune 'circle
	    // event', and its center is a vertex potentially part of the final
	    // Voronoi diagram.
	    var bx = cSite.x,
	        by = cSite.y,
	        ax = lSite.x-bx,
	        ay = lSite.y-by,
	        cx = rSite.x-bx,
	        cy = rSite.y-by;

	    // If points l->c->r are clockwise, then center beach section does not
	    // collapse, hence it can't end up as a vertex (we reuse 'd' here, which
	    // sign is reverse of the orientation, hence we reverse the test.
	    // http://en.wikipedia.org/wiki/Curve_orientation#Orientation_of_a_simple_polygon
	    // rhill 2011-05-21: Nasty finite precision error which caused circumcircle() to
	    // return infinites: 1e-12 seems to fix the problem.
	    var d = 2*(ax*cy-ay*cx);
	    if (d >= -2e-12){return;}

	    var ha = ax*ax+ay*ay,
	        hc = cx*cx+cy*cy,
	        x = (cy*ha-ay*hc)/d,
	        y = (ax*hc-cx*ha)/d,
	        ycenter = y+by;

	    // Important: ybottom should always be under or at sweep, so no need
	    // to waste CPU cycles by checking

	    // recycle circle event object if possible
	    var circleEvent = this.circleEventJunkyard.pop();
	    if (!circleEvent) {
	        circleEvent = new this.CircleEvent();
	        }
	    circleEvent.arc = arc;
	    circleEvent.site = cSite;
	    circleEvent.x = x+bx;
	    circleEvent.y = ycenter+this.sqrt(x*x+y*y); // y bottom
	    circleEvent.ycenter = ycenter;
	    arc.circleEvent = circleEvent;

	    // find insertion point in RB-tree: circle events are ordered from
	    // smallest to largest
	    var predecessor = null,
	        node = this.circleEvents.root;
	    while (node) {
	        if (circleEvent.y < node.y || (circleEvent.y === node.y && circleEvent.x <= node.x)) {
	            if (node.rbLeft) {
	                node = node.rbLeft;
	                }
	            else {
	                predecessor = node.rbPrevious;
	                break;
	                }
	            }
	        else {
	            if (node.rbRight) {
	                node = node.rbRight;
	                }
	            else {
	                predecessor = node;
	                break;
	                }
	            }
	        }
	    this.circleEvents.rbInsertSuccessor(predecessor, circleEvent);
	    if (!predecessor) {
	        this.firstCircleEvent = circleEvent;
	        }
	    };

	Voronoi.prototype.detachCircleEvent = function(arc) {
	    var circleEvent = arc.circleEvent;
	    if (circleEvent) {
	        if (!circleEvent.rbPrevious) {
	            this.firstCircleEvent = circleEvent.rbNext;
	            }
	        this.circleEvents.rbRemoveNode(circleEvent); // remove from RB-tree
	        this.circleEventJunkyard.push(circleEvent);
	        arc.circleEvent = null;
	        }
	    };

	// ---------------------------------------------------------------------------
	// Diagram completion methods

	// connect dangling edges (not if a cursory test tells us
	// it is not going to be visible.
	// return value:
	//   false: the dangling endpoint couldn't be connected
	//   true: the dangling endpoint could be connected
	Voronoi.prototype.connectEdge = function(edge, bbox) {
	    // skip if end point already connected
	    var vb = edge.vb;
	    if (!!vb) {return true;}

	    // make local copy for performance purpose
	    var va = edge.va,
	        xl = bbox.xl,
	        xr = bbox.xr,
	        yt = bbox.yt,
	        yb = bbox.yb,
	        lSite = edge.lSite,
	        rSite = edge.rSite,
	        lx = lSite.x,
	        ly = lSite.y,
	        rx = rSite.x,
	        ry = rSite.y,
	        fx = (lx+rx)/2,
	        fy = (ly+ry)/2,
	        fm, fb;

	    // if we reach here, this means cells which use this edge will need
	    // to be closed, whether because the edge was removed, or because it
	    // was connected to the bounding box.
	    this.cells[lSite.voronoiId].closeMe = true;
	    this.cells[rSite.voronoiId].closeMe = true;

	    // get the line equation of the bisector if line is not vertical
	    if (ry !== ly) {
	        fm = (lx-rx)/(ry-ly);
	        fb = fy-fm*fx;
	        }

	    // remember, direction of line (relative to left site):
	    // upward: left.x < right.x
	    // downward: left.x > right.x
	    // horizontal: left.x == right.x
	    // upward: left.x < right.x
	    // rightward: left.y < right.y
	    // leftward: left.y > right.y
	    // vertical: left.y == right.y

	    // depending on the direction, find the best side of the
	    // bounding box to use to determine a reasonable start point

	    // rhill 2013-12-02:
	    // While at it, since we have the values which define the line,
	    // clip the end of va if it is outside the bbox.
	    // https://github.com/gorhill/Javascript-Voronoi/issues/15
	    // TODO: Do all the clipping here rather than rely on Liang-Barsky
	    // which does not do well sometimes due to loss of arithmetic
	    // precision. The code here doesn't degrade if one of the vertex is
	    // at a huge distance.

	    // special case: vertical line
	    if (fm === undefined) {
	        // doesn't intersect with viewport
	        if (fx < xl || fx >= xr) {return false;}
	        // downward
	        if (lx > rx) {
	            if (!va || va.y < yt) {
	                va = this.createVertex(fx, yt);
	                }
	            else if (va.y >= yb) {
	                return false;
	                }
	            vb = this.createVertex(fx, yb);
	            }
	        // upward
	        else {
	            if (!va || va.y > yb) {
	                va = this.createVertex(fx, yb);
	                }
	            else if (va.y < yt) {
	                return false;
	                }
	            vb = this.createVertex(fx, yt);
	            }
	        }
	    // closer to vertical than horizontal, connect start point to the
	    // top or bottom side of the bounding box
	    else if (fm < -1 || fm > 1) {
	        // downward
	        if (lx > rx) {
	            if (!va || va.y < yt) {
	                va = this.createVertex((yt-fb)/fm, yt);
	                }
	            else if (va.y >= yb) {
	                return false;
	                }
	            vb = this.createVertex((yb-fb)/fm, yb);
	            }
	        // upward
	        else {
	            if (!va || va.y > yb) {
	                va = this.createVertex((yb-fb)/fm, yb);
	                }
	            else if (va.y < yt) {
	                return false;
	                }
	            vb = this.createVertex((yt-fb)/fm, yt);
	            }
	        }
	    // closer to horizontal than vertical, connect start point to the
	    // left or right side of the bounding box
	    else {
	        // rightward
	        if (ly < ry) {
	            if (!va || va.x < xl) {
	                va = this.createVertex(xl, fm*xl+fb);
	                }
	            else if (va.x >= xr) {
	                return false;
	                }
	            vb = this.createVertex(xr, fm*xr+fb);
	            }
	        // leftward
	        else {
	            if (!va || va.x > xr) {
	                va = this.createVertex(xr, fm*xr+fb);
	                }
	            else if (va.x < xl) {
	                return false;
	                }
	            vb = this.createVertex(xl, fm*xl+fb);
	            }
	        }
	    edge.va = va;
	    edge.vb = vb;

	    return true;
	    };

	// line-clipping code taken from:
	//   Liang-Barsky function by Daniel White
	//   http://www.skytopia.com/project/articles/compsci/clipping.html
	// Thanks!
	// A bit modified to minimize code paths
	Voronoi.prototype.clipEdge = function(edge, bbox) {
	    var ax = edge.va.x,
	        ay = edge.va.y,
	        bx = edge.vb.x,
	        by = edge.vb.y,
	        t0 = 0,
	        t1 = 1,
	        dx = bx-ax,
	        dy = by-ay;
	    // left
	    var q = ax-bbox.xl;
	    if (dx===0 && q<0) {return false;}
	    var r = -q/dx;
	    if (dx<0) {
	        if (r<t0) {return false;}
	        if (r<t1) {t1=r;}
	        }
	    else if (dx>0) {
	        if (r>t1) {return false;}
	        if (r>t0) {t0=r;}
	        }
	    // right
	    q = bbox.xr-ax;
	    if (dx===0 && q<0) {return false;}
	    r = q/dx;
	    if (dx<0) {
	        if (r>t1) {return false;}
	        if (r>t0) {t0=r;}
	        }
	    else if (dx>0) {
	        if (r<t0) {return false;}
	        if (r<t1) {t1=r;}
	        }
	    // top
	    q = ay-bbox.yt;
	    if (dy===0 && q<0) {return false;}
	    r = -q/dy;
	    if (dy<0) {
	        if (r<t0) {return false;}
	        if (r<t1) {t1=r;}
	        }
	    else if (dy>0) {
	        if (r>t1) {return false;}
	        if (r>t0) {t0=r;}
	        }
	    // bottom        
	    q = bbox.yb-ay;
	    if (dy===0 && q<0) {return false;}
	    r = q/dy;
	    if (dy<0) {
	        if (r>t1) {return false;}
	        if (r>t0) {t0=r;}
	        }
	    else if (dy>0) {
	        if (r<t0) {return false;}
	        if (r<t1) {t1=r;}
	        }

	    // if we reach this point, Voronoi edge is within bbox

	    // if t0 > 0, va needs to change
	    // rhill 2011-06-03: we need to create a new vertex rather
	    // than modifying the existing one, since the existing
	    // one is likely shared with at least another edge
	    if (t0 > 0) {
	        edge.va = this.createVertex(ax+t0*dx, ay+t0*dy);
	        }

	    // if t1 < 1, vb needs to change
	    // rhill 2011-06-03: we need to create a new vertex rather
	    // than modifying the existing one, since the existing
	    // one is likely shared with at least another edge
	    if (t1 < 1) {
	        edge.vb = this.createVertex(ax+t1*dx, ay+t1*dy);
	        }

	    // va and/or vb were clipped, thus we will need to close
	    // cells which use this edge.
	    if ( t0 > 0 || t1 < 1 ) {
	        this.cells[edge.lSite.voronoiId].closeMe = true;
	        this.cells[edge.rSite.voronoiId].closeMe = true;
	    }

	    return true;
	    };

	// Connect/cut edges at bounding box
	Voronoi.prototype.clipEdges = function(bbox) {
	    // connect all dangling edges to bounding box
	    // or get rid of them if it can't be done
	    var edges = this.edges,
	        iEdge = edges.length,
	        edge,
	        abs_fn = Math.abs;

	    // iterate backward so we can splice safely
	    while (iEdge--) {
	        edge = edges[iEdge];
	        // edge is removed if:
	        //   it is wholly outside the bounding box
	        //   it is looking more like a point than a line
	        if (!this.connectEdge(edge, bbox) ||
	            !this.clipEdge(edge, bbox) ||
	            (abs_fn(edge.va.x-edge.vb.x)<1e-9 && abs_fn(edge.va.y-edge.vb.y)<1e-9)) {
	            edge.va = edge.vb = null;
	            edges.splice(iEdge,1);
	            }
	        }
	    };

	// Close the cells.
	// The cells are bound by the supplied bounding box.
	// Each cell refers to its associated site, and a list
	// of halfedges ordered counterclockwise.
	Voronoi.prototype.closeCells = function(bbox) {
	    var xl = bbox.xl,
	        xr = bbox.xr,
	        yt = bbox.yt,
	        yb = bbox.yb,
	        cells = this.cells,
	        iCell = cells.length,
	        cell,
	        iLeft,
	        halfedges, nHalfedges,
	        edge,
	        va, vb, vz,
	        lastBorderSegment,
	        abs_fn = Math.abs;

	    while (iCell--) {
	        cell = cells[iCell];
	        // prune, order halfedges counterclockwise, then add missing ones
	        // required to close cells
	        if (!cell.prepareHalfedges()) {
	            continue;
	            }
	        if (!cell.closeMe) {
	            continue;
	            }
	        // find first 'unclosed' point.
	        // an 'unclosed' point will be the end point of a halfedge which
	        // does not match the start point of the following halfedge
	        halfedges = cell.halfedges;
	        nHalfedges = halfedges.length;
	        // special case: only one site, in which case, the viewport is the cell
	        // ...

	        // all other cases
	        iLeft = 0;
	        while (iLeft < nHalfedges) {
	            va = halfedges[iLeft].getEndpoint();
	            vz = halfedges[(iLeft+1) % nHalfedges].getStartpoint();
	            // if end point is not equal to start point, we need to add the missing
	            // halfedge(s) up to vz
	            if (abs_fn(va.x-vz.x)>=1e-9 || abs_fn(va.y-vz.y)>=1e-9) {

	                // rhill 2013-12-02:
	                // "Holes" in the halfedges are not necessarily always adjacent.
	                // https://github.com/gorhill/Javascript-Voronoi/issues/16

	                // find entry point:
	                switch (true) {

	                    // walk downward along left side
	                    case this.equalWithEpsilon(va.x,xl) && this.lessThanWithEpsilon(va.y,yb):
	                        lastBorderSegment = this.equalWithEpsilon(vz.x,xl);
	                        vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);
	                        edge = this.createBorderEdge(cell.site, va, vb);
	                        iLeft++;
	                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
	                        nHalfedges++;
	                        if ( lastBorderSegment ) { break; }
	                        va = vb;
	                        // fall through

	                    // walk rightward along bottom side
	                    case this.equalWithEpsilon(va.y,yb) && this.lessThanWithEpsilon(va.x,xr):
	                        lastBorderSegment = this.equalWithEpsilon(vz.y,yb);
	                        vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);
	                        edge = this.createBorderEdge(cell.site, va, vb);
	                        iLeft++;
	                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
	                        nHalfedges++;
	                        if ( lastBorderSegment ) { break; }
	                        va = vb;
	                        // fall through

	                    // walk upward along right side
	                    case this.equalWithEpsilon(va.x,xr) && this.greaterThanWithEpsilon(va.y,yt):
	                        lastBorderSegment = this.equalWithEpsilon(vz.x,xr);
	                        vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);
	                        edge = this.createBorderEdge(cell.site, va, vb);
	                        iLeft++;
	                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
	                        nHalfedges++;
	                        if ( lastBorderSegment ) { break; }
	                        va = vb;
	                        // fall through

	                    // walk leftward along top side
	                    case this.equalWithEpsilon(va.y,yt) && this.greaterThanWithEpsilon(va.x,xl):
	                        lastBorderSegment = this.equalWithEpsilon(vz.y,yt);
	                        vb = this.createVertex(lastBorderSegment ? vz.x : xl, yt);
	                        edge = this.createBorderEdge(cell.site, va, vb);
	                        iLeft++;
	                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
	                        nHalfedges++;
	                        if ( lastBorderSegment ) { break; }
	                        va = vb;
	                        // fall through

	                        // walk downward along left side
	                        lastBorderSegment = this.equalWithEpsilon(vz.x,xl);
	                        vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);
	                        edge = this.createBorderEdge(cell.site, va, vb);
	                        iLeft++;
	                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
	                        nHalfedges++;
	                        if ( lastBorderSegment ) { break; }
	                        va = vb;
	                        // fall through

	                        // walk rightward along bottom side
	                        lastBorderSegment = this.equalWithEpsilon(vz.y,yb);
	                        vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);
	                        edge = this.createBorderEdge(cell.site, va, vb);
	                        iLeft++;
	                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
	                        nHalfedges++;
	                        if ( lastBorderSegment ) { break; }
	                        va = vb;
	                        // fall through

	                        // walk upward along right side
	                        lastBorderSegment = this.equalWithEpsilon(vz.x,xr);
	                        vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);
	                        edge = this.createBorderEdge(cell.site, va, vb);
	                        iLeft++;
	                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
	                        nHalfedges++;
	                        if ( lastBorderSegment ) { break; }
	                        // fall through

	                    default:
	                        throw "Voronoi.closeCells() > this makes no sense!";
	                    }
	                }
	            iLeft++;
	            }
	        cell.closeMe = false;
	        }
	    };

	// ---------------------------------------------------------------------------
	// Debugging helper
	/*
	Voronoi.prototype.dumpBeachline = function(y) {
	    console.log('Voronoi.dumpBeachline(%f) > Beachsections, from left to right:', y);
	    if ( !this.beachline ) {
	        console.log('  None');
	        }
	    else {
	        var bs = this.beachline.getFirst(this.beachline.root);
	        while ( bs ) {
	            console.log('  site %d: xl: %f, xr: %f', bs.site.voronoiId, this.leftBreakPoint(bs, y), this.rightBreakPoint(bs, y));
	            bs = bs.rbNext;
	            }
	        }
	    };
	*/

	// ---------------------------------------------------------------------------
	// Helper: Quantize sites

	// rhill 2013-10-12:
	// This is to solve https://github.com/gorhill/Javascript-Voronoi/issues/15
	// Since not all users will end up using the kind of coord values which would
	// cause the issue to arise, I chose to let the user decide whether or not
	// he should sanitize his coord values through this helper. This way, for
	// those users who uses coord values which are known to be fine, no overhead is
	// added.

	Voronoi.prototype.quantizeSites = function(sites) {
	    var ε = this.ε,
	        n = sites.length,
	        site;
	    while ( n-- ) {
	        site = sites[n];
	        site.x = Math.floor(site.x / ε) * ε;
	        site.y = Math.floor(site.y / ε) * ε;
	        }
	    };

	// ---------------------------------------------------------------------------
	// Helper: Recycle diagram: all vertex, edge and cell objects are
	// "surrendered" to the Voronoi object for reuse.
	// TODO: rhill-voronoi-core v2: more performance to be gained
	// when I change the semantic of what is returned.

	Voronoi.prototype.recycle = function(diagram) {
	    if ( diagram ) {
	        if ( diagram instanceof this.Diagram ) {
	            this.toRecycle = diagram;
	            }
	        else {
	            throw 'Voronoi.recycleDiagram() > Need a Diagram object.';
	            }
	        }
	    };

	// ---------------------------------------------------------------------------
	// Top-level Fortune loop

	// rhill 2011-05-19:
	//   Voronoi sites are kept client-side now, to allow
	//   user to freely modify content. At compute time,
	//   *references* to sites are copied locally.

	Voronoi.prototype.compute = function(sites, bbox) {
	    // to measure execution time
	    var startTime = new Date();

	    // init internal state
	    this.reset();

	    // any diagram data available for recycling?
	    // I do that here so that this is included in execution time
	    if ( this.toRecycle ) {
	        this.vertexJunkyard = this.vertexJunkyard.concat(this.toRecycle.vertices);
	        this.edgeJunkyard = this.edgeJunkyard.concat(this.toRecycle.edges);
	        this.cellJunkyard = this.cellJunkyard.concat(this.toRecycle.cells);
	        this.toRecycle = null;
	        }

	    // Initialize site event queue
	    var siteEvents = sites.slice(0);
	    siteEvents.sort(function(a,b){
	        var r = b.y - a.y;
	        if (r) {return r;}
	        return b.x - a.x;
	        });

	    // process queue
	    var site = siteEvents.pop(),
	        siteid = 0,
	        xsitex, // to avoid duplicate sites
	        xsitey,
	        cells = this.cells,
	        circle;

	    // main loop
	    for (;;) {
	        // we need to figure whether we handle a site or circle event
	        // for this we find out if there is a site event and it is
	        // 'earlier' than the circle event
	        circle = this.firstCircleEvent;

	        // add beach section
	        if (site && (!circle || site.y < circle.y || (site.y === circle.y && site.x < circle.x))) {
	            // only if site is not a duplicate
	            if (site.x !== xsitex || site.y !== xsitey) {
	                // first create cell for new site
	                cells[siteid] = this.createCell(site);
	                site.voronoiId = siteid++;
	                // then create a beachsection for that site
	                this.addBeachsection(site);
	                // remember last site coords to detect duplicate
	                xsitey = site.y;
	                xsitex = site.x;
	                }
	            site = siteEvents.pop();
	            }

	        // remove beach section
	        else if (circle) {
	            this.removeBeachsection(circle.arc);
	            }

	        // all done, quit
	        else {
	            break;
	            }
	        }

	    // wrapping-up:
	    //   connect dangling edges to bounding box
	    //   cut edges as per bounding box
	    //   discard edges completely outside bounding box
	    //   discard edges which are point-like
	    this.clipEdges(bbox);

	    //   add missing edges in order to close opened cells
	    this.closeCells(bbox);

	    // to measure execution time
	    var stopTime = new Date();

	    // prepare return values
	    var diagram = new this.Diagram();
	    diagram.cells = this.cells;
	    diagram.edges = this.edges;
	    diagram.vertices = this.vertices;
	    diagram.execTime = stopTime.getTime()-startTime.getTime();

	    // clean up
	    this.reset();

	    return diagram;
	    };

	if(true) module.exports = Voronoi;


/***/ }
/******/ ]);