export function isWater(tile) {
  return tile.elevation < 0;
}

export function filterWater(tiles) {
  return tiles.filter(isWater);
}

export function filterOcean(tiles) {
  return tiles.filter(tile => tile.ocean);
}

// 0 | 1
// -----
// 3 | 2
function getQuartile(x, y, cx, cy) {
  if (x < cx) {
    return y < cy ? 0 : 3;
  } else {
    return y < cy ? 1 : 2;
  }
}

function getEllipsis(cx, cy) {
  const a = Math.pow(1 / cx, 2);
  const b = Math.pow(1 / cy, 2);

  return function ellipsis(x, y) {
    return a * Math.pow(x - cx, 2) + b * Math.pow(y - cy, 2);
  };
}

export function coastElevation({ width, height, coasts, distance }) {
  const cx = width / 2;
  const cy = height / 2;

  const none = () => 0;
  const ellipsis = getEllipsis(cx, cy);
  const linearVertical = (x, y) => Math.pow((y - cy) / cy, 2);
  const linearHorizontal = (x, y) => Math.pow((x - cx) / cx, 2);

  const quartiles = [];

  // 0: top left
  quartiles.push(
    (coasts.top && coasts.left && ellipsis) ||
    (coasts.top && linearVertical) ||
    (coasts.left && linearHorizontal) ||
    none
  );

  // 1: top right
  quartiles.push(
    (coasts.top && coasts.right && ellipsis) ||
    (coasts.top && linearVertical) ||
    (coasts.right && linearHorizontal) ||
    none
  );

  // 2: bottom right
  quartiles.push(
    (coasts.bottom && coasts.right && ellipsis) ||
    (coasts.bottom && linearVertical) ||
    (coasts.right && linearHorizontal) ||
    none
  );

  // 3: bottom left
  quartiles.push(
    (coasts.bottom && coasts.left && ellipsis) ||
    (coasts.bottom && linearVertical) ||
    (coasts.left && linearHorizontal) ||
    none
  );

  return function (x, y) {
    // return Math.pow(1.05 * quartiles[getQuartile(x, y, cx, cy)](x, y), 2);
    return 1.05 * Math.pow(Math.sqrt(quartiles[getQuartile(x, y, cx, cy)](x, y)), 3);
  }

  // FIXME center tile always return 0 => always keep water
  // FIXME ponderate if width !== height
  // return function (x, y) {
  //   return Math.pow(distance(
  //     (coasts.left && x < cx) || (coasts.right && x >= cx) ? x : cx,
  //     (coasts.top && y < cy) || (coasts.bottom && y >= cy) ? y : cy,
  //     cx,
  //     cy
  //   ) / Math.min(cx, cy), 3);
  // }

  // return function (x, y) {
  //   const isHorizontal = Math.abs(x - cx) / cx > Math.abs(y - cy) / cy;
  //
  //   if (
  //     (isHorizontal && coasts.left && x < cx) ||
  //     (isHorizontal && coasts.right && x >= cx) ||
  //     (!isHorizontal && coasts.top && y < cy) ||
  //     (!isHorizontal && coasts.bottom && y >= cy)
  //   ) {
  //     return Math.pow(
  //       Math.max(Math.abs(x - cx) / cx, Math.abs(y - cy) / cy)
  //     , 3);
  //   } else {
  //     return 0;
  //   }
  // }
}

export function tagOcean(cells, width, height, coasts, distance) {
  const starts = [];

  const distTop = cell => distance(width / 2, 0, cell.x, cell.y);
  const distBottom = cell => distance(width / 2, height, cell.x, cell.y);
  const distLeft = cell => distance(0, height / 2, cell.x, cell.y);
  const distRight = cell => distance(width, height / 2, cell.x, cell.y);
  const distTopLeft = cell => distance(0, 0, cell.x, cell.y);
  const distTopRight = cell => distance(width, 0, cell.x, cell.y);
  const distBottomLeft = cell => distance(0, height, cell.x, cell.y);
  const distBottomRight = cell => distance(width, height, cell.x, cell.y);

  const starters = cells.reduce((res, cell) => {
    if (distTop(cell) < distTop(res.top)) { res.top = cell; }
    if (distBottom(cell) < distBottom(res.bottom)) { res.bottom = cell; }
    if (distLeft(cell) < distLeft(res.left)) { res.left = cell; }
    if (distRight(cell) < distRight(res.right)) { res.right = cell; }
    if (distTopLeft(cell) < distTopLeft(res.topLeft)) { res.topLeft = cell; }
    if (distTopRight(cell) < distTopRight(res.topRight)) { res.topRight = cell; }
    if (distBottomLeft(cell) < distBottomLeft(res.bottomLeft)) { res.bottomLeft = cell; }
    if (distBottomRight(cell) < distBottomRight(res.bottomRight)) { res.bottomRight = cell; }
    return res;
  }, {
    top: cells[0], right: cells[0], left: cells[0], bottom: cells[0],
    topLeft: cells[0], topRight: cells[0], bottomLeft: cells[0], bottomRight: cells[0]
  });

  if (coasts.top) {
    starts.push(starters.top);
    starts.push(starters.topLeft);
    starts.push(starters.topRight);
  }
  if (coasts.bottom) {
    starts.push(starters.bottom);
    starts.push(starters.bottomLeft);
    starts.push(starters.bottomRight);
  }
  if (coasts.left) {
    starts.push(starters.left);
    starts.push(starters.topLeft);
    starts.push(starters.bottomLeft);
  }
  if (coasts.right) {
    starts.push(starters.right);
    starts.push(starters.topRight);
    starts.push(starters.bottomRight);
  }

  // let deeper = 0;
  const ocean = starts.filter(isWater).map(t => { t.ocean = true; return t; });
  while(ocean.length) {
    const next = ocean.shift();
    // deeper = Math.min(deeper, next.elevation);
    next.neighbors.forEach(cell => {
      if (cell && cell.ocean === undefined) {
        cell.ocean = isWater(cell);
        if (cell.ocean) {
          ocean.push(cell);
        }
      }
    });
  }

  // deeper = Math.abs(deeper);
  // cells.filter(c => c.ocean).forEach(cell => {
  //   cell.elevation /= deeper;
  //   // Ensure that coast boarder will be -1 to compensate any land
  //   if (cell.elevation < -0.85) {
  //     cell.elevation = -1;
  //   }
  // });
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
