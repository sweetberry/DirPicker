"use strict";

import _ from 'underscore'
import SETTING_TEMPLATE_ROW_TEMPLATE from '../templates/settingTemplateRow.html'
import variablesCollection from '../collections/variablesCollection'
// noinspection JSUnresolvedVariable
import {ItemView} from 'backbone.marionette'

export default class SettingTemplateRowView extends ItemView.extend( {
  model      : undefined,
  template   : SETTING_TEMPLATE_ROW_TEMPLATE,
  tagName    : 'tr',
  ui         : {
    name     : '.js-template-name',
    nameInput: '.js-template-name-input',
    path     : '.js-template-path',
    pathInput: '.js-template-path-input',
    delBtn   : '.js-template-del-btn',
    handle   : '.js-template-handle'
  },
  events     : {
    'click @ui.name'        : 'onClickName',
    'keyup @ui.nameInput'   : 'onKeyupNameInput',
    'focusout @ui.nameInput': 'changeNameInput',
    'click @ui.path'        : 'onClickPath',
    'keyup @ui.pathInput'   : 'onKeyupPathInput',
    'focusout @ui.pathInput': 'changePathInput',
    'click @ui.delBtn'      : 'onClickDelBtn'
  },
  modelEvents: {
    'change': 'render'
  }
} ) {

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   * @returns {{getColoredTemplatePath: getColoredTemplatePath}}
   */
  get templateHelpers () {
    const ESCAPED_TAG_REGEXP = /(&lt;.*?&gt;)/g;
    //noinspection JSUnusedGlobalSymbols,JSValidateTypes
    return {
      getColoredTemplatePath: () => {
        if (variablesCollection) {//設定済み変数がある場合
          const definedVariableNames = variablesCollection.pluck( 'name' );
          return _.escape( this.model.get( 'path' ) ).replace( ESCAPED_TAG_REGEXP, ( match ) => {
            if (_.find( definedVariableNames, ( definedVarName ) => {
                  return `&lt;${definedVarName}&gt;` === match;
                } )) {
              return `<span class='text-success'>${match}</span>`;
            } else {
              return `<span class='text-warning'>${match}</span>`;
            }
          } );
        }
        //設定済み変数がない場合
        return _.escape( this.model.get( 'path' ) ).replace( ESCAPED_TAG_REGEXP, "<span class='text-warning'>$1</span>" );
      }
    }
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  onRender () {
    this.ui.handle.tooltip( 'destroy' );
    this.ui.handle.tooltip();
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   *
   */
  onBeforeDestroy () {
    this.ui.handle.tooltip( 'destroy' );
  }

  /**
   * enterの入力を監視します
   * @param {event} e
   */
  onKeyupNameInput ( e ) {
    // noinspection JSUnresolvedVariable
    if (e.which === 13) {this.changeNameInput();}
  }

  /**
   * enterの入力を監視します
   */
  onKeyupPathInput (e) {
    // noinspection ES6ModulesDependencies
    if (e.which === 13) {this.changePathInput();}
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
   * inputに表示を切り替える
   */
  onClickPath () {
    this.ui.path.addClass( 'hide' );
    this.ui.pathInput.removeClass( 'hide' );
    this.ui.pathInput.focus();
  }

  /**
   * rowを削除します。
   */
  onClickDelBtn () {
    this.model.destroy();
  }

  /**
   * inputの中身をデータに反映して再描画
   */
  changeNameInput () {
    this.model.save( 'name', this.ui.nameInput.val(), {silent: false, wait: true} );
    this.render();
  }

  /**
   * inputの中身をデータに反映して再描画
   */
  changePathInput () {
    this.model.save( 'path', this.ui.pathInput.val(), {silent: false, wait: true} );
    this.render();
  }

}
