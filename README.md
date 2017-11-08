# metalsmith-image-dimensions

[![build status](https://travis-ci.org/fortes/metalsmith-image-dimensions.svg?branch=master)](https://travis-ci.org/fortes/metalsmith-image-dimensions/) [![codecov](https://codecov.io/gh/fortes/metalsmith-image-dimensions/branch/master/graph/badge.svg)](https://codecov.io/gh/fortes/metalsmith-image-dimensions) [![Greenkeeper badge](https://badges.greenkeeper.io/fortes/metalsmith-image-dimensions.svg)](https://greenkeeper.io/)

[Metalsmith](http://www.metalsmith.io/) plugin for automatically adding `width` and `height` attributes to `img` tags.

## Example

Input:

```html
<img src="dog.jpg">
```

Output:

```html
<img src="dog.jpg" width="100" height="50">
```

## Usage

```js
const imageDimensions = require('metalsmith-image-dimensions');

metalsmith
  .use(imageDimensions({
    overwrite: true
  }));
```

### Using with `metalsmith-dom-transform`

If you're already using [`metalsmith-dom-transform`](https://github.com/fortes/metalsmith-dom-transform), you can save a little bit of overhead by accessing the image dimension transform directly:

```js
const domTransform = require('metalsmith-image-dimensions');
const readImageSizes = require('metalsmith-image-dimensions/read_image_sizes');
const imageDimensionsTransform = require('metalsmith-image-dimensions/transform');

metalsmith
  .use(readImageSizes({
    path: '**/*.+(jpg|png)'
  }))
  .use(domTransform({
    transforms: [
      imageDimensionsTransform(options),
      // Your other transforms go here
    ]
  }));
```

Note that you must separately use `readImageSizes` *before* running the `domTransform`.

## Notes

* External images are not supported since I didn't need them. File an issue if that's something you'd like.

## Configuration

* `domain`: Domain where this is hosted, used to determine if an image is external. It is unlikely that you'd need to set this, unless you have absolute URLs for image that are local to the site (default: `http://example.com`).
* `path`: [`minimatch`](https://github.com/isaacs/minimatch) *case-insensitive* glob that determines which files get processed (default: `**/*.+(gif|jpg|png)`)
* `overwrite`: Write `width` and `height` tags even if already set (default `false`)

## Changelog

* `0.1.0`: Remove requirement for `metalsmith-media-metadata` and expose `readImageSizes`
* `0.0.2`: Fix bug where paths were not correctly resolved
* `0.0.1`: First release
