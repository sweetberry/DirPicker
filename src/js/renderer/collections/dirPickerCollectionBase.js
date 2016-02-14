"use strict";

import {Collection} from 'backbone';
const _ = require( 'underscore' );
import 'backbone-event-logger';

/**
 * Collectionの雛形。mixinがうまく書けなかったのでbaseClassを定義しています。
 */
export default class DirPickerCollectionBase extends Collection {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    /**
     * ここに文字列が入るとeventLoggerが有効になります。
     * @type {string}
     */
    this.debugEvents = undefined;
  }

  /**
   * @param {string} name
   * @returns {boolean}
   */
  isUniqueName ( name ) {
    return !_.find( this.models, ( model )=> {
      return model.get( 'name' ) == name;
    } );
  }
}
