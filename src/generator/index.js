import FastSimplexNoise from 'fast-simplex-noise';

import * as Maths from '../maths';
import { isWater, filterWater, filterOcean, coastElevation, tagOcean, removeCoastalLakes } from './water';
import { assignRivers } from './rivers';
import * as Debug from './debug';
import * as Grid from './grid';

function cylindrical(noise, circumference) {
  return function cylindrical2D(x, y) {
    return noise.cylindrical2D(circumference, x, y);
  }
}

function spherical(noise, circumference) {
  return function spherical2D(x, y) {
    return noise.spherical2D(circumference, x, y);
  }
}

export default function generate(options = {}) {
  const start = performance.now();

  const {
    noise: noiseConfig = {},
    width,
    height,
    max = 1,
    min = 0,
    coasts = {},
    shape,
    voronoi,
    rivers,
    volcanos
  } = options;

  const world = {
    map: {}
  };

  const distance = (!voronoi && shape === 'hexagon') ?
    Maths.distanceHexagon2D : Maths.distanceSquare2D;

  const noise = new FastSimplexNoise(Object.assign({
    min,
    max,
    // amplitude: 0.2,
    octaves: 6,
    frequency: 0.03,
    persistence: 0.2,
  }, noiseConfig));

  const noiser =
    (noise.shape === 'cylindrical' && noise.cylindrical2D.bind(noise, noiseConfig.circumference))
    || (noise.shape === 'spherical' && noise.spherical2D.bind(noise, noiseConfig.circumference))
    || noise.in2D.bind(noise);

  const grid =
    (voronoi && Grid.voronoi(Object.assign({}, voronoi, { width, height })))
    || Grid.hexagon({ width, height });

  console.log('Grid valid?', Grid.validate(grid));
  world.grid = grid;

  // Assign elevations between -min and +max for the noise
  grid.cells.forEach(cell => {
    cell.elevation = noiser(cell.x, cell.y);
    // We will tag as water all tiles with negative elevation
    cell.water = cell.elevation < 0;
  });

  const hasCoast = coasts.left || coasts.top || coasts.bottom || coasts.right;

  // Ocean
  if (hasCoast) {
    const coastElv = coastElevation({ width, height, coasts, distance, grid });

    grid.cells.forEach(cell => {
      cell.elevation -= coastElv(cell.x, cell.y);
      // We will tag as water all tiles with negative elevation
      cell.water = cell.elevation < 0;
    })

    tagOcean(grid.cells, width, height, coasts, distance);
    removeCoastalLakes(grid.cells, coastElv);
  }

  // We will calculate the elevation of an edge as the average of both the cells around it
  grid.edges.forEach(edge => {
    edge.elevation = ((edge.c1 ? edge.c1.elevation : 0) + (edge.c2 ? edge.c2.elevation : 0)) / ((edge.c1 ? 1 : 0) + (edge.c2 ? 1 : 0));
  });

  // Rivers
  if (rivers) {
    assignRivers(world, rivers);
  }

  // Debug.repartition(tiles);
  console.debug("Duration world generation:", Math.round(performance.now() - start), 'ms');
  return world;
}
