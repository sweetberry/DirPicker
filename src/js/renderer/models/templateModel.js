"use strict";

import BaseModel from './baseModel';

/**
 * Templateを表すモデル。
 */
export default class TemplateModel extends BaseModel {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //eventsLoggerを有効化
    // this.debugEvents( 'ModelsTemplate' );

    // noinspection JSCheckFunctionSignatures
    this.set( 'name', this.makeUniqueName( (attr && attr.name) || this.defaults.name ) );
  }

  //noinspection JSMethodCanBeStatic
  /**
   *
   * @returns {{name: '名称未設定テンプレート', path: '/path/to/your/<favorite>/thing'}}
   */
  get defaults () {
    return {
      "name": '名称未設定テンプレート',
      "path": '/path/to/your/<favorite>/thing'
    }
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
