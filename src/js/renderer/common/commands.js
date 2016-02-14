"use strict";

import {ipcRenderer} from 'electron';
import {clipboard} from 'electron';
import _ from 'underscore';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import templatesCollection from  '../collections/dirPickerTemplates';
import variablesCollection from  '../collections/dirPickerVariables';

const SETTING_JSON_ENVELOPE = 'dirPickerSetting';

export default class Commands {
  static saveSetting () {
    //noinspection JSUnresolvedFunction
    const newPath = ipcRenderer.sendSync( 'get-setting-file-save-path' );
    if (newPath) {
      fs.writeFile( newPath, JSON.stringify( createSettingJson(), null, '  ' ) );
    }
  }

  static loadSetting () {
    //noinspection JSUnresolvedFunction
    const newPath = ipcRenderer.sendSync( 'get-setting-file-load-path' )[0];
    if (newPath) {
      try {
        var data = fs.readFileSync( newPath, 'utf8' );
        if (data) {
          parseSettingJson( JSON.parse( data ) );
        }
      } catch (e) {
        //noinspection JSUnresolvedFunction
        ipcRenderer.sendSync( 'error-message', `jsonファイルエラーです。\n${e.message}` );
      }
    }
  }

  static writeClipboard ( text ) {
    //noinspection JSUnresolvedFunction
    clipboard.writeText( text );
  }

  static sendErrorToMain ( e ) {
    //noinspection JSUnresolvedFunction
    ipcRenderer.sendSync( 'error-message', ` (;´Д\`)y─┛~~ \n\n${e.message}` );
  }

  static createDirectory ( targetPath ) {
    try {
      mkdirp.sync( targetPath );
      open( targetPath );
    } catch (e) {
      this.sendErrorToMain( e );
    }
  }

  static getFolderStats ( targetPath ) {
    const dest = {};
    try {
      var stats = fs.statSync( targetPath );
      dest.isExist = true;
      dest.isFolder = stats.isDirectory();
    } catch (e) {
      if (e.code == 'ENOENT') {
        dest.isExist = false;
      }
    }
    dest.path = path.normalize( targetPath );
    dest.isAbs = path.isAbsolute( targetPath );
    return dest;
  }

}

export function createSettingJson () {
  //noinspection JSUnresolvedFunction
  const templates = _.map( templatesCollection.toJSON(), ( template )=> {
    return _.pick( template, 'name', 'path' );
  } );
  //noinspection JSUnresolvedFunction
  const variables = _.map( variablesCollection.toJSON(), ( variable )=> {
    return _.pick( variable, 'name', 'list' );
  } );
  const destJson = {};
  destJson[SETTING_JSON_ENVELOPE] = {template: templates, variables: variables};
  return destJson;
}

export function parseSettingJson ( json ) {
  const settingAllJson = json[SETTING_JSON_ENVELOPE];
  if (settingAllJson) {
    const templatesJson = settingAllJson['templates'] || [];
    const variablesJson = settingAllJson['variables'] || [];
    parseJsonToCollection( templatesJson, templatesCollection );
    parseJsonToCollection( variablesJson, variablesCollection );
  }

  function parseJsonToCollection ( json, collection ) {
    _.each( json, ( row )=> {
      const existingModel = collection.findWhere( {name: row.name} );
      if (existingModel) {
        existingModel.save( row, {wait: true} );
      } else {
        collection.create( row, {wait: true} );
      }
    } );
  }
}

