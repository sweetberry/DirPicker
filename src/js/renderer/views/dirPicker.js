"use strict";

import DIR_PICKER_TEMPLATE from '../templates/dirPicker.html';
import _ from 'underscore';
import path from 'path';
import dirPickerAppState from '../models/dirPickerAppState';
import {LayoutView} from 'backbone.marionette';

export default class DirPickerView extends LayoutView.extend( {
  className  : "js-view-dir-picker",
  template   : DIR_PICKER_TEMPLATE,
  model      : dirPickerAppState,
  modelEvents: {
    'change': 'render'
  },
  ui         : {
    selectTemplate: '#selectTemplate',
    resultPanel   : '.js-result-panel',
    variableInput : '.js-variable-input',
    variableSelect: '.js-variable-select',
    openBtn       : '.js-open-btn',
    createBtn     : '.js-create-btn',
    clipBtn       : '.js-clip-btn',
    pathSeg       : '.js-result-path-seg'
  },
  events     : {
    'change @ui.selectTemplate': 'onChangeTemplate',
    'change @ui.variableInput' : 'onChangeVariable',
    'keyup @ui.variableInput'  : 'onKeyUpVariable',
    'click @ui.openBtn'        : 'onClickOpen',
    'click @ui.createBtn'      : 'onClickCreate',
    'click @ui.clipBtn'        : 'onClickClip',
    'dblclick @ui.pathSeg'     : 'onClickPathSeg'
  }
} ) {

  //noinspection JSUnusedGlobalSymbols
  templateHelpers () {
    //noinspection JSUnusedGlobalSymbols
    return {
      getTemplates        : ()=> {
        return this.model.getTemplates();
      },
      getUsedVariablesList: ()=> {
        return this.model.getUsedVariablesList();
      },
      getEvaluatedPath    : ()=> {
        return this.model.getEvaluatedPath();
      },
      getSubDirLinkedPath : ()=> {
        const pathString = this.model.getEvaluatedPath().path;
        const sepPathArray = pathString.split( path.sep );
        const resPathArray = [];
        while (sepPathArray.length) {
          resPathArray.unshift( sepPathArray.join( path.sep ) );
          sepPathArray.pop();
        }
        return _.map( _.zip( pathString.split( path.sep ), resPathArray ), ( raw )=> {
          return `<span class="js-result-path-seg" data-path="${raw[1]}">${_.escape( raw[0] )}</span>`;
        } ).join( path.sep );

      }
    }

  }

  //noinspection JSUnusedGlobalSymbols
  onRender () {
    this.model.save();

    //templateのautoComplete
    if (this.ui.selectTemplate.typeahead) {
      this.ui.selectTemplate.typeahead( 'destroy' );
    }
    this.ui.selectTemplate.typeahead( {
      source         : this.model.getTemplates(),
      items          : 'all',
      showHintOnFocus: true,
      minLength      : 0
    } );

    //VariableのautoComplete
    _.each( this.ui.variableSelect, ( element )=> {
      const $el = $( element );

      if ($el.typeahead) {$el.typeahead( 'destroy' )}
      //js-variable-select
      const targetListRow = _.find( this.model.getUsedVariablesList(), {uid: $el.attr( "id" )} );
      //noinspection JSUnusedGlobalSymbols,JSUnusedGlobalSymbols
      $el.typeahead( {
        source         : targetListRow.list,
        items          : 'all',
        showHintOnFocus: true,
        minLength      : 0,
        displayText    : ( item )=> {return item.label},
        afterSelect    : ( item )=> {
          element.dataset.variableValue = item.val;
          this.setValues();
          this.render();
        }
      } );

    } );
  }

  onChangeTemplate () {
    this.model.set( {'template': this.ui.selectTemplate.val()}, {validate: true} );
  }

  onChangeVariable ( e ) {
    const element = e.target;
    element.dataset.variableValue = element.value;
    this.setValues();
    this.render();
  }

  onKeyUpVariable ( e ) {
    let difference = 0;
    const element = e.target;

    if (e.keyCode == 38) {
      difference = 1;
    } else if (e.keyCode == 40) {
      difference = -1;
    } else if (e.keyCode == 13) {
      this.render();
    } else {
      return;
    }

    const targetVal = element.value;
    const LAST_PADDING_REGEXP = /\d+$/;
    const lastPadding = LAST_PADDING_REGEXP.exec( targetVal );
    if (lastPadding) {
      const dstPadding = this.countUpPadding( lastPadding[0], difference );
      element.dataset.variableValue = targetVal.replace( LAST_PADDING_REGEXP, dstPadding );
      this.setValues();
      $( element ).val( targetVal.replace( LAST_PADDING_REGEXP, dstPadding ) );
    }
  }

  onClickPathSeg ( e ) {
    this.model.openPath( e.target.dataset.path );
  }

  onClickOpen () {
    this.model.openPath();
  }

  onClickCreate () {
    this.model.createPath();
    this.render();
  }

  onClickClip () {
    this.model.clipPath();
  }

  setValues () {
    //console.log( 'setValues' );
    const targetElement = this.ui.variableSelect.add( this.ui.variableInput );
    _.each( targetElement, ( element )=> {
      //noinspection JSUnresolvedVariable
      this.model.setValue( element.dataset.variableName, element.dataset.variableValue );
    } );
  }

  //noinspection JSMethodCanBeStatic
  /**
   * パディングをインクリメントして、桁数を揃えた文字列を返します。
   * マイナス値になるときは0を返します。
   * 桁があふれたときは上位の桁が切り捨てられます。
   * @param {string} srcPaddingString
   * @param {number} [increment]
   * @returns {string} 桁数を揃えた結果を返します
   */
  countUpPadding ( srcPaddingString, increment = 1 ) {
    const digits = srcPaddingString.length;
    const padNumber = parseInt( srcPaddingString );
    const dstNumber = (padNumber + increment >= 0) ? padNumber + increment : 0;
    return ('0'.repeat( digits ) + dstNumber).slice( -digits );
  }
}
