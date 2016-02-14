"use strict";

import DirPickerModelBase from './dirPickerModelBase';

/**
 * リスト型変数の各項目を表すモデル
 */
export default class DirPickerVariableRow extends DirPickerModelBase {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );
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

  //noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
  /**
   *
   * @param {object} [attr]
   * @param {object} [options]
   */
  initialize ( attr, options ) {
    this.debugEvents( 'ModelsVariableRow' );
  }
}
