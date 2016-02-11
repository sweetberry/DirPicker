"use strict";

const jQuery = $ = require( 'jquery' );
const Backbone = require( 'backbone' );
require( 'backbone.marionette' );
require( 'bootstrap' );
require( 'bootstrap-3-typeahead' );
require( 'html5sortable' );
require( './commands/setupMenu' );

const App = new Backbone.Marionette.Application();
App.addRegions( {
  headerRegion   : "#header",
  mainRegion     : "#main",
  templatesRegion: "#templatesCollection",
  variablesRegion: "#variablesCollection",
  footerRegion   : "#footer",
  hideRegion     : "#hide"
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

  //import, export ボタン実装。ベタ打ちです。
  var command = require( './commands/commands.js' );
  //noinspection JSUnusedLocalSymbols
  jQuery( ".js-export-btn" ).on( 'click', function ( e ) {
    command.saveSetting();
  } );
  //noinspection JSUnusedLocalSymbols
  jQuery( ".js-import-btn" ).on( 'click', function ( e ) {
    command.loadSetting();
  } );

  Backbone.history.start();
} );

App.start();
