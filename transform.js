/* eslint-env es6,node */
const {URL} = require('url');
const path = require('path');

module.exports = function(options = {}) {
  const domain = options.domain || 'http://example.com';

  return function(dom, file, {files, metalsmith}, done) {
    const images = Array.from(dom.querySelectorAll('img'));

    for (const image of images) {
      if (
        !options.overwrite &&
        (image.hasAttribute('width') || image.hasAttribute('height'))
      ) {
        continue;
      }
      const url = new URL(image.src, domain);

      // Don't support remote
      if (url.origin !== domain) {
        continue;
      }

      const fileDirectory = path.join(metalsmith.source(), path.dirname(file));
      const imagepath = path.relative(
        metalsmith.source(),
        metalsmith.path(fileDirectory, image.src),
      );

      if (imagepath in files) {
        const data = files[imagepath];
        if (data.width && data.height) {
          image.width = data.width;
          image.height = data.height;
        } else {
          // eslint-disable-next-line no-console
          console.error(
            `No size info image: ${imagepath}. Did you call readImageSizes?`,
          );
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(`Cannot find file for image: ${image.outerHTML}`);
      }
    }

    setImmediate(done);
  };
};
