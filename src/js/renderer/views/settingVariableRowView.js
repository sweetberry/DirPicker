"use strict";

import SETTING_VARIABLE_ROW_TEMPLATE from '../templates/settingVariableRow.html';
// noinspection JSUnresolvedVariable
import {ItemView} from 'backbone.marionette';

/**
 * setting画面のvariable内のリスト項目を扱うviewです。
 */
export default class SettingVariableRowView extends ItemView.extend( {
  model      : undefined,//variableRowModel
  template   : SETTING_VARIABLE_ROW_TEMPLATE,
  tagName    : 'li',
  className  : 'list-group-item js-variable-row',
  ui         : {
    labelInput: '.js-variable-row-label-input',
    valInput  : '.js-variable-row-val-input',
    delBtn    : '.js-variable-row-del-btn',
    handle    : '.js-variable-row-handle'
  },
  events     : {
    'change @ui.labelInput': 'onChangeLabelInput',
    'change @ui.valInput'  : 'onChangeValInput',
    'click @ui.delBtn'     : 'onClickDelBtn'
  },
  modelEvents: {
    'change': 'render'
  }
} ) {
  //noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
  /**
   *
   * @returns {{getID: getID}}
   */
  templateHelpers () {
    // noinspection JSValidateTypes
    return {
      getID: ()=> {
        return this.model.cid;
      }
    };
  }

  //noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
  /**
   *
   */
  onRender () {
    this.$el.css( {
      'padding': '5px 0px'
    } );
    this.ui.handle.tooltip();
  }

  //noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
  /**
   *
   */
  onBeforeDestroy () {
    this.ui.handle.tooltip( 'destroy' );
  }

  /**
   *
   */
  onClickDelBtn () {
    this.model.destroy();
  }

  /**
   *
   */
  onChangeLabelInput () {
    this.model.set( 'label', this.ui.labelInput.val(), {silent: false} );
  }

  /**
   *
   */
  onChangeValInput () {
    this.model.set( 'val', this.ui.valInput.val(), {silent: false} );
  }
}
