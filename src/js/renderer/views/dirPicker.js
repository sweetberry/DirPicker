var template = require( '../templates/dirPicker.html' );
var _ = require( 'underscore' );
var open = require( 'open' );
var path = require( 'path' );

//noinspection JSUnusedGlobalSymbols
module.exports = Backbone.Marionette.LayoutView.extend( {
  className      : "js-view-dir-picker",
  template       : template,
  /**
   * @type {ModelsDirPickerAppState}
   */
  model          : require( '../models/dirPickerAppState' ),
  modelEvents    : {
    'change': 'render'
  },
  ui             : {
    selectTemplate: '#selectTemplate',
    resultPanel   : '.js-result-panel',
    variableInput : '.js-variable-input',
    variableSelect: '.js-variable-select',
    openBtn       : '.js-open-btn',
    createBtn     : '.js-create-btn',
    clipBtn       : '.js-clip-btn',
    pathSeg       : '.js-result-path-seg'
  },
  events         : {
    'change @ui.selectTemplate': 'onChangeTemplate',
    //'change @ui.variableSelect': 'onChangeSelect',
    'change @ui.variableInput' : 'onChangeVariable',
    'keyup @ui.variableInput'  : 'onKeyUpVariable',
    'click @ui.openBtn'        : 'onClickOpen',
    'click @ui.createBtn'      : 'onClickCreate',
    'click @ui.clipBtn'        : 'onClickClip',
    'dblclick @ui.pathSeg'     : 'onClickPathSeg'
  },
  templateHelpers: function () {
    var _self = this;
    //noinspection JSUnusedGlobalSymbols
    return {
      getTemplates        : function () {
        return _self.model.getTemplates();
      },
      getUsedVariablesList: function () {
        return _self.model.getUsedVariablesList();
      },
      getEvaluatedPath    : function () {
        return _self.model.getEvaluatedPath();
      },
      getSubDirLinkedPath : function () {
        var pathString = _self.model.getEvaluatedPath().path;
        var sepPathArray = pathString.split( path.sep );
        var resPathArray = [];
        while (sepPathArray.length) {
          resPathArray.unshift( sepPathArray.join( path.sep ) );
          sepPathArray.pop();
        }
        return _.map( _.zip( pathString.split( path.sep ), resPathArray ), function ( raw ) {
          return '<span class="js-result-path-seg" data-path="' + raw[1] + '">' + _.escape(raw[0]) + '</span>'
        } ).join( path.sep );

      }
    }
  },

  onRender: function () {

    this.model.save();

    //templateのautoComplete
    if (this.ui.selectTemplate.typeahead) {
      this.ui.selectTemplate.typeahead( 'destroy' );
    }
    this.ui.selectTemplate.typeahead( {
      source         : this.model.getTemplates(),
      items          : 'all',
      showHintOnFocus: true,
      minLength      : 0
    } );

    //VariableのautoComplete
    var usedVariablesList = this.model.getUsedVariablesList();
    var _self = this;
    _.each( this.ui.variableSelect, function ( element ) {
      if ($( element ).typeahead) {
        $( element ).typeahead( 'destroy' );
      }
      //js-variable-select
      var targetUid = $( element ).attr( "id" );
      var targetListRow = _.find( usedVariablesList, {uid: targetUid} );
      $( element ).typeahead( {
        source         : targetListRow.list,
        items          : 'all',
        showHintOnFocus: true,
        minLength      : 0,
        displayText    : function ( item ) {return item.label},
        afterSelect    : function ( item ) {
          element.dataset.variableValue = item.val;
          _self.setValues();
          _self.render();
        }
      } );

    } );
  },

  onChangeTemplate: function () {
    this.model.set( {'template': this.ui.selectTemplate.val()}, {validate: true} );
  },
  onChangeSelect  : function () {
    //console.log( 'onChangeSelect' );
    this.render();
  },

  onChangeVariable: function ( e ) {
    var element = e.target;
    element.dataset.variableValue = element.value;
    this.setValues();
    this.render();
  },

  onKeyUpVariable: function ( e ) {
    var difference = 0;
    var element = e.target;

    if (e.keyCode == 38) {
      difference = 1;
    } else if (e.keyCode == 40) {
      difference = -1;
    } else if (e.keyCode == 13) {
      this.render();
    } else {
      return;
    }
    var targetVal = element.value;
    //console.log( "targetVal:", targetVal );
    var lastPaddingRegexp = /\d+$/;
    var lastPadding = lastPaddingRegexp.exec( targetVal );
    //console.log( "lastPadding:", lastPadding );
    if (lastPadding) {
      var dstPadding = parseInt( lastPadding ) + difference;
      //console.log( "dst:", targetVal.replace( lastPaddingRegexp, dstPadding ) );
      if (dstPadding >= 0) {
        element.dataset.variableValue = targetVal.replace( lastPaddingRegexp, dstPadding );
        this.setValues();
        $( element ).val( targetVal.replace( lastPaddingRegexp, dstPadding ) )
      }
    }
  },

  onClickPathSeg: function ( e ) {
    open( e.target.dataset.path );
  },

  onClickOpen  : function () {
    this.model.openPath();
  },
  onClickCreate: function () {
    this.model.createPath();
    this.render();
  },
  onClickClip  : function () {
    this.model.clipPath();
  },
  setValues    : function () {
    //console.log( 'setValues' );
    var _self = this;
    var targetElement = this.ui.variableSelect.add( this.ui.variableInput );
    _.each( targetElement, function ( element ) {
      //noinspection JSUnresolvedVariable
      _self.model.setValue( element.dataset.variableName, element.dataset.variableValue );
    } );
  }

} );