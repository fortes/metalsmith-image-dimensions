const domTransform = require('metalsmith-dom-transform');
const readImageSizes = require('./read_image_sizes');
const highlightTransform = require('./transform');

module.exports = function(options) {
  return [
    readImageSizes(options),
    domTransform({
      transforms: [highlightTransform(options)],
    }),
  ];
};
