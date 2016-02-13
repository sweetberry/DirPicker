"use strict";

import _ from 'underscore';
import open from 'open';
import DirPickerModelBase from './dirPickerModelBase';
import command from '../common/commands';
import BackboneLocalStorage from 'backbone.localstorage';
import templatesCollection from  '../collections/dirPickerTemplates';
import variablesCollection from  '../collections/dirPickerVariables';

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
    /**
     * 永続先はlocalStorage、名前はdirPickerAppState
     */
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
    templatesCollection.on( 'add remove change', ()=> {
      this.trigger( 'change' );
    } );
    variablesCollection.on( 'add remove change', ()=> {
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
    if (attr.template && !templatesCollection.findWhere( {name: attr.template} )) {
      alert( "No template!" );
      return "No template!";
    }
  }

  /**
   * 現在選択されているTemplateモデルを返します。
   * @returns {DirPickerTemplate}
   */
  getTemplate () {
    const dstTemplate = templatesCollection.findWhere( {name: this.get( 'template' )} );
    return dstTemplate || templatesCollection.at( 0 ) || templatesCollection.create( {}, {wait: true} );
  }

  //noinspection JSMethodCanBeStatic
  /**
   * TemplatesCollectionのtoJSON()を返します。
   * 要素数０なら新規に一つ作ってから返します。
   * @returns {{name: string, path: string}[]}
   */
  getTemplates () {
    //noinspection JSUnresolvedFunction
    let dstTemplates = templatesCollection.toJSON();
    if (!dstTemplates.length) {
      templatesCollection.create( {}, {wait: true} );
      dstTemplates = templatesCollection.toJSON();
    }
    return dstTemplates;
  }

  /**
   * 現在選択されているTemplateのpathを返します。
   * @returns {string}
   */
  getTemplatePath () {
    return this.getTemplate().get( 'path' );
  }

  /**
   * 現在選択されているTemplateのpathに含まれる変数名のリストを返します。
   * @returns {string[]}
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
   * 現在選択されているTemplateのpathを評価した結果を返します。
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
   * 定義された変数に値を入れます。
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
   * 現在選択されているTemplateのpathの場所をosで開きます。
   * 引数に指定があった場合はその場所を開きます。
   * @param {string} targetPath
   */
  openPath ( targetPath ) {
    open( targetPath || this.getEvaluatedPath().path );
  }

  /**
   * 現在選択されているTemplateのpathの場所を作成します。
   */
  createPath () {
    command.createDirectory( this.getEvaluatedPath().path );
  }

  /**
   * 現在選択されているTemplateのpathをクリップボードに書き込みます。
   */
  clipPath () {
    command.writeClipboard( this.getEvaluatedPath().path );
  }

  /**
   * 現在選択されているTemplateが使用する変数のリストを返します。
   * @returns {[{name: string, list: ?{label: string, val:string}[], value: ?string, uid: string}]}
   */
  getUsedVariablesList () {
    const values = this.get( 'values' );
    return _.map( this.getUsedVariableNamesList(), ( variableName, index )=> {
      const temp = _.find( variablesCollection.toJSON(), ( definedVariable )=> {
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