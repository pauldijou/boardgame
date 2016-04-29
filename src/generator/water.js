export function isWater(tile) {
  return tile.water;
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

export function coastElevation({ width, height, coasts, distance, grid }) {
  const cx = width / 2;
  const cy = height / 2;

  const higher = grid.cells.reduce((high, cell) =>
    Math.max(high, cell.elevation)
  , 0);

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
    return 1.05 * higher * Math.pow(Math.sqrt(quartiles[getQuartile(x, y, cx, cy)](x, y)), 3);
  }
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

  const ocean = starts.filter(isWater).map(t => { t.ocean = true; return t; });
  while(ocean.length) {
    const next = ocean.shift();
    next.getNeighbors().forEach(cell => {
      if (cell && cell.ocean === undefined) {
        cell.ocean = isWater(cell);
        if (cell.ocean) {
          cell.distanceOcean = 0;
          ocean.push(cell);
        } else {
          cell.distanceOcean = 1;
        }
      }
    });
  }

  let currentDistance = 1;
  let currentCells = cells.filter(c => c.distanceOcean === currentDistance);
  while(currentCells.length) {
    console.log('current', currentCells.length, currentDistance);

    // 1) Merge all neighbors
    const nexts = currentCells.reduce((nexts, cell) => {
      return nexts.concat(cell.neighbors);
    }, []).sort();

    // 2) Remove duplicates by sorting and removing consecutive items
    currentCells = [];
    for (let i = 0; i < nexts.length - 1; ++i) {
      if (nexts[i] !== nexts[i+1]) {
        currentCells.push(nexts[i]);
      }
    }

    // 3) Remove cells with already a distance
    currentCells = currentCells.map(idx => cells[idx]).filter(cell => cell.distanceOcean === undefined);

    // 4) Assign the current distance to remaining cells
    currentDistance++;
    currentCells.forEach(cell => {
      cell.distanceOcean = currentDistance;
    });
  }
}

// Because coast elevation will decrease the elevation aroudn coasts,
// it will create a higher probably of lakes near coasts. That's too much
// water at the same place. So, for now, we will remove all lakes in
// which might have been created due to coast elevation
export function removeCoastalLakes(cells, coastElv) {
  filterWater(cells).forEach(cell => {
    if (!cell.ocean && coastElv(cell.x, cell.y) !== 0) {
      cell.water = false;
      // We cannot reverse the coast elevation because all cells around
      // have also been impacted by it
    }
  });
}
