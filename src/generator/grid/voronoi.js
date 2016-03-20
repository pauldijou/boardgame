import Voronoi from 'voronoi';
import * as Maths from '../../maths';
import validate from './validate';

function generateSites(number, shape, width, height) {
  const sites = [];
  if (shape === 'random') {
    for (let i = 0; i < number; ++i) {
      sites.push({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      });
    }
  } else {
    const delta = Math.sqrt(width * height / number);
    let x = 0;
    let y = 0;
    for (let i = 0; i < number; ++i) {
      sites.push({
        x: Math.max(Math.min(Math.round(x * delta), width), 0),
        y: Math.max(Math.min(Math.round(y * delta), height), 0),
      });
      x++;
      if (x * delta > width) {
        // start a new line
        x = (shape === 'square' || y % 2 === 1 ? 0 : 0.5);
        y++;
      }
    }
  }
  return sites;
}

function generateDiagram(voronoi, sites, previousDiagram, width, height) {
  if (previousDiagram) {
    voronoi.recycle(previousDiagram);
  }
  const area = {xl: 0, xr: width, yt: 0, yb: height};
  return voronoi.compute(sites, area);
}

function cellArea(cell) {
  var area = 0,
      halfedges = cell.halfedges,
      iHalfedge = halfedges.length,
      halfedge,
      p1, p2;
  while (iHalfedge--) {
      halfedge = halfedges[iHalfedge];
      p1 = halfedge.getStartpoint();
      p2 = halfedge.getEndpoint();
      area += p1.x * p2.y;
      area -= p1.y * p2.x;
  }
  area /= 2;
  return area;
}

function cellCentroid (cell) {
  var x = 0,
      y = 0,
      halfedges = cell.halfedges,
      iHalfedge = halfedges.length,
      halfedge,
      v, p1, p2;
  while (iHalfedge--) {
      halfedge = halfedges[iHalfedge];
      p1 = halfedge.getStartpoint();
      p2 = halfedge.getEndpoint();
      v = p1.x * p2.y - p2.x * p1.y;
      x += (p1.x + p2.x) * v;
      y += (p1.y + p2.y) * v;
  }
  v = cellArea(cell) * 6;
  return {
      x: x / v,
      y: y / v
  };
}

function relaxDiagram(voronoi, diagram, width, height) {
  var cells = diagram.cells,
      iCell = cells.length,
      cell,
      site, sites = [],
      rn, dist;
  var p = 1 / iCell * 0.1;
  while (iCell--) {
      cell = cells[iCell];
      rn = Math.random();
      // probability of apoptosis
      if (rn < p) {
          continue;
      }
      site = cellCentroid(cell);
      dist = Maths.distanceSquare2D(site.x, site.y, cell.site.x, cell.site.y);
      // dist = this.distance(site, cell.site);
      // don't relax too fast
      if (dist > 2) {
          site.x = (site.x + cell.site.x) / 2;
          site.y = (site.y + cell.site.y) / 2;
      }
      // probability of mytosis
      if (rn > (1 - p)) {
          dist /= 2;
          sites.push({
              x: site.x + (site.x - cell.site.x) / dist,
              y: site.y + (site.y - cell.site.y) / dist
          });
      }
      sites.push(site);
  }

  return generateDiagram(voronoi, sites, diagram, width, height);
}

function normalizeDiagram(diagram) {
  diagram.cells.forEach(cell => {
    cell.site.cell = cell;
    cell.x = cell.site.x;
    cell.y = cell.site.y;
    cell.neighbors = [];
    cell.edges = cell.halfedges;
    cell.edges.forEach(edge => {
      edge.start = edge.getStartpoint();
      edge.end = edge.getEndpoint();
    });
  });

  diagram.edges.forEach(edge => {
    const lCell = edge.lSite && edge.lSite.cell;
    const rCell = edge.rSite && edge.rSite.cell;
    if (lCell && rCell) {
      lCell.neighbors.push(rCell)
      rCell.neighbors.push(lCell)
    }
  });

  return diagram;
}

export default function generateVoronoiGrid(options = {}) {
  const {
    width, // the total grid width
    height, // the total grid height
    sites: numberOfSites, // the number of cells/polygons to generate
    relax = 2, // the number of relaxation phases to apply, the more, the smoother the cells
    shape = 'random', // random | square | hexagon
  } = options;

  const voronoi = new Voronoi();
  const sites = generateSites(numberOfSites, shape, width, height);
  let diagram = generateDiagram(voronoi, sites, undefined, width, height);
  for (let i = 0; i < relax; ++i) {
    diagram = relaxDiagram(voronoi, diagram, width, height);
  }
  diagram = normalizeDiagram(diagram);
  console.log(diagram);
  console.log(validate(diagram));
  return diagram;
}
