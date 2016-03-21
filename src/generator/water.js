export function isWater(tile) {
  return tile.elevation < 0;
}

export function filterWater(tiles) {
  return tiles.filter(isWater);
}

export function filterOcean(tiles) {
  return tiles.filter(tile => tile.ocean);
}

export function coastElevation({ width, height, coasts, distance }) {
  const cx = width / 2;
  const cy = height / 2;

  // FIXME center tile always return 0 => always keep water
  // FIXME ponderate if width !== height
  return function (x, y) {
    return Math.pow(distance(
      (coasts.left && x < cx) || (coasts.right && x >= cx) ? x : cx,
      (coasts.top && y < cy) || (coasts.bottom && y >= cy) ? y : cy,
      cx,
      cy
    ) / Math.min(cx, cy), 3);
  }
}

export function tagOcean(cells, width, height, coasts, distance) {
  const starts = [];

  const distTopLeft = cell => distance(0, 0, cell.x, cell.y);
  const distTopRight = cell => distance(width, 0, cell.x, cell.y);
  const distBottomLeft = cell => distance(0, height, cell.x, cell.y);
  const distBottomRight = cell => distance(width, height, cell.x, cell.y);

  const { topLeft, topRight, bottomLeft, bottomRight } = cells.reduce((res, cell) => {
    if (distTopLeft(cell) < distTopLeft(res.topLeft)) { res.topLeft = cell; }
    if (distTopRight(cell) < distTopRight(res.topRight)) { res.topRight = cell; }
    if (distBottomLeft(cell) < distBottomLeft(res.bottomLeft)) { res.bottomLeft = cell; }
    if (distBottomRight(cell) < distBottomRight(res.bottomRight)) { res.bottomRight = cell; }
    return res;
  }, {
    topLeft: cells[0], topRight: cells[0], bottomLeft: cells[0], bottomRight: cells[0]
  });

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

  let deeper = 0;
  const ocean = starts.filter(isWater).map(t => { t.ocean = true; return t; });
  while(ocean.length) {
    const next = ocean.shift();
    deeper = Math.min(deeper, next.elevation);
    next.neighbors.forEach(cell => {
      if (cell && cell.ocean === undefined) {
        cell.ocean = isWater(cell);
        if (cell.ocean) {
          ocean.push(cell);
        }
      }
    });
  }

  deeper = Math.abs(deeper);
  cells.filter(c => c.ocean).forEach(cell => {
    cell.elevation /= deeper;
  });
}

export function removeCoastalLakes(cells, coastElv) {
  filterWater(cells).forEach(cell => {
    if (!cell.ocean && coastElv(cell.x, cell.y) > 0) {
      cell.elevation = 0.01;
    }
  });
}

export function normalizeWaterLevel(tiles, water) {
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
}
