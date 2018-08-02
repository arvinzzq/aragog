'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _aragog = require('../../lib/aragog');

var _aragog2 = _interopRequireDefault(_aragog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var aragog = new _aragog2.default({
  username: 'zz1211',
  repository: 'Doraemon'
});

(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var issueList, list, page;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return aragog.openPage();

        case 2:
          issueList = [];
          list = [];
          page = 1;

        case 5:
          _context.next = 7;
          return aragog.fetchIssueList({
            queryConditions: {
              'utf8': true,
              page: page++,
              q: ['is:issue', 'is:open', 'label:blog', '-label:TBD ']
            }
          });

        case 7:
          list = _context.sent;

          issueList = issueList.concat(list);

        case 9:
          if (list.length > 0) {
            _context.next = 5;
            break;
          }

        case 10:
          _fs2.default.writeFileSync(_path2.default.resolve(process.cwd(), './issues.json'), (0, _stringify2.default)(issueList, null, 2), 'utf8');
          _context.next = 13;
          return aragog.closeBrowser();

        case 13:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}))();