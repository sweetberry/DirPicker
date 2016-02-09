var _ = require( 'underscore' );
var jQuery = $ = require( 'jquery' );
var Backbone = require( 'backbone' );
Backbone.$ = jQuery;
//require( '../vender/backbone.debug' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Model}
 */
var ModelsDirPickerTemplate = Backbone.Model.extend( {
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
