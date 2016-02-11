"use strict";
const BrowserWindow = require( 'browser-window' );  // Module to create native browser window.

// Report crashes to our server.
require( 'crash-reporter' ).start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

const app = require( 'app' );  // Module to control application life.
const dialog = require( 'dialog' );
const ipcMain = require( 'electron' ).ipcMain;


// エラー表示後終了
ipcMain.on( 'error-message', function ( event, arg ) {
  dialog.showErrorBox( "Error", arg );
  event.returnValue = true;
} );

const presetSettingJsonPath = require( "path" ).join( app.getPath( 'desktop' ), "dirPickerSetting.json" );
ipcMain.on( 'get-setting-file-save-path', function ( event, defaultPath ) {
  dialog.showSaveDialog( {
    title      : "設定ファイルの保存先を指定してください",
    defaultPath: defaultPath || presetSettingJsonPath
  }, function ( res ) {
    event.returnValue = res || false;
  } );
} );

ipcMain.on( 'get-setting-file-load-path', function ( event, defaultPath ) {
  dialog.showOpenDialog( {
    title      : "設定ファイルを選択してください",
    defaultPath: defaultPath || presetSettingJsonPath,
    filters    : [
      {name: 'Custom File Type', extensions: ['json']}
    ]
  }, function ( res ) {
    event.returnValue = res || false;
  } );
} );

// Quit when all windows are closed.
app.on( 'window-all-closed', function () {
  app.quit();
} );

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on( 'ready', function () {

  // Create the browser window.
  mainWindow = new BrowserWindow( {
    width : 800,
    height: 600
  } );

  // and load the index.html of the app.
  mainWindow.loadUrl( 'file://' + __dirname + '/index.html' );

  // Emitted when the window is closed.
  mainWindow.on( 'closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  } );

} );
