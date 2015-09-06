var templateHtml = require( '../templates/dirPickerSettingTemplates.html' );
var ChildView = require( './dirPickerSettingTemplateRow' );

//noinspection JSUnusedGlobalSymbols
var ViewsDirPickerSettingTemplates = Backbone.Marionette.CompositeView.extend( {
  collection: require( '../collections/dirPickerTemplates' ),//templatesCollection
  childView: ChildView,
  template: templateHtml,
  className: "",
  childViewContainer: '.js-template-table-container',
  collectionEvents: {
    'change': 'render',
    'sync': 'render'
  },
  ui: {
    childViewContainer: '.js-template-table-container',
    addBtn: '.js-template-add-btn',
    //importBtn: '.js-import-btn',
    //exportBtn: '.js-export-btn'
  },
  events: {
    'click @ui.addBtn': 'onAddClick',
    //'click @ui.importBtn': 'onImportClick',
    //'click @ui.exportBtn': 'onExportClick'
  },
  //onImportClick: function () {
  //  require( '../commands/commands' ).loadSetting();
  //},
  //onExportClick: function () {
  //  require( '../commands/commands' ).saveSetting();
  //},

  templateHelpers: function () {
    var _self = this;
    //noinspection JSUnusedGlobalSymbols
    return {
      getTemplatesCount: function () {
        return _self.collection.length;
      }
    }
  },
  onRender: function () {
    var _self = this;
    if (this.ui.childViewContainer.sortable) {
      this.ui.childViewContainer.sortable( 'destroy' );
    }
    this.ui.childViewContainer.sortable( {
      forcePlaceholderSize: true,
      items: 'tr' ,
      handle: '.js-template-handle'
    } ).bind( 'sortupdate', function () {
      _self.updateItemSortIndex( _self.ui.childViewContainer.find( '.js-template-model-id' ) );
    } );
  },
  onBeforeDestroy: function () {
    this.ui.childViewContainer.sortable( 'destroy' );
  },
  onAddClick: function () {
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
  }

} );

module.exports = ViewsDirPickerSettingTemplates;
