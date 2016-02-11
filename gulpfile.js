var gulp = require( 'gulp' );
var edit = require( 'gulp-edit' );
var rimraf = require( 'rimraf' );
var webpack = require( 'webpack-stream' );
var webpackConfig = require( './webpack.config.js' );
var destDirPath = './dest/';
var electron = require( 'gulp-atom-electron' );
var zip = require( 'gulp-vinyl-zip' );
var runSequence = require( 'run-sequence' );
var electronPrebuilt = require( 'electron-prebuilt' );
var childProcess = require( 'child_process' );
var debug = false;
var packageJson = require( './package.json' );

gulp.task( 'debug', function () {
  debug = true;
  runSequence(
      'clean-dest',
      ['copy-package.json', 'copy-otherFiles', 'webpack-build'],
      function () {
        childProcess.spawn( electronPrebuilt, ['./dest'] );
      }
  );

} );

gulp.task( 'build-osx', function () {
  runSequence(
      'clean-dest',
      ['copy-package.json', 'copy-otherFiles', 'webpack-build'],
      'electron-build-mac',
      'clean-dest'
  );
} );

gulp.task( 'build-win', function () {
  runSequence(
      'clean-dest',
      ['copy-package.json', 'copy-otherFiles', 'webpack-build'],
      'electron-build-win',
      'clean-dest'
  );
} );

gulp.task( 'clean-dest', function ( callback ) {
  rimraf( destDirPath, callback );
} );

gulp.task( 'copy-package.json', function () {
  return gulp.src( 'package.json' )
      .pipe( edit( function ( src, cb ) {
        var err = null;
        var json = JSON.parse( src );
        json['devDependencies'] = undefined;
        json['config'] = undefined;
        cb( err, JSON.stringify( json, '', '  ' ) )
      } ) )
      .pipe( gulp.dest( destDirPath ) );
} );

gulp.task( 'copy-otherFiles', function () {
  return gulp.src(
      ['main.js', 'index.html', 'css/**', 'fonts/**'],
      {base: './'} )
      .pipe( gulp.dest( destDirPath ) );
} );

gulp.task( 'webpack-build', function () {
  if (debug) {
    webpackConfig.devtool = 'inline-source-map';
  }

  return gulp.src( './' )
      .pipe( webpack( webpackConfig ) )
      .pipe( gulp.dest( destDirPath ) );
} );

gulp.task( 'electron-build-mac', function () {
  return gulp.src( './dest/**' )
      .pipe( electron( {
        version   : '0.36.7',
        platform  : 'darwin',
        darwinIcon: './icons/DirPicker.icns'
      } ) )
      .pipe( zip.dest( 'dist/' + packageJson.name + '_mac.zip' ) )
} );

gulp.task( 'electron-build-win', function () {
  return gulp.src( './dest/**' )
      .pipe( electron( {
        version    : '0.36.7',
        platform   : 'win32',
        arch       : 'ia32',
        winIcon    : './icons/DirPicker.ico',
        companyName: 'SweetberryStudio',
        copyright  : '(C) 2015 SweetberryStudio'
      } ) )
      .pipe( zip.dest( 'dist/' + packageJson.name + '_win32.zip' ) );
} );
