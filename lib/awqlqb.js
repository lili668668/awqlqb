'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AWQLQB = function () {
  function AWQLQB() {
    _classCallCheck(this, AWQLQB);

    /** @type{object} */
    this.query = {};
    /** @type{array} */
    this.filterRules = [];
  }

  /**
   * SELECT ... FROM (level)
   * @param {string} level
   */


  _createClass(AWQLQB, [{
    key: 'from',
    value: function from(level) {
      this.query = _extends({}, this.query, { level: level });
      return this;
    }

    /**
     * SELECT (fields) FROM ...
     * @param {array} fields
     */

  }, {
    key: 'select',
    value: function select(fields) {
      this.query = _extends({}, this.query, { fields: fields });
      return this;
    }

    /**
     * SELECT ... FROM ... WHERE (filtering)
     * @param {{ field: string, operator: string, value: any }}
     */

  }, {
    key: 'where',
    value: function where(_ref) {
      var field = _ref.field,
          operator = _ref.operator,
          value = _ref.value;

      if (value !== undefined) {
        var filtering = { field: field, operator: operator, values: value };
        this.filterRules = this.filterRules.concat(filtering);
      }
      return this;
    }

    /**
     * ... DURING [since, until]
     * @param {{ since: string, until: string }}
     */

  }, {
    key: 'during',
    value: function during(_ref2) {
      var since = _ref2.since,
          until = _ref2.until;

      if (since) {
        this.query = _extends({}, this.query, { timeRange: _extends({}, this.query.timeRange, { since: (0, _moment2.default)(since).format('YYYYMMDD') }) });
      }
      if (until) {
        this.query = _extends({}, this.query, { timeRange: _extends({}, this.query.timeRange, { until: (0, _moment2.default)(until).format('YYYYMMDD') }) });
      }
      return this;
    }

    /**
     * @return {string}
     */

  }, {
    key: 'asAWQL',
    value: function asAWQL() {
      var _query = this.query,
          level = _query.level,
          fields = _query.fields,
          timeRange = _query.timeRange;


      var fieldsString = '';
      var timeRangeString = '';
      var filteringsString = '';

      if (fields) fieldsString += fields.join(' , ');
      if (timeRange) timeRangeString += timeRange.since + ', ' + timeRange.until;
      var filterings = this.filterRules.map(function (rule) {
        var ruleString = rule.field + ' ' + rule.operator + ' ';
        ruleString += typeof rule.values === 'string' ? rule.values : '[' + rule.values.join(' , ') + ']';
        return ruleString;
      });
      filteringsString = filterings.join(' AND ');

      var queryString = '';
      if (fieldsString) queryString = 'SELECT ' + fieldsString + ' ';
      if (level) queryString += 'FROM ' + level + ' ';
      if (filteringsString) queryString += 'WHERE ' + filteringsString + ' ';
      if (timeRangeString) queryString += 'DURING ' + timeRangeString + ' ';

      return queryString;
    }
  }]);

  return AWQLQB;
}();

exports.default = AWQLQB;
module.exports = exports['default'];