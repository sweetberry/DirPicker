"use strict";

import _ from 'underscore';
import open from 'open';
import {Model} from 'backbone'
import command from '../commands/commands';
import 'backbone-event-logger';
import BackboneLocalStorage from 'backbone.localstorage';
import templates from  '../collections/dirPickerTemplates';
import variables from  '../collections/dirPickerVariables';

export default class ModelsDirPickerAppState extends Model {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );
    this.localStorage = new BackboneLocalStorage( "dirPickerAppState" );
  }

  //noinspection JSMethodCanBeStatic
  get defaults () {
    return {
      template: undefined,
      values  : {}//{name<string>:, value:<string>}
    }
  }

  //noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols
  /**
   *
   * @param {object} [attr]
   * @param {object} [options]
   */
  initialize ( attr, options ) {
    this.debugEvents( 'ModelsAppState' );
    templates.on( 'add remove change', ()=> {
      this.trigger( 'change' );
    } );
    variables.on( 'add remove change', ()=> {
      this.trigger( 'change' );
    } );
  }

  //noinspection JSMethodCanBeStatic
  /**
   *
   * @param {object} attr
   * @returns {?string}
   */
  validate ( attr ) {
    if (attr.template && !templates.findWhere( {name: attr.template} )) {
      alert( "No template!" );
      return "No template!";
    }
  }

  getTemplate () {
    const dstTemplate = templates.findWhere( {name: this.get( 'template' )} );
    return dstTemplate || templates.at( 0 ) || templates.create( {}, {wait: true} );
  }

  //noinspection JSMethodCanBeStatic
  getTemplates () {
    //noinspection JSUnresolvedFunction
    let dstTemplates = templates.toJSON();
    if (!dstTemplates.length) {
      templates.create( {}, {wait: true} );
      dstTemplates = templates.toJSON();
    }
    return dstTemplates;
  }

  getTemplatePath () {
    return this.getTemplate().get( 'path' );
  }

  /**
   *
   * @returns {string[]} パスに含まれる変数名のリスト
   */
  getUsedVariableNamesList () {
    const usedPath = this.getTemplatePath();
    if (!usedPath) {
      return [];
    } else {
      let tempArray = usedPath.match( /<[^<>]*>/g );
      tempArray = _.uniq( tempArray );
      tempArray = _.map( tempArray, ( string )=> {
        return string.replace( /[<>]/g, '' );
      } );
      return tempArray;
    }
  }

  /**
   *
   * @returns {{isExist: boolean, isFolder: boolean, path: string}}
   */
  getEvaluatedPath () {
    let templatePath = this.getTemplatePath();
    const usedVariableNamesList = this.getUsedVariableNamesList();
    const values = this.get( 'values' );
    _.each( usedVariableNamesList, ( varName )=> {
      if (values[varName]) {
        templatePath = templatePath.split( '<' + varName + '>' ).join( values[varName] || '' );
      }
    } );
    return command.getFolderStats( templatePath );
  }

  setValue ( name, val ) {
    //console.log( {name: name, val: val} );
    const values = this.get( 'values' );
    values[name] = val;
    this.set( 'values', values, {silent: true} );
  }

  openPath ( targetPath ) {
    open( targetPath || this.getEvaluatedPath().path );
  }

  createPath () {
    command.createDirectory( this.getEvaluatedPath().path );
  }

  clipPath () {
    command.writeClipboard( this.getEvaluatedPath().path );
  }

  /**
   * @returns {[{name: string, list: undefined|{label:string,val:string}[], value: string|undefined, uid: string}]}
   */
  getUsedVariablesList () {
    const values = this.get( 'values' );
    return _.map( this.getUsedVariableNamesList(), ( variableName, index )=> {
      const temp = _.find( variables.toJSON(), ( definedVariable )=> {
            return definedVariable.name == variableName;
          } ) || {name: variableName};
      temp.value = values[variableName];
      temp.uid = `variable-${index}`;
      return temp;
    } );
  }

}

_.extend( ModelsDirPickerAppState.prototype, require( './mixin' ) );
const appState = new ModelsDirPickerAppState( {id: 0} );
appState.fetch();
appState.save();
export default appState;