"use strict";

import BaseCollection from './baseCollection';
import VariableRowModel from '../models/variableRowModel'

export default class VariableListCollection extends BaseCollection {

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
