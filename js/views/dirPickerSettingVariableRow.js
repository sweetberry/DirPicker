var templateHtml = require( '../templates/dirPickerSettingVariableRow.html' );

//noinspection JSUnusedGlobalSymbols
var ViewsDirPickerSettingVariableRow = Backbone.Marionette.ItemView.extend( {
  model: undefined,//variableRowModel
  template: templateHtml,
  tagName: 'li',
  className: 'list-group-item js-variable-row',
  ui: {
    labelInput: '.js-variable-row-label-input',
    valInput: '.js-variable-row-val-input',
    delBtn: '.js-variable-row-del-btn',
    handle: '.js-variable-row-handle'
  },
  events: {
    'change @ui.labelInput': 'changeLabelInput',
    'change @ui.valInput': 'changeValInput',
    'click @ui.delBtn': 'onClickDelBtn'
  },
  modelEvents: {
    'change': 'render'
  },
  initialize: function () {
  },
  templateHelpers: function () {
    var _self = this;
    //noinspection JSUnusedGlobalSymbols
    return {
      getID: function () {
        return _self.model.cid;
      }
    };
  },
  onRender: function () {
    this.$el.css( {
      'padding': '5px 0px'
    } );
    this.ui.handle.tooltip();
  },
  onBeforeDestroy: function () {
    this.ui.handle.tooltip( 'destroy' );
  },
  onClickDelBtn: function () {
    this.model.destroy();
  },
  changeLabelInput: function () {
    this.model.set( 'label', this.ui.labelInput.val(), {silent: false} );
  },
  changeValInput: function () {
    this.model.set( 'val', this.ui.valInput.val(), {silent: false} );
  }

} );

module.exports = ViewsDirPickerSettingVariableRow;
