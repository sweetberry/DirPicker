var _ = require( 'underscore' );
var jQuery = $ = require( 'jquery' );
var Backbone = require( 'backbone' );
Backbone.$ = jQuery;
Backbone.LocalStorage = require( "backbone.localstorage" );
//require( '../vender/backbone.debug' );

var VariableRowModel = require( '../models/dirPickerVariableRow' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Collection}
 */
var CollectionsDirPickerVariableList = Backbone.Collection.extend( {
  initialize: function () {
    //this.debugEvents('CollectionsVariableList');
  },
  model: VariableRowModel,
  comparator: 'sort'
} );
_.extend( CollectionsDirPickerVariableList.prototype, require( './mixin' ) );

module.exports = CollectionsDirPickerVariableList;
