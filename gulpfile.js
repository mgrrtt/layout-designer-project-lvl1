const { src, dest, parallel, watch } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const gulpStylelint = require('gulp-stylelint');
const browserSync = require('browser-sync').create();

const browserSyncJob = () => {
  browserSync.init({
    server: 'src/'
  });

  watch('src/styles/**/*.scss', { event: 'all' }, compileSass);
  watch('src/*.html', { event: 'all' }, updateHtml);
};

const updateHtml = () => {
  console.log('update my html...');

  return src('src/index.html')
    .pipe(browserSync.stream());
};

const compileSass = () => {
  console.log('compile my sass to css...');

  return src('src/styles/**/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(gulpStylelint({fix: true}))
    .pipe(dest('src/styles'))
    .pipe(browserSync.stream());
};

const buildHtml = () => {
  console.log('copy my html to build...');

  return src('src/index.html')
    .pipe(dest('build/'));
};

const buildFonts = () => {
  console.log('copy my fonts to build...');

  return src('src/fonts/*')
    .pipe(dest('build/fonts/'));
};

const buildImages = () => {
  console.log('copy my images to build...');

  return src('src/images/*')
    .pipe(dest('build/images/'));
};

const buildStyles = () => {
  console.log('build project...');

  return src('src/styles/**/*.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(concat('style.css'))
    .pipe(dest('build/styles'));
};

exports.default = compileSass;
exports.watchers = browserSyncJob;
exports.build = parallel(buildHtml, buildFonts, buildImages, buildStyles);
