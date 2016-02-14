"use strict";

import _ from 'underscore';
import DIR_PICKER_SETTING_VARIABLE_TEMPLATE from '../templates/dirPickerSettingVariable.html';
import DirPickerSettingVariableRowView from  './dirPickerSettingVariableRow';
import {CompositeView} from 'backbone.marionette';
// import 'backbone-event-logger';

/**
 * setting画面のvariableを扱うviewです。
 */
export default class DirPickerSettingVariableView extends CompositeView.extend( {
  model             : undefined,//variableModel
  collection        : undefined,//variableModel.listCollection
  template          : DIR_PICKER_SETTING_VARIABLE_TEMPLATE,
  childView         : DirPickerSettingVariableRowView,
  childViewContainer: '.js-variable-row-list-container',
  className         : 'col-lg-4 col-md-6',
  reorderOnSort     : true,
  ui                : {
    name              : '.js-variable-name',
    nameInput         : '.js-variable-name-input',
    delBtn            : '.js-variable-del-btn',
    handle            : '.js-variable-handle',
    rowHandle         : '.js-variable-row-handle',
    childViewContainer: '.js-variable-row-list-container',
    addBtn            : '.js-variable-row-add-btn',
    closeBtn          : '.js-variable-row-list-close-btn',
    badge             : '.js-variable-list-num-badge',
    collapse          : '.collapse'
  },
  events            : {
    'click @ui.name'          : 'onClickName',
    'keyup @ui.nameInput'     : 'onKeyupNameInput',
    'focusout @ui.nameInput'  : 'changeNameInput',
    'click @ui.delBtn'        : 'onClickDelBtn',
    'click @ui.addBtn'        : 'onClickAddBtn',
    'click @ui.closeBtn'      : 'onClickCloseBtn',
    'mouseenter @ui.rowHandle': 'sortStart',
    'mouseleave @ui.rowHandle': 'sortDestroy'

  },
  modelEvents       : {
    'change:name': 'redrawName',
    'badgeUpdate': 'badgeUpdate'
  }
} ) {

  /**
   * @param {object} [options]
   */
  constructor ( options ) {
    super( options );
    // this.debugEvents('VariableView');

    /**
     * リスト型変数の項目リストCollection
     * @type {DirPickerVariableList}
     */
    this.collection = this.model.listCollection;
  }

  /**
   *
   */
  onRender () {
    this.ui.handle.tooltip();
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  onBeforeDestroy () {
    this.ui.handle.tooltip( 'destroy' );
    this.sortDestroy();
  }

  /**
   * inputに表示を切り替える
   */
  onClickName () {
    this.ui.name.addClass( 'hide' );
    this.ui.nameInput.removeClass( 'hide' );
    this.ui.nameInput.focus();
  }

  /**
   * 新規変数を追加します。
   */
  onClickAddBtn () {
    this.collection.add( {}, {wait: true} );
    this.ui.collapse.collapse( 'show' );
    this.onRender();
  }

  /**
   * 変数を削除します
   */
  onClickDelBtn () {
    this.model.destroy();
  }

  /**
   * タブを折りたたみます。
   */
  onClickCloseBtn () {
    this.ui.collapse.collapse( 'toggle' );
  }

  /**
   * enterの入力を監視します
   * @param {event} e
   */
  onKeyupNameInput ( e ) {
    if (e.which == 13) {
      this.ui.nameInput.blur();
    }
  }

  /**
   * バッジの数字だけ更新
   */
  badgeUpdate () {
    this.ui.badge.text( this.collection.length );
  }

  /**
   * 並び替え機能を有効にします。
   */
  sortStart () {
    this.ui.childViewContainer.sortable( {
      forcePlaceholderSize: true,
      handle              : '.js-variable-row-handle'
    } ).bind( 'sortupdate', ()=> {
      //console.log("variablesSort");
      this.updateItemSortIndex( this.ui.childViewContainer.find( '.js-variable-row-model-id' ) );
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
   * 名前部分を再描画
   */
  redrawName () {
    this.ui.name.html( _.escape( this.model.get( 'name' ) ) );
    this.ui.name.removeClass( 'hide' );
    this.ui.nameInput.addClass( 'hide' );
  }

  /**
   * inputの中身をデータに反映して名前部分を再描画
   */
  changeNameInput () {
    if (this.model.save( 'name', this.ui.nameInput.val(), {silent: false} )) {
      // saveが実行されなければ…(変更が無い、もしくはerror)
      this.redrawName();
    }
  }

  /**
   * 並び替えの結果をデータに反映します。
   * @param {node[]} elements data-model-idの指定があるエレメントの配列
   */
  updateItemSortIndex ( elements ) {
    _.each( elements, ( element, index )=> {
      this.collection.get( element.dataset.modelId ).set( 'sort', index, {silent: true} );
    } );
    this.model.updateList();
  }
}
