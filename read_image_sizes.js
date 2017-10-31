const imageSize = require('image-size');
const {Minimatch} = require('minimatch');

const DEFAULT_PATH = '**/*.+(gif|jpg|png)';

module.exports = function(options) {
  const matcher = new Minimatch((options && options.path) || DEFAULT_PATH, {
    nocase: true,
  });

  return function(files, metalsmith, done) {
    for (const file in files) {
      if (!matcher.match(file)) {
        continue;
      }

      const data = files[file];
      const {width, height} = imageSize(data.contents);
      data.width = width;
      data.height = height;
    }

    setImmediate(done);
  };
};
