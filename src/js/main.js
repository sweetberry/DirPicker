"use strict";

// import path from 'path';
// import electron from 'electron';
const electron = require( 'electron' );
const path = require( 'path' );
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const presetSettingJsonPath = path.join( app.getPath( 'desktop' ), "dirPickerSetting.json" );

let mainWindow = null;

ipcMain.on( 'error-message', ( event, arg )=> {
  dialog.showErrorBox( "Error", arg );
  event.returnValue = true;
} );

ipcMain.on( 'get-setting-file-save-path', ( event, defaultPath )=> {
  dialog.showSaveDialog( {
    title      : "設定ファイルの保存先を指定してください",
    defaultPath: defaultPath || presetSettingJsonPath
  }, ( res )=> {
    event.returnValue = res || false;
  } );
} );

ipcMain.on( 'get-setting-file-load-path', ( event, defaultPath )=> {
  dialog.showOpenDialog( {
    title      : "設定ファイルを選択してください",
    defaultPath: defaultPath || presetSettingJsonPath,
    filters    : [
      {name: 'Custom File Type', extensions: ['json']}
    ]
  }, ( res )=> {
    event.returnValue = res || false;
  } );
} );

app.on( 'window-all-closed', ()=> {
  app.quit();
} );

app.on( 'ready', ()=> {

  // Create the browser window.
  mainWindow = new BrowserWindow( {
    width : 800,
    height: 600
  } );

  // and load the index.html of the app.
  mainWindow.loadURL( `file://${__dirname}/../html/renderer/index.html` );

  // Emitted when the window is closed.
  mainWindow.on( 'closed', ()=> {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  } );

} );
