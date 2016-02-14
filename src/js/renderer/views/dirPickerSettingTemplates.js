"use strict";

import _ from 'underscore';
import DIR_PICKER_SETTING_TEMPLATES_TEMPLATE from '../templates/dirPickerSettingTemplates.html';
import ChildView from './dirPickerSettingTemplateRow'
import templatesCollection from '../collections/dirPickerTemplates'
import {CompositeView} from 'backbone.marionette';

/**
 * setting画面のtemplateリストを扱うviewです。
 */
export default class DirPickerSettingTemplatesView extends CompositeView.extend( {
  collection        : templatesCollection,
  childView         : ChildView,
  template          : DIR_PICKER_SETTING_TEMPLATES_TEMPLATE,
  className         : "",
  childViewContainer: '.js-template-table-container',
  reorderOnSort     : true,
  ui                : {
    childViewContainer: '.js-template-table-container',
    addBtn            : '.js-template-add-btn',
    handle            : '.js-template-handle',
    badge             : '.js-template-num-badge'
  },
  events            : {
    'click @ui.addBtn'     : 'onAddClick',
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
   * @returns {{getTemplatesCount: getTemplatesCount}}
   */
  templateHelpers () {
    //noinspection JSUnusedGlobalSymbols
    return {
      getTemplatesCount: ()=> {
        return this.collection.length;
      }
    }
  }

  /**
   * 並び替え機能を有効にします。
   */
  sortStart () {
    this.ui.childViewContainer.sortable( {
      forcePlaceholderSize: true,
      items               : 'tr',
      handle              : '.js-template-handle'
    } ).bind( 'sortupdate', ()=> {
      this.updateItemSortIndex( this.ui.childViewContainer.find( '.js-template-model-id' ) );
    } ).bind( 'sortstart', ( e, ui )=> {
      ui.item.css( 'display', 'block' )
    } ).bind( 'sortstop', ( e, ui )=> {
      ui.item.css( 'display', '' )
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

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  onBeforeDestroy () {
    this.sortDestroy();
  }

  /**
   * templateを追加
   */
  onAddClick () {
    this.collection.create( {}, {wait: true} );
  }

  /**
   * 並び替えの結果をデータに反映します。
   * @param {node[]} elements data-model-idの指定があるエレメントの配列
   */
  updateItemSortIndex ( elements ) {
    _.each( elements, ( element, index )=> {
      //noinspection JSUnresolvedVariable
      this.collection.get( element.dataset.modelId ).save( 'sort', index );
    } );
    this.collection.sort();
  }

  /**
   * バッジの数字だけ更新
   */
  badgeUpdate () {
    this.ui.badge.text( this.collection.length );
  }

}
