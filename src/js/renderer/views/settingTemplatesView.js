"use strict";

import _ from 'underscore'
import SETTING_TEMPLATES_TEMPLATE from '../templates/settingTemplates.html'
import SettingTemplateRowView from './settingTemplateRowView'
import templatesCollection from '../collections/templatesCollection'
// noinspection JSUnresolvedVariable
import {CompositeView} from 'backbone.marionette';

/**
 * setting画面のtemplateリストを扱うviewです。
 */
export default class SettingTemplatesView extends CompositeView.extend( {
  collection        : templatesCollection,
  childView         : SettingTemplateRowView,
  template          : SETTING_TEMPLATES_TEMPLATE,
  className         : "",
  childViewContainer: '.js-template-table-container',
  reorderOnSort     : true,
  ui                : {
    childViewContainer    : '.js-template-table-container',
    addBtn                : '.js-template-add-btn',
    handle                : '.js-template-handle',
    badge                 : '.js-template-num-badge',
    openTemplatesFolderBtn: '.js-open-templates-folder-btn',
    importTemplatesBtn    : '.js-templates-import-btn',
    ExportTemplatesBtn    : '.js-templates-export-btn',
  },
  events            : {
    'click @ui.addBtn'                : 'onAddClick',
    'click @ui.openTemplatesFolderBtn': 'onClickOpenTemplatesFolderBtn',
    'click @ui.importTemplatesBtn'    : 'onClickImportTemplatesBtn',
    'click @ui.ExportTemplatesBtn'    : 'onClickExportTemplatesBtn',
    'mouseenter @ui.handle'           : 'sortStart',
    'mouseleave @ui.handle'           : 'sortDestroy'
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
    //noinspection JSUnusedGlobalSymbols,JSValidateTypes
    return {
      getTemplatesCount: () => {
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
    } ).bind( 'sortupdate', () => {
      this.updateItemSortIndex( this.ui.childViewContainer.find( '.js-template-model-id' ) );
    } ).bind( 'sortstart', ( e, ui ) => {
      ui.item.css( 'display', 'block' )
    } ).bind( 'sortstop', ( e, ui ) => {
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
    _.each( elements, ( element, index ) => {
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

  onClickImportTemplatesBtn () {
    this.collection.importTemplates();
  }

  onClickExportTemplatesBtn () {
    this.collection.exportTemplates();
  }

  // noinspection JSMethodCanBeStatic
  onClickOpenTemplatesFolderBtn () {
    this.collection.openTemplatesFolder();
  }
}