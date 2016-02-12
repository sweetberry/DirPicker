var templateHtml = require( '../templates/dirPickerSettingTemplates.html' );
var ChildView = require( './dirPickerSettingTemplateRow' );

//noinspection JSUnusedGlobalSymbols
var ViewsDirPickerSettingTemplates = Backbone.Marionette.CompositeView.extend( {
  collection        : require( '../collections/dirPickerTemplates' ),//templatesCollection
  childView         : ChildView,
  template          : templateHtml,
  className         : "",
  childViewContainer: '.js-template-table-container',
  reorderOnSort     : true,
  ui                : {
    childViewContainer: '.js-template-table-container',
    addBtn            : '.js-template-add-btn',
    handle            : '.js-template-handle',
    badge             : '.js-template-num-badge'
  },
  events            : {
    'click @ui.addBtn'     : 'onAddClick',
    'mouseenter @ui.handle': 'sortStart',
    'mouseleave @ui.handle': 'sortDestroy'
  },
  collectionEvents  : {
    'add'   : 'badgeUpdate',
    'remove': 'badgeUpdate'
  },

  templateHelpers: function () {
    var _self = this;
    //noinspection JSUnusedGlobalSymbols
    return {
      getTemplatesCount: function () {
        return _self.collection.length;
      }
    }
  },

  sortStart  : function () {
    var _self = this;
    this.ui.childViewContainer.sortable( {
      forcePlaceholderSize: true,
      items               : 'tr',
      handle              : '.js-template-handle'
    } ).bind( 'sortupdate', function () {
      _self.updateItemSortIndex( _self.ui.childViewContainer.find( '.js-template-model-id' ) );
    } ).bind( 'sortstart', function ( e, ui ) {
      ui.item.css( 'display', 'block' )
    } ).bind( 'sortstop', function ( e, ui ) {
      ui.item.css( 'display', '' )
    } );
  },
  sortDestroy: function () {
    if (this.ui.childViewContainer.sortable) {
      this.ui.childViewContainer.sortable( 'destroy' );
    }
  },

  onRender       : function () {

  },
  onBeforeDestroy: function () {
    this.sortDestroy();
  },
  onAddClick     : function () {
    this.collection.create( {}, {wait: true} );
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
      _self.collection.get( element.dataset.modelId ).save( 'sort', index );
    } );
    this.collection.sort();
  },

  /**
   * バッジの数字だけ更新
   */
  badgeUpdate: function () {
    this.ui.badge.text( this.collection.length );
  }

} );

module.exports = ViewsDirPickerSettingTemplates;
