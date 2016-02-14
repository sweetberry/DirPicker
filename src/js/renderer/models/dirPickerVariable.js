"use strict";

import _ from 'underscore';
import DirPickerModelBase from './dirPickerModelBase';
import VariableListCollection from '../collections/dirPickerVariableList';

/**
 * 定義済み変数を表すモデル
 */
export default class DirPickerVariable extends DirPickerModelBase {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //eventsLoggerを有効化
    this.debugEvents( 'ModelsVariable' );

    this.set( 'name', this.makeUniqueName( (attr && attr.name) || this.defaults.name ) );
    this.set( 'list', (attr && attr.list) || this.defaults.list );

    /**
     * @type {DirPickerVariableList}
     */
    this.listCollection = new VariableListCollection( this.get( 'list' ) );
    this.listCollection.on( 'change', ()=> {
      this.updateList();
    } );
    this.listCollection.on( 'add remove', ()=> {
      this.trigger( 'badgeUpdate' );
      this.updateList();
    } );

    this.on( 'destroy', ()=> {
      this.listCollection.off();
    } );
  }

  //noinspection JSMethodCanBeStatic
  /**
   *
   * @returns {{name: '名称未設変数', list: Array}}
   */
  get defaults () {
    return {
      "name": '名称未設変数',
      "list": []
    }
  }

  /**
   *
   */
  updateList () {
    this.save( 'list', _.map( this.listCollection.sort( {silent: true} ).toJSON(), ( listRow )=> {
      return _.pick( listRow, 'label', 'val' );
    } ), {wait: true, silent: true} );
  }
}
