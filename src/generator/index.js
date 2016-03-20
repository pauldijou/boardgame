import FastSimplexNoise from 'fast-simplex-noise';

import { isWater, filterWater, filterOcean, coastElevation, tagOcean, removeCoastalLakes } from './water';
import * as Debug from './debug';
import * as Grid from './grid';

export default function generate(options = {}) {
  const start = performance.now();

  const {
    width,
    height,
    coasts = {},
    water = 0.2,
    shape,
    voronoi
  } = options;

  const world = {
    width, height, coasts,
    map: {}
  };

  const noise = new FastSimplexNoise({
    min: -water,
    max: 1,
    // amplitude: 0.2,
    octaves: 6,
    frequency: 0.03,
    persistence: 0.2,
  });

  const hasCoast = coasts.left || coasts.top || coasts.bottom || coasts.right;
  const coastElv = hasCoast ?
    coastElevation({ width, height, coasts }) :
    () => 0;

  const diagram = Grid.voronoi(Object.assign({}, voronoi, { width, height }));

  diagram.cells.forEach(cell => {
    cell.elevation = noise.in2D(cell.x, cell.y) - coastElv(cell.x, cell.y);
  });

  if (hasCoast) {
    tagOcean(diagram.cells, width, height, coasts);
    removeCoastalLakes(diagram.cells, coastElv);
  }

  world.diagram = diagram;

  // Debug.repartition(tiles);
  console.debug("Duration:", (performance.now() - start) / 1000, 'sec');
  return world;
}
