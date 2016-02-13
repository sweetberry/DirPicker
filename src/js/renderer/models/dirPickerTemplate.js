"use strict";

import DirPickerModelBase from './dirPickerModelBase';

/**
 * Templateを表すモデル。
 */
export default class DirPickerTemplate extends DirPickerModelBase {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );
  }

  //noinspection JSMethodCanBeStatic
  /**
   *
   * @returns {{name: string, path: string}}
   */
  get defaults () {
    return {
      "name": '名称未設定テンプレート',
      "path": "/path/to/your/favorite/thing"
    }
  }

  //noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols
  /**
   *
   * @param {object} [attr]
   * @param {object} [options]
   */
  initialize ( attr, options ) {
    this.debugEvents( 'ModelsTemplate' );
    this.set( 'name', this.makeUniqueName( (attr && attr.name) || this.defaults.name ) );
  }

  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  /**
   *
   * @param {object} attrs
   * @returns {boolean}
   */
  validate ( attrs ) {
    return !attrs.path || !attrs.name
  }
}
