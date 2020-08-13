import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__index" */ '../../layouts/index.js'),
        })
      : require('../../layouts/index.js').default,
    routes: [
      {
        path: '/huibao/colorPicker',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__huibao__model.js' */ 'E:/web_work/cesium_huibao/src/pages/huibao/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__huibao__colorPicker__index" */ '../huibao/colorPicker/index.js'),
            })
          : require('../huibao/colorPicker/index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/huibao/gltfModel',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__huibao__model.js' */ 'E:/web_work/cesium_huibao/src/pages/huibao/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__huibao__gltfModel__index" */ '../huibao/gltfModel/index.js'),
            })
          : require('../huibao/gltfModel/index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/huibao',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__huibao__model.js' */ 'E:/web_work/cesium_huibao/src/pages/huibao/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__huibao__index" */ '../huibao/index.js'),
            })
          : require('../huibao/index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/huibao/layer',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__huibao__model.js' */ 'E:/web_work/cesium_huibao/src/pages/huibao/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__huibao__layer" */ '../huibao/layer.js'),
            })
          : require('../huibao/layer.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/huibao/mainCesium',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__huibao__model.js' */ 'E:/web_work/cesium_huibao/src/pages/huibao/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__huibao__mainCesium__index" */ '../huibao/mainCesium/index.js'),
            })
          : require('../huibao/mainCesium/index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/huibao/sliderInput',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__huibao__model.js' */ 'E:/web_work/cesium_huibao/src/pages/huibao/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__huibao__sliderInput__index" */ '../huibao/sliderInput/index.js'),
            })
          : require('../huibao/sliderInput/index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__index" */ '../index.js'),
            })
          : require('../index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/user',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__user__model.js' */ 'E:/web_work/cesium_huibao/src/pages/user/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__user__index" */ '../user/index.js'),
            })
          : require('../user/index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/user/login',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__user__model.js' */ 'E:/web_work/cesium_huibao/src/pages/user/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__user__login__index" */ '../user/login/index.js'),
            })
          : require('../user/login/index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        path: '/user/register',
        exact: true,
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__user__model.js' */ 'E:/web_work/cesium_huibao/src/pages/user/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__user__register__index" */ '../user/register/index.js'),
            })
          : require('../user/register/index.js').default,
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
      {
        component: () =>
          React.createElement(
            require('E:/web_work/cesium_huibao/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: false },
          ),
        _title: 'supermap-study',
        _title_default: 'supermap-study',
      },
    ],
    _title: 'supermap-study',
    _title_default: 'supermap-study',
  },
  {
    component: () =>
      React.createElement(
        require('E:/web_work/cesium_huibao/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: false },
      ),
    _title: 'supermap-study',
    _title_default: 'supermap-study',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}
