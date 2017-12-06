"use strict";

import DirPickerCollectionBase from './dirPickerCollectionBase'
// noinspection JSUnresolvedVariable
import {LocalStorage} from 'backbone.localstorage'
import VariableModel from '../models/dirPickerVariable'

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
}

const dirPickerVariablesCollection = new DirPickerVariables();
dirPickerVariablesCollection.fetch();
export default dirPickerVariablesCollection;
