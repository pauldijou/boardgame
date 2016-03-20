export function neighborsSquare2D(x, y) {
  return [
    {x: x + 1, y: y    },
    {x: x - 1, y: y    },
    {x: x,     y: y - 1},
    {x: x,     y: y + 1}
  ];
}

export function neighborsHegaxon2D(x, y) {
  return [
    {x: x + 1, y: y    },
    {x: x + 1, y: y - 1},
    {x: x,     y: y - 1},
    {x: x - 1, y: y    },
    {x: x - 1, y: y + 1},
    {x: x,     y: y + 1}
  ];
}

export function distanceSquare2D(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function distanceHexagon2D(x1, y1, x2, y2) {
  return (Math.abs(x1 - x2)
          + Math.abs(x1 + y1 - x2 - y2)
          + Math.abs(y1 - y2)) / 2;
}
