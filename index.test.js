/* eslint-env jest,node */
const imageDimensions = require('./index');
const mediaMetadata = require('metalsmith-media-metadata');
const Metalsmith = require('metalsmith');
const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const path = require('path');

let files;

beforeAll(done => {
  // Mock out `console.error`
  /* eslint-disable no-console */
  const originalConsoleError = console.error;

  console.error = jest.fn(() => {});
  // Setup metalsmith, but don't build yet.
  const metal = Metalsmith(__dirname)
    .source('./')
    .ignore(['.*', 'node_modules', '__*', 'coverage'])
    .destination('__build')
    .use(mediaMetadata())
    .use((files, metalsmith, done) => {
      // Manually add fake HTML files for test
      Object.assign(files, {
        // 'no_images.html': {contents: new Buffer('<p>Just prose.</p>')},
        'simple_image.html': {
          contents: new Buffer('<img src=baboon.png>'),
        },
        'multiple_images.html': {
          contents: new Buffer(`<img src=baboon.png>
        <figure><img src=waterfall.jpg></figure>`),
        },
        'relative/path.html': {
          contents: new Buffer('<img src=../tinygif.gif width=10 height=10>'),
        },
        'already_specified.html': {
          contents: new Buffer('<img src=tinygif.gif width=20 height=20>'),
        },
        'external_image.html': {
          contents: new Buffer('<img src=http://httpbin.org/image/jpeg>'),
        },
        '404_image.html': {
          contents: new Buffer('<img src=bogus.jpg>'),
        },
      });

      setImmediate(done);
    })
    .use(imageDimensions());

  // .use(mediaMetadata({}))
  metal.build((err, processedFiles) => {
    files = processedFiles;
    done(err);
  });
});

afterAll(() => {
  console.error = originalConsoleError;
  return rimraf(path.join(__dirname, '__build'));
});

test('integration test', () => {
  Object.entries(files).forEach(([file, data]) => {
    if (!/\.html$/.test(file)) {
      return;
    }

    expect({file, contents: data.contents.toString()}).toMatchSnapshot();
  });
});
