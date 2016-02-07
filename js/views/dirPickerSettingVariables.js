var templateHtml = require( '../templates/dirPickerSettingVariables.html' );
var DirPickerSettingVariableView = require( './dirPickerSettingVariable' );
var DirPickerVariablesCollection = require( '../collections/dirPickerVariables' );

//noinspection JSUnusedGlobalSymbols
var ViewsDirPickerSettingVariables = Backbone.Marionette.CompositeView.extend( {
  collection        : DirPickerVariablesCollection,
  childView         : DirPickerSettingVariableView,
  template          : templateHtml,
  className         : "",
  childViewContainer: '.js-variable-list-container',
  reorderOnSort     : true,
  ui                : {
    childViewContainer: '.js-variable-list-container',
    addBtn            : '.js-variable-add-btn',
    handle            : '.js-variable-handle'
  },
  events            : {
    'click @ui.addBtn'     : 'onClickAddBtn',
    'mouseenter @ui.handle': 'sortStart',
    'mouseleave @ui.handle': 'sortDestroy'
  },
  templateHelpers   : function () {
    var _self = this;
    //noinspection JSUnusedGlobalSymbols
    return {
      getVariablesCount: function () {
        return _self.collection.length;
      }
    }
  },

  sortStart      : function () {
    var _self = this;
    this.ui.childViewContainer.sortable( {
      forcePlaceholderSize: true,
      //placeholderClass: 'col-lg-4 col-md-6',
      handle              : '.js-variable-handle'
    } ).bind( 'sortupdate', function () {
      //console.log("variablesSort");
      _self.updateItemSortIndex( _self.ui.childViewContainer.find( '.js-variable-model-id' ) );
    } );
  },
  sortDestroy    : function () {
    if (this.ui.childViewContainer.sortable) {
      this.ui.childViewContainer.sortable( 'destroy' );
    }
  },
  initialize     : function () {
    //this.debugEvents('VariablesView');
  },
  onRender       : function () {
    //console.log( 'variablesRender' );
  },
  onBeforeDestroy: function () {
    this.sortDestroy();
  },
  onClickAddBtn     : function () {
    this.collection.create( {}, {wait: true} );
  },

  /**
   *
   * @param elements data-model-idの指定があるエレメントの配列
   */
  updateItemSortIndex: function ( elements ) {
    console.log( 'updateItemSortIndex' );
    var _self = this;
    _.each( elements, function ( element, index ) {
      //noinspection JSUnresolvedVariable
      _self.collection.get( element.dataset.modelId ).save( 'sort', index );
    } );
  }

} );

module.exports = ViewsDirPickerSettingVariables;
