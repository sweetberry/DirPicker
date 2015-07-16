var _ = require( 'underscore' );
var jQuery = $ = require( 'jquery' );
var Backbone = require( 'backbone' );
Backbone.$ = jQuery;
Backbone.LocalStorage = require( "backbone.localstorage" );
//require( '../vender/backbone.debug' );

var TemplateModel = require( '../models/dirPickerTemplate' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Collection}
 */
var CollectionsDirPickerTemplates = Backbone.Collection.extend( {
  localStorage: new Backbone.LocalStorage( "dirPickerTemplatesCollection" ),
  model: TemplateModel,
  comparator: 'sort',
  initialize: function () {
    //this.debugEvents('CollectionsTemplates');
  }
} );
_.extend( CollectionsDirPickerTemplates.prototype, require( './mixin' ) );

var templates = module.exports = new CollectionsDirPickerTemplates();
templates.fetch();