require( "babel-polyfill" );

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import rimraf from 'rimraf';
import runSequence from 'run-sequence';
import electronPrebuilt from 'electron-prebuilt';
import childProcess from 'child_process';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.js';
import packageJson from './package.json'

const $ = gulpLoadPlugins();
const DESTINATION_DIR_PATH = './dest/';
const DISTRIBUTION_DIR_PATH = './dist/';

let debug = false;

gulp.task( 'run:dest', ()=> {
  childProcess.spawn( electronPrebuilt, [DESTINATION_DIR_PATH] );
} );

gulp.task( 'compile:main', ()=> {
  return gulp.src( 'src/**/main.js' )
      .pipe( $.sourcemaps.init() )
      .pipe( $.babel() )
      .pipe( $.sourcemaps.write( '.' ) )
      .pipe( gulp.dest( DESTINATION_DIR_PATH ) )
} );

gulp.task( 'debug', function () {
  debug = true;
  runSequence(
      'clean:dest',
      ['copy:package.json', 'copy:otherFiles', 'webpack:app.js', 'compile:main'],
      'run:dest'
  );
} );

gulp.task( 'build', function () {
  const buildTaskName = (process.platform.toString().match( 'win32' )) ? 'electron-build-win' : 'electron-build-mac';
  runSequence(
      'clean:dest',
      ['copy:package.json', 'copy:otherFiles', 'webpack:app.js', 'compile:main'],
      buildTaskName,
      'clean:dest'
  );
} );

gulp.task( 'clean:dest', ( cb )=> {
  rimraf( DESTINATION_DIR_PATH, cb );
} );

gulp.task( 'copy:package.json', function () {
  return gulp.src( 'package.json' )
      .pipe( $.edit( function ( src, cb ) {
        var err = null;
        var json = JSON.parse( src );
        json['devDependencies'] = undefined;
        json['config'] = undefined;
        json['scripts'] = undefined;
        cb( err, JSON.stringify( json, '', '  ' ) )
      } ) )
      .pipe( gulp.dest( DESTINATION_DIR_PATH ) );
} );

gulp.task( 'copy:otherFiles', function () {
  return gulp.src( ['src/css/**', 'src/fonts/**', 'src/html/**'], {base: 'src'} )
      .pipe( gulp.dest( DESTINATION_DIR_PATH ) );
} );

gulp.task( 'webpack:app.js', function () {
  if (debug) {
    webpackConfig.devtool = '#source-map';
  }
  return gulp.src( './' )
      .pipe( webpack( webpackConfig ) )
      .pipe( gulp.dest( DESTINATION_DIR_PATH + 'js/renderer/' ) );
} );

gulp.task( 'electron-build-mac', function () {
  return gulp.src( './dest/**' )
      .pipe( $.atomElectron( {
        version   : '0.36.7',
        platform  : 'darwin',
        darwinIcon: './src/icons/DirPicker.icns'
      } ) )
      .pipe( $.vinylZip.dest( DISTRIBUTION_DIR_PATH + packageJson.name + '_mac.zip' ) )
} );

gulp.task( 'electron-build-win', function () {
  return gulp.src( './dest/**' )
      .pipe( $.atomElectron( {
        version    : '0.36.7',
        platform   : 'win32',
        arch       : 'ia32',
        winIcon    : './src/icons/DirPicker.ico',
        companyName: 'SweetberryStudio',
        copyright  : '(C) 2015 SweetberryStudio'
      } ) )
      .pipe( $.vinylZip.dest( DISTRIBUTION_DIR_PATH + packageJson.name + '_win32.zip' ) );
} );
