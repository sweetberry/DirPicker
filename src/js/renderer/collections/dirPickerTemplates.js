"use strict";

const _ = require( 'underscore' );
const Backbone = require( 'backbone' );
Backbone.LocalStorage = require( "backbone.localstorage" );
//require( 'backbone-event-logger' );

const TemplateModel = require( '../models/dirPickerTemplate' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Collection}
 */
var CollectionsDirPickerTemplates = Backbone.Collection.extend( {
  localStorage: new Backbone.LocalStorage( "dirPickerTemplatesCollection" ),
  model       : TemplateModel,
  comparator  : 'sort',
  initialize  : function () {
    //this.debugEvents('CollectionsTemplates');
  }
} );
_.extend( CollectionsDirPickerTemplates.prototype, require( './mixin' ) );

var templates = module.exports = new CollectionsDirPickerTemplates();
templates.fetch();