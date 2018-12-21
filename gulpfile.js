'use strict'

const liveEnv = process.argv.indexOf('--live') !== -1

let gulp = require('gulp')
let scss = require('gulp-sass')
let sourcemaps = require('gulp-sourcemaps')
let babel = require('gulp-babel')
let concat = require('gulp-concat')
let plumber = require('gulp-plumber')
let imagemin = require('gulp-imagemin')
let gif = require('gulp-if')
let autoprefixer = require('gulp-autoprefixer')
let cleanCSS = require('gulp-clean-css')
let uglify = require('gulp-uglify')

let SASS_INCLUDE_PATHS = [
  './node_modules/normalize-scss/sass/'
]

let LIB_JS_INCLUDE_PATHS = [
  './node_modules/jquery/dist/jquery.min.js'
]

let gSrc = {
  css: [
    './src/sass/**/*.scss'
  ],
  js: [
    './src/js/*.js'
  ],
  images: [
    './src/img/**/*.{gif,jpg,png,svg,ico}'
  ],
  fonts: [
    './src/fonts/**/*.{eot,svg,ttf,woff,woff2}'
  ]
}

let gDist = {
  css: './assets/css',
  js: './assets/js',
  images: './assets/img',
  fonts: './assets/fonts'
}

function handleError (err) {
  console.log(err.toString())
  this.emit('end')
}

gulp.task('css', function () {
  return gulp.src(gSrc.css)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(gif(!liveEnv, sourcemaps.init()))
    .pipe(scss({includePaths: SASS_INCLUDE_PATHS}))
    .pipe(autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}))
    .pipe(cleanCSS())
    .pipe(gif(!liveEnv, sourcemaps.write()))
    .pipe(gulp.dest(gDist.css))
})

gulp.task('libs-js', function () {
  return gulp.src(LIB_JS_INCLUDE_PATHS)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(gif(!liveEnv, sourcemaps.init()))
    .pipe(babel({compact: true}))
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gif(!liveEnv, sourcemaps.write()))
    .pipe(gulp.dest(gDist.js))
})

gulp.task('js', function () {
  return gulp.src(gSrc.js)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(gif(!liveEnv, sourcemaps.init()))
    .pipe(babel({compact: true}))
    .pipe(concat('alternative.js'))
    .pipe(uglify())
    .pipe(gif(!liveEnv, sourcemaps.write()))
    .pipe(gulp.dest(gDist.js))
})

gulp.task('images', function () {
  return gulp.src(gSrc.images)
    .pipe(imagemin())
    .pipe(gulp.dest(gDist.images))
})

gulp.task('watch', ['css', 'js'], function () {
  gulp.watch(gSrc.css, ['css'])
  gulp.watch(gSrc.js, ['js'])
})

gulp.task('default', ['css', 'libs-js', 'js', 'images'], function () {

})