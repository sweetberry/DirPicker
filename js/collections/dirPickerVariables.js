var _ = require( 'underscore' );
var jQuery = $ = require( 'jquery' );
var Backbone = require( 'backbone' );
Backbone.$ = jQuery;
Backbone.LocalStorage = require( "backbone.localstorage" );
//require( '../vender/backbone.debug' );

var VariableModel = require( '../models/dirPickerVariable' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Collection}
 */
var CollectionsDirPickerVariables = Backbone.Collection.extend( {
  localStorage: new Backbone.LocalStorage( "dirPickerVariablesCollection" ),
  model: VariableModel,
  comparator: 'sort',
  initialize: function () {
    //this.debugEvents('CollectionsVariables');
  }
} );
_.extend( CollectionsDirPickerVariables.prototype, require( './mixin' ) );

var variables = module.exports = new CollectionsDirPickerVariables();
variables.fetch();