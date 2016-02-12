"use strict";

const path = require( 'path' );
const open = require( 'open' );
const command = require( '../commands/commands.js' );

const _ = require( 'underscore' );
const Backbone = require( 'backbone' );
Backbone.LocalStorage = require( "backbone.localstorage" );
//require( 'backbone-event-logger' );

/**
 *
 * @type {CollectionsDirPickerTemplates}
 */
const templates = require( '../collections/dirPickerTemplates' );

/**
 *
 * @type {CollectionsDirPickerVariables}
 */
const variables = require( '../collections/dirPickerVariables' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Model}
 */
const ModelsDirPickerAppState = Backbone.Model.extend( {
  localStorage: new Backbone.LocalStorage( "dirPickerAppState" ),
  defaults    : {
    template: undefined,
    values  : {}//{name<string>:, value:<string>}
  },

  validate: function ( attributes ) {
    if (attributes.template && !templates.findWhere( {name: attributes.template} )) {
      alert( "No template!" );
      return "No template!";
    }
  },

  initialize: function () {
    //this.debugEvents('ModelsAppState');
    const _self = this;
    templates.on( 'add remove change', function () {
      _self.trigger( 'change' );
    } );
    variables.on( 'add remove change', function () {
      _self.trigger( 'change' );
    } );
  },

  getTemplate: function () {
    //noinspection JSUnresolvedFunction
    const dstTemplate = templates.findWhere( {name: this.get( 'template' )} );
    return dstTemplate || templates.at( 0 ) || templates.create( {}, {wait: true} );
  },

  getTemplates: function () {
    //noinspection JSUnresolvedFunction
    var dstTemplates = templates.toJSON();
    if (!dstTemplates.length) {
      templates.create( {}, {wait: true} );
      dstTemplates = templates.toJSON();
    }
    return dstTemplates;
  },

  getTemplatePath: function () {
    return this.getTemplate().get( 'path' );
  },

  /**
   * @returns {string[]} パスに含まれる変数名のリスト
   */
  getUsedVariableNamesList: function () {
    const usedPath = this.getTemplatePath();
    if (!usedPath) {
      return [];
    } else {
      var tempArray = usedPath.match( /<[^<>]*>/g );
      tempArray = _.uniq( tempArray );
      tempArray = _.map( tempArray, function ( string ) {
        return string.replace( /[<>]/g, '' );
      } );
      return tempArray;
    }
  },

  /**
   *
   * @returns {{isExist: boolean, isFolder: boolean, path: string}}
   */
  getEvaluatedPath: function () {
    var templatePath = this.getTemplatePath();
    const usedVariableNamesList = this.getUsedVariableNamesList();
    const values = this.get( 'values' );
    _.each( usedVariableNamesList, function ( varName ) {
      if (values[varName]) {
        templatePath = templatePath.split( '<' + varName + '>' ).join( values[varName] || '' );
      }
    } );
    return command.getFolderStats( templatePath );
  },

  setValue: function ( name, val ) {
    //console.log( {name: name, val: val} );
    const values = this.get( 'values' );
    values[name] = val;
    this.set( 'values', values, {silent: true} );
  },

  openPath: function () {
    open( this.getEvaluatedPath().path );
  },

  createPath: function () {
    var targetPath = this.getEvaluatedPath().path;
    command.createDirectory( targetPath );
  },

  clipPath: function () {
    command.writeClipboard( this.getEvaluatedPath().path );
  },

  /**
   * @returns {[{name: string, list: undefined|{label:string,val:string}[], value: string|undefined, uid: string}]}
   */
  getUsedVariablesList: function () {
    const values = this.get( 'values' );
    return _.map( this.getUsedVariableNamesList(), function ( variableName, index ) {
      var temp = _.find( variables.toJSON(), function ( definedVariable ) {
            return definedVariable.name == variableName;
          } ) || {name: variableName};
      temp.value = values[variableName];
      temp.uid = 'variable-' + index;
      return temp;
    } );
  }

} );

_.extend( ModelsDirPickerAppState.prototype, require( './mixin' ) );

const appState = module.exports = new ModelsDirPickerAppState( {id: 0} );
appState.fetch();
appState.save();
