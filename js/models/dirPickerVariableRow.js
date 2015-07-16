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
var ModelsDirPickerVariableRow = Backbone.Model.extend( {
  defaults: {
    "label": '',
    "val": ''
  },
  initialize: function ( attributes ) {
    //this.debugEvents('ModelsVariableRow');
  }
} );
_.extend( ModelsDirPickerVariableRow.prototype, require( './mixin' ) );

module.exports = ModelsDirPickerVariableRow;
