var templateHtml = require( '../templates/dirPickerSettingTemplateRow.html' );
var dirPickerVariablesCollection = require( '../collections/dirPickerVariables' );

//noinspection JSUnusedGlobalSymbols
var ViewsDirPickerSettingTemplateRow = Backbone.Marionette.LayoutView.extend( {
  /**
   * @type {ModelsDirPickerTemplate}
   */
  model          : undefined,
  template       : templateHtml,
  tagName        : 'tr',
  ui             : {
    name     : '.js-template-name',
    nameInput: '.js-template-name-input',
    path     : '.js-template-path',
    pathInput: '.js-template-path-input',
    delBtn   : '.js-template-del-btn',
    handle   : '.js-template-handle'
  },
  events         : {
    'click @ui.name'        : 'onClickName',
    'keyup @ui.nameInput'   : 'onKeyupNameInput',
    'focusout @ui.nameInput': 'changeNameInput',
    'click @ui.path'        : 'onClickPath',
    'keyup @ui.pathInput'   : 'onKeyupPathInput',
    'focusout @ui.pathInput': 'changePathInput',
    'click @ui.delBtn'      : 'onClickDelBtn'
  },
  modelEvents    : {
    'change': 'render'
  },
  templateHelpers: function () {
    var _self = this;
    var escapedTagRegexp = /(&lt;.*?&gt;)/g;
    //noinspection JSUnusedGlobalSymbols
    return {
      getColoredTemplatePath: function () {

        if (dirPickerVariablesCollection) {//設定済み変数がある場合
          var definedVariableNames = dirPickerVariablesCollection.pluck( 'name' );
          return _.escape( _self.model.get( 'path' ) ).replace( escapedTagRegexp, function ( match ) {
            if (_.find( definedVariableNames, function ( definedVarName ) {
                  return '&lt;' + definedVarName + '&gt;' == match;
                } )) {
              return "<span class='text-success'>" + match + "</span>"
            } else {
              return "<span class='text-warning'>" + match + "</span>"
            }
          } );
        }
        //設定済み変数がない場合
        return _.escape( _self.model.get( 'path' ) ).replace( escapedTagRegexp, "<span class='text-warning'>$1</span>" );
      }
    }
  },

  onRender        : function () {
    this.ui.handle.tooltip();
  },
  onBeforeDestroy : function () {
    this.ui.handle.tooltip( 'destroy' );
  },
  onKeyupNameInput: function ( e ) {
    if (e.which == 13) {
      this.changeNameInput();
    }
  },
  onKeyupPathInput: function ( e ) {
    if (e.which == 13) {
      this.changePathInput();
    }
  },
  onClickName     : function () {
    this.ui.name.addClass( 'hide' );
    this.ui.nameInput.removeClass( 'hide' );
    this.ui.nameInput.focus();
    //this.ui.delBtn.addClass( 'hide' );
  },
  onClickPath     : function () {
    this.ui.path.addClass( 'hide' );
    this.ui.pathInput.removeClass( 'hide' );
    this.ui.pathInput.focus();
  },
  onClickDelBtn   : function () {
    this.model.destroy();
  },
  changeNameInput : function () {
    this.model.save( 'name', this.ui.nameInput.val(), {silent: false} );
    //this.model.trigger( 'change' );
  },
  changePathInput : function () {
    this.model.save( 'path', this.ui.pathInput.val(), {silent: false} );
    //this.model.trigger( 'change' );
  }

} );

module.exports = ViewsDirPickerSettingTemplateRow;
