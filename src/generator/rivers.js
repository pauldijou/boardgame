import { isWater } from './water';

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

export function removeRiver(river) {
  river.forEach(edge => {
    edge.rivers = edge.rivers.filter(r => r !== river);
    if (edge.rivers.length === 0) {
      edge.rivers = undefined;
    }
  });
}

export function assignRivers(world, config) {
  const {
    number = 0,
    minHeight,
    maxHeight,
    minLength,
    maxLength,
  } = config;

  const startEdges = world.grid.edges.filter(edge => {
    return (minHeight === undefined || edge.elevation > minHeight)
      && (maxHeight === undefined || edge.elevation < maxHeight);
  });

  if (startEdges.length > 0) {
    const riverStarts = [];

    for(let i = 0; i < number; ++i) {
      const edge = startEdges[Math.floor(Math.random() * (startEdges.length - 1))];
      if (edge.rivers === undefined) {
        const river = [ edge ];
        edge.rivers = [ river ];
        riverStarts.push(river);
      }
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

    return riverStarts.filter(river => {
      if ((minLength !== undefined && river.length < minLength)
        || (maxLength !== undefined && river.length > maxLength)) {
        removeRiver(river);
        return false;
      }
      return true;
    });
  }

  return [];
}
