import { aStar } from 'armillary';
import * as SHAPES from './shapes';
import * as Maths from './Maths';

export default function ({ world, generate, neighbors }) {
  // Return a tile at given coordinates
  function at(x, y) {
    try {
      if (world.map[x][y] === undefined) {
        throw new Error('generate it');
      }
    } catch (e) {
      world.map = world.map || {};
      world.map[x] = world.map[x] || {};
      world.map[x][y] = (generate && generate(x, y)) || null;
    }

    return world.map[x][y];
  }

  // Return neighbors of a given tile
  const neighborsFun = (world.shape === SHAPES.SQUARE && Maths.neighborsSquare2D)
    || (world.shape === SHAPES.HEXAGON && Maths.neighborsHegaxon2D);

  function neighborsOf(tile) {
    return neighborsFun(tile.x, tile.y)
      .map(coords => mapAt(coords.x, coords.y))
      .filter(n => n);
  }

  const finalNeighbors = neighbors || neighborsOf;

  // Pathfinding
  function path(start, end) {
    return aStar({
      start,
      end,
      neighbors: finalNeighbors,
    });
  }

  return {
    at,
    neighbors: finalNeighbors,
    path,
  }
}
