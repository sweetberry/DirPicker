"use strict";

import _ from 'underscore';
import open from 'open';
import DirPickerModelBase from './dirPickerModelBase';
import command from '../common/commands';
import BackboneLocalStorage from 'backbone.localstorage';
import templates from  '../collections/dirPickerTemplates';
import variables from  '../collections/dirPickerVariables';

/**
 * appの状態を保持するモデル
 */
export class DirPickerAppState extends DirPickerModelBase {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );
    //noinspection JSUnusedGlobalSymbols
    this.localStorage = new BackboneLocalStorage( "dirPickerAppState" );
  }

  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  /**
   *
   * @returns {{template: string, values: {name:string, value:string}}}
   */
  get defaults () {
    return {
      template: undefined,
      values  : {}
    }
  }

  //noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedGlobalSymbols
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

  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
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

  /**
   *
   * @returns {DirPickerTemplate}
   */
  getTemplate () {
    const dstTemplate = templates.findWhere( {name: this.get( 'template' )} );
    return dstTemplate || templates.at( 0 ) || templates.create( {}, {wait: true} );
  }

  //noinspection JSMethodCanBeStatic
  /**
   *
   * @returns {{name:string,path:string}[]}
   */
  getTemplates () {
    //noinspection JSUnresolvedFunction
    let dstTemplates = templates.toJSON();
    if (!dstTemplates.length) {
      templates.create( {}, {wait: true} );
      dstTemplates = templates.toJSON();
    }
    return dstTemplates;
  }

  /**
   *
   * @returns {string}
   */
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

  /**
   *
   * @param {string} name
   * @param {string} val
   */
  setValue ( name, val ) {
    //console.log( {name: name, val: val} );
    const values = this.get( 'values' );
    values[name] = val;
    this.set( 'values', values, {silent: true} );
  }

  /**
   *
   * @param {string} targetPath
   */
  openPath ( targetPath ) {
    open( targetPath || this.getEvaluatedPath().path );
  }

  /**
   *
   */
  createPath () {
    command.createDirectory( this.getEvaluatedPath().path );
  }

  /**
   *
   */
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

const dirPickerAppState = new DirPickerAppState( {id: 0} );
dirPickerAppState.fetch();
dirPickerAppState.save();
export default dirPickerAppState;