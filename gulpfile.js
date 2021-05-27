const del = require("del");
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();

// Styles

const styles = () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        overrideBrowserslist:  [
          'last 5 versions',
          '> 0.7%',
          'not dead'
        ],
        cascade: false
      }),
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};
exports.styles = styles;

// HTML

const html = () => {
  return gulp
    .src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

// JS

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(terser())
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}
exports.scripts = scripts;

// Clean

const clean = () => {
  return del("build");
};

// Images

const optimizeImages = () => {
  return gulp.src("source/images/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 2}),
      imagemin.mozjpeg({progressive: true}),
    ]))
    .pipe(gulp.dest("build/images"))
}
exports.images = optimizeImages;

const copyImages = () => {
  return gulp.src("source/images/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/images"))
}
exports.images = copyImages;

const createWebp = () => {
  return gulp.src("source/images/*.{png,jpg}")
    .pipe(webp({quality: 95}))
    .pipe(gulp.dest("build/images"))
}
exports.createWebp = createWebp;

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/images/**/*.{jpg,png,svg}",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;

const reload = (done) => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series("scripts"));
  gulp.watch("source/*.html", gulp.series(html, reload));
};
exports.default = gulp.series(styles, server, watcher);

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
    build,
    server,
    watcher
  );
