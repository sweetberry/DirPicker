"use strict";

// noinspection JSUnresolvedVariable
import {LayoutView} from 'backbone.marionette'
import DirPickerView from './dirPickerView'
import SettingTemplatesView from './settingTemplatesView'
import SettingVariablesView from './settingVariablesView'
import {suppressPageChangeOnDrop} from '../common/suppressPageChangeOnDrop'
import command from '../common/commands'

export default class RootView extends LayoutView.extend( {
  el      : 'body',
  ui      : {
    'exportBtn': '.js-export-btn',
    'importBtn': '.js-import-btn'
  },
  template: false,
  regions : {
    headerRegion   : "#header",
    mainRegion     : "#main",
    templatesRegion: "#templatesCollection",
    variablesRegion: "#variablesCollection",
    footerRegion   : "#footer",
    hideRegion     : "#hide"
  },
  events  : {
    'click @ui.exportBtn': 'onClickExport',
    'click @ui.importBtn': 'onClickImport'
  }
} ) {

  //noinspection JSUnusedGlobalSymbols
  onRender () {
    suppressPageChangeOnDrop();
    this.mainRegion.show( new DirPickerView() );
    this.templatesRegion.show( new SettingTemplatesView() );
    this.variablesRegion.show( new SettingVariablesView() );
  }

  //noinspection JSMethodCanBeStatic
  onClickExport () {
    command.saveSetting();
  }

  //noinspection JSMethodCanBeStatic
  onClickImport () {
    command.loadSetting();
  }
}