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

      const imagepath = path.relative(
        metalsmith.source(),
        metalsmith.path(path.dirname(file), image.src),
      );

      if (imagepath in files) {
        const data = files[imagepath];

        if (!data.exif) {
          // eslint-disable-next-line no-console
          console.error(
            'Missing exif data in file, is `metalsmith-media-medadata` installed?',
          );
          continue;
        }

        image.width = data.exif.ImageWidth;
        image.height = data.exif.ImageHeight;
      } else {
        // eslint-disable-next-line no-console
        console.error(`Cannot find file for image: ${image.outerHTML}`);
      }
    }

    done();
  };
};
