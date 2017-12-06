"use strict";

import BaseModel from './baseModel';

/**
 * リスト型変数の各項目を表すモデル
 */
export default class VariableRowModel extends BaseModel {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //eventsLoggerを有効化
    // this.debugEvents( 'ModelsVariableRow' );
  }

  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  /**
   *
   * @returns {{label: '', val: ''}}
   */
  get defaults () {
    return {
      "label": '',
      "val"  : ''
    }
  }

}
