function hashVertex(vertex) {
  return ('' + vertex.x) + '_' + ('' + vertex.y);
}

function hashEdge(edge) {
  return `${hashVertex(edge.v1)}__${hashVertex(edge.v2)}`;
}

function hashEdgeAlt(edge) {
  return `${hashVertex(edge.v2)}__${hashVertex(edge.v1)}`;
}

function getVertices(x, y) {
  return [
    { x: x - 1/3, y: y - 1/3 },
    { x: x - 2/3, y: y + 1/3 },
    { x: x - 1/3, y: y + 2/3 },
    { x: x + 1/3, y: y + 1/3 },
    { x: x + 2/3, y: y - 1/3 },
    { x: x + 1/3, y: y - 2/3 },
  ];
}

function round(num) {
  return Math.floor(10000 * num) / 10000;
}

export default function generateHexagonGrid(options = {}) {
  const {
    width,
    height,
    isFlat = true
  } = options;
  const vertices = {};
  const edges = {};
  const cells = [];

  for (let x = 0; x < width; ++x) {
    const startY = x === 0 ? 0 : -1 * Math.floor(x / 2);
    const endY = startY + height;

    for (let y = startY; y < endY; ++y) {
      const cell = { x, y, edges: [], neighbors: [] };

      const hexagonVertices = getVertices(x, y).map(vertex => ({
        x: round(vertex.x),
        y: round(vertex.y)
      }));

      for(let i = 0; i < 6; ++i) {
        const hash = hashVertex(hexagonVertices[i]);
        if (vertices[hash]) {
          hexagonVertices[i] = vertices[hash];
        } else {
          vertices[hash] = hexagonVertices[i];
        }
      }

      const hexagonEdges = [];

      for(let i = 0; i < 6; ++i) {
        hexagonEdges.push({
          start: hexagonVertices[i % 6],
          end: hexagonVertices[(i + 1) % 6]
        });
      }

      for(let i = 0; i < 6; ++i) {
        const hash1 = hashEdge(hexagonEdges[i]);
        const hash2 = hashEdgeAlt(hexagonEdges[i]);

        if (edges[hash1] || edges[hash2]) {
          hexagonEdges[i] = edges[hash1] || edges[hash2];
          hexagonEdges[i].right = cell;
        } else {
          edges[hash1] = hexagonEdges[i];
          hexagonEdges[i].left = cell;
        }
      }

      for(let i = 0; i < 6; ++i) {
        cell.edges.push({
          start: hexagonVertices[i],
          end: hexagonVertices[(i+1)%6],
          edge: hexagonEdges[i]
        });
      }

      cells.push(cell);
    }
  }

  const grid = {
    vertices: Object.keys(vertices).map(key => vertices[key]),
    edges: Object.keys(edges).map(key => edges[key]),
    cells
  };

  grid.edges.forEach(edge => {
    if (edge.c1 && edge.c2) {
      edge.c1.neighbors.push(edge.c2);
      edge.c2.neighbors.push(edge.c1);
    }
  });

  return grid;
}
