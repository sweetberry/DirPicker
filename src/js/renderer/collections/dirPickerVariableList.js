"use strict";

const _ = require( 'underscore' );
const Backbone = require( 'backbone' );
Backbone.LocalStorage = require( "backbone.localstorage" );
//require( 'backbone-event-logger' );

const VariableRowModel = require( '../models/dirPickerVariableRow' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Collection}
 */
const CollectionsDirPickerVariableList = Backbone.Collection.extend( {
  initialize: function () {
    //this.debugEvents('CollectionsVariableList');
  },
  model     : VariableRowModel,
  comparator: 'sort'
} );
_.extend( CollectionsDirPickerVariableList.prototype, require( './mixin' ) );

module.exports = CollectionsDirPickerVariableList;
