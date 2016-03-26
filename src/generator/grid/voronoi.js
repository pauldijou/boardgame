import Voronoi from 'voronoi';
import * as Maths from '../../maths';
import validate from './validate';

const sqrt3 = Math.sqrt(3);

function hexagonSide(area) {
  return Math.sqrt(2 * area / (3 * sqrt3));
}

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
    const area = width * height / number;
    const delta = (shape === 'hexagon') ?
      { x: 2 * hexagonSide(area), y: sqrt3 * hexagonSide(area) } :
      { x: Math.sqrt(area), y: Math.sqrt(area) };

    console.log(delta);
    let x = 0.5;
    let y = 0.5;
    for (let i = 0; i < number; ++i) {
      sites.push({
        x: Math.max(Math.min(Math.round(x * delta.x), width), 0),
        y: Math.max(Math.min(Math.round(y * delta.y), height), 0),
      });
      console.log(sites[sites.length-1]);
      x++;
      if (x * delta.x > width) {
        // start a new line
        x = (shape === 'square' || y % 2 === 1 ? 0.5 : 1.5);
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

function getCellArea(cell) {
  return cell.halfedges.reduce((area, edge) => {
    const start = edge.getStartpoint();
    const end = edge.getEndpoint();
    return area + (start.x * end.y) - (start.y * end.x);
  }, 0) / 2;
}

function getCellCentroid (cell) {
  const area = getCellArea(cell) * 6;
  const centroid = cell.halfedges.reduce((cent, edge) => {
    const start = edge.getStartpoint();
    const end = edge.getEndpoint();
    const localArea = start.x * end.y - end.x * start.y;
    cent.x += (start.x + end.x) * localArea;
    cent.y += (start.y + end.y) * localArea;
    return cent;
  }, { x: 0, y: 0 });

  return {
    x: centroid.x / area,
    y: centroid.y / area
  };
}

function relaxDiagram(voronoi, diagram, width, height) {
  const prob = 0.1 / diagram.cells.length;
  const sites = [];

  diagram.cells.forEach(cell => {
    const rand = Math.random();
    if (rand < prob) {
      // apoptosis
      return;
    }

    const site = getCellCentroid(cell);
    const distance = Maths.distanceSquare2D(site.x, site.y, cell.site.x, cell.site.y);

    if (distance > 2) {
      site.x = (site.x + cell.site.x) / 2;
      site.y = (site.y + cell.site.y) / 2;
    }

    if (rand > (1 - prob)) {
      // mytosis
      sites.push({
        x: site.x + 2 * (site.x - cell.site.x) / distance,
        y: site.y + 2 * (site.y - cell.site.y) / distance
      });
    }

    sites.push(site);
  });

  return generateDiagram(voronoi, sites, diagram, width, height);
}

function normalizeDiagram(diagram) {
  diagram.cells.forEach((cell, idx) => {
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

  diagram.edges.forEach((edge, idx) => {
    const lCell = edge.lSite && edge.lSite.cell;
    const rCell = edge.rSite && edge.rSite.cell;
    if (lCell && rCell) {
      lCell.neighbors.push(rCell);
      rCell.neighbors.push(lCell);
    }

    edge.v1 = edge.va;
    edge.v2 = edge.vb;
    edge.c1 = lCell;
    edge.c2 = rCell;
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

  return normalizeDiagram(diagram);
}
