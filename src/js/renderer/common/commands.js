"use strict";

//noinspection JSUnresolvedVariable,NodeRequireContents
const ipcRenderer = require( 'electron' ).ipcRenderer;
//noinspection JSUnresolvedVariable,NodeRequireContents
const clipboard = require( 'electron' ).clipboard;
const path = require( 'path' );
const fs = require( 'fs' );
const mkdirp = require( 'mkdirp' );
const _ = require( 'underscore' );
const templatesCollection = require( '../collections/dirPickerTemplates' );
const variablesCollection = require( '../collections/dirPickerVariables' );

const SETTING_JSON_ENVELOPE = 'dirPickerSetting';

module.exports.saveSetting = function () {
  //noinspection JSUnresolvedFunction
  const newPath = ipcRenderer.sendSync( 'get-setting-file-save-path' );
  if (newPath) {
    fs.writeFile( newPath, JSON.stringify( createSettingJson(), null, '  ' ) );
  }
};

module.exports.loadSetting = function () {
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
      ipcRenderer.sendSync( 'error-message', 'jsonファイルエラーです。\n' + e.message );
    }
  }
};

module.exports.writeClipboard = function ( text ) {
  //noinspection JSUnresolvedFunction
  clipboard.writeText( text );
};

module.exports.sendErrorToMain = function sendErrorToMain ( e ) {
  //noinspection JSUnresolvedFunction
  ipcRenderer.sendSync( 'error-message', ' (;´Д`)y─┛~~ \n\n' + e.message );
};

module.exports.createDirectory = function ( targetPath ) {
  try {
    mkdirp.sync( targetPath );
    open( targetPath );
  } catch (e) {
    sendErrorToMain( e );
  }
};

module.exports.getFolderStats = function ( targetPath ) {
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
};

function createSettingJson () {
  //noinspection JSUnresolvedFunction
  const templates = _.map( templatesCollection.toJSON(), function ( template ) {
    return _.pick( template, 'name', 'path' );
  } );
  //noinspection JSUnresolvedFunction
  const variables = _.map( variablesCollection.toJSON(), function ( variable ) {
    return _.pick( variable, 'name', 'list' );
  } );
  const destJson = {};
  destJson[SETTING_JSON_ENVELOPE] = {template: templates, variables: variables};
  return destJson;
}

function parseSettingJson ( json ) {
  const settingAllJson = json[SETTING_JSON_ENVELOPE];
  if (settingAllJson) {
    const templatesJson = settingAllJson['templates'] || [];
    const variablesJson = settingAllJson['variables'] || [];
    parseJsonToCollection( templatesJson, templatesCollection );
    parseJsonToCollection( variablesJson, variablesCollection );
  }

  function parseJsonToCollection ( json, collection ) {
    _.each( json, function ( row ) {
      const existingModel = collection.findWhere( {name: row.name} );
      if (existingModel) {
        existingModel.save( row, {wait: true} );
      } else {
        collection.create( row, {wait: true} );
      }
    } );
  }
}
