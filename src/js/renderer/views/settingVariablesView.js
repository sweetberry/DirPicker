"use strict";

import sortable from 'html5sortable';
import _ from 'underscore';
import SETTING_VARIABLE_TEMPLATE from '../templates/settingVariables.html'
import SettingVariableView from './settingVariableView'
import variablesCollection from '../collections/variablesCollection'
// noinspection JSUnresolvedVariable
import {CompositeView} from 'backbone.marionette'

export default class SettingVariablesView extends CompositeView.extend( {
  collection        : variablesCollection,
  childView         : SettingVariableView,
  template          : SETTING_VARIABLE_TEMPLATE,
  className         : "",
  childViewContainer: '.js-variable-list-container',
  reorderOnSort     : true,
  ui                : {
    childViewContainer    : '.js-variable-list-container',
    addBtn                : '.js-variable-add-btn',
    handle                : '.js-variable-handle',
    badge                 : '.js-variable-num-badge',
    openVariablesFolderBtn: '.js-open-variables-folder-btn',
    importVariablesBtn    : '.js-variables-import-btn',
    exportVariablesBtn    : '.js-variables-export-btn',
  },
  events            : {
    'click @ui.addBtn'                : 'onClickAddBtn',
    'click @ui.openVariablesFolderBtn': 'onClickOpenVariablesFolderBtn',
    'click @ui.importVariablesBtn'    : 'onClickImportVariablesBtn',
    'click @ui.exportVariablesBtn'    : 'onClickExportVariablesBtn',
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
   * @returns {{getVariablesCount: getVariablesCount}}
   */
  templateHelpers () {
    // noinspection JSValidateTypes
    return {
      getVariablesCount: () => {
        return this.collection.length;
      }
    }
  }

  onClickImportVariablesBtn () {
    this.collection.importVariables()
  }

  onClickExportVariablesBtn () {
    this.collection.exportVariables()
  }

  // noinspection JSMethodCanBeStatic
  onClickOpenVariablesFolderBtn () {
    this.collection.openVariablesFolder();
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
    const sortableDom = sortable( this.ui.childViewContainer, {
      forcePlaceholderSize: true,
      handle              : '.js-variable-handle'
    } );
    sortableDom[0].addEventListener( 'sortupdate', () => {
      this.updateItemSortIndex( this.ui.childViewContainer.find( '.js-variable-model-id' ) );
    } );
  }

  /**
   * 並び替え機能を無効にします。
   */
  sortDestroy () {
    sortable( this.ui.childViewContainer, 'destroy' );
  }

  /**
   * 並び替えの結果をデータに反映します。
   * @param {node[]} elements data-model-idの指定があるエレメントの配列
   */
  updateItemSortIndex ( elements ) {
    _.each( elements, ( element, index ) => {
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
