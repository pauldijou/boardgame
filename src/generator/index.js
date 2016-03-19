import FastSimplexNoise from 'fast-simplex-noise';

const noise = new FastSimplexNoise({
  min: 0,
  max: 1,
  // amplitude: 0.2,
  octaves: 6,
  frequency: 0.03,
  persistence: 0.2,
});

function debug(tiles) {
  let waterTiles = 0;
  let lowTiles = 0;
  let mediumTiles = 0;
  let highTiles = 0;
  let veryhighTiles = 0;
  tiles.forEach(({ elevation }) => {
    if (elevation < 0) { waterTiles++ }
    else if (elevation < 0.25) { lowTiles++ }
    else if (elevation < 0.50) { mediumTiles++ }
    else if (elevation < 0.75) { highTiles++ }
    else { veryhighTiles++ }
  })
  console.log(
    100 * waterTiles / tiles.length,
    100 * lowTiles / tiles.length,
    100 * mediumTiles / tiles.length,
    100 * highTiles / tiles.length,
    100 * veryhighTiles / tiles.length
  );
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function coastElevation({ width, height, coasts }) {
  const cx = width / 2;
  const cy = height / 2;

  return function (x, y) {
    return Math.pow(distance(
      (coasts.left && x < 50) || (coasts.right && x > 50) ? x : cx,
      (coasts.top && y < 50) || (coasts.bottom && y > 50) ? y : cy,
      cx,
      cy
    ) / 50, 3);
  }
}

function isWater(tile) {
  return tile.elevation < 0;
}

function filterWater(tiles) {
  return tiles.filter(isWater);
}

function filterOcean(tiles) {
  return tiles.filter(tile => tile.ocean);
}

export default function generate({
  width,
  height,
  coasts = {},
  water = 0.2
}) {
  const start = performance.now();
  const world = {
    width, height,
    map: {}
  };

  const hasCoast = coasts.left || coasts.top || coasts.bottom || coasts.right;
  const coastElv = hasCoast ?
    coastElevation({ width, height, coasts }) :
    () => 0;

  const tiles = [];

  // Generate raw world
  for (let x = 0; x < width; ++x) {
    world.map[x] = {};
    for (let y = 0; y < height; ++y) {
      const tile = {
        x, y,
        elevation: noise.in2D(x, y) - coastElv(x, y)
      }

      tiles.push(tile);
      world.map[x][y] = tile;
    }
  }

  // debug
  for(let i = 0; i < 1; i += 0.1) {
    console.log(i, '->', i+0.1, ':', tiles.filter(t => t.elevation >= i && t.elevation < i+0.1).length / tiles.length * 100);
  }

  // Regulate water percentage
  let maxHeight = 1;
  let waterPercentage = filterWater(tiles).length / tiles.length;
  const waterStep = 0.01;

  if (waterPercentage < water) {
    while(waterPercentage < water) {
      maxHeight -= waterStep;
      tiles.forEach(tile => tile.elevation -= waterStep);
      waterPercentage = filterWater(tiles).length / tiles.length;
    }
  } else {
    while(waterPercentage > water) {
      maxHeight += waterStep;
      tiles.forEach(tile => tile.elevation += waterStep);
      waterPercentage = filterWater(tiles).length / tiles.length;
    }
  }

  // Normalize height
  tiles.forEach(tile => tile.elevation /= maxHeight);

  if (hasCoast) {
    // Tag ocean
    const starts = [];

    if (coasts.top) {
      starts.push(world.map[0][0]);
      starts.push(world.map[width - 1][0]);
    }
    if (coasts.bottom) {
      starts.push(world.map[0][height - 1]);
      starts.push(world.map[width - 1][height - 1]);
    }
    if (coasts.left) {
      starts.push(world.map[0][0]);
      starts.push(world.map[0][height - 1]);
    }
    if (coasts.right) {
      starts.push(world.map[width - 1][0]);
      starts.push(world.map[width - 1][height - 1]);
    }

    const ocean = starts.filter(isWater).map(t => { t.ocean = true; return t; });
    while(ocean.length) {
      const next = ocean.shift();
      [-1,1,0,0].map(x => x + next.x).forEach(x => {
        [0,0,-1,1].map(y => y + next.y).forEach(y => {
          const tile = world.map[x] && world.map[x][y];
          if (tile && tile.ocean === undefined) {
            tile.ocean = isWater(tile);
            if (tile.ocean) {
              ocean.push(tile);
            }
          }
        });
      })
    }

    // Cancel coast elevation for non-ocean water tile
    // This is to prevent many lakes near coasts
    filterWater(tiles).forEach(tile => {
      if (!tile.ocean && coastElv(tile.x, tile.y) > 0) {
        tile.elevation = 0.01;
      }
    });
  }



  debug(tiles);
  console.debug("Duration:", (performance.now() - start) / 1000, 'sec');
  return world;
}
