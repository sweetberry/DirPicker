var templateHtml = require( '../templates/dirPickerSettingVariable.html' );
var DirPickerSettingVariableRowView = require( './dirPickerSettingVariableRow' );

//noinspection JSUnusedGlobalSymbols
var ViewsDirPickerSettingVariable = Backbone.Marionette.CompositeView.extend( {
  model             : undefined,//variableModel
  collection        : undefined,//variableModel.listCollection
  template          : templateHtml,
  childView         : DirPickerSettingVariableRowView,
  childViewContainer: '.js-variable-row-list-container',
  className         : 'col-lg-4 col-md-6',
  reorderOnSort     : true,
  ui                : {
    name              : '.js-variable-name',
    nameInput         : '.js-variable-name-input',
    delBtn            : '.js-variable-del-btn',
    handle            : '.js-variable-handle',
    rowHandle         : '.js-variable-row-handle',
    childViewContainer: '.js-variable-row-list-container',
    addBtn            : '.js-variable-row-add-btn',
    closeBtn          : '.js-variable-row-list-close-btn',
    badge             : '.js-variable-list-num-badge',
    collapse          : '.collapse'
  },
  events            : {
    'click @ui.name'          : 'onClickName',
    'keyup @ui.nameInput'     : 'onKeyupNameInput',
    'focusout @ui.nameInput'  : 'changeNameInput',
    'click @ui.delBtn'        : 'onClickDelBtn',
    'click @ui.addBtn'        : 'onClickAddBtn',
    'click @ui.closeBtn'      : 'onClickCloseBtn',
    'mouseenter @ui.rowHandle': 'sortStart',
    'mouseleave @ui.rowHandle': 'sortDestroy'

  },
  modelEvents       : {
    'change:name': 'redrawName',
    'badgeUpdate': 'badgeUpdate'
  },

  /**
   * renderし直したくないんで
   */
  badgeUpdate        : function () {
    this.ui.badge.text( this.collection.length );
  },
  onClickCloseBtn    : function () {
    this.ui.collapse.collapse( 'toggle' );
  },
  initialize         : function () {
    //this.debugEvents('VariableView');
    this.collection = this.model.listCollection
  },
  sortStart          : function () {
    var _self = this;
    this.ui.childViewContainer.sortable( {
      forcePlaceholderSize: true,
      handle              : '.js-variable-row-handle'
    } ).bind( 'sortupdate', function () {
      //console.log("variablesSort");
      _self.updateItemSortIndex( _self.ui.childViewContainer.find( '.js-variable-row-model-id' ) );
    } );
  },
  sortDestroy        : function () {
    if (this.ui.childViewContainer.sortable) {
      this.ui.childViewContainer.sortable( 'destroy' );
    }
  },
  onRender           : function () {
    this.ui.handle.tooltip();
  },
  onBeforeDestroy    : function () {
    this.ui.handle.tooltip( 'destroy' );
    this.sortDestroy()
  },
  onKeyupNameInput   : function ( e ) {
    if (e.which == 13) {
      this.ui.nameInput.blur();
    }
  },
  onClickName        : function () {
    this.ui.name.addClass( 'hide' );
    this.ui.nameInput.removeClass( 'hide' );
    this.ui.nameInput.focus();
  },
  redrawName         : function () {
    this.ui.name.html( _.escape( this.model.get( 'name' ) ) );
    this.ui.name.removeClass( 'hide' );
    this.ui.nameInput.addClass( 'hide' );
  },
  onClickDelBtn      : function () {
    this.model.destroy();
  },
  changeNameInput    : function () {
    this.model.save( 'name', this.ui.nameInput.val(), {silent: false} );
    //this.model.trigger( 'change' );
  },
  onClickAddBtn      : function () {
    this.collection.add( {}, {wait: true} );
    this.ui.collapse.collapse( 'show' );
    this.onRender();
  },
  /**
   *
   * @param elements data-model-idの指定があるエレメントの配列
   */
  updateItemSortIndex: function ( elements ) {
    var _self = this;
    _.each( elements, function ( element, index ) {
      //noinspection JSUnresolvedVariable
      _self.collection.get( element.dataset.modelId ).set( 'sort', index, {silent: true} );
    } );
    this.model.updateList();
  }

} );

module.exports = ViewsDirPickerSettingVariable;
