"use strict";

const ipcRenderer = require( 'electron' ).ipcRenderer;
const clipboard = require( 'electron' ).clipboard;
const path = require( 'path' );
const fs = require( 'fs' );
const mkdirp = require( 'mkdirp' );

const templatesCollection = require( '../collections/dirPickerTemplates' );//templatesCollection
const variablesCollection = require( '../collections/dirPickerVariables' );//variablesCollection

module.exports.saveSetting = function () {
  const newPath = ipcRenderer.sendSync( 'get-setting-file-save-path' );
  if (newPath) {
    fs.writeFile( newPath, JSON.stringify( createSettingJson(), null, '  ' ) );
  }
};

module.exports.loadSetting = function () {
  const newPath = ipcRenderer.sendSync( 'get-setting-file-load-path' )[0];
  if (newPath) {
    try {
      var data = fs.readFileSync( newPath, 'utf8' );
      if (data) {
        parseSettingJson( JSON.parse( data ) );
      }
    } catch (e) {
      ipcRenderer.sendSync( 'error-message', 'jsonファイルエラーです。\n' + e.message );
    }
  }
};

module.exports.writeClipboard = function ( text ) {
  clipboard.writeText( text );
};

module.exports.sendErrorToMain = function sendErrorToMain ( e ) {
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
  const dstJson = {};
  dstJson.templates = _.map( templatesCollection.toJSON(), function ( template ) {
    return _.pick( template, 'name', 'path' );
  } );
  dstJson.variables = _.map( variablesCollection.toJSON(), function ( variable ) {
    return _.pick( variable, 'name', 'list' );
  } );
  return dstJson;
}

function parseSettingJson ( json ) {
  if (json['templates']) {
    _.each( json['templates'], function ( jsonTemplateRow ) {
      const existingModel = templatesCollection.findWhere( {name: jsonTemplateRow.name} );
      if (existingModel) {
        existingModel.save( jsonTemplateRow, {wait: true} );
      } else {
        templatesCollection.create( jsonTemplateRow, {wait: true} );
      }
    } );
  }
  if (json['variables']) {
    _.each( json['variables'], function ( jsonVariableRow ) {
      const existingModel = variablesCollection.findWhere( {name: jsonVariableRow.name} );
      if (existingModel) {
        existingModel.save( jsonVariableRow, {wait: true} );
      } else {
        variablesCollection.create( jsonVariableRow, {wait: true} );
      }
    } );
  }
}
