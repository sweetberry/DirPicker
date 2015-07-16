var templateHtml = require( '../templates/dirPickerSettingVariables.html' );
var ChildView = require( './dirPickerSettingVariable' );

//noinspection JSUnusedGlobalSymbols
var ViewsDirPickerSettingVariables = Backbone.Marionette.CompositeView.extend( {
  collection: require( '../collections/dirPickerVariables' ),//variablesCollection
  childView: ChildView,
  template: templateHtml,
  className: "",
  childViewContainer: '.js-variable-list-container',
  collectionEvents: {
    'sort': 'render',
    'add': 'render',
    'remove': 'render'
  },
  ui: {
    childViewContainer: '.js-variable-list-container',
    addBtn: '.js-variable-add-btn',
    handle: '.js-variable-handle'
  },
  events: {
    'click @ui.addBtn': 'onAddClick',
    'mouseenter @ui.handle': 'sortStart',
    'mouseleave @ui.handle': 'sortDestroy'
  },
  sortStart: function () {
    var _self = this;
    this.ui.childViewContainer.sortable( {
      //forcePlaceholderSize: true,
      //placeholderClass: 'col-lg-4 col-md-6',
      handle: '.js-variable-handle'
    } ).bind( 'sortupdate', function () {
      //console.log("variablesSort");
      _self.updateItemSortIndex( _self.ui.childViewContainer.find( '.js-variable-model-id' ) );
    } );
  },
  sortDestroy: function () {
    this.ui.childViewContainer.sortable( 'destroy' );
  },
  initialize: function () {
    //this.debugEvents('VariablesView');
  },
  onRender: function () {
  },
  onBeforeDestroy: function () {
    //this.ui.childViewContainer.sortable( 'destroy' );
  },
  onAddClick: function () {
    this.collection.create( {}, {wait: true} );
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

module.exports = ViewsDirPickerSettingVariables;
