var ipc = require( 'ipc' );
var path = require( 'path' );
var fs = require( 'fs' );

var templatesCollection = require( '../collections/dirPickerTemplates' );//templatesCollection
var variablesCollection = require( '../collections/dirPickerVariables' );//variablesCollection

module.exports.saveSetting = function () {
  var newPath = ipc.sendSync( 'get-setting-file-save-path' );
  if (newPath) {
    fs.writeFile( newPath, JSON.stringify( parseSettingCollectionsToJsonObject(), null, '  ' ) );
  }
};

module.exports.loadSetting = function () {
  var newPath = ipc.sendSync( 'get-setting-file-load-path' )[0];
  if (newPath) {
    try {
      var data = fs.readFileSync( newPath, 'utf8' );
      if (data) {
        margeJsonIntoCollections( JSON.parse( data ) );
      }
    } catch (e) {
      ipc.sendSync( 'error-message', 'jsonファイルエラーです。\n' + e.message );
    }
  }
};

function parseSettingCollectionsToJsonObject () {
  var dstJson = {};
  dstJson.templates = _.map( templatesCollection.toJSON(), function ( template ) {
    return _.pick( template, 'name', 'path' );
  } );
  dstJson.variables = _.map( variablesCollection.toJSON(), function ( variable ) {
    return _.pick( variable, 'name', 'list' );
  } );
  return dstJson;
}

function margeJsonIntoCollections ( json ) {
  if (json['templates']) {
    _.each( json['templates'], function ( jsonTemplateRow ) {
      var existingModel = templatesCollection.findWhere( {name: jsonTemplateRow.name} );
      if (existingModel) {
        existingModel.save( jsonTemplateRow, {wait: true} );
      } else {
        templatesCollection.create( jsonTemplateRow, {wait: true} );
      }
    } );
  }
  if (json['variables']) {
    _.each( json['variables'], function ( jsonVariableRow ) {
      var existingModel = variablesCollection.findWhere( {name: jsonVariableRow.name} );
      if (existingModel) {
        existingModel.save( jsonVariableRow, {wait: true} );
      } else {
        variablesCollection.create( jsonVariableRow, {wait: true} );
      }
    } );
  }
}
