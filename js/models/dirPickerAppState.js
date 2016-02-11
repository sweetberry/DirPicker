var path = require( 'path' );
var open = require( 'open' );
var fs = require( 'fs' );
var mkdirp = require( 'mkdirp' );
var clipboard = require( 'clipboard' );
var ipcRenderer = require( 'electron' ).ipcRenderer;

var _ = require( 'underscore' );
var jQuery = $ = require( 'jquery' );
var Backbone = require( 'backbone' );
Backbone.$ = jQuery;
Backbone.LocalStorage = require( "backbone.localstorage" );
//require( '../vender/backbone.debug' );

/**
 *
 * @type {CollectionsDirPickerTemplates}
 */
var templates = require( '../collections/dirPickerTemplates' );

/**
 *
 * @type {CollectionsDirPickerVariables}
 */
var variables = require( '../collections/dirPickerVariables' );

//noinspection JSUnusedGlobalSymbols
/**
 * @class
 * @extends {Backbone.Model}
 */
var ModelsDirPickerAppState = Backbone.Model.extend( {
  localStorage: new Backbone.LocalStorage( "dirPickerAppState" ),
  defaults    : {
    template: undefined,
    values  : {}//{name<string>:, value:<string>}
  },

  validate: function ( attributes ) {
    if (attributes.template && !templates.findWhere( {name: attributes.template} )) {
      alert( "No template!" );
      return "No template!";
    }
  },

  initialize: function () {
    //this.debugEvents('ModelsAppState');
    var _self = this;
    templates.on( 'add remove change', function () {
      _self.trigger( 'change' );
    } );
    variables.on( 'add remove change', function () {
      _self.trigger( 'change' );
    } );
  },

  getTemplate: function () {
    //noinspection JSUnresolvedFunction
    var dstTemplate = templates.findWhere( {name: this.get( 'template' )} );
    return dstTemplate || templates.at( 0 ) || templates.create( {}, {wait: true} );
  },

  getTemplates: function () {
    //noinspection JSUnresolvedFunction
    var dstTemplates = templates.toJSON();
    if (!dstTemplates.length) {
      templates.create( {}, {wait: true} );
      dstTemplates = templates.toJSON();
    }
    return dstTemplates;
  },

  getTemplatePath: function () {
    return this.getTemplate().get( 'path' );
  },

  /**
   * @returns {string[]} パスに含まれる変数名のリスト
   */
  getUsedVariableNamesList: function () {
    var usedPath = this.getTemplatePath();
    if (!usedPath) {
      return [];
    } else {
      var tempArray = usedPath.match( /<[^<>]*>/g );
      tempArray = _.uniq( tempArray );
      tempArray = _.map( tempArray, function ( string ) {
        return string.replace( /[<>]/g, '' );
      } );
      return tempArray;
    }
  },

  /**
   *
   * @returns {{isExist: boolean, isFolder: boolean, path: string}}
   */
  getEvaluatedPath: function () {
    var templatePath = this.getTemplatePath();
    var usedVariableNamesList = this.getUsedVariableNamesList();
    var values = this.get( 'values' );
    _.each( usedVariableNamesList, function ( varName ) {
      if (values[varName]) {
        templatePath = templatePath.split( '<' + varName + '>' ).join( values[varName] || '' );
      }
    } );
    var dst = getFolderStats( templatePath );
    dst.path = path.normalize( templatePath );
    dst.isAbs = path.isAbsolute( templatePath );
    return dst;
  },

  setValue: function ( name, val ) {
    //console.log( {name: name, val: val} );
    var values = this.get( 'values' );
    values[name] = val;
    this.set( 'values', values, {silent: true} );
  },

  openPath: function () {
    open( this.getEvaluatedPath().path );
  },

  createPath: function () {
    var targetPath = this.getEvaluatedPath().path;
    try {
      mkdirp.sync( targetPath );
      open( targetPath );
    } catch (e) {
      ipcRenderer.sendSync( 'error-message', ' (;´Д`)y─┛~~ \n\n' + e.message );
    }
  },

  clipPath: function () {
    //noinspection JSUnresolvedFunction
    clipboard.writeText( this.getEvaluatedPath().path );
  },

  /**
   * @returns {[{name: string, list: undefined|{label:string,val:string}[], value: string|undefined, uid: string}]}
   */
  getUsedVariablesList: function () {
    var values = this.get( 'values' );
    return _.map( this.getUsedVariableNamesList(), function ( variableName, index ) {
      var temp = _.find( variables.toJSON(), function ( definedVariable ) {
            return definedVariable.name == variableName;
          } ) || {name: variableName};
      temp.value = values[variableName];
      temp.uid = 'variable-' + index;
      return temp;
    } );
  }

} );

_.extend( ModelsDirPickerAppState.prototype, require( './mixin' ) );

var appState = module.exports = new ModelsDirPickerAppState( {id: 0} );
appState.fetch();
appState.save();

/**
 *
 * @param path
 * @returns {object} {isExist:boolean, isFolder:boolean}
 */
function getFolderStats ( path ) {
  var dest = {};
  try {
    var stats = fs.statSync( path );
    dest.isExist = true;
    dest.isFolder = stats.isDirectory();
  } catch (e) {
    if (e.code == 'ENOENT') {
      dest.isExist = false;
    }
  }
  return dest;
}