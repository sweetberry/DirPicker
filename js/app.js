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

//AppMenu定義
var remote = require( 'remote' );
var Menu = remote.require( 'menu' );
var template = [
  {
    label: 'Electron',
    submenu: [
      {
        label: 'About DirPicker',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Electron',
        accelerator: 'Command+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: function () { remote.getCurrentWindow().reload(); }
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function () { remote.getCurrentWindow().toggleDevTools(); }
      }
    ]
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      }
    ]
  },
  {
    label: 'Help',
    submenu: []
  }
];

menu = Menu.buildFromTemplate( template );

Menu.setApplicationMenu( menu );