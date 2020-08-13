"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginConfig = getPluginConfig;
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _configuration() {
  const data = require("umi-plugin-ui/lib/plugins/configuration");

  _configuration = function _configuration() {
    return data;
  };

  return data;
}

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function getPluginConfig(plugins, name) {
  var _iterator = _createForOfIteratorHelper(plugins),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const plugin = _step.value;

      if (typeof plugin === 'string' && plugin === name) {
        return {};
      }

      if (Array.isArray(plugin) && plugin[0] === name) {
        if (typeof plugin[1] === 'object') {
          return plugin[1];
        } else {
          return {};
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return null;
}

var _default = api => {
  if (process.env.UMI_UI === 'none') return;

  function getConfig(lang) {
    const userConfig = api.service.userConfig;

    const _userConfig$getConfig = userConfig.getConfig({
      force: true
    }),
          plugins = _userConfig$getConfig.plugins;

    const pluginConfig = getPluginConfig(plugins, 'umi-plugin-react');
    return (0, _configuration().formatConfigs)(_config.configs, {
      lang,
      groupMap: _config.groupMap
    }).map(p => {
      const _useConfigKey = (0, _configuration().useConfigKey)(pluginConfig, p.name),
            _useConfigKey2 = _slicedToArray(_useConfigKey, 2),
            haveKey = _useConfigKey2[0],
            value = _useConfigKey2[1];

      if (haveKey) {
        p.value = value;
      }

      return p;
    });
  }

  function validateConfig(config) {}

  if (api.addUIPlugin) {
    api.addUIPlugin(require.resolve('../ui/dist/index.umd'));
  }

  if (api.onUISocket) {
    api.onUISocket(({
      action,
      failure,
      success
    }) => {
      const type = action.type,
            payload = action.payload,
            lang = action.lang;

      switch (type) {
        case 'org.umi.umi-plugin-react.config.list':
          success({
            data: getConfig(lang)
          });
          break;

        case 'org.umi.umi-plugin-react.config.edit':
          let config = payload.key;

          if (typeof payload.key === 'string') {
            config = {
              [payload.key]: payload.value
            };
          }

          try {
            validateConfig(config);
            api.service.runCommand('config', {
              _: ['set', config],
              plugin: 'umi-plugin-react'
            });
            success({});
          } catch (e) {
            failure({
              message: e.message,
              errors: e.errors
            });
          }

          break;

        default:
          break;
      }
    });
  }
};

exports.default = _default;