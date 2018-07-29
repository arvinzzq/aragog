'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Aragog = function () {
  function Aragog() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Aragog);

    this.config = config;
  }

  (0, _createClass3.default)(Aragog, [{
    key: 'generateUrl',
    value: function generateUrl(baseUrl, queryConditions) {
      var queryParams = (0, _keys2.default)(queryConditions).map(function (query) {
        if (query === 'q' && !(queryConditions[query] instanceof Array)) {
          throw new Error('q must be array');
        }
        return query + '=' + (query === 'q' ? queryConditions[query].map(function (item) {
          return encodeURIComponent(item);
        }).join('+') : queryConditions[query]);
      }).join('&');
      return baseUrl + '?' + queryParams;
    }
  }, {
    key: 'openPage',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _this = this;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _puppeteer2.default.launch((0, _extends3.default)({
                  headless: true,
                  args: ['--no-sandbox', '--disable-setuid-sandbox']
                }, this.config));

              case 2:
                this.browser = _context.sent;

                process.on("unhandledRejection", function (reason, p) {
                  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
                  _this.browser.close();
                  process.exit(1);
                });

                _context.next = 6;
                return this.browser.newPage();

              case 6:
                this.page = _context.sent;

                this.page.on('console', function (consoleObj) {
                  return console.log(consoleObj._text);
                });
                console.info('open new page ->');

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function openPage() {
        return _ref.apply(this, arguments);
      }

      return openPage;
    }()
  }, {
    key: 'fetchIssueList',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
        var _config$options, _config$options$usern, username, _config$options$repos, repository, _config$options$query, queryConditions, url, issueList;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _config$options = (0, _extends3.default)({}, this.config, options), _config$options$usern = _config$options.username, username = _config$options$usern === undefined ? '' : _config$options$usern, _config$options$repos = _config$options.repository, repository = _config$options$repos === undefined ? '' : _config$options$repos, _config$options$query = _config$options.queryConditions, queryConditions = _config$options$query === undefined ? {} : _config$options$query;
                url = this.generateUrl('https://github.com/' + username + '/' + repository + '/issues', queryConditions);

                console.info('Fetch issue list ->dddd\nurl: ' + url);
                _context2.next = 5;
                return this.page.goto(url, { waitUntil: 'networkidle2' });

              case 5:
                _context2.next = 7;
                return this.page.evaluate(function (args) {
                  var username = args.username,
                      repository = args.repository;

                  var domList = document.querySelectorAll('li[id^=issue_] a[href*="/' + username + '/' + repository + '/issues/"]');
                  var len = domList.length;
                  var list = [];
                  console.info('len -> ', len);
                  for (var i = 0; i < len; i++) {
                    console.log('title: ', domList[i].innerText);
                    console.log('href: ', domList[i].href);
                    list.push({
                      title: String(domList[i].innerText).trim(),
                      href: String(domList[i].href).trim()
                    });
                  }
                  return list;
                }, { username: username, repository: repository });

              case 7:
                issueList = _context2.sent;

                console.info('Issue list fetched ->');
                return _context2.abrupt('return', issueList);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchIssueList(_x2) {
        return _ref2.apply(this, arguments);
      }

      return fetchIssueList;
    }()
  }, {
    key: 'closeBrowser',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.info('Close browser ->');
                this.browser.close();

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function closeBrowser() {
        return _ref3.apply(this, arguments);
      }

      return closeBrowser;
    }()
  }]);
  return Aragog;
}();

exports.default = Aragog;
;