"use strict";

import DirPickerCollectionBase from './dirPickerCollectionBase'
// noinspection JSUnresolvedVariable
import {LocalStorage} from 'backbone.localstorage'
import VariableModel from '../models/dirPickerVariable'
// noinspection JSUnresolvedVariable
import {remote} from 'electron'
import path from 'path'
import fse from 'fs-extra';
import fs from 'fs';

import parse from 'csv-parse/lib/sync'

const USER_DATA_PATH = remote.app.getPath( 'userData' );
const VAR_FOLDER_PATH = path.join( USER_DATA_PATH, 'variables' );

/**
 * Variableを束ねるコレクション
 */
export class DirPickerVariables extends DirPickerCollectionBase {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //eventsLoggerを有効化
    // this.debugEvents( 'CollectionsVariables' );

    //noinspection JSUnusedGlobalSymbols
    /**
     * 永続先はlocalStorage、名前はdirPickerTemplatesCollection
     */
    this.localStorage = new LocalStorage( "dirPickerVariablesCollection" );

    /**
     *
     * @type {DirPickerVariable}
     */
    this.model = VariableModel;

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @type {string}
     */
    this.comparator = 'sort';
  }

  // noinspection JSMethodCanBeStatic
  openVariablesFolder () {
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    remote.shell.openItem( VAR_FOLDER_PATH );
  }

  // noinspection JSMethodCanBeStatic
  importVariables () {
    importVariables();
  }
}

function ensureDefaultVariables () {
  // console.log( remote.app.getAppPath() );
  try {
    // noinspection JSUnresolvedFunction
    fse.statSync( VAR_FOLDER_PATH );
  } catch (e) {
    // noinspection JSUnresolvedFunction
    fse.copySync( path.join( remote.app.getAppPath(), 'variables' ), VAR_FOLDER_PATH );
  }
}

function importVariables () {
  // console.log( dirPickerVariablesCollection.length );
  const files = fs.readdirSync( VAR_FOLDER_PATH );
  files.forEach( ( filename ) => {
    const input = fs.readFileSync( path.join( VAR_FOLDER_PATH, filename ) );
    const data = parse( input, {relax_column_count: true} );
    const dataObjList = data.map( ( row ) => {
      const label = (row.length > 1) ? row[1] : row[0];
      const val = row[0];
      return {val: val, label: label};
    } );
    const variableName = path.basename( filename, path.extname( filename ) );
    // console.log( `filename:: ${filename}` );
    // console.log( dataObjList );
    // console.log( `variableName:: ${variableName}` );

    let targetVariable = dirPickerVariablesCollection.find( {name: variableName} );
    // console.log( `targetVariable:: ${targetVariable}` );

    // 同名variableは一旦削除
    if (targetVariable) {
      // console.log( `remove:${targetVariable.get( 'name' )}` );
      targetVariable.destroy();
      // console.log( dirPickerVariablesCollection.length );
    }
    dirPickerVariablesCollection.create( {name: variableName, list: dataObjList}, {wait: true} );
    // console.log( `create:${variableName}` );
    // console.log( dirPickerVariablesCollection.length );
  } );
}

// 起動時に一度実行します
ensureDefaultVariables();

const dirPickerVariablesCollection = new DirPickerVariables();
dirPickerVariablesCollection.fetch();
export default dirPickerVariablesCollection;
