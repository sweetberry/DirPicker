"use strict";

import _ from 'underscore';
import DIR_PICKER_SETTING_VARIABLE_TEMPLATE from '../templates/dirPickerSettingVariables.html';
import DirPickerSettingVariableView from './dirPickerSettingVariable'
import variablesCollection from '../collections/dirPickerVariables';
import {CompositeView} from 'backbone.marionette';

export default class DirPickerSettingVariablesView extends CompositeView.extend( {
  collection        : variablesCollection,
  childView         : DirPickerSettingVariableView,
  template          : DIR_PICKER_SETTING_VARIABLE_TEMPLATE,
  className         : "",
  childViewContainer: '.js-variable-list-container',
  reorderOnSort     : true,
  ui                : {
    childViewContainer: '.js-variable-list-container',
    addBtn            : '.js-variable-add-btn',
    handle            : '.js-variable-handle',
    badge             : '.js-variable-num-badge'
  },
  events            : {
    'click @ui.addBtn'     : 'onClickAddBtn',
    'mouseenter @ui.handle': 'sortStart',
    'mouseleave @ui.handle': 'sortDestroy'
  },
  collectionEvents  : {
    'add'   : 'badgeUpdate',
    'remove': 'badgeUpdate'
  }
} ) {
  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @returns {{getVariablesCount: getVariablesCount}}
   */
  templateHelpers () {
    return {
      getVariablesCount: ()=> {
        return this.collection.length;
      }
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  onBeforeDestroy () {
    this.sortDestroy();
  }

  /**
   * 変数追加
   */
  onClickAddBtn () {
    this.collection.create( {}, {wait: true} );
  }

  /**
   * 並び替え機能を有効にします。
   */
  sortStart () {
    this.ui.childViewContainer.sortable( {
      forcePlaceholderSize: true,
      //placeholderClass: 'col-lg-4 col-md-6',
      handle              : '.js-variable-handle'
    } ).bind( 'sortupdate', ()=> {
      this.updateItemSortIndex( this.ui.childViewContainer.find( '.js-variable-model-id' ) );
    } );
  }

  /**
   * 並び替え機能を無効にします。
   */
  sortDestroy () {
    if (this.ui.childViewContainer.sortable) {
      this.ui.childViewContainer.sortable( 'destroy' );
    }
  }

  /**
   * 並び替えの結果をデータに反映します。
   * @param {node[]} elements data-model-idの指定があるエレメントの配列
   */
  updateItemSortIndex ( elements ) {
    _.each( elements, ( element, index )=> {
      this.collection.get( element.dataset.modelId ).save( 'sort', index );
    } );
  }

  /**
   * バッジの数字だけ更新
   */
  badgeUpdate () {
    this.ui.badge.text( this.collection.length );
  }
}
