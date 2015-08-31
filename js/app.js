
//AppMenu定義
var remote = require( 'remote' );
var Menu = remote.require( 'menu' );
var template = [
  {
    label: 'File',
    submenu: [
      //{
      //  label: 'About DirPicker',
      //  selector: 'orderFrontStandardAboutPanel:'
      //},
      //{
      //  type: 'separator'
      //},
      //{
      //  label: 'Services',
      //  submenu: []
      //},
      //{
      //  type: 'separator'
      //},
      {
        label: 'Hide',
        accelerator: 'CmdOrCtrl+H',
        click: function () { remote.getCurrentWindow().hide(); }
      },
      //{
      //  label: 'Hide Others',
      //  accelerator: 'Command+Shift+H',
      //  selector: 'hideOtherApplications:'
      //},
      //{
      //  label: 'Show All',
      //  selector: 'unhideAllApplications:'
      //},
      //{
      //  type: 'separator'
      //},
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: function () { remote.getCurrentWindow().close(); }
        //selector: 'terminate:'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: function () { remote.getCurrentWindow().webContents.undo(); }
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        click: function () { remote.getCurrentWindow().webContents.redo(); }
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: function () { remote.getCurrentWindow().webContents.cut(); }
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: function () { remote.getCurrentWindow().webContents.copy(); }
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: function () { remote.getCurrentWindow().webContents.paste(); }
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        click: function () { remote.getCurrentWindow().webContents.selectAll(); }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function () { remote.getCurrentWindow().reload(); }
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: function () { remote.getCurrentWindow().toggleDevTools(); }
      }
    ]
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        click: function () { remote.getCurrentWindow().minimize(); }
      },
      {
        label: 'Always On Top',
        click: function () {
          remote.getCurrentWindow().setAlwaysOnTop(true);//これで常に最前面
        }
      },
      {
        label: 'Cancel Always On Top',
        click: function () {
          remote.getCurrentWindow().setAlwaysOnTop(false);
        }
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click: function () { remote.getCurrentWindow().close(); }
      }
      //{
      //  type: 'separator'
      //},
      //{
      //  label: 'Bring All to Front',
      //  selector: 'arrangeInFront:'
      //}
    ]
  }
  //{
  //  label: 'Help',
  //  submenu: []
  //}
];

Menu.setApplicationMenu( Menu.buildFromTemplate( template ) );

var jQuery = $ = require( 'jquery' );
var _ = require( 'underscore' );

/**
 *
 * @type {Backbone}
 */
var Backbone = require( 'backbone' );

require( './vender/bootstrap3-typeahead.js' );

Backbone.$ = jQuery;

/**
 * @name Backbone.Marionette
 * @type {Marionette}
 */
require( 'backbone.marionette' );
require( 'bootstrap' );
require( './vender/jquery.sortable' );
var App = new Backbone.Marionette.Application();
App.addRegions( {
  headerRegion: "#header",
  mainRegion: "#main",
  templatesRegion: "#templatesCollection",
  variablesRegion: "#variablesCollection",
  footerRegion: "#footer",
  hideRegion: "#hide"
} );
App.on( "start", function () {

  var dirPicker = new (require( './views/dirPicker' ));
  App.mainRegion.show( dirPicker );
  //
  var templatesPref = new (require( './views/dirPickerSettingTemplates' ));
  App.templatesRegion.show( templatesPref );
  //
  var variablesPref = new (require( './views/dirPickerSettingVariables' ));
  App.variablesRegion.show( variablesPref );

  Backbone.history.start();
} );

App.start();
