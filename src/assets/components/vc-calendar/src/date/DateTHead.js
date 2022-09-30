'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DateConstants = require('./DateConstants');

var _DateConstants2 = _interopRequireDefault(_DateConstants);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  functional: true,
  render: function render(createElement, context) {
    var h = arguments[0];
    var props = context.props;

    var value = props.value;
    var localeData = value.localeData();
    var prefixCls = props.prefixCls;
    var veryShortWeekdays = [];
    var weekDays = [];
    var firstDayOfWeek = localeData.firstDayOfWeek();
    var showWeekNumberEl = void 0;
    var now = (0, _moment2['default'])();
    for (var dateColIndex = 0; dateColIndex < _DateConstants2['default'].DATE_COL_COUNT; dateColIndex++) {
      var index = (firstDayOfWeek + dateColIndex) % _DateConstants2['default'].DATE_COL_COUNT;
      now.day(index);
      veryShortWeekdays[dateColIndex] = localeData.weekdaysMin(now);
      weekDays[dateColIndex] = localeData.weekdaysShort(now);
    }
    var temporary1,temporary2
    temporary1=weekDays[weekDays.length-1]
    temporary2=veryShortWeekdays[veryShortWeekdays.length-1]
    weekDays.splice(weekDays.length-1, 1)
    veryShortWeekdays.splice(veryShortWeekdays.length-1, 1)
    weekDays.unshift(temporary1)
    veryShortWeekdays.unshift(temporary2)


    
      if (props.showWeekNumber) {
        showWeekNumberEl = h(
          'th',
          {
            attrs: {
              role: 'columnheader'
            },
            'class': prefixCls + '-column-header ' + prefixCls + '-week-number-header'
          },
          [h(
            'span',
            { 'class': prefixCls + '-column-header-inner' },
            ['x']
          )]
        );
      }
      var weekDaysEls = weekDays.map(function (day, xindex) {
        return h(
          'th',
          { key: xindex, attrs: { role: 'columnheader', title: day },
            'class': [prefixCls + '-column-header',day.search('日')!=-1?'Sunday':(day.search('六')!=-1?'Saturday':'')] },
          [h(
            'span',
            { 'class': prefixCls + '-column-header-inner' },
            ['周'+veryShortWeekdays[xindex]]
          )]
        );
      });
      return h('thead', [h(
        'tr',
        {
          attrs: { role: 'row' }
        },
        [showWeekNumberEl, weekDaysEls]
      )]);
    
  }
};