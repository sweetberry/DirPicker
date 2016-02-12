"use strict";

const _ = require( 'underscore' );
const Backbone = require( 'backbone' );
//require( 'backbone-event-logger' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Model}
 */
const ModelsDirPickerTemplate = Backbone.Model.extend( {
  initialize: function ( attributes ) {
    //this.debugEvents('ModelsTemplate');
    this.set( 'name', this.makeUniqueName( (attributes && attributes.name) || this.defaults.name ) );
  },
  defaults  : {
    "name": '名称未設定テンプレート',
    "path": "/path/to/your/favorite/thing"
  },
  validate  : function ( attrs ) {
    return !attrs.path || !attrs.name
  }
} );
_.extend( ModelsDirPickerTemplate.prototype, require( './mixin' ) );

module.exports = ModelsDirPickerTemplate;
