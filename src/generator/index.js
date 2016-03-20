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
    voronoi,
    rivers,
    volcanos
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

  // Assign elevations
  diagram.cells.forEach(cell => {
    cell.elevation = noise.in2D(cell.x, cell.y) - coastElv(cell.x, cell.y);
  });

  diagram.edges.forEach(edge => {
    edge.elevation = ((edge.c1 ? edge.c1.elevation : 0) + (edge.c2 ? edge.c2.elevation : 0)) / ((edge.c1 ? 1 : 0) + (edge.c2 ? 1 : 0));
  });

  // Ocean
  if (hasCoast) {
    tagOcean(diagram.cells, width, height, coasts);
    removeCoastalLakes(diagram.cells, coastElv);
  }

  // Rivers
  if (rivers) {
    const riverEdges = diagram.edges.filter(edge => edge.elevation > rivers.minHeight);
    const riverStarts = [];

    for(let i = 0; i < rivers.number; ++i) {
      const edge = riverEdges[Math.floor(Math.random() * riverEdges.length)];
      if (edge.river === undefined) {
        edge.river = 1;
        riverStarts.push(edge);
      }
    }

    riverStarts.forEach(start => {

    });
  }


  world.diagram = diagram;

  // Debug.repartition(tiles);
  console.debug("Duration:", (performance.now() - start) / 1000, 'sec');
  return world;
}
