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
  template: false,
  regions : {
    headerRegion   : "#header",
    mainRegion     : "#main",
    templatesRegion: "#templatesCollection",
    variablesRegion: "#variablesCollection",
    footerRegion   : "#footer",
    hideRegion     : "#hide"
  },
} ) {

  //noinspection JSUnusedGlobalSymbols
  onRender () {
    suppressPageChangeOnDrop();
    this.mainRegion.show( new DirPickerView() );
    this.templatesRegion.show( new SettingTemplatesView() );
    this.variablesRegion.show( new SettingVariablesView() );
  }
}