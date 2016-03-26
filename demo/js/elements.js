function byId(id) {
  return document.getElementById(id)
}

export function show(elem) { elem.classList.remove('hidden'); }
export function hide(elem) { elem.classList.add('hidden'); }

export function forEachNode(nodes, func) {
  for (let i = 0, l = nodes.length; i < l; ++i) {
    func(nodes[i]);
  }
}

export const generater = byId('generater');
export const refresher = byId('refresher');
export const opener = byId('opener');
export const closer = byId('closer');
export const configPanel = byId('config');
export const grid = byId('grid');
export const context = grid.getContext('2d');

export const inputs = {
  noiseTypeDefault: byId('noiseTypeDefault'),
  noiseTypeCustom: byId('noiseTypeCustom'),
  noise: {
    shapeFlat: byId('noiseShapeFlat'),
    shapeCylindrical: byId('noiseShapeCylindrical'),
    shapeSpherical: byId('noiseShapeSpherical'),
    circumference: byId('inputNoiseCircumference'),
    amplitude: byId('inputNoiseAmplitude'),
    octaves: byId('inputNoiseOctaves'),
    frequency: byId('inputNoiseFrequency'),
    persistence: byId('inputNoisePersistence'),
  },
  width: byId('inputWidth'),
  height: byId('inputHeight'),
  max: byId('inputMax'),
  min: byId('inputMin'),
  gridTypeVoronoi: byId('gridTypeVoronoi'),
  gridTypeHexagon: byId('gridTypeHexagon'),
  voronoi: {
    sites: byId('inputVoronoiSites'),
    relax: byId('inputVoronoiRelax'),
  },
  coasts: {
    top: byId('inputCoastTop'),
    bottom: byId('inputCoastBottom'),
    left: byId('inputCoastLeft'),
    right: byId('inputCoastRight'),
  },
};

export const labels = {
  width: byId('labelWidth'),
  height: byId('labelHeight'),
  max: byId('labelMax'),
  min: byId('labelMin'),
  voronoi: {
    sites: byId('labelVoronoiSites'),
    relax: byId('labelVoronoiRelax'),
  }
};

export const details = {
  noise: document.querySelectorAll('.noise'),
  noiseCircumference: document.querySelectorAll('.noise-circumference'),
  voronoi: document.querySelectorAll('.voronoi'),
  hexagons: document.querySelectorAll('.hexagons')
};
