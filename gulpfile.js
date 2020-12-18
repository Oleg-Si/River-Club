const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
// const mqpacker = require('css-mqpacker');
const del = require('del');
const server = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const svgmin = require('gulp-svgmin');
const noop = require('gulp-noop');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const webpack = require('webpack-stream');

const isDevelopment = () => {
  if (process.env.NODE_ENV === 'development ') {
    return true;
  }

  return false;
};

const PATH = {
  entry: {
    scss: './sass/style.scss',
    js: './js/script.js'
  },

  server: './build/',

  watch: {
    scss: '**/*.{scss,sass}',
    html: '*.html',
    js: 'js/**/*.{js,ts}',
    php: '*.php',
    images: 'img/**/*.{png,jpg,svg,ico,jpeg}'
  },

  build: {
    base: 'build',
    css: 'build/css',
    images: 'build/img',
    sprite: 'build/img/symbol/sprite.svg',
    js: './build/js/'
  }
};

// browser-sync server
gulp.task('server', (done) => {
  server.init({
    server: PATH.server,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(PATH.watch.scss, gulp.series('styles'));
  gulp.watch(PATH.watch.html, gulp.series('html:update'));
  gulp.watch(PATH.watch.js, gulp.series('js:update'));
  gulp.watch(PATH.watch.images, gulp.series('img:copy', 'svg'));
  gulp.watch(PATH.watch.php, gulp.series('php:update'));

  done();
});

// browser-sync server reload
gulp.task('server:reload', (done) => {
  server.reload();
  done();
});

// wath copy
gulp.task('html:copy', () => {
  return gulp.src(PATH.watch.html)
    .pipe(gulp.dest(PATH.build.base));
});

gulp.task('img:copy', () => {
  return gulp.src(PATH.watch.images)
    .pipe(gulp.dest(PATH.build.images));
});

gulp.task('php:copy', () => {
  return gulp.src(PATH.watch.php)
    .pipe(gulp.dest(PATH.build.base));
});

// copy
gulp.task('copy', () => {
  return gulp.src(PATH.watch.html,
    {
      base: '.',
      allowEmpty: true
    })
    .pipe(gulp.dest(PATH.build.base));
});

// clean
gulp.task('clean', () => {
  return del(PATH.build.base);
});

// imagemin
gulp.task('images', () => {
  return gulp.src(PATH.watch.images)
    .pipe(isDevelopment() ? noop() : imagemin([
      imagemin.optipng({
        optimizationlevel: 5
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      })
    ]))

    .pipe(gulp.dest(PATH.build.images));
});

// svg
gulp.task('svg', () => {
  return gulp.src(`${PATH.build.images}/**/*.svg`)
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parseOptions: {
        xmlMode: true
      }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest : '.'
        }
      }
    }))
    .pipe(gulp.dest(PATH.build.images));
});

gulp.task('styles', () => {
  return gulp.src(PATH.entry.scss)
    .pipe(plumber())
    .pipe(isDevelopment() ? sourcemaps.init() : noop())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(PATH.build.css))
    .pipe(isDevelopment() ? noop() : minify())
    .pipe(rename('style.min.css'))
    .pipe(isDevelopment() ? sourcemaps.write() : noop())
    .pipe(gulp.dest(PATH.build.css))
    .pipe(server.stream());
});

gulp.task('scripts', () => {
  return gulp.src(PATH.watch.js)
    .pipe(plumber())

    .pipe(webpack({
      mode: isDevelopment() ? 'development' : 'production',
      output: {
        filename: 'app.min.js',
      },
      module: {
        rules: [
          {
            test: /\.(js|ts)$/,
            exclude: /(node_modules)/,
            loaders: ['babel-loader', 'ts-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.js', 'json']
      },
      devtool: 'source-map',
      optimization: {
        minimize: !isDevelopment()
      },
    }))
    .pipe(gulp.dest(PATH.build.js))
});

// wath update
gulp.task('html:update', gulp.series('html:copy', 'server:reload'), (done) => {
  done();
});

gulp.task('php:update', gulp.series('php:copy', 'server:reload'), (done) => {
  done();
});

gulp.task('js:update', gulp.series('scripts', 'server:reload'), (done) => {
  done();
});

gulp.task('default', gulp.series(
  'clean',
  'copy',
  'images',
  'svg',
  'styles',
  'scripts'
));
