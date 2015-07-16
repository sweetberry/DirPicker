(function () {
  'use strict';

  // ログのスタイル
  var logStyles = {
    timestamp: {
      color: 'gray'
    },
    label: {
      color: 'white',
      'border-radius': '2px'
    },
    event: {
      color: 'blue',
      'font-weight': 'bold',
      'font-size': '110%'
    }
  };

  // ラベルの色
  var labelColors= {
    Model: 'red',
    Collection: 'purple',
    View: 'green',
    Router: 'black'
  };

  function debugEvents(parts) {
    return function (prefix) {
      this.__debugEvents = this.__debugEvents || {};
      if (prefix === false) { return this.off('all', this.__debugEvents.log, this); }
      else if (prefix !== true) { this.__debugEvents.prefix = prefix || ''; }

      if ('log' in this.__debugEvents) {
        // イベント登録済チェック(二重登録防止)
        if ('_events' in this && 'all' in this._events) {
          var exists = _.some(this._events.all, function (item) {
            return item.callback === this.__debugEvents.log && item.context === this;
          }, this);
          if (exists) { return; }
        }
      } else {
        // イベント発火時の関数作成
        var labelCss = _.extend(logStyles.label, { background: labelColors[parts] });
        var css = {
          timestamp: _.map(logStyles.timestamp, function (val, key) { return key + ':' + val; }).join(';'),
          label: _.map(labelCss, function (val, key) { return key + ':' + val; }).join(';'),
          event: _.map(logStyles.event, function (val, key) { return key + ':' + val; }).join(';')
        };

        this.__debugEvents.log = function(eventName) {
          var labelName = parts;
          if (this.__debugEvents.prefix) { labelName += ':' + this.__debugEvents.prefix; }

          console.debug(
              '%c%s %c%s%c %s',
              css.timestamp, new Date().toString().match(/(\d+:\d+:\d+)/)[1],
              css.label, ' ' + labelName + ' ',
              css.event, eventName,
              Array.prototype.slice.call(arguments, 1)
          );
          // この行いらない(コメント参照) → if (eventName === 'remove') { this.off('all', this.__debugEvents.log, this); }
        };
      }
      this.on('all', this.__debugEvents.log, this);
    };
  }

  // Backboneの各クラスのプロトタイプにdebugEvents()メソッド付加
  _.each(labelColors, function(val, key) {
    Backbone[key].prototype.debugEvents = debugEvents(key);
  });
})();