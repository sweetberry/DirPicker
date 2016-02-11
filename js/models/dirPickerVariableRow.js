"use strict";

const _ = require( 'underscore' );
const Backbone = require( 'backbone' );
//require( 'backbone-event-logger' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Model}
 */
const ModelsDirPickerVariableRow = Backbone.Model.extend( {
  defaults  : {
    "label": '',
    "val"  : ''
  },
  initialize: function ( attributes ) {
    //this.debugEvents('ModelsVariableRow');
  }
} );
_.extend( ModelsDirPickerVariableRow.prototype, require( './mixin' ) );

module.exports = ModelsDirPickerVariableRow;
