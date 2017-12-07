"use strict";

import _ from 'underscore';
import stringify from 'csv-stringify/lib/sync'
import BaseModel from './baseModel';
import VariableListCollection from '../collections/variableListCollection';

/**
 * 定義済み変数を表すモデル
 */
export default class VariableModel extends BaseModel {

  /**
   * @param {object} [attr]
   * @param {object} [options]
   */
  constructor ( attr, options ) {
    super( attr, options );

    //eventsLoggerを有効化
    // this.debugEvents( 'ModelsVariable' );

    // noinspection JSCheckFunctionSignatures
    this.set( 'name', this.makeUniqueName( (attr && attr.name) || this.defaults.name ) );
    this.set( 'list', (attr && attr.list) || this.defaults.list );

    /**
     * @type {VariableListCollection}
     */
    this.listCollection = new VariableListCollection( this.get( 'list' ) );
    this.listCollection.on( 'change', () => {
      this.updateList();
    } );
    this.listCollection.on( 'add remove', () => {
      this.trigger( 'badgeUpdate' );
      this.updateList();
    } );

    this.on( 'destroy', () => {
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
    this.save( 'list', _.map( this.listCollection.sort( {silent: true} ).toJSON(), ( listRow ) => {
      return _.pick( listRow, 'label', 'val' );
    } ), {wait: true, silent: true} );
  }

  get csvString () {
    return stringify( this.toJSON().list.map( ( row ) => {return [row.val, row.label]} ) );
  }
}
