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

  //noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols
  /**
   *
   * @param {object} [attr]
   * @param {object} [options]
   */
  initialize ( attr, options ) {
    this.debugEvents( 'CollectionsVariableList' );
  }

}
