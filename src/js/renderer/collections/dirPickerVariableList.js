"use strict";

import DirPickerCollectionBase from './dirPickerCollectionBase';
import VariableRowModel from '../models/dirPickerVariableRow'

export default class DirPickerVariableList extends DirPickerCollectionBase {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //eventsLoggerを有効化
    // this.debugEvents( 'CollectionsVariableList' );

    /**
     *
     * @type {VariableRowModel}
     */
    this.model = VariableRowModel;

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @type {string}
     */
    this.comparator = 'sort'

  }

}
