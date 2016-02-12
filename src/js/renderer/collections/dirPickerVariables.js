"use strict";

const _ = require( 'underscore' );
const Backbone = require( 'backbone' );
Backbone.LocalStorage = require( "backbone.localstorage" );
//require( 'backbone-event-logger' );

const VariableModel = require( '../models/dirPickerVariable' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Collection}
 */
const CollectionsDirPickerVariables = Backbone.Collection.extend( {
  localStorage: new Backbone.LocalStorage( "dirPickerVariablesCollection" ),
  model: VariableModel,
  comparator: 'sort',
  initialize: function () {
    //this.debugEvents('CollectionsVariables');
  }
} );
_.extend( CollectionsDirPickerVariables.prototype, require( './mixin' ) );

const variables = module.exports = new CollectionsDirPickerVariables();
variables.fetch();