var path = require('path');
var fs = require('fs');
var md5 = require('md5-file');

var distPath = path.join(__dirname, 'dist');
var stylesPath = path.join(distPath, 'styles.css');
var scriptsPath = path.join(distPath, 'scripts.js');
var indexPath = path.join(distPath, 'index.html');

var stylesMD5 =  'styles.' + md5(stylesPath) + '.css';
var scriptsMD5 =  'scripts.' + md5(scriptsPath) + '.js';

fs.renameSync(stylesPath, path.join(distPath, stylesMD5));
fs.renameSync(scriptsPath, path.join(distPath, scriptsMD5));

var indexFile = fs.readFileSync(indexPath, { encoding: 'utf8' });

fs.writeFileSync(
  indexPath,
  indexFile.replace('styles.css', stylesMD5).replace('scripts.js', scriptsMD5)
);
