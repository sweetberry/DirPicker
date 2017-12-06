"use strict";

import {Model} from 'backbone';
// import 'backbone-event-logger';

/**
 * Modelの雛形。mixinがうまく書けなかったのでbaseClassを定義しています。
 */
export default class BaseModel extends Model {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );
  }

  /**
   * @param {string} name
   * @returns {string} uniqueName
   */
  makeUniqueName ( name ) {
    let dstName = name;
    let tempName;
    if (this.collection && !this.collection.isUniqueName( name )) {
      let inc = 2;
      do {
        tempName = name + '_' + inc;
        inc++;
      } while (!this.collection.isUniqueName( tempName ));
      dstName = tempName;
    }
    return dstName;
  }
}
