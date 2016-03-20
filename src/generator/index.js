import FastSimplexNoise from 'fast-simplex-noise';

import * as Maths from '../maths';
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
    map: {}
  };

  const distance = (!voronoi && shape === 'hexagon') ?
    Maths.distanceHexagon2D : Maths.distanceSquare2D;

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
    coastElevation({ width, height, coasts, distance }) :
    () => 0;

  const grid =
    (voronoi && Grid.voronoi(Object.assign({}, voronoi, { width, height })))
    || Grid.hexagon({ width, height });

  console.log('Grid valid?', Grid.validate(grid));

  // Assign elevations
  grid.cells.forEach(cell => {
    cell.elevation = noise.in2D(cell.x, cell.y) - coastElv(cell.x, cell.y);
  });

  grid.edges.forEach(edge => {
    edge.elevation = ((edge.c1 ? edge.c1.elevation : 0) + (edge.c2 ? edge.c2.elevation : 0)) / ((edge.c1 ? 1 : 0) + (edge.c2 ? 1 : 0));
  });

  // Ocean
  if (hasCoast) {
    tagOcean(grid.cells, width, height, coasts, distance);
    removeCoastalLakes(grid.cells, coastElv);
  }

  // Rivers
  if (rivers) {
    const riverEdges = grid.edges.filter(edge => edge.elevation > rivers.minHeight);

    if (riverEdges.length > 0) {
      const riverStarts = [];

      for(let i = 0; i < rivers.number; ++i) {
        const edge = riverEdges[Math.floor(Math.random() * (riverEdges.length - 1))];
        if (edge.rivers === undefined) {
          const river = [ edge ];
          edge.rivers = [ river ];
          riverStarts.push(river);
        }
      }

      function hasWater(edge) {
        return (edge.c1 && isWater(edge.c1)) || (edge.c2 && isWater(edge.c2));
      }

      function areTouching(e1, e2) {
        return e1.v1 === e2.v1 || e1.v1 === e2.v2 || e1.v2 === e2.v1 || e1.v2 === e2.v2;
      }

      function isValid(reference) {
        return function (edge) {
          return edge.elevation < reference.elevation
            && !hasWater(edge)
            && areTouching(reference, edge);
        }
      }

      function neighborEdges(edge) {
        let res = [];

        if (edge.c1) { res = res.concat(edge.c1.edges); }
        if (edge.c2) { res = res.concat(edge.c2.edges); }

        return res.map(e => e.edge).filter(isValid(edge));
      }

      riverStarts.forEach(river => {
        let next = river[0];
        while(next) {
          next = neighborEdges(next).reduce((res, e) => {
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

      function removeRiver(river) {
        river.forEach(edge => {
          edge.rivers = edge.rivers.filter(r => r !== river);
          if (edge.rivers.length === 0) {
            edge.rivers = undefined;
          }
        });
      }

      const finalRivers = riverStarts.filter(river => {
        if (river.length < 4) {
          removeRiver(river);
          return false;
        }
        return true;
      })
    }
  }

  world.grid = grid;

  // Debug.repartition(tiles);
  console.debug("Duration world generation:", Math.round(performance.now() - start), 'ms');
  return world;
}
