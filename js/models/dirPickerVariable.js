"use strict";

const _ = require( 'underscore' );
const Backbone = require( 'backbone' );
//require( 'backbone-event-logger' );

const VariableListCollection = require( '../collections/dirPickerVariableList' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Model}
 */
const ModelsDirPickerVariable = Backbone.Model.extend( {
  /**
   * @type {CollectionsDirPickerVariableList}
   */
  listCollection: undefined,
  defaults      : {
    "name": '名称未設変数',
    "list": []
  },
  initialize    : function ( attributes ) {
    //this.debugEvents('ModelsVariable');
    const _self = this;
    this.set( 'name', this.makeUniqueName( (attributes && attributes.name) || this.defaults.name ) );
    this.set( 'list', (attributes && attributes.list) || this.defaults.list );
    this.listCollection = new VariableListCollection( this.get( 'list' ) );
    this.listCollection.on( 'change', function () {
      _self.updateList();
    } );
    this.listCollection.on( 'add', function () {
      _self.trigger( 'badgeUpdate' );
      _self.updateList();
    } );
    this.listCollection.on( 'remove', function () {
      _self.trigger( 'badgeUpdate' );
      _self.updateList();
    } );
  },
  updateList    : function () {
    this.save( 'list', _.map( this.listCollection.sort( {silent: true} ).toJSON(), function ( listRow ) {
      return _.pick( listRow, 'label', 'val' );
    } ), {wait: true, silent: true} );
  }
} );
_.extend( ModelsDirPickerVariable.prototype, require( './mixin' ) );

module.exports = ModelsDirPickerVariable;
