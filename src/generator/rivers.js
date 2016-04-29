import { isWater } from './water';
import { neighborEdges } from './utils';

function hasWater(edge) {
  return (edge.getLeft() && isWater(edge.getLeft())) || (edge.getRight() && isWater(edge.getRight()));
}

function isValid(reference) {
  return function (edge) {
    return edge.elevation < reference.elevation
      && !hasWater(edge)
      && neighborEdges(reference, edge);
  }
}

// function neighborEdges(edge) {
//   let res = [];
//
//   if (edge.c1) { res = res.concat(edge.c1.edges); }
//   if (edge.c2) { res = res.concat(edge.c2.edges); }
//
//   return res.map(e => e.edge).filter(isValid(edge));
// }

function getNextStarts(edges, { minHeight, maxHeight }) {
  return edges.filter(edge => {
    return (edge.rivers === undefined)
      && (minHeight === undefined || edge.elevation > minHeight)
      && (maxHeight === undefined || edge.elevation < maxHeight);
  });
}

function getNext(edge) {
  return edge.getNeighbors()
    .filter(isValid(edge))
    .sort((e1, e2) => e2.elevation - e1.elevation)
    .pop();
}

export function removeRiver(river) {
  river.edges.forEach(edge => {
    edge.rivers = edge.rivers.filter(r => r !== river);
    if (edge.rivers.length === 0) {
      edge.rivers = undefined;
    }
  });
}

export function assignRivers(world, config = {}) {
  const {
    number = 0,
    minHeight,
    maxHeight,
    minLength = 0,
    maxLength = Infinity,
    spacing,
  } = config;
  const rivers = [];

  while(rivers.length < number) {
    const starts = getNextStarts(world.grid.edges, config);

    if (starts.length === 0) {
      break;
    }

    const start = starts[Math.floor(Math.random() * (starts.length - 1))];
    const river = {
      start: start.id,
      edges: [],
    };

    let current = start;
    while(current) {
      river.edges.push(current);
      river.end = current;
      if (!Array.isArray(current.rivers)) {
        current.rivers = [];
      }
      current.rivers.push(river);
      current = getNext(current);
    }

    if (river.edges.length < minLength || river.edges.length > maxLength) {
      removeRiver(river);
      if (start.rivers === undefined) {
        start.rivers = false;
      }
    } else {
      rivers.push(river);
    }
  }

  return rivers;


  // if (startEdges.length > 0) {
  //   const riverStarts = [];
  //
  //   for(let i = 0; i < number; ++i) {
  //     const edge = startEdges[Math.floor(Math.random() * (startEdges.length - 1))];
  //     if (edge.rivers === undefined) {
  //       const river = [ edge ];
  //       edge.rivers = [ river ];
  //       riverStarts.push(river);
  //     }
  //   }
  //
  //   riverStarts.forEach(river => {
  //     let next = river[0];
  //     while(next) {
  //       next = neighborEdges(next).reduce((res, e) => {
  //         if (!res) return e;
  //         return e.elevation < res.elevation ? e : res;
  //       }, false);
  //
  //       if (next) {
  //         river.push(next);
  //         if (next.rivers) {
  //           next.rivers.push(river);
  //         } else {
  //           next.rivers = [river];
  //         }
  //       }
  //     }
  //   });
  //
  //   return riverStarts.filter(river => {
  //     if ((minLength !== undefined && river.length < minLength)
  //       || (maxLength !== undefined && river.length > maxLength)) {
  //       removeRiver(river);
  //       return false;
  //     }
  //     return true;
  //   });
  // }
  //
  // return [];
}
