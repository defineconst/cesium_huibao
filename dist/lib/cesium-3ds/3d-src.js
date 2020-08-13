(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Cesium"), require("jQuery"), require("mapv"));
	else if(typeof define === 'function' && define.amd)
		define(["Cesium", "jQuery", "mapv"], factory);
	else if(typeof exports === 'object')
		exports["mars3d"] = factory(require("Cesium"), require("jQuery"), require("mapv"));
	else
		root["mars3d"] = factory(root["Cesium"], root["jQuery"], root["mapv"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_87__) {
return  (function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};

 	// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, {
 				configurable: false,
 				enumerable: true,
 				get: getter
 			});
 		}
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	// Object.prototype.hasOwnProperty.call
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	// __webpack_public_path__
 	__webpack_require__.p = "";

 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = 37);
 })
/************************************************************************/
 ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.aroundPoint = exports.windingPoint = undefined;
exports.formatNum = formatNum;
exports.formatPositon = formatPositon;
exports.getMaxHeight = getMaxHeight;
exports.addPositionsHeight = addPositionsHeight;
exports.setPositionsHeight = setPositionsHeight;
exports.updateHeightForClampToGround = updateHeightForClampToGround;
exports.getCurrentMousePosition = getCurrentMousePosition;
exports.getCenter = getCenter;
exports.getExtent = getExtent;
exports.getCameraView = getCameraView;
exports.centerOfMass = centerOfMass;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//格式化 数字 小数位数
function formatNum(num, digits) {
    //var pow = Math.pow(10, (digits === undefined ? 6 : digits));
    //return Math.round(num * pow) / pow;
    return Number(num.toFixed(digits || 0));
}

//格式化坐标点为可显示的可理解格式（如：经度x:123.345345、纬度y:31.324324、高度z:123.1）。
function formatPositon(position) {
    var carto = _Cesium2.default.Cartographic.fromCartesian(position);
    var result = {};
    result.y = formatNum(_Cesium2.default.Math.toDegrees(carto.latitude), 6);
    result.x = formatNum(_Cesium2.default.Math.toDegrees(carto.longitude), 6);
    result.z = formatNum(carto.height, 2);
    return result;
}

/**
 * 获取坐标数组中最高高程值
 * @param {Array} positions Array<Cartesian3> 笛卡尔坐标数组
 * @param {Number} defaultVal 默认高程值
 */
function getMaxHeight(positions, defaultVal) {
    if (defaultVal == null) defaultVal = 0;

    var maxHeight = defaultVal;
    if (positions == null || positions.length == 0) return maxHeight;

    for (var i = 0; i < positions.length; i++) {
        var tempCarto = _Cesium2.default.Cartographic.fromCartesian(positions[i]);
        if (tempCarto.height > maxHeight) {
            maxHeight = tempCarto.height;
        }
    }
    return formatNum(maxHeight, 2);
}

/**
* 在坐标基础海拔上增加指定的海拔高度值
* @param {Array} positions Cartesian3类型的数组
* @param {Number} height 高度值
* @return {Array} Cartesian3类型的数组
*/
function addPositionsHeight(positions, addHeight) {
    addHeight = Number(addHeight) || 0;

    if (positions instanceof Array) {
        var arr = [];
        for (var i = 0, len = positions.length; i < len; i++) {
            var car = _Cesium2.default.Cartographic.fromCartesian(positions[i]);
            var point = _Cesium2.default.Cartesian3.fromRadians(car.longitude, car.latitude, car.height + addHeight);
            arr.push(point);
        }
        return arr;
    } else {
        var car = _Cesium2.default.Cartographic.fromCartesian(positions);
        return _Cesium2.default.Cartesian3.fromRadians(car.longitude, car.latitude, car.height + addHeight);
    }
}

/**
* 设置坐标中海拔高度为指定的高度值
* @param {Array} positions Cartesian3类型的数组
* @param {Number} height 高度值
* @return {Array} Cartesian3类型的数组
*/
function setPositionsHeight(positions, height) {
    height = Number(height) || 0;

    if (positions instanceof Array) {
        var arr = [];
        for (var i = 0, len = positions.length; i < len; i++) {
            var car = _Cesium2.default.Cartographic.fromCartesian(positions[i]);
            var point = _Cesium2.default.Cartesian3.fromRadians(car.longitude, car.latitude, height);
            arr.push(point);
        }
        return arr;
    } else {
        var car = _Cesium2.default.Cartographic.fromCartesian(positions);
        return _Cesium2.default.Cartesian3.fromRadians(car.longitude, car.latitude, height);
    }
}

/**
* 设置坐标中海拔高度为贴地或贴模型的高度（sampleHeight需要数据在视域内） 
*/
function updateHeightForClampToGround(position, calback) {
    var carto = _Cesium2.default.Cartographic.fromCartesian(position);
    var heightTerrain = viewer.scene.globe.getHeight(carto) || 0; //地形高度
    var heightTiles = viewer.scene.sampleHeight(carto) || 0; //模型高度
    var _heightNew = heightTiles > heightTerrain ? heightTiles : heightTerrain;
    if (_heightNew != null && _heightNew > 0) {
        var positionNew = _Cesium2.default.Cartesian3.fromRadians(carto.longitude, carto.latitude, _heightNew);
        return positionNew;
    }

    return position;
}

function hasPickedModel(pickedObject, noPickEntity) {
    if (_Cesium2.default.defined(pickedObject.id)) {
        //entity 
        var entity = pickedObject.id;
        if (entity._noMousePosition) return false; //排除标识不拾取的对象
        if (noPickEntity && entity == noPickEntity) return false;
    }

    if (_Cesium2.default.defined(pickedObject.primitive)) {
        //primitive
        var primitive = pickedObject.primitive;
        if (primitive._noMousePosition) return false; //排除标识不拾取的对象
        if (noPickEntity && primitive == noPickEntity) return false;
    }

    return true;
}

/**
 * 获取鼠标当前的屏幕坐标位置的三维Cesium坐标
 * @param {Cesium.Scene} scene 
 * @param {Cesium.Cartesian2} position 二维屏幕坐标位置
 * @param {Cesium.Entity} noPickEntity 排除的对象（主要用于绘制中，排除对自己本身的拾取）
 */
function getCurrentMousePosition(scene, position, noPickEntity) {
    var cartesian;

    //在模型上提取坐标  
    var pickedObject = scene.pick(position);
    if (scene.pickPositionSupported && _Cesium2.default.defined(pickedObject)) {
        //pickPositionSupported :判断是否支持深度拾取,不支持时无法进行鼠标交互绘制

        if (hasPickedModel(pickedObject, noPickEntity)) {
            var cartesian = scene.pickPosition(position);
            if (_Cesium2.default.defined(cartesian)) {
                var cartographic = _Cesium2.default.Cartographic.fromCartesian(cartesian);
                var height = cartographic.height; //模型高度
                if (height >= 0) return cartesian;

                //不是entity时，支持3dtiles地下
                if (!_Cesium2.default.defined(pickedObject.id) && height >= -500) return cartesian;
            }
        }
    }

    //测试scene.pickPosition和globe.pick的适用场景 https://zhuanlan.zhihu.com/p/44767866
    //1. globe.pick的结果相对稳定准确，不论地形深度检测开启与否，不论加载的是默认地形还是别的地形数据；
    //2. scene.pickPosition只有在开启地形深度检测，且不使用默认地形时是准确的。
    //注意点： 1. globe.pick只能求交地形； 2. scene.pickPosition不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。

    //提取鼠标点的地理坐标 
    if (scene.mode === _Cesium2.default.SceneMode.SCENE3D) {
        //三维模式下
        var pickRay = scene.camera.getPickRay(position);
        cartesian = scene.globe.pick(pickRay, scene);
    } else {
        //二维模式下
        cartesian = scene.camera.pickEllipsoid(position, scene.globe.ellipsoid);
    }
    return cartesian;
}

//提取地球中心点坐标
function getCenter(viewer, isToWgs) {
    var scene = viewer.scene;
    var target = pickCenterPoint(scene);
    var bestTarget = target;
    if (!bestTarget) {
        var globe = scene.globe;
        var carto = scene.camera.positionCartographic.clone();
        var height = globe.getHeight(carto);
        carto.height = height || 0;
        bestTarget = _Cesium2.default.Ellipsoid.WGS84.cartographicToCartesian(carto);
    }

    var result = formatPositon(bestTarget);
    if (isToWgs) result = viewer.mars.point2wgs(result); //坐标转换为wgs

    // 获取地球中心点世界位置  与  摄像机的世界位置  之间的距离
    var distance = _Cesium2.default.Cartesian3.distance(bestTarget, viewer.scene.camera.positionWC);
    result.cameraZ = distance;

    return result;
}

function pickCenterPoint(scene) {
    var canvas = scene.canvas;
    var center = new _Cesium2.default.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2);

    var ray = scene.camera.getPickRay(center);
    var target = scene.globe.pick(ray, scene);
    return target || scene.camera.pickEllipsoid(center);
}

//export function getLevel(viewer) {
//    var _layers = viewer.imageryLayers._layers;
//    if (_layers.length == 0) return -1;

//    var _imageryCache = _layers[0]._imageryCache;
//    var maxLevel = 0;
//    for (var i in _imageryCache) {
//        var imagery = _imageryCache[i];
//        if (imagery.level > maxLevel)
//            maxLevel = imagery.level;
//    } 
//    return maxLevel;
//}


//提取地球视域边界
function getExtent(viewer, isToWgs) {
    // 范围对象
    var extent = { xmin: 70, xmax: 140, ymin: 0, ymax: 55 }; //默认值：中国区域

    // 得到当前三维场景
    var scene = viewer.scene;

    // 得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var canvas = scene.canvas;

    // canvas左上角
    var car3_lt = viewer.camera.pickEllipsoid(new _Cesium2.default.Cartesian2(0, 0), ellipsoid);
    if (car3_lt) {
        // 在椭球体上
        var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
        extent.xmin = _Cesium2.default.Math.toDegrees(carto_lt.longitude);
        extent.ymax = _Cesium2.default.Math.toDegrees(carto_lt.latitude);
    } else {
        // 不在椭球体上 
        var xMax = canvas.width / 2;
        var yMax = canvas.height / 2;

        var car3_lt2;
        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
        for (var yIdx = 0; yIdx <= yMax; yIdx += 10) {
            var xIdx = yIdx <= xMax ? yIdx : xMax;
            car3_lt2 = viewer.camera.pickEllipsoid(new _Cesium2.default.Cartesian2(xIdx, yIdx), ellipsoid);
            if (car3_lt2) break;
        }
        if (car3_lt2) {
            var carto_lt = ellipsoid.cartesianToCartographic(car3_lt2);
            extent.xmin = _Cesium2.default.Math.toDegrees(carto_lt.longitude);
            extent.ymax = _Cesium2.default.Math.toDegrees(carto_lt.latitude);
        }
    }

    // canvas右下角
    var car3_rb = viewer.camera.pickEllipsoid(new _Cesium2.default.Cartesian2(canvas.width, canvas.height), ellipsoid);
    if (car3_rb) {
        // 在椭球体上
        var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmax = _Cesium2.default.Math.toDegrees(carto_rb.longitude);
        extent.ymin = _Cesium2.default.Math.toDegrees(carto_rb.latitude);
    } else {
        // 不在椭球体上
        var xMax = canvas.width / 2;
        var yMax = canvas.height / 2;

        var car3_rb2;
        // 这里每次10像素递减，一是10像素相差不大，二是为了提高程序运行效率
        for (var yIdx = canvas.height; yIdx >= yMax; yIdx -= 10) {
            var xIdx = yIdx >= xMax ? yIdx : xMax;
            car3_rb2 = viewer.camera.pickEllipsoid(new _Cesium2.default.Cartesian2(xIdx, yIdx), ellipsoid);
            if (car3_rb2) break;
        }
        if (car3_rb2) {
            var carto_rb = ellipsoid.cartesianToCartographic(car3_rb2);
            extent.xmax = _Cesium2.default.Math.toDegrees(carto_rb.longitude);
            extent.ymin = _Cesium2.default.Math.toDegrees(carto_rb.latitude);
        }
    }

    if (isToWgs) {
        //坐标转换为wgs
        var pt1 = viewer.mars.point2wgs({ x: extent.xmin, y: extent.ymin });
        extent.xmin = pt1.x;
        extent.ymin = pt1.y;

        var pt2 = viewer.mars.point2wgs({ x: extent.xmax, y: extent.ymax });
        extent.xmax = pt2.x;
        extent.ymax = pt2.y;
    }
    //交换
    if (extent.xmax < extent.xmin) {
        var temp = extent.xmax;
        extent.xmax = extent.xmin;
        extent.xmin = temp;
    }
    if (extent.ymax < extent.ymin) {
        var temp = extent.ymax;
        extent.ymax = extent.ymin;
        extent.ymin = temp;
    }

    return extent;
}

//提取相机视角范围参数 
function getCameraView(viewer, isToWgs) {
    var camera = viewer.camera;
    var position = camera.positionCartographic;

    var bookmark = {};
    bookmark.y = formatNum(_Cesium2.default.Math.toDegrees(position.latitude), 6);
    bookmark.x = formatNum(_Cesium2.default.Math.toDegrees(position.longitude), 6);
    bookmark.z = formatNum(position.height, 2);
    bookmark.heading = formatNum(_Cesium2.default.Math.toDegrees(camera.heading || -90), 1);
    bookmark.pitch = formatNum(_Cesium2.default.Math.toDegrees(camera.pitch || 0), 1);
    bookmark.roll = formatNum(_Cesium2.default.Math.toDegrees(camera.roll || 0), 1);

    if (isToWgs) bookmark = viewer.mars.point2wgs(bookmark); //坐标转换为wgs

    return bookmark;
}

//Turf求面的中心点 Cartographic
function centerOfMass(positions) {
    var coordinates = Util.cartesians2lonlats(positions);
    coordinates.push(coordinates[0]);

    var center = turf.centerOfMass(turf.polygon([coordinates]));
    return _Cesium2.default.Cartographic.fromDegrees(center.geometry.coordinates[0], center.geometry.coordinates[1]);
}

//绕点 环绕飞行
var windingPoint = exports.windingPoint = {
    isStart: false,
    viewer: null,
    start: function start(viewer, point) {
        if (!point) point = getCenter(viewer);

        this.viewer = viewer;
        this.position = _Cesium2.default.Cartesian3.fromDegrees(point.x, point.y, point.z);

        this.distance = point.distance || _Cesium2.default.Cartesian3.distance(this.position, viewer.camera.positionWC); // 给定相机距离点多少距离飞行 
        this.angle = 360 / (point.time || 60); //time：给定飞行一周所需时间(单位 秒)

        this.time = viewer.clock.currentTime.clone();
        this.heading = viewer.camera.heading; // 相机的当前heading
        this.pitch = viewer.camera.pitch;

        this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this);
        this.isStart = true;
    },
    clock_onTickHandler: function clock_onTickHandler(e) {
        var delTime = _Cesium2.default.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time); // 当前已经过去的时间，单位 秒
        var heading = _Cesium2.default.Math.toRadians(delTime * this.angle) + this.heading;

        this.viewer.scene.camera.setView({
            destination: this.position, // 点的坐标
            orientation: {
                heading: heading,
                pitch: this.pitch
            }
        });
        this.viewer.scene.camera.moveBackward(this.distance);
    },
    stop: function stop() {
        if (!this.isStart) return;

        if (this.viewer) this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this);
        this.isStart = false;
    }
};

//固定点 向四周旋转
var aroundPoint = exports.aroundPoint = {
    isStart: false,
    viewer: null,
    start: function start(viewer, point) {
        if (!point) point = getCenter(viewer);

        this.viewer = viewer;
        this.position = _Cesium2.default.Cartesian3.fromDegrees(point.x, point.y, point.z);

        this.angle = 360 / (point.time || 60); //time：给定飞行一周所需时间(单位 秒)

        this.time = viewer.clock.currentTime.clone();
        this.heading = viewer.camera.heading; // 相机的当前heading
        this.pitch = viewer.camera.pitch;

        this.viewer.clock.onTick.addEventListener(this.clock_onTickHandler, this);
        this.isStart = true;
    },
    clock_onTickHandler: function clock_onTickHandler(e) {
        // 当前已经过去的时间，单位s
        var delTime = _Cesium2.default.JulianDate.secondsDifference(this.viewer.clock.currentTime, this.time);
        var heading = _Cesium2.default.Math.toRadians(delTime * this.angle) + this.heading;
        viewer.scene.camera.setView({
            orientation: {
                heading: heading,
                pitch: this.pitch
            }
        });
    },
    stop: function stop() {
        if (!this.isStart) return;

        if (this.viewer) this.viewer.clock.onTick.removeEventListener(this.clock_onTickHandler, this);
        this.isStart = false;
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cancelFn = exports.requestFn = exports.emptyImageUrl = exports.isArray = exports.lastId = exports.create = exports.freeze = undefined;
exports.extend = extend;
exports.bind = bind;
exports.stamp = stamp;
exports.throttle = throttle;
exports.wrapNum = wrapNum;
exports.falseFn = falseFn;
exports.formatNum = formatNum;
exports.trim = trim;
exports.splitWords = splitWords;
exports.setOptions = setOptions;
exports.getParamString = getParamString;
exports.template = template;
exports.indexOf = indexOf;
exports.requestAnimFrame = requestAnimFrame;
exports.cancelAnimFrame = cancelAnimFrame;
exports.removeGeoJsonDefVal = removeGeoJsonDefVal;
exports.addGeoJsonDefVal = addGeoJsonDefVal;
exports.cartesians2lonlats = cartesians2lonlats;
exports.cartesian2lonlat = cartesian2lonlat;
exports.getPositionByGeoJSON = getPositionByGeoJSON;
exports.lonlat2cartesian = lonlat2cartesian;
exports.lonlats2cartesians = lonlats2cartesians;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _util = __webpack_require__(4);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var freeze = exports.freeze = Object.freeze;
Object.freeze = function (obj) {
    return obj;
};

// @function extend(dest: Object, src?: Object): Object
// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
function extend(dest) {
    var i, j, len, src;

    for (j = 1, len = arguments.length; j < len; j++) {
        src = arguments[j];
        for (i in src) {
            dest[i] = src[i];
        }
    }
    return dest;
}

// @function create(proto: Object, properties?: Object): Object
// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
var create = exports.create = Object.create || function () {
    function F() {}
    return function (proto) {
        F.prototype = proto;
        return new F();
    };
}();

// @function bind(fn: Function, …): Function
// Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
// Has a `L.bind()` shortcut.
function bind(fn, obj) {
    var slice = Array.prototype.slice;

    if (fn.bind) {
        return fn.bind.apply(fn, slice.call(arguments, 1));
    }

    var args = slice.call(arguments, 2);

    return function () {
        return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
    };
}

// @property lastId: Number
// Last unique ID used by [`stamp()`](#util-stamp)
var lastId = exports.lastId = 0;

// @function stamp(obj: Object): Number
// Returns the unique ID of an object, assigning it one if it doesn't have it.
function stamp(obj) {
    /*eslint-disable */
    obj._leaflet_id = obj._leaflet_id || (exports.lastId = lastId += 1);
    return obj._leaflet_id;
    /* eslint-enable */
}

// @function throttle(fn: Function, time: Number, context: Object): Function
// Returns a function which executes function `fn` with the given scope `context`
// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
// `fn` will be called no more than one time per given amount of `time`. The arguments
// received by the bound function will be any arguments passed when binding the
// function, followed by any arguments passed when invoking the bound function.
// Has an `L.throttle` shortcut.
function throttle(fn, time, context) {
    var lock, args, wrapperFn, later;

    later = function later() {
        // reset lock and call if queued
        lock = false;
        if (args) {
            wrapperFn.apply(context, args);
            args = false;
        }
    };

    wrapperFn = function wrapperFn() {
        if (lock) {
            // called too soon, queue to call later
            args = arguments;
        } else {
            // call and lock until later
            fn.apply(context, arguments);
            setTimeout(later, time);
            lock = true;
        }
    };

    return wrapperFn;
}

// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
// Returns the number `num` modulo `range` in such a way so it lies within
// `range[0]` and `range[1]`. The returned value will be always smaller than
// `range[1]` unless `includeMax` is set to `true`.
function wrapNum(x, range, includeMax) {
    var max = range[1],
        min = range[0],
        d = max - min;
    return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
}

// @function falseFn(): Function
// Returns a function which always returns `false`.
function falseFn() {
    return false;
}

// @function formatNum(num: Number, digits?: Number): Number
// Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
function formatNum(num, digits) {
    //var pow = Math.pow(10, (digits === undefined ? 6 : digits));
    //return Math.round(num * pow) / pow;
    return Number(num.toFixed(digits || 0));
}

// @function trim(str: String): String
// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
function splitWords(str) {
    return trim(str).split(/\s+/);
}

// @function setOptions(obj: Object, options: Object): Object
// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
function setOptions(obj, options) {
    if (!obj.hasOwnProperty('options')) {
        obj.options = obj.options ? create(obj.options) : {};
    }
    for (var i in options) {
        obj.options[i] = options[i];
    }
    return obj.options;
}

// @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
// Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
// translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
// be appended at the end. If `uppercase` is `true`, the parameter names will
// be uppercased (e.g. `'?A=foo&B=bar'`)
function getParamString(obj, existingUrl, uppercase) {
    var params = [];
    for (var i in obj) {
        params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
    }
    return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
}

var templateRe = /\{ *([\w_-]+) *\}/g;

// @function template(str: String, data: Object): String
// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
// `('Hello foo, bar')`. You can also specify functions instead of strings for
// data values — they will be evaluated passing `data` as an argument.
function template(str, data) {
    return str.replace(templateRe, function (str, key) {
        var value = data[key];

        if (value === undefined) {
            throw new Error('No value provided for variable ' + str);
        } else if (typeof value === 'function') {
            value = value(data);
        }
        return value;
    });
}

// @function isArray(obj): Boolean
// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
var isArray = exports.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

// @function indexOf(array: Array, el: Object): Number
// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
function indexOf(array, el) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === el) {
            return i;
        }
    }
    return -1;
}

// @property emptyImageUrl: String
// Data URI string containing a base64-encoded empty GIF image.
// Used as a hack to free memory from unused images on WebKit-powered
// mobile devices (by setting image `src` to this string).
var emptyImageUrl = exports.emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

function getPrefixed(name) {
    return window['webkit' + name] || window['moz' + name] || window['ms' + name];
}

var lastTime = 0;

// fallback for IE 7-8
function timeoutDefer(fn) {
    var time = +new Date(),
        timeToCall = Math.max(0, 16 - (time - lastTime));

    lastTime = time + timeToCall;
    return window.setTimeout(fn, timeToCall);
}

var requestFn = exports.requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
var cancelFn = exports.cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') || getPrefixed('CancelRequestAnimationFrame') || function (id) {
    window.clearTimeout(id);
};

// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
// `context` if given. When `immediate` is set, `fn` is called immediately if
// the browser doesn't have native support for
// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
function requestAnimFrame(fn, context, immediate) {
    if (immediate && requestFn === timeoutDefer) {
        fn.call(context);
    } else {
        return requestFn.call(window, bind(fn, context));
    }
}

// @function cancelAnimFrame(id: Number): undefined
// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
function cancelAnimFrame(id) {
    if (id) {
        cancelFn.call(window, id);
    }
}

//从plot的 标号默认值F12打印 拷贝，方便读取
var configDefval = { "label": { "edittype": "label", "name": "文字", "style": { "text": "文字", "color": "#ffffff", "opacity": 1, "font_family": "楷体", "font_size": 30, "border": true, "border_color": "#000000", "border_width": 3, "background": false, "background_color": "#000000", "background_opacity": 0.5, "font_weight": "normal", "font_style": "normal", "scaleByDistance": false, "scaleByDistance_far": 1000000, "scaleByDistance_farValue": 0.1, "scaleByDistance_near": 1000, "scaleByDistance_nearValue": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 10000, "distanceDisplayCondition_near": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "point": { "edittype": "point", "name": "点标记", "style": { "pixelSize": 10, "color": "#3388ff", "opacity": 1, "outline": true, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "outlineWidth": 2, "scaleByDistance": false, "scaleByDistance_far": 1000000, "scaleByDistance_farValue": 0.1, "scaleByDistance_near": 1000, "scaleByDistance_nearValue": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 10000, "distanceDisplayCondition_near": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "imagepoint": { "edittype": "imagepoint", "name": "图标点标记", "style": { "image": "", "opacity": 1, "scale": 1, "rotation": 0, "scaleByDistance": false, "scaleByDistance_far": 1000000, "scaleByDistance_farValue": 0.1, "scaleByDistance_near": 1000, "scaleByDistance_nearValue": 1, "distanceDisplayCondition": false, "distanceDisplayCondition_far": 10000, "distanceDisplayCondition_near": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "model": { "edittype": "model", "name": "模型", "style": { "modelUrl": "", "scale": 1, "heading": 0, "pitch": 0, "roll": 0, "fill": false, "color": "#3388ff", "opacity": 1, "silhouette": false, "silhouetteColor": "#ffffff", "silhouetteSize": 2, "silhouetteAlpha": 0.8 }, "attr": { "id": "", "name": "", "remark": "" } }, "polyline": { "edittype": "polyline", "name": "线", "position": { "minCount": 2 }, "style": { "lineType": "solid", "color": "#3388ff", "width": 4, "clampToGround": false, "outline": false, "outlineColor": "#ffffff", "outlineWidth": 2, "opacity": 1, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "polylineVolume": { "edittype": "polylineVolume", "name": "管道线", "position": { "height": true, "minCount": 2 }, "style": { "color": "#00FF00", "radius": 10, "shape": "pipeline", "outline": false, "outlineColor": "#ffffff", "opacity": 1 }, "attr": { "id": "", "name": "", "remark": "" } }, "polygon": { "edittype": "polygon", "name": "面", "position": { "height": true, "minCount": 3 }, "style": { "fill": true, "color": "#3388ff", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "clampToGround": false, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "polygon_clampToGround": { "edittype": "polygon_clampToGround", "name": "贴地面", "position": { "height": false, "minCount": 3 }, "style": { "color": "#ffff00", "opacity": 0.6, "clampToGround": true, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "extrudedPolygon": { "edittype": "extrudedPolygon", "name": "拉伸面", "position": { "height": true, "minCount": 3 }, "style": { "fill": true, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "extrudedHeight": 100, "perPositionHeight": true, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "rectangle": { "edittype": "rectangle", "name": "矩形", "position": { "height": false, "minCount": 2, "maxCount": 2 }, "style": { "height": 0, "fill": true, "color": "#3388ff", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "clampToGround": false, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "rectangle_clampToGround": { "edittype": "rectangle_clampToGround", "name": "贴地矩形", "position": { "height": false, "minCount": 2, "maxCount": 2 }, "style": { "color": "#ffff00", "opacity": 0.6, "rotation": 0, "clampToGround": true, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "rectangleImg": { "edittype": "rectangleImg", "name": "贴地图片", "position": { "height": false, "minCount": 2, "maxCount": 2 }, "style": { "image": "", "opacity": 1, "rotation": 0, "clampToGround": true, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "extrudedRectangle": { "edittype": "extrudedRectangle", "name": "拉伸矩形", "position": { "height": false, "minCount": 2, "maxCount": 2 }, "style": { "extrudedHeight": 40, "height": 0, "fill": true, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "ellipse": { "edittype": "ellipse", "name": "椭圆", "position": { "height": false }, "style": { "semiMinorAxis": 200, "semiMajorAxis": 200, "height": 0, "fill": true, "color": "#3388ff", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "clampToGround": false, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "ellipse_clampToGround": { "edittype": "ellipse_clampToGround", "name": "椭圆", "position": { "height": false }, "style": { "semiMinorAxis": 200, "semiMajorAxis": 200, "color": "#ffff00", "opacity": 0.6, "rotation": 0, "clampToGround": true, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "extrudedEllipse": { "edittype": "extrudedEllipse", "name": "圆柱体", "position": { "height": false }, "style": { "semiMinorAxis": 200, "semiMajorAxis": 200, "extrudedHeight": 200, "height": 0, "fill": true, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6, "rotation": 0, "zIndex": 0 }, "attr": { "id": "", "name": "", "remark": "" } }, "ellipsoid": { "edittype": "ellipsoid", "name": "球体", "style": { "extentRadii": 200, "widthRadii": 200, "heightRadii": 200, "fill": true, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6 }, "attr": { "id": "", "name": "", "remark": "" } }, "wall": { "edittype": "wall", "name": "墙体", "position": { "height": true, "minCount": 2 }, "style": { "extrudedHeight": 40, "fill": true, "color": "#00FF00", "opacity": 0.6, "outline": true, "outlineWidth": 1, "outlineColor": "#ffffff", "outlineOpacity": 0.6 }, "attr": { "id": "", "name": "", "remark": "" } } };

//剔除与默认值相同的值
function removeGeoJsonDefVal(geojson) {
    if (!geojson.properties || !geojson.properties.type) return geojson;

    var type = geojson.properties.edittype || geojson.properties.type;
    var def = configDefval[type];
    if (!def) return geojson;

    var newgeojson = util.clone(geojson);
    if (geojson.properties.style) {
        var newstyle = {};
        for (var i in geojson.properties.style) {
            var val = geojson.properties.style[i];
            if (val == null) continue;

            var valDef = def.style[i];
            if (valDef === val) continue;
            newstyle[i] = val;
        }
        newgeojson.properties.style = newstyle;
    }

    if (geojson.properties.attr) {
        var newattr = {};
        for (var i in geojson.properties.attr) {
            var val = geojson.properties.attr[i];
            if (val == null) continue;

            var valDef = def.attr[i];
            if (valDef === val) continue;

            newattr[i] = val;
        }
        newgeojson.properties.attr = newattr;
    }

    return newgeojson;
}

function addGeoJsonDefVal(properties) {
    //赋默认值 
    var def = configDefval[properties.edittype || properties.type];
    if (def) {
        properties.style = properties.style || {};
        for (var key in def.style) {
            var val = properties.style[key];
            if (val != null) continue;

            properties.style[key] = def.style[key];
        }

        properties.attr = properties.attr || {};
        for (var key in def.attr) {
            var val = properties.attr[key];
            if (val != null) continue;

            properties.attr[key] = def.attr[key];
        }
    }
    return properties;
}

//数组，cesium坐标 转 经纬度坐标【用于转geojson】
function cartesians2lonlats(positions) {
    var coordinates = [];
    for (var i = 0, len = positions.length; i < len; i++) {
        var point = cartesian2lonlat(positions[i]);
        coordinates.push(point);
    }
    return coordinates;
}

//cesium坐标 转 经纬度坐标【用于转geojson】
function cartesian2lonlat(cartesian) {
    var carto = _Cesium2.default.Cartographic.fromCartesian(cartesian);
    if (carto == null) return {};

    var x = formatNum(_Cesium2.default.Math.toDegrees(carto.longitude), 6);
    var y = formatNum(_Cesium2.default.Math.toDegrees(carto.latitude), 6);
    var z = formatNum(carto.height, 2);

    return [x, y, z];
}

//geojson转entity
function getPositionByGeoJSON(geojson, defHeight) {
    var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
        coords = geometry ? geometry.coordinates : null;

    if (!coords && !geometry) {
        return null;
    }

    switch (geometry.type) {
        case 'Point':
            return lonlat2cartesian(coords, defHeight);
        case 'MultiPoint':
        case 'LineString':
            return lonlats2cartesians(coords, defHeight);

        case 'MultiLineString':
        case 'Polygon':
            return lonlats2cartesians(coords[0], defHeight);
        case 'MultiPolygon':
            return lonlats2cartesians(coords[0][0], defHeight);
        default:
            throw new Error('Invalid GeoJSON object.');
    }
}

//经纬度坐标转cesium坐标
function lonlat2cartesian(coord, defHeight) {
    return _Cesium2.default.Cartesian3.fromDegrees(coord[0], coord[1], coord[2] || defHeight || 0);
}

//数组，经纬度坐标转cesium坐标
function lonlats2cartesians(coords, defHeight) {
    var arr = [];
    for (var i = 0, len = coords.length; i < len; i++) {
        var item = coords[i];
        if (isArray(item[0])) arr.push(lonlats2cartesians(item, defHeight));else arr.push(lonlat2cartesian(item, defHeight));
    }
    return arr;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.message = undefined;
exports.Tooltip = Tooltip;

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//样式文件在map.css
var message = exports.message = {
    draw: {
        point: {
            start: '单击 完成绘制'
        },
        polyline: { //线面
            start: '单击 开始绘制',
            cont: '单击增加点，右击删除点',
            end: '单击增加点，右击删除点<br/>双击完成绘制',
            end2: '单击完成绘制'
        }
    },
    edit: {
        start: '单击后 激活编辑',
        end: '释放后 完成修改'
    },
    dragger: {
        def: '拖动 修改位置', //默认  
        addMidPoint: '拖动 增加点',
        moveHeight: '拖动 修改高度',
        editRadius: '拖动 修改半径',
        editHeading: '拖动 修改方向',
        editScale: '拖动 修改缩放比例'
    },
    del: {
        def: '<br/>右击 删除该点',
        min: '无法删除，点数量不能少于'
    }
};

function Tooltip(frameDiv) {
    var div = document.createElement('DIV');
    div.className = "draw-tooltip right";

    var arrow = document.createElement('DIV');
    arrow.className = "draw-tooltip-arrow";
    div.appendChild(arrow);

    var title = document.createElement('DIV');
    title.className = "draw-tooltip-inner";
    div.appendChild(title);

    this._div = div;
    this._title = title;

    // add to frame div and display coordinates
    frameDiv.appendChild(div);

    //鼠标的移入
    (0, _jquery2.default)(".draw-tooltip").mouseover(function () {
        (0, _jquery2.default)(this).hide();
    });
}

Tooltip.prototype.setVisible = function (visible) {
    this._div.style.display = visible ? 'block' : 'none';
};

Tooltip.prototype.showAt = function (position, message) {
    if (position && message) {
        this.setVisible(true);

        this._title.innerHTML = message;
        this._div.style.top = position.y - this._div.clientHeight / 2 + "px";

        //left css时
        //this._div.style.left = (position.x - this._div.clientWidth - 30) + "px"; 

        //right css时
        this._div.style.left = position.x + 30 + "px";
    } else {
        this.setVisible(false);
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProxyUrl = exports.checkToken = exports.getLinkedPointList = exports.formatDegree = exports.createModel = exports.getTerrainProvider = exports.getEllipsoidTerrain = exports.terrainPolyline = exports.webglreport = exports.getExplorerInfo = exports.template = exports.clone = exports.isPCBroswer = exports.msg = exports.alert = exports.isString = exports.isNumber = exports.getRequestByName = exports.getRequest = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* 2017-9-18 15:04:56 | 修改 木遥（QQ：346819890） */


var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isNumber(obj) {
    return typeof obj == 'number' && obj.constructor == Number;
}

function isString(str) {
    return typeof str == 'string' && str.constructor == String;
}

function alert(msg, title) {
    if (window.haoutil && window.haoutil.alert) //此方法需要引用haoutil 
        window.haoutil.alert(msg);else if (window.layer) //此方法需要引用layer.js
        layer.alert(msg, {
            title: title || '提示',
            skin: 'layui-layer-lan layer-mars-dialog',
            closeBtn: 0,
            anim: 0
        });else alert(msg);
};

function msg(msg) {
    if (window.haoutil && window.haoutil.msg) //此方法需要引用haoutil 
        window.haoutil.msg(msg);else if (window.toastr) //此方法需要引用toastr 
        toastr.info(msg);else if (window.layer) layer.msg(msg); //此方法需要引用layer.js
    else alert(msg);
};

//url参数获取
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串   
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function getRequestByName(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function clone(obj) {
    if (null == obj || "object" != (typeof obj === 'undefined' ? 'undefined' : _typeof(obj))) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
        var copy = {};
        for (var attr in obj) {
            if (attr == "_layer" || attr == "_layers" || attr == "_parent") continue;

            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    return obj;
}

function template(str, data) {
    if (str == null) return str;

    for (var col in data) {
        var showval = data[col];
        if (showval == null || showval == 'Null' || showval == 'Unknown') showval = "";

        str = str.replace(new RegExp('{' + col + '}', "gm"), showval);
    }
    return str;
}

function isPCBroswer() {
    var sUserAgent = navigator.userAgent.toLowerCase();

    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone/i) == "iphone";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return false;
    } else {
        return true;
    }
}

//获取浏览器类型及版本
function getExplorerInfo() {
    var explorer = window.navigator.userAgent.toLowerCase();
    //ie 
    if (explorer.indexOf("msie") >= 0) {
        var ver = Number(explorer.match(/msie ([\d]+)/)[1]);
        return { type: "IE", version: ver };
    }
    //firefox 
    else if (explorer.indexOf("firefox") >= 0) {
            var ver = Number(explorer.match(/firefox\/([\d]+)/)[1]);
            return { type: "Firefox", version: ver };
        }
        //Chrome
        else if (explorer.indexOf("chrome") >= 0) {
                var ver = Number(explorer.match(/chrome\/([\d]+)/)[1]);
                return { type: "Chrome", version: ver };
            }
            //Opera
            else if (explorer.indexOf("opera") >= 0) {
                    var ver = Number(explorer.match(/opera.([\d]+)/)[1]);
                    return { type: "Opera", version: ver };
                }
                //Safari
                else if (explorer.indexOf("Safari") >= 0) {
                        var ver = Number(explorer.match(/version\/([\d]+)/)[1]);
                        return { type: "Safari", version: ver };
                    }
    return { type: explorer, version: -1 };
}

//检测浏览器webgl支持
function webglreport() {
    var exinfo = getExplorerInfo();
    if (exinfo.type == "IE" && exinfo.version < 11) {
        return false;
    }

    try {
        var glContext;
        var canvas = document.createElement('canvas');
        var requestWebgl2 = typeof WebGL2RenderingContext !== 'undefined';
        if (requestWebgl2) {
            glContext = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2') || undefined;
        }
        if (glContext == null) {
            glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || undefined;
        }
        if (glContext == null) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}

//计算贴地路线
function terrainPolyline(params) {
    var viewer = params.viewer;
    var positions = params.positions;
    if (positions == null || positions.length == 0) {
        if (params.calback) params.calback(positions);
        return;
    }

    var flatPositions = _Cesium2.default.PolylinePipeline.generateArc({
        positions: positions,
        granularity: params.granularity || 0.00001
    });

    var cartographicArray = [];
    var ellipsoid = viewer.scene.globe.ellipsoid;
    for (var i = 0; i < flatPositions.length; i += 3) {
        var cartesian = _Cesium2.default.Cartesian3.unpack(flatPositions, i);
        cartographicArray.push(ellipsoid.cartesianToCartographic(cartesian));
    }

    //用于缺少地形数据时，赋值的高度
    var tempHeight = _Cesium2.default.Cartographic.fromCartesian(positions[0]).height;

    _Cesium2.default.when(_Cesium2.default.sampleTerrainMostDetailed(viewer.terrainProvider, cartographicArray), function (samples) {
        var noHeight = false;
        var offset = params.offset || 2; //增高高度，便于可视

        for (var i = 0; i < samples.length; ++i) {
            if (samples[i].height == null) {
                noHeight = true;
                samples[i].height = tempHeight;
            } else {
                samples[i].height = offset + samples[i].height * viewer.scene._terrainExaggeration;
            }
        }

        var raisedPositions = ellipsoid.cartographicArrayToCartesianArray(samples);
        if (params.calback) params.calback(raisedPositions, noHeight);else if (positions.setValue) positions.setValue(raisedPositions);
    });
}

function getProxyUrl(config) {
    if (!config.proxy || !config.url) return config;
    if (config.url instanceof _Cesium2.default.Resource) return config;

    var opts = {};
    for (var key in config) {
        opts[key] = config[key];
    }
    opts.url = new _Cesium2.default.Resource({
        url: opts.url,
        proxy: new _Cesium2.default.DefaultProxy(opts.proxy)
    });

    return opts;
}

//地形构造
var _ellipsoid = new _Cesium2.default.EllipsoidTerrainProvider({
    ellipsoid: _Cesium2.default.Ellipsoid.WGS84
});
function getEllipsoidTerrain() {
    return _ellipsoid;
}
function getTerrainProvider(cfg) {
    if (!cfg.hasOwnProperty("requestWaterMask")) cfg.requestWaterMask = true;
    if (!cfg.hasOwnProperty("requestVertexNormals")) cfg.requestVertexNormals = true;

    var terrainProvider;

    if (cfg.type == "ion" || cfg.url == "ion" || cfg.url == "" || cfg.url == null) {
        terrainProvider = new _Cesium2.default.CesiumTerrainProvider({
            url: _Cesium2.default.IonResource.fromAssetId(1)
        });
    } else if (cfg.type == "ellipsoid" || cfg.url == "ellipsoid") {
        terrainProvider = _ellipsoid;
    } else if (cfg.type == "gee") {
        //谷歌地球地形服务
        terrainProvider = new _Cesium2.default.GoogleEarthEnterpriseTerrainProvider({
            metadata: new _Cesium2.default.GoogleEarthEnterpriseMetadata(getProxyUrl(cfg))
        });
    } else {
        terrainProvider = new _Cesium2.default.CesiumTerrainProvider(getProxyUrl(cfg));
    }
    return terrainProvider;
}

//创建模型
function createModel(cfg, viewer) {
    cfg = viewer.mars.point2map(cfg); //转换坐标系

    var position = _Cesium2.default.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);

    var heading = _Cesium2.default.Math.toRadians(cfg.heading || 0);
    var pitch = _Cesium2.default.Math.toRadians(cfg.pitch || 0);
    var roll = _Cesium2.default.Math.toRadians(cfg.roll || 0);
    var hpr = new _Cesium2.default.HeadingPitchRoll(heading, pitch, roll);

    var converter = cfg.converter || _Cesium2.default.Transforms.eastNorthUpToFixedFrame;
    var orientation = _Cesium2.default.Transforms.headingPitchRollQuaternion(position, hpr, viewer.scene.globe.ellipsoid, converter);

    var model = viewer.entities.add({
        name: cfg.name || "",
        position: position,
        orientation: orientation,
        model: cfg,
        tooltip: cfg.tooltip,
        popup: cfg.popup
    });
    return model;
}

function formatDegree(value) {
    value = Math.abs(value);
    var v1 = Math.floor(value); //度  
    var v2 = Math.floor((value - v1) * 60); //分  
    var v3 = Math.round((value - v1) * 3600 % 60); //秒  
    return v1 + '° ' + v2 + '\'  ' + v3 + '"';
};

function checkToken(token) {
    var nowTime = new Date().getTime();
    var lastTime = Number(window.localStorage.getItem('tokenTime1987') || nowTime);
    var startTime = new Date(token.start).getTime();
    var endTime = new Date(token.end).getTime();

    if (token.hostname && window.location.hostname.indexOf(token.hostname) === -1 || nowTime <= startTime || nowTime >= endTime || lastTime <= startTime || lastTime >= endTime) {
        if (window.layer) layer.open({
            type: 1,
            title: unescape('%u8BB8%u53EF%u5230%u671F%u63D0%u793A'), //"许可到期提示",
            skin: "layer-mars-dialog",
            shade: [1, '#000'],
            closeBtn: 0,
            resize: false,
            area: ['400px', '150px'], //宽高
            content: '<div style="margin: 20px;">' + token.msg + '</div>'
        });else alert(token.msg);
        return false;
    } else {
        window.localStorage.setItem('tokenTime1987', nowTime);
        setTimeout(function () {
            checkToken(token);
        }, 600000 + Math.random() * 600000); //随机10分钟-20分钟内再次校验
        return true;
    }
}

/**
 * 计算曲线链路的点集（a点到b点的，空中曲线）
 * @param startPoint 开始节点
 * @param endPoint 结束节点
 * @param angularityFactor 曲率
 * @param numOfSingleLine 点集数量
 * @returns {Array}
 */
function getLinkedPointList(startPoint, endPoint, angularityFactor, numOfSingleLine) {
    var result = [];

    var startPosition = _Cesium2.default.Cartographic.fromCartesian(startPoint);
    var endPosition = _Cesium2.default.Cartographic.fromCartesian(endPoint);

    var startLon = startPosition.longitude * 180 / Math.PI;
    var startLat = startPosition.latitude * 180 / Math.PI;
    var endLon = endPosition.longitude * 180 / Math.PI;
    var endLat = endPosition.latitude * 180 / Math.PI;

    var dist = Math.sqrt((startLon - endLon) * (startLon - endLon) + (startLat - endLat) * (startLat - endLat));

    //var dist = Cesium.Cartesian3.distance(startPoint, endPoint);
    var angularity = dist * angularityFactor;

    var startVec = _Cesium2.default.Cartesian3.clone(startPoint);
    var endVec = _Cesium2.default.Cartesian3.clone(endPoint);

    var startLength = _Cesium2.default.Cartesian3.distance(startVec, _Cesium2.default.Cartesian3.ZERO);
    var endLength = _Cesium2.default.Cartesian3.distance(endVec, _Cesium2.default.Cartesian3.ZERO);

    _Cesium2.default.Cartesian3.normalize(startVec, startVec);
    _Cesium2.default.Cartesian3.normalize(endVec, endVec);

    if (_Cesium2.default.Cartesian3.distance(startVec, endVec) == 0) {
        return result;
    }

    //var cosOmega = Cesium.Cartesian3.dot(startVec, endVec);
    //var omega = Math.acos(cosOmega);

    var omega = _Cesium2.default.Cartesian3.angleBetween(startVec, endVec);

    result.push(startPoint);
    for (var i = 1; i < numOfSingleLine - 1; i++) {
        var t = i * 1.0 / (numOfSingleLine - 1);
        var invT = 1 - t;

        var startScalar = Math.sin(invT * omega) / Math.sin(omega);
        var endScalar = Math.sin(t * omega) / Math.sin(omega);

        var startScalarVec = _Cesium2.default.Cartesian3.multiplyByScalar(startVec, startScalar, new _Cesium2.default.Cartesian3());
        var endScalarVec = _Cesium2.default.Cartesian3.multiplyByScalar(endVec, endScalar, new _Cesium2.default.Cartesian3());

        var centerVec = _Cesium2.default.Cartesian3.add(startScalarVec, endScalarVec, new _Cesium2.default.Cartesian3());

        var ht = t * Math.PI;
        var centerLength = startLength * invT + endLength * t + Math.sin(ht) * angularity;
        centerVec = _Cesium2.default.Cartesian3.multiplyByScalar(centerVec, centerLength, centerVec);

        result.push(centerVec);
    }

    result.push(endPoint);

    return result;
}

//===========模块对外公开的属性及方法=========
exports.getRequest = getRequest;
exports.getRequestByName = getRequestByName;
exports.isNumber = isNumber;
exports.isString = isString;
exports.alert = alert;
exports.msg = msg;
exports.isPCBroswer = isPCBroswer;
exports.clone = clone;
exports.template = template;
exports.getExplorerInfo = getExplorerInfo;
exports.webglreport = webglreport;
exports.terrainPolyline = terrainPolyline;
exports.getEllipsoidTerrain = getEllipsoidTerrain;
exports.getTerrainProvider = getTerrainProvider;
exports.createModel = createModel;
exports.formatDegree = formatDegree;
exports.getLinkedPointList = getLinkedPointList;
exports.checkToken = checkToken;
exports.getProxyUrl = getProxyUrl;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PointColor = exports.PointType = exports.PixelSize = undefined;
exports.createDragger = createDragger;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Tooltip = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//拖拽点控制类
var PixelSize = exports.PixelSize = 12; //编辑点的像素大小

//拖拽点分类
var PointType = exports.PointType = {
    Control: 1, //位置控制
    AddMidPoint: 2, //辅助增加新点
    MoveHeight: 3, //上下移动高度
    EditAttr: 4, //辅助修改属性（如半径）
    EditRotation: 5 //旋转角度修改


    //拖拽点分类
};var PointColor = exports.PointColor = {
    Control: new _Cesium2.default.Color.fromCssColorString("#1c197d"), //位置控制拖拽点
    MoveHeight: new _Cesium2.default.Color.fromCssColorString("#9500eb"), //上下移动高度的拖拽点
    EditAttr: new _Cesium2.default.Color.fromCssColorString("#f73163"), //辅助修改属性（如半径）的拖拽点
    AddMidPoint: new _Cesium2.default.Color.fromCssColorString("#04c2c9").withAlpha(0.3) //增加新点，辅助拖拽点
};

function getAttrForType(type, attr) {
    switch (type) {
        case PointType.AddMidPoint:
            attr.color = PointColor.AddMidPoint;
            attr.outlineColor = new _Cesium2.default.Color.fromCssColorString("#ffffff").withAlpha(0.4);
            break;
        case PointType.MoveHeight:
            attr.color = PointColor.MoveHeight;
            break;
        case PointType.EditAttr:
            attr.color = PointColor.EditAttr;
            break;
        case PointType.Control:
        default:
            attr.color = PointColor.Control;
            break;
    }
    return attr;
}

/** 创建Dragger拖动点的公共方法 */
function createDragger(dataSource, options) {
    var dragger;
    if (options.dragger) {
        dragger = options.dragger;
    } else {
        var attr = {
            scale: 1,
            pixelSize: PixelSize,
            outlineColor: new _Cesium2.default.Color.fromCssColorString("#ffffff").withAlpha(0.5),
            outlineWidth: 2,
            scaleByDistance: new _Cesium2.default.NearFarScalar(1000, 1, 1000000, 0.5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY //一直显示，不被地形等遮挡
        };
        attr = getAttrForType(options.type, attr);

        dragger = dataSource.entities.add({
            position: _Cesium2.default.defaultValue(options.position, _Cesium2.default.Cartesian3.ZERO),
            point: attr,
            draw_tooltip: options.tooltip || _Tooltip.message.dragger.def
        });
    }

    dragger._isDragger = true;
    dragger._pointType = options.type || PointType.Control; //默认是位置控制拖拽点

    dragger.onDragStart = _Cesium2.default.defaultValue(options.onDragStart, null);
    dragger.onDrag = _Cesium2.default.defaultValue(options.onDrag, null);
    dragger.onDragEnd = _Cesium2.default.defaultValue(options.onDragEnd, null);

    return dragger;
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseLayer = undefined;

var _Class = __webpack_require__(10);

var _util = __webpack_require__(4);

var BaseLayer = _Class.Class.extend({
    config: {}, //配置的config信息 
    viewer: null,
    initialize: function initialize(cfg, viewer) {
        this.viewer = viewer;
        this.config = cfg;

        this.name = cfg.name;
        if (this.config.hasOwnProperty("alpha")) this._opacity = Number(this.config.alpha);else if (this.config.hasOwnProperty("opacity")) //兼容opacity参数来配置
            this._opacity = Number(this.config.opacity);

        if (this.config.hasOwnProperty("hasOpacity")) this.hasOpacity = this.config.hasOpacity;

        this.create();
        if (cfg.visible) this.setVisible(true);else this._visible = false;

        if (cfg.visible && cfg.flyTo) {
            this.centerAt(0);
        }
    },
    create: function create() {},
    showError: function showError(title, error) {
        if (!error) error = '未知错误';

        if (this.viewer) this.viewer.cesiumWidget.showErrorPanel(title, undefined, error);

        console.log('layer错误:' + title + error);
    },
    //显示隐藏控制
    _visible: null,
    getVisible: function getVisible() {
        return this._visible;
    },
    setVisible: function setVisible(val) {
        if (this._visible != null && this._visible == val) return;
        this._visible = val;

        if (val) {
            if (this.config.msg) (0, _util.msg)(this.config.msg);

            this.add();
        } else this.remove();
    },
    //添加 
    add: function add() {
        this._visible = true;

        if (this.config.onAdd) {
            this.config.onAdd();
        }
    },
    //移除
    remove: function remove() {
        this._visible = false;

        if (this.config.onRemove) {
            this.config.onRemove();
        }
    },
    //定位至数据区域
    centerAt: function centerAt(duration) {
        if (this.config.extent || this.config.center) {
            this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
        } else if (this.config.onCenterAt) {
            this.config.onCenterAt(duration);
        }
    },
    hasOpacity: false,
    _opacity: 1,
    //设置透明度
    setOpacity: function setOpacity(value) {
        if (this.config.onSetOpacity) {
            this.config.onSetOpacity(value);
        }
    },
    hasZIndex: false,
    //设置叠加顺序
    setZIndex: function setZIndex(value) {
        if (this.config.onSetZIndex) {
            this.config.onSetZIndex(value);
        }
    },
    destroy: function destroy() {
        this.setVisible(false);
    }

});

exports.BaseLayer = BaseLayer;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//事件类型

var DrawStart = exports.DrawStart = 'draw-start'; //开始绘制
var DrawAddPoint = exports.DrawAddPoint = 'draw-add-point'; //绘制过程中增加了点
var DrawRemovePoint = exports.DrawRemovePoint = 'draw-remove-lastpoint'; //绘制过程中删除了last点
var DrawMouseMove = exports.DrawMouseMove = 'draw-mouse-move'; //绘制过程中鼠标移动了点
var DrawCreated = exports.DrawCreated = 'draw-created'; //创建完成


var EditStart = exports.EditStart = 'edit-start'; //开始编辑
var EditMovePoint = exports.EditMovePoint = 'edit-move-point'; //编辑修改了点
var EditRemovePoint = exports.EditRemovePoint = 'edit-remove-point'; //编辑删除了点
var EditStop = exports.EditStop = 'edit-stop'; //停止编辑

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPolyline = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawBase = __webpack_require__(26);

var _point = __webpack_require__(1);

var _EventType = __webpack_require__(8);

var EventType = _interopRequireWildcard(_EventType);

var _Tooltip = __webpack_require__(3);

var _AttrPolyline = __webpack_require__(11);

var attr = _interopRequireWildcard(_AttrPolyline);

var _EditPolyline = __webpack_require__(14);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var def_minPointNum = 2;
var def_maxPointNum = 9999;

var DrawPolyline = exports.DrawPolyline = _DrawBase.DrawBase.extend({
    type: 'polyline',
    //坐标位置相关
    _minPointNum: def_minPointNum, //至少需要点的个数 
    _maxPointNum: def_maxPointNum, //最多允许点的个数
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = [];

        if (attribute.config) {
            //允许外部传入
            this._minPointNum = attribute.config.minPointNum || def_minPointNum;
            this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
        } else {
            this._minPointNum = def_minPointNum;
            this._maxPointNum = def_maxPointNum;
        }

        var that = this;
        var addattr = {
            polyline: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        addattr.polyline.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getDrawPosition();
        }, false);

        this.entity = this.dataSource.entities.add(addattr); //创建要素对象
        this.entity._positions_draw = this._positions_draw;
        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.polyline);
    },
    //绑定鼠标事件
    bindEvent: function bindEvent() {
        var _this = this;

        var lastPointTemporary = false;
        this.getHandler().setInputAction(function (event) {
            //单击添加点
            var point = (0, _point.getCurrentMousePosition)(_this.viewer.scene, event.position, _this.entity);
            if (point) {
                if (lastPointTemporary) {
                    _this._positions_draw.pop();
                }
                lastPointTemporary = false;

                //在绘制点基础自动增加高度
                if (_this.entity.attribute && _this.entity.attribute.config && _this.entity.attribute.config.addHeight) point = (0, _point.addPositionsHeight)(point, _this.entity.attribute.config.addHeight);

                _this._positions_draw.push(point);
                _this.updateAttrForDrawing();

                _this.fire(EventType.DrawAddPoint, { drawtype: _this.type, entity: _this.entity, position: point, positions: _this._positions_draw });

                if (_this._positions_draw.length >= _this._maxPointNum) {
                    //点数满足最大数量，自动结束
                    _this.disable();
                }
            }
        }, _Cesium2.default.ScreenSpaceEventType.LEFT_CLICK);

        this.getHandler().setInputAction(function (event) {
            //右击删除上一个点
            _this._positions_draw.pop(); //删除最后标的一个点

            var point = (0, _point.getCurrentMousePosition)(_this.viewer.scene, event.position, _this.entity);
            if (point) {
                if (lastPointTemporary) {
                    _this._positions_draw.pop();
                }
                lastPointTemporary = true;

                _this.fire(EventType.DrawRemovePoint, { drawtype: _this.type, entity: _this.entity, position: point, positions: _this._positions_draw });

                _this._positions_draw.push(point);
                _this.updateAttrForDrawing();
            }
        }, _Cesium2.default.ScreenSpaceEventType.RIGHT_CLICK);

        this.getHandler().setInputAction(function (event) {
            //鼠标移动

            if (_this._positions_draw.length <= 1) _this.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.start);else if (_this._positions_draw.length < _this._minPointNum) //点数不满足最少数量
                _this.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.cont);else if (_this._positions_draw.length >= _this._maxPointNum) //点数满足最大数量
                _this.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.end2);else _this.tooltip.showAt(event.endPosition, _Tooltip.message.draw.polyline.end);

            var point = (0, _point.getCurrentMousePosition)(_this.viewer.scene, event.endPosition, _this.entity);
            if (point) {
                if (lastPointTemporary) {
                    _this._positions_draw.pop();
                }
                lastPointTemporary = true;

                _this._positions_draw.push(point);
                _this.updateAttrForDrawing();

                _this.fire(EventType.DrawMouseMove, { drawtype: _this.type, entity: _this.entity, position: point, positions: _this._positions_draw });
            }
        }, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);

        this.getHandler().setInputAction(function (event) {
            //双击结束标绘
            //必要代码 消除双击带来的多余经纬度 
            _this._positions_draw.pop();

            if (_this._positions_draw.length < _this._minPointNum) return; //点数不够

            _this.updateAttrForDrawing();
            _this.disable();
        }, _Cesium2.default.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    },
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditPolyline.EditPolyline(entity, this.viewer, this.dataSource);
        _edit._minPointNum = this._minPointNum;
        _edit._maxPointNum = this._maxPointNum;
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束后调用
    finish: function finish() {
        var entity = this.entity;

        entity.editing = this.getEditClass(entity); //绑定编辑对象   

        entity._positions_draw = this.getDrawPosition();
        entity.polyline.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return entity._positions_draw;
        }, false);
    }

});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Class = Class;

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// @class Class 

// @section
// @uninheritable

// Thanks to John Resig and Dean Edwards for inspiration!

function Class() {}

Class.extend = function (props) {

	// @function extend(props: Object): Function
	// [Extends the current class](#class-inheritance) given the properties to be included.
	// Returns a Javascript function that is a class constructor (to be called with `new`).
	var NewClass = function NewClass() {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		this.callInitHooks();
	};

	var parentProto = NewClass.__super__ = this.prototype;

	var proto = Util.create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	// inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype' && i !== '__super__') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		Util.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		// checkDeprecatedMixinEvents(props.includes);
		Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = Util.extend(Util.create(proto.options), props.options);
	}

	// mix given properties into the prototype
	Util.extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) {
			return;
		}

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};

// @function include(properties: Object): this
// [Includes a mixin](#class-includes) into the current class.
Class.include = function (props) {
	Util.extend(this.prototype, props);
	return this;
};

// @function mergeOptions(options: Object): this
// [Merges `options`](#class-options) into the defaults of the class.
Class.mergeOptions = function (options) {
	Util.extend(this.prototype.options, options);
	return this;
};

// @function addInitHook(fn: Function): this
// Adds a [constructor hook](#class-constructor-hooks) to the class.
Class.addInitHook = function (fn) {
	// (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
	return this;
};

// function checkDeprecatedMixinEvents(includes) {
// 	if (typeof L === 'undefined' || !L || !L.Mixin) { return; }

// 	includes = Util.isArray(includes) ? includes : [includes];

// 	for (var i = 0; i < includes.length; i++) {
// 		if (includes[i] === L.Mixin.Events) {
// 			console.warn('Deprecated include of L.Mixin.Events: ' +
// 				'this property will be removed in future releases, ' +
// 				'please inherit from L.Evented instead.', new Error().stack);
// 		}
// 	}
// }

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;
exports.line2curve = line2curve;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};
    if (entityattr == null) {
        //默认值
        entityattr = {};
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "lineType": //跳过扩展其他属性的参数
            case "color":
            case "opacity":
            case "outline":
            case "outlineWidth":
            case "outlineColor":
            case "outlineOpacity":
                break;
        }
    }

    if (style.color || style.lineType) {
        var color = new _Cesium2.default.Color.fromCssColorString(style.color || "#FFFF00").withAlpha(Number(style.opacity || 1.0));

        switch (style.lineType) {
            default:
            case "solid":
                //实线 
                if (style.outline) {
                    //存在衬色时
                    entityattr.material = new _Cesium2.default.PolylineOutlineMaterialProperty({
                        color: color,
                        outlineWidth: Number(style.outlineWidth || 1.0),
                        outlineColor: new _Cesium2.default.Color.fromCssColorString(style.outlineColor || "#FFFF00").withAlpha(Number(style.outlineOpacity || style.opacity || 1.0))
                    });
                } else {
                    entityattr.material = color;
                }
                break;
            case "dash":
                //虚线
                if (style.outline) {
                    //存在衬色时
                    entityattr.material = new _Cesium2.default.PolylineDashMaterialProperty({
                        dashLength: style.dashLength || style.outlineWidth || 16.0,
                        color: color,
                        gapColor: new _Cesium2.default.Color.fromCssColorString(style.outlineColor || "#FFFF00").withAlpha(Number(style.outlineOpacity || style.opacity || 1.0))
                    });
                } else {
                    entityattr.material = new _Cesium2.default.PolylineDashMaterialProperty({
                        dashLength: style.dashLength || 16.0,
                        color: color
                    });
                }

                break;
            case "glow":
                //发光线
                entityattr.material = new _Cesium2.default.PolylineGlowMaterialProperty({
                    glowPower: style.glowPower || 0.1,
                    color: color
                });
                break;
            case "arrow":
                //箭头线
                entityattr.material = new _Cesium2.default.PolylineArrowMaterialProperty(color);
                break;
        }
    }

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    if (entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw; //曲线等情形时，取绑定的数据

    return entity.polyline.positions.getValue();
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: {
            type: "LineString",
            coordinates: coordinates
        }
    };
}

//折线转曲线
function line2curve(_positions_draw) {
    if (!window.turf) return _positions_draw;

    var coordinates = _positions_draw.map(function (position) {
        return Util.cartesian2lonlat(position);
    });
    var defHeight = coordinates[coordinates.length - 1][2];

    var line = turf.lineString(coordinates);
    var curved = turf.bezierSpline(line);
    var _positions_show = Util.lonlats2cartesians(curved.geometry.coordinates, defHeight);
    return _positions_show;
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
    ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.L = {});
})(undefined, function (exports) {
    'use strict';

    var version = "1.3.4";

    /*
     * @namespace Util
     *
     * Various utility functions, used by Leaflet internally.
     */

    var freeze = Object.freeze;
    Object.freeze = function (obj) {
        return obj;
    };

    // @function extend(dest: Object, src?: Object): Object
    // Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
    function extend(dest) {
        var i, j, len, src;

        for (j = 1, len = arguments.length; j < len; j++) {
            src = arguments[j];
            for (i in src) {
                dest[i] = src[i];
            }
        }
        return dest;
    }

    // @function create(proto: Object, properties?: Object): Object
    // Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
    var create = Object.create || function () {
        function F() {}
        return function (proto) {
            F.prototype = proto;
            return new F();
        };
    }();

    // @function bind(fn: Function, …): Function
    // Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
    // Has a `L.bind()` shortcut.
    function bind(fn, obj) {
        var slice = Array.prototype.slice;

        if (fn.bind) {
            return fn.bind.apply(fn, slice.call(arguments, 1));
        }

        var args = slice.call(arguments, 2);

        return function () {
            return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
        };
    }

    // @property lastId: Number
    // Last unique ID used by [`stamp()`](#util-stamp)
    var lastId = 0;

    // @function stamp(obj: Object): Number
    // Returns the unique ID of an object, assigning it one if it doesn't have it.
    function stamp(obj) {
        /*eslint-disable */
        obj._leaflet_id = obj._leaflet_id || ++lastId;
        return obj._leaflet_id;
        /* eslint-enable */
    }

    // @function throttle(fn: Function, time: Number, context: Object): Function
    // Returns a function which executes function `fn` with the given scope `context`
    // (so that the `this` keyword refers to `context` inside `fn`'s code). The function
    // `fn` will be called no more than one time per given amount of `time`. The arguments
    // received by the bound function will be any arguments passed when binding the
    // function, followed by any arguments passed when invoking the bound function.
    // Has an `L.throttle` shortcut.
    function throttle(fn, time, context) {
        var lock, args, wrapperFn, later;

        later = function later() {
            // reset lock and call if queued
            lock = false;
            if (args) {
                wrapperFn.apply(context, args);
                args = false;
            }
        };

        wrapperFn = function wrapperFn() {
            if (lock) {
                // called too soon, queue to call later
                args = arguments;
            } else {
                // call and lock until later
                fn.apply(context, arguments);
                setTimeout(later, time);
                lock = true;
            }
        };

        return wrapperFn;
    }

    // @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
    // Returns the number `num` modulo `range` in such a way so it lies within
    // `range[0]` and `range[1]`. The returned value will be always smaller than
    // `range[1]` unless `includeMax` is set to `true`.
    function wrapNum(x, range, includeMax) {
        var max = range[1],
            min = range[0],
            d = max - min;
        return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
    }

    // @function falseFn(): Function
    // Returns a function which always returns `false`.
    function falseFn() {
        return false;
    }

    // @function formatNum(num: Number, digits?: Number): Number
    // Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
    function formatNum(num, digits) {
        var pow = Math.pow(10, digits === undefined ? 6 : digits);
        return Math.round(num * pow) / pow;
    }

    // @function trim(str: String): String
    // Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
    function trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    // @function splitWords(str: String): String[]
    // Trims and splits the string on whitespace and returns the array of parts.
    function splitWords(str) {
        return trim(str).split(/\s+/);
    }

    // @function setOptions(obj: Object, options: Object): Object
    // Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
    function setOptions(obj, options) {
        if (!obj.hasOwnProperty('options')) {
            obj.options = obj.options ? create(obj.options) : {};
        }
        for (var i in options) {
            obj.options[i] = options[i];
        }
        return obj.options;
    }

    // @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
    // Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
    // translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
    // be appended at the end. If `uppercase` is `true`, the parameter names will
    // be uppercased (e.g. `'?A=foo&B=bar'`)
    function getParamString(obj, existingUrl, uppercase) {
        var params = [];
        for (var i in obj) {
            params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
        }
        return (!existingUrl || existingUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
    }

    var templateRe = /\{ *([\w_-]+) *\}/g;

    // @function template(str: String, data: Object): String
    // Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
    // and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
    // `('Hello foo, bar')`. You can also specify functions instead of strings for
    // data values — they will be evaluated passing `data` as an argument.
    function template(str, data) {
        return str.replace(templateRe, function (str, key) {
            var value = data[key];

            if (value === undefined) {
                throw new Error('No value provided for variable ' + str);
            } else if (typeof value === 'function') {
                value = value(data);
            }
            return value;
        });
    }

    // @function isArray(obj): Boolean
    // Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
    var isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    // @function indexOf(array: Array, el: Object): Number
    // Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
    function indexOf(array, el) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === el) {
                return i;
            }
        }
        return -1;
    }

    // @property emptyImageUrl: String
    // Data URI string containing a base64-encoded empty GIF image.
    // Used as a hack to free memory from unused images on WebKit-powered
    // mobile devices (by setting image `src` to this string).
    var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

    // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

    function getPrefixed(name) {
        return window['webkit' + name] || window['moz' + name] || window['ms' + name];
    }

    var lastTime = 0;

    // fallback for IE 7-8
    function timeoutDefer(fn) {
        var time = +new Date(),
            timeToCall = Math.max(0, 16 - (time - lastTime));

        lastTime = time + timeToCall;
        return window.setTimeout(fn, timeToCall);
    }

    var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
    var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') || getPrefixed('CancelRequestAnimationFrame') || function (id) {
        window.clearTimeout(id);
    };

    // @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
    // Schedules `fn` to be executed when the browser repaints. `fn` is bound to
    // `context` if given. When `immediate` is set, `fn` is called immediately if
    // the browser doesn't have native support for
    // [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
    // otherwise it's delayed. Returns a request ID that can be used to cancel the request.
    function requestAnimFrame(fn, context, immediate) {
        if (immediate && requestFn === timeoutDefer) {
            fn.call(context);
        } else {
            return requestFn.call(window, bind(fn, context));
        }
    }

    // @function cancelAnimFrame(id: Number): undefined
    // Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
    function cancelAnimFrame(id) {
        if (id) {
            cancelFn.call(window, id);
        }
    }

    var Util = (Object.freeze || Object)({
        freeze: freeze,
        extend: extend,
        create: create,
        bind: bind,
        lastId: lastId,
        stamp: stamp,
        throttle: throttle,
        wrapNum: wrapNum,
        falseFn: falseFn,
        formatNum: formatNum,
        trim: trim,
        splitWords: splitWords,
        setOptions: setOptions,
        getParamString: getParamString,
        template: template,
        isArray: isArray,
        indexOf: indexOf,
        emptyImageUrl: emptyImageUrl,
        requestFn: requestFn,
        cancelFn: cancelFn,
        requestAnimFrame: requestAnimFrame,
        cancelAnimFrame: cancelAnimFrame
    });

    // @class Class
    // @aka L.Class

    // @section
    // @uninheritable

    // Thanks to John Resig and Dean Edwards for inspiration!

    function Class() {}

    Class.extend = function (props) {

        // @function extend(props: Object): Function
        // [Extends the current class](#class-inheritance) given the properties to be included.
        // Returns a Javascript function that is a class constructor (to be called with `new`).
        var NewClass = function NewClass() {

            // call the constructor
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }

            // call all constructor hooks
            this.callInitHooks();
        };

        var parentProto = NewClass.__super__ = this.prototype;

        var proto = create(parentProto);
        proto.constructor = NewClass;

        NewClass.prototype = proto;

        // inherit parent's statics
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'prototype' && i !== '__super__') {
                NewClass[i] = this[i];
            }
        }

        // mix static properties into the class
        if (props.statics) {
            extend(NewClass, props.statics);
            delete props.statics;
        }

        // mix includes into the prototype
        if (props.includes) {
            checkDeprecatedMixinEvents(props.includes);
            extend.apply(null, [proto].concat(props.includes));
            delete props.includes;
        }

        // merge options
        if (proto.options) {
            props.options = extend(create(proto.options), props.options);
        }

        // mix given properties into the prototype
        extend(proto, props);

        proto._initHooks = [];

        // add method for calling all hooks
        proto.callInitHooks = function () {

            if (this._initHooksCalled) {
                return;
            }

            if (parentProto.callInitHooks) {
                parentProto.callInitHooks.call(this);
            }

            this._initHooksCalled = true;

            for (var i = 0, len = proto._initHooks.length; i < len; i++) {
                proto._initHooks[i].call(this);
            }
        };

        return NewClass;
    };

    // @function include(properties: Object): this
    // [Includes a mixin](#class-includes) into the current class.
    Class.include = function (props) {
        extend(this.prototype, props);
        return this;
    };

    // @function mergeOptions(options: Object): this
    // [Merges `options`](#class-options) into the defaults of the class.
    Class.mergeOptions = function (options) {
        extend(this.prototype.options, options);
        return this;
    };

    // @function addInitHook(fn: Function): this
    // Adds a [constructor hook](#class-constructor-hooks) to the class.
    Class.addInitHook = function (fn) {
        // (Function) || (String, args...)
        var args = Array.prototype.slice.call(arguments, 1);

        var init = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };

        this.prototype._initHooks = this.prototype._initHooks || [];
        this.prototype._initHooks.push(init);
        return this;
    };

    function checkDeprecatedMixinEvents(includes) {
        if (typeof L === 'undefined' || !L || !L.Mixin) {
            return;
        }

        includes = isArray(includes) ? includes : [includes];

        for (var i = 0; i < includes.length; i++) {
            if (includes[i] === L.Mixin.Events) {
                console.warn('Deprecated include of L.Mixin.Events: ' + 'this property will be removed in future releases, ' + 'please inherit from L.Evented instead.', new Error().stack);
            }
        }
    }

    /*
     * @class Evented
     * @aka L.Evented
     * @inherits Class
     *
     * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
     *
     * @example
     *
     * ```js
     * map.on('click', function(e) {
     * 	alert(e.latlng);
     * } );
     * ```
     *
     * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
     *
     * ```js
     * function onClick(e) { ... }
     *
     * map.on('click', onClick);
     * map.off('click', onClick);
     * ```
     */

    var Events = {
        /* @method on(type: String, fn: Function, context?: Object): this
         * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
         *
         * @alternative
         * @method on(eventMap: Object): this
         * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
         */
        on: function on(types, fn, context) {

            // types can be a map of types/handlers
            if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
                for (var type in types) {
                    // we don't process space-separated events here for performance;
                    // it's a hot path since Layer uses the on(obj) syntax
                    this._on(type, types[type], fn);
                }
            } else {
                // types can be a string of space-separated words
                types = splitWords(types);

                for (var i = 0, len = types.length; i < len; i++) {
                    this._on(types[i], fn, context);
                }
            }

            return this;
        },

        /* @method off(type: String, fn?: Function, context?: Object): this
         * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
         *
         * @alternative
         * @method off(eventMap: Object): this
         * Removes a set of type/listener pairs.
         *
         * @alternative
         * @method off: this
         * Removes all listeners to all events on the object.
         */
        off: function off(types, fn, context) {

            if (!types) {
                // clear all listeners if called without arguments
                delete this._events;
            } else if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
                for (var type in types) {
                    this._off(type, types[type], fn);
                }
            } else {
                types = splitWords(types);

                for (var i = 0, len = types.length; i < len; i++) {
                    this._off(types[i], fn, context);
                }
            }

            return this;
        },

        // attach listener (without syntactic sugar now)
        _on: function _on(type, fn, context) {
            this._events = this._events || {};

            /* get/init listeners for type */
            var typeListeners = this._events[type];
            if (!typeListeners) {
                typeListeners = [];
                this._events[type] = typeListeners;
            }

            if (context === this) {
                // Less memory footprint.
                context = undefined;
            }
            var newListener = { fn: fn, ctx: context },
                listeners = typeListeners;

            // check if fn already there
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i].fn === fn && listeners[i].ctx === context) {
                    return;
                }
            }

            listeners.push(newListener);
        },

        _off: function _off(type, fn, context) {
            var listeners, i, len;

            if (!this._events) {
                return;
            }

            listeners = this._events[type];

            if (!listeners) {
                return;
            }

            if (!fn) {
                // Set all removed listeners to noop so they are not called if remove happens in fire
                for (i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].fn = falseFn;
                }
                // clear all listeners for a type if function isn't specified
                delete this._events[type];
                return;
            }

            if (context === this) {
                context = undefined;
            }

            if (listeners) {

                // find fn and remove it
                for (i = 0, len = listeners.length; i < len; i++) {
                    var l = listeners[i];
                    if (l.ctx !== context) {
                        continue;
                    }
                    if (l.fn === fn) {

                        // set the removed listener to noop so that's not called if remove happens in fire
                        l.fn = falseFn;

                        if (this._firingCount) {
                            /* copy array in case events are being fired */
                            this._events[type] = listeners = listeners.slice();
                        }
                        listeners.splice(i, 1);

                        return;
                    }
                }
            }
        },

        // @method fire(type: String, data?: Object, propagate?: Boolean): this
        // Fires an event of the specified type. You can optionally provide an data
        // object — the first argument of the listener function will contain its
        // properties. The event can optionally be propagated to event parents.
        fire: function fire(type, data, propagate) {
            if (!this.listens(type, propagate)) {
                return this;
            }

            var event = extend({}, data, {
                type: type,
                target: this,
                sourceTarget: data && data.sourceTarget || this
            });

            if (this._events) {
                var listeners = this._events[type];

                if (listeners) {
                    this._firingCount = this._firingCount + 1 || 1;
                    for (var i = 0, len = listeners.length; i < len; i++) {
                        var l = listeners[i];
                        l.fn.call(l.ctx || this, event);
                    }

                    this._firingCount--;
                }
            }

            if (propagate) {
                // propagate the event to parents (set with addEventParent)
                this._propagateEvent(event);
            }

            return this;
        },

        // @method listens(type: String): Boolean
        // Returns `true` if a particular event type has any listeners attached to it.
        listens: function listens(type, propagate) {
            var listeners = this._events && this._events[type];
            if (listeners && listeners.length) {
                return true;
            }

            if (propagate) {
                // also check parents for listeners if event propagates
                for (var id in this._eventParents) {
                    if (this._eventParents[id].listens(type, propagate)) {
                        return true;
                    }
                }
            }
            return false;
        },

        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: function once(types, fn, context) {

            if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
                for (var type in types) {
                    this.once(type, types[type], fn);
                }
                return this;
            }

            var handler = bind(function () {
                this.off(types, fn, context).off(types, handler, context);
            }, this);

            // add a listener that's executed once and removed after that
            return this.on(types, fn, context).on(types, handler, context);
        },

        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function addEventParent(obj) {
            this._eventParents = this._eventParents || {};
            this._eventParents[stamp(obj)] = obj;
            return this;
        },

        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function removeEventParent(obj) {
            if (this._eventParents) {
                delete this._eventParents[stamp(obj)];
            }
            return this;
        },

        _propagateEvent: function _propagateEvent(e) {
            for (var id in this._eventParents) {
                this._eventParents[id].fire(e.type, extend({
                    layer: e.target,
                    propagatedFrom: e.target
                }, e), true);
            }
        }
    };

    // aliases; we should ditch those eventually

    // @method addEventListener(…): this
    // Alias to [`on(…)`](#evented-on)
    Events.addEventListener = Events.on;

    // @method removeEventListener(…): this
    // Alias to [`off(…)`](#evented-off)

    // @method clearAllEventListeners(…): this
    // Alias to [`off()`](#evented-off)
    Events.removeEventListener = Events.clearAllEventListeners = Events.off;

    // @method addOneTimeEventListener(…): this
    // Alias to [`once(…)`](#evented-once)
    Events.addOneTimeEventListener = Events.once;

    // @method fireEvent(…): this
    // Alias to [`fire(…)`](#evented-fire)
    Events.fireEvent = Events.fire;

    // @method hasEventListeners(…): Boolean
    // Alias to [`listens(…)`](#evented-listens)
    Events.hasEventListeners = Events.listens;

    var Evented = Class.extend(Events);

    /*
     * @class Point
     * @aka L.Point
     *
     * Represents a point with `x` and `y` coordinates in pixels.
     *
     * @example
     *
     * ```js
     * var point = L.point(200, 300);
     * ```
     *
     * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
     *
     * ```js
     * map.panBy([200, 300]);
     * map.panBy(L.point(200, 300));
     * ```
     *
     * Note that `Point` does not inherit from Leafet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function Point(x, y, round) {
        // @property x: Number; The `x` coordinate of the point
        this.x = round ? Math.round(x) : x;
        // @property y: Number; The `y` coordinate of the point
        this.y = round ? Math.round(y) : y;
    }

    var trunc = Math.trunc || function (v) {
        return v > 0 ? Math.floor(v) : Math.ceil(v);
    };

    Point.prototype = {

        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function clone() {
            return new Point(this.x, this.y);
        },

        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function add(point) {
            // non-destructive, returns a new point
            return this.clone()._add(toPoint(point));
        },

        _add: function _add(point) {
            // destructive, used directly for performance in situations where it's safe to modify existing point
            this.x += point.x;
            this.y += point.y;
            return this;
        },

        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function subtract(point) {
            return this.clone()._subtract(toPoint(point));
        },

        _subtract: function _subtract(point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        },

        // @method divideBy(num: Number): Point
        // Returns the result of division of the current point by the given number.
        divideBy: function divideBy(num) {
            return this.clone()._divideBy(num);
        },

        _divideBy: function _divideBy(num) {
            this.x /= num;
            this.y /= num;
            return this;
        },

        // @method multiplyBy(num: Number): Point
        // Returns the result of multiplication of the current point by the given number.
        multiplyBy: function multiplyBy(num) {
            return this.clone()._multiplyBy(num);
        },

        _multiplyBy: function _multiplyBy(num) {
            this.x *= num;
            this.y *= num;
            return this;
        },

        // @method scaleBy(scale: Point): Point
        // Multiply each coordinate of the current point by each coordinate of
        // `scale`. In linear algebra terms, multiply the point by the
        // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
        // defined by `scale`.
        scaleBy: function scaleBy(point) {
            return new Point(this.x * point.x, this.y * point.y);
        },

        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function unscaleBy(point) {
            return new Point(this.x / point.x, this.y / point.y);
        },

        // @method round(): Point
        // Returns a copy of the current point with rounded coordinates.
        round: function round() {
            return this.clone()._round();
        },

        _round: function _round() {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        },

        // @method floor(): Point
        // Returns a copy of the current point with floored coordinates (rounded down).
        floor: function floor() {
            return this.clone()._floor();
        },

        _floor: function _floor() {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        },

        // @method ceil(): Point
        // Returns a copy of the current point with ceiled coordinates (rounded up).
        ceil: function ceil() {
            return this.clone()._ceil();
        },

        _ceil: function _ceil() {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        },

        // @method trunc(): Point
        // Returns a copy of the current point with truncated coordinates (rounded towards zero).
        trunc: function trunc() {
            return this.clone()._trunc();
        },

        _trunc: function _trunc() {
            this.x = trunc(this.x);
            this.y = trunc(this.y);
            return this;
        },

        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function distanceTo(point) {
            point = toPoint(point);

            var x = point.x - this.x,
                y = point.y - this.y;

            return Math.sqrt(x * x + y * y);
        },

        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function equals(point) {
            point = toPoint(point);

            return point.x === this.x && point.y === this.y;
        },

        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function contains(point) {
            point = toPoint(point);

            return Math.abs(point.x) <= Math.abs(this.x) && Math.abs(point.y) <= Math.abs(this.y);
        },

        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function toString() {
            return 'Point(' + formatNum(this.x) + ', ' + formatNum(this.y) + ')';
        }
    };

    // @factory L.point(x: Number, y: Number, round?: Boolean)
    // Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

    // @alternative
    // @factory L.point(coords: Number[])
    // Expects an array of the form `[x, y]` instead.

    // @alternative
    // @factory L.point(coords: Object)
    // Expects a plain object of the form `{x: Number, y: Number}` instead.
    function toPoint(x, y, round) {
        if (x instanceof Point) {
            return x;
        }
        if (isArray(x)) {
            return new Point(x[0], x[1]);
        }
        if (x === undefined || x === null) {
            return x;
        }
        if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && 'x' in x && 'y' in x) {
            return new Point(x.x, x.y);
        }
        return new Point(x, y, round);
    }

    /*
     * @class Bounds
     * @aka L.Bounds
     *
     * Represents a rectangular area in pixel coordinates.
     *
     * @example
     *
     * ```js
     * var p1 = L.point(10, 10),
     * p2 = L.point(40, 60),
     * bounds = L.bounds(p1, p2);
     * ```
     *
     * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
     *
     * ```js
     * otherBounds.intersects([[10, 10], [40, 60]]);
     * ```
     *
     * Note that `Bounds` does not inherit from Leafet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function Bounds(a, b) {
        if (!a) {
            return;
        }

        var points = b ? [a, b] : a;

        for (var i = 0, len = points.length; i < len; i++) {
            this.extend(points[i]);
        }
    }

    Bounds.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        extend: function extend(point) {
            // (Point)
            point = toPoint(point);

            // @property min: Point
            // The top left corner of the rectangle.
            // @property max: Point
            // The bottom right corner of the rectangle.
            if (!this.min && !this.max) {
                this.min = point.clone();
                this.max = point.clone();
            } else {
                this.min.x = Math.min(point.x, this.min.x);
                this.max.x = Math.max(point.x, this.max.x);
                this.min.y = Math.min(point.y, this.min.y);
                this.max.y = Math.max(point.y, this.max.y);
            }
            return this;
        },

        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function getCenter(round) {
            return new Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, round);
        },

        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function getBottomLeft() {
            return new Point(this.min.x, this.max.y);
        },

        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function getTopRight() {
            // -> Point
            return new Point(this.max.x, this.min.y);
        },

        // @method getTopLeft(): Point
        // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
        getTopLeft: function getTopLeft() {
            return this.min; // left, top
        },

        // @method getBottomRight(): Point
        // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
        getBottomRight: function getBottomRight() {
            return this.max; // right, bottom
        },

        // @method getSize(): Point
        // Returns the size of the given bounds
        getSize: function getSize() {
            return this.max.subtract(this.min);
        },

        // @method contains(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle contains the given one.
        // @alternative
        // @method contains(point: Point): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: function contains(obj) {
            var min, max;

            if (typeof obj[0] === 'number' || obj instanceof Point) {
                obj = toPoint(obj);
            } else {
                obj = toBounds(obj);
            }

            if (obj instanceof Bounds) {
                min = obj.min;
                max = obj.max;
            } else {
                min = max = obj;
            }

            return min.x >= this.min.x && max.x <= this.max.x && min.y >= this.min.y && max.y <= this.max.y;
        },

        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function intersects(bounds) {
            // (Bounds) -> Boolean
            bounds = toBounds(bounds);

            var min = this.min,
                max = this.max,
                min2 = bounds.min,
                max2 = bounds.max,
                xIntersects = max2.x >= min.x && min2.x <= max.x,
                yIntersects = max2.y >= min.y && min2.y <= max.y;

            return xIntersects && yIntersects;
        },

        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function overlaps(bounds) {
            // (Bounds) -> Boolean
            bounds = toBounds(bounds);

            var min = this.min,
                max = this.max,
                min2 = bounds.min,
                max2 = bounds.max,
                xOverlaps = max2.x > min.x && min2.x < max.x,
                yOverlaps = max2.y > min.y && min2.y < max.y;

            return xOverlaps && yOverlaps;
        },

        isValid: function isValid() {
            return !!(this.min && this.max);
        }
    };

    // @factory L.bounds(corner1: Point, corner2: Point)
    // Creates a Bounds object from two corners coordinate pairs.
    // @alternative
    // @factory L.bounds(points: Point[])
    // Creates a Bounds object from the given array of points.
    function toBounds(a, b) {
        if (!a || a instanceof Bounds) {
            return a;
        }
        return new Bounds(a, b);
    }

    /*
     * @class LatLngBounds
     * @aka L.LatLngBounds
     *
     * Represents a rectangular geographical area on a map.
     *
     * @example
     *
     * ```js
     * var corner1 = L.latLng(40.712, -74.227),
     * corner2 = L.latLng(40.774, -74.125),
     * bounds = L.latLngBounds(corner1, corner2);
     * ```
     *
     * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
     *
     * ```js
     * map.fitBounds([
     * 	[40.712, -74.227],
     * 	[40.774, -74.125]
     * ]);
     * ```
     *
     * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
     *
     * Note that `LatLngBounds` does not inherit from Leafet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function LatLngBounds(corner1, corner2) {
        // (LatLng, LatLng) or (LatLng[])
        if (!corner1) {
            return;
        }

        var latlngs = corner2 ? [corner1, corner2] : corner1;

        for (var i = 0, len = latlngs.length; i < len; i++) {
            this.extend(latlngs[i]);
        }
    }

    LatLngBounds.prototype = {

        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point

        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function extend(obj) {
            var sw = this._southWest,
                ne = this._northEast,
                sw2,
                ne2;

            if (obj instanceof LatLng) {
                sw2 = obj;
                ne2 = obj;
            } else if (obj instanceof LatLngBounds) {
                sw2 = obj._southWest;
                ne2 = obj._northEast;

                if (!sw2 || !ne2) {
                    return this;
                }
            } else {
                return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
            }

            if (!sw && !ne) {
                this._southWest = new LatLng(sw2.lat, sw2.lng);
                this._northEast = new LatLng(ne2.lat, ne2.lng);
            } else {
                sw.lat = Math.min(sw2.lat, sw.lat);
                sw.lng = Math.min(sw2.lng, sw.lng);
                ne.lat = Math.max(ne2.lat, ne.lat);
                ne.lng = Math.max(ne2.lng, ne.lng);
            }

            return this;
        },

        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function pad(bufferRatio) {
            var sw = this._southWest,
                ne = this._northEast,
                heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
                widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

            return new LatLngBounds(new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer), new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
        },

        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function getCenter() {
            return new LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
        },

        // @method getSouthWest(): LatLng
        // Returns the south-west point of the bounds.
        getSouthWest: function getSouthWest() {
            return this._southWest;
        },

        // @method getNorthEast(): LatLng
        // Returns the north-east point of the bounds.
        getNorthEast: function getNorthEast() {
            return this._northEast;
        },

        // @method getNorthWest(): LatLng
        // Returns the north-west point of the bounds.
        getNorthWest: function getNorthWest() {
            return new LatLng(this.getNorth(), this.getWest());
        },

        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function getSouthEast() {
            return new LatLng(this.getSouth(), this.getEast());
        },

        // @method getWest(): Number
        // Returns the west longitude of the bounds
        getWest: function getWest() {
            return this._southWest.lng;
        },

        // @method getSouth(): Number
        // Returns the south latitude of the bounds
        getSouth: function getSouth() {
            return this._southWest.lat;
        },

        // @method getEast(): Number
        // Returns the east longitude of the bounds
        getEast: function getEast() {
            return this._northEast.lng;
        },

        // @method getNorth(): Number
        // Returns the north latitude of the bounds
        getNorth: function getNorth() {
            return this._northEast.lat;
        },

        // @method contains(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle contains the given one.

        // @alternative
        // @method contains (latlng: LatLng): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: function contains(obj) {
            // (LatLngBounds) or (LatLng) -> Boolean
            if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
                obj = toLatLng(obj);
            } else {
                obj = toLatLngBounds(obj);
            }

            var sw = this._southWest,
                ne = this._northEast,
                sw2,
                ne2;

            if (obj instanceof LatLngBounds) {
                sw2 = obj.getSouthWest();
                ne2 = obj.getNorthEast();
            } else {
                sw2 = ne2 = obj;
            }

            return sw2.lat >= sw.lat && ne2.lat <= ne.lat && sw2.lng >= sw.lng && ne2.lng <= ne.lng;
        },

        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function intersects(bounds) {
            bounds = toLatLngBounds(bounds);

            var sw = this._southWest,
                ne = this._northEast,
                sw2 = bounds.getSouthWest(),
                ne2 = bounds.getNorthEast(),
                latIntersects = ne2.lat >= sw.lat && sw2.lat <= ne.lat,
                lngIntersects = ne2.lng >= sw.lng && sw2.lng <= ne.lng;

            return latIntersects && lngIntersects;
        },

        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function overlaps(bounds) {
            bounds = toLatLngBounds(bounds);

            var sw = this._southWest,
                ne = this._northEast,
                sw2 = bounds.getSouthWest(),
                ne2 = bounds.getNorthEast(),
                latOverlaps = ne2.lat > sw.lat && sw2.lat < ne.lat,
                lngOverlaps = ne2.lng > sw.lng && sw2.lng < ne.lng;

            return latOverlaps && lngOverlaps;
        },

        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function toBBoxString() {
            return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
        },

        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function equals(bounds, maxMargin) {
            if (!bounds) {
                return false;
            }

            bounds = toLatLngBounds(bounds);

            return this._southWest.equals(bounds.getSouthWest(), maxMargin) && this._northEast.equals(bounds.getNorthEast(), maxMargin);
        },

        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function isValid() {
            return !!(this._southWest && this._northEast);
        }
    };

    // TODO International date line?

    // @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
    // Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

    // @alternative
    // @factory L.latLngBounds(latlngs: LatLng[])
    // Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
    function toLatLngBounds(a, b) {
        if (a instanceof LatLngBounds) {
            return a;
        }
        return new LatLngBounds(a, b);
    }

    /* @class LatLng
     * @aka L.LatLng
     *
     * Represents a geographical point with a certain latitude and longitude.
     *
     * @example
     *
     * ```
     * var latlng = L.latLng(50.5, 30.5);
     * ```
     *
     * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
     *
     * ```
     * map.panTo([50, 30]);
     * map.panTo({lon: 30, lat: 50});
     * map.panTo({lat: 50, lng: 30});
     * map.panTo(L.latLng(50, 30));
     * ```
     *
     * Note that `LatLng` does not inherit from Leaflet's `Class` object,
     * which means new classes can't inherit from it, and new methods
     * can't be added to it with the `include` function.
     */

    function LatLng(lat, lng, alt) {
        if (isNaN(lat) || isNaN(lng)) {
            throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
        }

        // @property lat: Number
        // Latitude in degrees
        this.lat = +lat;

        // @property lng: Number
        // Longitude in degrees
        this.lng = +lng;

        // @property alt: Number
        // Altitude in meters (optional)
        if (alt !== undefined) {
            this.alt = +alt;
        }
    }

    LatLng.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function equals(obj, maxMargin) {
            if (!obj) {
                return false;
            }

            obj = toLatLng(obj);

            var margin = Math.max(Math.abs(this.lat - obj.lat), Math.abs(this.lng - obj.lng));

            return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
        },

        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function toString(precision) {
            return 'LatLng(' + formatNum(this.lat, precision) + ', ' + formatNum(this.lng, precision) + ')';
        },

        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function distanceTo(other) {
            return Earth.distance(this, toLatLng(other));
        },

        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function wrap() {
            return Earth.wrapLatLng(this);
        },

        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function toBounds(sizeInMeters) {
            var latAccuracy = 180 * sizeInMeters / 40075017,
                lngAccuracy = latAccuracy / Math.cos(Math.PI / 180 * this.lat);

            return toLatLngBounds([this.lat - latAccuracy, this.lng - lngAccuracy], [this.lat + latAccuracy, this.lng + lngAccuracy]);
        },

        clone: function clone() {
            return new LatLng(this.lat, this.lng, this.alt);
        }
    };

    // @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
    // Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

    // @alternative
    // @factory L.latLng(coords: Array): LatLng
    // Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

    // @alternative
    // @factory L.latLng(coords: Object): LatLng
    // Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

    function toLatLng(a, b, c) {
        if (a instanceof LatLng) {
            return a;
        }
        if (isArray(a) && _typeof(a[0]) !== 'object') {
            if (a.length === 3) {
                return new LatLng(a[0], a[1], a[2]);
            }
            if (a.length === 2) {
                return new LatLng(a[0], a[1]);
            }
            return null;
        }
        if (a === undefined || a === null) {
            return a;
        }
        if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && 'lat' in a) {
            return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
        }
        if (b === undefined) {
            return null;
        }
        return new LatLng(a, b, c);
    }

    /*
     * @namespace CRS
     * @crs L.CRS.Base
     * Object that defines coordinate reference systems for projecting
     * geographical points into pixel (screen) coordinates and back (and to
     * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
     * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
     *
     * Leaflet defines the most usual CRSs by default. If you want to use a
     * CRS not defined by default, take a look at the
     * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
     *
     * Note that the CRS instances do not inherit from Leafet's `Class` object,
     * and can't be instantiated. Also, new classes can't inherit from them,
     * and methods can't be added to them with the `include` function.
     */

    var CRS = {
        // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
        // Projects geographical coordinates into pixel coordinates for a given zoom.
        latLngToPoint: function latLngToPoint(latlng, zoom) {
            var projectedPoint = this.projection.project(latlng),
                scale = this.scale(zoom);

            return this.transformation._transform(projectedPoint, scale);
        },

        // @method pointToLatLng(point: Point, zoom: Number): LatLng
        // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
        // zoom into geographical coordinates.
        pointToLatLng: function pointToLatLng(point, zoom) {
            var scale = this.scale(zoom),
                untransformedPoint = this.transformation.untransform(point, scale);

            return this.projection.unproject(untransformedPoint);
        },

        // @method project(latlng: LatLng): Point
        // Projects geographical coordinates into coordinates in units accepted for
        // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
        project: function project(latlng) {
            return this.projection.project(latlng);
        },

        // @method unproject(point: Point): LatLng
        // Given a projected coordinate returns the corresponding LatLng.
        // The inverse of `project`.
        unproject: function unproject(point) {
            return this.projection.unproject(point);
        },

        // @method scale(zoom: Number): Number
        // Returns the scale used when transforming projected coordinates into
        // pixel coordinates for a particular zoom. For example, it returns
        // `256 * 2^zoom` for Mercator-based CRS.
        scale: function scale(zoom) {
            return 256 * Math.pow(2, zoom);
        },

        // @method zoom(scale: Number): Number
        // Inverse of `scale()`, returns the zoom level corresponding to a scale
        // factor of `scale`.
        zoom: function zoom(scale) {
            return Math.log(scale / 256) / Math.LN2;
        },

        // @method getProjectedBounds(zoom: Number): Bounds
        // Returns the projection's bounds scaled and transformed for the provided `zoom`.
        getProjectedBounds: function getProjectedBounds(zoom) {
            if (this.infinite) {
                return null;
            }

            var b = this.projection.bounds,
                s = this.scale(zoom),
                min = this.transformation.transform(b.min, s),
                max = this.transformation.transform(b.max, s);

            return new Bounds(min, max);
        },

        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates.

        // @property code: String
        // Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
        //
        // @property wrapLng: Number[]
        // An array of two numbers defining whether the longitude (horizontal) coordinate
        // axis wraps around a given range and how. Defaults to `[-180, 180]` in most
        // geographical CRSs. If `undefined`, the longitude axis does not wrap around.
        //
        // @property wrapLat: Number[]
        // Like `wrapLng`, but for the latitude (vertical) axis.

        // wrapLng: [min, max],
        // wrapLat: [min, max],

        // @property infinite: Boolean
        // If true, the coordinate space will be unbounded (infinite in both axes)
        infinite: false,

        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where lat and lng has been wrapped according to the
        // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
        wrapLatLng: function wrapLatLng(latlng) {
            var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
                lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
                alt = latlng.alt;

            return new LatLng(lat, lng, alt);
        },

        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function wrapLatLngBounds(bounds) {
            var center = bounds.getCenter(),
                newCenter = this.wrapLatLng(center),
                latShift = center.lat - newCenter.lat,
                lngShift = center.lng - newCenter.lng;

            if (latShift === 0 && lngShift === 0) {
                return bounds;
            }

            var sw = bounds.getSouthWest(),
                ne = bounds.getNorthEast(),
                newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
                newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

            return new LatLngBounds(newSw, newNe);
        }
    };

    /*
     * @namespace CRS
     * @crs L.CRS.Earth
     *
     * Serves as the base for CRS that are global such that they cover the earth.
     * Can only be used as the base for other CRS and cannot be used directly,
     * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
     * meters.
     */

    var Earth = extend({}, CRS, {
        wrapLng: [-180, 180],

        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see http://rosettacode.org/wiki/Haversine_formula
        R: 6371000,

        // distance between two geographical points using spherical law of cosines approximation
        distance: function distance(latlng1, latlng2) {
            var rad = Math.PI / 180,
                lat1 = latlng1.lat * rad,
                lat2 = latlng2.lat * rad,
                sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2),
                sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2),
                a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return this.R * c;
        }
    });

    /*
     * @namespace Projection
     * @projection L.Projection.SphericalMercator
     *
     * Spherical Mercator projection — the most common projection for online maps,
     * used by almost all free and commercial tile providers. Assumes that Earth is
     * a sphere. Used by the `EPSG:3857` CRS.
     */

    var SphericalMercator = {

        R: 6378137,
        MAX_LATITUDE: 85.0511287798,

        project: function project(latlng) {
            var d = Math.PI / 180,
                max = this.MAX_LATITUDE,
                lat = Math.max(Math.min(max, latlng.lat), -max),
                sin = Math.sin(lat * d);

            return new Point(this.R * latlng.lng * d, this.R * Math.log((1 + sin) / (1 - sin)) / 2);
        },

        unproject: function unproject(point) {
            var d = 180 / Math.PI;

            return new LatLng((2 * Math.atan(Math.exp(point.y / this.R)) - Math.PI / 2) * d, point.x * d / this.R);
        },

        bounds: function () {
            var d = 6378137 * Math.PI;
            return new Bounds([-d, -d], [d, d]);
        }()
    };

    /*
     * @class Transformation
     * @aka L.Transformation
     *
     * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
     * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
     * the reverse. Used by Leaflet in its projections code.
     *
     * @example
     *
     * ```js
     * var transformation = L.transformation(2, 5, -1, 10),
     * 	p = L.point(1, 2),
     * 	p2 = transformation.transform(p), //  L.point(7, 8)
     * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
     * ```
     */

    // factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
    // Creates a `Transformation` object with the given coefficients.
    function Transformation(a, b, c, d) {
        if (isArray(a)) {
            // use array properties
            this._a = a[0];
            this._b = a[1];
            this._c = a[2];
            this._d = a[3];
            return;
        }
        this._a = a;
        this._b = b;
        this._c = c;
        this._d = d;
    }

    Transformation.prototype = {
        // @method transform(point: Point, scale?: Number): Point
        // Returns a transformed point, optionally multiplied by the given scale.
        // Only accepts actual `L.Point` instances, not arrays.
        transform: function transform(point, scale) {
            // (Point, Number) -> Point
            return this._transform(point.clone(), scale);
        },

        // destructive transform (faster)
        _transform: function _transform(point, scale) {
            scale = scale || 1;
            point.x = scale * (this._a * point.x + this._b);
            point.y = scale * (this._c * point.y + this._d);
            return point;
        },

        // @method untransform(point: Point, scale?: Number): Point
        // Returns the reverse transformation of the given point, optionally divided
        // by the given scale. Only accepts actual `L.Point` instances, not arrays.
        untransform: function untransform(point, scale) {
            scale = scale || 1;
            return new Point((point.x / scale - this._b) / this._a, (point.y / scale - this._d) / this._c);
        }
    };

    // factory L.transformation(a: Number, b: Number, c: Number, d: Number)

    // @factory L.transformation(a: Number, b: Number, c: Number, d: Number)
    // Instantiates a Transformation object with the given coefficients.

    // @alternative
    // @factory L.transformation(coefficients: Array): Transformation
    // Expects an coefficients array of the form
    // `[a: Number, b: Number, c: Number, d: Number]`.

    function toTransformation(a, b, c, d) {
        return new Transformation(a, b, c, d);
    }

    /*
     * @namespace CRS
     * @crs L.CRS.EPSG3857
     *
     * The most common CRS for online maps, used by almost all free and commercial
     * tile providers. Uses Spherical Mercator projection. Set in by default in
     * Map's `crs` option.
     */

    var EPSG3857 = extend({}, Earth, {
        code: 'EPSG:3857',
        projection: SphericalMercator,

        transformation: function () {
            var scale = 0.5 / (Math.PI * SphericalMercator.R);
            return toTransformation(scale, 0.5, -scale, 0.5);
        }()
    });

    var EPSG900913 = extend({}, EPSG3857, {
        code: 'EPSG:900913'
    });

    // @namespace SVG; @section
    // There are several static functions which can be called without instantiating L.SVG:

    // @function create(name: String): SVGElement
    // Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
    // corresponding to the class name passed. For example, using 'line' will return
    // an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
    function svgCreate(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }

    // @function pointsToPath(rings: Point[], closed: Boolean): String
    // Generates a SVG path string for multiple rings, with each ring turning
    // into "M..L..L.." instructions
    function pointsToPath(rings, closed) {
        var str = '',
            i,
            j,
            len,
            len2,
            points,
            p;

        for (i = 0, len = rings.length; i < len; i++) {
            points = rings[i];

            for (j = 0, len2 = points.length; j < len2; j++) {
                p = points[j];
                str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
            }

            // closes the ring for polygons; "x" is VML syntax
            str += closed ? svg ? 'z' : 'x' : '';
        }

        // SVG complains about empty path strings
        return str || 'M0 0';
    }

    /*
     * @namespace Browser
     * @aka L.Browser
     *
     * A namespace with static properties for browser/feature detection used by Leaflet internally.
     *
     * @example
     *
     * ```js
     * if (L.Browser.ielt9) {
     *   alert('Upgrade your browser, dude!');
     * }
     * ```
     */

    var style$1 = document.documentElement.style;

    // @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
    var ie = 'ActiveXObject' in window;

    // @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
    var ielt9 = ie && !document.addEventListener;

    // @property edge: Boolean; `true` for the Edge web browser.
    var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

    // @property webkit: Boolean;
    // `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
    var webkit = userAgentContains('webkit');

    // @property android: Boolean
    // `true` for any browser running on an Android platform.
    var android = userAgentContains('android');

    // @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
    var android23 = userAgentContains('android 2') || userAgentContains('android 3');

    /* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
    var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
    // @property androidStock: Boolean; `true` for the Android stock browser (i.e. not Chrome)
    var androidStock = android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

    // @property opera: Boolean; `true` for the Opera browser
    var opera = !!window.opera;

    // @property chrome: Boolean; `true` for the Chrome browser.
    var chrome = userAgentContains('chrome');

    // @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
    var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

    // @property safari: Boolean; `true` for the Safari browser.
    var safari = !chrome && userAgentContains('safari');

    var phantom = userAgentContains('phantom');

    // @property opera12: Boolean
    // `true` for the Opera browser supporting CSS transforms (version 12 or later).
    var opera12 = 'OTransition' in style$1;

    // @property win: Boolean; `true` when the browser is running in a Windows platform
    var win = navigator.platform.indexOf('Win') === 0;

    // @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
    var ie3d = ie && 'transition' in style$1;

    // @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
    var webkit3d = 'WebKitCSSMatrix' in window && 'm11' in new window.WebKitCSSMatrix() && !android23;

    // @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
    var gecko3d = 'MozPerspective' in style$1;

    // @property any3d: Boolean
    // `true` for all browsers supporting CSS transforms.
    var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

    // @property mobile: Boolean; `true` for all browsers running in a mobile device.
    var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

    // @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
    var mobileWebkit = mobile && webkit;

    // @property mobileWebkit3d: Boolean
    // `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
    var mobileWebkit3d = mobile && webkit3d;

    // @property msPointer: Boolean
    // `true` for browsers implementing the Microsoft touch events model (notably IE10).
    var msPointer = !window.PointerEvent && window.MSPointerEvent;

    // @property pointer: Boolean
    // `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
    var pointer = !!(window.PointerEvent || msPointer);

    // @property touch: Boolean
    // `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
    // This does not necessarily mean that the browser is running in a computer with
    // a touchscreen, it only means that the browser is capable of understanding
    // touch events.
    var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);

    // @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
    var mobileOpera = mobile && opera;

    // @property mobileGecko: Boolean
    // `true` for gecko-based browsers running in a mobile device.
    var mobileGecko = mobile && gecko;

    // @property retina: Boolean
    // `true` for browsers on a high-resolution "retina" screen or on any screen when browser's display zoom is more than 100%.
    var retina = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1;

    // @property canvas: Boolean
    // `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
    var canvas = function () {
        return !!document.createElement('canvas').getContext;
    }();

    // @property svg: Boolean
    // `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
    var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

    // @property vml: Boolean
    // `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
    var vml = !svg && function () {
        try {
            var div = document.createElement('div');
            div.innerHTML = '<v:shape adj="1"/>';

            var shape = div.firstChild;
            shape.style.behavior = 'url(#default#VML)';

            return shape && _typeof(shape.adj) === 'object';
        } catch (e) {
            return false;
        }
    }();

    function userAgentContains(str) {
        return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
    }

    var Browser = (Object.freeze || Object)({
        ie: ie,
        ielt9: ielt9,
        edge: edge,
        webkit: webkit,
        android: android,
        android23: android23,
        androidStock: androidStock,
        opera: opera,
        chrome: chrome,
        gecko: gecko,
        safari: safari,
        phantom: phantom,
        opera12: opera12,
        win: win,
        ie3d: ie3d,
        webkit3d: webkit3d,
        gecko3d: gecko3d,
        any3d: any3d,
        mobile: mobile,
        mobileWebkit: mobileWebkit,
        mobileWebkit3d: mobileWebkit3d,
        msPointer: msPointer,
        pointer: pointer,
        touch: touch,
        mobileOpera: mobileOpera,
        mobileGecko: mobileGecko,
        retina: retina,
        canvas: canvas,
        svg: svg,
        vml: vml
    });

    /*
     * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
     */

    var POINTER_DOWN = msPointer ? 'MSPointerDown' : 'pointerdown';
    var POINTER_MOVE = msPointer ? 'MSPointerMove' : 'pointermove';
    var POINTER_UP = msPointer ? 'MSPointerUp' : 'pointerup';
    var POINTER_CANCEL = msPointer ? 'MSPointerCancel' : 'pointercancel';
    var TAG_WHITE_LIST = ['INPUT', 'SELECT', 'OPTION'];

    var _pointers = {};
    var _pointerDocListener = false;

    // DomEvent.DoubleTap needs to know about this
    var _pointersCount = 0;

    // Provides a touch events wrapper for (ms)pointer events.
    // ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

    function addPointerListener(obj, type, handler, id) {
        if (type === 'touchstart') {
            _addPointerStart(obj, handler, id);
        } else if (type === 'touchmove') {
            _addPointerMove(obj, handler, id);
        } else if (type === 'touchend') {
            _addPointerEnd(obj, handler, id);
        }

        return this;
    }

    function removePointerListener(obj, type, id) {
        var handler = obj['_leaflet_' + type + id];

        if (type === 'touchstart') {
            obj.removeEventListener(POINTER_DOWN, handler, false);
        } else if (type === 'touchmove') {
            obj.removeEventListener(POINTER_MOVE, handler, false);
        } else if (type === 'touchend') {
            obj.removeEventListener(POINTER_UP, handler, false);
            obj.removeEventListener(POINTER_CANCEL, handler, false);
        }

        return this;
    }

    function _addPointerStart(obj, handler, id) {
        var onDown = bind(function (e) {
            if (e.pointerType !== 'mouse' && e.MSPOINTER_TYPE_MOUSE && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
                // In IE11, some touch events needs to fire for form controls, or
                // the controls will stop working. We keep a whitelist of tag names that
                // need these events. For other target tags, we prevent default on the event.
                if (TAG_WHITE_LIST.indexOf(e.target.tagName) < 0) {
                    preventDefault(e);
                } else {
                    return;
                }
            }

            _handlePointer(e, handler);
        });

        obj['_leaflet_touchstart' + id] = onDown;
        obj.addEventListener(POINTER_DOWN, onDown, false);

        // need to keep track of what pointers and how many are active to provide e.touches emulation
        if (!_pointerDocListener) {
            // we listen documentElement as any drags that end by moving the touch off the screen get fired there
            document.documentElement.addEventListener(POINTER_DOWN, _globalPointerDown, true);
            document.documentElement.addEventListener(POINTER_MOVE, _globalPointerMove, true);
            document.documentElement.addEventListener(POINTER_UP, _globalPointerUp, true);
            document.documentElement.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

            _pointerDocListener = true;
        }
    }

    function _globalPointerDown(e) {
        _pointers[e.pointerId] = e;
        _pointersCount++;
    }

    function _globalPointerMove(e) {
        if (_pointers[e.pointerId]) {
            _pointers[e.pointerId] = e;
        }
    }

    function _globalPointerUp(e) {
        delete _pointers[e.pointerId];
        _pointersCount--;
    }

    function _handlePointer(e, handler) {
        e.touches = [];
        for (var i in _pointers) {
            e.touches.push(_pointers[i]);
        }
        e.changedTouches = [e];

        handler(e);
    }

    function _addPointerMove(obj, handler, id) {
        var onMove = function onMove(e) {
            // don't fire touch moves when mouse isn't down
            if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) {
                return;
            }

            _handlePointer(e, handler);
        };

        obj['_leaflet_touchmove' + id] = onMove;
        obj.addEventListener(POINTER_MOVE, onMove, false);
    }

    function _addPointerEnd(obj, handler, id) {
        var onUp = function onUp(e) {
            _handlePointer(e, handler);
        };

        obj['_leaflet_touchend' + id] = onUp;
        obj.addEventListener(POINTER_UP, onUp, false);
        obj.addEventListener(POINTER_CANCEL, onUp, false);
    }

    /*
     * Extends the event handling code with double tap support for mobile browsers.
     */

    var _touchstart = msPointer ? 'MSPointerDown' : pointer ? 'pointerdown' : 'touchstart';
    var _touchend = msPointer ? 'MSPointerUp' : pointer ? 'pointerup' : 'touchend';
    var _pre = '_leaflet_';

    // inspired by Zepto touch code by Thomas Fuchs
    function addDoubleTapListener(obj, handler, id) {
        var last,
            touch$$1,
            doubleTap = false,
            delay = 250;

        function onTouchStart(e) {
            var count;

            if (pointer) {
                if (!edge || e.pointerType === 'mouse') {
                    return;
                }
                count = _pointersCount;
            } else {
                count = e.touches.length;
            }

            if (count > 1) {
                return;
            }

            var now = Date.now(),
                delta = now - (last || now);

            touch$$1 = e.touches ? e.touches[0] : e;
            doubleTap = delta > 0 && delta <= delay;
            last = now;
        }

        function onTouchEnd(e) {
            if (doubleTap && !touch$$1.cancelBubble) {
                if (pointer) {
                    if (!edge || e.pointerType === 'mouse') {
                        return;
                    }
                    // work around .type being readonly with MSPointer* events
                    var newTouch = {},
                        prop,
                        i;

                    for (i in touch$$1) {
                        prop = touch$$1[i];
                        newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
                    }
                    touch$$1 = newTouch;
                }
                touch$$1.type = 'dblclick';
                handler(touch$$1);
                last = null;
            }
        }

        obj[_pre + _touchstart + id] = onTouchStart;
        obj[_pre + _touchend + id] = onTouchEnd;
        obj[_pre + 'dblclick' + id] = handler;

        obj.addEventListener(_touchstart, onTouchStart, false);
        obj.addEventListener(_touchend, onTouchEnd, false);

        // On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
        // the browser doesn't fire touchend/pointerup events but does fire
        // native dblclicks. See #4127.
        // Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
        obj.addEventListener('dblclick', handler, false);

        return this;
    }

    function removeDoubleTapListener(obj, id) {
        var touchstart = obj[_pre + _touchstart + id],
            touchend = obj[_pre + _touchend + id],
            dblclick = obj[_pre + 'dblclick' + id];

        obj.removeEventListener(_touchstart, touchstart, false);
        obj.removeEventListener(_touchend, touchend, false);
        if (!edge) {
            obj.removeEventListener('dblclick', dblclick, false);
        }

        return this;
    }

    /*
     * @namespace DomUtil
     *
     * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
     * tree, used by Leaflet internally.
     *
     * Most functions expecting or returning a `HTMLElement` also work for
     * SVG elements. The only difference is that classes refer to CSS classes
     * in HTML and SVG classes in SVG.
     */

    // @property TRANSFORM: String
    // Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
    var TRANSFORM = testProp(['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

    // webkitTransition comes first because some browser versions that drop vendor prefix don't do
    // the same for the transitionend event, in particular the Android 4.1 stock browser

    // @property TRANSITION: String
    // Vendor-prefixed transition style name.
    var TRANSITION = testProp(['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

    // @property TRANSITION_END: String
    // Vendor-prefixed transitionend event name.
    var TRANSITION_END = TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';

    // @function get(id: String|HTMLElement): HTMLElement
    // Returns an element given its DOM id, or returns the element itself
    // if it was passed directly.
    function get(id) {
        return typeof id === 'string' ? document.getElementById(id) : id;
    }

    // @function getStyle(el: HTMLElement, styleAttrib: String): String
    // Returns the value for a certain style attribute on an element,
    // including computed values or values set through CSS.
    function getStyle(el, style) {
        var value = el.style[style] || el.currentStyle && el.currentStyle[style];

        if ((!value || value === 'auto') && document.defaultView) {
            var css = document.defaultView.getComputedStyle(el, null);
            value = css ? css[style] : null;
        }
        return value === 'auto' ? null : value;
    }

    // @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
    // Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
    function create$1(tagName, className, container) {
        var el = document.createElement(tagName);
        el.className = className || '';

        if (container) {
            container.appendChild(el);
        }
        return el;
    }

    // @function remove(el: HTMLElement)
    // Removes `el` from its parent element
    function remove(el) {
        var parent = el.parentNode;
        if (parent) {
            parent.removeChild(el);
        }
    }

    // @function empty(el: HTMLElement)
    // Removes all of `el`'s children elements from `el`
    function empty(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }

    // @function toFront(el: HTMLElement)
    // Makes `el` the last child of its parent, so it renders in front of the other children.
    function toFront(el) {
        var parent = el.parentNode;
        if (parent.lastChild !== el) {
            parent.appendChild(el);
        }
    }

    // @function toBack(el: HTMLElement)
    // Makes `el` the first child of its parent, so it renders behind the other children.
    function toBack(el) {
        var parent = el.parentNode;
        if (parent.firstChild !== el) {
            parent.insertBefore(el, parent.firstChild);
        }
    }

    // @function hasClass(el: HTMLElement, name: String): Boolean
    // Returns `true` if the element's class attribute contains `name`.
    function hasClass(el, name) {
        if (el.classList !== undefined) {
            return el.classList.contains(name);
        }
        var className = getClass(el);
        return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
    }

    // @function addClass(el: HTMLElement, name: String)
    // Adds `name` to the element's class attribute.
    function addClass(el, name) {
        if (el.classList !== undefined) {
            var classes = splitWords(name);
            for (var i = 0, len = classes.length; i < len; i++) {
                el.classList.add(classes[i]);
            }
        } else if (!hasClass(el, name)) {
            var className = getClass(el);
            setClass(el, (className ? className + ' ' : '') + name);
        }
    }

    // @function removeClass(el: HTMLElement, name: String)
    // Removes `name` from the element's class attribute.
    function removeClass(el, name) {
        if (el.classList !== undefined) {
            el.classList.remove(name);
        } else {
            setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
        }
    }

    // @function setClass(el: HTMLElement, name: String)
    // Sets the element's class.
    function setClass(el, name) {
        if (el.className.baseVal === undefined) {
            el.className = name;
        } else {
            // in case of SVG element
            el.className.baseVal = name;
        }
    }

    // @function getClass(el: HTMLElement): String
    // Returns the element's class.
    function getClass(el) {
        return el.className.baseVal === undefined ? el.className : el.className.baseVal;
    }

    // @function setOpacity(el: HTMLElement, opacity: Number)
    // Set the opacity of an element (including old IE support).
    // `opacity` must be a number from `0` to `1`.
    function setOpacity(el, value) {
        if ('opacity' in el.style) {
            el.style.opacity = value;
        } else if ('filter' in el.style) {
            _setOpacityIE(el, value);
        }
    }

    function _setOpacityIE(el, value) {
        var filter = false,
            filterName = 'DXImageTransform.Microsoft.Alpha';

        // filters collection throws an error if we try to retrieve a filter that doesn't exist
        try {
            filter = el.filters.item(filterName);
        } catch (e) {
            // don't set opacity to 1 if we haven't already set an opacity,
            // it isn't needed and breaks transparent pngs.
            if (value === 1) {
                return;
            }
        }

        value = Math.round(value * 100);

        if (filter) {
            filter.Enabled = value !== 100;
            filter.Opacity = value;
        } else {
            el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
        }
    }

    // @function testProp(props: String[]): String|false
    // Goes through the array of style names and returns the first name
    // that is a valid style name for an element. If no such name is found,
    // it returns false. Useful for vendor-prefixed styles like `transform`.
    function testProp(props) {
        var style = document.documentElement.style;

        for (var i = 0; i < props.length; i++) {
            if (props[i] in style) {
                return props[i];
            }
        }
        return false;
    }

    // @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
    // Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
    // and optionally scaled by `scale`. Does not have an effect if the
    // browser doesn't support 3D CSS transforms.
    function setTransform(el, offset, scale) {
        var pos = offset || new Point(0, 0);

        el.style[TRANSFORM] = (ie3d ? 'translate(' + pos.x + 'px,' + pos.y + 'px)' : 'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') + (scale ? ' scale(' + scale + ')' : '');
    }

    // @function setPosition(el: HTMLElement, position: Point)
    // Sets the position of `el` to coordinates specified by `position`,
    // using CSS translate or top/left positioning depending on the browser
    // (used by Leaflet internally to position its layers).
    function setPosition(el, point) {

        /*eslint-disable */
        el._leaflet_pos = point;
        /* eslint-enable */

        if (any3d) {
            setTransform(el, point);
        } else {
            el.style.left = point.x + 'px';
            el.style.top = point.y + 'px';
        }
    }

    // @function getPosition(el: HTMLElement): Point
    // Returns the coordinates of an element previously positioned with setPosition.
    function getPosition(el) {
        // this method is only used for elements previously positioned using setPosition,
        // so it's safe to cache the position for performance

        return el._leaflet_pos || new Point(0, 0);
    }

    // @function disableTextSelection()
    // Prevents the user from generating `selectstart` DOM events, usually generated
    // when the user drags the mouse through a page with text. Used internally
    // by Leaflet to override the behaviour of any click-and-drag interaction on
    // the map. Affects drag interactions on the whole document.

    // @function enableTextSelection()
    // Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
    var disableTextSelection;
    var enableTextSelection;
    var _userSelect;
    if ('onselectstart' in document) {
        disableTextSelection = function disableTextSelection() {
            on(window, 'selectstart', preventDefault);
        };
        enableTextSelection = function enableTextSelection() {
            off(window, 'selectstart', preventDefault);
        };
    } else {
        var userSelectProperty = testProp(['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

        disableTextSelection = function disableTextSelection() {
            if (userSelectProperty) {
                var style = document.documentElement.style;
                _userSelect = style[userSelectProperty];
                style[userSelectProperty] = 'none';
            }
        };
        enableTextSelection = function enableTextSelection() {
            if (userSelectProperty) {
                document.documentElement.style[userSelectProperty] = _userSelect;
                _userSelect = undefined;
            }
        };
    }

    // @function disableImageDrag()
    // As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
    // for `dragstart` DOM events, usually generated when the user drags an image.
    function disableImageDrag() {
        on(window, 'dragstart', preventDefault);
    }

    // @function enableImageDrag()
    // Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
    function enableImageDrag() {
        off(window, 'dragstart', preventDefault);
    }

    var _outlineElement;
    var _outlineStyle;
    // @function preventOutline(el: HTMLElement)
    // Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
    // of the element `el` invisible. Used internally by Leaflet to prevent
    // focusable elements from displaying an outline when the user performs a
    // drag interaction on them.
    function preventOutline(element) {
        while (element.tabIndex === -1) {
            element = element.parentNode;
        }
        if (!element.style) {
            return;
        }
        restoreOutline();
        _outlineElement = element;
        _outlineStyle = element.style.outline;
        element.style.outline = 'none';
        on(window, 'keydown', restoreOutline);
    }

    // @function restoreOutline()
    // Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
    function restoreOutline() {
        if (!_outlineElement) {
            return;
        }
        _outlineElement.style.outline = _outlineStyle;
        _outlineElement = undefined;
        _outlineStyle = undefined;
        off(window, 'keydown', restoreOutline);
    }

    // @function getSizedParentNode(el: HTMLElement): HTMLElement
    // Finds the closest parent node which size (width and height) is not null.
    function getSizedParentNode(element) {
        do {
            element = element.parentNode;
        } while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
        return element;
    }

    // @function getScale(el: HTMLElement): Object
    // Computes the CSS scale currently applied on the element.
    // Returns an object with `x` and `y` members as horizontal and vertical scales respectively,
    // and `boundingClientRect` as the result of [`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
    function getScale(element) {
        var rect = element.getBoundingClientRect(); // Read-only in old browsers.

        return {
            x: rect.width / element.offsetWidth || 1,
            y: rect.height / element.offsetHeight || 1,
            boundingClientRect: rect
        };
    }

    var DomUtil = (Object.freeze || Object)({
        TRANSFORM: TRANSFORM,
        TRANSITION: TRANSITION,
        TRANSITION_END: TRANSITION_END,
        get: get,
        getStyle: getStyle,
        create: create$1,
        remove: remove,
        empty: empty,
        toFront: toFront,
        toBack: toBack,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        setClass: setClass,
        getClass: getClass,
        setOpacity: setOpacity,
        testProp: testProp,
        setTransform: setTransform,
        setPosition: setPosition,
        getPosition: getPosition,
        disableTextSelection: disableTextSelection,
        enableTextSelection: enableTextSelection,
        disableImageDrag: disableImageDrag,
        enableImageDrag: enableImageDrag,
        preventOutline: preventOutline,
        restoreOutline: restoreOutline,
        getSizedParentNode: getSizedParentNode,
        getScale: getScale
    });

    /*
     * @namespace DomEvent
     * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
     */

    // Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

    // @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
    // Adds a listener function (`fn`) to a particular DOM event type of the
    // element `el`. You can optionally specify the context of the listener
    // (object the `this` keyword will point to). You can also pass several
    // space-separated types (e.g. `'click dblclick'`).

    // @alternative
    // @function on(el: HTMLElement, eventMap: Object, context?: Object): this
    // Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
    function on(obj, types, fn, context) {

        if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
            for (var type in types) {
                addOne(obj, type, types[type], fn);
            }
        } else {
            types = splitWords(types);

            for (var i = 0, len = types.length; i < len; i++) {
                addOne(obj, types[i], fn, context);
            }
        }

        return this;
    }

    var eventsKey = '_leaflet_events';

    // @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
    // Removes a previously added listener function.
    // Note that if you passed a custom context to on, you must pass the same
    // context to `off` in order to remove the listener.

    // @alternative
    // @function off(el: HTMLElement, eventMap: Object, context?: Object): this
    // Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
    function off(obj, types, fn, context) {

        if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
            for (var type in types) {
                removeOne(obj, type, types[type], fn);
            }
        } else if (types) {
            types = splitWords(types);

            for (var i = 0, len = types.length; i < len; i++) {
                removeOne(obj, types[i], fn, context);
            }
        } else {
            for (var j in obj[eventsKey]) {
                removeOne(obj, j, obj[eventsKey][j]);
            }
            delete obj[eventsKey];
        }

        return this;
    }

    function addOne(obj, type, fn, context) {
        var id = type + stamp(fn) + (context ? '_' + stamp(context) : '');

        if (obj[eventsKey] && obj[eventsKey][id]) {
            return this;
        }

        var handler = function handler(e) {
            return fn.call(context || obj, e || window.event);
        };

        var originalHandler = handler;

        if (pointer && type.indexOf('touch') === 0) {
            // Needs DomEvent.Pointer.js
            addPointerListener(obj, type, handler, id);
        } else if (touch && type === 'dblclick' && addDoubleTapListener && !(pointer && chrome)) {
            // Chrome >55 does not need the synthetic dblclicks from addDoubleTapListener
            // See #5180
            addDoubleTapListener(obj, handler, id);
        } else if ('addEventListener' in obj) {

            if (type === 'mousewheel') {
                obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);
            } else if (type === 'mouseenter' || type === 'mouseleave') {
                handler = function handler(e) {
                    e = e || window.event;
                    if (isExternalTarget(obj, e)) {
                        originalHandler(e);
                    }
                };
                obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);
            } else {
                if (type === 'click' && android) {
                    handler = function handler(e) {
                        filterClick(e, originalHandler);
                    };
                }
                obj.addEventListener(type, handler, false);
            }
        } else if ('attachEvent' in obj) {
            obj.attachEvent('on' + type, handler);
        }

        obj[eventsKey] = obj[eventsKey] || {};
        obj[eventsKey][id] = handler;
    }

    function removeOne(obj, type, fn, context) {

        var id = type + stamp(fn) + (context ? '_' + stamp(context) : ''),
            handler = obj[eventsKey] && obj[eventsKey][id];

        if (!handler) {
            return this;
        }

        if (pointer && type.indexOf('touch') === 0) {
            removePointerListener(obj, type, id);
        } else if (touch && type === 'dblclick' && removeDoubleTapListener && !(pointer && chrome)) {
            removeDoubleTapListener(obj, id);
        } else if ('removeEventListener' in obj) {

            if (type === 'mousewheel') {
                obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);
            } else {
                obj.removeEventListener(type === 'mouseenter' ? 'mouseover' : type === 'mouseleave' ? 'mouseout' : type, handler, false);
            }
        } else if ('detachEvent' in obj) {
            obj.detachEvent('on' + type, handler);
        }

        obj[eventsKey][id] = null;
    }

    // @function stopPropagation(ev: DOMEvent): this
    // Stop the given event from propagation to parent elements. Used inside the listener functions:
    // ```js
    // L.DomEvent.on(div, 'click', function (ev) {
    // 	L.DomEvent.stopPropagation(ev);
    // });
    // ```
    function stopPropagation(e) {

        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (e.originalEvent) {
            // In case of Leaflet event.
            e.originalEvent._stopped = true;
        } else {
            e.cancelBubble = true;
        }
        skipped(e);

        return this;
    }

    // @function disableScrollPropagation(el: HTMLElement): this
    // Adds `stopPropagation` to the element's `'mousewheel'` events (plus browser variants).
    function disableScrollPropagation(el) {
        addOne(el, 'mousewheel', stopPropagation);
        return this;
    }

    // @function disableClickPropagation(el: HTMLElement): this
    // Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
    // `'mousedown'` and `'touchstart'` events (plus browser variants).
    function disableClickPropagation(el) {
        on(el, 'mousedown touchstart dblclick', stopPropagation);
        addOne(el, 'click', fakeStop);
        return this;
    }

    // @function preventDefault(ev: DOMEvent): this
    // Prevents the default action of the DOM Event `ev` from happening (such as
    // following a link in the href of the a element, or doing a POST request
    // with page reload when a `<form>` is submitted).
    // Use it inside listener functions.
    function preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        return this;
    }

    // @function stop(ev: DOMEvent): this
    // Does `stopPropagation` and `preventDefault` at the same time.
    function stop(e) {
        preventDefault(e);
        stopPropagation(e);
        return this;
    }

    // @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
    // Gets normalized mouse position from a DOM event relative to the
    // `container` (border excluded) or to the whole page if not specified.
    function getMousePosition(e, container) {
        if (!container) {
            return new Point(e.clientX, e.clientY);
        }

        var scale = getScale(container),
            offset = scale.boundingClientRect; // left and top  values are in page scale (like the event clientX/Y)

        return new Point(
        // offset.left/top values are in page scale (like clientX/Y),
        // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
        (e.clientX - offset.left) / scale.x - container.clientLeft, (e.clientY - offset.top) / scale.y - container.clientTop);
    }

    // Chrome on Win scrolls double the pixels as in other platforms (see #4538),
    // and Firefox scrolls device pixels, not CSS pixels
    var wheelPxFactor = win && chrome ? 2 * window.devicePixelRatio : gecko ? window.devicePixelRatio : 1;

    // @function getWheelDelta(ev: DOMEvent): Number
    // Gets normalized wheel delta from a mousewheel DOM event, in vertical
    // pixels scrolled (negative if scrolling down).
    // Events from pointing devices without precise scrolling are mapped to
    // a best guess of 60 pixels.
    function getWheelDelta(e) {
        return edge ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
        e.deltaY && e.deltaMode === 0 ? -e.deltaY / wheelPxFactor : // Pixels
        e.deltaY && e.deltaMode === 1 ? -e.deltaY * 20 : // Lines
        e.deltaY && e.deltaMode === 2 ? -e.deltaY * 60 : // Pages
        e.deltaX || e.deltaZ ? 0 : // Skip horizontal/depth wheel events
        e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
        e.detail && Math.abs(e.detail) < 32765 ? -e.detail * 20 : // Legacy Moz lines
        e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
        0;
    }

    var skipEvents = {};

    function fakeStop(e) {
        // fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
        skipEvents[e.type] = true;
    }

    function skipped(e) {
        var events = skipEvents[e.type];
        // reset when checking, as it's only used in map container and propagates outside of the map
        skipEvents[e.type] = false;
        return events;
    }

    // check if element really left/entered the event target (for mouseenter/mouseleave)
    function isExternalTarget(el, e) {

        var related = e.relatedTarget;

        if (!related) {
            return true;
        }

        try {
            while (related && related !== el) {
                related = related.parentNode;
            }
        } catch (err) {
            return false;
        }
        return related !== el;
    }

    var lastClick;

    // this is a horrible workaround for a bug in Android where a single touch triggers two click events
    function filterClick(e, handler) {
        var timeStamp = e.timeStamp || e.originalEvent && e.originalEvent.timeStamp,
            elapsed = lastClick && timeStamp - lastClick;

        // are they closer together than 500ms yet more than 100ms?
        // Android typically triggers them ~300ms apart while multiple listeners
        // on the same event should be triggered far faster;
        // or check if click is simulated on the element, and if it is, reject any non-simulated events

        if (elapsed && elapsed > 100 && elapsed < 500 || e.target._simulatedClick && !e._simulated) {
            stop(e);
            return;
        }
        lastClick = timeStamp;

        handler(e);
    }

    var DomEvent = (Object.freeze || Object)({
        on: on,
        off: off,
        stopPropagation: stopPropagation,
        disableScrollPropagation: disableScrollPropagation,
        disableClickPropagation: disableClickPropagation,
        preventDefault: preventDefault,
        stop: stop,
        getMousePosition: getMousePosition,
        getWheelDelta: getWheelDelta,
        fakeStop: fakeStop,
        skipped: skipped,
        isExternalTarget: isExternalTarget,
        addListener: on,
        removeListener: off
    });

    /*
     * @class PosAnimation
     * @aka L.PosAnimation
     * @inherits Evented
     * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
     *
     * @example
     * ```js
     * var fx = new L.PosAnimation();
     * fx.run(el, [300, 500], 0.5);
     * ```
     *
     * @constructor L.PosAnimation()
     * Creates a `PosAnimation` object.
     *
     */

    var PosAnimation = Evented.extend({

        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function run(el, newPos, duration, easeLinearity) {
            this.stop();

            this._el = el;
            this._inProgress = true;
            this._duration = duration || 0.25;
            this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

            this._startPos = getPosition(el);
            this._offset = newPos.subtract(this._startPos);
            this._startTime = +new Date();

            // @event start: Event
            // Fired when the animation starts
            this.fire('start');

            this._animate();
        },

        // @method stop()
        // Stops the animation (if currently running).
        stop: function stop() {
            if (!this._inProgress) {
                return;
            }

            this._step(true);
            this._complete();
        },

        _animate: function _animate() {
            // animation loop
            this._animId = requestAnimFrame(this._animate, this);
            this._step();
        },

        _step: function _step(round) {
            var elapsed = +new Date() - this._startTime,
                duration = this._duration * 1000;

            if (elapsed < duration) {
                this._runFrame(this._easeOut(elapsed / duration), round);
            } else {
                this._runFrame(1);
                this._complete();
            }
        },

        _runFrame: function _runFrame(progress, round) {
            var pos = this._startPos.add(this._offset.multiplyBy(progress));
            if (round) {
                pos._round();
            }
            setPosition(this._el, pos);

            // @event step: Event
            // Fired continuously during the animation.
            this.fire('step');
        },

        _complete: function _complete() {
            cancelAnimFrame(this._animId);

            this._inProgress = false;
            // @event end: Event
            // Fired when the animation ends.
            this.fire('end');
        },

        _easeOut: function _easeOut(t) {
            return 1 - Math.pow(1 - t, this._easeOutPower);
        }
    });

    /*
        L.Handler is a base class for handler classes that are used internally to inject
        interaction features like dragging to classes like Map and Marker.
    */

    // @class Handler
    // @aka L.Handler
    // Abstract class for map interaction handlers

    var Handler = Class.extend({
        initialize: function initialize(map) {
            this._map = map;
        },

        // @method enable(): this
        // Enables the handler
        enable: function enable() {
            if (this._enabled) {
                return this;
            }

            this._enabled = true;
            this.addHooks();
            return this;
        },

        // @method disable(): this
        // Disables the handler
        disable: function disable() {
            if (!this._enabled) {
                return this;
            }

            this._enabled = false;
            this.removeHooks();
            return this;
        },

        // @method enabled(): Boolean
        // Returns `true` if the handler is enabled
        enabled: function enabled() {
            return !!this._enabled;
        }

        // @section Extension methods
        // Classes inheriting from `Handler` must implement the two following methods:
        // @method addHooks()
        // Called when the handler is enabled, should add event hooks.
        // @method removeHooks()
        // Called when the handler is disabled, should remove the event hooks added previously.
    });

    // @section There is static function which can be called without instantiating L.Handler:
    // @function addTo(map: Map, name: String): this
    // Adds a new Handler to the given map with the given name.
    Handler.addTo = function (map, name) {
        map.addHandler(name, this);
        return this;
    };

    var Mixin = { Events: Events };

    /*
     * @class Draggable
     * @aka L.Draggable
     * @inherits Evented
     *
     * A class for making DOM elements draggable (including touch support).
     * Used internally for map and marker dragging. Only works for elements
     * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
     *
     * @example
     * ```js
     * var draggable = new L.Draggable(elementToDrag);
     * draggable.enable();
     * ```
     */

    var START = touch ? 'touchstart mousedown' : 'mousedown';
    var END = {
        mousedown: 'mouseup',
        touchstart: 'touchend',
        pointerdown: 'touchend',
        MSPointerDown: 'touchend'
    };
    var MOVE = {
        mousedown: 'mousemove',
        touchstart: 'touchmove',
        pointerdown: 'touchmove',
        MSPointerDown: 'touchmove'
    };

    var Draggable = Evented.extend({

        options: {
            // @section
            // @aka Draggable options
            // @option clickTolerance: Number = 3
            // The max number of pixels a user can shift the mouse pointer during a click
            // for it to be considered a valid click (as opposed to a mouse drag).
            clickTolerance: 3
        },

        // @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
        // Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
        initialize: function initialize(element, dragStartTarget, preventOutline$$1, options) {
            setOptions(this, options);

            this._element = element;
            this._dragStartTarget = dragStartTarget || element;
            this._preventOutline = preventOutline$$1;
        },

        // @method enable()
        // Enables the dragging ability
        enable: function enable() {
            if (this._enabled) {
                return;
            }

            on(this._dragStartTarget, START, this._onDown, this);

            this._enabled = true;
        },

        // @method disable()
        // Disables the dragging ability
        disable: function disable() {
            if (!this._enabled) {
                return;
            }

            // If we're currently dragging this draggable,
            // disabling it counts as first ending the drag.
            if (Draggable._dragging === this) {
                this.finishDrag();
            }

            off(this._dragStartTarget, START, this._onDown, this);

            this._enabled = false;
            this._moved = false;
        },

        _onDown: function _onDown(e) {
            // Ignore simulated events, since we handle both touch and
            // mouse explicitly; otherwise we risk getting duplicates of
            // touch events, see #4315.
            // Also ignore the event if disabled; this happens in IE11
            // under some circumstances, see #3666.
            if (e._simulated || !this._enabled) {
                return;
            }

            this._moved = false;

            if (hasClass(this._element, 'leaflet-zoom-anim')) {
                return;
            }

            if (Draggable._dragging || e.shiftKey || e.which !== 1 && e.button !== 1 && !e.touches) {
                return;
            }
            Draggable._dragging = this; // Prevent dragging multiple objects at once.

            if (this._preventOutline) {
                preventOutline(this._element);
            }

            disableImageDrag();
            disableTextSelection();

            if (this._moving) {
                return;
            }

            // @event down: Event
            // Fired when a drag is about to start.
            this.fire('down');

            var first = e.touches ? e.touches[0] : e,
                sizedParent = getSizedParentNode(this._element);

            this._startPoint = new Point(first.clientX, first.clientY);

            // Cache the scale, so that we can continuously compensate for it during drag (_onMove).
            this._parentScale = getScale(sizedParent);

            on(document, MOVE[e.type], this._onMove, this);
            on(document, END[e.type], this._onUp, this);
        },

        _onMove: function _onMove(e) {
            // Ignore simulated events, since we handle both touch and
            // mouse explicitly; otherwise we risk getting duplicates of
            // touch events, see #4315.
            // Also ignore the event if disabled; this happens in IE11
            // under some circumstances, see #3666.
            if (e._simulated || !this._enabled) {
                return;
            }

            if (e.touches && e.touches.length > 1) {
                this._moved = true;
                return;
            }

            var first = e.touches && e.touches.length === 1 ? e.touches[0] : e,
                offset = new Point(first.clientX, first.clientY)._subtract(this._startPoint);

            if (!offset.x && !offset.y) {
                return;
            }
            if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) {
                return;
            }

            // We assume that the parent container's position, border and scale do not change for the duration of the drag.
            // Therefore there is no need to account for the position and border (they are eliminated by the subtraction)
            // and we can use the cached value for the scale.
            offset.x /= this._parentScale.x;
            offset.y /= this._parentScale.y;

            preventDefault(e);

            if (!this._moved) {
                // @event dragstart: Event
                // Fired when a drag starts
                this.fire('dragstart');

                this._moved = true;
                this._startPos = getPosition(this._element).subtract(offset);

                addClass(document.body, 'leaflet-dragging');

                this._lastTarget = e.target || e.srcElement;
                // IE and Edge do not give the <use> element, so fetch it
                // if necessary
                if (window.SVGElementInstance && this._lastTarget instanceof SVGElementInstance) {
                    this._lastTarget = this._lastTarget.correspondingUseElement;
                }
                addClass(this._lastTarget, 'leaflet-drag-target');
            }

            this._newPos = this._startPos.add(offset);
            this._moving = true;

            cancelAnimFrame(this._animRequest);
            this._lastEvent = e;
            this._animRequest = requestAnimFrame(this._updatePosition, this, true);
        },

        _updatePosition: function _updatePosition() {
            var e = { originalEvent: this._lastEvent };

            // @event predrag: Event
            // Fired continuously during dragging *before* each corresponding
            // update of the element's position.
            this.fire('predrag', e);
            setPosition(this._element, this._newPos);

            // @event drag: Event
            // Fired continuously during dragging.
            this.fire('drag', e);
        },

        _onUp: function _onUp(e) {
            // Ignore simulated events, since we handle both touch and
            // mouse explicitly; otherwise we risk getting duplicates of
            // touch events, see #4315.
            // Also ignore the event if disabled; this happens in IE11
            // under some circumstances, see #3666.
            if (e._simulated || !this._enabled) {
                return;
            }
            this.finishDrag();
        },

        finishDrag: function finishDrag() {
            removeClass(document.body, 'leaflet-dragging');

            if (this._lastTarget) {
                removeClass(this._lastTarget, 'leaflet-drag-target');
                this._lastTarget = null;
            }

            for (var i in MOVE) {
                off(document, MOVE[i], this._onMove, this);
                off(document, END[i], this._onUp, this);
            }

            enableImageDrag();
            enableTextSelection();

            if (this._moved && this._moving) {
                // ensure drag is not fired after dragend
                cancelAnimFrame(this._animRequest);

                // @event dragend: DragEndEvent
                // Fired when the drag ends.
                this.fire('dragend', {
                    distance: this._newPos.distanceTo(this._startPos)
                });
            }

            this._moving = false;
            Draggable._dragging = false;
        }

    });

    /*
     * @namespace LineUtil
     *
     * Various utility functions for polyline points processing, used by Leaflet internally to make polylines lightning-fast.
     */

    // Simplify polyline with vertex reduction and Douglas-Peucker simplification.
    // Improves rendering performance dramatically by lessening the number of points to draw.

    // @function simplify(points: Point[], tolerance: Number): Point[]
    // Dramatically reduces the number of points in a polyline while retaining
    // its shape and returns a new array of simplified points, using the
    // [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
    // Used for a huge performance boost when processing/displaying Leaflet polylines for
    // each zoom level and also reducing visual noise. tolerance affects the amount of
    // simplification (lesser value means higher quality but slower and with more points).
    // Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
    function simplify(points, tolerance) {
        if (!tolerance || !points.length) {
            return points.slice();
        }

        var sqTolerance = tolerance * tolerance;

        // stage 1: vertex reduction
        points = _reducePoints(points, sqTolerance);

        // stage 2: Douglas-Peucker simplification
        points = _simplifyDP(points, sqTolerance);

        return points;
    }

    // @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
    // Returns the distance between point `p` and segment `p1` to `p2`.
    function pointToSegmentDistance(p, p1, p2) {
        return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
    }

    // @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
    // Returns the closest point from a point `p` on a segment `p1` to `p2`.
    function closestPointOnSegment(p, p1, p2) {
        return _sqClosestPointOnSegment(p, p1, p2);
    }

    // Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
    function _simplifyDP(points, sqTolerance) {

        var len = points.length,
            ArrayConstructor = (typeof Uint8Array === 'undefined' ? 'undefined' : _typeof(Uint8Array)) !== undefined + '' ? Uint8Array : Array,
            markers = new ArrayConstructor(len);

        markers[0] = markers[len - 1] = 1;

        _simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

        var i,
            newPoints = [];

        for (i = 0; i < len; i++) {
            if (markers[i]) {
                newPoints.push(points[i]);
            }
        }

        return newPoints;
    }

    function _simplifyDPStep(points, markers, sqTolerance, first, last) {

        var maxSqDist = 0,
            index,
            i,
            sqDist;

        for (i = first + 1; i <= last - 1; i++) {
            sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;

            _simplifyDPStep(points, markers, sqTolerance, first, index);
            _simplifyDPStep(points, markers, sqTolerance, index, last);
        }
    }

    // reduce points that are too close to each other to a single point
    function _reducePoints(points, sqTolerance) {
        var reducedPoints = [points[0]];

        for (var i = 1, prev = 0, len = points.length; i < len; i++) {
            if (_sqDist(points[i], points[prev]) > sqTolerance) {
                reducedPoints.push(points[i]);
                prev = i;
            }
        }
        if (prev < len - 1) {
            reducedPoints.push(points[len - 1]);
        }
        return reducedPoints;
    }

    var _lastCode;

    // @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
    // Clips the segment a to b by rectangular bounds with the
    // [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
    // (modifying the segment points directly!). Used by Leaflet to only show polyline
    // points that are on the screen or near, increasing performance.
    function clipSegment(a, b, bounds, useLastCode, round) {
        var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
            codeB = _getBitCode(b, bounds),
            codeOut,
            p,
            newCode;

        // save 2nd code to avoid calculating it on the next segment
        _lastCode = codeB;

        while (true) {
            // if a,b is inside the clip window (trivial accept)
            if (!(codeA | codeB)) {
                return [a, b];
            }

            // if a,b is outside the clip window (trivial reject)
            if (codeA & codeB) {
                return false;
            }

            // other cases
            codeOut = codeA || codeB;
            p = _getEdgeIntersection(a, b, codeOut, bounds, round);
            newCode = _getBitCode(p, bounds);

            if (codeOut === codeA) {
                a = p;
                codeA = newCode;
            } else {
                b = p;
                codeB = newCode;
            }
        }
    }

    function _getEdgeIntersection(a, b, code, bounds, round) {
        var dx = b.x - a.x,
            dy = b.y - a.y,
            min = bounds.min,
            max = bounds.max,
            x,
            y;

        if (code & 8) {
            // top
            x = a.x + dx * (max.y - a.y) / dy;
            y = max.y;
        } else if (code & 4) {
            // bottom
            x = a.x + dx * (min.y - a.y) / dy;
            y = min.y;
        } else if (code & 2) {
            // right
            x = max.x;
            y = a.y + dy * (max.x - a.x) / dx;
        } else if (code & 1) {
            // left
            x = min.x;
            y = a.y + dy * (min.x - a.x) / dx;
        }

        return new Point(x, y, round);
    }

    function _getBitCode(p, bounds) {
        var code = 0;

        if (p.x < bounds.min.x) {
            // left
            code |= 1;
        } else if (p.x > bounds.max.x) {
            // right
            code |= 2;
        }

        if (p.y < bounds.min.y) {
            // bottom
            code |= 4;
        } else if (p.y > bounds.max.y) {
            // top
            code |= 8;
        }

        return code;
    }

    // square distance (to avoid unnecessary Math.sqrt calls)
    function _sqDist(p1, p2) {
        var dx = p2.x - p1.x,
            dy = p2.y - p1.y;
        return dx * dx + dy * dy;
    }

    // return closest point on segment or distance to that point
    function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
        var x = p1.x,
            y = p1.y,
            dx = p2.x - x,
            dy = p2.y - y,
            dot = dx * dx + dy * dy,
            t;

        if (dot > 0) {
            t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

            if (t > 1) {
                x = p2.x;
                y = p2.y;
            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = p.x - x;
        dy = p.y - y;

        return sqDist ? dx * dx + dy * dy : new Point(x, y);
    }

    // @function isFlat(latlngs: LatLng[]): Boolean
    // Returns true if `latlngs` is a flat array, false is nested.
    function isFlat(latlngs) {
        return !isArray(latlngs[0]) || _typeof(latlngs[0][0]) !== 'object' && typeof latlngs[0][0] !== 'undefined';
    }

    function _flat(latlngs) {
        console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
        return isFlat(latlngs);
    }

    var LineUtil = (Object.freeze || Object)({
        simplify: simplify,
        pointToSegmentDistance: pointToSegmentDistance,
        closestPointOnSegment: closestPointOnSegment,
        clipSegment: clipSegment,
        _getEdgeIntersection: _getEdgeIntersection,
        _getBitCode: _getBitCode,
        _sqClosestPointOnSegment: _sqClosestPointOnSegment,
        isFlat: isFlat,
        _flat: _flat
    });

    /*
     * @namespace PolyUtil
     * Various utility functions for polygon geometries.
     */

    /* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
     * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
     * Used by Leaflet to only show polygon points that are on the screen or near, increasing
     * performance. Note that polygon points needs different algorithm for clipping
     * than polyline, so there's a separate method for it.
     */
    function clipPolygon(points, bounds, round) {
        var clippedPoints,
            edges = [1, 4, 2, 8],
            i,
            j,
            k,
            a,
            b,
            len,
            edge,
            p;

        for (i = 0, len = points.length; i < len; i++) {
            points[i]._code = _getBitCode(points[i], bounds);
        }

        // for each edge (left, bottom, right, top)
        for (k = 0; k < 4; k++) {
            edge = edges[k];
            clippedPoints = [];

            for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
                a = points[i];
                b = points[j];

                // if a is inside the clip window
                if (!(a._code & edge)) {
                    // if b is outside the clip window (a->b goes out of screen)
                    if (b._code & edge) {
                        p = _getEdgeIntersection(b, a, edge, bounds, round);
                        p._code = _getBitCode(p, bounds);
                        clippedPoints.push(p);
                    }
                    clippedPoints.push(a);

                    // else if b is inside the clip window (a->b enters the screen)
                } else if (!(b._code & edge)) {
                    p = _getEdgeIntersection(b, a, edge, bounds, round);
                    p._code = _getBitCode(p, bounds);
                    clippedPoints.push(p);
                }
            }
            points = clippedPoints;
        }

        return points;
    }

    var PolyUtil = (Object.freeze || Object)({
        clipPolygon: clipPolygon
    });

    /*
     * @namespace Projection
     * @section
     * Leaflet comes with a set of already defined Projections out of the box:
     *
     * @projection L.Projection.LonLat
     *
     * Equirectangular, or Plate Carree projection — the most simple projection,
     * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
     * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
     * `EPSG:4326` and `Simple` CRS.
     */

    var LonLat = {
        project: function project(latlng) {
            return new Point(latlng.lng, latlng.lat);
        },

        unproject: function unproject(point) {
            return new LatLng(point.y, point.x);
        },

        bounds: new Bounds([-180, -90], [180, 90])
    };

    /*
     * @namespace Projection
     * @projection L.Projection.Mercator
     *
     * Elliptical Mercator projection — more complex than Spherical Mercator. Takes into account that Earth is a geoid, not a perfect sphere. Used by the EPSG:3395 CRS.
     */

    var Mercator = {
        R: 6378137,
        R_MINOR: 6356752.314245179,

        bounds: new Bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

        project: function project(latlng) {
            var d = Math.PI / 180,
                r = this.R,
                y = latlng.lat * d,
                tmp = this.R_MINOR / r,
                e = Math.sqrt(1 - tmp * tmp),
                con = e * Math.sin(y);

            var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
            y = -r * Math.log(Math.max(ts, 1E-10));

            return new Point(latlng.lng * d * r, y);
        },

        unproject: function unproject(point) {
            var d = 180 / Math.PI,
                r = this.R,
                tmp = this.R_MINOR / r,
                e = Math.sqrt(1 - tmp * tmp),
                ts = Math.exp(-point.y / r),
                phi = Math.PI / 2 - 2 * Math.atan(ts);

            for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
                con = e * Math.sin(phi);
                con = Math.pow((1 - con) / (1 + con), e / 2);
                dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
                phi += dphi;
            }

            return new LatLng(phi * d, point.x * d / r);
        }
    };

    /*
     * @class Projection
    
     * An object with methods for projecting geographical coordinates of the world onto
     * a flat surface (and back). See [Map projection](http://en.wikipedia.org/wiki/Map_projection).
    
     * @property bounds: Bounds
     * The bounds (specified in CRS units) where the projection is valid
    
     * @method project(latlng: LatLng): Point
     * Projects geographical coordinates into a 2D point.
     * Only accepts actual `L.LatLng` instances, not arrays.
    
     * @method unproject(point: Point): LatLng
     * The inverse of `project`. Projects a 2D point into a geographical location.
     * Only accepts actual `L.Point` instances, not arrays.
    
     * Note that the projection instances do not inherit from Leafet's `Class` object,
     * and can't be instantiated. Also, new classes can't inherit from them,
     * and methods can't be added to them with the `include` function.
    
     */

    var index = (Object.freeze || Object)({
        LonLat: LonLat,
        Mercator: Mercator,
        SphericalMercator: SphericalMercator
    });

    /*
     * @namespace CRS
     * @crs L.CRS.EPSG3395
     *
     * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
     */
    var EPSG3395 = extend({}, Earth, {
        code: 'EPSG:3395',
        projection: Mercator,

        transformation: function () {
            var scale = 0.5 / (Math.PI * Mercator.R);
            return toTransformation(scale, 0.5, -scale, 0.5);
        }()
    });

    /*
     * @namespace CRS
     * @crs L.CRS.EPSG4326
     *
     * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
     *
     * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
     * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
     * with this CRS, ensure that there are two 256x256 pixel tiles covering the
     * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
     * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
     */

    var EPSG4326 = extend({}, Earth, {
        code: 'EPSG:4326',
        projection: LonLat,
        transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
    });

    /*
     * @namespace CRS
     * @crs L.CRS.Simple
     *
     * A simple CRS that maps longitude and latitude into `x` and `y` directly.
     * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
     * axis should still be inverted (going from bottom to top). `distance()` returns
     * simple euclidean distance.
     */

    var Simple = extend({}, CRS, {
        projection: LonLat,
        transformation: toTransformation(1, 0, -1, 0),

        scale: function scale(zoom) {
            return Math.pow(2, zoom);
        },

        zoom: function zoom(scale) {
            return Math.log(scale) / Math.LN2;
        },

        distance: function distance(latlng1, latlng2) {
            var dx = latlng2.lng - latlng1.lng,
                dy = latlng2.lat - latlng1.lat;

            return Math.sqrt(dx * dx + dy * dy);
        },

        infinite: true
    });

    CRS.Earth = Earth;
    CRS.EPSG3395 = EPSG3395;
    CRS.EPSG3857 = EPSG3857;
    CRS.EPSG900913 = EPSG900913;
    CRS.EPSG4326 = EPSG4326;
    CRS.Simple = Simple;

    /*
     * @class Layer
     * @inherits Evented
     * @aka L.Layer
     * @aka ILayer
     *
     * A set of methods from the Layer base class that all Leaflet layers use.
     * Inherits all methods, options and events from `L.Evented`.
     *
     * @example
     *
     * ```js
     * var layer = L.Marker(latlng).addTo(map);
     * layer.addTo(map);
     * layer.remove();
     * ```
     *
     * @event add: Event
     * Fired after the layer is added to a map
     *
     * @event remove: Event
     * Fired after the layer is removed from a map
     */

    var Layer = Evented.extend({

        // Classes extending `L.Layer` will inherit the following options:
        options: {
            // @option pane: String = 'overlayPane'
            // By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
            pane: 'overlayPane',

            // @option attribution: String = null
            // String to be shown in the attribution control, describes the layer data, e.g. "© Mapbox".
            attribution: null,

            bubblingMouseEvents: true
        },

        /* @section
         * Classes extending `L.Layer` will inherit the following methods:
         *
         * @method addTo(map: Map|LayerGroup): this
         * Adds the layer to the given map or layer group.
         */
        addTo: function addTo(map) {
            map.addLayer(this);
            return this;
        },

        // @method remove: this
        // Removes the layer from the map it is currently active on.
        remove: function remove() {
            return this.removeFrom(this._map || this._mapToAdd);
        },

        // @method removeFrom(map: Map): this
        // Removes the layer from the given map
        removeFrom: function removeFrom(obj) {
            if (obj) {
                obj.removeLayer(this);
            }
            return this;
        },

        // @method getPane(name? : String): HTMLElement
        // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
        getPane: function getPane(name) {
            return this._map.getPane(name ? this.options[name] || name : this.options.pane);
        },

        addInteractiveTarget: function addInteractiveTarget(targetEl) {
            this._map._targets[stamp(targetEl)] = this;
            return this;
        },

        removeInteractiveTarget: function removeInteractiveTarget(targetEl) {
            delete this._map._targets[stamp(targetEl)];
            return this;
        },

        // @method getAttribution: String
        // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
        getAttribution: function getAttribution() {
            return this.options.attribution;
        },

        _layerAdd: function _layerAdd(e) {
            var map = e.target;

            // check in case layer gets added and then removed before the map is ready
            if (!map.hasLayer(this)) {
                return;
            }

            this._map = map;
            this._zoomAnimated = map._zoomAnimated;

            if (this.getEvents) {
                var events = this.getEvents();
                map.on(events, this);
                this.once('remove', function () {
                    map.off(events, this);
                }, this);
            }

            this.onAdd(map);

            if (this.getAttribution && map.attributionControl) {
                map.attributionControl.addAttribution(this.getAttribution());
            }

            this.fire('add');
            map.fire('layeradd', { layer: this });
        }
    });

    /* @section Extension methods
     * @uninheritable
     *
     * Every layer should extend from `L.Layer` and (re-)implement the following methods.
     *
     * @method onAdd(map: Map): this
     * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
     *
     * @method onRemove(map: Map): this
     * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
     *
     * @method getEvents(): Object
     * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
     *
     * @method getAttribution(): String
     * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
     *
     * @method beforeAdd(map: Map): this
     * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
     */

    /*
     * @class LayerGroup
     * @aka L.LayerGroup
     * @inherits Layer
     *
     * Used to group several layers and handle them as one. If you add it to the map,
     * any layers added or removed from the group will be added/removed on the map as
     * well. Extends `Layer`.
     *
     * @example
     *
     * ```js
     * L.layerGroup([marker1, marker2])
     * 	.addLayer(polyline)
     * 	.addTo(map);
     * ```
     */

    var LayerGroup = Layer.extend({

        initialize: function initialize(layers, options) {
            setOptions(this, options);

            this._layers = {};

            var i, len;

            if (layers) {
                for (i = 0, len = layers.length; i < len; i++) {
                    this.addLayer(layers[i]);
                }
            }
        },

        // @method addLayer(layer: Layer): this
        // Adds the given layer to the group.
        addLayer: function addLayer(layer) {
            var id = this.getLayerId(layer);

            this._layers[id] = layer;

            if (this._map) {
                this._map.addLayer(layer);
            }

            return this;
        },

        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the group.
        // @alternative
        // @method removeLayer(id: Number): this
        // Removes the layer with the given internal ID from the group.
        removeLayer: function removeLayer(layer) {
            var id = layer in this._layers ? layer : this.getLayerId(layer);

            if (this._map && this._layers[id]) {
                this._map.removeLayer(this._layers[id]);
            }

            delete this._layers[id];

            return this;
        },

        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the group.
        // @alternative
        // @method hasLayer(id: Number): Boolean
        // Returns `true` if the given internal ID is currently added to the group.
        hasLayer: function hasLayer(layer) {
            return !!layer && (layer in this._layers || this.getLayerId(layer) in this._layers);
        },

        // @method clearLayers(): this
        // Removes all the layers from the group.
        clearLayers: function clearLayers() {
            return this.eachLayer(this.removeLayer, this);
        },

        // @method invoke(methodName: String, …): this
        // Calls `methodName` on every layer contained in this group, passing any
        // additional parameters. Has no effect if the layers contained do not
        // implement `methodName`.
        invoke: function invoke(methodName) {
            var args = Array.prototype.slice.call(arguments, 1),
                i,
                layer;

            for (i in this._layers) {
                layer = this._layers[i];

                if (layer[methodName]) {
                    layer[methodName].apply(layer, args);
                }
            }

            return this;
        },

        onAdd: function onAdd(map) {
            this.eachLayer(map.addLayer, map);
        },

        onRemove: function onRemove(map) {
            this.eachLayer(map.removeLayer, map);
        },

        // @method eachLayer(fn: Function, context?: Object): this
        // Iterates over the layers of the group, optionally specifying context of the iterator function.
        // ```js
        // group.eachLayer(function (layer) {
        // 	layer.bindPopup('Hello');
        // });
        // ```
        eachLayer: function eachLayer(method, context) {
            for (var i in this._layers) {
                method.call(context, this._layers[i]);
            }
            return this;
        },

        // @method getLayer(id: Number): Layer
        // Returns the layer with the given internal ID.
        getLayer: function getLayer(id) {
            return this._layers[id];
        },

        // @method getLayers(): Layer[]
        // Returns an array of all the layers added to the group.
        getLayers: function getLayers() {
            var layers = [];
            this.eachLayer(layers.push, layers);
            return layers;
        },

        // @method setZIndex(zIndex: Number): this
        // Calls `setZIndex` on every layer contained in this group, passing the z-index.
        setZIndex: function setZIndex(zIndex) {
            return this.invoke('setZIndex', zIndex);
        },

        // @method getLayerId(layer: Layer): Number
        // Returns the internal ID for a layer
        getLayerId: function getLayerId(layer) {
            return stamp(layer);
        }
    });

    // @factory L.layerGroup(layers?: Layer[], options?: Object)
    // Create a layer group, optionally given an initial set of layers and an `options` object.
    var layerGroup = function layerGroup(layers, options) {
        return new LayerGroup(layers, options);
    };

    /*
     * @class FeatureGroup
     * @aka L.FeatureGroup
     * @inherits LayerGroup
     *
     * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
     *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
     *  * Events are propagated to the `FeatureGroup`, so if the group has an event
     * handler, it will handle events from any of the layers. This includes mouse events
     * and custom events.
     *  * Has `layeradd` and `layerremove` events
     *
     * @example
     *
     * ```js
     * L.featureGroup([marker1, marker2, polyline])
     * 	.bindPopup('Hello world!')
     * 	.on('click', function() { alert('Clicked on a member of the group!'); })
     * 	.addTo(map);
     * ```
     */

    var FeatureGroup = LayerGroup.extend({

        addLayer: function addLayer(layer) {
            if (this.hasLayer(layer)) {
                return this;
            }

            layer.addEventParent(this);

            LayerGroup.prototype.addLayer.call(this, layer);

            // @event layeradd: LayerEvent
            // Fired when a layer is added to this `FeatureGroup`
            return this.fire('layeradd', { layer: layer });
        },

        removeLayer: function removeLayer(layer) {
            if (!this.hasLayer(layer)) {
                return this;
            }
            if (layer in this._layers) {
                layer = this._layers[layer];
            }

            layer.removeEventParent(this);

            LayerGroup.prototype.removeLayer.call(this, layer);

            // @event layerremove: LayerEvent
            // Fired when a layer is removed from this `FeatureGroup`
            return this.fire('layerremove', { layer: layer });
        },

        // @method setStyle(style: Path options): this
        // Sets the given path options to each layer of the group that has a `setStyle` method.
        setStyle: function setStyle(style) {
            return this.invoke('setStyle', style);
        },

        // @method bringToFront(): this
        // Brings the layer group to the top of all other layers
        bringToFront: function bringToFront() {
            return this.invoke('bringToFront');
        },

        // @method bringToBack(): this
        // Brings the layer group to the back of all other layers
        bringToBack: function bringToBack() {
            return this.invoke('bringToBack');
        },

        // @method getBounds(): LatLngBounds
        // Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
        getBounds: function getBounds() {
            var bounds = new LatLngBounds();

            for (var id in this._layers) {
                var layer = this._layers[id];
                bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
            }
            return bounds;
        }
    });

    // @factory L.featureGroup(layers: Layer[])
    // Create a feature group, optionally given an initial set of layers.
    var featureGroup = function featureGroup(layers) {
        return new FeatureGroup(layers);
    };

    /*
     * @class Icon
     * @aka L.Icon
     *
     * Represents an icon to provide when creating a marker.
     *
     * @example
     *
     * ```js
     * var myIcon = L.icon({
     *     iconUrl: 'my-icon.png',
     *     iconRetinaUrl: 'my-icon@2x.png',
     *     iconSize: [38, 95],
     *     iconAnchor: [22, 94],
     *     popupAnchor: [-3, -76],
     *     shadowUrl: 'my-icon-shadow.png',
     *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
     *     shadowSize: [68, 95],
     *     shadowAnchor: [22, 94]
     * });
     *
     * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
     * ```
     *
     * `L.Icon.Default` extends `L.Icon` and is the blue icon Leaflet uses for markers by default.
     *
     */

    var Icon = Class.extend({

        /* @section
         * @aka Icon options
         *
         * @option iconUrl: String = null
         * **(required)** The URL to the icon image (absolute or relative to your script path).
         *
         * @option iconRetinaUrl: String = null
         * The URL to a retina sized version of the icon image (absolute or relative to your
         * script path). Used for Retina screen devices.
         *
         * @option iconSize: Point = null
         * Size of the icon image in pixels.
         *
         * @option iconAnchor: Point = null
         * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
         * will be aligned so that this point is at the marker's geographical location. Centered
         * by default if size is specified, also can be set in CSS with negative margins.
         *
         * @option popupAnchor: Point = [0, 0]
         * The coordinates of the point from which popups will "open", relative to the icon anchor.
         *
         * @option tooltipAnchor: Point = [0, 0]
         * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
         *
         * @option shadowUrl: String = null
         * The URL to the icon shadow image. If not specified, no shadow image will be created.
         *
         * @option shadowRetinaUrl: String = null
         *
         * @option shadowSize: Point = null
         * Size of the shadow image in pixels.
         *
         * @option shadowAnchor: Point = null
         * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
         * as iconAnchor if not specified).
         *
         * @option className: String = ''
         * A custom class name to assign to both icon and shadow images. Empty by default.
         */

        options: {
            popupAnchor: [0, 0],
            tooltipAnchor: [0, 0]
        },

        initialize: function initialize(options) {
            setOptions(this, options);
        },

        // @method createIcon(oldIcon?: HTMLElement): HTMLElement
        // Called internally when the icon has to be shown, returns a `<img>` HTML element
        // styled according to the options.
        createIcon: function createIcon(oldIcon) {
            return this._createIcon('icon', oldIcon);
        },

        // @method createShadow(oldIcon?: HTMLElement): HTMLElement
        // As `createIcon`, but for the shadow beneath it.
        createShadow: function createShadow(oldIcon) {
            return this._createIcon('shadow', oldIcon);
        },

        _createIcon: function _createIcon(name, oldIcon) {
            var src = this._getIconUrl(name);

            if (!src) {
                if (name === 'icon') {
                    throw new Error('iconUrl not set in Icon options (see the docs).');
                }
                return null;
            }

            var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
            this._setIconStyles(img, name);

            return img;
        },

        _setIconStyles: function _setIconStyles(img, name) {
            var options = this.options;
            var sizeOption = options[name + 'Size'];

            if (typeof sizeOption === 'number') {
                sizeOption = [sizeOption, sizeOption];
            }

            var size = toPoint(sizeOption),
                anchor = toPoint(name === 'shadow' && options.shadowAnchor || options.iconAnchor || size && size.divideBy(2, true));

            img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

            if (anchor) {
                img.style.marginLeft = -anchor.x + 'px';
                img.style.marginTop = -anchor.y + 'px';
            }

            if (size) {
                img.style.width = size.x + 'px';
                img.style.height = size.y + 'px';
            }
        },

        _createImg: function _createImg(src, el) {
            el = el || document.createElement('img');
            el.src = src;
            return el;
        },

        _getIconUrl: function _getIconUrl(name) {
            return retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
        }
    });

    // @factory L.icon(options: Icon options)
    // Creates an icon instance with the given options.
    function icon(options) {
        return new Icon(options);
    }

    /*
     * @miniclass Icon.Default (Icon)
     * @aka L.Icon.Default
     * @section
     *
     * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
     * no icon is specified. Points to the blue marker image distributed with Leaflet
     * releases.
     *
     * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
     * (which is a set of `Icon options`).
     *
     * If you want to _completely_ replace the default icon, override the
     * `L.Marker.prototype.options.icon` with your own icon instead.
     */

    var IconDefault = Icon.extend({

        options: {
            iconUrl: 'marker-icon.png',
            iconRetinaUrl: 'marker-icon-2x.png',
            shadowUrl: 'marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        },

        _getIconUrl: function _getIconUrl(name) {
            if (!IconDefault.imagePath) {
                // Deprecated, backwards-compatibility only
                IconDefault.imagePath = this._detectIconPath();
            }

            // @option imagePath: String
            // `Icon.Default` will try to auto-detect the location of the
            // blue icon images. If you are placing these images in a non-standard
            // way, set this option to point to the right path.
            return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
        },

        _detectIconPath: function _detectIconPath() {
            var el = create$1('div', 'leaflet-default-icon-path', document.body);
            var path = getStyle(el, 'background-image') || getStyle(el, 'backgroundImage'); // IE8

            document.body.removeChild(el);

            if (path === null || path.indexOf('url') !== 0) {
                path = '';
            } else {
                path = path.replace(/^url\(["']?/, '').replace(/marker-icon\.png["']?\)$/, '');
            }

            return path;
        }
    });

    /*
     * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
     */

    /* @namespace Marker
     * @section Interaction handlers
     *
     * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
     *
     * ```js
     * marker.dragging.disable();
     * ```
     *
     * @property dragging: Handler
     * Marker dragging handler (by both mouse and touch). Only valid when the marker is on the map (Otherwise set [`marker.options.draggable`](#marker-draggable)).
     */

    var MarkerDrag = Handler.extend({
        initialize: function initialize(marker) {
            this._marker = marker;
        },

        addHooks: function addHooks() {
            var icon = this._marker._icon;

            if (!this._draggable) {
                this._draggable = new Draggable(icon, icon, true);
            }

            this._draggable.on({
                dragstart: this._onDragStart,
                predrag: this._onPreDrag,
                drag: this._onDrag,
                dragend: this._onDragEnd
            }, this).enable();

            addClass(icon, 'leaflet-marker-draggable');
        },

        removeHooks: function removeHooks() {
            this._draggable.off({
                dragstart: this._onDragStart,
                predrag: this._onPreDrag,
                drag: this._onDrag,
                dragend: this._onDragEnd
            }, this).disable();

            if (this._marker._icon) {
                removeClass(this._marker._icon, 'leaflet-marker-draggable');
            }
        },

        moved: function moved() {
            return this._draggable && this._draggable._moved;
        },

        _adjustPan: function _adjustPan(e) {
            var marker = this._marker,
                map = marker._map,
                speed = this._marker.options.autoPanSpeed,
                padding = this._marker.options.autoPanPadding,
                iconPos = getPosition(marker._icon),
                bounds = map.getPixelBounds(),
                origin = map.getPixelOrigin();

            var panBounds = toBounds(bounds.min._subtract(origin).add(padding), bounds.max._subtract(origin).subtract(padding));

            if (!panBounds.contains(iconPos)) {
                // Compute incremental movement
                var movement = toPoint((Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) - (Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x), (Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) - (Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)).multiplyBy(speed);

                map.panBy(movement, { animate: false });

                this._draggable._newPos._add(movement);
                this._draggable._startPos._add(movement);

                setPosition(marker._icon, this._draggable._newPos);
                this._onDrag(e);

                this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
            }
        },

        _onDragStart: function _onDragStart() {
            // @section Dragging events
            // @event dragstart: Event
            // Fired when the user starts dragging the marker.

            // @event movestart: Event
            // Fired when the marker starts moving (because of dragging).

            this._oldLatLng = this._marker.getLatLng();
            this._marker.closePopup().fire('movestart').fire('dragstart');
        },

        _onPreDrag: function _onPreDrag(e) {
            if (this._marker.options.autoPan) {
                cancelAnimFrame(this._panRequest);
                this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
            }
        },

        _onDrag: function _onDrag(e) {
            var marker = this._marker,
                shadow = marker._shadow,
                iconPos = getPosition(marker._icon),
                latlng = marker._map.layerPointToLatLng(iconPos);

            // update shadow position
            if (shadow) {
                setPosition(shadow, iconPos);
            }

            marker._latlng = latlng;
            e.latlng = latlng;
            e.oldLatLng = this._oldLatLng;

            // @event drag: Event
            // Fired repeatedly while the user drags the marker.
            marker.fire('move', e).fire('drag', e);
        },

        _onDragEnd: function _onDragEnd(e) {
            // @event dragend: DragEndEvent
            // Fired when the user stops dragging the marker.

            cancelAnimFrame(this._panRequest);

            // @event moveend: Event
            // Fired when the marker stops moving (because of dragging).
            delete this._oldLatLng;
            this._marker.fire('moveend').fire('dragend', e);
        }
    });

    /*
     * @class Marker
     * @inherits Interactive layer
     * @aka L.Marker
     * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
     *
     * @example
     *
     * ```js
     * L.marker([50.5, 30.5]).addTo(map);
     * ```
     */

    var Marker = Layer.extend({

        // @section
        // @aka Marker options
        options: {
            // @option icon: Icon = *
            // Icon instance to use for rendering the marker.
            // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
            // If not specified, a common instance of `L.Icon.Default` is used.
            icon: new IconDefault(),

            // Option inherited from "Interactive layer" abstract class
            interactive: true,

            // @option keyboard: Boolean = true
            // Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
            keyboard: true,

            // @option title: String = ''
            // Text for the browser tooltip that appear on marker hover (no tooltip by default).
            title: '',

            // @option alt: String = ''
            // Text for the `alt` attribute of the icon image (useful for accessibility).
            alt: '',

            // @option zIndexOffset: Number = 0
            // By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
            zIndexOffset: 0,

            // @option opacity: Number = 1.0
            // The opacity of the marker.
            opacity: 1,

            // @option riseOnHover: Boolean = false
            // If `true`, the marker will get on top of others when you hover the mouse over it.
            riseOnHover: false,

            // @option riseOffset: Number = 250
            // The z-index offset used for the `riseOnHover` feature.
            riseOffset: 250,

            // @option pane: String = 'markerPane'
            // `Map pane` where the markers icon will be added.
            pane: 'markerPane',

            // @option bubblingMouseEvents: Boolean = false
            // When `true`, a mouse event on this marker will trigger the same event on the map
            // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
            bubblingMouseEvents: false,

            // @section Draggable marker options
            // @option draggable: Boolean = false
            // Whether the marker is draggable with mouse/touch or not.
            draggable: false,

            // @option autoPan: Boolean = false
            // Whether to pan the map when dragging this marker near its edge or not.
            autoPan: false,

            // @option autoPanPadding: Point = Point(50, 50)
            // Distance (in pixels to the left/right and to the top/bottom) of the
            // map edge to start panning the map.
            autoPanPadding: [50, 50],

            // @option autoPanSpeed: Number = 10
            // Number of pixels the map should pan by.
            autoPanSpeed: 10
        },

        /* @section
         *
         * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
         */

        initialize: function initialize(latlng, options) {
            setOptions(this, options);
            this._latlng = toLatLng(latlng);
        },

        onAdd: function onAdd(map) {
            this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

            if (this._zoomAnimated) {
                map.on('zoomanim', this._animateZoom, this);
            }

            this._initIcon();
            this.update();
        },

        onRemove: function onRemove(map) {
            if (this.dragging && this.dragging.enabled()) {
                this.options.draggable = true;
                this.dragging.removeHooks();
            }
            delete this.dragging;

            if (this._zoomAnimated) {
                map.off('zoomanim', this._animateZoom, this);
            }

            this._removeIcon();
            this._removeShadow();
        },

        getEvents: function getEvents() {
            return {
                zoom: this.update,
                viewreset: this.update
            };
        },

        // @method getLatLng: LatLng
        // Returns the current geographical position of the marker.
        getLatLng: function getLatLng() {
            return this._latlng;
        },

        // @method setLatLng(latlng: LatLng): this
        // Changes the marker position to the given point.
        setLatLng: function setLatLng(latlng) {
            var oldLatLng = this._latlng;
            this._latlng = toLatLng(latlng);
            this.update();

            // @event move: Event
            // Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
            return this.fire('move', { oldLatLng: oldLatLng, latlng: this._latlng });
        },

        // @method setZIndexOffset(offset: Number): this
        // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
        setZIndexOffset: function setZIndexOffset(offset) {
            this.options.zIndexOffset = offset;
            return this.update();
        },

        // @method setIcon(icon: Icon): this
        // Changes the marker icon.
        setIcon: function setIcon(icon) {

            this.options.icon = icon;

            if (this._map) {
                this._initIcon();
                this.update();
            }

            if (this._popup) {
                this.bindPopup(this._popup, this._popup.options);
            }

            return this;
        },

        getElement: function getElement() {
            return this._icon;
        },

        update: function update() {

            if (this._icon && this._map) {
                var pos = this._map.latLngToLayerPoint(this._latlng).round();
                this._setPos(pos);
            }

            return this;
        },

        _initIcon: function _initIcon() {
            var options = this.options,
                classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

            var icon = options.icon.createIcon(this._icon),
                addIcon = false;

            // if we're not reusing the icon, remove the old one and init new one
            if (icon !== this._icon) {
                if (this._icon) {
                    this._removeIcon();
                }
                addIcon = true;

                if (options.title) {
                    icon.title = options.title;
                }

                if (icon.tagName === 'IMG') {
                    icon.alt = options.alt || '';
                }
            }

            addClass(icon, classToAdd);

            if (options.keyboard) {
                icon.tabIndex = '0';
            }

            this._icon = icon;

            if (options.riseOnHover) {
                this.on({
                    mouseover: this._bringToFront,
                    mouseout: this._resetZIndex
                });
            }

            var newShadow = options.icon.createShadow(this._shadow),
                addShadow = false;

            if (newShadow !== this._shadow) {
                this._removeShadow();
                addShadow = true;
            }

            if (newShadow) {
                addClass(newShadow, classToAdd);
                newShadow.alt = '';
            }
            this._shadow = newShadow;

            if (options.opacity < 1) {
                this._updateOpacity();
            }

            if (addIcon) {
                this.getPane().appendChild(this._icon);
            }
            this._initInteraction();
            if (newShadow && addShadow) {
                this.getPane('shadowPane').appendChild(this._shadow);
            }
        },

        _removeIcon: function _removeIcon() {
            if (this.options.riseOnHover) {
                this.off({
                    mouseover: this._bringToFront,
                    mouseout: this._resetZIndex
                });
            }

            remove(this._icon);
            this.removeInteractiveTarget(this._icon);

            this._icon = null;
        },

        _removeShadow: function _removeShadow() {
            if (this._shadow) {
                remove(this._shadow);
            }
            this._shadow = null;
        },

        _setPos: function _setPos(pos) {
            setPosition(this._icon, pos);

            if (this._shadow) {
                setPosition(this._shadow, pos);
            }

            this._zIndex = pos.y + this.options.zIndexOffset;

            this._resetZIndex();
        },

        _updateZIndex: function _updateZIndex(offset) {
            this._icon.style.zIndex = this._zIndex + offset;
        },

        _animateZoom: function _animateZoom(opt) {
            var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

            this._setPos(pos);
        },

        _initInteraction: function _initInteraction() {

            if (!this.options.interactive) {
                return;
            }

            addClass(this._icon, 'leaflet-interactive');

            this.addInteractiveTarget(this._icon);

            if (MarkerDrag) {
                var draggable = this.options.draggable;
                if (this.dragging) {
                    draggable = this.dragging.enabled();
                    this.dragging.disable();
                }

                this.dragging = new MarkerDrag(this);

                if (draggable) {
                    this.dragging.enable();
                }
            }
        },

        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function setOpacity(opacity) {
            this.options.opacity = opacity;
            if (this._map) {
                this._updateOpacity();
            }

            return this;
        },

        _updateOpacity: function _updateOpacity() {
            var opacity = this.options.opacity;

            setOpacity(this._icon, opacity);

            if (this._shadow) {
                setOpacity(this._shadow, opacity);
            }
        },

        _bringToFront: function _bringToFront() {
            this._updateZIndex(this.options.riseOffset);
        },

        _resetZIndex: function _resetZIndex() {
            this._updateZIndex(0);
        },

        _getPopupAnchor: function _getPopupAnchor() {
            return this.options.icon.options.popupAnchor;
        },

        _getTooltipAnchor: function _getTooltipAnchor() {
            return this.options.icon.options.tooltipAnchor;
        }
    });

    // factory L.marker(latlng: LatLng, options? : Marker options)

    // @factory L.marker(latlng: LatLng, options? : Marker options)
    // Instantiates a Marker object given a geographical point and optionally an options object.
    function marker(latlng, options) {
        return new Marker(latlng, options);
    }

    /*
     * @class Path
     * @aka L.Path
     * @inherits Interactive layer
     *
     * An abstract class that contains options and constants shared between vector
     * overlays (Polygon, Polyline, Circle). Do not use it directly. Extends `Layer`.
     */

    var Path = Layer.extend({

        // @section
        // @aka Path options
        options: {
            // @option stroke: Boolean = true
            // Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
            stroke: true,

            // @option color: String = '#3388ff'
            // Stroke color
            color: '#3388ff',

            // @option weight: Number = 3
            // Stroke width in pixels
            weight: 3,

            // @option opacity: Number = 1.0
            // Stroke opacity
            opacity: 1,

            // @option lineCap: String= 'round'
            // A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
            lineCap: 'round',

            // @option lineJoin: String = 'round'
            // A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
            lineJoin: 'round',

            // @option dashArray: String = null
            // A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
            dashArray: null,

            // @option dashOffset: String = null
            // A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
            dashOffset: null,

            // @option fill: Boolean = depends
            // Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
            fill: false,

            // @option fillColor: String = *
            // Fill color. Defaults to the value of the [`color`](#path-color) option
            fillColor: null,

            // @option fillOpacity: Number = 0.2
            // Fill opacity.
            fillOpacity: 0.2,

            // @option fillRule: String = 'evenodd'
            // A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
            fillRule: 'evenodd',

            // className: '',

            // Option inherited from "Interactive layer" abstract class
            interactive: true,

            // @option bubblingMouseEvents: Boolean = true
            // When `true`, a mouse event on this path will trigger the same event on the map
            // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
            bubblingMouseEvents: true
        },

        beforeAdd: function beforeAdd(map) {
            // Renderer is set here because we need to call renderer.getEvents
            // before this.getEvents.
            this._renderer = map.getRenderer(this);
        },

        onAdd: function onAdd() {
            this._renderer._initPath(this);
            this._reset();
            this._renderer._addPath(this);
        },

        onRemove: function onRemove() {
            this._renderer._removePath(this);
        },

        // @method redraw(): this
        // Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
        redraw: function redraw() {
            if (this._map) {
                this._renderer._updatePath(this);
            }
            return this;
        },

        // @method setStyle(style: Path options): this
        // Changes the appearance of a Path based on the options in the `Path options` object.
        setStyle: function setStyle(style) {
            setOptions(this, style);
            if (this._renderer) {
                this._renderer._updateStyle(this);
            }
            return this;
        },

        // @method bringToFront(): this
        // Brings the layer to the top of all path layers.
        bringToFront: function bringToFront() {
            if (this._renderer) {
                this._renderer._bringToFront(this);
            }
            return this;
        },

        // @method bringToBack(): this
        // Brings the layer to the bottom of all path layers.
        bringToBack: function bringToBack() {
            if (this._renderer) {
                this._renderer._bringToBack(this);
            }
            return this;
        },

        getElement: function getElement() {
            return this._path;
        },

        _reset: function _reset() {
            // defined in child classes
            this._project();
            this._update();
        },

        _clickTolerance: function _clickTolerance() {
            // used when doing hit detection for Canvas layers
            return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
        }
    });

    /*
     * @class CircleMarker
     * @aka L.CircleMarker
     * @inherits Path
     *
     * A circle of a fixed size with radius specified in pixels. Extends `Path`.
     */

    var CircleMarker = Path.extend({

        // @section
        // @aka CircleMarker options
        options: {
            fill: true,

            // @option radius: Number = 10
            // Radius of the circle marker, in pixels
            radius: 10
        },

        initialize: function initialize(latlng, options) {
            setOptions(this, options);
            this._latlng = toLatLng(latlng);
            this._radius = this.options.radius;
        },

        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function setLatLng(latlng) {
            this._latlng = toLatLng(latlng);
            this.redraw();
            return this.fire('move', { latlng: this._latlng });
        },

        // @method getLatLng(): LatLng
        // Returns the current geographical position of the circle marker
        getLatLng: function getLatLng() {
            return this._latlng;
        },

        // @method setRadius(radius: Number): this
        // Sets the radius of a circle marker. Units are in pixels.
        setRadius: function setRadius(radius) {
            this.options.radius = this._radius = radius;
            return this.redraw();
        },

        // @method getRadius(): Number
        // Returns the current radius of the circle
        getRadius: function getRadius() {
            return this._radius;
        },

        setStyle: function setStyle(options) {
            var radius = options && options.radius || this._radius;
            Path.prototype.setStyle.call(this, options);
            this.setRadius(radius);
            return this;
        },

        _project: function _project() {
            this._point = this._map.latLngToLayerPoint(this._latlng);
            this._updateBounds();
        },

        _updateBounds: function _updateBounds() {
            var r = this._radius,
                r2 = this._radiusY || r,
                w = this._clickTolerance(),
                p = [r + w, r2 + w];
            this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
        },

        _update: function _update() {
            if (this._map) {
                this._updatePath();
            }
        },

        _updatePath: function _updatePath() {
            this._renderer._updateCircle(this);
        },

        _empty: function _empty() {
            return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
        },

        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function _containsPoint(p) {
            return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
        }
    });

    // @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
    // Instantiates a circle marker object given a geographical point, and an optional options object.
    function circleMarker(latlng, options) {
        return new CircleMarker(latlng, options);
    }

    /*
     * @class Circle
     * @aka L.Circle
     * @inherits CircleMarker
     *
     * A class for drawing circle overlays on a map. Extends `CircleMarker`.
     *
     * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
     *
     * @example
     *
     * ```js
     * L.circle([50.5, 30.5], {radius: 200}).addTo(map);
     * ```
     */

    var Circle = CircleMarker.extend({

        initialize: function initialize(latlng, options, legacyOptions) {
            if (typeof options === 'number') {
                // Backwards compatibility with 0.7.x factory (latlng, radius, options?)
                options = extend({}, legacyOptions, { radius: options });
            }
            setOptions(this, options);
            this._latlng = toLatLng(latlng);

            if (isNaN(this.options.radius)) {
                throw new Error('Circle radius cannot be NaN');
            }

            // @section
            // @aka Circle options
            // @option radius: Number; Radius of the circle, in meters.
            this._mRadius = this.options.radius;
        },

        // @method setRadius(radius: Number): this
        // Sets the radius of a circle. Units are in meters.
        setRadius: function setRadius(radius) {
            this._mRadius = radius;
            return this.redraw();
        },

        // @method getRadius(): Number
        // Returns the current radius of a circle. Units are in meters.
        getRadius: function getRadius() {
            return this._mRadius;
        },

        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: function getBounds() {
            var half = [this._radius, this._radiusY || this._radius];

            return new LatLngBounds(this._map.layerPointToLatLng(this._point.subtract(half)), this._map.layerPointToLatLng(this._point.add(half)));
        },

        setStyle: Path.prototype.setStyle,

        _project: function _project() {

            var lng = this._latlng.lng,
                lat = this._latlng.lat,
                map = this._map,
                crs = map.options.crs;

            if (crs.distance === Earth.distance) {
                var d = Math.PI / 180,
                    latR = this._mRadius / Earth.R / d,
                    top = map.project([lat + latR, lng]),
                    bottom = map.project([lat - latR, lng]),
                    p = top.add(bottom).divideBy(2),
                    lat2 = map.unproject(p).lat,
                    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) / (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

                if (isNaN(lngR) || lngR === 0) {
                    lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
                }

                this._point = p.subtract(map.getPixelOrigin());
                this._radius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
                this._radiusY = p.y - top.y;
            } else {
                var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

                this._point = map.latLngToLayerPoint(this._latlng);
                this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
            }

            this._updateBounds();
        }
    });

    // @factory L.circle(latlng: LatLng, options?: Circle options)
    // Instantiates a circle object given a geographical point, and an options object
    // which contains the circle radius.
    // @alternative
    // @factory L.circle(latlng: LatLng, radius: Number, options?: Circle options)
    // Obsolete way of instantiating a circle, for compatibility with 0.7.x code.
    // Do not use in new applications or plugins.
    function circle(latlng, options, legacyOptions) {
        return new Circle(latlng, options, legacyOptions);
    }

    /*
     * @class Polyline
     * @aka L.Polyline
     * @inherits Path
     *
     * A class for drawing polyline overlays on a map. Extends `Path`.
     *
     * @example
     *
     * ```js
     * // create a red polyline from an array of LatLng points
     * var latlngs = [
     * 	[45.51, -122.68],
     * 	[37.77, -122.43],
     * 	[34.04, -118.2]
     * ];
     *
     * var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
     *
     * // zoom the map to the polyline
     * map.fitBounds(polyline.getBounds());
     * ```
     *
     * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
     *
     * ```js
     * // create a red polyline from an array of arrays of LatLng points
     * var latlngs = [
     * 	[[45.51, -122.68],
     * 	 [37.77, -122.43],
     * 	 [34.04, -118.2]],
     * 	[[40.78, -73.91],
     * 	 [41.83, -87.62],
     * 	 [32.76, -96.72]]
     * ];
     * ```
     */

    var Polyline = Path.extend({

        // @section
        // @aka Polyline options
        options: {
            // @option smoothFactor: Number = 1.0
            // How much to simplify the polyline on each zoom level. More means
            // better performance and smoother look, and less means more accurate representation.
            smoothFactor: 1.0,

            // @option noClip: Boolean = false
            // Disable polyline clipping.
            noClip: false
        },

        initialize: function initialize(latlngs, options) {
            setOptions(this, options);
            this._setLatLngs(latlngs);
        },

        // @method getLatLngs(): LatLng[]
        // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
        getLatLngs: function getLatLngs() {
            return this._latlngs;
        },

        // @method setLatLngs(latlngs: LatLng[]): this
        // Replaces all the points in the polyline with the given array of geographical points.
        setLatLngs: function setLatLngs(latlngs) {
            this._setLatLngs(latlngs);
            return this.redraw();
        },

        // @method isEmpty(): Boolean
        // Returns `true` if the Polyline has no LatLngs.
        isEmpty: function isEmpty() {
            return !this._latlngs.length;
        },

        // @method closestLayerPoint(p: Point): Point
        // Returns the point closest to `p` on the Polyline.
        closestLayerPoint: function closestLayerPoint(p) {
            var minDistance = Infinity,
                minPoint = null,
                closest = _sqClosestPointOnSegment,
                p1,
                p2;

            for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
                var points = this._parts[j];

                for (var i = 1, len = points.length; i < len; i++) {
                    p1 = points[i - 1];
                    p2 = points[i];

                    var sqDist = closest(p, p1, p2, true);

                    if (sqDist < minDistance) {
                        minDistance = sqDist;
                        minPoint = closest(p, p1, p2);
                    }
                }
            }
            if (minPoint) {
                minPoint.distance = Math.sqrt(minDistance);
            }
            return minPoint;
        },

        // @method getCenter(): LatLng
        // Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function getCenter() {
            // throws error when not yet added to map as this center calculation requires projected coordinates
            if (!this._map) {
                throw new Error('Must add layer to map before using getCenter()');
            }

            var i,
                halfDist,
                segDist,
                dist,
                p1,
                p2,
                ratio,
                points = this._rings[0],
                len = points.length;

            if (!len) {
                return null;
            }

            // polyline centroid algorithm; only uses the first ring if there are multiple

            for (i = 0, halfDist = 0; i < len - 1; i++) {
                halfDist += points[i].distanceTo(points[i + 1]) / 2;
            }

            // The line is so small in the current view that all points are on the same pixel.
            if (halfDist === 0) {
                return this._map.layerPointToLatLng(points[0]);
            }

            for (i = 0, dist = 0; i < len - 1; i++) {
                p1 = points[i];
                p2 = points[i + 1];
                segDist = p1.distanceTo(p2);
                dist += segDist;

                if (dist > halfDist) {
                    ratio = (dist - halfDist) / segDist;
                    return this._map.layerPointToLatLng([p2.x - ratio * (p2.x - p1.x), p2.y - ratio * (p2.y - p1.y)]);
                }
            }
        },

        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: function getBounds() {
            return this._bounds;
        },

        // @method addLatLng(latlng: LatLng, latlngs? LatLng[]): this
        // Adds a given point to the polyline. By default, adds to the first ring of
        // the polyline in case of a multi-polyline, but can be overridden by passing
        // a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
        addLatLng: function addLatLng(latlng, latlngs) {
            latlngs = latlngs || this._defaultShape();
            latlng = toLatLng(latlng);
            latlngs.push(latlng);
            this._bounds.extend(latlng);
            return this.redraw();
        },

        _setLatLngs: function _setLatLngs(latlngs) {
            this._bounds = new LatLngBounds();
            this._latlngs = this._convertLatLngs(latlngs);
        },

        _defaultShape: function _defaultShape() {
            return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
        },

        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function _convertLatLngs(latlngs) {
            var result = [],
                flat = isFlat(latlngs);

            for (var i = 0, len = latlngs.length; i < len; i++) {
                if (flat) {
                    result[i] = toLatLng(latlngs[i]);
                    this._bounds.extend(result[i]);
                } else {
                    result[i] = this._convertLatLngs(latlngs[i]);
                }
            }

            return result;
        },

        _project: function _project() {
            var pxBounds = new Bounds();
            this._rings = [];
            this._projectLatlngs(this._latlngs, this._rings, pxBounds);

            var w = this._clickTolerance(),
                p = new Point(w, w);

            if (this._bounds.isValid() && pxBounds.isValid()) {
                pxBounds.min._subtract(p);
                pxBounds.max._add(p);
                this._pxBounds = pxBounds;
            }
        },

        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function _projectLatlngs(latlngs, result, projectedBounds) {
            var flat = latlngs[0] instanceof LatLng,
                len = latlngs.length,
                i,
                ring;

            if (flat) {
                ring = [];
                for (i = 0; i < len; i++) {
                    ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
                    projectedBounds.extend(ring[i]);
                }
                result.push(ring);
            } else {
                for (i = 0; i < len; i++) {
                    this._projectLatlngs(latlngs[i], result, projectedBounds);
                }
            }
        },

        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: function _clipPoints() {
            var bounds = this._renderer._bounds;

            this._parts = [];
            if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
                return;
            }

            if (this.options.noClip) {
                this._parts = this._rings;
                return;
            }

            var parts = this._parts,
                i,
                j,
                k,
                len,
                len2,
                segment,
                points;

            for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
                points = this._rings[i];

                for (j = 0, len2 = points.length; j < len2 - 1; j++) {
                    segment = clipSegment(points[j], points[j + 1], bounds, j, true);

                    if (!segment) {
                        continue;
                    }

                    parts[k] = parts[k] || [];
                    parts[k].push(segment[0]);

                    // if segment goes out of screen, or it's the last one, it's the end of the line part
                    if (segment[1] !== points[j + 1] || j === len2 - 2) {
                        parts[k].push(segment[1]);
                        k++;
                    }
                }
            }
        },

        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function _simplifyPoints() {
            var parts = this._parts,
                tolerance = this.options.smoothFactor;

            for (var i = 0, len = parts.length; i < len; i++) {
                parts[i] = simplify(parts[i], tolerance);
            }
        },

        _update: function _update() {
            if (!this._map) {
                return;
            }

            this._clipPoints();
            this._simplifyPoints();
            this._updatePath();
        },

        _updatePath: function _updatePath() {
            this._renderer._updatePoly(this);
        },

        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function _containsPoint(p, closed) {
            var i,
                j,
                k,
                len,
                len2,
                part,
                w = this._clickTolerance();

            if (!this._pxBounds || !this._pxBounds.contains(p)) {
                return false;
            }

            // hit detection for polylines
            for (i = 0, len = this._parts.length; i < len; i++) {
                part = this._parts[i];

                for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
                    if (!closed && j === 0) {
                        continue;
                    }

                    if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
                        return true;
                    }
                }
            }
            return false;
        }
    });

    // @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
    // Instantiates a polyline object given an array of geographical points and
    // optionally an options object. You can create a `Polyline` object with
    // multiple separate lines (`MultiPolyline`) by passing an array of arrays
    // of geographic points.
    function polyline(latlngs, options) {
        return new Polyline(latlngs, options);
    }

    // Retrocompat. Allow plugins to support Leaflet versions before and after 1.1.
    Polyline._flat = _flat;

    /*
     * @class Polygon
     * @aka L.Polygon
     * @inherits Polyline
     *
     * A class for drawing polygon overlays on a map. Extends `Polyline`.
     *
     * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one — it's better to filter out such points.
     *
     *
     * @example
     *
     * ```js
     * // create a red polygon from an array of LatLng points
     * var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
     *
     * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
     *
     * // zoom the map to the polygon
     * map.fitBounds(polygon.getBounds());
     * ```
     *
     * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
     *
     * ```js
     * var latlngs = [
     *   [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
     *   [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
     * ];
     * ```
     *
     * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
     *
     * ```js
     * var latlngs = [
     *   [ // first polygon
     *     [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
     *     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
     *   ],
     *   [ // second polygon
     *     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
     *   ]
     * ];
     * ```
     */

    var Polygon = Polyline.extend({

        options: {
            fill: true
        },

        isEmpty: function isEmpty() {
            return !this._latlngs.length || !this._latlngs[0].length;
        },

        getCenter: function getCenter() {
            // throws error when not yet added to map as this center calculation requires projected coordinates
            if (!this._map) {
                throw new Error('Must add layer to map before using getCenter()');
            }

            var i,
                j,
                p1,
                p2,
                f,
                area,
                x,
                y,
                center,
                points = this._rings[0],
                len = points.length;

            if (!len) {
                return null;
            }

            // polygon centroid algorithm; only uses the first ring if there are multiple

            area = x = y = 0;

            for (i = 0, j = len - 1; i < len; j = i++) {
                p1 = points[i];
                p2 = points[j];

                f = p1.y * p2.x - p2.y * p1.x;
                x += (p1.x + p2.x) * f;
                y += (p1.y + p2.y) * f;
                area += f * 3;
            }

            if (area === 0) {
                // Polygon is so small that all points are on same pixel.
                center = points[0];
            } else {
                center = [x / area, y / area];
            }
            return this._map.layerPointToLatLng(center);
        },

        _convertLatLngs: function _convertLatLngs(latlngs) {
            var result = Polyline.prototype._convertLatLngs.call(this, latlngs),
                len = result.length;

            // remove last point if it equals first one
            if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
                result.pop();
            }
            return result;
        },

        _setLatLngs: function _setLatLngs(latlngs) {
            Polyline.prototype._setLatLngs.call(this, latlngs);
            if (isFlat(this._latlngs)) {
                this._latlngs = [this._latlngs];
            }
        },

        _defaultShape: function _defaultShape() {
            return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },

        _clipPoints: function _clipPoints() {
            // polygons need a different clipping algorithm so we redefine that

            var bounds = this._renderer._bounds,
                w = this.options.weight,
                p = new Point(w, w);

            // increase clip padding by stroke width to avoid stroke on clip edges
            bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

            this._parts = [];
            if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
                return;
            }

            if (this.options.noClip) {
                this._parts = this._rings;
                return;
            }

            for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
                clipped = clipPolygon(this._rings[i], bounds, true);
                if (clipped.length) {
                    this._parts.push(clipped);
                }
            }
        },

        _updatePath: function _updatePath() {
            this._renderer._updatePoly(this, true);
        },

        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function _containsPoint(p) {
            var inside = false,
                part,
                p1,
                p2,
                i,
                j,
                k,
                len,
                len2;

            if (!this._pxBounds || !this._pxBounds.contains(p)) {
                return false;
            }

            // ray casting algorithm for detecting if point is in polygon
            for (i = 0, len = this._parts.length; i < len; i++) {
                part = this._parts[i];

                for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
                    p1 = part[j];
                    p2 = part[k];

                    if (p1.y > p.y !== p2.y > p.y && p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x) {
                        inside = !inside;
                    }
                }
            }

            // also check if it's on polygon stroke
            return inside || Polyline.prototype._containsPoint.call(this, p, true);
        }

    });

    // @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
    function polygon(latlngs, options) {
        return new Polygon(latlngs, options);
    }

    /*
     * @class GeoJSON
     * @aka L.GeoJSON
     * @inherits FeatureGroup
     *
     * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
     * GeoJSON data and display it on the map. Extends `FeatureGroup`.
     *
     * @example
     *
     * ```js
     * L.geoJSON(data, {
     * 	style: function (feature) {
     * 		return {color: feature.properties.color};
     * 	}
     * }).bindPopup(function (layer) {
     * 	return layer.feature.properties.description;
     * }).addTo(map);
     * ```
     */

    var GeoJSON = FeatureGroup.extend({

        /* @section
         * @aka GeoJSON options
         *
         * @option pointToLayer: Function = *
         * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
         * called when data is added, passing the GeoJSON point feature and its `LatLng`.
         * The default is to spawn a default `Marker`:
         * ```js
         * function(geoJsonPoint, latlng) {
         * 	return L.marker(latlng);
         * }
         * ```
         *
         * @option style: Function = *
         * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
         * called internally when data is added.
         * The default value is to not override any defaults:
         * ```js
         * function (geoJsonFeature) {
         * 	return {}
         * }
         * ```
         *
         * @option onEachFeature: Function = *
         * A `Function` that will be called once for each created `Feature`, after it has
         * been created and styled. Useful for attaching events and popups to features.
         * The default is to do nothing with the newly created layers:
         * ```js
         * function (feature, layer) {}
         * ```
         *
         * @option filter: Function = *
         * A `Function` that will be used to decide whether to include a feature or not.
         * The default is to include all features:
         * ```js
         * function (geoJsonFeature) {
         * 	return true;
         * }
         * ```
         * Note: dynamically changing the `filter` option will have effect only on newly
         * added data. It will _not_ re-evaluate already included features.
         *
         * @option coordsToLatLng: Function = *
         * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
         * The default is the `coordsToLatLng` static method.
         */

        initialize: function initialize(geojson, options) {
            setOptions(this, options);

            this._layers = {};

            if (geojson) {
                this.addData(geojson);
            }
        },

        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function addData(geojson) {
            var features = isArray(geojson) ? geojson : geojson.features,
                i,
                len,
                feature;

            if (features) {
                for (i = 0, len = features.length; i < len; i++) {
                    // only add this if geometry or geometries are set and not null
                    feature = features[i];
                    if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
                        this.addData(feature);
                    }
                }
                return this;
            }

            var options = this.options;

            if (options.filter && !options.filter(geojson)) {
                return this;
            }

            var layer = geometryToLayer(geojson, options);
            if (!layer) {
                return this;
            }
            layer.feature = asFeature(geojson);

            layer.defaultOptions = layer.options;
            this.resetStyle(layer);

            if (options.onEachFeature) {
                options.onEachFeature(geojson, layer);
            }

            return this.addLayer(layer);
        },

        // @method resetStyle( <Path> layer ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        resetStyle: function resetStyle(layer) {
            // reset any custom styles
            layer.options = extend({}, layer.defaultOptions);
            this._setLayerStyle(layer, this.options.style);
            return this;
        },

        // @method setStyle( <Function> style ): this
        // Changes styles of GeoJSON vector layers with the given style function.
        setStyle: function setStyle(style) {
            return this.eachLayer(function (layer) {
                this._setLayerStyle(layer, style);
            }, this);
        },

        _setLayerStyle: function _setLayerStyle(layer, style) {
            if (typeof style === 'function') {
                style = style(layer.feature);
            }
            if (layer.setStyle) {
                layer.setStyle(style);
            }
        }
    });

    // @section
    // There are several static functions which can be called without instantiating L.GeoJSON:

    // @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
    // Creates a `Layer` from a given GeoJSON feature. Can use a custom
    // [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
    // functions if provided as options.
    function geometryToLayer(geojson, options) {

        var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
            coords = geometry ? geometry.coordinates : null,
            layers = [],
            pointToLayer = options && options.pointToLayer,
            _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng,
            latlng,
            latlngs,
            i,
            len;

        if (!coords && !geometry) {
            return null;
        }

        switch (geometry.type) {
            case 'Point':
                latlng = _coordsToLatLng(coords);
                return pointToLayer ? pointToLayer(geojson, latlng) : new Marker(latlng);

            case 'MultiPoint':
                for (i = 0, len = coords.length; i < len; i++) {
                    latlng = _coordsToLatLng(coords[i]);
                    layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new Marker(latlng));
                }
                return new FeatureGroup(layers);

            case 'LineString':
            case 'MultiLineString':
                latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
                return new Polyline(latlngs, options);

            case 'Polygon':
            case 'MultiPolygon':
                latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
                return new Polygon(latlngs, options);

            case 'GeometryCollection':
                for (i = 0, len = geometry.geometries.length; i < len; i++) {
                    var layer = geometryToLayer({
                        geometry: geometry.geometries[i],
                        type: 'Feature',
                        properties: geojson.properties
                    }, options);

                    if (layer) {
                        layers.push(layer);
                    }
                }
                return new FeatureGroup(layers);

            default:
                throw new Error('Invalid GeoJSON object.');
        }
    }

    // @function coordsToLatLng(coords: Array): LatLng
    // Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
    // or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
    function coordsToLatLng(coords) {
        return new LatLng(coords[1], coords[0], coords[2]);
    }

    // @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
    // Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
    // `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
    // Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
    function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
        var latlngs = [];

        for (var i = 0, len = coords.length, latlng; i < len; i++) {
            latlng = levelsDeep ? coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) : (_coordsToLatLng || coordsToLatLng)(coords[i]);

            latlngs.push(latlng);
        }

        return latlngs;
    }

    // @function latLngToCoords(latlng: LatLng, precision?: Number): Array
    // Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
    function latLngToCoords(latlng, precision) {
        precision = typeof precision === 'number' ? precision : 6;
        return latlng.alt !== undefined ? [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] : [formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
    }

    // @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
    // Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
    // `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
    function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
        var coords = [];

        for (var i = 0, len = latlngs.length; i < len; i++) {
            coords.push(levelsDeep ? latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) : latLngToCoords(latlngs[i], precision));
        }

        if (!levelsDeep && closed) {
            coords.push(coords[0]);
        }

        return coords;
    }

    function getFeature(layer, newGeometry) {
        return layer.feature ? extend({}, layer.feature, { geometry: newGeometry }) : asFeature(newGeometry);
    }

    // @function asFeature(geojson: Object): Object
    // Normalize GeoJSON geometries/features into GeoJSON features.
    function asFeature(geojson) {
        if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
            return geojson;
        }

        return {
            type: 'Feature',
            properties: {},
            geometry: geojson
        };
    }

    var PointToGeoJSON = {
        toGeoJSON: function toGeoJSON(precision) {
            return getFeature(this, {
                type: 'Point',
                coordinates: latLngToCoords(this.getLatLng(), precision)
            });
        }
    };

    // @namespace Marker
    // @method toGeoJSON(): Object
    // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
    Marker.include(PointToGeoJSON);

    // @namespace CircleMarker
    // @method toGeoJSON(): Object
    // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
    Circle.include(PointToGeoJSON);
    CircleMarker.include(PointToGeoJSON);

    // @namespace Polyline
    // @method toGeoJSON(): Object
    // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
    Polyline.include({
        toGeoJSON: function toGeoJSON(precision) {
            var multi = !isFlat(this._latlngs);

            var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

            return getFeature(this, {
                type: (multi ? 'Multi' : '') + 'LineString',
                coordinates: coords
            });
        }
    });

    // @namespace Polygon
    // @method toGeoJSON(): Object
    // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
    Polygon.include({
        toGeoJSON: function toGeoJSON(precision) {
            var holes = !isFlat(this._latlngs),
                multi = holes && !isFlat(this._latlngs[0]);

            var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

            if (!holes) {
                coords = [coords];
            }

            return getFeature(this, {
                type: (multi ? 'Multi' : '') + 'Polygon',
                coordinates: coords
            });
        }
    });

    // @namespace LayerGroup
    LayerGroup.include({
        toMultiPoint: function toMultiPoint(precision) {
            var coords = [];

            this.eachLayer(function (layer) {
                coords.push(layer.toGeoJSON(precision).geometry.coordinates);
            });

            return getFeature(this, {
                type: 'MultiPoint',
                coordinates: coords
            });
        },

        // @method toGeoJSON(): Object
        // Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
        toGeoJSON: function toGeoJSON(precision) {

            var type = this.feature && this.feature.geometry && this.feature.geometry.type;

            if (type === 'MultiPoint') {
                return this.toMultiPoint(precision);
            }

            var isGeometryCollection = type === 'GeometryCollection',
                jsons = [];

            this.eachLayer(function (layer) {
                if (layer.toGeoJSON) {
                    var json = layer.toGeoJSON(precision);
                    if (isGeometryCollection) {
                        jsons.push(json.geometry);
                    } else {
                        var feature = asFeature(json);
                        // Squash nested feature collections
                        if (feature.type === 'FeatureCollection') {
                            jsons.push.apply(jsons, feature.features);
                        } else {
                            jsons.push(feature);
                        }
                    }
                }
            });

            if (isGeometryCollection) {
                return getFeature(this, {
                    geometries: jsons,
                    type: 'GeometryCollection'
                });
            }

            return {
                type: 'FeatureCollection',
                features: jsons
            };
        }
    });

    // @namespace GeoJSON
    // @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
    // Creates a GeoJSON layer. Optionally accepts an object in
    // [GeoJSON format](https://tools.ietf.org/html/rfc7946) to display on the map
    // (you can alternatively add it later with `addData` method) and an `options` object.
    function geoJSON(geojson, options) {
        return new GeoJSON(geojson, options);
    }

    // Backward compatibility.
    var geoJson = geoJSON;

    Object.freeze = freeze;

    exports.version = version;
    exports.Browser = Browser;
    exports.Evented = Evented;
    exports.Mixin = Mixin;
    exports.Util = Util;
    exports.Class = Class;
    exports.Handler = Handler;
    exports.extend = extend;
    exports.bind = bind;
    exports.stamp = stamp;
    exports.setOptions = setOptions;
    exports.DomEvent = DomEvent;
    exports.DomUtil = DomUtil;
    exports.PosAnimation = PosAnimation;
    exports.Draggable = Draggable;
    exports.LineUtil = LineUtil;
    exports.PolyUtil = PolyUtil;
    exports.Point = Point;
    exports.point = toPoint;
    exports.Bounds = Bounds;
    exports.bounds = toBounds;
    exports.Transformation = Transformation;
    exports.transformation = toTransformation;
    exports.Projection = index;
    exports.LatLng = LatLng;
    exports.latLng = toLatLng;
    exports.LatLngBounds = LatLngBounds;
    exports.latLngBounds = toLatLngBounds;
    exports.CRS = CRS;
    exports.GeoJSON = GeoJSON;
    exports.geoJSON = geoJSON;
    exports.geoJson = geoJson;

    //var oldL = window.L;
    //exports.noConflict = function() {
    //	window.L = oldL;
    //	return this;
    //}

    //// Always export us to window global (see #2364)
    if (!window.L) window.L = exports;
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};

    if (entityattr == null) {
        //默认值
        entityattr = {
            scale: 1.0,
            horizontalOrigin: _Cesium2.default.HorizontalOrigin.CENTER,
            verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM
        };
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "font_style": //跳过扩展其他属性的参数
            case "font_weight":
            case "font_size":
            case "font_family":
            case "scaleByDistance_near":
            case "scaleByDistance_nearValue":
            case "scaleByDistance_far":
            case "scaleByDistance_farValue":
            case "distanceDisplayCondition_far":
            case "distanceDisplayCondition_near":
            case "background_opacity":
            case "pixelOffsetY":
                break;

            case "text":
                //文字内容
                entityattr.text = value.replace(new RegExp("<br />", "gm"), "\n");
                break;
            case "color":
                //颜色
                entityattr.fillColor = new _Cesium2.default.Color.fromCssColorString(value || "#ffffff").withAlpha(Number(style.opacity || 1.0));
                break;

            case "border":
                //是否衬色
                entityattr.style = value ? _Cesium2.default.LabelStyle.FILL_AND_OUTLINE : _Cesium2.default.LabelStyle.FILL;
                break;
            case "border_color":
                //衬色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || "#000000").withAlpha(Number(style.opacity || 1.0));
                break;
            case "border_width":
                entityattr.outlineWidth = value;
                break;
            case "background":
                //是否背景色
                entityattr.showBackground = value;
                break;
            case "background_color":
                //背景色
                entityattr.backgroundColor = new _Cesium2.default.Color.fromCssColorString(value || "#000000").withAlpha(Number(style.background_opacity || style.opacity || 0.5));
                break;
            case "pixelOffset":
                //偏移量
                entityattr.pixelOffset = new _Cesium2.default.Cartesian2(style.pixelOffset[0], style.pixelOffset[1]);
                break;
            case "hasPixelOffset":
                //是否存在偏移量
                if (!value) entityattr.pixelOffset = new _Cesium2.default.Cartesian2(0, 0);
                break;
            case "pixelOffsetX":
                //偏移量
                entityattr.pixelOffset = new _Cesium2.default.Cartesian2(value, style.pixelOffsetY);
                break;
            case "scaleByDistance":
                //是否按视距缩放
                if (value) {
                    entityattr.scaleByDistance = new _Cesium2.default.NearFarScalar(Number(style.scaleByDistance_near || 1000), Number(style.scaleByDistance_nearValue || 1.0), Number(style.scaleByDistance_far || 1000000), Number(style.scaleByDistance_farValue || 0.1));
                } else {
                    entityattr.scaleByDistance = null;
                }
                break;
            case "distanceDisplayCondition":
                //是否按视距显示
                if (value) {
                    entityattr.distanceDisplayCondition = new _Cesium2.default.DistanceDisplayCondition(Number(style.distanceDisplayCondition_near || 0), Number(style.distanceDisplayCondition_far || 100000));
                } else {
                    entityattr.distanceDisplayCondition = null;
                }
                break;

            case "heightReference":
                switch (value) {
                    case "NONE":
                        entityattr.heightReference = _Cesium2.default.HeightReference.NONE;
                        break;
                    case "CLAMP_TO_GROUND":
                        entityattr.heightReference = _Cesium2.default.HeightReference.CLAMP_TO_GROUND;
                        break;
                    case "RELATIVE_TO_GROUND":
                        entityattr.heightReference = _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;
                        break;
                    default:
                        entityattr.heightReference = value;
                        break;
                }
                break;

        }
    }

    //样式（倾斜、加粗等）
    var fontStyle = (style.font_style || "normal") + " small-caps " + (style.font_weight || "normal") + " " + (style.font_size || "25") + "px " + (style.font_family || "楷体");
    entityattr.font = fontStyle;

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return [entity.position.getValue()];
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: { type: "Point", coordinates: coordinates[0] }
    };
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPolyline = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _EditBase = __webpack_require__(21);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditPolyline = exports.EditPolyline = _EditBase.EditBase.extend({
    //坐标位置相关
    _positions_draw: [],
    getPosition: function getPosition() {
        return this._positions_draw;
    },
    //外部更新位置
    setPositions: function setPositions(positions) {
        this._positions_draw = positions;
        this.updateAttrForEditing();
    },
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        var that = this;

        this._positions_draw = this.entity._positions_draw || this.entity.polyline.positions.getValue();
        //this.entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
        //    return that.getPosition();
        //}, false);
    },
    //图形编辑结束后调用
    finish: function finish() {
        //this.entity.polyline.positions = this.getPosition();
        this.entity._positions_draw = this.getPosition();
    },
    isClampToGround: function isClampToGround() {
        return this.entity.attribute.style.clampToGround;
    },
    bindDraggers: function bindDraggers() {
        var that = this;

        var clampToGround = this.isClampToGround();

        var positions = this.getPosition();
        var hasMidPoint = positions.length < this._maxPointNum; //是否有新增点
        for (var i = 0, len = positions.length; i < len; i++) {
            var loc = positions[i];

            if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                loc = (0, _point.updateHeightForClampToGround)(loc);
                positions[i] = loc;
            }

            //各顶点
            var dragger = draggerCtl.createDragger(this.dataSource, {
                position: loc,
                //clampToGround: clampToGround,
                onDrag: function onDrag(dragger, position) {
                    positions[dragger.index] = position;

                    //============新增点拖拽点处理=============
                    if (hasMidPoint) {
                        if (dragger.index > 0) {
                            //与前一个点之间的中点 
                            var midpoint = _Cesium2.default.Cartesian3.midpoint(position, positions[dragger.index - 1], new _Cesium2.default.Cartesian3());
                            if (clampToGround) {
                                //贴地时求贴模型和贴地的高度 
                                midpoint = (0, _point.updateHeightForClampToGround)(midpoint);
                            }
                            that.draggers[dragger.index * 2 - 1].position = midpoint;
                        }
                        if (dragger.index < positions.length - 1) {
                            //与后一个点之间的中点 
                            var midpoint = _Cesium2.default.Cartesian3.midpoint(position, positions[dragger.index + 1], new _Cesium2.default.Cartesian3());
                            if (clampToGround) {
                                //贴地时求贴模型和贴地的高度 
                                midpoint = (0, _point.updateHeightForClampToGround)(midpoint);
                            }
                            that.draggers[dragger.index * 2 + 1].position = midpoint;
                        }
                    }
                }
            });
            dragger.index = i;
            this.draggers.push(dragger);

            //中间点，拖动后新增点
            if (hasMidPoint) {
                var nextIndex = i + 1;
                if (nextIndex < len) {
                    var midpoint = _Cesium2.default.Cartesian3.midpoint(loc, positions[nextIndex], new _Cesium2.default.Cartesian3());
                    if (clampToGround) {
                        //贴地时求贴模型和贴地的高度 
                        midpoint = (0, _point.updateHeightForClampToGround)(midpoint);
                    }
                    var dragger = draggerCtl.createDragger(this.dataSource, {
                        position: midpoint,
                        type: draggerCtl.PointType.AddMidPoint,
                        tooltip: _Tooltip.message.dragger.addMidPoint,
                        //clampToGround: clampToGround,
                        onDragStart: function onDragStart(dragger, position) {
                            positions.splice(dragger.index, 0, position); //插入点 
                        },
                        onDrag: function onDrag(dragger, position) {
                            positions[dragger.index] = position;
                        },
                        onDragEnd: function onDragEnd(dragger, position) {
                            that.updateDraggers();
                        }
                    });
                    dragger.index = nextIndex;
                    this.draggers.push(dragger);
                }
            }
        }
    }

});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};

    if (entityattr == null) {
        //默认值
        entityattr = {
            scale: 1,
            horizontalOrigin: _Cesium2.default.HorizontalOrigin.CENTER,
            verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM
        };
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "scaleByDistance_near": //跳过扩展其他属性的参数
            case "scaleByDistance_nearValue":
            case "scaleByDistance_far":
            case "scaleByDistance_farValue":
            case "distanceDisplayCondition_far":
            case "distanceDisplayCondition_near":
                break;
            case "opacity":
                //透明度
                entityattr.color = new _Cesium2.default.Color.fromCssColorString("#FFFFFF").withAlpha(Number(value || 1.0));
                break;
            case "rotation":
                //旋转角度
                entityattr.rotation = _Cesium2.default.Math.toRadians(value);
                break;
            case "scaleByDistance":
                //是否按视距缩放
                if (value) {
                    entityattr.scaleByDistance = new _Cesium2.default.NearFarScalar(Number(style.scaleByDistance_near || 1000), Number(style.scaleByDistance_nearValue || 1.0), Number(style.scaleByDistance_far || 1000000), Number(style.scaleByDistance_farValue || 0.1));
                } else {
                    entityattr.scaleByDistance = null;
                }
                break;
            case "distanceDisplayCondition":
                //是否按视距显示
                if (value) {
                    entityattr.distanceDisplayCondition = new _Cesium2.default.DistanceDisplayCondition(Number(style.distanceDisplayCondition_near || 0), Number(style.distanceDisplayCondition_far || 100000));
                } else {
                    entityattr.distanceDisplayCondition = null;
                }
                break;

            case "heightReference":
                switch (value) {
                    case "NONE":
                        entityattr.heightReference = _Cesium2.default.HeightReference.NONE;
                        break;
                    case "CLAMP_TO_GROUND":
                        entityattr.heightReference = _Cesium2.default.HeightReference.CLAMP_TO_GROUND;
                        break;
                    case "RELATIVE_TO_GROUND":
                        entityattr.heightReference = _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;
                        break;
                    default:
                        entityattr.heightReference = value;
                        break;
                }
                break;
        }
    }

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return [entity.position.getValue()];
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: { type: "Point", coordinates: coordinates[0] }
    };
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};
    if (entityattr == null) {
        //默认值 
        entityattr = {
            fill: true,
            classificationType: _Cesium2.default.ClassificationType.BOTH
        };
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
                break;
            case "color":
                //填充颜色
                entityattr.material = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || style.color || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "extrudedHeight":
                //高度 
                var maxHight = 0;
                if (entityattr.hierarchy) maxHight = (0, _point.getMaxHeight)(entityattr.hierarchy.getValue ? entityattr.hierarchy.getValue() : entityattr.hierarchy);
                entityattr.extrudedHeight = Number(value) + maxHight;
                break;
            case "clampToGround":
                //贴地
                entityattr.perPositionHeight = !value;
                break;
        }
    }

    //如果未设置任何material，默认设置随机颜色
    if (style.color == null) {
        entityattr.material = _Cesium2.default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: Number(style.opacity || 1.0)
        });
    }

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    var arr = entity.polygon.hierarchy.getValue();
    if (arr.positions && Util.isArray(arr.positions)) return arr.positions;
    return arr;
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);

    if (coordinates.length > 0) coordinates.push(coordinates[0]);

    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: {
            type: "Polygon",
            coordinates: [coordinates]
        }
    };
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
    ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports, __webpack_require__(12)) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(12)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory((global.L = global.L || {}, global.L.esri = {}), global.L);
})(undefined, function (exports, leaflet) {
    'use strict';

    var version = "2.1.4";

    var cors = window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest();
    var pointerEvents = document.documentElement.style.pointerEvents === '';

    var Support = {
        cors: cors,
        pointerEvents: pointerEvents
    };

    var options = {
        attributionWidthOffset: 55
    };

    var callbacks = 0;

    function serialize(params) {
        var data = '';

        params.f = params.f || 'json';

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var param = params[key];
                var type = Object.prototype.toString.call(param);
                var value;

                if (data.length) {
                    data += '&';
                }

                if (type === '[object Array]') {
                    value = Object.prototype.toString.call(param[0]) === '[object Object]' ? JSON.stringify(param) : param.join(',');
                } else if (type === '[object Object]') {
                    value = JSON.stringify(param);
                } else if (type === '[object Date]') {
                    value = param.valueOf();
                } else {
                    value = param;
                }

                data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
        }

        return data;
    }

    function createRequest(callback, context) {
        var httpRequest = new window.XMLHttpRequest();

        httpRequest.onerror = function (e) {
            httpRequest.onreadystatechange = leaflet.Util.falseFn;

            callback.call(context, {
                error: {
                    code: 500,
                    message: 'XMLHttpRequest error'
                }
            }, null);
        };

        httpRequest.onreadystatechange = function () {
            var response;
            var error;

            if (httpRequest.readyState === 4) {
                try {
                    response = JSON.parse(httpRequest.responseText);
                } catch (e) {
                    response = null;
                    error = {
                        code: 500,
                        message: 'Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.'
                    };
                }

                if (!error && response.error) {
                    error = response.error;
                    response = null;
                }

                httpRequest.onerror = leaflet.Util.falseFn;

                callback.call(context, error, response);
            }
        };

        httpRequest.ontimeout = function () {
            this.onerror();
        };

        return httpRequest;
    }

    function xmlHttpPost(url, params, callback, context) {
        var httpRequest = createRequest(callback, context);
        httpRequest.open('POST', url);

        if (typeof context !== 'undefined' && context !== null) {
            if (typeof context.options !== 'undefined') {
                httpRequest.timeout = context.options.timeout;
            }
        }
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        httpRequest.send(serialize(params));

        return httpRequest;
    }

    function xmlHttpGet(url, params, callback, context) {
        var httpRequest = createRequest(callback, context);
        httpRequest.open('GET', url + '?' + serialize(params), true);

        if (typeof context !== 'undefined' && context !== null) {
            if (typeof context.options !== 'undefined') {
                httpRequest.timeout = context.options.timeout;
            }
        }
        httpRequest.send(null);

        return httpRequest;
    }

    // AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
    function request(url, params, callback, context) {
        var paramString = serialize(params);
        var httpRequest = createRequest(callback, context);
        var requestLength = (url + '?' + paramString).length;

        // ie10/11 require the request be opened before a timeout is applied
        if (requestLength <= 2000 && Support.cors) {
            httpRequest.open('GET', url + '?' + paramString);
        } else if (requestLength > 2000 && Support.cors) {
            httpRequest.open('POST', url);
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }

        if (typeof context !== 'undefined' && context !== null) {
            if (typeof context.options !== 'undefined') {
                httpRequest.timeout = context.options.timeout;
            }
        }

        // request is less than 2000 characters and the browser supports CORS, make GET request with XMLHttpRequest
        if (requestLength <= 2000 && Support.cors) {
            httpRequest.send(null);

            // request is more than 2000 characters and the browser supports CORS, make POST request with XMLHttpRequest
        } else if (requestLength > 2000 && Support.cors) {
            httpRequest.send(paramString);

            // request is less  than 2000 characters and the browser does not support CORS, make a JSONP request
        } else if (requestLength <= 2000 && !Support.cors) {
            return jsonp(url, params, callback, context);

            // request is longer then 2000 characters and the browser does not support CORS, log a warning
        } else {
            warn('a request to ' + url + ' was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html');
            return;
        }

        return httpRequest;
    }

    function jsonp(url, params, callback, context) {
        window._EsriLeafletCallbacks = window._EsriLeafletCallbacks || {};
        var callbackId = 'c' + callbacks;
        params.callback = 'window._EsriLeafletCallbacks.' + callbackId;

        window._EsriLeafletCallbacks[callbackId] = function (response) {
            if (window._EsriLeafletCallbacks[callbackId] !== true) {
                var error;
                var responseType = Object.prototype.toString.call(response);

                if (!(responseType === '[object Object]' || responseType === '[object Array]')) {
                    error = {
                        error: {
                            code: 500,
                            message: 'Expected array or object as JSONP response'
                        }
                    };
                    response = null;
                }

                if (!error && response.error) {
                    error = response;
                    response = null;
                }

                callback.call(context, error, response);
                window._EsriLeafletCallbacks[callbackId] = true;
            }
        };

        var script = leaflet.DomUtil.create('script', null, document.body);
        script.type = 'text/javascript';
        script.src = url + '?' + serialize(params);
        script.id = callbackId;
        leaflet.DomUtil.addClass(script, 'esri-leaflet-jsonp');

        callbacks++;

        return {
            id: callbackId,
            url: script.src,
            abort: function abort() {
                window._EsriLeafletCallbacks._callback[callbackId]({
                    code: 0,
                    message: 'Request aborted.'
                });
            }
        };
    }

    var get = Support.cors ? xmlHttpGet : jsonp;
    get.CORS = xmlHttpGet;
    get.JSONP = jsonp;

    // export the Request object to call the different handlers for debugging
    var Request = {
        request: request,
        get: get,
        post: xmlHttpPost
    };

    /*
     * Copyright 2017 Esri
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    // checks if 2 x,y points are equal
    function pointsEqual(a, b) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    // checks if the first and last points of a ring are equal and closes the ring
    function closeRing(coordinates) {
        if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
            coordinates.push(coordinates[0]);
        }
        return coordinates;
    }

    // determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
    // or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
    // points-are-in-clockwise-order
    function ringIsClockwise(ringToTest) {
        var total = 0;
        var i = 0;
        var rLength = ringToTest.length;
        var pt1 = ringToTest[i];
        var pt2;
        for (i; i < rLength - 1; i++) {
            pt2 = ringToTest[i + 1];
            total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
            pt1 = pt2;
        }
        return total >= 0;
    }

    // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L504-L519
    function vertexIntersectsVertex(a1, a2, b1, b2) {
        var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
        var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
        var uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

        if (uB !== 0) {
            var ua = uaT / uB;
            var ub = ubT / uB;

            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                return true;
            }
        }

        return false;
    }

    // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L521-L531
    function arrayIntersectsArray(a, b) {
        for (var i = 0; i < a.length - 1; i++) {
            for (var j = 0; j < b.length - 1; j++) {
                if (vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
                    return true;
                }
            }
        }

        return false;
    }

    // ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L470-L480
    function coordinatesContainPoint(coordinates, point) {
        var contains = false;
        for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
            if ((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1] || coordinates[j][1] <= point[1] && point[1] < coordinates[i][1]) && point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0]) {
                contains = !contains;
            }
        }
        return contains;
    }

    // ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L106-L113
    function coordinatesContainCoordinates(outer, inner) {
        var intersects = arrayIntersectsArray(outer, inner);
        var contains = coordinatesContainPoint(outer, inner[0]);
        if (!intersects && contains) {
            return true;
        }
        return false;
    }

    // do any polygons in this array contain any other polygons in this array?
    // used for checking for holes in arcgis rings
    // ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L117-L172
    function convertRingsToGeoJSON(rings) {
        var outerRings = [];
        var holes = [];
        var x; // iterator
        var outerRing; // current outer ring being evaluated
        var hole; // current hole being evaluated

        // for each ring
        for (var r = 0; r < rings.length; r++) {
            var ring = closeRing(rings[r].slice(0));
            if (ring.length < 4) {
                continue;
            }
            // is this ring an outer ring? is it clockwise?
            if (ringIsClockwise(ring)) {
                var polygon = [ring.slice().reverse()]; // wind outer rings counterclockwise for RFC 7946 compliance
                outerRings.push(polygon); // push to outer rings
            } else {
                holes.push(ring.slice().reverse()); // wind inner rings clockwise for RFC 7946 compliance
            }
        }

        var uncontainedHoles = [];

        // while there are holes left...
        while (holes.length) {
            // pop a hole off out stack
            hole = holes.pop();

            // loop over all outer rings and see if they contain our hole.
            var contained = false;
            for (x = outerRings.length - 1; x >= 0; x--) {
                outerRing = outerRings[x][0];
                if (coordinatesContainCoordinates(outerRing, hole)) {
                    // the hole is contained push it into our polygon
                    outerRings[x].push(hole);
                    contained = true;
                    break;
                }
            }

            // ring is not contained in any outer ring
            // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320
            if (!contained) {
                uncontainedHoles.push(hole);
            }
        }

        // if we couldn't match any holes using contains we can try intersects...
        while (uncontainedHoles.length) {
            // pop a hole off out stack
            hole = uncontainedHoles.pop();

            // loop over all outer rings and see if any intersect our hole.
            var intersects = false;

            for (x = outerRings.length - 1; x >= 0; x--) {
                outerRing = outerRings[x][0];
                if (arrayIntersectsArray(outerRing, hole)) {
                    // the hole is contained push it into our polygon
                    outerRings[x].push(hole);
                    intersects = true;
                    break;
                }
            }

            if (!intersects) {
                outerRings.push([hole.reverse()]);
            }
        }

        if (outerRings.length === 1) {
            return {
                type: 'Polygon',
                coordinates: outerRings[0]
            };
        } else {
            return {
                type: 'MultiPolygon',
                coordinates: outerRings
            };
        }
    }

    // This function ensures that rings are oriented in the right directions
    // outer rings are clockwise, holes are counterclockwise
    // used for converting GeoJSON Polygons to ArcGIS Polygons
    function orientRings(poly) {
        var output = [];
        var polygon = poly.slice(0);
        var outerRing = closeRing(polygon.shift().slice(0));
        if (outerRing.length >= 4) {
            if (!ringIsClockwise(outerRing)) {
                outerRing.reverse();
            }

            output.push(outerRing);

            for (var i = 0; i < polygon.length; i++) {
                var hole = closeRing(polygon[i].slice(0));
                if (hole.length >= 4) {
                    if (ringIsClockwise(hole)) {
                        hole.reverse();
                    }
                    output.push(hole);
                }
            }
        }

        return output;
    }

    // This function flattens holes in multipolygons to one array of polygons
    // used for converting GeoJSON Polygons to ArcGIS Polygons
    function flattenMultiPolygonRings(rings) {
        var output = [];
        for (var i = 0; i < rings.length; i++) {
            var polygon = orientRings(rings[i]);
            for (var x = polygon.length - 1; x >= 0; x--) {
                var ring = polygon[x].slice(0);
                output.push(ring);
            }
        }
        return output;
    }

    // shallow object clone for feature properties and attributes
    // from http://jsperf.com/cloning-an-object/2
    function shallowClone(obj) {
        var target = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                target[i] = obj[i];
            }
        }
        return target;
    }

    function getId(attributes, idAttribute) {
        var keys = idAttribute ? [idAttribute, 'OBJECTID', 'FID'] : ['OBJECTID', 'FID'];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key in attributes && (typeof attributes[key] === 'string' || typeof attributes[key] === 'number')) {
                return attributes[key];
            }
        }
        throw Error('No valid id attribute found');
    }

    function arcgisToGeoJSON(arcgis, idAttribute) {
        var geojson = {};

        if (typeof arcgis.x === 'number' && typeof arcgis.y === 'number') {
            geojson.type = 'Point';
            geojson.coordinates = [arcgis.x, arcgis.y];
            if (typeof arcgis.z === 'number') {
                geojson.coordinates.push(arcgis.z);
            }
        }

        if (arcgis.points) {
            geojson.type = 'MultiPoint';
            geojson.coordinates = arcgis.points.slice(0);
        }

        if (arcgis.paths) {
            if (arcgis.paths.length === 1) {
                geojson.type = 'LineString';
                geojson.coordinates = arcgis.paths[0].slice(0);
            } else {
                geojson.type = 'MultiLineString';
                geojson.coordinates = arcgis.paths.slice(0);
            }
        }

        if (arcgis.rings) {
            geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
        }

        if (arcgis.geometry || arcgis.attributes) {
            geojson.type = 'Feature';
            geojson.geometry = arcgis.geometry ? arcgisToGeoJSON(arcgis.geometry) : null;
            geojson.properties = arcgis.attributes ? shallowClone(arcgis.attributes) : null;
            if (arcgis.attributes) {
                try {
                    geojson.id = getId(arcgis.attributes, idAttribute);
                } catch (err) {
                    // don't set an id
                }
            }
        }

        // if no valid geometry was encountered
        if (JSON.stringify(geojson.geometry) === JSON.stringify({})) {
            geojson.geometry = null;
        }

        if (arcgis.spatialReference && arcgis.spatialReference.wkid && arcgis.spatialReference.wkid !== 4326) {
            console.warn('Object converted in non-standard crs - ' + JSON.stringify(arcgis.spatialReference));
        }

        return geojson;
    }

    function geojsonToArcGIS(geojson, idAttribute) {
        idAttribute = idAttribute || 'OBJECTID';
        var spatialReference = { wkid: 4326 };
        var result = {};
        var i;

        switch (geojson.type) {
            case 'Point':
                result.x = geojson.coordinates[0];
                result.y = geojson.coordinates[1];
                result.spatialReference = spatialReference;
                break;
            case 'MultiPoint':
                result.points = geojson.coordinates.slice(0);
                result.spatialReference = spatialReference;
                break;
            case 'LineString':
                result.paths = [geojson.coordinates.slice(0)];
                result.spatialReference = spatialReference;
                break;
            case 'MultiLineString':
                result.paths = geojson.coordinates.slice(0);
                result.spatialReference = spatialReference;
                break;
            case 'Polygon':
                result.rings = orientRings(geojson.coordinates.slice(0));
                result.spatialReference = spatialReference;
                break;
            case 'MultiPolygon':
                result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
                result.spatialReference = spatialReference;
                break;
            case 'Feature':
                if (geojson.geometry) {
                    result.geometry = geojsonToArcGIS(geojson.geometry, idAttribute);
                }
                result.attributes = geojson.properties ? shallowClone(geojson.properties) : {};
                if (geojson.id) {
                    result.attributes[idAttribute] = geojson.id;
                }
                break;
            case 'FeatureCollection':
                result = [];
                for (i = 0; i < geojson.features.length; i++) {
                    result.push(geojsonToArcGIS(geojson.features[i], idAttribute));
                }
                break;
            case 'GeometryCollection':
                result = [];
                for (i = 0; i < geojson.geometries.length; i++) {
                    result.push(geojsonToArcGIS(geojson.geometries[i], idAttribute));
                }
                break;
        }

        return result;
    }

    function geojsonToArcGIS$1(geojson, idAttr) {
        return geojsonToArcGIS(geojson, idAttr);
    }

    function arcgisToGeoJSON$1(arcgis, idAttr) {
        return arcgisToGeoJSON(arcgis, idAttr);
    }

    // convert an extent (ArcGIS) to LatLngBounds (Leaflet)
    function extentToBounds(extent) {
        // "NaN" coordinates from ArcGIS Server indicate a null geometry
        if (extent.xmin !== 'NaN' && extent.ymin !== 'NaN' && extent.xmax !== 'NaN' && extent.ymax !== 'NaN') {
            var sw = leaflet.latLng(extent.ymin, extent.xmin);
            var ne = leaflet.latLng(extent.ymax, extent.xmax);
            return leaflet.latLngBounds(sw, ne);
        } else {
            return null;
        }
    }

    // convert an LatLngBounds (Leaflet) to extent (ArcGIS)
    function boundsToExtent(bounds) {
        bounds = leaflet.latLngBounds(bounds);
        return {
            'xmin': bounds.getSouthWest().lng,
            'ymin': bounds.getSouthWest().lat,
            'xmax': bounds.getNorthEast().lng,
            'ymax': bounds.getNorthEast().lat,
            'spatialReference': {
                'wkid': 4326
            }
        };
    }

    var knownFieldNames = /^(OBJECTID|FID|OID|ID)$/i;

    // Attempts to find the ID Field from response
    function _findIdAttributeFromResponse(response) {
        var result;

        if (response.objectIdFieldName) {
            // Find Id Field directly
            result = response.objectIdFieldName;
        } else if (response.fields) {
            // Find ID Field based on field type
            for (var j = 0; j <= response.fields.length - 1; j++) {
                if (response.fields[j].type === 'esriFieldTypeOID') {
                    result = response.fields[j].name;
                    break;
                }
            }
            if (!result) {
                // If no field was marked as being the esriFieldTypeOID try well known field names
                for (j = 0; j <= response.fields.length - 1; j++) {
                    if (response.fields[j].name.match(knownFieldNames)) {
                        result = response.fields[j].name;
                        break;
                    }
                }
            }
        }
        return result;
    }

    // This is the 'last' resort, find the Id field from the specified feature
    function _findIdAttributeFromFeature(feature) {
        for (var key in feature.attributes) {
            if (key.match(knownFieldNames)) {
                return key;
            }
        }
    }

    function responseToFeatureCollection(response, idAttribute) {
        var objectIdField;
        var features = response.features || response.results;
        var count = features.length;

        if (idAttribute) {
            objectIdField = idAttribute;
        } else {
            objectIdField = _findIdAttributeFromResponse(response);
        }

        var featureCollection = {
            type: 'FeatureCollection',
            features: []
        };

        if (count) {
            for (var i = features.length - 1; i >= 0; i--) {
                var feature = arcgisToGeoJSON$1(features[i], objectIdField || _findIdAttributeFromFeature(features[i]));
                featureCollection.features.push(feature);
            }
        }

        return featureCollection;
    }

    // trim url whitespace and add a trailing slash if needed
    function cleanUrl(url) {
        // trim leading and trailing spaces, but not spaces inside the url
        url = leaflet.Util.trim(url);

        // add a trailing slash to the url if the user omitted it
        if (url[url.length - 1] !== '/') {
            url += '/';
        }

        return url;
    }

    /* Extract url params if any and store them in requestParams attribute.
       Return the options params updated */
    function getUrlParams(options$$1) {
        if (options$$1.url.indexOf('?') !== -1) {
            options$$1.requestParams = options$$1.requestParams || {};
            var queryString = options$$1.url.substring(options$$1.url.indexOf('?') + 1);
            options$$1.url = options$$1.url.split('?')[0];
            options$$1.requestParams = JSON.parse('{"' + decodeURI(queryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        }
        options$$1.url = cleanUrl(options$$1.url.split('?')[0]);
        return options$$1;
    }

    function isArcgisOnline(url) {
        /* hosted feature services support geojson as an output format
        utility.arcgis.com services are proxied from a variety of ArcGIS Server vintages, and may not */
        return (/^(?!.*utility\.arcgis\.com).*\.arcgis\.com.*FeatureServer/i.test(url)
        );
    }

    function geojsonTypeToArcGIS(geoJsonType) {
        var arcgisGeometryType;
        switch (geoJsonType) {
            case 'Point':
                arcgisGeometryType = 'esriGeometryPoint';
                break;
            case 'MultiPoint':
                arcgisGeometryType = 'esriGeometryMultipoint';
                break;
            case 'LineString':
                arcgisGeometryType = 'esriGeometryPolyline';
                break;
            case 'MultiLineString':
                arcgisGeometryType = 'esriGeometryPolyline';
                break;
            case 'Polygon':
                arcgisGeometryType = 'esriGeometryPolygon';
                break;
            case 'MultiPolygon':
                arcgisGeometryType = 'esriGeometryPolygon';
                break;
        }

        return arcgisGeometryType;
    }

    function warn() {
        if (console && console.warn) {
            console.warn.apply(console, arguments);
        }
    }

    function calcAttributionWidth(map) {
        // either crop at 55px or user defined buffer
        return map.getSize().x - options.attributionWidthOffset + 'px';
    }

    function setEsriAttribution(map) {
        if (map.attributionControl && !map.attributionControl._esriAttributionAdded) {
            map.attributionControl.setPrefix('<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | Powered by <a href="https://www.esri.com">Esri</a>');

            var hoverAttributionStyle = document.createElement('style');
            hoverAttributionStyle.type = 'text/css';
            hoverAttributionStyle.innerHTML = '.esri-truncated-attribution:hover {' + 'white-space: normal;' + '}';

            document.getElementsByTagName('head')[0].appendChild(hoverAttributionStyle);
            leaflet.DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution:hover');

            // define a new css class in JS to trim attribution into a single line
            var attributionStyle = document.createElement('style');
            attributionStyle.type = 'text/css';
            attributionStyle.innerHTML = '.esri-truncated-attribution {' + 'vertical-align: -3px;' + 'white-space: nowrap;' + 'overflow: hidden;' + 'text-overflow: ellipsis;' + 'display: inline-block;' + 'transition: 0s white-space;' + 'transition-delay: 1s;' + 'max-width: ' + calcAttributionWidth(map) + ';' + '}';

            document.getElementsByTagName('head')[0].appendChild(attributionStyle);
            leaflet.DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution');

            // update the width used to truncate when the map itself is resized
            map.on('resize', function (e) {
                map.attributionControl._container.style.maxWidth = calcAttributionWidth(e.target);
            });

            // remove injected scripts and style tags
            map.on('unload', function () {
                hoverAttributionStyle.parentNode.removeChild(hoverAttributionStyle);
                attributionStyle.parentNode.removeChild(attributionStyle);
                var nodeList = document.querySelectorAll('.esri-leaflet-jsonp');
                for (var i = 0; i < nodeList.length; i++) {
                    nodeList.item(i).parentNode.removeChild(nodeList.item(i));
                }
            });

            map.attributionControl._esriAttributionAdded = true;
        }
    }

    function _setGeometry(geometry) {
        var params = {
            geometry: null,
            geometryType: null
        };

        // convert bounds to extent and finish
        if (geometry instanceof leaflet.LatLngBounds) {
            // set geometry + geometryType
            params.geometry = boundsToExtent(geometry);
            params.geometryType = 'esriGeometryEnvelope';
            return params;
        }

        // convert L.Marker > L.LatLng
        if (geometry.getLatLng) {
            geometry = geometry.getLatLng();
        }

        // convert L.LatLng to a geojson point and continue;
        if (geometry instanceof leaflet.LatLng) {
            geometry = {
                type: 'Point',
                coordinates: [geometry.lng, geometry.lat]
            };
        }

        // handle L.GeoJSON, pull out the first geometry
        if (geometry instanceof leaflet.GeoJSON) {
            // reassign geometry to the GeoJSON value  (we are assuming that only one feature is present)
            geometry = geometry.getLayers()[0].feature.geometry;
            params.geometry = geojsonToArcGIS$1(geometry);
            params.geometryType = geojsonTypeToArcGIS(geometry.type);
        }

        // Handle L.Polyline and L.Polygon
        if (geometry.toGeoJSON) {
            geometry = geometry.toGeoJSON();
        }

        // handle GeoJSON feature by pulling out the geometry
        if (geometry.type === 'Feature') {
            // get the geometry of the geojson feature
            geometry = geometry.geometry;
        }

        // confirm that our GeoJSON is a point, line or polygon
        if (geometry.type === 'Point' || geometry.type === 'LineString' || geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            params.geometry = geojsonToArcGIS$1(geometry);
            params.geometryType = geojsonTypeToArcGIS(geometry.type);
            return params;
        }

        // warn the user if we havn't found an appropriate object
        warn('invalid geometry passed to spatial query. Should be L.LatLng, L.LatLngBounds, L.Marker or a GeoJSON Point, Line, Polygon or MultiPolygon object');

        return;
    }

    function _getAttributionData(url, map) {
        jsonp(url, {}, leaflet.Util.bind(function (error, attributions) {
            if (error) {
                return;
            }
            map._esriAttributions = [];
            for (var c = 0; c < attributions.contributors.length; c++) {
                var contributor = attributions.contributors[c];

                for (var i = 0; i < contributor.coverageAreas.length; i++) {
                    var coverageArea = contributor.coverageAreas[i];
                    var southWest = leaflet.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
                    var northEast = leaflet.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
                    map._esriAttributions.push({
                        attribution: contributor.attribution,
                        score: coverageArea.score,
                        bounds: leaflet.latLngBounds(southWest, northEast),
                        minZoom: coverageArea.zoomMin,
                        maxZoom: coverageArea.zoomMax
                    });
                }
            }

            map._esriAttributions.sort(function (a, b) {
                return b.score - a.score;
            });

            // pass the same argument as the map's 'moveend' event
            var obj = { target: map };
            _updateMapAttribution(obj);
        }, this));
    }

    function _updateMapAttribution(evt) {
        var map = evt.target;
        var oldAttributions = map._esriAttributions;

        if (map && map.attributionControl && oldAttributions) {
            var newAttributions = '';
            var bounds = map.getBounds();
            var wrappedBounds = leaflet.latLngBounds(bounds.getSouthWest().wrap(), bounds.getNorthEast().wrap());
            var zoom = map.getZoom();

            for (var i = 0; i < oldAttributions.length; i++) {
                var attribution = oldAttributions[i];
                var text = attribution.attribution;

                if (!newAttributions.match(text) && attribution.bounds.intersects(wrappedBounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
                    newAttributions += ', ' + text;
                }
            }

            newAttributions = newAttributions.substr(2);
            var attributionElement = map.attributionControl._container.querySelector('.esri-dynamic-attribution');

            attributionElement.innerHTML = newAttributions;
            attributionElement.style.maxWidth = calcAttributionWidth(map);

            map.fire('attributionupdated', {
                attribution: newAttributions
            });
        }
    }

    var EsriUtil = {
        warn: warn,
        cleanUrl: cleanUrl,
        getUrlParams: getUrlParams,
        isArcgisOnline: isArcgisOnline,
        geojsonTypeToArcGIS: geojsonTypeToArcGIS,
        responseToFeatureCollection: responseToFeatureCollection,
        geojsonToArcGIS: geojsonToArcGIS$1,
        arcgisToGeoJSON: arcgisToGeoJSON$1,
        boundsToExtent: boundsToExtent,
        extentToBounds: extentToBounds,
        calcAttributionWidth: calcAttributionWidth,
        setEsriAttribution: setEsriAttribution,
        _setGeometry: _setGeometry,
        _getAttributionData: _getAttributionData,
        _updateMapAttribution: _updateMapAttribution,
        _findIdAttributeFromFeature: _findIdAttributeFromFeature,
        _findIdAttributeFromResponse: _findIdAttributeFromResponse
    };

    var Task = leaflet.Class.extend({

        options: {
            proxy: false,
            useCors: cors
        },

        // Generate a method for each methodName:paramName in the setters for this task.
        generateSetter: function generateSetter(param, context) {
            return leaflet.Util.bind(function (value) {
                this.params[param] = value;
                return this;
            }, context);
        },

        initialize: function initialize(endpoint) {
            // endpoint can be either a url (and options) for an ArcGIS Rest Service or an instance of EsriLeaflet.Service
            if (endpoint.request && endpoint.options) {
                this._service = endpoint;
                leaflet.Util.setOptions(this, endpoint.options);
            } else {
                leaflet.Util.setOptions(this, endpoint);
                this.options.url = cleanUrl(endpoint.url);
            }

            // clone default params into this object
            this.params = leaflet.Util.extend({}, this.params || {});

            // generate setter methods based on the setters object implimented a child class
            if (this.setters) {
                for (var setter in this.setters) {
                    var param = this.setters[setter];
                    this[setter] = this.generateSetter(param, this);
                }
            }
        },

        token: function token(_token) {
            if (this._service) {
                this._service.authenticate(_token);
            } else {
                this.params.token = _token;
            }
            return this;
        },

        // ArcGIS Server Find/Identify 10.5+
        format: function format(boolean) {
            // use double negative to expose a more intuitive positive method name
            this.params.returnUnformattedValues = !boolean;
            return this;
        },

        request: function request(callback, context) {
            if (this.options.requestParams) {
                leaflet.Util.extend(this.params, this.options.requestParams);
            }
            if (this._service) {
                return this._service.request(this.path, this.params, callback, context);
            }

            return this._request('request', this.path, this.params, callback, context);
        },

        _request: function _request(method, path, params, callback, context) {
            var url = this.options.proxy ? this.options.proxy + '?' + this.options.url + path : this.options.url + path;

            if ((method === 'get' || method === 'request') && !this.options.useCors) {
                return Request.get.JSONP(url, params, callback, context);
            }

            return Request[method](url, params, callback, context);
        }
    });

    function task(options) {
        options = getUrlParams(options);
        return new Task(options);
    }

    var Query = Task.extend({
        setters: {
            'offset': 'resultOffset',
            'limit': 'resultRecordCount',
            'fields': 'outFields',
            'precision': 'geometryPrecision',
            'featureIds': 'objectIds',
            'returnGeometry': 'returnGeometry',
            'returnM': 'returnM',
            'transform': 'datumTransformation',
            'token': 'token'
        },

        path: 'query',

        params: {
            returnGeometry: true,
            where: '1=1',
            outSr: 4326,
            outFields: '*'
        },

        // Returns a feature if its shape is wholly contained within the search geometry. Valid for all shape type combinations.
        within: function within(geometry) {
            this._setGeometryParams(geometry);
            this.params.spatialRel = 'esriSpatialRelContains'; // to the REST api this reads geometry **contains** layer
            return this;
        },

        // Returns a feature if any spatial relationship is found. Applies to all shape type combinations.
        intersects: function intersects(geometry) {
            this._setGeometryParams(geometry);
            this.params.spatialRel = 'esriSpatialRelIntersects';
            return this;
        },

        // Returns a feature if its shape wholly contains the search geometry. Valid for all shape type combinations.
        contains: function contains(geometry) {
            this._setGeometryParams(geometry);
            this.params.spatialRel = 'esriSpatialRelWithin'; // to the REST api this reads geometry **within** layer
            return this;
        },

        // Returns a feature if the intersection of the interiors of the two shapes is not empty and has a lower dimension than the maximum dimension of the two shapes. Two lines that share an endpoint in common do not cross. Valid for Line/Line, Line/Area, Multi-point/Area, and Multi-point/Line shape type combinations.
        crosses: function crosses(geometry) {
            this._setGeometryParams(geometry);
            this.params.spatialRel = 'esriSpatialRelCrosses';
            return this;
        },

        // Returns a feature if the two shapes share a common boundary. However, the intersection of the interiors of the two shapes must be empty. In the Point/Line case, the point may touch an endpoint only of the line. Applies to all combinations except Point/Point.
        touches: function touches(geometry) {
            this._setGeometryParams(geometry);
            this.params.spatialRel = 'esriSpatialRelTouches';
            return this;
        },

        // Returns a feature if the intersection of the two shapes results in an object of the same dimension, but different from both of the shapes. Applies to Area/Area, Line/Line, and Multi-point/Multi-point shape type combinations.
        overlaps: function overlaps(geometry) {
            this._setGeometryParams(geometry);
            this.params.spatialRel = 'esriSpatialRelOverlaps';
            return this;
        },

        // Returns a feature if the envelope of the two shapes intersects.
        bboxIntersects: function bboxIntersects(geometry) {
            this._setGeometryParams(geometry);
            this.params.spatialRel = 'esriSpatialRelEnvelopeIntersects';
            return this;
        },

        // if someone can help decipher the ArcObjects explanation and translate to plain speak, we should mention this method in the doc
        indexIntersects: function indexIntersects(geometry) {
            this._setGeometryParams(geometry);
            this.params.spatialRel = 'esriSpatialRelIndexIntersects'; // Returns a feature if the envelope of the query geometry intersects the index entry for the target geometry
            return this;
        },

        // only valid for Feature Services running on ArcGIS Server 10.3+ or ArcGIS Online
        nearby: function nearby(latlng, radius) {
            latlng = leaflet.latLng(latlng);
            this.params.geometry = [latlng.lng, latlng.lat];
            this.params.geometryType = 'esriGeometryPoint';
            this.params.spatialRel = 'esriSpatialRelIntersects';
            this.params.units = 'esriSRUnit_Meter';
            this.params.distance = radius;
            this.params.inSr = 4326;
            return this;
        },

        where: function where(string) {
            // instead of converting double-quotes to single quotes, pass as is, and provide a more informative message if a 400 is encountered
            this.params.where = string;
            return this;
        },

        between: function between(start, end) {
            this.params.time = [start.valueOf(), end.valueOf()];
            return this;
        },

        simplify: function simplify(map, factor) {
            var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
            this.params.maxAllowableOffset = mapWidth / map.getSize().y * factor;
            return this;
        },

        orderBy: function orderBy(fieldName, order) {
            order = order || 'ASC';
            this.params.orderByFields = this.params.orderByFields ? this.params.orderByFields + ',' : '';
            this.params.orderByFields += [fieldName, order].join(' ');
            return this;
        },

        run: function run(callback, context) {
            this._cleanParams();

            // services hosted on ArcGIS Online and ArcGIS Server 10.3.1+ support requesting geojson directly
            if (this.options.isModern || isArcgisOnline(this.options.url)) {
                this.params.f = 'geojson';

                return this.request(function (error, response) {
                    this._trapSQLerrors(error);
                    callback.call(context, error, response, response);
                }, this);

                // otherwise convert it in the callback then pass it on
            } else {
                return this.request(function (error, response) {
                    this._trapSQLerrors(error);
                    callback.call(context, error, response && responseToFeatureCollection(response), response);
                }, this);
            }
        },

        count: function count(callback, context) {
            this._cleanParams();
            this.params.returnCountOnly = true;
            return this.request(function (error, response) {
                callback.call(this, error, response && response.count, response);
            }, context);
        },

        ids: function ids(callback, context) {
            this._cleanParams();
            this.params.returnIdsOnly = true;
            return this.request(function (error, response) {
                callback.call(this, error, response && response.objectIds, response);
            }, context);
        },

        // only valid for Feature Services running on ArcGIS Server 10.3+ or ArcGIS Online
        bounds: function bounds(callback, context) {
            this._cleanParams();
            this.params.returnExtentOnly = true;
            return this.request(function (error, response) {
                if (response && response.extent && extentToBounds(response.extent)) {
                    callback.call(context, error, extentToBounds(response.extent), response);
                } else {
                    error = {
                        message: 'Invalid Bounds'
                    };
                    callback.call(context, error, null, response);
                }
            }, context);
        },

        distinct: function distinct() {
            // geometry must be omitted for queries requesting distinct values
            this.params.returnGeometry = false;
            this.params.returnDistinctValues = true;
            return this;
        },

        // only valid for image services
        pixelSize: function pixelSize(rawPoint) {
            var castPoint = leaflet.point(rawPoint);
            this.params.pixelSize = [castPoint.x, castPoint.y];
            return this;
        },

        // only valid for map services
        layer: function layer(_layer) {
            this.path = _layer + '/query';
            return this;
        },

        _trapSQLerrors: function _trapSQLerrors(error) {
            if (error) {
                if (error.code === '400') {
                    warn('one common syntax error in query requests is encasing string values in double quotes instead of single quotes');
                }
            }
        },

        _cleanParams: function _cleanParams() {
            delete this.params.returnIdsOnly;
            delete this.params.returnExtentOnly;
            delete this.params.returnCountOnly;
        },

        _setGeometryParams: function _setGeometryParams(geometry) {
            this.params.inSr = 4326;
            var converted = _setGeometry(geometry);
            this.params.geometry = converted.geometry;
            this.params.geometryType = converted.geometryType;
        }

    });

    function query(options) {
        return new Query(options);
    }

    var Find = Task.extend({
        setters: {
            // method name > param name
            'contains': 'contains',
            'text': 'searchText',
            'fields': 'searchFields', // denote an array or single string
            'spatialReference': 'sr',
            'sr': 'sr',
            'layers': 'layers',
            'returnGeometry': 'returnGeometry',
            'maxAllowableOffset': 'maxAllowableOffset',
            'precision': 'geometryPrecision',
            'dynamicLayers': 'dynamicLayers',
            'returnZ': 'returnZ',
            'returnM': 'returnM',
            'gdbVersion': 'gdbVersion',
            // skipped implementing this (for now) because the REST service implementation isnt consistent between operations
            // 'transform': 'datumTransformations',
            'token': 'token'
        },

        path: 'find',

        params: {
            sr: 4326,
            contains: true,
            returnGeometry: true,
            returnZ: true,
            returnM: false
        },

        layerDefs: function layerDefs(id, where) {
            this.params.layerDefs = this.params.layerDefs ? this.params.layerDefs + ';' : '';
            this.params.layerDefs += [id, where].join(':');
            return this;
        },

        simplify: function simplify(map, factor) {
            var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
            this.params.maxAllowableOffset = mapWidth / map.getSize().y * factor;
            return this;
        },

        run: function run(callback, context) {
            return this.request(function (error, response) {
                callback.call(context, error, response && responseToFeatureCollection(response), response);
            }, context);
        }
    });

    function find(options) {
        return new Find(options);
    }

    var Identify = Task.extend({
        path: 'identify',

        between: function between(start, end) {
            this.params.time = [start.valueOf(), end.valueOf()];
            return this;
        }
    });

    function identify(options) {
        return new Identify(options);
    }

    exports.VERSION = version;
    exports.Support = Support;
    exports.options = options;
    exports.Util = EsriUtil;
    exports.get = get;
    exports.post = xmlHttpPost;
    exports.request = request;
    exports.Task = Task;
    exports.task = task;
    exports.Query = Query;
    exports.query = query;
    exports.Find = Find;
    exports.find = find;
    exports.Identify = Identify;
    exports.identify = identify;

    //Object.defineProperty(exports, '__esModule', { value: true });
});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**  
 * 提供了百度坐标（BD09）、国测局坐标（GCJ02）、WGS84坐标系、Web墨卡托 4类坐标之间的转换
 *  Created by 木遥（QQ：346819890）  
 *  传入参数 和 返回结果 均是数组：[经度,纬度]
 *  
 *  var result = pointconvert.jwd2mct([117.220102, 31.834912]); //经纬度    转 Web墨卡托  
 *  var result = pointconvert.mct2jwd([13048882,3741659]);      //Web墨卡托 转 经纬度                     
 *  
 *  var result = pointconvert.wgs2gcj([117.220102, 31.834912]); //加偏：标准WGS84坐标  转 国测局偏移坐标
 *  var result = pointconvert.gcj2wgs([117.225590,31.832916]);  //纠偏：国测局偏移坐标 转 标准WGS84坐标                   
 *  
 *  var result = pointconvert.gcj2bd([117.225590,31.832916]);   //国测局偏移坐标 转 百度经纬度坐标
 *  var result = pointconvert.bd2gcj([117.232039,31.839177]);   //百度经纬度坐标 转 国测局偏移坐标
 *  
 *  var result = pointconvert.bd2wgs([117.232039,31.839177]); //百度经纬度坐标 转 标准WGS84坐标
 *  var result = pointconvert.wgs2bd([117.220102,31.834912]); //标准WGS84坐标  转 百度经纬度坐标      
 *  
 */
(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.pointconvert = factory();
    }
})(undefined, function () {

    //定义一些常量
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    /**
     * 百度坐标系 (BD-09) 与 国测局坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    var bd2gcj = function bd2gcj(arrdata) {
        var bd_lon = Number(arrdata[0]);
        var bd_lat = Number(arrdata[1]);

        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);

        gg_lng = Number(gg_lng.toFixed(6));
        gg_lat = Number(gg_lat.toFixed(6));
        return [gg_lng, gg_lat];
    };

    /**
     * 国测局坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    var gcj2bd = function gcj2bd(arrdata) {
        var lng = Number(arrdata[0]);
        var lat = Number(arrdata[1]);

        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;

        bd_lng = Number(bd_lng.toFixed(6));
        bd_lat = Number(bd_lat.toFixed(6));
        return [bd_lng, bd_lat];
    };

    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    var wgs2gcj = function wgs2gcj(arrdata) {
        var lng = Number(arrdata[0]);
        var lat = Number(arrdata[1]);

        if (out_of_china(lng, lat)) {
            return [lng, lat];
        } else {
            var dlat = transformlat(lng - 105.0, lat - 35.0);
            var dlng = transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = dlat * 180.0 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
            dlng = dlng * 180.0 / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;

            mglng = Number(mglng.toFixed(6));
            mglat = Number(mglat.toFixed(6));
            return [mglng, mglat];
        }
    };

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    var gcj2wgs = function gcj2wgs(arrdata) {
        var lng = Number(arrdata[0]);
        var lat = Number(arrdata[1]);

        if (out_of_china(lng, lat)) {
            return [lng, lat];
        } else {
            var dlat = transformlat(lng - 105.0, lat - 35.0);
            var dlng = transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = dlat * 180.0 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
            dlng = dlng * 180.0 / (a / sqrtmagic * Math.cos(radlat) * PI);

            var mglat = lat + dlat;
            var mglng = lng + dlng;

            var jd = lng * 2 - mglng;
            var wd = lat * 2 - mglat;

            jd = Number(jd.toFixed(6));
            wd = Number(wd.toFixed(6));
            return [jd, wd];
        }
    };

    //百度经纬度坐标 转 标准WGS84坐标   
    var bd2wgs = function bd2wgs(arrdata) {
        return gcj2wgs(bd2gcj(arrdata));
    };

    //标准WGS84坐标  转 百度经纬度坐标   
    var wgs2bd = function wgs2bd(arrdata) {
        return gcj2bd(wgs2gcj(arrdata));
    };

    var transformlat = function transformlat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    };

    var transformlng = function transformlng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    };

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    var out_of_china = function out_of_china(lng, lat) {
        return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false;
    };

    //经纬度转Web墨卡托  
    var jwd2mct = function jwd2mct(arrdata) {
        var lng = Number(arrdata[0]);
        var lat = Number(arrdata[1]);

        var x = lng * 20037508.34 / 180;
        var y = Math.log(Math.tan((90 + lat) * PI / 360)) / (PI / 180);
        y = y * 20037508.34 / 180;

        x = Number(x.toFixed(2));
        y = Number(y.toFixed(2));
        return [x, y];
    };

    //Web墨卡托转经纬度  
    var mct2jwd = function mct2jwd(arrdata) {
        var lng = Number(arrdata[0]);
        var lat = Number(arrdata[1]);

        var x = lng / 20037508.34 * 180;
        var y = lat / 20037508.34 * 180;
        y = 180 / PI * (2 * Math.atan(Math.exp(y * PI / 180)) - PI / 2);

        x = Number(x.toFixed(6));
        y = Number(y.toFixed(6));
        return [x, y];
    };

    return {
        jwd2mct: jwd2mct,
        mct2jwd: mct2jwd,

        bd2gcj: bd2gcj,
        gcj2bd: gcj2bd,

        bd2wgs: bd2wgs,
        wgs2bd: wgs2bd,

        wgs2gcj: wgs2gcj,
        gcj2wgs: gcj2wgs
    };
});

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GeoJsonLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _util = __webpack_require__(4);

var _BaseLayer = __webpack_require__(7);

var _AttrBillboard = __webpack_require__(15);

var _AttrLabel = __webpack_require__(13);

var _AttrPolyline = __webpack_require__(11);

var _AttrPolygon = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GeoJsonLayer = _BaseLayer.BaseLayer.extend({
    dataSource: null,
    //添加 
    add: function add() {
        if (this.dataSource) {
            this.viewer.dataSources.add(this.dataSource);
        } else {
            this.queryData();
        }
    },
    //移除
    remove: function remove() {
        this.viewer.dataSources.remove(this.dataSource);
    },
    //定位至数据区域
    centerAt: function centerAt(duration) {
        if (this.config.extent || this.config.center) {
            this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
        } else {
            if (this.dataSource == null) return;
            //this.viewer.zoomTo(this.dataSource.entities.values); 
            this.viewer.flyTo(this.dataSource.entities.values, { duration: duration });
        }
    },
    //设置透明度
    hasOpacity: true,
    _opacity: 0.9,
    setOpacity: function setOpacity(value) {
        this._opacity = value;
        if (this.dataSource == null) return;

        var entities = this.dataSource.entities.values;

        for (var i = 0, len = entities.length; i < len; i++) {
            var entity = entities[i];

            if (entity.polygon && entity.polygon.material && entity.polygon.material.color) {
                this._updatEntityAlpha(entity.polygon.material.color, this._opacity);
                if (entity.polygon.outlineColor) {
                    this._updatEntityAlpha(entity.polygon.outlineColor, this._opacity);
                }
            }

            if (entity.polyline && entity.polyline.material && entity.polyline.material.color) {
                this._updatEntityAlpha(entity.polyline.material.color, this._opacity);
            }

            if (entity.billboard) {
                entity.billboard.color = new _Cesium2.default.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity);
            }

            if (entity.model) {
                entity.model.color = new _Cesium2.default.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity);
            }

            if (entity.label) {
                if (entity.label.fillColor) this._updatEntityAlpha(entity.label.fillColor, this._opacity);
                if (entity.label.outlineColor) this._updatEntityAlpha(entity.label.outlineColor, this._opacity);
                if (entity.label.backgroundColor) this._updatEntityAlpha(entity.label.backgroundColor, this._opacity);
            }
        }
    },
    _updatEntityAlpha: function _updatEntityAlpha(color, opacity) {
        var newclr = color.getValue().withAlpha(opacity);
        color.setValue(newclr);
    },
    queryData: function queryData() {
        var that = this;

        var config = (0, _util.getProxyUrl)(this.config);

        var dataSource = _Cesium2.default.GeoJsonDataSource.load(config.url, config);
        dataSource.then(function (dataSource) {
            that.showResult(dataSource);
        }).otherwise(function (error) {
            that.showError("服务出错", error);
        });
    },
    showResult: function showResult(dataSource) {
        var that = this;

        this.dataSource = dataSource;
        this.viewer.dataSources.add(dataSource);

        if (this.config.flyTo) this.centerAt();

        //===========设置样式============= 
        var entities = dataSource.entities.values;
        for (var i = 0, len = entities.length; i < len; i++) {
            var entity = entities[i];

            //样式 
            if (this.config.symbol) {
                if (this.config.symbol == "default") this.setDefSymbol(entity);else this.setConfigSymbol(entity, this.config.symbol);
            }

            //popup弹窗
            if (this.config.columns || this.config.popup) {
                entity.popup = {
                    html: function html(entity) {
                        var attr = that.getEntityAttr(entity);
                        if ((0, _util.isString)(attr)) return attr;else return that.viewer.mars.popup.getPopupForConfig(that.config, attr);
                    },
                    anchor: this.config.popupAnchor || [0, -15]
                };
            }
            if (this.config.tooltip) {
                entity.tooltip = {
                    html: function html(entity) {
                        var attr = that.getEntityAttr(entity);
                        if ((0, _util.isString)(attr)) return attr;else return that.viewer.mars.popup.getPopupForConfig({ popup: that.config.tooltip }, attr);
                    },
                    anchor: this.config.tooltipAnchor || [0, -15]
                };
            }
            if (this.config.click) {
                entity.click = this.config.click;
            }

            if (this.config.mouseover) {
                entity.mouseover = this.config.mouseover;
            }
            if (this.config.mouseout) {
                entity.mouseout = this.config.mouseout;
            }
        }
    },

    getEntityAttr: function getEntityAttr(entity) {
        return entity.properties;
    },
    //默认symbol
    colorHash: {},
    setDefSymbol: function setDefSymbol(entity) {
        var attr = this.getEntityAttr(entity) || {};
        if (entity.polygon) {
            var name = attr.id || attr.OBJECTID || 0;
            var color = this.colorHash[name];
            if (!color) {
                color = _Cesium2.default.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: this._opacity
                });
                this.colorHash[name] = color;
            }
            entity.polygon.material = color;
            entity.polygon.outline = true;
            entity.polygon.outlineColor = _Cesium2.default.Color.WHITE;
        } else if (entity.polyline) {
            var name = attr.id || attr.OBJECTID || 0;
            var color = this.colorHash[name];
            if (!color) {
                color = _Cesium2.default.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: this._opacity
                });
                this.colorHash[name] = color;
            }
            entity.polyline.material = color;
            entity.polyline.width = 2;
        } else if (entity.billboard) {
            entity.billboard.scale = 0.5;
            entity.billboard.horizontalOrigin = _Cesium2.default.HorizontalOrigin.CENTER;
            entity.billboard.verticalOrigin = _Cesium2.default.VerticalOrigin.BOTTOM;
        }
    },
    //外部配置的symbol
    setConfigSymbol: function setConfigSymbol(entity, symbol) {
        var attr = this.getEntityAttr(entity) || {};
        var styleOpt = symbol.styleOptions;

        if (symbol.styleField) {
            //存在多个symbol，按styleField进行分类
            var styleFieldVal = attr[symbol.styleField];
            var styleOptField = symbol.styleFieldOptions[styleFieldVal];
            if (styleOptField != null) {
                styleOpt = (0, _util.clone)(styleOpt);
                styleOpt = _jquery2.default.extend(styleOpt, styleOptField);
            }
        }

        //外部使用代码示例
        // var layerWork = viewer.mars.getLayer(301087, "id")
        // layerWork.config.symbol.calback = function (attr, entity) {
        //     var val = Number(attr["floor"]._value);
        //     if (val < 10)
        //         return { color: "#ff0000" };
        //     else
        //         return { color: "#0000ff" };
        // }
        if (typeof symbol.calback === 'function') {
            //回调方法 
            var styleOptField = symbol.calback(attr, entity, symbol);
            if (!styleOptField) return;

            styleOpt = (0, _util.clone)(styleOpt);
            styleOpt = _jquery2.default.extend(styleOpt, styleOptField);
        }

        styleOpt = styleOpt || {};

        this._opacity = styleOpt.opacity || 1; //透明度

        if (entity.polyline) {
            (0, _AttrPolyline.style2Entity)(styleOpt, entity.polyline);
        }
        if (entity.polygon) {
            (0, _AttrPolygon.style2Entity)(styleOpt, entity.polygon);

            //加上线宽
            if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
                entity.polygon.outline = false;

                var newopt = {
                    "color": styleOpt.outlineColor,
                    "width": styleOpt.outlineWidth,
                    "opacity": styleOpt.outlineOpacity,
                    "lineType": "solid",
                    "clampToGround": true,
                    "outline": false
                };
                var polyline = (0, _AttrPolyline.style2Entity)(newopt);
                polyline.positions = entity.polygon.hierarchy._value.positions;
                this.dataSource._entityCollection.add({
                    polyline: polyline
                });
            }

            //是建筑物时
            if (this.config.buildings) {
                var floor = Number(attr[this.config.buildings.cloumn] || 1); //层数
                var height = Number(this.config.buildings.height || 5); //层高

                entity.polygon.extrudedHeight = floor * height;
            }
        }

        if (entity.label) {
            styleOpt.heightReference = styleOpt.heightReference || _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;
            (0, _AttrLabel.style2Entity)(styleOpt, entity.label);
        }
        if (entity.billboard) {
            styleOpt.heightReference = styleOpt.heightReference || _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;

            (0, _AttrBillboard.style2Entity)(styleOpt, entity.billboard);

            //加上文字标签 
            if (styleOpt.label && styleOpt.label.field) {
                styleOpt.label.heightReference = styleOpt.label.heightReference || _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;

                entity.label = (0, _AttrLabel.style2Entity)(styleOpt.label);
                entity.label.text = attr[styleOpt.label.field] || "";
            }
        }

        entity.attribute = styleOpt;
    }

});

exports.GeoJsonLayer = GeoJsonLayer;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPoint = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawBase = __webpack_require__(26);

var _point = __webpack_require__(1);

var _AttrPoint = __webpack_require__(24);

var attr = _interopRequireWildcard(_AttrPoint);

var _Tooltip = __webpack_require__(3);

var _EventType = __webpack_require__(8);

var EventType = _interopRequireWildcard(_EventType);

var _EditPoint = __webpack_require__(58);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawPoint = exports.DrawPoint = _DrawBase.DrawBase.extend({
    type: 'point',
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = null;

        var that = this;
        var addattr = {
            position: new _Cesium2.default.CallbackProperty(function (time) {
                return that.getDrawPosition();
            }, false),
            point: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        this.entity = this.dataSource.entities.add(addattr); //创建要素对象
        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.point);
    },
    //绑定鼠标事件
    bindEvent: function bindEvent() {
        var _this = this;

        this.getHandler().setInputAction(function (event) {
            var point = (0, _point.getCurrentMousePosition)(_this.viewer.scene, event.endPosition, _this.entity);
            if (point) {
                _this._positions_draw = point;
            }
            _this.tooltip.showAt(event.endPosition, _Tooltip.message.draw.point.start);

            _this.fire(EventType.DrawMouseMove, { drawtype: _this.type, entity: _this.entity, position: point });
        }, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);

        this.getHandler().setInputAction(function (event) {
            var point = (0, _point.getCurrentMousePosition)(_this.viewer.scene, event.position, _this.entity);
            if (point) {
                _this._positions_draw = point;
                _this.disable();
            }
        }, _Cesium2.default.ScreenSpaceEventType.LEFT_CLICK);
    },
    //获取编辑对象类
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditPoint.EditPoint(entity, this.viewer, this.dataSource);
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束,更新属性
    finish: function finish() {
        this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象     
        this.entity.position = this.getDrawPosition();
    }

});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditBase = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Class = __webpack_require__(10);

var _EventType = __webpack_require__(8);

var EventType = _interopRequireWildcard(_EventType);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditBase = exports.EditBase = _Class.Class.extend({
    _dataSource: null,
    _minPointNum: 1, //至少需要点的个数 (值是draw中传入)
    _maxPointNum: 9999, //最多允许点的个数 (值是draw中传入)
    initialize: function initialize(entity, viewer, dataSource) {
        this.entity = entity;
        this.viewer = viewer;
        this.dataSource = dataSource;

        this.draggers = [];
    },
    fire: function fire(type, data, propagate) {
        if (this._fire) this._fire(type, data, propagate);
    },
    formatNum: function formatNum(num, digits) {
        return Util.formatNum(num, digits);
    },
    setCursor: function setCursor(val) {
        this.viewer._container.style.cursor = val ? 'crosshair' : '';
    },
    //激活绘制
    activate: function activate() {
        if (this._enabled) {
            return this;
        }
        this._enabled = true;

        this.entity.inProgress = true;
        this.changePositionsToCallback();
        this.bindDraggers();
        this.bindEvent();

        this.fire(EventType.EditStart, { edittype: this.entity.attribute.type, entity: this.entity });

        return this;
    },
    //释放绘制
    disable: function disable() {
        if (!this._enabled) {
            return this;
        }
        this._enabled = false;

        this.destroyEvent();
        this.destroyDraggers();
        this.finish();

        this.entity.inProgress = false;
        this.fire(EventType.EditStop, { edittype: this.entity.attribute.type, entity: this.entity });
        this.tooltip.setVisible(false);

        return this;
    },
    changePositionsToCallback: function changePositionsToCallback() {},
    //图形编辑结束后调用
    finish: function finish() {},
    //拖拽点 事件
    bindEvent: function bindEvent() {
        var _this = this;

        var scratchBoundingSphere = new _Cesium2.default.BoundingSphere();
        var zOffset = new _Cesium2.default.Cartesian3();

        var draggerHandler = new _Cesium2.default.ScreenSpaceEventHandler(this.viewer.canvas);
        draggerHandler.dragger = null;

        //选中后拖动
        draggerHandler.setInputAction(function (event) {
            var pickedObject = _this.viewer.scene.pick(event.position);
            if (_Cesium2.default.defined(pickedObject)) {
                var entity = pickedObject.id || pickedObject.primitive.id || pickedObject.primitive;
                if (entity && _Cesium2.default.defaultValue(entity._isDragger, false)) {
                    _this.viewer.scene.screenSpaceCameraController.enableRotate = false;
                    _this.viewer.scene.screenSpaceCameraController.enableTilt = false;
                    _this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
                    _this.viewer.scene.screenSpaceCameraController.enableInputs = false;

                    if (_this.viewer.mars) _this.viewer.mars.popup.close(entity);
                    debugger;

                    draggerHandler.dragger = entity;
                    draggerHandler.dragger.show = false;
                    _this.setCursor(true);

                    if (draggerHandler.dragger.onDragStart) {
                        var position = draggerHandler.dragger.position;
                        if (position && position.getValue) position = position.getValue();
                        draggerHandler.dragger.onDragStart(draggerHandler.dragger, position);
                    }
                }
            }
        }, _Cesium2.default.ScreenSpaceEventType.LEFT_DOWN);

        draggerHandler.setInputAction(function (event) {
            var dragger = draggerHandler.dragger;
            if (dragger) {
                switch (dragger._pointType) {
                    case draggerCtl.PointType.MoveHeight:
                        //改变高度垂直拖动
                        var dy = event.endPosition.y - event.startPosition.y;

                        var position = dragger.position;
                        if (position && position.getValue) position = position.getValue();

                        var tangentPlane = new _Cesium2.default.EllipsoidTangentPlane(position);

                        scratchBoundingSphere.center = position;
                        scratchBoundingSphere.radius = 1;

                        var metersPerPixel = _this.viewer.scene.frameState.camera.getPixelSize(scratchBoundingSphere, _this.viewer.scene.frameState.context.drawingBufferWidth, _this.viewer.scene.frameState.context.drawingBufferHeight) * 1.5;

                        _Cesium2.default.Cartesian3.multiplyByScalar(tangentPlane.zAxis, -dy * metersPerPixel, zOffset);
                        var newPosition = _Cesium2.default.Cartesian3.clone(position);
                        _Cesium2.default.Cartesian3.add(position, zOffset, newPosition);

                        dragger.position = newPosition;
                        if (dragger.onDrag) {
                            dragger.onDrag(dragger, newPosition, position);
                        }
                        _this.updateAttrForEditing();
                        break;
                    default:
                        //默认修改位置
                        _this.tooltip.showAt(event.endPosition, _Tooltip.message.edit.end);

                        var point = (0, _point.getCurrentMousePosition)(_this.viewer.scene, event.endPosition, _this.entity);

                        if (point) {
                            dragger.position = point;
                            if (dragger.onDrag) {
                                dragger.onDrag(dragger, point);
                            }
                            _this.updateAttrForEditing();
                        }
                        break;
                }
            } else {
                _this.tooltip.setVisible(false);

                var pickedObject = _this.viewer.scene.pick(event.endPosition);
                if (_Cesium2.default.defined(pickedObject)) {
                    var entity = pickedObject.id;
                    if (entity && _Cesium2.default.defaultValue(entity._isDragger, false) && entity.draw_tooltip) {
                        var draw_tooltip = entity.draw_tooltip;

                        //可删除时，提示右击删除
                        if (draggerCtl.PointType.Control == entity._pointType && _this._positions_draw && _this._positions_draw.length && _this._positions_draw.length > _this._minPointNum) draw_tooltip += _Tooltip.message.del.def;

                        _this.tooltip.showAt(event.endPosition, draw_tooltip);
                    }
                }
            }
        }, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);

        draggerHandler.setInputAction(function (event) {
            var dragger = draggerHandler.dragger;
            if (dragger) {
                _this.setCursor(false);
                dragger.show = true;

                var position = dragger.position;
                if (position && position.getValue) position = position.getValue();

                if (dragger.onDragEnd) {
                    dragger.onDragEnd(dragger, position);
                }
                _this.fire(EventType.EditMovePoint, { edittype: _this.entity.attribute.type, entity: _this.entity, position: position });

                draggerHandler.dragger = null;

                _this.viewer.scene.screenSpaceCameraController.enableRotate = true;
                _this.viewer.scene.screenSpaceCameraController.enableTilt = true;
                _this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
                _this.viewer.scene.screenSpaceCameraController.enableInputs = true;
            }
        }, _Cesium2.default.ScreenSpaceEventType.LEFT_UP);

        //右击删除一个点
        draggerHandler.setInputAction(function (event) {
            //右击删除上一个点
            var pickedObject = _this.viewer.scene.pick(event.position);
            if (_Cesium2.default.defined(pickedObject)) {
                var entity = pickedObject.id;
                if (entity && _Cesium2.default.defaultValue(entity._isDragger, false) && draggerCtl.PointType.Control == entity._pointType) {
                    var isDelOk = _this.deletePointForDragger(entity, event.position);

                    if (isDelOk) _this.fire(EventType.EditRemovePoint, { edittype: _this.entity.attribute.type, entity: _this.entity });
                }
            }
        }, _Cesium2.default.ScreenSpaceEventType.RIGHT_CLICK);

        this.draggerHandler = draggerHandler;
    },
    destroyEvent: function destroyEvent() {
        this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        this.viewer.scene.screenSpaceCameraController.enableTilt = true;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
        this.viewer.scene.screenSpaceCameraController.enableInputs = true;

        this.setCursor(false);

        if (this.draggerHandler) {
            if (this.draggerHandler.dragger) this.draggerHandler.dragger.show = true;

            this.draggerHandler.destroy();
            this.draggerHandler = null;
        }
    },
    bindDraggers: function bindDraggers() {},
    updateDraggers: function updateDraggers() {
        if (!this._enabled) {
            return this;
        }

        this.destroyDraggers();
        this.bindDraggers();
    },
    destroyDraggers: function destroyDraggers() {
        for (var i = 0, len = this.draggers.length; i < len; i++) {
            this.dataSource.entities.remove(this.draggers[i]);
        }
        this.draggers = [];
    },
    //删除点
    deletePointForDragger: function deletePointForDragger(dragger, position) {
        if (this._positions_draw.length - 1 < this._minPointNum) {
            this.tooltip.showAt(position, _Tooltip.message.del.min + this._minPointNum);
            return false;
        }

        var index = dragger.index;
        if (index > 0 && index < this._positions_draw.length) {
            this._positions_draw.splice(index, 1);
            this.updateDraggers();
            return true;
        } else {
            return false;
        }
    },
    updateAttrForEditing: function updateAttrForEditing() {}

});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _util = __webpack_require__(4);

var _BaseLayer = __webpack_require__(7);

var _GroupLayer = __webpack_require__(45);

var _TileLayer = __webpack_require__(30);

var _GraticuleLayer = __webpack_require__(46);

var _CustomFeatureGridLayer = __webpack_require__(23);

var _ArcFeatureGridLayer = __webpack_require__(48);

var _POILayer = __webpack_require__(49);

var _GeoJsonLayer = __webpack_require__(19);

var _ArcFeatureLayer = __webpack_require__(50);

var _GltfLayer = __webpack_require__(51);

var _Tiles3dLayer = __webpack_require__(52);

var _KmlLayer = __webpack_require__(53);

var _CzmlLayer = __webpack_require__(54);

var _TerrainLayer = __webpack_require__(55);

var _DrawLayer = __webpack_require__(56);

var _BaiduImageryProvider = __webpack_require__(80);

var _FeatureGridImageryProvider = __webpack_require__(81);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//创建图层
function createLayer(item, viewer, serverURL, layerToMap) {
    var layer;

    if (item.url) {
        if (serverURL) {
            item.url = item.url.replace('$serverURL$', serverURL);
        }
        item.url = item.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
    }

    switch (item.type) {
        //===============地图数组====================
        case "group":
            //示例：{ "name": "电子地图", "type": "group","layers": [    ]}
            if (item.layers && item.layers.length > 0) {
                var arrVec = [];
                for (var index = 0; index < item.layers.length; index++) {
                    var temp = createLayer(item.layers[index], viewer, serverURL, layerToMap);
                    if (temp == null) continue;
                    arrVec.push(temp);
                }
                item._layers = arrVec;
                layer = new _GroupLayer.GroupLayer(item, viewer);
            }
            break;
        case "www_bing": //bing地图 
        case "www_osm": //OSM开源地图 
        case "www_google": //谷歌国内
        case "www_gaode": //高德
        case "www_baidu": //百度 
        case "www_tdt": //天地图
        case "arcgis_cache":
        case "arcgis":
        case "arcgis_tile":
        case "arcgis_dynamic":
        case "wmts":
        case "tms":
        case "wms":
        case "xyz":
        case "tile":
        case "single":
        case "image":
        case "gee":
        case "mapbox":
        case "custom_tilecoord": //瓦片信息
        case "custom_grid":
            //网格线 
            //瓦片图层
            layer = new _TileLayer.TileLayer(item, viewer);
            layer.isTile = true;
            break;
        case "www_poi":
            //在线poi数据
            layer = new _POILayer.POILayer(item, viewer);
            break;
        case "custom_featuregrid":
            //自定义矢量网格图层 
            layer = new _CustomFeatureGridLayer.CustomFeatureGridLayer(item, viewer);
            break;
        case "custom_graticule":
            layer = new _GraticuleLayer.GraticuleLayer(item, viewer);
            break;

        case "3dtiles":
            layer = new _Tiles3dLayer.Tiles3dLayer(item, viewer);
            break;
        case "gltf":
            layer = new _GltfLayer.GltfLayer(item, viewer);
            break;
        case "arcgis_feature":
            //分网格加载
            layer = new _ArcFeatureGridLayer.ArcFeatureGridLayer(item, viewer);
            break;
        case "arcgis_feature2":
            //一次加载，不分网格
            layer = new _ArcFeatureLayer.ArcFeatureLayer(item, viewer);
            break;
        case "geojson":
            layer = new _GeoJsonLayer.GeoJsonLayer(item, viewer);
            break;
        case "geojson-draw":
            //基于框架内部draw绘制保存的geojson数据的加载
            layer = new _DrawLayer.DrawLayer(item, viewer);
            break;
        case "kml":
            layer = new _KmlLayer.KmlLayer(item, viewer);
            break;
        case "czml":
            layer = new _CzmlLayer.CzmlLayer(item, viewer);
            break;
        case "terrain":
            layer = new _TerrainLayer.TerrainLayer(item, viewer);
            break;

        default:
            break;
    }

    if (layerToMap) {
        var _temp = layerToMap(item, viewer, layer);
        if (_temp) layer = _temp;
    }

    if (layer == null) {
        if (item.type != "group") console.log("配置中的图层未处理：" + JSON.stringify(item));
    } else {
        //这句话，vue或部分架构中要注释，会造成内存溢出。
        item._layer = layer;
    }

    return layer;
}

//创建地图底图
function createImageryProvider(item, serverURL) {
    if (item.url) {
        if (serverURL) {
            item.url = item.url.replace('$serverURL$', serverURL);
        }
        item.url = item.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
    }

    var opts = {};
    for (var key in item) {
        var value = item[key];
        if (value == null) continue;

        switch (key) {
            default:
                //直接赋值
                opts[key] = value;
                break;
            case "crs":
                if (value == "4326" || value.toUpperCase() == "EPSG4326" || value.toUpperCase() == "EPSG:4326") opts.tilingScheme = new _Cesium2.default.GeographicTilingScheme({
                    numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 2,
                    numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1
                });else opts.tilingScheme = new _Cesium2.default.WebMercatorTilingScheme({
                    numberOfLevelZeroTilesX: item.numberOfLevelZeroTilesX || 1,
                    numberOfLevelZeroTilesY: item.numberOfLevelZeroTilesY || 1
                });
                break;
            case "rectangle":
                opts.rectangle = _Cesium2.default.Rectangle.fromDegrees(value.xmin, value.ymin, value.xmax, value.ymax);
                break;
        }
    }

    if (opts.url && opts.proxy) {
        opts = (0, _util.getProxyUrl)(opts);
    }

    var layer;
    switch (opts.type_new || opts.type) {
        //===============地图底图==================== 
        case "single":
        case "image":
            layer = new _Cesium2.default.SingleTileImageryProvider(opts);
            break;
        case "xyz":
        case "tile":
            opts.customTags = {
                "z&1": function z1(imageryProvider, x, y, level) {
                    return level + 1;
                }
            };
            layer = new _Cesium2.default.UrlTemplateImageryProvider(opts);
            break;
        case "wms":
            layer = new _Cesium2.default.WebMapServiceImageryProvider(opts);
            break;
        case "tms":
            if (!opts.url) opts.url = _Cesium2.default.buildModuleUrl('Assets/Textures/NaturalEarthII');
            layer = new _Cesium2.default.createTileMapServiceImageryProvider(opts);
            break;
        case "wmts":
            layer = new _Cesium2.default.WebMapTileServiceImageryProvider(opts);
            break;
        case "gee":
            //谷歌地球
            layer = new _Cesium2.default.GoogleEarthEnterpriseImageryProvider({
                metadata: new _Cesium2.default.GoogleEarthEnterpriseMetadata(opts)
            });
            break;
        case "mapbox":
            //mapbox
            layer = new _Cesium2.default.MapboxImageryProvider(opts);
            break;
        case "arcgis":
        case "arcgis_tile":
        case "arcgis_dynamic":
            layer = new _Cesium2.default.ArcGisMapServerImageryProvider(opts);
            break;
        case "arcgis_cache":
            //layer = new _ArcTileImageryProvider(opts);
            if (!_Cesium2.default.UrlTemplateImageryProvider.prototype.padLeft0) {
                _Cesium2.default.UrlTemplateImageryProvider.prototype.padLeft0 = function (numStr, n) {
                    numStr = String(numStr);
                    var len = numStr.length;
                    while (len < n) {
                        numStr = "0" + numStr;
                        len++;
                    }
                    return numStr;
                };
            }
            opts.customTags = {
                //小写
                arc_x: function arc_x(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(x.toString(16), 8);
                },
                arc_y: function arc_y(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(y.toString(16), 8);
                },
                arc_z: function arc_z(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(level.toString(), 2);
                },
                //大写
                arc_X: function arc_X(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(x.toString(16), 8).toUpperCase();
                },
                arc_Y: function arc_Y(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(y.toString(16), 8).toUpperCase();
                },
                arc_Z: function arc_Z(imageryProvider, x, y, level) {
                    return imageryProvider.padLeft0(level.toString(), 2).toUpperCase();
                }
            };
            layer = new _Cesium2.default.UrlTemplateImageryProvider(opts);
            break;

        //===============互联网常用地图==================== 

        case "www_tdt":
            //天地图
            var _layer;
            switch (opts.layer) {
                default:
                case "vec_d":
                    _layer = "vec";
                    break;
                case "vec_z":
                    _layer = "cva";
                    break;
                case "img_d":
                    _layer = "img";
                    break;
                case "img_z":
                    _layer = "cia";
                    break;
                case "ter_d":
                    _layer = "ter";
                    break;
                case "ter_z":
                    _layer = "cta";
                    break;
            }

            var _key;
            if (opts.key == null || opts.key.length == 0) _key = '87949882c75775b5069a0076357b7530'; //默认
            else _key = getOneKey(opts.key);

            var maxLevel = 18;
            if (item.crs == '4326') {
                //wgs84   
                var matrixIds = new Array(maxLevel);
                for (var z = 0; z <= maxLevel; z++) {
                    matrixIds[z] = (z + 1).toString();
                }
                var _url = 'http://t{s}.tianditu.gov.cn/' + _layer + '_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=' + _key;

                layer = new _Cesium2.default.WebMapTileServiceImageryProvider({
                    url: opts.proxy ? new _Cesium2.default.Resource({ url: _url, proxy: opts.proxy }) : _url,
                    layer: _layer,
                    style: 'default',
                    format: 'tiles',
                    tileMatrixSetID: 'c',
                    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                    tileMatrixLabels: matrixIds,
                    tilingScheme: new _Cesium2.default.GeographicTilingScheme(), //WebMercatorTilingScheme、GeographicTilingScheme
                    maximumLevel: maxLevel
                });
            } else {
                //墨卡托  
                var matrixIds = new Array(maxLevel);
                for (var z = 0; z <= maxLevel; z++) {
                    matrixIds[z] = z.toString();
                }
                var _url = 'http://t{s}.tianditu.gov.cn/' + _layer + '_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=' + _key;

                layer = new _Cesium2.default.WebMapTileServiceImageryProvider({
                    url: opts.proxy ? new _Cesium2.default.Resource({ url: _url.replace('{s}', '0'), proxy: opts.proxy }) : _url,
                    layer: _layer,
                    style: 'default',
                    format: 'tiles',
                    tileMatrixSetID: 'w',
                    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                    tileMatrixLabels: matrixIds,
                    tilingScheme: new _Cesium2.default.WebMercatorTilingScheme(),
                    maximumLevel: maxLevel
                });
            }
            break;
        case "www_gaode":
            //高德
            var _url;
            switch (opts.layer) {
                case "vec":
                default:
                    //style=7是立体的，style=8是灰色平面的
                    _url = 'http://' + (opts.bigfont ? 'wprd' : 'webrd') + '0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}';
                    break;
                case "img_d":
                    _url = 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
                    break;
                case "img_z":
                    _url = 'http://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8';
                    break;
                case "time":
                    var time = new Date().getTime();
                    _url = 'http://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=' + time;
                    break;
            }

            layer = new _Cesium2.default.UrlTemplateImageryProvider({
                url: opts.proxy ? new _Cesium2.default.Resource({ url: _url, proxy: opts.proxy }) : _url,
                subdomains: ['1', '2', '3', '4'],
                maximumLevel: 18
            });
            break;
        case "www_baidu":
            //百度
            layer = new _BaiduImageryProvider.BaiduImageryProvider(opts);
            break;
        case "www_google":
            //谷歌国内   
            var _url;

            if (item.crs == '4326' || item.crs == 'wgs84') {
                //wgs84   无偏移
                switch (opts.layer) {
                    default:
                    case "img_d":
                        _url = 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}';
                        break;
                }
            } else {
                //有偏移  
                switch (opts.layer) {
                    case "vec":
                    default:
                        _url = 'http://mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile';
                        break;
                    case "img_d":
                        _url = 'http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali';
                        break;
                    case "img_z":
                        _url = 'http://mt{s}.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil';
                        break;
                    case "ter":
                        _url = 'http://mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile';
                        break;
                }
            }

            layer = new _Cesium2.default.UrlTemplateImageryProvider({
                url: opts.proxy ? new _Cesium2.default.Resource({ url: _url, proxy: opts.proxy }) : _url,
                subdomains: ['1', '2', '3'],
                maximumLevel: 20
            });
            break;

        case "www_osm":
            //OSM开源地图 
            var _url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            layer = new _Cesium2.default.UrlTemplateImageryProvider({
                url: opts.proxy ? new _Cesium2.default.Resource({ url: _url, proxy: opts.proxy }) : _url,
                subdomains: "abc",
                maximumLevel: 18
            });
            break;
        case "www_bing":
            //bing地图 

            var _url = 'https://dev.virtualearth.net';
            //无标记影像 Aerial,
            //有英文标记影像   AerialWithLabels,
            //矢量道路  Road 
            //OrdnanceSurvey,
            //CollinsBart
            var style = opts.layer || _Cesium2.default.BingMapsStyle.Aerial;
            layer = new _Cesium2.default.BingMapsImageryProvider({
                url: opts.proxy ? new _Cesium2.default.Resource({ url: _url, proxy: opts.proxy }) : _url,
                key: opts.key || 'AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc',
                mapStyle: style
            });
            break;

        //===============内部定义的图层====================
        case "custom_grid":
            //网格线 
            layer = new _Cesium2.default.GridImageryProvider();
            break;
        case "custom_tilecoord":
            //瓦片信息
            layer = new _Cesium2.default.TileCoordinatesImageryProvider();
            break;
        case "custom_featuregrid":
            //自定义矢量网格图层
            layer = new _FeatureGridImageryProvider.FeatureGridImageryProvider(opts);
            break;
        default:
            console.log("config配置图层未处理:" + item);
            break;
    }
    layer.config = opts;

    return layer;
}

function getOneKey(arr) {
    var n = Math.floor(Math.random() * arr.length + 1) - 1;
    return arr[n];
}

//===========模块对外公开的属性及方法=========
exports.createLayer = createLayer;
exports.createImageryProvider = createImageryProvider;

exports.BaseLayer = _BaseLayer.BaseLayer;
exports.GroupLayer = _GroupLayer.GroupLayer;

exports.TileLayer = _TileLayer.TileLayer;
exports.GltfLayer = _GltfLayer.GltfLayer;
exports.Tiles3dLayer = _Tiles3dLayer.Tiles3dLayer;
exports.GeoJsonLayer = _GeoJsonLayer.GeoJsonLayer;
exports.ArcFeatureLayer = _ArcFeatureLayer.ArcFeatureLayer;
exports.KmlLayer = _KmlLayer.KmlLayer;
exports.CzmlLayer = _CzmlLayer.CzmlLayer;
exports.TerrainLayer = _TerrainLayer.TerrainLayer;
exports.DrawLayer = _DrawLayer.DrawLayer;

exports.CustomFeatureGridLayer = _CustomFeatureGridLayer.CustomFeatureGridLayer;
exports.ArcFeatureGridLayer = _ArcFeatureGridLayer.ArcFeatureGridLayer;
exports.POILayer = _POILayer.POILayer;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CustomFeatureGridLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _util = __webpack_require__(4);

var _FeatureGridLayer = __webpack_require__(47);

var _AttrBillboard = __webpack_require__(15);

var _AttrLabel = __webpack_require__(13);

var _AttrPolyline = __webpack_require__(11);

var _AttrPolygon = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//分块加载矢量数据公共类
var CustomFeatureGridLayer = _FeatureGridLayer.FeatureGridLayer.extend({
    _cacheGrid: {}, //网格缓存,存放矢量对象id集合
    _cacheFeature: {}, //矢量对象缓存,存放矢量对象和其所对应的网格集合

    _addImageryCache: function _addImageryCache(opts) {
        this._cacheGrid[opts.key] = { opts: opts, isLoading: true };

        var that = this;

        this.getDataForGrid(opts, function (arrdata) {
            if (that._visible) that._showData(opts, arrdata);
        });
    },
    getDataForGrid: function getDataForGrid(opts, calback) {
        //子类可继承, calback为回调方法,calback参数传数据数组

        //直接使用本类,传参方式
        if (this.config.getDataForGrid) {
            this.config.getDataForGrid(opts, calback);
        }
    },
    checkHasBreak: function checkHasBreak(cacheKey) {
        if (!this._visible || !this._cacheGrid[cacheKey]) {
            return true;
        }
        return false;
    },
    _showData: function _showData(opts, arrdata) {
        var cacheKey = opts.key;
        if (this.checkHasBreak[cacheKey]) {
            return; //异步请求结束时,如果已经卸载了网格就直接跳出。
        }

        var that = this;

        var arrIds = [];
        for (var i = 0, len = arrdata.length; i < len; i++) {
            var attributes = arrdata[i];
            var id = attributes[this.config.IdName || 'id'];

            var layer = this._cacheFeature[id];
            if (layer) {
                //已存在
                layer.grid.push(cacheKey);
                this.updateEntity(layer.entity, attributes);
            } else {
                var entity = this.createEntity(opts, attributes, function (entity) {
                    if (that.config.debuggerTileInfo) {
                        //测试用
                        entity._temp_id = id;
                        entity.popup = function (entity) {
                            return JSON.stringify(that._cacheFeature[entity._temp_id].grid);
                        };
                    }
                    that._cacheFeature[id] = {
                        grid: [cacheKey],
                        entity: entity
                    };
                });
                if (entity != null) {
                    if (that.config.debuggerTileInfo) {
                        //测试用
                        entity._temp_id = id;
                        entity.popup = function (entity) {
                            return JSON.stringify(that._cacheFeature[entity._temp_id].grid);
                        };
                    }
                    that._cacheFeature[id] = {
                        grid: [cacheKey],
                        entity: entity
                    };
                }
            }
            arrIds.push(id);
        }

        this._cacheGrid[cacheKey] = this._cacheGrid[cacheKey] || {};
        this._cacheGrid[cacheKey].ids = arrIds;
        this._cacheGrid[cacheKey].isLoading = false;
    },

    createEntity: function createEntity(opts, attributes, calback) {
        //子类可以继承,根据数据创造entity

        //直接使用本类,传参方式
        if (this.config.createEntity) {
            return this.config.createEntity(opts, attributes, calback);
        }
        return null;
    },
    updateEntity: function updateEntity(enetity, attributes) {
        //子类可以继承,更新entity（动态数据时有用）

        //直接使用本类,传参方式
        if (this.config.updateEntity) {
            this.config.updateEntity(enetity, attributes);
        }
    },
    removeEntity: function removeEntity(enetity) {
        //子类可以继承,移除entity

        //直接使用本类,传参方式
        if (this.config.removeEntity) {
            this.config.removeEntity(enetity);
        } else {
            this.dataSource.entities.remove(enetity);
        }
    },
    _removeImageryCache: function _removeImageryCache(opts) {
        var cacheKey = opts.key;
        var layers = this._cacheGrid[cacheKey];
        if (layers) {
            if (layers.ids) {
                for (var i = 0; i < layers.ids.length; i++) {
                    var id = layers.ids[i];
                    var layer = this._cacheFeature[id];
                    if (layer) {
                        layer.grid.remove(cacheKey);
                        if (layer.grid.length == 0) {
                            delete this._cacheFeature[id];
                            this.removeEntity(layer.entity);
                        }
                    }
                }
            }
            delete this._cacheGrid[cacheKey];
        }
    },
    _removeAllImageryCache: function _removeAllImageryCache() {

        if (this.config.removeAllEntity) {
            this.config.removeAllEntity();
        } else {
            this.dataSource.entities.removeAll();
            this.primitives.removeAll();
        }

        this._cacheFeature = {};
        this._cacheGrid = {};
    },
    //移除 
    removeEx: function removeEx() {
        if (this.config.removeAllEntity) {
            this.config.removeAllEntity();
        } else {
            this.dataSource.entities.removeAll();
            this.primitives.removeAll();
        }

        this._cacheFeature = {};
        this._cacheGrid = {};

        this.viewer.dataSources.remove(this.dataSource);
        this.viewer.scene.primitives.remove(this.primitives);
    },
    //重新加载数据
    reload: function reload() {
        var that = this;
        for (var i in this._cacheGrid) {
            var item = this._cacheGrid[i];
            if (item == null || item.opts == null || item.isLoading) continue;

            var opts = item.opts;
            this.getDataForGrid(opts, function (arrdata) {
                that._showData(opts, arrdata);
            });
        }
    },

    //设置透明度
    hasOpacity: true,
    _opacity: 1,
    setOpacity: function setOpacity(value) {
        this._opacity = value;

        for (var i in this._cacheFeature) {
            var entity = this._cacheFeature[i].entity;

            if (entity.polygon && entity.polygon.material && entity.polygon.material.color) {
                this._updatEntityAlpha(entity.polygon.material.color, this._opacity);
                if (entity.polygon.outlineColor) {
                    this._updatEntityAlpha(entity.polygon.outlineColor, this._opacity);
                }
            } else if (entity.polyline && entity.polyline.material && entity.polyline.material.color) {
                this._updatEntityAlpha(entity.polyline.material.color, this._opacity);
            } else if (entity.billboard) {
                entity.billboard.color = new _Cesium2.default.Color.fromCssColorString("#FFFFFF").withAlpha(this._opacity);

                if (entity.label) {
                    if (entity.label.fillColor) this._updatEntityAlpha(entity.label.fillColor, this._opacity);
                    if (entity.label.outlineColor) this._updatEntityAlpha(entity.label.outlineColor, this._opacity);
                    if (entity.label.backgroundColor) this._updatEntityAlpha(entity.label.backgroundColor, this._opacity);
                }
            }
        }
    },
    _updatEntityAlpha: function _updatEntityAlpha(color, opacity) {
        var newclr = color.getValue().withAlpha(opacity);
        color.setValue(newclr);
    },

    //默认symbol
    colorHash: {},
    setDefSymbol: function setDefSymbol(entity) {
        if (entity.polygon) {
            var name = entity.properties.OBJECTID;
            var color = this.colorHash[name];
            if (!color) {
                color = _Cesium2.default.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: this._opacity
                });
                this.colorHash[name] = color;
            }
            entity.polygon.material = color;
            entity.polygon.outline = true;
            entity.polygon.outlineColor = _Cesium2.default.Color.WHITE;
        } else if (entity.polyline) {

            var name = entity.properties.OBJECTID;
            var color = this.colorHash[name];
            if (!color) {
                color = _Cesium2.default.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: this._opacity
                });
                this.colorHash[name] = color;
            }
            entity.polyline.material = color;
            entity.polyline.width = 2;
        } else if (entity.billboard) {
            entity.billboard.scale = 0.5;
            entity.billboard.horizontalOrigin = _Cesium2.default.HorizontalOrigin.CENTER;
            entity.billboard.verticalOrigin = _Cesium2.default.VerticalOrigin.BOTTOM;
        }
    },
    //外部配置的symbol
    setConfigSymbol: function setConfigSymbol(entity, symbol) {
        var attr = entity.properties;
        var styleOpt = symbol.styleOptions;

        if (symbol.styleField) {
            //存在多个symbol,按styleField进行分类
            var styleFieldVal = attr[symbol.styleField];
            var styleOptField = symbol.styleFieldOptions[styleFieldVal];
            if (styleOptField != null) {
                styleOpt = (0, _util.clone)(styleOpt);
                styleOpt = _jquery2.default.extend(styleOpt, styleOptField);
            }
        }

        //外部使用代码示例
        // var layerWork = viewer.mars.getLayer(301087, "id")
        // layerWork.config.symbol.calback = function (attr, entity) {
        //     var val = Number(attr["floor"]._value);
        //     if (val < 10)
        //         return { color: "#ff0000" };
        //     else
        //         return { color: "#0000ff" };
        // }
        if (typeof symbol.calback === 'function') {
            //回调方法 
            var styleOptField = symbol.calback(attr, entity, symbol);
            if (!styleOptField) return;

            styleOpt = (0, _util.clone)(styleOpt);
            styleOpt = _jquery2.default.extend(styleOpt, styleOptField);
        }

        styleOpt = styleOpt || {};

        this._opacity = styleOpt.opacity || 1; //透明度

        if (entity.polygon) {
            (0, _AttrPolygon.style2Entity)(styleOpt, entity.polygon);

            //加上线宽
            if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
                entity.polygon.outline = false;

                var newopt = {
                    "color": styleOpt.outlineColor,
                    "width": styleOpt.outlineWidth,
                    "opacity": styleOpt.outlineOpacity,
                    "lineType": "solid",
                    "outline": false
                };
                var polyline = (0, _AttrPolyline.style2Entity)(newopt);
                polyline.positions = entity.polygon.hierarchy._value.positions;
                this.dataSource.entities.add({
                    polyline: polyline
                });
            }

            //是建筑物时
            if (this.config.buildings) {
                var floor = Number(attr[this.config.buildings.cloumn] || 1); //层数
                var height = Number(this.config.buildings.height || 5); //层高

                entity.polygon.extrudedHeight = floor * height;
            }
        } else if (entity.polyline) {
            (0, _AttrPolyline.style2Entity)(styleOpt, entity.polyline);
        } else if (entity.billboard) {
            entity.billboard.heightReference = _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;

            (0, _AttrBillboard.style2Entity)(styleOpt, entity.billboard);

            //加上文字标签 
            if (styleOpt.label && styleOpt.label.field) {
                styleOpt.label.heightReference = _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;

                entity.label = (0, _AttrLabel.style2Entity)(styleOpt.label);
                entity.label.text = attr[styleOpt.label.field];
            }
        }
    }

});

exports.CustomFeatureGridLayer = CustomFeatureGridLayer;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};
    if (entityattr == null) {
        //默认值
        entityattr = {};
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
            case "scaleByDistance_near":
            case "scaleByDistance_nearValue":
            case "scaleByDistance_far":
            case "scaleByDistance_farValue":
            case "distanceDisplayCondition_far":
            case "distanceDisplayCondition_near":
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "color":
                //填充颜色
                entityattr.color = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
            case "scaleByDistance":
                //是否按视距缩放
                if (value) {
                    entityattr.scaleByDistance = new _Cesium2.default.NearFarScalar(Number(style.scaleByDistance_near || 1000), Number(style.scaleByDistance_nearValue || 1.0), Number(style.scaleByDistance_far || 1000000), Number(style.scaleByDistance_farValue || 0.1));
                } else {
                    entityattr.scaleByDistance = null;
                }
                break;
            case "distanceDisplayCondition":
                //是否按视距显示
                if (value) {
                    entityattr.distanceDisplayCondition = new _Cesium2.default.DistanceDisplayCondition(Number(style.distanceDisplayCondition_near || 0), Number(style.distanceDisplayCondition_far || 100000));
                } else {
                    entityattr.distanceDisplayCondition = null;
                }
                break;

            case "heightReference":
                switch (value) {
                    case "NONE":
                        entityattr.heightReference = _Cesium2.default.HeightReference.NONE;
                        break;
                    case "CLAMP_TO_GROUND":
                        entityattr.heightReference = _Cesium2.default.HeightReference.CLAMP_TO_GROUND;
                        break;
                    case "RELATIVE_TO_GROUND":
                        entityattr.heightReference = _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;
                        break;
                    default:
                        entityattr.heightReference = value;
                        break;
                }
                break;
        }
    }

    //无边框时，需设置宽度为0
    if (!style.outline) entityattr.outlineWidth = 0.0;

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return [entity.position.getValue()];
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: { type: "Point", coordinates: coordinates[0] }
    };
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Draw = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Events = __webpack_require__(57);

var _Tooltip = __webpack_require__(3);

var _util = __webpack_require__(4);

var util = _interopRequireWildcard(_util);

var _Util = __webpack_require__(2);

var DrawUtil = _interopRequireWildcard(_Util);

var _EventType = __webpack_require__(8);

var EventType = _interopRequireWildcard(_EventType);

var _Draw = __webpack_require__(20);

var _Draw2 = __webpack_require__(59);

var _Draw3 = __webpack_require__(60);

var _Draw4 = __webpack_require__(61);

var _Draw5 = __webpack_require__(9);

var _Draw6 = __webpack_require__(62);

var _Draw7 = __webpack_require__(64);

var _Draw8 = __webpack_require__(66);

var _Draw9 = __webpack_require__(69);

var _Draw10 = __webpack_require__(70);

var _Draw11 = __webpack_require__(72);

var _Draw12 = __webpack_require__(74);

var _Draw13 = __webpack_require__(76);

var _DrawP = __webpack_require__(78);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Draw = exports.Draw = _Events.Evented.extend({
    dataSource: null,
    primitives: null,
    drawCtrl: null,
    //初始化
    initialize: function initialize(viewer, options) {
        this.viewer = viewer;
        this.options = options || {};

        this.dataSource = new _Cesium2.default.CustomDataSource(); //用于entity
        this.viewer.dataSources.add(this.dataSource);

        this.primitives = new _Cesium2.default.PrimitiveCollection(); //用于primitive
        this.viewer.scene.primitives.add(this.primitives);

        if (_Cesium2.default.defaultValue(this.options.removeScreenSpaceEvent, true)) {
            this.viewer.screenSpaceEventHandler.removeInputAction(_Cesium2.default.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            this.viewer.screenSpaceEventHandler.removeInputAction(_Cesium2.default.ScreenSpaceEventType.LEFT_CLICK);
        }

        this.tooltip = new _Tooltip.Tooltip(this.viewer.container); //鼠标提示信息

        this.hasEdit(_Cesium2.default.defaultValue(this.options.hasEdit, true)); //是否可编辑

        //编辑工具初始化
        var _opts = {
            viewer: this.viewer,
            dataSource: this.dataSource,
            primitives: this.primitives,
            tooltip: this.tooltip
        };

        //entity
        this.drawCtrl = {};
        this.drawCtrl['point'] = new _Draw.DrawPoint(_opts);
        this.drawCtrl['billboard'] = new _Draw2.DrawBillboard(_opts);
        this.drawCtrl['label'] = new _Draw3.DrawLabel(_opts);
        this.drawCtrl['model'] = new _Draw4.DrawModel(_opts);

        this.drawCtrl['polyline'] = new _Draw5.DrawPolyline(_opts);
        this.drawCtrl['curve'] = new _Draw6.DrawCurve(_opts);
        this.drawCtrl['polylineVolume'] = new _Draw7.DrawPolylineVolume(_opts);
        this.drawCtrl['corridor'] = new _Draw8.DrawCorridor(_opts);

        this.drawCtrl['polygon'] = new _Draw9.DrawPolygon(_opts);
        this.drawCtrl['rectangle'] = new _Draw10.DrawRectangle(_opts);
        this.drawCtrl['ellipse'] = new _Draw11.DrawCircle(_opts);
        this.drawCtrl['circle'] = this.drawCtrl['ellipse']; //圆
        this.drawCtrl['ellipsoid'] = new _Draw12.DrawEllipsoid(_opts);
        this.drawCtrl['wall'] = new _Draw13.DrawWall(_opts);

        //primitive
        this.drawCtrl['model-p'] = new _DrawP.DrawPModel(_opts);

        //绑定事件抛出方法
        var that = this;
        for (var type in this.drawCtrl) {
            this.drawCtrl[type]._fire = function (type, data, propagate) {
                that.fire(type, data, propagate);
            };
        }

        //创建完成后激活编辑 
        this.on(EventType.DrawCreated, function (e) {
            this.startEditing(e.entity);
        }, this);
    },

    //==========绘制相关==========
    startDraw: function startDraw(attribute) {
        //参数是字符串id或uri时
        if (typeof attribute === 'string') {
            attribute = { type: attribute };
        } else {
            if (attribute == null || attribute.type == null) {
                console.error('需要传入指定绘制的type类型！');
                return;
            }
        }

        var type = attribute.type;
        if (this.drawCtrl[type] == null) {
            console.error('不能进行type为【' + type + '】的绘制，无该类型！');
            return;
        }

        var drawOkCalback;
        if (attribute.success) {
            drawOkCalback = attribute.success;
            delete attribute.success;
        }

        //赋默认值  
        attribute = DrawUtil.addGeoJsonDefVal(attribute);

        this.stopDraw();
        var entity = this.drawCtrl[type].activate(attribute, drawOkCalback);
        return entity;
    },
    stopDraw: function stopDraw() {
        this.stopEditing();
        for (var type in this.drawCtrl) {
            this.drawCtrl[type].disable(true);
        }
    },
    clearDraw: function clearDraw() {
        //删除所有
        this.stopDraw();
        this.dataSource.entities.removeAll();
        this.primitives.removeAll();
    },
    //==========编辑相关==========
    currEditFeature: null, //当前编辑的要素  
    getCurrentEntity: function getCurrentEntity() {
        return this.currEditFeature;
    },
    _hasEdit: null,
    hasEdit: function hasEdit(val) {
        if (this._hasEdit !== null && this._hasEdit === val) return;

        this._hasEdit = val;
        if (val) {
            this.bindSelectEvent();
        } else {
            this.stopEditing();
            this.destroySelectEvent();
        }
    },
    //绑定鼠标选中事件
    bindSelectEvent: function bindSelectEvent() {
        var _this = this;

        //选取对象
        var handler = new _Cesium2.default.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function (event) {
            var pickedObject = _this.viewer.scene.pick(event.position);
            if (_Cesium2.default.defined(pickedObject)) {
                var entity = pickedObject.id || pickedObject.primitive.id || pickedObject.primitive;
                if (entity && _this.isMyEntity(entity)) {
                    if (_this.currEditFeature && _this.currEditFeature === entity) return; //重复单击了跳出

                    if (!_Cesium2.default.defaultValue(entity.inProgress, false)) {
                        _this.startEditing(entity);
                        return;
                    }
                }
            }
            _this.stopEditing();
        }, _Cesium2.default.ScreenSpaceEventType.LEFT_CLICK);

        //编辑提示事件
        handler.setInputAction(function (event) {
            if (!_this._hasEdit) return;

            _this.tooltip.setVisible(false);

            var pickedObject = _this.viewer.scene.pick(event.endPosition);
            if (_Cesium2.default.defined(pickedObject)) {
                var entity = pickedObject.id || pickedObject.primitive.id || pickedObject.primitive;
                if (entity && entity.editing && !_Cesium2.default.defaultValue(entity.inProgress, false) && _this.isMyEntity(entity)) {
                    var tooltip = _this.tooltip;
                    setTimeout(function () {
                        //edit中的MOUSE_MOVE会关闭提示，延迟执行。
                        tooltip.showAt(event.endPosition, _Tooltip.message.edit.start);
                    }, 100);
                }
            }
        }, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);

        this.selectHandler = handler;
    },
    destroySelectEvent: function destroySelectEvent() {
        this.selectHandler && this.selectHandler.destroy();
        this.selectHandler = undefined;
    },
    startEditing: function startEditing(entity) {
        this.stopEditing();
        if (entity == null || !this._hasEdit) return;

        if (entity.editing && entity.editing.activate) {
            entity.editing.activate();
        }
        this.currEditFeature = entity;
    },
    stopEditing: function stopEditing() {
        if (this.currEditFeature && this.currEditFeature.editing && this.currEditFeature.editing.disable) {
            this.currEditFeature.editing.disable();
        }
        this.currEditFeature = null;
    },
    //修改了属性
    updateAttribute: function updateAttribute(attribute, entity) {
        if (entity == null) entity = this.currEditFeature;
        if (entity == null || attribute == null) return;

        attribute.style = attribute.style || {};
        attribute.attr = attribute.attr || {};

        //更新属性
        var type = entity.attribute.type;
        this.drawCtrl[type].style2Entity(attribute.style, entity);
        entity.attribute = attribute;

        //如果在编辑状态，更新绑定的拖拽点
        if (entity.editing) {
            if (entity.editing.updateAttrForEditing) entity.editing.updateAttrForEditing();

            if (entity.editing.updateDraggers) entity.editing.updateDraggers();
        }

        //名称 绑定到tooltip 
        if (this.options.nameTooltip) {
            var that = this;
            if (entity.attribute.attr && entity.attribute.attr.name) {
                entity.tooltip = {
                    html: entity.attribute.attr.name,
                    check: function check() {
                        return !that._hasEdit;
                    }
                };
            } else {
                entity.tooltip = null;
            }
        }
        return entity;
    },
    //修改坐标、高程
    setPositions: function setPositions(positions, entity) {
        if (entity == null) entity = this.currEditFeature;
        if (entity == null || positions == null) return;

        //如果在编辑状态，更新绑定的拖拽点
        if (entity.editing) {
            entity.editing.setPositions(positions);
            entity.editing.updateDraggers();
        }
        return entity;
    },

    //==========删除相关==========

    //删除单个
    deleteEntity: function deleteEntity(entity) {
        if (entity == null) entity = this.currEditFeature;
        if (entity == null) return;

        if (entity.editing) {
            entity.editing.disable();
        }
        if (this.dataSource.entities.contains(entity)) this.dataSource.entities.remove(entity);

        if (this.primitives.contains(entity)) this.primitives.remove(entity);
    },
    //是否为当前编辑器编辑的标号
    isMyEntity: function isMyEntity(entity) {
        if (this.dataSource.entities.contains(entity)) return true;
        if (this.primitives.contains(entity)) return true;
        return false;
    },
    //删除所有
    deleteAll: function deleteAll() {
        this.clearDraw();
    },
    //==========转换GeoJSON==========
    //转换当前所有为geojson
    toGeoJSON: function toGeoJSON(entity) {
        this.stopDraw();

        if (entity == null) {
            //全部数据 
            var arrEntity = this.getEntitys();
            if (arrEntity.length == 0) return null;

            var features = [];
            for (var i = 0, len = arrEntity.length; i < len; i++) {
                var entity = arrEntity[i];
                if (entity.attribute == null || entity.attribute.type == null) continue;

                var type = entity.attribute.type;
                var geojson = this.drawCtrl[type].toGeoJSON(entity);
                if (geojson == null) continue;
                geojson = DrawUtil.removeGeoJsonDefVal(geojson);

                features.push(geojson);
            }
            if (features.length > 0) return { type: "FeatureCollection", features: features };else return null;
        } else {
            var type = entity.attribute.type;
            var geojson = this.drawCtrl[type].toGeoJSON(entity);
            geojson = DrawUtil.removeGeoJsonDefVal(geojson);
            return geojson;
        }
    },
    //加载goejson数据
    jsonToEntity: function jsonToEntity(json, isClear, isFly) {
        var jsonObjs = json;
        try {
            if (util.isString(json)) jsonObjs = JSON.parse(json);
        } catch (e) {
            util.alert(e.name + ": " + e.message + " \n请确认json文件格式正确!!!");
            return;
        }

        if (isClear) {
            this.clearDraw();
        }
        var arrthis = [];
        var jsonFeatures = jsonObjs.features ? jsonObjs.features : [jsonObjs];

        for (var i = 0, len = jsonFeatures.length; i < len; i++) {
            var feature = jsonFeatures[i];

            if (!feature.properties || !feature.properties.type) {
                //非本身保存的外部其他geojson数据
                feature.properties = feature.properties || {};
                switch (feature.geometry.type) {
                    case "MultiPolygon":
                    case "Polygon":
                        feature.properties.type = "polygon";
                        break;
                    case "MultiLineString":
                    case "LineString":
                        feature.properties.type = "polyline";
                        break;
                    case "MultiPoint":
                    case "Point":
                        feature.properties.type = "point";
                        break;
                }
            }

            var type = feature.properties.type;
            if (this.drawCtrl[type] == null) {
                console.log('数据无法识别或者数据的[' + type + ']类型参数有误');
                continue;
            }
            feature.properties.style = feature.properties.style || {};

            //赋默认值  
            feature.properties = DrawUtil.addGeoJsonDefVal(feature.properties);

            var entity = this.drawCtrl[type].jsonToEntity(feature);

            //名称 绑定到tooltip
            if (this.options.nameTooltip) {
                if (entity.attribute.attr && entity.attribute.attr.name) {
                    var that = this;
                    entity.tooltip = {
                        html: entity.attribute.attr.name,
                        check: function check() {
                            return !that._hasEdit;
                        }
                    };
                } else {
                    entity.tooltip = null;
                }
            }

            arrthis.push(entity);
        }

        if (isFly) this.viewer.flyTo(arrthis);

        return arrthis;
    },
    //属性转entity
    attributeToEntity: function attributeToEntity(attribute, positions) {
        return this.drawCtrl[attribute.type].attributeToEntity(attribute, positions);
    },
    //绑定外部entity到标绘
    bindExtraEntity: function bindExtraEntity(entity, attribute) {
        var entity = this.drawCtrl[attribute.type].attributeToEntity(entity, attribute);
        this.dataSource.entities.add(entity);
    },
    //==========对外接口==========
    _visible: true,
    setVisible: function setVisible(visible) {
        this._visible = visible;
        if (visible) {
            if (!this.viewer.dataSources.contains(this.dataSource)) this.viewer.dataSources.add(this.dataSource);

            if (!this.viewer.scene.primitives.contains(this.primitives)) this.viewer.scene.primitives.add(this.primitives);
        } else {
            this.stopDraw();
            if (this.viewer.dataSources.contains(this.dataSource)) this.viewer.dataSources.remove(this.dataSource, false);

            if (this.viewer.scene.primitives.contains(this.dataSource)) this.viewer.scene.primitives.remove(this.primitives);
        }
    },
    //是否存在绘制
    hasDraw: function hasDraw() {
        return this.getEntitys().length > 0;
    },
    //获取所有绘制的实体对象列表
    getEntitys: function getEntitys() {
        this.stopDraw();

        var arr = this.dataSource.entities.values;
        arr = arr.concat(this.primitives._primitives);
        return arr;
    },
    getDataSource: function getDataSource() {
        return this.dataSource;
    },
    getEntityById: function getEntityById(id) {
        var arrEntity = this.getEntitys();
        for (var i = 0, len = arrEntity.length; i < len; i++) {
            var entity = arrEntity[i];
            if (id == entity.attribute.attr.id) {
                return entity;
            }
        }
        return null;
    },
    //获取实体的经纬度值 坐标数组
    getCoordinates: function getCoordinates(entity) {
        var type = entity.attribute.type;
        var coor = this.drawCtrl[type].getCoordinates(entity);
        return coor;
    },
    //获取实体的坐标数组
    getPositions: function getPositions(entity) {
        var type = entity.attribute.type;
        var positions = this.drawCtrl[type].getPositions(entity);
        return positions;
    },

    destroy: function destroy() {
        this.stopDraw();
        this.hasEdit(false);
        this.clearDraw();
        if (this.viewer.dataSources.contains(this.dataSource)) this.viewer.dataSources.remove(this.dataSource, true);
    }
});

//绑定到draw，方便外部使用
Draw.Point = _Draw.DrawPoint;
Draw.Billboard = _Draw2.DrawBillboard;
Draw.Label = _Draw3.DrawLabel;
Draw.Model = _Draw4.DrawModel;

Draw.Polyline = _Draw5.DrawPolyline;
Draw.Curve = _Draw6.DrawCurve;
Draw.PolylineVolume = _Draw7.DrawPolylineVolume;
Draw.Polygon = _Draw9.DrawPolygon;
Draw.Rectangle = _Draw10.DrawRectangle;
Draw.Circle = _Draw11.DrawCircle;
Draw.Ellipsoid = _Draw12.DrawEllipsoid;
Draw.Wall = _Draw13.DrawWall;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawBase = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _point = __webpack_require__(1);

var _Class = __webpack_require__(10);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

var _EventType = __webpack_require__(8);

var EventType = _interopRequireWildcard(_EventType);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawBase = exports.DrawBase = _Class.Class.extend({
    type: null,
    dataSource: null,
    initialize: function initialize(opts) {
        this.viewer = opts.viewer;
        this.dataSource = opts.dataSource;
        this.primitives = opts.primitives;

        if (!this.dataSource) {
            //没有单独指定Cesium.CustomDataSource时
            this.dataSource = new _Cesium2.default.CustomDataSource();
            viewer.dataSources.add(this.dataSource);
        }
        this.tooltip = opts.tooltip || new Tooltip(this.viewer.container);
    },
    fire: function fire(type, data, propagate) {
        if (this._fire) this._fire(type, data, propagate);
    },
    formatNum: function formatNum(num, digits) {
        return Util.formatNum(num, digits);
    },
    //激活绘制
    activate: function activate(attribute, drawOkCalback) {
        if (this._enabled) {
            return this;
        }
        this._enabled = true;
        this.drawOkCalback = drawOkCalback;

        this.createFeature(attribute);
        this.entity.inProgress = true;

        this.setCursor(true);
        this.bindEvent();

        this.fire(EventType.DrawStart, { drawtype: this.type, entity: this.entity });

        return this.entity;
    },
    //释放绘制
    disable: function disable(hasWB) {
        if (!this._enabled) {
            return this;
        }
        this._enabled = false;

        this.setCursor(false);

        if (hasWB && this.entity.inProgress) {
            //外部释放时，尚未结束的标绘移除。
            if (this.dataSource && this.dataSource.entities.contains(this.entity)) this.dataSource.entities.remove(this.entity);

            if (this.primitives && this.primitives.contains(this.entity)) this.primitives.remove(this.entity);
        } else {
            this.entity.inProgress = false;
            this.finish();

            if (this.drawOkCalback) {
                this.drawOkCalback(this.entity);
                delete this.drawOkCalback;
            }
            this.fire(EventType.DrawCreated, { drawtype: this.type, entity: this.entity });
        }

        this.destroyHandler();
        this._positions_draw = null;
        this.entity = null;
        this.tooltip.setVisible(false);

        return this;
    },
    createFeature: function createFeature(attribute) {},
    //============= 事件相关 ============= 
    getHandler: function getHandler() {
        if (!this.handler || this.handler.isDestroyed()) {
            this.handler = new _Cesium2.default.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        }
        return this.handler;
    },
    destroyHandler: function destroyHandler() {
        this.handler && this.handler.destroy();
        this.handler = undefined;
    },
    setCursor: function setCursor(val) {
        this.viewer._container.style.cursor = val ? 'crosshair' : '';
    },
    //绑定鼠标事件
    bindEvent: function bindEvent() {},
    //坐标位置相关
    _positions_draw: null,
    getDrawPosition: function getDrawPosition() {
        return this._positions_draw;
    },
    //绑定属性到编辑对象  
    _bindEdit: function _bindEdit(_edit) {
        _edit._fire = this._fire;
        _edit.tooltip = this.tooltip;
        return _edit;
    },
    //更新坐标后调用下，更新相关属性，子类使用
    updateAttrForDrawing: function updateAttrForDrawing() {},
    //图形绘制结束后调用
    finish: function finish() {},
    //通用方法
    getCoordinates: function getCoordinates(entity) {
        return this.getAttrClass().getCoordinates(entity);
    },
    getPositions: function getPositions(entity) {
        return this.getAttrClass().getPositions(entity);
    },
    toGeoJSON: function toGeoJSON(entity) {
        return this.getAttrClass().toGeoJSON(entity);
    },
    //属性转entity
    attributeToEntity: function attributeToEntity(attribute, positions) {
        var entity = this.createFeature(attribute);
        this._positions_draw = positions;
        this.updateAttrForDrawing(true);
        this.finish();
        return entity;
    },
    //geojson转entity
    jsonToEntity: function jsonToEntity(geojson) {
        var attribute = geojson.properties;
        var positions = Util.getPositionByGeoJSON(geojson);
        return this.attributeToEntity(attribute, positions);
    },
    //绑定外部entity到标绘
    bindExtraEntity: function bindExtraEntity(entity, attribute) {
        if (attribute && attribute.style) this.style2Entity(attribute.style, entity);

        this._positions_draw = this.getPositions(entity);
        this.updateAttrForDrawing(true);
        this.finish();
        return entity;
    }

});

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};

    if (entityattr == null) {
        //默认值
        entityattr = {};
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "silhouette": //跳过扩展其他属性的参数
            case "silhouetteColor":
            case "silhouetteAlpha":
            case "silhouetteSize":
            case "fill":
            case "color":
            case "opacity":
                break;
            case "modelUrl":
                //模型uri
                entityattr.uri = value;
                break;

            case "heightReference":
                switch (value) {
                    case "NONE":
                        entityattr.heightReference = _Cesium2.default.HeightReference.NONE;
                        break;
                    case "CLAMP_TO_GROUND":
                        entityattr.heightReference = _Cesium2.default.HeightReference.CLAMP_TO_GROUND;
                        break;
                    case "RELATIVE_TO_GROUND":
                        entityattr.heightReference = _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;
                        break;
                    default:
                        entityattr.heightReference = value;
                        break;
                }
                break;
        }
    }

    //轮廓
    if (style.silhouette) {
        entityattr.silhouetteColor = new _Cesium2.default.Color.fromCssColorString(style.silhouetteColor || "#FFFFFF").withAlpha(Number(style.silhouetteAlpha || 1.0));
        entityattr.silhouetteSize = Number(style.silhouetteSize || 1.0);
    } else entityattr.silhouetteSize = 0.0;

    //透明度、颜色
    var opacity = style.hasOwnProperty('opacity') ? Number(style.opacity) : 1;
    if (style.fill) entityattr.color = new _Cesium2.default.Color.fromCssColorString(style.color || "#FFFFFF").withAlpha(opacity);else entityattr.color = new _Cesium2.default.Color.fromCssColorString("#FFFFFF").withAlpha(opacity);

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    var position = entity.position;
    if (position && position.getValue) position = position.getValue();

    return [position];
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: { type: "Point", coordinates: coordinates[0] }
    };
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPolygon = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _EditPolyline = __webpack_require__(14);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditPolygon = exports.EditPolygon = _EditPolyline.EditPolyline.extend({
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        var that = this;
        this._positions_draw = this.entity._positions_draw || this.entity.polygon.hierarchy.getValue();
        //this.entity.polygon.hierarchy  = new Cesium.CallbackProperty(function (time) {
        //    return that.getPosition();
        //}, false);
    },
    //图形编辑结束后调用
    finish: function finish() {
        //this.entity.polygon.hierarchy = this.getPosition();
        this.entity._positions_draw = this.getPosition();
    },
    isClampToGround: function isClampToGround() {
        return this.entity.attribute.style.hasOwnProperty('clampToGround') ? this.entity.attribute.style.clampToGround : !this.entity.attribute.style.perPositionHeight;
    },
    bindDraggers: function bindDraggers() {
        var that = this;

        var positions = this.getPosition();
        var hasMidPoint = positions.length < this._maxPointNum; //是否有新增点

        var clampToGround = this.isClampToGround();

        for (var i = 0, len = positions.length; i < len; i++) {
            var loc = positions[i];

            if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                loc = (0, _point.updateHeightForClampToGround)(loc);
                positions[i] = loc;
            }

            //各顶点
            var dragger = draggerCtl.createDragger(this.dataSource, {
                position: loc,
                //clampToGround: clampToGround,
                onDrag: function onDrag(dragger, position) {
                    positions[dragger.index] = position;

                    //============高度调整拖拽点处理=============
                    if (that.heightDraggers && that.heightDraggers.length > 0) {
                        var extrudedHeight = that.entity.polygon.extrudedHeight.getValue();
                        that.heightDraggers[dragger.index].position = (0, _point.setPositionsHeight)(position, extrudedHeight);
                    }

                    //============新增点拖拽点处理=============
                    if (hasMidPoint) {
                        var draggersIdx;
                        var nextPositionIdx;
                        //与前一个点之间的中点 
                        if (dragger.index == 0) {
                            draggersIdx = len * 2 - 1;
                            nextPositionIdx = len - 1;
                        } else {
                            draggersIdx = dragger.index * 2 - 1;
                            nextPositionIdx = dragger.index - 1;
                        }
                        var midpoint = _Cesium2.default.Cartesian3.midpoint(position, positions[nextPositionIdx], new _Cesium2.default.Cartesian3());
                        if (clampToGround) {
                            //贴地时求贴模型和贴地的高度 
                            midpoint = (0, _point.updateHeightForClampToGround)(midpoint);
                        }
                        that.draggers[draggersIdx].position = midpoint;

                        //与后一个点之间的中点 
                        if (dragger.index == len - 1) {
                            draggersIdx = dragger.index * 2 + 1;
                            nextPositionIdx = 0;
                        } else {
                            draggersIdx = dragger.index * 2 + 1;
                            nextPositionIdx = dragger.index + 1;
                        }
                        var midpoint = _Cesium2.default.Cartesian3.midpoint(position, positions[nextPositionIdx], new _Cesium2.default.Cartesian3());
                        if (clampToGround) {
                            //贴地时求贴模型和贴地的高度 
                            midpoint = (0, _point.updateHeightForClampToGround)(midpoint);
                        }
                        that.draggers[draggersIdx].position = midpoint;
                    }
                }
            });
            dragger.index = i;
            this.draggers.push(dragger);

            //中间点，拖动后新增点
            if (hasMidPoint) {
                var nextIndex = (i + 1) % len;
                var midpoint = _Cesium2.default.Cartesian3.midpoint(loc, positions[nextIndex], new _Cesium2.default.Cartesian3());

                if (clampToGround) {
                    //贴地时求贴模型和贴地的高度 
                    midpoint = (0, _point.updateHeightForClampToGround)(midpoint);
                }

                var draggerMid = draggerCtl.createDragger(this.dataSource, {
                    position: midpoint,
                    type: draggerCtl.PointType.AddMidPoint,
                    tooltip: _Tooltip.message.dragger.addMidPoint,
                    //clampToGround: clampToGround,
                    onDragStart: function onDragStart(dragger, position) {
                        positions.splice(dragger.index, 0, position); //插入点 
                    },
                    onDrag: function onDrag(dragger, position) {
                        positions[dragger.index] = position;
                    },
                    onDragEnd: function onDragEnd(dragger, position) {
                        that.updateDraggers();
                    }
                });
                draggerMid.index = nextIndex;
                this.draggers.push(draggerMid);
            }
        }

        //创建高程拖拽点
        if (this.entity.polygon.extrudedHeight) this.bindHeightDraggers(this.entity.polygon);
    },
    //高度调整拖拽点
    heightDraggers: null,
    bindHeightDraggers: function bindHeightDraggers(polygon, positions) {
        var that = this;

        this.heightDraggers = [];

        positions = positions || this.getPosition();
        var extrudedHeight = polygon.extrudedHeight.getValue();

        for (var i = 0, len = positions.length; i < len; i++) {
            var loc = positions[i];
            loc = (0, _point.setPositionsHeight)(loc, extrudedHeight);

            var dragger = draggerCtl.createDragger(this.dataSource, {
                position: loc,
                type: draggerCtl.PointType.MoveHeight,
                tooltip: _Tooltip.message.dragger.moveHeight,
                onDrag: function onDrag(dragger, position) {
                    var thisHeight = _Cesium2.default.Cartographic.fromCartesian(position).height;
                    polygon.extrudedHeight = thisHeight;

                    var maxHeight = (0, _point.getMaxHeight)(that.getPosition());
                    that.entity.attribute.style.extrudedHeight = that.formatNum(thisHeight - maxHeight, 2);

                    that.updateHeightDraggers(thisHeight);
                }
            });

            this.draggers.push(dragger);
            this.heightDraggers.push(dragger);
        }
    },
    updateHeightDraggers: function updateHeightDraggers(extrudedHeight) {
        for (var i = 0; i < this.heightDraggers.length; i++) {
            var heightDragger = this.heightDraggers[i];

            var position = (0, _point.setPositionsHeight)(heightDragger.position.getValue(), extrudedHeight);
            heightDragger.position.setValue(position);
        }
    }

});

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};
    if (entityattr == null) {
        //默认值 
        entityattr = {
            fill: true
        };
    }
    //贴地时，剔除高度相关属性
    if (style.clampToGround) {
        if (style.hasOwnProperty('height')) delete style.height;
        if (style.hasOwnProperty('extrudedHeight')) delete style.extrudedHeight;
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];

        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "color":
                //填充颜色
                entityattr.material = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
            case "rotation":
                //旋转角度
                entityattr.rotation = _Cesium2.default.Math.toRadians(value);
                break;
            case "height":
                entityattr.height = Number(value);
                if (style.extrudedHeight) entityattr.extrudedHeight = Number(style.extrudedHeight) + Number(value);
                break;
            case "extrudedHeight":
                entityattr.extrudedHeight = Number(entityattr.height || style.height || 0) + Number(value);
                break;
            case "radius":
                //半径（圆）
                entityattr.semiMinorAxis = Number(value);
                entityattr.semiMajorAxis = Number(value);
                break;

        }
    }

    //如果未设置任何material，设置默认颜色
    if (entityattr.material == null) {
        entityattr.material = _Cesium2.default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: Number(style.opacity || 1.0)
        });
    }

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return [entity.position.getValue()];
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: { type: "Point", coordinates: coordinates[0] }
    };
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TileLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _BaseLayer = __webpack_require__(7);

var _layer = __webpack_require__(22);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TileLayer = _BaseLayer.BaseLayer.extend({
    layer: null,
    //添加 
    add: function add() {
        if (this.layer != null) {
            this.remove();
        }
        this.addEx();
        var imageryProvider = this.createImageryProvider(this.config);
        if (imageryProvider == null) return;

        var options = this.config;

        var imageryOpt = {
            show: true, alpha: this._opacity
        };
        if (options.rectangle && options.rectangle.xmin && options.rectangle.xmax && options.rectangle.ymin && options.rectangle.ymax) {
            var xmin = options.rectangle.xmin;
            var xmax = options.rectangle.xmax;
            var ymin = options.rectangle.ymin;
            var ymax = options.rectangle.ymax;
            var rectangle = _Cesium2.default.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
            this.rectangle = rectangle;
            imageryOpt.rectangle = rectangle;
        }
        if (options.brightness) imageryOpt.brightness = options.brightness;
        if (options.contrast) imageryOpt.contrast = options.contrast;
        if (options.hue) imageryOpt.hue = options.hue;
        if (options.saturation) imageryOpt.saturation = options.saturation;
        if (options.gamma) imageryOpt.gamma = options.gamma;
        if (options.maximumAnisotropy) imageryOpt.maximumAnisotropy = options.maximumAnisotropy;
        if (options.minimumTerrainLevel) imageryOpt.minimumTerrainLevel = options.minimumTerrainLevel;
        if (options.maximumTerrainLevel) imageryOpt.maximumTerrainLevel = options.maximumTerrainLevel;

        this.layer = new _Cesium2.default.ImageryLayer(imageryProvider, imageryOpt);
        this.layer.config = this.config;

        this.viewer.imageryLayers.add(this.layer);

        this.setZIndex(this.config.order);
    },
    //方便外部继承覆盖该方法
    createImageryProvider: function createImageryProvider(config) {
        return (0, _layer.createImageryProvider)(config); //调用layer.js
    },
    addEx: function addEx() {
        //子类使用

    },
    //移除
    remove: function remove() {
        if (this.layer == null) return;

        this.removeEx();
        this.viewer.imageryLayers.remove(this.layer, true);
        this.layer = null;
    },
    removeEx: function removeEx() {
        //子类使用

    },
    //定位至数据区域
    centerAt: function centerAt(duration) {
        if (this.layer == null) return;

        if (this.config.extent || this.config.center) {
            this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
        } else if (this.rectangle) {
            this.viewer.camera.flyTo({
                destination: this.rectangle,
                duration: duration
            });
        } else {
            var rectangle = this.layer.imageryProvider.rectangle; //arcgis图层等，读取配置信息
            if (rectangle && rectangle != _Cesium2.default.Rectangle.MAX_VALUE && rectangle.west > 0 && rectangle.south > 0 && rectangle.east > 0 && rectangle.north > 0) {
                this.viewer.camera.flyTo({
                    destination: rectangle,
                    duration: duration
                });
            }
        }
    },
    //设置透明度
    hasOpacity: true,
    _opacity: 1,
    setOpacity: function setOpacity(value) {
        this._opacity = value;
        if (this.layer == null) return;

        this.layer.alpha = value;
    },
    //设置叠加顺序
    hasZIndex: true,
    setZIndex: function setZIndex(order) {
        if (this.layer == null || order == null) return;

        //先移动到最顶层
        this.viewer.imageryLayers.raiseToTop(this.layer);

        var layers = this.viewer.imageryLayers._layers;
        for (var i = layers.length - 1; i >= 0; i--) {
            if (layers[i] == this.layer) continue;
            var _temp = layers[i].config;
            if (_temp && _temp.order) {
                if (order < _temp.order) {
                    this.viewer.imageryLayers.lower(this.layer);
                }
            }
        }
    }

});

exports.TileLayer = TileLayer;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};
    if (entityattr == null) {
        //默认值
        entityattr = {};
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
            case "radius":
            case "shape":
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "color":
                //填充颜色
                entityattr.material = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
        }
    }

    //管道样式 
    style.radius = style.radius || 10;
    switch (style.shape) {
        default:
        case "pipeline":
            entityattr.shape = getCorridorShape1(style.radius); //（厚度固定为半径的1/3）
            break;
        case "circle":
            entityattr.shape = getCorridorShape2(style.radius);
            break;
        case "star":
            entityattr.shape = getCorridorShape3(style.radius);
            break;
    }

    return entityattr;
}

//管道形状1【内空管道】 radius整个管道的外半径 
function getCorridorShape1(radius) {
    var hd = radius / 3;
    var startAngle = 0;
    var endAngle = 360;

    var pss = [];
    for (var i = startAngle; i <= endAngle; i++) {
        var radians = _Cesium2.default.Math.toRadians(i);
        pss.push(new _Cesium2.default.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    for (var i = endAngle; i >= startAngle; i--) {
        var radians = _Cesium2.default.Math.toRadians(i);
        pss.push(new _Cesium2.default.Cartesian2((radius - hd) * Math.cos(radians), (radius - hd) * Math.sin(radians)));
    }
    return pss;
}

//管道形状2【圆柱体】 radius整个管道的外半径 
function getCorridorShape2(radius) {
    var startAngle = 0;
    var endAngle = 360;

    var pss = [];
    for (var i = startAngle; i <= endAngle; i++) {
        var radians = _Cesium2.default.Math.toRadians(i);
        pss.push(new _Cesium2.default.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    return pss;
}

//管道形状3【星状】 radius整个管道的外半径 ,arms星角的个数（默认6个角）
function getCorridorShape3(radius, arms) {
    var arms = arms || 6;
    var angle = Math.PI / arms;
    var length = 2 * arms;
    var pss = new Array(length);
    for (var i = 0; i < length; i++) {
        var r = i % 2 === 0 ? radius : radius / 3;
        pss[i] = new _Cesium2.default.Cartesian2(Math.cos(i * angle) * r, Math.sin(i * angle) * r);
    }
    return pss;
}

//获取entity的坐标
function getPositions(entity) {
    if (entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw; //取绑定的数据

    return entity.polylineVolume.positions.getValue();
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: {
            type: "LineString",
            coordinates: coordinates
        }
    };
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};
    if (entityattr == null) {
        //默认值 
        entityattr = {
            fill: true
        };
    }

    //贴地时，剔除高度相关属性
    if (style.clampToGround) {
        if (style.hasOwnProperty('height')) delete style.height;
        if (style.hasOwnProperty('extrudedHeight')) delete style.extrudedHeight;
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "height":
                entityattr.height = Number(value);
                if (style.extrudedHeight) entityattr.extrudedHeight = Number(style.extrudedHeight) + Number(value);
                break;
            case "extrudedHeight":
                entityattr.extrudedHeight = Number(entityattr.height || style.height || 0) + Number(value);
                break;
            case "color":
                //填充颜色
                entityattr.material = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
            case "image":
                //填充图片
                entityattr.material = new _Cesium2.default.ImageMaterialProperty({
                    image: style.image,
                    color: new _Cesium2.default.Color.fromCssColorString("#FFFFFF").withAlpha(Number(style.opacity || 1.0))
                });
                break;
            case "rotation":
                //旋转角度 
                entityattr.rotation = _Cesium2.default.Math.toRadians(value);
                if (!style.stRotation) entityattr.stRotation = _Cesium2.default.Math.toRadians(value);
                break;
            case "stRotation":
                entityattr.stRotation = _Cesium2.default.Math.toRadians(value);
                break;
        }
    }

    //如果未设置任何material，设置默认颜色
    if (entityattr.material == null) {
        entityattr.material = _Cesium2.default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: Number(style.opacity || 1.0)
        });
    }

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    if (entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw;

    var re = entity.rectangle.coordinates.getValue(); //Rectangle
    var height = entity.rectangle.height ? entity.rectangle.height.getValue() : 0;

    var pt1 = _Cesium2.default.Cartesian3.fromRadians(re.west, re.south, height);
    var pt2 = _Cesium2.default.Cartesian3.fromRadians(re.east, re.north, height);
    return [pt1, pt2];
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);

    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: {
            type: "MultiPoint",
            coordinates: coordinates
        }
    };
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
//椭球体
function style2Entity(style, entityattr) {
    style = style || {};
    if (entityattr == null) {
        //默认值 
        entityattr = {
            fill: true
        };
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
            case "widthRadii":
            case "heightRadii":
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "color":
                //填充颜色
                entityattr.material = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
            case "extentRadii":
                //球体长宽高半径
                var extentRadii = style.extentRadii || 100;
                var widthRadii = style.widthRadii || 100;
                var heightRadii = style.heightRadii || 100;
                entityattr.radii = new _Cesium2.default.Cartesian3(extentRadii, widthRadii, heightRadii);
                break;
        }
    }

    //如果未设置任何material，设置默认颜色
    if (entityattr.material == null) {
        entityattr.material = _Cesium2.default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: Number(style.opacity || 1.0)
        });
    }

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return [entity.position.getValue()];
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: { type: "Point", coordinates: coordinates[0] }
    };
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};

    if (!entityattr) {
        entityattr = {
            fill: true
        };
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "color":
                //填充颜色
                entityattr.material = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
        }
    }

    //如果未设置任何material，设置默认颜色
    if (entityattr.material == null) {
        entityattr.material = _Cesium2.default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: Number(style.opacity || 1.0)
        });
    }

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return entity.wall.positions.getValue();
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: {
            type: "LineString",
            coordinates: coordinates
        }
    };
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBasePath = exports.getCacheVersion = exports.getDefWindowOptions = exports.bindClass = exports.removeDebugeBar = exports.getClass = exports.getWidget = exports.eachWidget = exports.disableGroup = exports.disableAll = exports.disable = exports.activate = exports.isActivate = exports.init = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _loader = __webpack_require__(36);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//widget模块公共处理类，勿轻易修改


var basePath = ""; //widgets目录统一前缀，如果widgets目录不在当前页面的同级目录，在其他处时可以传入basePath参数，参数值为：widgets目录相对于当前页面的路径
var defoptions;
var cacheVersion;
var isdebuger;

var thismap;
var widgetsdata = [];

//初始化插件
function init(map, widgetcfg, _basePath) {
    thismap = map;
    widgetcfg = widgetcfg || {};
    basePath = _basePath || "";

    widgetsdata = [];
    defoptions = widgetcfg.defaultOptions || { "windowOptions": { "position": "rt", "maxmin": false, "resize": true }, "autoDisable": true, "disableOhter": true };

    cacheVersion = widgetcfg.version;
    if (cacheVersion == "time") cacheVersion = new Date().getTime();

    //将自启动的加入
    var arrtemp = widgetcfg.widgetsAtStart;
    if (arrtemp && arrtemp.length > 0) {
        for (var i = 0; i < arrtemp.length; i++) {
            var item = arrtemp[i];
            if (!item.hasOwnProperty("uri") || item.uri == "") {
                console.log('widget未配置uri：' + JSON.stringify(item));
                continue;
            }
            if (item.hasOwnProperty("visible") && !item.visible) continue;

            item.autoDisable = false;
            item.openAtStart = true;
            item._nodebug = true;

            bindDefOptions(item);
            widgetsdata.push(item);
        }
    }

    //显示测试栏
    //为了方便测试，所有widget会在页面下侧生成一排按钮，每个按钮对应一个widget，单击后激活对应widget
    isdebuger = widgetcfg["debugger"];
    if (isdebuger) {
        var inhtml = '<div id="widget-testbar" class="widgetbar animation-slide-bottom no-print-view" > ' + '     <div style="height: 30px; line-height:30px;"><b style="color: #4db3ff;">widget测试栏</b>&nbsp;&nbsp;<button  id="widget-testbar-remove"  type="button" class="btn btn-link btn-xs">关闭</button> </div>' + '     <button id="widget-testbar-disableAll" type="button" class="btn btn-info" ><i class="fa fa-globe"></i>漫游</button>' + '</div>';
        (0, _jquery2.default)("body").append(inhtml);

        (0, _jquery2.default)("#widget-testbar-remove").click(function (e) {
            removeDebugeBar();
        });
        (0, _jquery2.default)("#widget-testbar-disableAll").click(function (e) {
            disableAll();
        });
    }

    //将配置的加入
    arrtemp = widgetcfg.widgets;
    if (arrtemp && arrtemp.length > 0) {
        for (var i = 0; i < arrtemp.length; i++) {
            var item = arrtemp[i];
            if (item.type == "group") {
                var inhtml = ' <div class="btn-group dropup">  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-align-justify"></i>' + item.name + ' <span class="caret"></span></button> <ul class="dropdown-menu">';
                for (var j = 0; j < item.children.length; j++) {
                    var childItem = item.children[j];
                    if (!childItem.hasOwnProperty("uri") || childItem.uri == "") {
                        console.log('widget未配置uri：' + JSON.stringify(childItem));
                        continue;
                    }

                    inhtml += ' <li data-widget="' + childItem.uri + '" class="widget-btn" ><a href="#"><i class="fa fa-star"></i>' + childItem.name + '</a></li>';

                    bindDefOptions(childItem);
                    widgetsdata.push(childItem); //将配置的加入
                }
                inhtml += "</ul></div>";

                if (isdebuger && !item._nodebug) {
                    (0, _jquery2.default)("#widget-testbar").append(inhtml);
                }
            } else {
                if (!item.hasOwnProperty("uri") || item.uri == "") {
                    console.log('widget未配置uri：' + JSON.stringify(item));
                    continue;
                }

                //显示测试栏 
                if (isdebuger && !item._nodebug) {
                    var inhtml = '<button type="button" class="btn btn-primary widget-btn" data-widget="' + item.uri + '"  > <i class="fa fa-globe"></i>' + item.name + ' </button>';
                    (0, _jquery2.default)("#widget-testbar").append(inhtml);
                }

                bindDefOptions(item);
                widgetsdata.push(item); //将配置的加入
            }
        }

        if (isdebuger) {
            (0, _jquery2.default)("#widget-testbar .widget-btn").each(function () {
                (0, _jquery2.default)(this).click(function (e) {
                    var uri = (0, _jquery2.default)(this).attr('data-widget');
                    if (uri == null || uri == "") return;

                    if (isActivate(uri)) {
                        disable(uri);
                    } else {
                        activate(uri);
                    }
                });
            });
        }
    }

    for (var i = 0; i < widgetsdata.length; i++) {
        var item = widgetsdata[i];

        if (item.openAtStart || item.createAtStart) {
            _arrLoadWidget.push(item);
        }
    }

    (0, _jquery2.default)(window).resize(function () {
        for (var i = 0; i < widgetsdata.length; i++) {
            var item = widgetsdata[i];
            if (item._class) {
                item._class.indexResize(); //BaseWidget: indexResize
            }
        }
    });

    loadWidgetJs();
}

function getDefWindowOptions() {
    return clone(defoptions.windowOptions);
}

function clone(from, to) {
    if (from == null || (typeof from === 'undefined' ? 'undefined' : _typeof(from)) != "object") return from;
    if (from.constructor != Object && from.constructor != Array) return from;
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function || from.constructor == String || from.constructor == Number || from.constructor == Boolean) return new from.constructor(from);

    to = to || new from.constructor();

    for (var name in from) {
        to[name] = typeof to[name] == "undefined" ? clone(from[name], null) : to[name];
    }

    return to;
}

function bindDefOptions(item) {
    //赋默认值至options（跳过已存在设置值） 
    if (defoptions) {
        for (var aa in defoptions) {
            if (aa == "windowOptions") {
                //for (var jj in defoptions['windowOptions']) {
                //    if (!item['windowOptions'].hasOwnProperty(jj)) {
                //        item['windowOptions'][jj] = defoptions['windowOptions'][jj];
                //    }
                //}
            } else if (!item.hasOwnProperty(aa)) {
                item[aa] = defoptions[aa];
            }
        }
    }

    //赋值内部使用属性 
    item.path = getFilePath(basePath + item.uri);
    item.name = item.name || item.label; //兼容name和label命名
}

//激活指定模块
function activate(item, noDisableOther) {

    if (thismap == null && item.viewer) {
        init(item.viewer);
    }

    //参数是字符串id或uri时
    if (typeof item === 'string') {
        item = { uri: item };

        if (noDisableOther != null) item.disableOhter = !noDisableOther; //是否释放其他已激活的插件 
    } else {
        if (item.uri == null) {
            console.error('activate激活widget时需要uri参数！');
        }
    }

    var thisItem;
    for (var i = 0; i < widgetsdata.length; i++) {
        var othitem = widgetsdata[i];
        if (item.uri == othitem.uri || othitem.id && item.uri == othitem.id) {
            thisItem = othitem;
            if (thisItem.isloading) return thisItem; //激活了正在loading的widget 防止快速双击了菜单

            //赋值
            for (var aa in item) {
                if (aa == "uri") continue;
                thisItem[aa] = item[aa];
            }
            break;
        }
    }
    if (thisItem == null) {
        bindDefOptions(item);
        thisItem = item;
        //非config中配置的，外部传入，首次激活
        widgetsdata.push(item);
    }

    if (isdebuger) console.log('开始激活widget：' + thisItem.uri);

    //释放其他已激活的插件 
    if (thisItem.disableOhter) {
        disableAll(thisItem.uri, thisItem.group);
    } else {
        disableGroup(thisItem.group, thisItem.uri);
    }

    //激活本插件
    if (thisItem._class) {
        if (thisItem._class.isActivate) {
            //已激活时
            if (thisItem._class.update) {
                //刷新
                thisItem._class.update();
            } else {
                //重启
                thisItem._class.disableBase();
                var timetemp = setInterval(function () {
                    if (thisItem._class.isActivate) return;
                    thisItem._class.activateBase();
                    clearInterval(timetemp);
                }, 200);
            }
        } else {
            thisItem._class.activateBase(); // BaseWidget: activateBase
        }
    } else {
        for (var i = 0; i < _arrLoadWidget.length; i++) {
            if (_arrLoadWidget[i].uri == thisItem.uri) //如果已在加载列表中的直接跳出
                return _arrLoadWidget[i];
        }
        _arrLoadWidget.push(thisItem);

        if (_arrLoadWidget.length == 1) {
            loadWidgetJs();
        }
    }
    return thisItem;
}

function getWidget(id) {
    for (var i = 0; i < widgetsdata.length; i++) {
        var item = widgetsdata[i];

        if (id == item.uri || id == item.id) {
            return item;
        }
    }
}

function getClass(id) {
    var item = getWidget(id);
    if (item) return item._class;else return null;
}

function isActivate(id) {
    var _class = getClass(id);
    if (_class == null) return false;
    return _class.isActivate;
}

function disable(id) {
    if (id == null) return;
    for (var i = 0; i < widgetsdata.length; i++) {
        var item = widgetsdata[i];

        if (item._class && (id == item.uri || id == item.id)) {
            item._class.disableBase();
            break;
        }
    }
}

//释放所有widget
function disableAll(nodisable, group) {
    for (var i = 0; i < widgetsdata.length; i++) {
        var item = widgetsdata[i];

        if (group && item.group == group) {
            //同组别的全部释放
        } else {
            if (!item.autoDisable) continue;
        }

        //指定不释放的跳过
        if (nodisable && (nodisable == item.uri || nodisable == item.id)) continue;

        if (item._class) {
            item._class.disableBase(); ////BaseWidget: disableBase
        }
    }
}

//释放同组widget
function disableGroup(group, nodisable) {
    if (group == null) return;

    for (var i = 0; i < widgetsdata.length; i++) {
        var item = widgetsdata[i];
        if (item.group == group) {
            //指定不释放的跳过
            if (nodisable && (nodisable == item.uri || nodisable == item.id)) continue;
            if (item._class) {
                item._class.disableBase(); ////BaseWidget: disableBase
            }
        }
    }
}

function eachWidget(calback) {
    for (var i = 0; i < widgetsdata.length; i++) {
        var item = widgetsdata[i];
        calback(item);
    }
}

var _arrLoadWidget = [];
var loadItem;
var isloading;
function loadWidgetJs() {
    if (_arrLoadWidget.length == 0) return;

    if (isloading) {
        setTimeout(loadWidgetJs, 500);
        return;
    }
    isloading = true;

    loadItem = _arrLoadWidget[0];
    loadItem.isloading = true;
    var _uri = loadItem.uri;
    if (cacheVersion) {
        if (_uri.indexOf('?') == -1) _uri += "?time=" + cacheVersion;else _uri += "&time=" + cacheVersion;
    }

    if (window.NProgress) {
        NProgress.start();
    }

    if (isdebuger) console.log('开始加载js：' + basePath + _uri);

    _loader.Loader.async([basePath + _uri], function () {
        isloading = false;
        loadItem.isloading = false;
        if (isdebuger) console.log('完成js加载：' + basePath + _uri);

        if (window.NProgress) {
            NProgress.done(true);
        }

        _arrLoadWidget.shift();
        loadWidgetJs();
    });
}

function bindClass(_class) {
    if (loadItem == null) {
        var _jspath = getThisJSPath();
        for (var i = 0; i < widgetsdata.length; i++) {
            var item = widgetsdata[i];
            if (_jspath.endsWith(item.uri)) {
                item.isloading = false;
                item._class = new _class(item, thismap);
                item._class.activateBase(); // BaseWidget: activateBase
                return item._class;
            }
        }
    } else {
        loadItem.isloading = false;
        loadItem._class = new _class(loadItem, thismap);
        loadItem._class.activateBase(); // BaseWidget: activateBase
        return loadItem._class;
    }
}

function getThisJSPath() {
    var jsPath;
    var js = document.scripts;
    for (var i = js.length - 1; i >= 0; i--) {
        jsPath = js[i].src;
        if (jsPath == null || jsPath == "") continue;
        if (jsPath.indexOf("widgets") == -1) continue;
        //jsPath = jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
        return jsPath;
    }
    return "";
}

//获取路径
function getFilePath(file) {
    var pos = file.lastIndexOf("/");
    return file.substring(0, pos + 1);
}

function removeDebugeBar() {
    (0, _jquery2.default)("#widget-testbar").remove();
}

function getCacheVersion() {
    return cacheVersion;
}

function getBasePath() {
    return basePath;
}

exports.init = init;
exports.isActivate = isActivate;
exports.activate = activate;
exports.disable = disable;
exports.disableAll = disableAll;
exports.disableGroup = disableGroup;
exports.eachWidget = eachWidget;
exports.getWidget = getWidget;
exports.getClass = getClass;
exports.removeDebugeBar = removeDebugeBar;
exports.bindClass = bindClass;
exports.getDefWindowOptions = getDefWindowOptions;
exports.getCacheVersion = getCacheVersion;
exports.getBasePath = getBasePath;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

// cssExpr 用于判断资源是否是css
var cssExpr = new RegExp('\\.css');
var nHead = document.head || document.getElementsByTagName('head')[0];
// `onload` 在WebKit < 535.23， Firefox < 9.0 不被支持
var isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, '$1') < 536;

// 判断对应的node节点是否已经载入完成
function isReady(node) {
    return node.readyState === 'complete' || node.readyState === 'loaded';
}

// loadCss 用于载入css资源
function loadCss(url, setting, callback) {
    var node = document.createElement('link');

    node.rel = 'stylesheet';
    addOnload(node, callback, 'css');
    node.async = true;
    node.href = url;

    nHead.appendChild(node);
}

// loadJs 用于载入js资源
function loadJs(url, setting, callback) {
    var node = document.createElement('script');

    node.charset = 'utf-8';
    addOnload(node, callback, 'js');
    node.async = !setting.sync;
    node.src = url;

    nHead.appendChild(node);
}

// 在老的webkit中，因不支持load事件，这里用轮询sheet来保证
function pollCss(node, callback) {
    var isLoaded;

    if (node.sheet) {
        isLoaded = true;
    }

    setTimeout(function () {
        if (isLoaded) {
            // 在这里callback 是为了让样式有足够的时间渲染
            callback();
        } else {
            pollCss(node, callback);
        }
    }, 20);
}

// 用于给指定的节点绑定onload回调
// 监听元素载入完成事件
function addOnload(node, callback, type) {
    var supportOnload = 'onload' in node;
    var isCSS = type === 'css';

    // 对老的webkit和老的firefox的兼容
    if (isCSS && (isOldWebKit || !supportOnload)) {
        setTimeout(function () {
            pollCss(node, callback);
        }, 1);
        return;
    }

    if (supportOnload) {
        node.onload = onload;
        node.onerror = function () {
            node.onerror = null;
            //window._cdnFallback(node);
            if (type == "css") console.error("该css文件不存在：" + node.href);else console.error("该js文件不存在：" + node.src);
            onload();
        };
    } else {
        node.onreadystatechange = function () {
            if (isReady(node)) {
                onload();
            }
        };
    }

    function onload() {

        // 执行一次后清除，防止重复执行
        node.onload = node.onreadystatechange = null;

        node = null;

        callback();
    }
}

// 资源下载入口，根绝文件类型的不同，调用loadCss或者loadJs
function loadItem(url, list, setting, callback) {
    // 如果加载的url为空，就直接成功返回
    if (!url) {
        setTimeout(function () {
            onFinishLoading();
        });
        return;
    }

    if (cssExpr.test(url)) {
        loadCss(url, setting, onFinishLoading);
    } else {
        loadJs(url, setting, onFinishLoading);
    }

    // 每次资源下载完成后，检验是否结束整个list下载过程
    // 若已经完成所有下载，执行回调函数
    function onFinishLoading() {
        var urlIndex = list.indexOf(url);
        if (urlIndex > -1) {
            list.splice(urlIndex, 1);
        }

        if (list.length === 0) {
            callback();
        }
    }
}

function doInit(list, setting, callback) {
    var cb = function cb() {
        callback && callback();
    };

    list = Array.prototype.slice.call(list || []);

    if (list.length === 0) {
        cb();
        return;
    }

    for (var i = 0, len = list.length; i < len; i++) {
        loadItem(list[i], list, setting, cb);
    }
}

// 判断当前页面是否加载完
// 加载完，立刻执行下载
// 未加载完，等待页面load事件以后再进行下载
function ready(node, callback) {
    if (isReady(node)) {
        callback();
    } else {
        // 1500ms 以后，直接开始下载资源文件，不再等待load事件
        var timeLeft = 1500;
        var isExecute = false;
        window.addEventListener('load', function () {
            if (!isExecute) {
                callback();
                isExecute = true;
            }
        });

        setTimeout(function () {
            if (!isExecute) {
                callback();
                isExecute = true;
            }
        }, timeLeft);
    }
}

// 暴露出去的Loader
// 提供async, sync两个函数
// async 用作异步下载执行用，不阻塞页面渲染
// sync  用作异步下载，顺序执行，保证下载的js按照数组顺序执行
var Loader = {
    async: function async(list, callback) {

        ready(document, function () {
            doInit(list, {}, callback);
        });
    },

    sync: function sync(list, callback) {

        ready(document, function () {
            doInit(list, {
                sync: true
            }, callback);
        });
    }
};

//window.Loader = Loader;

exports.Loader = Loader;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(38);

__webpack_require__(39);

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _map = __webpack_require__(40);

var _layer = __webpack_require__(22);

var _layer2 = _interopRequireDefault(_layer);

var _pointconvert = __webpack_require__(18);

var _pointconvert2 = _interopRequireDefault(_pointconvert);

var _leaflet = __webpack_require__(12);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _esriLeaflet = __webpack_require__(17);

var _esriLeaflet2 = _interopRequireDefault(_esriLeaflet);

var _point = __webpack_require__(1);

var point = _interopRequireWildcard(_point);

var _util = __webpack_require__(4);

var util = _interopRequireWildcard(_util);

var _matrix = __webpack_require__(82);

var matrix = _interopRequireWildcard(_matrix);

var _Measure = __webpack_require__(83);

var _FlowEcharts = __webpack_require__(84);

var _MapVLayer = __webpack_require__(85);

var _AnimationLineMaterialProperty = __webpack_require__(88);

var _ElliposidFadeMaterialProperty = __webpack_require__(89);

var _DivPoint = __webpack_require__(90);

var _TilesEditor = __webpack_require__(91);

var _Draw = __webpack_require__(25);

var _index = __webpack_require__(92);

var Attr = _interopRequireWildcard(_index);

var _EventType = __webpack_require__(8);

var EventType = _interopRequireWildcard(_EventType);

var _Tooltip = __webpack_require__(3);

var _Util = __webpack_require__(2);

var DrawUtil = _interopRequireWildcard(_Util);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Class = __webpack_require__(10);

var _widgetManager = __webpack_require__(35);

var widget = _interopRequireWildcard(_widgetManager);

var _BaseWidget = __webpack_require__(93);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//===========模块对外公开的属性及方法=========
//静态方法和类


//需要new的类  
exports.name = "MarsGIS for Cesium三维地球框架";
exports.version = "1.7.3";
exports.author = "木遥（QQ 346819890，微信 muyao1987）";
exports.website = "http://cesium.marsgis.cn";

exports.Class = _Class.Class;

//map
exports.createMap = _map.createMap;
exports.layer = _layer2.default;
exports.pointconvert = _pointconvert2.default;
exports.latlng = point; //兼容旧版本
exports.point = point;
exports.util = util;
exports.matrix = matrix;

//需要new的类 
exports.Measure = _Measure.Measure;
exports.FlowEcharts = _FlowEcharts.FlowEcharts;
// exports.MapVLayer = MapVLayer 

exports.AnimationLineMaterialProperty = _AnimationLineMaterialProperty.AnimationLineMaterialProperty;
exports.ElliposidFadeMaterialProperty = _ElliposidFadeMaterialProperty.ElliposidFadeMaterialProperty;
exports.DivPoint = _DivPoint.DivPoint;

exports.TilesEditor = _TilesEditor.TilesEditor;

//新版标绘
exports.Draw = _Draw.Draw;
exports.draw = {};
exports.draw.util = DrawUtil;
exports.draw.event = EventType;
exports.draw.tooltip = _Tooltip.message;
exports.draw.dragger = draggerCtl;
exports.draw.attr = Attr;

//widget
exports.widget = widget;
exports.widget.BaseWidget = _BaseWidget.BaseWidget;

exports.L = _leaflet2.default;
exports.L.esri = _esriLeaflet2.default;

//delete scope.L; 
console.log('当前Cesium版本：' + _Cesium2.default.VERSION + " ， MarsGIS版本：" + exports.version);

/***/ }),
/* 38 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 39 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createMap = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _util2 = __webpack_require__(4);

var _util = _interopRequireWildcard(_util2);

var _point = __webpack_require__(1);

var point = _interopRequireWildcard(_point);

var _popup2 = __webpack_require__(41);

var _popup = _interopRequireWildcard(_popup2);

var _tooltip2 = __webpack_require__(42);

var _tooltip = _interopRequireWildcard(_tooltip2);

var _firstPerson2 = __webpack_require__(43);

var _firstPerson = _interopRequireWildcard(_firstPerson2);

var _pointconvert = __webpack_require__(18);

var _pointconvert2 = _interopRequireDefault(_pointconvert);

var _GaodePOIGeocoder = __webpack_require__(44);

var _layer = __webpack_require__(22);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Cesium2.default.Camera.DEFAULT_VIEW_RECTANGLE = _Cesium2.default.Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2);

//版权信息
var copyright = false;

function initMap(id, config, options) {

    //============模块内部私有属性及方法============ 


    //类内部使用
    var viewer;
    var viewerDivId;
    var configdata;
    var crs; //坐标系


    viewerDivId = id;
    configdata = config;

    //如果options未设置时的默认参数
    var defoptions = {
        animation: false, //是否创建动画小器件，左下角仪表   
        timeline: false, //是否显示时间线控件   
        fullscreenButton: true, //右下角全屏按钮
        vrButton: false, //右下角vr虚拟现实按钮

        geocoder: false, //是否显示地名查找控件   
        sceneModePicker: false, //是否显示投影方式控件  
        homeButton: true, //回到默认视域按钮
        navigationHelpButton: true, //是否显示帮助信息控件  
        navigationInstructionsInitiallyVisible: false, //在用户明确单击按钮之前是否自动显示

        infoBox: true, //是否显示点击要素之后显示的信息 
        selectionIndicator: false, //选择模型是是否显示绿色框, 
        shouldAnimate: true,
        showRenderLoopErrors: true, //是否显示错误弹窗信息

        baseLayerPicker: false //地图底图
    };

    //config中可以配置map所有options
    for (var key in configdata) {
        if (key === "crs" || key === "controls" || key === "minzoom" || key === "maxzoom" || key === "center" || key === "style" || key === "terrain" || key === "basemaps" || key === "operationallayers") continue;
        defoptions[key] = configdata[key];
    }

    //赋默认值（如果已存在设置值跳过）
    if (options == null) options = {};
    for (var i in defoptions) {
        if (!options.hasOwnProperty(i)) {
            options[i] = defoptions[i];
        }
    }

    //一些默认值的修改【by 木遥】
    _Cesium2.default.BingMapsApi.defaultKey = 'AtkX3zhnRe5fyGuLU30uZw8r3sxdBDnpQly7KfFTCB2rGlDgXBG3yr-qEiQEicEc'; //，默认 key 
    if (_Cesium2.default.Ion) _Cesium2.default.Ion.defaultAccessToken = configdata.ionToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NjM5MjMxOS1lMWVkLTQyNDQtYTM4Yi0wZjA4ZDMxYTlmNDMiLCJpZCI6MTQ4MiwiaWF0IjoxNTI4Njc3NDQyfQ.vVoSexHMqQhKK5loNCv6gCA5d5_z3wE2M0l_rWnIP_w';
    _Cesium2.default.AnimationViewModel.defaultTicks = configdata.animationTicks || [0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 30.0, 60.0, 120.0, 300.0, 600.0, 900.0, 1800.0, 3600.00];

    //坐标系
    configdata.crs = configdata.crs || '3857';
    crs = configdata.crs;

    //自定义搜索栏Geocoder
    if (options.geocoder === true) {
        options.geocoder = new _GaodePOIGeocoder.GaodePOIGeocoder(options.geocoderConfig);
    }

    //地形
    if (configdata.terrain && configdata.terrain.visible) {
        options.terrainProvider = getTerrainProvider();
    }

    //地图底图图层预处理   
    var hasremoveimagery = false;
    if (options.baseLayerPicker) {
        //有baseLayerPicker插件时
        if (!options.imageryProviderViewModels) options.imageryProviderViewModels = getImageryProviderArr();
        if (!options.terrainProviderViewModels) options.terrainProviderViewModels = getTerrainProviderViewModelsArr();
    } else {
        //无baseLayerPicker插件时,按内部规则
        if (options.imageryProvider == null) {
            hasremoveimagery = true;
            options.imageryProvider = _Cesium2.default.createTileMapServiceImageryProvider({
                url: _Cesium2.default.buildModuleUrl('Assets/Textures/NaturalEarthII')
            });
        }
    }

    //地球初始化
    viewer = new _Cesium2.default.Viewer(id, options);
    viewer.cesiumWidget.creditContainer.style.display = "none"; //去cesium logo


    //====绑定方法到viewer上====
    viewer.mars = {
        popup: _popup,
        tooltip: _tooltip,
        keyboard: function keyboard(isbind, speedRatio) {
            if (isbind) _firstPerson.bind(viewer, speedRatio);else _firstPerson.unbind(viewer);
        },
        centerAt: centerAt,
        centerAtArr: centerAtArr,
        getConfig: getConfig,
        getLayer: getLayer,
        changeBasemap: changeBasemap,
        hasTerrain: hasTerrain,
        updateTerrainProvider: updateTerrainProvider,
        isFlyAnimation: isFlyAnimation,
        openFlyAnimation: openFlyAnimation,
        rotateAnimation: rotateAnimation,
        getCrs: getCrs,
        point2map: point2map,
        point2wgs: point2wgs,
        destroy: destroy

        //地图底图图层 
    };if (hasremoveimagery) {
        var imageryLayerCollection = viewer.imageryLayers;
        var length = imageryLayerCollection.length;
        for (var i = 0; i < length; i++) {
            var layer = imageryLayerCollection.get(0);
            imageryLayerCollection.remove(layer, true);
        }
    }

    //默认定位地点相关设置，默认home键和初始化镜头视角  
    if (viewer.homeButton) {
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (commandInfo) {
            centerAt();
            commandInfo.cancel = true;
        });
    }
    centerAt(null, { duration: 0 });

    var orderlayers = []; //计算order

    //没baseLayerPicker插件时才按内部规则处理。
    if (!options.baseLayerPicker) {
        var layersCfg = configdata.basemaps;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if (item.visible && item.crs) crs = item.crs;

                (0, _layer.createLayer)(item, viewer, config.serverURL, options.layerToMap);

                orderlayers.push(item);
                if (item.type == "group" && item.layers) {
                    for (var idx = 0; idx < item.layers.length; idx++) {
                        var childitem = item.layers[idx];
                        orderlayers.push(childitem);
                    }
                }
            }
        }
    }

    //可叠加图层  
    var layersCfg = configdata.operationallayers;
    if (layersCfg && layersCfg.length > 0) {
        for (var i = 0; i < layersCfg.length; i++) {
            var item = layersCfg[i];
            (0, _layer.createLayer)(item, viewer, config.serverURL, options.layerToMap);

            orderlayers.push(item);
            if (item.type == "group" && item.layers) {
                for (var idx = 0; idx < item.layers.length; idx++) {
                    var childitem = item.layers[idx];
                    orderlayers.push(childitem);
                }
            }
        }
    }
    //计算 顺序字段,
    for (var i = 0; i < orderlayers.length; i++) {
        var item = orderlayers[i];

        //计算层次顺序
        var order = Number(item.order);
        if (isNaN(order)) order = i;
        item.order = order;

        //图层的处理
        if (item._layer != null) {
            item._layer.setZIndex(order);
        }
    }

    //二三维切换不用动画
    if (viewer.sceneModePicker) viewer.sceneModePicker.viewModel.duration = 0.0;

    //地图自定义控件 （兼容旧版controls参数） 
    if (configdata.navigation) {
        //导航工具栏
        addNavigationWidget(configdata.navigation);
    }
    if (configdata.location) {
        //鼠标提示
        addLocationWidget(configdata.location);
    }

    if (options.geocoder) {
        options.geocoder.viewer = viewer;
    }

    //绑定popup
    _popup.init(viewer);

    //绑定tooltip
    _tooltip.init(viewer);

    //地球一些属性设置
    var scene = viewer.scene;
    scene.globe.baseColor = new _Cesium2.default.Color.fromCssColorString(configdata.baseColor || "#546a53"); //默认背景色
    scene.backgroundColor = scene.globe.baseColor; //背景色
    if (configdata.style) {
        //深度监测
        scene.globe.depthTestAgainstTerrain = configdata.style.testTerrain;

        //光照渲染（阳光照射区域高亮）
        scene.globe.enableLighting = configdata.style.lighting;

        //大气渲染
        scene.skyAtmosphere.show = configdata.style.atmosphere;
        scene.globe.showGroundAtmosphere = configdata.style.atmosphere;

        //雾化效果
        scene.fog.enabled = configdata.style.fog;

        //设置无地球模式 （单模型是可以设置为false）
        scene.globe.show = _Cesium2.default.defaultValue(configdata.style.globe, true);
        scene.moon.show = _Cesium2.default.defaultValue(configdata.style.moon, scene.globe.show);
        scene.sun.show = _Cesium2.default.defaultValue(configdata.style.sun, scene.globe.show);
        scene.skyBox.show = _Cesium2.default.defaultValue(configdata.style.skyBox, scene.globe.show);
    }

    //限制缩放级别
    scene.screenSpaceCameraController.maximumZoomDistance = configdata.maxzoom || 20000000; //变焦时相机位置的最大值（以米为单位） 
    scene.screenSpaceCameraController.minimumZoomDistance = configdata.minzoom || 1; //变焦时相机位置的最小量级（以米为单位）。默认为1.0。

    //scene.screenSpaceCameraController.enableCollisionDetection = true;    //启用地形相机碰撞检测。
    //scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 1;  //在测试与地形碰撞之前摄像机必须达到的最小高度。

    //解决Cesium显示画面模糊的问题 https://zhuanlan.zhihu.com/p/41794242
    viewer._cesiumWidget._supportsImageRenderingPixelated = _Cesium2.default.FeatureDetection.supportsImageRenderingPixelated();
    viewer._cesiumWidget._forceResize = true;
    if (_Cesium2.default.FeatureDetection.supportsImageRenderingPixelated()) {
        var _dpr = window.devicePixelRatio;
        // 适度降低分辨率
        while (_dpr >= 2.0) {
            _dpr /= 2.0;
        }
        viewer.resolutionScale = _dpr;
    }

    //解决限定相机进入地下 https://github.com/AnalyticalGraphicsInc/cesium/issues/5837
    viewer.camera.changed.addEventListener(function () {
        if (viewer.camera._suspendTerrainAdjustment && viewer.scene.mode === _Cesium2.default.SceneMode.SCENE3D) {
            viewer.camera._suspendTerrainAdjustment = false;
            viewer.camera._adjustHeightForTerrain();
        }
    });

    //版权图片
    if (copyright) {
        var viewportQuad = new _Cesium2.default.ViewportQuad();
        viewportQuad.rectangle = new _Cesium2.default.BoundingRectangle(10, 5, 103, 24);
        viewer.scene.primitives.add(viewportQuad);
        viewportQuad.material = new _Cesium2.default.Material({
            fabric: {
                type: 'Image',
                uniforms: {
                    color: new _Cesium2.default.Color(1.0, 1.0, 1.0, 1.0),
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAAAYCAYAAADnNePtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NzBCMzhDNkMyQjdFNzExOEQ3MUQ1NDIzMjRERTZDQyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozQ0ZEMzEyOEJEREIxMUU3ODBCOTg1QTM3NDY2NEVEMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmZDk2M2I4ZC01MDdlLTVjNDUtOTg4OS02MmY0NTg2NDhjNGEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0xMC0yNVQyMDowNzozMyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMTAtMjVUMjA6MjY6MjMrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMTAtMjVUMjA6MjY6MjMrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozM0I4MEQ3RkM3QjdFNzExOTE4NkRGNjMwMjlEOTE4MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NzBCMzhDNkMyQjdFNzExOEQ3MUQ1NDIzMjRERTZDQyIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmZDk2M2I4ZC01MDdlLTVjNDUtOTg4OS02MmY0NTg2NDhjNGEiIHN0RXZ0OndoZW49IjIwMTgtMTAtMjVUMjA6MjY6MjMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fps6oAAACQpJREFUaIHtmnuw1VUVxz+Xx+WChTwERXm/EuWpIIkJDYSMgImNFmBTwYB4MRIYsVQkHiZgylgJWmShSC/y0YgCCgr4oEiEgJwUkAgQeRuI6AX59sdavzn77Pv7nXtv0zTNxJrZ89t7rbXXfq/9XfucIklUgroAA4BLgHZAEdAGqAvsBdYBTwFPAscrY/AMVUxFFSxOfeBxYHCK7CBwDGiILRLACWAc8Oh/sI//t1StgGwssIvyC/McdoIaAa2Bs4EmwJ1AbeDnwBP/Rl+KsRP5v041gOr/lZYkpaXHlE4zA50Wkr7o34TXWNIq130ow3ZWmiFpi6SHJX1TUq1K1jtH0uOS7pPUQ1IrSZ8LUntJ50m6XdJ6SV+thO1iSbMlLZXUMJINk3RA0jJJ0yXVSanfRtK3JPWUdFYkayXpO26na6F+pDF/mrEwt7n8S5IWStrk/COSSqMBr3FZnyoszp1BWztSBpWV6kja5fV2yzbQNP/OlHSPpHslvR/YvyPDVlMf5/ZA96lI54ZAtklStRQ7Vwc6hyR1C2RXBLJXCo0tZoxXOi0KdJrIdpUk7Zd0VYrhTi5/rlDjURodtDe+CvVQbjJXFtB5IbDfJeDXljRC0mJJRwOdA7KTvFY2oUmdHoHO9zPaaivpuOu8FMm6BfVnO6+jpIGxnRqBh6sG3Jji+fYCs4PyPuAqz08FXkipsxlYAwwEGgP7K+Fhw76UBfkLgA+Bf1bCxnnADcBJoJbzTgFyGcCnwAdRW/8AfuT9nub8rwPLPT8GeAR4E/it1ykm++455G3U8bbHAiuBt4GzAr2j/n0CQ8TzgUnJWMMJ6ewpps3AnqD8FaCr57dndA5gK9AbAwtpi1MEdAT+jqG+04GsJMgvA1oCE73zhagMeA9bnMTGyUCWRp9iEwe5BQTYDfTCNuevgHswINQYOAKcm2JrENAdeJ8c2OrraR/wG+CcSL8Ztg7vAtcAG4CHIbc4NwPDsd0QUy3yF/GzQb4Lud0VU0v/fpIhF4b8ZgHzvJxQG//2xhYQ4GfAFOALwM4Mm4eA1zJkhzP4PYBWwHqgvfM+Bq4DbsEWrC3wGHAT8Gvnp9E7QANsvhLk+RIwHkO2S7AFTjzUauCOoH4RwWlMJr010DSjwerkXATYTk9oFHbcj5JPHYB+2A7bnWF3MLZr+mCL0yCQtfNv/4C3FVhA+cWui0F4gIuAGdhJLcNcWnVsgjtl9KO2yw4ALZxXgrnSwZhrngLMAW7DFnNShq2tngAmYKdrF+Z9Njv/VKCfzFt17AQrlCdHrz75JyKkBzCfnNDLwBueb+flDoG8F/A7z8/3QcZ0ObYTAXr6t0Ugb4DdNUO8vB24GrgXcxkh1ccm+GMs+J2K+frBbnOf92MzFjjfh7mqhNYAd/s4Tgb8Iuw0zQCaAxuB0pSxZFFyAnpid80K72uzQGcQ5gUWkr85jRwZLFE29U5BI30jneOS1jm6OeW8nbK4J65bTdLmoO4G56/18hZJr0v6k5dXSaqXgYrwNg57e1923sTA/txAd6LS0SWSasggvCSdlFQmg8EdvI4k7ZHFKCe8PD2y0VSGOhd6fUk6LQtPxsjQ62IZlJ8czcMRWXxUDkovUzqVyWBe2mAGyOBmGr0WNxSllYFuPxk8/8jL8yX9wvMTCthI0jVR29+TNCko3y+pmSz2OOa8eFKRQdmE3pOFD5K00fsoGSwOY5hHJF0sqbrbuDVlLhYEbUyQHYSk/Gyg96SkumGfErf2N8w3xlSTHGyOaTl2Ud6CXZJ/wJ5uhmD3SIjk4meiIcD1QDcMKQ0ld2+s8rqnqdwbXV//7scg7wpyFztAPe9nTeBW4CHSQcq1Qb4Ic4PHsEt+pdvpSz6kHwZswS59MBcJsA1zoTGtw9xzVwxS93H+AQxu59/dvkqlkl71FVwj6YNgRU9Jul45l1SV4BCZS2pfQF6i3PE+4Lz+Xv59BbYvkLmgPTKXkvBHBv0f4bwWkoZk2LlI5poPBvUukz3BTHAbwySNkjQv0PmL7BVierDrR8mC0D+7zrKgnSJJ+2TPSHMDO1PS+pVk+kh61BWXBoYT2hENviqpo09ilnxc0M5dzmsl6RPn/aRA3edl/n+yLIK/XHZHzAls/lDShcrdYStk90toZ5WPO3ya6SdbtBEyl9dd5n6HBTrTMvpVQ9I7rrMqkj2ofHo6a3yJu1mNxRH4kXuQ/LigJfAD8uOdiqgehsreJTvGaIYFdwCvYGgMYAfwoue/jSGptlHdK7DguDEG7/thAV4T8pFnfSyOWQCMBhaTc6Fgbua0f8PfotoBbwG/BJ7HEOpeH09FdAqDxgTfhJZE5bQXFqNotZb6ao6TNFblaaOkwQV2cpJ6S3pL9hJcQ1LrFJ1Gkt5wu5tkr8uhfEDU9gnZBTpcdgEXe0prf0xQrzSS1ZSdgKTcVtK5yl3YCY3MsB0CgrsjWWefn+HKobXwba2HDAHG9LbsFX+qDAnnnZyEZvn3x9gp6Uv+s0cX4FnsEpyA7d7OwGXA17B3qfXYSUx23JWU322tgbXApcAitxNfoMu9HwmVYLFLRwxglGFxSU3sZaOE3JNNvaBeeIo+A7yOPfHMdN42LBZK2kgo7bUktn1+JNvrfVzk/YKc17gHAwQfYuDjrqBeewxYDSQ8vSk7ozRY0V6Smssuviw6ncKbJ+l82R3SLLI/Snaf7JT9/FDRKZzvNo9KujTg9/N+PeM7uFQGZUfLLtuNstM7T9JN3u4cSVsl7XWb10ZthXfVzRn9CWOoRRk6f3T5R5JelMHkzZK+Eel1Ug5On1DkYbImZIByyGW6zAUN8gktRG/KLs7Gssvy4shuU0mz3FZFixKm2yXdGPHOli1QF+9fsez5v45ycQeeT/glAb+RorhC0lBJq2UuPev3pOsk/VXSA5JaZui0lwXETWUI8fMVjK+7ym+Ugv8haI65sM7AZAwQdMIu+R7Ys8SrfvyHYrHDM9hTzjbgu+Q/k5yhKlJFf/AAGIkhocPA09jEF3tqCNyPPTi+DFyIIZ/+pAe1Z6gKVJnFAXu6vwR7ku+AwcMN2MPdlcBcDCIexP6Bk/XbyRmqAv0L6oKRuwwQEIsAAAAASUVORK5CYII='
                }
            }
        });
    }

    //鼠标滚轮缩放美化样式
    if (configdata.mouseZoom && _util.isPCBroswer()) {
        (0, _jquery2.default)("#" + viewerDivId).append('<div class="cesium-mousezoom"><div class="zoomimg"/></div>');
        var handler = new _Cesium2.default.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function (evnet) {
            (0, _jquery2.default)('.cesium-mousezoom').addClass('cesium-mousezoom-visible');
            setTimeout(function () {
                (0, _jquery2.default)('.cesium-mousezoom').removeClass('cesium-mousezoom-visible');
            }, 200);
        }, _Cesium2.default.ScreenSpaceEventType.WHEEL);
        handler.setInputAction(function (evnet) {
            (0, _jquery2.default)('.cesium-mousezoom').css({
                top: evnet.endPosition.y + 'px',
                left: evnet.endPosition.x + 'px'
            });
        }, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);
    }

    function destroy() {
        _tooltip.destroy();
        _popup.destroy();
    }

    //获取指定图层 keyname默认为名称
    function getLayer(key, keyname) {
        if (keyname == null) keyname = "name";

        var layersCfg = configdata.basemaps;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if (item == null || item[keyname] != key) continue;
                return item._layer;
            }
        }

        layersCfg = configdata.operationallayers;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if (item == null || item[keyname] != key) continue;
                return item._layer;
            }
        }
        return null;
    }

    function getConfig() {
        return _util.clone(configdata);
    }

    var stkTerrainProvider;
    function getTerrainProvider() {
        if (stkTerrainProvider == null) {
            var cfg = configdata.terrain;
            if (cfg.url) {
                if (configdata.serverURL) {
                    cfg.url = cfg.url.replace('$serverURL$', configdata.serverURL);
                }
                cfg.url = cfg.url.replace('$hostname$', location.hostname).replace('$host$', location.host);
            }

            stkTerrainProvider = _util.getTerrainProvider(cfg);
        }
        return stkTerrainProvider;
    }
    function hasTerrain() {
        if (stkTerrainProvider == null) return false;
        return viewer.terrainProvider != _util.getEllipsoidTerrain();
    }
    function updateTerrainProvider(isStkTerrain) {
        if (isStkTerrain) {
            viewer.terrainProvider = getTerrainProvider();
        } else {
            viewer.terrainProvider = _util.getEllipsoidTerrain();
        }
    }
    function changeBasemap(idorname) {
        var basemaps = configdata.basemaps;
        for (var i = 0; i < basemaps.length; i++) {
            var item = basemaps[i];
            if (item.type == "group" && item.layers == null) continue;
            if (item._layer == null) continue;

            if (idorname == item.name || idorname == item.id) item._layer.setVisible(true);else item._layer.setVisible(false);
        }
    }

    //获取自定义底图切换
    function getImageryProviderArr() {
        var providerViewModels = [];
        window._temp_createImageryProvider = _layer.createImageryProvider;

        var layersCfg = configdata.basemaps;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if (item.type == "group" && item.layers == null) continue;

                var funstr = 'window._temp_basemaps' + i + ' = function () {\
                        var item = ' + JSON.stringify(item) + ';\
                        if (item.type == "group") {\
                            var arrVec = [];\
                            for (var index = 0; index < item.layers.length; index++) {\
                                var temp = window._temp_createImageryProvider(item.layers[index]);\
                                if (temp == null) continue;\
                                arrVec.push(temp);\
                            }\
                            return arrVec;\
                        }\
                        else {\
                            return window._temp_createImageryProvider(item);\
                        } \
                    }';
                eval(funstr);

                var imgModel = new _Cesium2.default.ProviderViewModel({
                    name: item.name || "未命名",
                    tooltip: item.name || "未命名",
                    iconUrl: item.icon || "",
                    creationFunction: eval('window._temp_basemaps' + i)
                });
                providerViewModels.push(imgModel);
            }
        }
        return providerViewModels;
    }

    function getTerrainProviderViewModelsArr() {
        return [new _Cesium2.default.ProviderViewModel({
            name: '无地形',
            iconUrl: _Cesium2.default.buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
            tooltip: 'WGS84标准椭球，即 EPSG:4326',
            category: '',
            creationFunction: function creationFunction() {
                return new _Cesium2.default.EllipsoidTerrainProvider({
                    ellipsoid: _Cesium2.default.Ellipsoid.WGS84
                });;
            }
        }), new _Cesium2.default.ProviderViewModel({
            name: '中国地形',
            iconUrl: _Cesium2.default.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: '火星科技 提供的高分辨率中国地形',
            category: '',
            creationFunction: function creationFunction() {
                return getTerrainProvider();
            }
        }), new _Cesium2.default.ProviderViewModel({
            name: '全球地形',
            iconUrl: _Cesium2.default.buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
            tooltip: 'Cesium官方 提供的高分辨率全球地形',
            category: '',
            creationFunction: function creationFunction() {
                return _util.getTerrainProvider({ type: 'ion' });;
            }
        })];
    }

    var arrCenterTemp;
    function _centerAtArrItem(i, enfun) {
        if (i < 0 || i >= arrCenterTemp.length) {
            //console.log('centerAtArr视角切换全部结束');
            if (enfun) enfun();
            return;
        }
        var centeropt = arrCenterTemp[i];

        //console.log('centerAtArr开始视角切换，第' + i + '点');
        if (centeropt.onStart) centeropt.onStart();

        centerAt(centeropt, {
            duration: centeropt.duration,
            complete: function complete() {
                if (centeropt.onEnd) centeropt.onEnd();

                var stopTime = centeropt.stop || 1;
                //console.log('centerAtArr第' + i + '点切换结束，将在此停留' + stopTime + '秒');

                setTimeout(function () {
                    _centerAtArrItem(++i, enfun);
                }, stopTime * 1000);
            }
        });
    }

    function centerAtArr(arr, enfun) {
        arrCenterTemp = arr;
        _centerAtArrItem(0, enfun);
    }

    function centerAt(centeropt, options) {
        if (options == null) options = {};else if (_util.isNumber(options)) options = { duration: options }; //兼容旧版本


        if (centeropt == null) {
            //让镜头飞行（动画）到配置默认区域 
            options.isWgs84 = true;
            centeropt = configdata.extent || configdata.center || { "y": 17.196575, "x": 114.184276, "z": 9377198, "heading": 0, "pitch": -80, "roll": 0 };
        }

        if (centeropt.xmin && centeropt.xmax && centeropt.ymin && centeropt.ymax) {
            //使用extent配置
            var xmin = centeropt.xmin;
            var xmax = centeropt.xmax;
            var ymin = centeropt.ymin;
            var ymax = centeropt.ymax;

            if (options.isWgs84) {
                //坐标转换为wgs
                var pt1 = point2map({ x: xmin, y: ymin });
                xmin = pt1.x;
                ymin = pt1.y;

                var pt2 = point2map({ x: xmax, y: ymax });
                xmax = pt2.x;
                ymax = pt2.y;
            }

            var rectangle = _Cesium2.default.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
            viewer.camera.flyTo({
                destination: rectangle,
                duration: options.duration,
                complete: options.complete
            });
        } else {
            //使用xyz 
            if (options.isWgs84) centeropt = point2map(centeropt);

            var height = options.minz || 2500;
            if (viewer.camera.positionCartographic.height < height) height = viewer.camera.positionCartographic.height;
            if (centeropt.z != null && centeropt.z != 0) height = centeropt.z;

            viewer.camera.flyTo({
                destination: _Cesium2.default.Cartesian3.fromDegrees(centeropt.x, centeropt.y, height), //经度、纬度、高度 
                orientation: {
                    heading: _Cesium2.default.Math.toRadians(centeropt.heading || 0), //绕垂直于地心的轴旋转
                    pitch: _Cesium2.default.Math.toRadians(centeropt.pitch || -90), //绕纬度线旋转
                    roll: _Cesium2.default.Math.toRadians(centeropt.roll || 0) //绕经度线旋转
                },
                duration: options.duration,
                complete: options.complete
            });
        }
    }

    //开场动画 
    var _isFlyAnimation = false;
    function isFlyAnimation() {
        return _isFlyAnimation;
    }
    function openFlyAnimation(endfun, centeropt) {
        var view = centeropt || point.getCameraView(viewer); //默认为原始视角

        _isFlyAnimation = true;
        viewer.camera.setView({
            destination: _Cesium2.default.Cartesian3.fromDegrees(-85.16, 13.71, 23000000.0)
        });
        viewer.camera.flyTo({
            destination: _Cesium2.default.Cartesian3.fromDegrees(view.x, view.y, 23000000.0),
            duration: 2,
            easingFunction: _Cesium2.default.EasingFunction.LINEAR_NONE,
            complete: function complete() {
                var z = (view.z || 90000) * 1.2 + 8000;
                if (z > 23000000) z = 23000000;

                viewer.camera.flyTo({
                    destination: _Cesium2.default.Cartesian3.fromDegrees(view.x, view.y, z),
                    complete: function complete() {
                        centerAt(view, {
                            duration: 2,
                            complete: function complete() {
                                _isFlyAnimation = false;
                                if (endfun) endfun();
                            }
                        });
                    }
                });
            }
        });
    }
    //旋转地球 
    function rotateAnimation(endfun, duration) {
        var first = point.getCameraView(viewer); //默认为原始视角
        var duration3 = duration / 3;

        //动画 1/3
        viewer.camera.flyTo({
            destination: _Cesium2.default.Cartesian3.fromDegrees(first.x + 120, first.y, first.z),
            orientation: {
                heading: _Cesium2.default.Math.toRadians(first.heading),
                pitch: _Cesium2.default.Math.toRadians(first.pitch),
                roll: _Cesium2.default.Math.toRadians(first.roll)
            },
            duration: duration3,
            easingFunction: _Cesium2.default.EasingFunction.LINEAR_NONE,
            complete: function complete() {

                //动画 2/3
                viewer.camera.flyTo({
                    destination: _Cesium2.default.Cartesian3.fromDegrees(first.x + 240, first.y, first.z),
                    orientation: {
                        heading: _Cesium2.default.Math.toRadians(first.heading),
                        pitch: _Cesium2.default.Math.toRadians(first.pitch),
                        roll: _Cesium2.default.Math.toRadians(first.roll)
                    },
                    duration: duration3,
                    easingFunction: _Cesium2.default.EasingFunction.LINEAR_NONE,
                    complete: function complete() {

                        //动画 3/3
                        viewer.camera.flyTo({
                            destination: _Cesium2.default.Cartesian3.fromDegrees(first.x, first.y, first.z),
                            orientation: {
                                heading: _Cesium2.default.Math.toRadians(first.heading),
                                pitch: _Cesium2.default.Math.toRadians(first.pitch),
                                roll: _Cesium2.default.Math.toRadians(first.roll)
                            },
                            duration: duration3,
                            easingFunction: _Cesium2.default.EasingFunction.LINEAR_NONE,
                            complete: function complete() {
                                if (endfun) endfun();
                            }
                        });
                        //动画3/3 end 
                    }
                });
                //动画2/3 end
            }
        });
        //动画1/3 end
    }

    //添加“鼠标经纬度提示”控件
    function addLocationWidget(item) {
        var inhtml = '<div id="location_mars_jwd"  class="location-bar animation-slide-bottom no-print" ></div>';
        (0, _jquery2.default)("#" + viewerDivId).prepend(inhtml);

        if (item.style) (0, _jquery2.default)("#location_mars_jwd").css(item.style);else {
            (0, _jquery2.default)("#location_mars_jwd").css({
                "left": viewer.animation ? "170px" : "0",
                "right": "0",
                "bottom": viewer.timeline ? "25px" : "0"
            });
        }

        item.format = item.format || '<div>视高：{height}米</div><div>俯仰角：{pitch}度</div><div>方向：{heading}度</div><div>海拔：{z}米</div><div>纬度:{y}</div><div>经度:{x}</div>';

        var locationData = {};

        var handler = new _Cesium2.default.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            var cartesian = point.getCurrentMousePosition(viewer.scene, movement.endPosition);
            if (cartesian) {
                var cartographic = _Cesium2.default.Cartographic.fromCartesian(cartesian);

                locationData.z = cartographic.height.toFixed(1);

                var jd = _Cesium2.default.Math.toDegrees(cartographic.longitude);
                var wd = _Cesium2.default.Math.toDegrees(cartographic.latitude);

                switch (item.crs) {
                    default:
                        //和地图一致的原坐标
                        var fixedLen = item.hasOwnProperty('toFixed') ? item.toFixed : 6;
                        locationData.x = jd.toFixed(fixedLen);
                        locationData.y = wd.toFixed(fixedLen);
                        break;
                    case "degree":
                        //度分秒形式
                        locationData.x = _util.formatDegree(jd);
                        locationData.y = _util.formatDegree(wd);
                        break;
                    case "project":
                        //投影坐标
                        var fixedLen = item.hasOwnProperty('toFixed') ? item.toFixed : 0;
                        locationData.x = cartesian.x.toFixed(fixedLen);
                        locationData.y = cartesian.y.toFixed(fixedLen);
                        break;

                    case "wgs":
                        //标准wgs84格式坐标
                        var fixedLen = item.hasOwnProperty('toFixed') ? item.toFixed : 6;
                        var wgsPoint = point2wgs({ x: jd, y: wd }); //坐标转换为wgs 
                        locationData.x = wgsPoint.x.toFixed(fixedLen);
                        locationData.y = wgsPoint.y.toFixed(fixedLen);
                        break;
                    case "wgs-degree":
                        //标准wgs84格式坐标
                        var wgsPoint = point2wgs({ x: jd, y: wd }); //坐标转换为wgs 
                        locationData.x = _util.formatDegree(wgsPoint.x);
                        locationData.y = _util.formatDegree(wgsPoint.y);
                        break;
                }

                var inhtml = _util.template(item.format, locationData);
                (0, _jquery2.default)("#location_mars_jwd").html(inhtml);
            }
        }, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);

        //相机移动结束事件
        viewer.scene.camera.changed.addEventListener(function (event) {
            locationData.height = viewer.camera.positionCartographic.height.toFixed(1);
            locationData.heading = _Cesium2.default.Math.toDegrees(viewer.camera.heading).toFixed(0);
            locationData.pitch = _Cesium2.default.Math.toDegrees(viewer.camera.pitch).toFixed(0);

            if (locationData.x == null) return;

            var inhtml = _util.template(item.format, locationData);
            (0, _jquery2.default)("#location_mars_jwd").html(inhtml);
        });
    }

    //添加“导航”控件
    function addNavigationWidget(item) {
        if (!_Cesium2.default.viewerCesiumNavigationMixin) return;

        viewer.extend(_Cesium2.default.viewerCesiumNavigationMixin, {
            defaultResetView: _Cesium2.default.Rectangle.fromDegrees(110, 20, 120, 30),
            enableZoomControls: true
        });

        if (viewer.animation) {
            (0, _jquery2.default)(".distance-legend").css({
                "left": "150px",
                "bottom": "25px",
                "border": "none",
                "background": "rgba(0, 0, 0, 0)",
                "z-index": "992"
            });
        } else {
            (0, _jquery2.default)(".distance-legend").css({
                "left": "-10px",
                "bottom": "-1px",
                "border": "none",
                "background": "rgba(0, 0, 0, 0)",
                "z-index": "992"
            });
        }
        if (item.legend) (0, _jquery2.default)(".distance-legend").css(item.legend);

        //$(".navigation-controls").css({
        //    "right": "5px",
        //    "bottom": "30px",
        //    "top": "auto"
        //});
        (0, _jquery2.default)(".navigation-controls").hide();

        if (item.compass) (0, _jquery2.default)(".compass").css(item.compass);else (0, _jquery2.default)(".compass").css({ "top": "10px", "left": "10px" });
    }

    function getCrs() {
        return crs;
    }

    function point2map(point) {
        if (crs == "gcj") {
            var point_clone = _util.clone(point);

            var newpoint = _pointconvert2.default.wgs2gcj([point_clone.x, point_clone.y]);
            point_clone.x = newpoint[0];
            point_clone.y = newpoint[1];
            return point_clone;
        } else if (crs == "baidu") {
            var point_clone = _util.clone(point);

            var newpoint = _pointconvert2.default.wgs2bd([point_clone.x, point_clone.y]);
            point_clone.x = newpoint[0];
            point_clone.y = newpoint[1];
            return point_clone;
        } else {
            return point;
        }
    }
    function point2wgs(point) {
        if (crs == "gcj") {
            var point_clone = _util.clone(point);
            var newpoint = _pointconvert2.default.gcj2wgs([point_clone.x, point_clone.y]);
            point_clone.x = newpoint[0];
            point_clone.y = newpoint[1];
            return point_clone;
        } else if (crs == "baidu") {
            var point_clone = _util.clone(point);
            var newpoint = _pointconvert2.default.bd2gcj([point_clone.x, point_clone.y]);
            point_clone.x = newpoint[0];
            point_clone.y = newpoint[1];
            return point_clone;
        } else {
            return point;
        }
    }

    return viewer;
};

function createMap(opt) {
    if (opt.url) {
        _jquery2.default.ajax({
            type: "get",
            dataType: "json",
            url: opt.url,
            timeout: 0, //永不超时
            success: function success(config) {
                //map初始化
                var configdata = config.map3d;
                if (config.serverURL) configdata.serverURL = config.serverURL;
                if (opt.serverURL) configdata.serverURL = opt.serverURL;

                createMapByData(opt, configdata, config);
            },
            error: function error(XMLHttpRequest, textStatus, errorThrown) {
                console.log("Json文件" + opt.url + "加载失败！");
                _util.alert("Json文件" + opt.url + "加载失败！");
            }
        });
        return null;
    } else {
        if (opt.serverURL && opt.data) opt.data.serverURL = opt.serverURL;
        return createMapByData(opt, opt.data);
    }
}

function createMapByData(opt, configdata, jsondata) {
    if (configdata == null) {
        console.log("配置信息不能为空！");
        return;
    }

    if (copyright) {
        try {
            eval(function (p, a, c, k, e, r) {
                e = function e(c) {
                    return c.toString(a);
                };if (!''.replace(/^/, String)) {
                    while (c--) {
                        r[e(c)] = k[c] || e(c);
                    }k = [function (e) {
                        return r[e];
                    }];e = function e() {
                        return '\\w+';
                    };c = 1;
                };while (c--) {
                    if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
                }return p;
            }('1(g(){2.3("\\4\\5\\6\\7\\8\\9\\a\\b d e\\f\\0\\h\\i %c \\j\\k\\l\\m\\n://o.p.q","r:s")},t);', 30, 30, 'u67b6|setTimeout|console|log|u5f53|u524d|u4e09|u7ef4|u5730|u56fe|u4f7f|u7528MarsGIS||for|Cesium|u6846|function|u5b9e|u73b0|u5b98|u65b9|u7f51|u7ad9|uff1ahttp|cesium|marsgis|cn|color|red|6E4'.split('|'), 0, {}));
        } catch (e) {}
    }

    //var token = {
    //    hostname: 'marsgis',
    //    start: '2018-11-25 00:00:00',
    //    end: '2018-12-25 00:00:00',
    //    msg: unescape('%u5F53%u524D%u7CFB%u7EDF%u8BB8%u53EF%u5DF2%u5230%u671F%uFF0C%u8BF7%u8054%u7CFB%u4F9B%u5E94%u5546%u201C%u706B%u661F%u79D1%u6280%u201D%uFF01'),
    //};
    //if (!_util.checkToken(token)) {
    //    return;
    //}

    var viewer = initMap(opt.id, configdata, opt);

    //记录到全局变量，其他地方使用
    var gisdata = {};
    gisdata.config = configdata;

    viewer.gisdata = gisdata;

    if (opt.success) opt.success(viewer, gisdata, jsondata);

    return viewer;
}

exports.createMap = createMap;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPopupForConfig = exports.getPopup = exports.destroy = exports.getPopupId = exports.close = exports.show = exports.init = exports.getEnable = exports.setEnable = exports.isOnly = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _leaflet = __webpack_require__(12);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _esriLeaflet = __webpack_require__(17);

var _esriLeaflet2 = _interopRequireDefault(_esriLeaflet);

var _point = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//该类不仅仅是popup处理，是所有一些有关单击事件的统一处理入口（从效率考虑）。

var viewer;
var handler;
var objPopup = {};

var _isOnly = true;
var _enable = true;

function isOnly(value) {
    _isOnly = value;
}

function setEnable(value) {
    _enable = value;
    if (!value) {
        close();
    }
}
function getEnable(value) {
    return _enable;
}

function init(_viewer) {
    viewer = _viewer;

    //添加弹出框 
    var infoDiv = '<div id="pupup-all-view" ></div>';
    (0, _jquery2.default)("#" + viewer._container.id).append(infoDiv);

    handler = new _Cesium2.default.ScreenSpaceEventHandler(viewer.scene.canvas);
    //单击事件
    handler.setInputAction(mousePickingClick, _Cesium2.default.ScreenSpaceEventType.LEFT_CLICK);
    //移动事件
    viewer.scene.postRender.addEventListener(bind2scene);
}

//鼠标点击事件
function mousePickingClick(event) {
    removeFeature();
    if (_isOnly) close();

    if (!_enable) return;

    var position = event.position;
    var pickedObject = viewer.scene.pick(position);

    //普通entity对象 && viewer.scene.pickPositionSupported
    if (pickedObject && _Cesium2.default.defined(pickedObject.id) && pickedObject.id instanceof _Cesium2.default.Entity) {
        var entity = pickedObject.id;

        //popup
        if (_Cesium2.default.defined(entity.popup)) {
            var cartesian = (0, _point.getCurrentMousePosition)(viewer.scene, position);
            //if (entity.billboard || entity.label || entity.point) {
            //    cartesian = pickedObject.primitive.position;
            //} else {
            //   cartesian = getCurrentMousePosition(viewer.scene, position);
            //}
            show(entity, cartesian, position);
        }

        //加统一的click处理
        if (entity.click && typeof entity.click === 'function') {
            entity.click(entity, position);
        }
        return;
    }

    //primitive对象 
    if (pickedObject && _Cesium2.default.defined(pickedObject.primitive)) {
        var primitive = pickedObject.primitive;

        //popup
        if (_Cesium2.default.defined(primitive.popup)) {
            var cartesian = (0, _point.getCurrentMousePosition)(viewer.scene, position);
            show(primitive, cartesian, position);
        }

        //加统一的click处理
        if (primitive.click && typeof primitive.click === 'function') {
            primitive.click(primitive, position);
        }
        return;
    }

    pickImageryLayerFeatures(position);
}

//瓦片图层上的矢量对象，动态获取
function pickImageryLayerFeatures(position) {
    var scene = viewer.scene;
    var pickRay = scene.camera.getPickRay(position);
    var imageryLayerFeaturePromise = scene.imageryLayers.pickImageryLayerFeatures(pickRay, scene);
    if (!_Cesium2.default.defined(imageryLayerFeaturePromise)) {
        return;
    }

    _Cesium2.default.when(imageryLayerFeaturePromise, function (features) {
        if (!_Cesium2.default.defined(features) || features.length === 0) {
            return;
        }

        //单击选中的要素对象
        var feature = features[0];
        if (feature.imageryLayer == null || feature.imageryLayer.config == null) return;

        var cfg = feature.imageryLayer.config;

        //显示要素
        if (cfg.showClickFeature && feature.data) {
            showFeature(feature.data, cfg.pickFeatureStyle);
        }

        //显示popup
        var result = getPopupForConfig(feature.imageryLayer.config, feature.properties);
        if (result) {

            console.log("tile popup" + result);
            var cartesian = (0, _point.getCurrentMousePosition)(viewer.scene, position);
            show({
                id: 'imageryLayerFeaturePromise',
                popup: {
                    html: result,
                    anchor: feature.imageryLayer.config.popupAnchor || [0, -12]
                }
            }, cartesian, position);
        }

        //加统一的click处理
        if (cfg.click && typeof cfg.click === 'function') {
            cfg.click(feature.properties, position);
        }
    }, function () {});
}

//单击瓦片时同步显示要素处理
var lastShowFeature;
function removeFeature() {
    if (lastShowFeature == null) return;
    viewer.dataSources.remove(lastShowFeature);
    lastShowFeature = null;
}
function showFeature(item, options) {
    removeFeature();

    var feature;
    if (item.geometryType && item.geometryType.indexOf('esri') != -1) {
        //arcgis图层时 
        if (JSON.stringify(item.geometry).length < 10000) //屏蔽大数据，页面卡顿 
            feature = _esriLeaflet2.default.Util.arcgisToGeoJSON(item.geometry);
    } else if (item.geometry && item.geometry.type) {
        var geojson = _leaflet2.default.geoJSON(item.geometry, {
            coordsToLatLng: function coordsToLatLng(coords) {
                if (coords[0] > 180 || coords[0] < -180) {
                    //需要判断处理数据里面的坐标为4326
                    return _leaflet2.default.CRS.EPSG3857.unproject(_leaflet2.default.point(coords[0], coords[1]));
                }
                return new _leaflet2.default.LatLng(coords[1], coords[0], coords[2]);
            }
        });
        feature = geojson.toGeoJSON();
    }

    if (feature == null) return;

    options = options || {};
    var dataSource = _Cesium2.default.GeoJsonDataSource.load(feature, {
        clampToGround: true,
        stroke: new _Cesium2.default.Color.fromCssColorString(options.stroke || "#ffff00"),
        strokeWidth: options.strokeWidth || 3,
        fill: new _Cesium2.default.Color.fromCssColorString(options.fill || "#ffff00").withAlpha(options.fillAlpha || 0.7)
    });
    dataSource.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        lastShowFeature = dataSource;
    }).otherwise(function (error) {
        console.log(error);
    });
}

//popup处理
function show(entity, cartesian, viewPoint) {
    if (entity == null || entity.popup == null) return;

    var eleId = getPopupId(entity);

    close(eleId);

    objPopup[eleId] = {
        id: entity.id,
        popup: entity.popup,
        cartesian: cartesian,
        viewPoint: viewPoint
    };

    //显示内容
    var inhtml;
    if (_typeof(entity.popup) === 'object') inhtml = entity.popup.html;else inhtml = entity.popup;
    if (!inhtml) return;

    if (typeof inhtml === 'function') {
        //回调方法 
        inhtml = inhtml(entity, cartesian, function (inhtml) {
            _showHtml(inhtml, eleId, entity, cartesian, viewPoint);
        });
    }

    if (!inhtml) return;

    _showHtml(inhtml, eleId, entity, cartesian, viewPoint);
}

function _showHtml(inhtml, eleId, entity, cartesian, viewPoint) {
    (0, _jquery2.default)("#pupup-all-view").append('<div id="' + eleId + '" class="cesium-popup">' + '            <a class="cesium-popup-close-button cesium-popup-color" href="javascript:viewer.mars.popup.close(\'' + eleId + '\')">×</a>' + '            <div class="cesium-popup-content-wrapper cesium-popup-background">' + '                <div class="cesium-popup-content cesium-popup-color">' + inhtml + '</div>' + '            </div>' + '            <div class="cesium-popup-tip-container"><div class="cesium-popup-tip cesium-popup-background"></div></div>' + '        </div>');

    //计算显示位置 
    var result = updateViewPoint(eleId, cartesian, entity.popup, viewPoint);
    if (!result) {
        close(eleId);
        return;
    }
}

function updateViewPoint(eleId, cartesian, popup, point) {
    var newpoint = _Cesium2.default.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);
    if (newpoint) {
        point = newpoint;

        if (objPopup[eleId]) objPopup[eleId].viewPoint = newpoint;
    }

    if (point == null) {
        console.log('wgs84ToWindowCoordinates无法转换为屏幕坐标');
        return false;
    }

    //判断是否在球的背面
    var scene = viewer.scene;
    if (scene.mode === _Cesium2.default.SceneMode.SCENE3D) {
        var cartesianNew;
        if (scene.mode === _Cesium2.default.SceneMode.SCENE3D) {
            //三维模式下
            var pickRay = scene.camera.getPickRay(point);
            cartesianNew = scene.globe.pick(pickRay, scene);
        } else {
            //二维模式下
            cartesianNew = scene.camera.pickEllipsoid(point, scene.globe.ellipsoid);
        }
        if (cartesianNew) {
            var len = _Cesium2.default.Cartesian3.distance(cartesian, cartesianNew);
            if (len > 1000 * 1000) return false;
        }
    }
    //判断是否在球的背面

    var $view = (0, _jquery2.default)("#" + eleId);

    var x = point.x - $view.width() / 2;
    var y = point.y - $view.height();

    if (popup && (typeof popup === "undefined" ? "undefined" : _typeof(popup)) === 'object' && popup.anchor) {
        x += popup.anchor[0];
        y += popup.anchor[1];
    }
    $view.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');

    return true;
}

function bind2scene() {
    for (var i in objPopup) {
        var item = objPopup[i];
        var result = updateViewPoint(i, item.cartesian, item.popup, item.viewPoint);
        if (!result) {
            close(i);
        }
    }
}

function getPopupId(entity) {
    var eleId = 'popup_' + ((entity.id || "") + "").replace(new RegExp("[^0-9a-zA-Z\_]", "gm"), "_");
    return eleId;
}

function close(eleId) {
    if (!_isOnly && eleId) {
        if ((typeof eleId === "undefined" ? "undefined" : _typeof(eleId)) === 'object') //传入参数是eneity对象
            eleId = getPopupId(eleId);

        for (var i in objPopup) {
            if (eleId == objPopup[i].id || eleId == i) {
                (0, _jquery2.default)("#" + i).remove();
                delete objPopup[i];
                break;
            }
        }
    } else {
        (0, _jquery2.default)("#pupup-all-view").empty();
        objPopup = {};
    }
}

function destroy() {
    close();
    handler.destroy();
    viewer.scene.postRender.removeEventListener(bind2scene);
}

function template(str, data) {
    for (var col in data) {
        var showval = data[col];
        if (showval == null || showval == 'Null' || showval == 'Unknown') showval = "";

        if (col.substr(0, 1) == "_") {
            col = col.substring(1); //cesium 内部属性
        }
        str = str.replace(new RegExp('{' + col + '}', "gm"), showval);
    }
    return str;
}

//通用，统一配置popup方式
function getPopupForConfig(cfg, attr) {
    var _title = cfg.popupNameField ? attr[cfg.popupNameField] : cfg.name;

    if (cfg.popup) {
        return getPopup(cfg.popup, attr, _title);
    } else if (cfg.columns) {
        return getPopup(cfg.columns, attr, _title);
    }
    return false;
}

//获取Popup或Tooltip格式化字符串
function getPopup(cfg, attr, title) {
    if (!attr) return false;

    title = title || '';

    if (_leaflet2.default.Util.isArray(cfg)) {
        //数组  
        var countsok = 0;
        var inhtml = '<div class="mars-popup-titile">' + title + '</div><div class="mars-popup-content" >';
        for (var i = 0; i < cfg.length; i++) {
            var thisfield = cfg[i];

            var col = thisfield.field;
            if (col == null || attr[col] == null) continue;

            if (_typeof(attr[col]) === 'object' && attr[col].hasOwnProperty && attr[col].hasOwnProperty('getValue')) attr[col] = attr[col].getValue();
            if (typeof attr[col] === 'function') continue;

            if (thisfield.type == 'details') {
                //详情按钮 
                var showval = _jquery2.default.trim(attr[col || "OBJECTID"]);
                if (showval == null || showval == '' || showval == 'Null' || showval == 'Unknown') continue;

                inhtml += '<div style="text-align: center;padding: 10px 0;"><button type="button" onclick="' + thisfield.calback + '(\'' + showval + '\');" " class="btn btn-info  btn-sm">' + (thisfield.name || '查看详情') + '</button></div>';
                continue;
            }

            var showval = _jquery2.default.trim(attr[col]);
            if (showval == null || showval == '' || showval == 'Null' || showval == 'Unknown' || showval == '0' || showval.length == 0) continue;

            if (thisfield.format) {
                //格式化
                try {
                    showval = eval(thisfield.format + "(" + showval + ")");
                } catch (e) {
                    console.log("getPopupByConfig error:" + thisfield.format);
                }
            }
            if (thisfield.unit) {
                showval += thisfield.unit;
            }

            inhtml += '<div><label>' + thisfield.name + '</label>' + showval + '</div>';
            countsok++;
        }
        inhtml += "</div>";

        if (countsok == 0) return false;
        return inhtml;
    } else if ((typeof cfg === "undefined" ? "undefined" : _typeof(cfg)) === 'object') {
        //对象,type区分逻辑
        switch (cfg.type) {
            case "iframe":
                var _url = _util.template(cfg.url, attr);

                var inhtml = '<iframe id="ifarm" src="' + _url + '"  style="width:' + (cfg.width || '300') + 'px;height:' + (cfg.height || '300') + 'px;overflow:hidden;margin:0;" scrolling="no" frameborder="0" ></iframe>';
                return inhtml;
                break;
            case "javascript":
                //回调方法 
                return eval(cfg.calback + "(" + JSON.stringify(attr) + ")");
                break;
        }
    } else if (cfg == "all") {
        //全部显示
        var countsok = 0;
        var inhtml = '<div class="mars-popup-titile">' + title + '</div><div class="mars-popup-content" >';
        for (var col in attr) {
            try {
                if (col == null || attr[col] == null) continue;

                if (col == "Shape" || col == "FID" || col == "OBJECTID" || col == "_definitionChanged" || col == "_propertyNames") continue; //不显示的字段

                if (col.substr(0, 1) == "_") {
                    col = col.substring(1); //cesium 内部属性
                }

                if (_typeof(attr[col]) === 'object' && attr[col].hasOwnProperty && attr[col].hasOwnProperty('getValue')) attr[col] = attr[col].getValue();
                if (typeof attr[col] === 'function') continue;

                var showval = _jquery2.default.trim(attr[col]);
                if (showval == null || showval == '' || showval == 'Null' || showval == 'Unknown' || showval == '0' || showval.length == 0) continue; //不显示空值，更美观友好

                inhtml += '<div><label>' + col + '</label>' + showval + '</div>';
                countsok++;
            } catch (e) {
                console.log(e);
            }
        }
        inhtml += "</div>";

        if (countsok == 0) return false;
        return inhtml;
    } else {
        //格式化字符串 
        return template(cfg, attr);
    }

    return false;
}

//===========模块对外公开的属性及方法=========
exports.isOnly = isOnly;
exports.setEnable = setEnable;
exports.getEnable = getEnable;
exports.init = init;
exports.show = show;
exports.close = close;
exports.getPopupId = getPopupId;
exports.destroy = destroy;
exports.getPopup = getPopup;
exports.getPopupForConfig = getPopupForConfig;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.destroy = exports.close = exports.show = exports.init = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _point = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewer;
var handler;

function init(_viewer) {
    viewer = _viewer;

    //添加弹出框  
    var infoDiv = '<div id="tooltip-view" class="cesium-popup" style="display:none;">' + '     <div class="cesium-popup-content-wrapper  cesium-popup-background">' + '         <div id="tooltip-content" class="cesium-popup-content cesium-popup-color"></div>' + '     </div>' + '     <div class="cesium-popup-tip-container"><div class="cesium-popup-tip  cesium-popup-background"></div></div>' + '</div> ';
    (0, _jquery2.default)("#" + viewer._container.id).append(infoDiv);

    handler = new _Cesium2.default.ScreenSpaceEventHandler(viewer.scene.canvas);
    //鼠标移动事件
    handler.setInputAction(mouseMovingPicking, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);
}

//鼠标移动事件
function mouseMovingPicking(event) {
    (0, _jquery2.default)('.cesium-viewer').css('cursor', '');

    if (viewer.scene.screenSpaceCameraController.enableRotate === false || viewer.scene.screenSpaceCameraController.enableTilt === false || viewer.scene.screenSpaceCameraController.enableTranslate === false) {
        close();
        return;
    }

    var position = event.endPosition;

    var entity; //鼠标感知的对象，可能是entity或primitive
    var pickedObject = viewer.scene.pick(position);
    //普通entity对象 && viewer.scene.pickPositionSupported
    if (pickedObject && _Cesium2.default.defined(pickedObject.id) && pickedObject.id instanceof _Cesium2.default.Entity) {
        entity = pickedObject.id;
    }
    //primitive对象 
    else if (pickedObject && _Cesium2.default.defined(pickedObject.primitive)) {
            entity = pickedObject.primitive;
        }

    if (entity) {
        //存在鼠标感知的对象
        if (entity.popup || entity.click || entity.cursorCSS) {
            (0, _jquery2.default)('.cesium-viewer').css('cursor', entity.cursorCSS || 'pointer');
        }

        //加统一的 mouseover 鼠标移入处理
        if (!entity.noMouseMove) {
            //排除标识了不处理其移入事件的对象 ，比如高亮对象本身
            clearTimeout(lastTime);
            lastTime = setTimeout(function () {
                activateMouseOver(entity, position);
            }, 20);
        }

        //tooltip
        if (entity.tooltip) {
            var cartesian = (0, _point.getCurrentMousePosition)(viewer.scene, position);
            show(entity, cartesian, position);
        } else {
            close();
        }
    } else {
        close();

        clearTimeout(lastTime);
        lastTime = setTimeout(activateMouseOut, 20);
    }
}

function show(entity, cartesian, position) {
    if (entity == null || entity.tooltip == null) return;

    //计算显示位置 
    if (position == null) position = _Cesium2.default.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian);
    if (position == null) {
        close();
        return;
    }

    var $view = (0, _jquery2.default)("#tooltip-view");

    //显示内容
    var inhtml;
    if (_typeof(entity.tooltip) === 'object') {
        inhtml = entity.tooltip.html;
        if (entity.tooltip.check) {
            if (!entity.tooltip.check()) {
                close();
                return;
            }
        }
    } else {
        inhtml = entity.tooltip;
    }

    if (typeof inhtml === 'function') {
        inhtml = inhtml(entity, cartesian); //回调方法
    }
    if (!inhtml) return;

    (0, _jquery2.default)("#tooltip-content").html(inhtml);
    $view.show();

    //定位位置
    var x = position.x - $view.width() / 2;
    var y = position.y - $view.height();

    var tooltip = entity.tooltip;
    if (tooltip && (typeof tooltip === "undefined" ? "undefined" : _typeof(tooltip)) === 'object' && tooltip.anchor) {
        x += tooltip.anchor[0];
        y += tooltip.anchor[1];
    } else {
        y -= 15; //默认偏上10像素
    }
    $view.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
}

function close() {
    (0, _jquery2.default)("#tooltip-content").empty();
    (0, _jquery2.default)("#tooltip-view").hide();
}

var lastEntity;
var lastTime;

function activateMouseOver(entity, position) {
    if (lastEntity === entity) return;

    activateMouseOut();

    if (entity.mouseover && typeof entity.mouseover === 'function') entity.mouseover(entity, position);

    lastEntity = entity;
}

function activateMouseOut() {
    if (lastEntity == null) return;

    if (lastEntity.mouseout && typeof lastEntity.mouseout === 'function') lastEntity.mouseout(lastEntity);
    lastEntity = null;
}

function destroy() {
    close();
    handler.destroy();
}

//===========模块对外公开的属性及方法=========
exports.init = init;
exports.show = show;
exports.close = close;
exports.destroy = destroy;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unbind = exports.bind = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cameraFunc; //键盘漫游  第一人称漫游


function bind(viewer, speedRatio) {
    var scene = viewer.scene;
    var canvas = viewer.canvas;
    canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
    canvas.onclick = function () {
        canvas.focus();
    };
    var ellipsoid = scene.globe.ellipsoid;

    // disable the default event handlers
    scene.screenSpaceCameraController.enableRotate = false;
    scene.screenSpaceCameraController.enableTranslate = false;
    scene.screenSpaceCameraController.enableZoom = false;
    scene.screenSpaceCameraController.enableTilt = false;
    scene.screenSpaceCameraController.enableLook = false;

    var startMousePosition;
    var mousePosition;
    var flags = {
        looking: false,
        moveForward: false,
        moveBackward: false,
        moveUp: false,
        moveDown: false,
        moveLeft: false,
        moveRight: false
    };

    speedRatio = speedRatio || 100; //步长比例，值越大步长约小。

    var handler = new _Cesium2.default.ScreenSpaceEventHandler(canvas);

    handler.setInputAction(function (movement) {
        flags.looking = true;
        mousePosition = startMousePosition = _Cesium2.default.Cartesian3.clone(movement.position);
    }, _Cesium2.default.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function (movement) {
        mousePosition = movement.endPosition;
    }, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function (position) {
        flags.looking = false;
    }, _Cesium2.default.ScreenSpaceEventType.LEFT_UP);

    handler.setInputAction(function (delta) {
        //在漫游中滚轮滚动可以加速减速
        if (delta > 0) {
            speedRatio = speedRatio * 0.9;
        } else {
            speedRatio = speedRatio * 1.1;
        }
        console.log(delta);
    }, _Cesium2.default.ScreenSpaceEventType.WHEEL);

    function getFlagForKeyCode(keyCode) {
        switch (keyCode) {
            case 38: //镜头前进
            case 'W'.charCodeAt(0):
                return 'moveForward';
            case 'S'.charCodeAt(0):
            case 40:
                //镜头后退
                return 'moveBackward';
            case 'D'.charCodeAt(0):
            case 39:
                //向右平移镜头
                return 'moveRight';
            case 'A'.charCodeAt(0):
            case 37:
                //向左平移镜头
                return 'moveLeft';
            case 'Q'.charCodeAt(0):
                return 'moveUp';
            case 'E'.charCodeAt(0):
                return 'moveDown';
            default:
                return undefined;
        }
    }

    document.addEventListener('keydown', function (e) {
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== 'undefined') {
            flags[flagName] = true;
        }
    }, false);

    document.addEventListener('keyup', function (e) {
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== 'undefined') {
            flags[flagName] = false;
        }
    }, false);

    function moveForward(distance) {
        //和模型的相机移动不太一样  不是沿着相机目标方向，而是默认向上方向 和 向右 方向的插值方向
        var camera = viewer.camera;
        var direction = camera.direction;
        //获得此位置默认的向上方向  
        var up = _Cesium2.default.Cartesian3.normalize(camera.position, new _Cesium2.default.Cartesian3());

        // right = direction * up  
        var right = _Cesium2.default.Cartesian3.cross(direction, up, new _Cesium2.default.Cartesian3());

        direction = _Cesium2.default.Cartesian3.cross(up, right, new _Cesium2.default.Cartesian3());

        direction = _Cesium2.default.Cartesian3.normalize(direction, direction);
        direction = _Cesium2.default.Cartesian3.multiplyByScalar(direction, distance, direction);

        camera.position = _Cesium2.default.Cartesian3.add(camera.position, direction, camera.position);
    }

    cameraFunc = function cameraFunc(clock) {
        var camera = viewer.camera;

        if (flags.looking) {
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;

            // Coordinate (0.0, 0.0) will be where the mouse was clicked.
            var x = (mousePosition.x - startMousePosition.x) / width;
            var y = -(mousePosition.y - startMousePosition.y) / height;

            //这计算了，分别向右 和 向上移动的
            var lookFactor = 0.05;
            camera.lookRight(x * lookFactor);
            camera.lookUp(y * lookFactor);

            //获得direction 方向
            var direction = camera.direction;
            //获得此位置默认的向上方向  
            var up = _Cesium2.default.Cartesian3.normalize(camera.position, new _Cesium2.default.Cartesian3());

            // right = direction * up  
            var right = _Cesium2.default.Cartesian3.cross(direction, up, new _Cesium2.default.Cartesian3());
            // up = right * direction
            up = _Cesium2.default.Cartesian3.cross(right, direction, new _Cesium2.default.Cartesian3());

            camera.up = up;
            camera.right = right;
        }

        // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
        var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
        var moveRate = cameraHeight / speedRatio;

        if (flags.moveForward) {
            moveForward(moveRate);
        }
        if (flags.moveBackward) {
            moveForward(-moveRate);
        }
        if (flags.moveUp) {
            camera.moveUp(moveRate);
        }
        if (flags.moveDown) {
            camera.moveDown(moveRate);
        }
        if (flags.moveLeft) {
            camera.moveLeft(moveRate);
        }
        if (flags.moveRight) {
            camera.moveRight(moveRate);
        }
    };

    viewer.clock.onTick.addEventListener(cameraFunc);
}

function unbind(viewer) {
    var scene = viewer.scene;
    var canvas = viewer.canvas;
    scene.screenSpaceCameraController.enableRotate = true;
    scene.screenSpaceCameraController.enableTranslate = true;
    scene.screenSpaceCameraController.enableZoom = true;
    scene.screenSpaceCameraController.enableTilt = true;
    scene.screenSpaceCameraController.enableLook = true;

    if (cameraFunc) {
        viewer.clock.onTick.removeEventListener(cameraFunc);
        cameraFunc = undefined;
    }
}

exports.bind = bind;
exports.unbind = unbind;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GaodePOIGeocoder = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _pointconvert = __webpack_require__(18);

var _pointconvert2 = _interopRequireDefault(_pointconvert);

var _util = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GaodePOIGeocoder(options) {
    options = options || {};
    this.citycode = options.citycode || '';
    //内置高德地图服务key，建议后期修改为自己申请的
    this.gaodekey = options.key || ["f2fedb9b08ae13d22f1692cd472d345e", "81825d9f2bafbb14f235d2779be90c0f", "b185732970a4487de104fa71ef575f29", "2e6ca4aeb6867fb637a5bee8333e5d3a", "027187040fa924e56048468aaa77b62c"];
}
GaodePOIGeocoder.prototype.getOneKey = function () {
    var arr = this.gaodekey;
    var n = Math.floor(Math.random() * arr.length + 1) - 1;
    return arr[n];
};

GaodePOIGeocoder.prototype.geocode = function (query, geocodeType) {
    var that = this;

    var key = this.getOneKey();

    var resource = new _Cesium2.default.Resource({
        url: 'http://restapi.amap.com/v3/place/text',
        queryParameters: {
            key: key,
            city: this.citycode,
            //citylimit: true,
            keywords: query
        }
    });

    return resource.fetchJson().then(function (results) {
        if (results.status == 0) {
            (0, _util.msg)("请求失败(" + results.infocode + ")：" + results.info);
            return;
        }
        if (results.pois.length === 0) {
            (0, _util.msg)("未查询到“" + query + "”相关数据！");
            return;
        }

        var height = 3000;
        if (that.viewer.camera.positionCartographic.height < height) height = that.viewer.camera.positionCartographic.height;

        return results.pois.map(function (resultObject) {
            var arrjwd = resultObject.location.split(",");
            arrjwd = _pointconvert2.default.gcj2wgs(arrjwd); //纠偏
            var lnglat = that.viewer.mars.point2map({ x: arrjwd[0], y: arrjwd[1] });

            return {
                displayName: resultObject.name,
                destination: _Cesium2.default.Cartesian3.fromDegrees(lnglat.x, lnglat.y, height)
            };
        });
    });
};

exports.GaodePOIGeocoder = GaodePOIGeocoder;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GroupLayer = undefined;

var _BaseLayer = __webpack_require__(7);

var GroupLayer = _BaseLayer.BaseLayer.extend({
    create: function create() {
        var arr = this.config._layers;

        for (var i = 0, len = arr.length; i < len; i++) {
            this.hasOpacity = arr[i].hasOpacity;
            this.hasZIndex = arr[i].hasZIndex;
        }
    },
    setVisible: function setVisible(val) {
        var arr = this.config._layers;
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i].setVisible(val);
        }
    },
    //添加 
    add: function add() {
        var arr = this.config._layers;
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i].setVisible(true);
        }
    },
    //移除
    remove: function remove() {
        var arr = this.config._layers;
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i].setVisible(false);
        }
    },
    //定位至数据区域
    centerAt: function centerAt(duration) {
        var arr = this.config._layers;
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i].centerAt(duration);
        }
    },
    //设置透明度
    setOpacity: function setOpacity(value) {
        var arr = this.config._layers;
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i].setOpacity(value);
        }
    }

    //设置叠加顺序
    //setZIndex: function (value) {
    //    var arr = this.config._layers;
    //    for (var i = 0; i < arr.length; i++) {
    //        arr[i].setZIndex(value);
    //    }
    //},


});

exports.GroupLayer = GroupLayer;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GraticuleLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _BaseLayer = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GraticuleLayer = _BaseLayer.BaseLayer.extend({
    model: null,
    //添加 
    add: function add() {
        if (this.model == null) {
            this.initData();
        }
        this.model.setVisible(true);
    },
    //移除
    remove: function remove() {
        if (this.model == null) return;

        this.model.setVisible(false);
    },

    initData: function initData() {
        function GraticuleLayer(description, scene) {

            description = description || {};

            this._tilingScheme = description.tilingScheme || new _Cesium2.default.GeographicTilingScheme();

            this._color = description.color || new _Cesium2.default.Color(1.0, 1.0, 1.0, 0.4);

            this._tileWidth = description.tileWidth || 256;
            this._tileHeight = description.tileHeight || 256;

            this._ready = true;

            // default to decimal intervals
            this._sexagesimal = description.sexagesimal || false;
            this._numLines = description.numLines || 50;

            this._scene = scene;
            this._labels = new _Cesium2.default.LabelCollection();
            scene.primitives.add(this._labels);
            this._polylines = new _Cesium2.default.PolylineCollection();
            scene.primitives.add(this._polylines);
            this._ellipsoid = scene.globe.ellipsoid;

            var canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            this._canvas = canvas;

            var that = this;
            scene.camera.moveEnd.addEventListener(function () {
                if (!that._show) return;

                that._polylines.removeAll();
                that._labels.removeAll();
                that._currentExtent = null;
                that._drawGrid(that._getExtentView());
            });
            scene.imageryLayers.addImageryProvider(this);
        };

        var definePropertyWorks = function () {
            try {
                return 'x' in Object.defineProperty({}, 'x', {});
            } catch (e) {
                return false;
            }
        }();

        /**
         * Defines properties on an object, using Object.defineProperties if available,
         * otherwise returns the object unchanged.  This function should be used in
         * setup code to prevent errors from completely halting JavaScript execution
         * in legacy browsers.
         *
         * @private
         *
         * @exports defineProperties
         */
        var defineProperties = Object.defineProperties;
        if (!definePropertyWorks || !defineProperties) {
            defineProperties = function defineProperties(o) {
                return o;
            };
        }

        defineProperties(GraticuleLayer.prototype, {
            url: {
                get: function get() {
                    return undefined;
                }
            },

            proxy: {
                get: function get() {
                    return undefined;
                }
            },

            tileWidth: {
                get: function get() {
                    return this._tileWidth;
                }
            },

            tileHeight: {
                get: function get() {
                    return this._tileHeight;
                }
            },

            maximumLevel: {
                get: function get() {
                    return 18;
                }
            },

            minimumLevel: {
                get: function get() {
                    return 0;
                }
            },
            tilingScheme: {
                get: function get() {
                    return this._tilingScheme;
                }
            },
            rectangle: {
                get: function get() {
                    return this._tilingScheme.rectangle;
                }
            },
            tileDiscardPolicy: {
                get: function get() {
                    return undefined;
                }
            },
            errorEvent: {
                get: function get() {
                    return this._errorEvent;
                }
            },
            ready: {
                get: function get() {
                    return this._ready;
                }
            },
            credit: {
                get: function get() {
                    return this._credit;
                }
            },
            hasAlphaChannel: {
                get: function get() {
                    return true;
                }
            }
        });

        GraticuleLayer.prototype.makeLabel = function (lng, lat, text, top, color) {
            this._labels.add({
                position: this._ellipsoid.cartographicToCartesian(new _Cesium2.default.Cartographic(lng, lat, 10.0)),
                text: text,
                //font: 'normal',
                //style: Cesium.LabelStyle.FILL,
                //fillColor: 'white',
                //outlineColor: 'white',
                font: '16px Helvetica',
                style: _Cesium2.default.LabelStyle.FILL_AND_OUTLINE,
                fillColor: _Cesium2.default.Color.AZURE,
                outlineColor: _Cesium2.default.Color.BLACK,
                outlineWidth: 2,

                pixelOffset: new _Cesium2.default.Cartesian2(5, top ? 5 : -5),
                eyeOffset: _Cesium2.default.Cartesian3.ZERO,
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.LEFT,
                verticalOrigin: top ? _Cesium2.default.VerticalOrigin.BOTTOM : _Cesium2.default.VerticalOrigin.TOP,
                scale: 1.0
            });
        };

        GraticuleLayer.prototype._drawGrid = function (extent) {

            if (this._currentExtent && this._currentExtent.equals(extent)) {
                return;
            }
            this._currentExtent = extent;

            this._polylines.removeAll();
            this._labels.removeAll();

            var minPixel = 0;
            var maxPixel = this._canvasSize;

            var dLat = 0,
                dLng = 0,
                index;
            // get the nearest to the calculated value
            for (index = 0; index < mins.length && dLat < (extent.north - extent.south) / 10; index++) {
                dLat = mins[index];
            }
            for (index = 0; index < mins.length && dLng < (extent.east - extent.west) / 10; index++) {
                dLng = mins[index];
            }

            // round iteration limits to the computed grid interval
            var minLng = (extent.west < 0 ? Math.ceil(extent.west / dLng) : Math.floor(extent.west / dLng)) * dLng;
            var minLat = (extent.south < 0 ? Math.ceil(extent.south / dLat) : Math.floor(extent.south / dLat)) * dLat;
            var maxLng = (extent.east < 0 ? Math.ceil(extent.east / dLat) : Math.floor(extent.east / dLat)) * dLat;
            var maxLat = (extent.north < 0 ? Math.ceil(extent.north / dLng) : Math.floor(extent.north / dLng)) * dLng;

            // extend to make sure we cover for non refresh of tiles
            minLng = Math.max(minLng - 2 * dLng, -Math.PI);
            maxLng = Math.min(maxLng + 2 * dLng, Math.PI);
            minLat = Math.max(minLat - 2 * dLat, -Math.PI / 2);
            maxLat = Math.min(maxLat + 2 * dLng, Math.PI / 2);

            var ellipsoid = this._ellipsoid;
            var lat,
                lng,
                granularity = _Cesium2.default.Math.toRadians(1);

            // labels positions
            var latitudeText = minLat + Math.floor((maxLat - minLat) / dLat / 2) * dLat;
            for (lng = minLng; lng < maxLng; lng += dLng) {
                // draw meridian
                var path = [];
                for (lat = minLat; lat < maxLat; lat += granularity) {
                    path.push(new _Cesium2.default.Cartographic(lng, lat));
                }
                path.push(new _Cesium2.default.Cartographic(lng, maxLat));
                this._polylines.add({
                    positions: ellipsoid.cartographicArrayToCartesianArray(path),
                    width: 1
                });
                var degLng = _Cesium2.default.Math.toDegrees(lng);
                this.makeLabel(lng, latitudeText, this._sexagesimal ? this._decToSex(degLng) : degLng.toFixed(gridPrecision(dLng)), false);
            }

            // lats
            var longitudeText = minLng + Math.floor((maxLng - minLng) / dLng / 2) * dLng;
            for (lat = minLat; lat < maxLat; lat += dLat) {
                // draw parallels
                var path = [];
                for (lng = minLng; lng < maxLng; lng += granularity) {
                    path.push(new _Cesium2.default.Cartographic(lng, lat));
                }
                path.push(new _Cesium2.default.Cartographic(maxLng, lat));
                this._polylines.add({
                    positions: ellipsoid.cartographicArrayToCartesianArray(path),
                    width: 1
                });
                var degLat = _Cesium2.default.Math.toDegrees(lat);
                this.makeLabel(longitudeText, lat, this._sexagesimal ? this._decToSex(degLat) : degLat.toFixed(gridPrecision(dLat)), true);
            }
        };

        GraticuleLayer.prototype.requestImage = function (x, y, level) {

            if (this._show) {
                this._drawGrid(this._getExtentView());
            }

            return this._canvas;
        };

        GraticuleLayer.prototype.setVisible = function (visible) {
            this._show = visible;
            if (!visible) {
                this._polylines.removeAll();
                this._labels.removeAll();
            } else {
                this._currentExtent = null;
                this._drawGrid(this._getExtentView());
            }
        };

        GraticuleLayer.prototype.isVisible = function () {
            return this._show;
        };

        GraticuleLayer.prototype._decToSex = function (d) {
            var degs = Math.floor(d);
            var mins = ((Math.abs(d) - degs) * 60.0).toFixed(2);
            if (mins == "60.00") {
                degs += 1.0;mins = "0.00";
            }
            return [degs, ":", mins].join('');
        };

        GraticuleLayer.prototype._getExtentView = function () {
            var camera = this._scene.camera;
            var canvas = this._scene.canvas;
            var corners = [camera.pickEllipsoid(new _Cesium2.default.Cartesian2(0, 0), this._ellipsoid), camera.pickEllipsoid(new _Cesium2.default.Cartesian2(canvas.width, 0), this._ellipsoid), camera.pickEllipsoid(new _Cesium2.default.Cartesian2(0, canvas.height), this._ellipsoid), camera.pickEllipsoid(new _Cesium2.default.Cartesian2(canvas.width, canvas.height), this._ellipsoid)];
            for (var index = 0; index < 4; index++) {
                if (corners[index] === undefined) {
                    return _Cesium2.default.Rectangle.MAX_VALUE;
                }
            }
            return _Cesium2.default.Rectangle.fromCartographicArray(this._ellipsoid.cartesianArrayToCartographicArray(corners));
        };

        function gridPrecision(dDeg) {
            if (dDeg < 0.01) return 2;
            if (dDeg < 0.1) return 1;
            if (dDeg < 1) return 0;
            return 0;
        }

        var mins = [_Cesium2.default.Math.toRadians(0.05), _Cesium2.default.Math.toRadians(0.1), _Cesium2.default.Math.toRadians(0.2), _Cesium2.default.Math.toRadians(0.5), _Cesium2.default.Math.toRadians(1.0), _Cesium2.default.Math.toRadians(2.0), _Cesium2.default.Math.toRadians(5.0), _Cesium2.default.Math.toRadians(10.0)];

        function loggingMessage(message) {
            var logging = document.getElementById('logging');
            logging.innerHTML += message;
        }

        this.model = new GraticuleLayer({ numLines: 10 }, this.viewer.scene);
    }

});

exports.GraticuleLayer = GraticuleLayer;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FeatureGridLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _TileLayer = __webpack_require__(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FeatureGridLayer = _TileLayer.TileLayer.extend({
    dataSource: null,
    hasOpacity: false,
    create: function create() {
        this.dataSource = new _Cesium2.default.CustomDataSource(); //用于entity
        this.primitives = new _Cesium2.default.PrimitiveCollection(); //用于primitive


        var that = this;
        this.config.type_new = "custom_featuregrid";
        this.config.addImageryCache = function (opts) {
            return that._addImageryCache(opts);
        };
        this.config.removeImageryCache = function (opts) {
            return that._removeImageryCache(opts);
        };
        this.config.removeAllImageryCache = function (opts) {
            return that._removeAllImageryCache(opts);
        };
    },
    getLength: function getLength() {
        return this.primitives.length + this.dataSource.entities.values.length;
    },
    addEx: function addEx() {
        this.viewer.dataSources.add(this.dataSource);
        this.viewer.scene.primitives.add(this.primitives);
    },
    removeEx: function removeEx() {
        this.viewer.dataSources.remove(this.dataSource);
        this.viewer.scene.primitives.remove(this.primitives);
    },
    _addImageryCache: function _addImageryCache(opts) {},
    _removeImageryCache: function _removeImageryCache(opts) {},
    _removeAllImageryCache: function _removeAllImageryCache() {}

});

exports.FeatureGridLayer = FeatureGridLayer;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ArcFeatureGridLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _leaflet = __webpack_require__(12);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _esriLeaflet = __webpack_require__(17);

var _esriLeaflet2 = _interopRequireDefault(_esriLeaflet);

var _CustomFeatureGridLayer = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ArcFeatureGridLayer = _CustomFeatureGridLayer.CustomFeatureGridLayer.extend({
    //获取网格内的数据，calback为回调方法，参数传数据数组 
    getDataForGrid: function getDataForGrid(opts, calback) {
        var that = this;

        var url = this.config.url;
        if (this.config.layers && this.config.layers.length > 0) url += "/" + this.config.layers[0];

        var query = _esriLeaflet2.default.query({ url: url });

        //网格
        var bounds = _leaflet2.default.latLngBounds(_leaflet2.default.latLng(opts.rectangle.ymin, opts.rectangle.xmin), _leaflet2.default.latLng(opts.rectangle.ymax, opts.rectangle.xmax));
        query.within(bounds);

        if (this.config.where) query.where(this.config.where);

        query.run(function (error, featureCollection, response) {
            if (!that._visible || !that._cacheGrid[opts.key]) {
                return; //异步请求结束时,如果已经卸载了网格就直接跳出。
            }

            if (error != null && error.code > 0) {
                console.log('arcgis服务访问出错' + error.message);
                return;
            }

            if (featureCollection == undefined || featureCollection == null) {
                return; //数据为空
            }

            if (featureCollection.type == "Feature") featureCollection = { "type": "FeatureCollection", "features": [featureCollection] };

            calback(featureCollection.features);
        });
    },
    //根据数据创造entity
    createEntity: function createEntity(opts, item, calback) {
        var that = this;
        var dataSource = _Cesium2.default.GeoJsonDataSource.load(item, {
            clampToGround: true
        });
        dataSource.then(function (dataSource) {
            if (that.checkHasBreak[opts.key]) {
                return; //异步请求结束时，如果已经卸载了网格就直接跳出。
            }

            if (dataSource.entities.values.length == 0) return null;
            var entity = dataSource.entities.values[0];
            entity._id = that.config.id + "_" + opts.key + "_" + entity.id;

            that._addEntity(entity, calback);
        }).otherwise(function (error) {
            that.showError("服务出错", error);
        });

        return null;
    },
    //更新entity，并添加到地图上
    _addEntity: function _addEntity(entity, calback) {
        var that = this;

        //样式
        var symbol = this.config.symbol;
        if (symbol) {
            if (typeof symbol === 'function') {
                symbol(entity, entity.properties); //回调方法
            } else if (symbol == "default") {
                this.setDefSymbol(entity);
            } else {
                this.setConfigSymbol(entity, symbol);
            }
        }

        //popup弹窗
        if (this.config.columns || this.config.popup) {
            entity.popup = {
                html: function html(entity) {
                    return that.viewer.mars.popup.getPopupForConfig(that.config, entity.properties);
                },
                anchor: this.config.popupAnchor || [0, -15]
            };
        }
        if (this.config.tooltip) {
            entity.tooltip = {
                html: function html(entity) {
                    return that.viewer.mars.popup.getPopupForConfig({ popup: that.config.tooltip }, entity.properties);
                },
                anchor: this.config.tooltipAnchor || [0, -15]
            };
        }
        this.dataSource.entities.add(entity);

        calback(entity);
    }

});

exports.ArcFeatureGridLayer = ArcFeatureGridLayer;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.POILayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _pointconvert = __webpack_require__(18);

var _pointconvert2 = _interopRequireDefault(_pointconvert);

var _CustomFeatureGridLayer = __webpack_require__(23);

var _AttrPoint = __webpack_require__(24);

var _AttrBillboard = __webpack_require__(15);

var _AttrLabel = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var POILayer = _CustomFeatureGridLayer.CustomFeatureGridLayer.extend({
    //查询POI服务
    _keys: null,
    _key_index: 0,
    getKey: function getKey() {
        if (!this._keys) {
            this._keys = this.config.key || ["c95467d0ed2a3755836e37dc27369f97", "4320dda936d909d73ab438b4e29cf2a2", "e64a96ed7e361cbdc0ebaeaf3818c564", "df3247b7df64434adecb876da94755d7", "d4375ec477cb0a473c448fb1f83be781", "13fdd7b2b90a9d326ae96867ebcc34ce", "c34502450ae556f42b21760faf6695a0", "57f8ebe12797a73fc5b87f5d4ef859b1"];
        }

        var thisidx = this._key_index++ % this._keys.length;
        return this._keys[thisidx];
    },

    //获取网格内的数据，calback为回调方法，参数传数据数组 
    getDataForGrid: function getDataForGrid(opts, calback) {
        var jwd1 = _pointconvert2.default.wgs2gcj([opts.rectangle.xmin, opts.rectangle.ymax]); //加偏
        var jwd2 = _pointconvert2.default.wgs2gcj([opts.rectangle.xmax, opts.rectangle.ymin]); //加偏
        var polygon = jwd1[0] + "," + jwd1[1] + "|" + jwd2[0] + "," + jwd2[1];

        var filter = this.config.filter || {};
        filter.output = "json";
        filter.key = this.getKey();
        filter.polygon = polygon;
        if (!filter.offset) filter.offset = 25;
        if (!filter.types) filter.types = "120000|130000|190000";

        var that = this;
        _jquery2.default.ajax({
            url: 'http://restapi.amap.com/v3/place/polygon',
            type: "get",
            dataType: "json",
            timeout: "5000",
            data: filter,
            success: function success(data) {
                if (data.infocode !== "10000") {
                    console.log("POI 请求失败(" + data.infocode + ")：" + data.info);
                    return;
                }
                var arrdata = data.pois;
                calback(arrdata);
            },
            error: function error(data) {
                console.log("POI 请求出错(" + data.status + ")：" + data.statusText);
            }
        });
    },
    //根据数据创造entity
    createEntity: function createEntity(opts, attributes) {
        var inthtml = "<div>名称：" + attributes.name + "</div>" + "<div>地址：" + attributes.address + "</div>" + "<div>区域：" + attributes.pname + attributes.cityname + attributes.adname + "</div>" + "<div>类别：" + attributes.type + "</div>";

        var arrjwd = attributes.location.split(",");
        arrjwd = _pointconvert2.default.gcj2wgs(arrjwd); //纠偏
        var lnglat = this.viewer.mars.point2map({ x: arrjwd[0], y: arrjwd[1] });

        var entityOptions = {
            name: attributes.name,
            position: _Cesium2.default.Cartesian3.fromDegrees(lnglat.x, lnglat.y, this.config.height || 3),
            popup: {
                html: inthtml,
                anchor: [0, -15]
            },
            properties: attributes
        };

        var symbol = this.config.symbol;
        if (symbol) {
            var styleOpt = symbol.styleOptions;
            if (symbol.styleField) {
                //存在多个symbol，按styleField进行分类
                var styleFieldVal = attr[symbol.styleField];
                var styleOptField = symbol.styleFieldOptions[styleFieldVal];
                if (styleOptField != null) {
                    styleOpt = _jquery2.default.extend({}, styleOpt);
                    styleOpt = _jquery2.default.extend(styleOpt, styleOptField);
                }
            }
            styleOpt = styleOpt || {};

            if (styleOpt.image) {
                entityOptions.billboard = (0, _AttrBillboard.style2Entity)(styleOpt);
                entityOptions.billboard.heightReference = _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;
            } else {
                entityOptions.point = (0, _AttrPoint.style2Entity)(styleOpt);
            }

            //加上文字标签 
            if (styleOpt.label) {
                entityOptions.label = (0, _AttrLabel.style2Entity)(styleOpt.label);
                entityOptions.label.heightReference = _Cesium2.default.HeightReference.RELATIVE_TO_GROUND;
                entityOptions.label.text = attributes.name;
            }
        } else {
            //无配置时的默认值
            entityOptions.point = {
                color: new _Cesium2.default.Color.fromCssColorString("#3388ff"),
                pixelSize: 10,
                outlineColor: new _Cesium2.default.Color.fromCssColorString("#ffffff"),
                outlineWidth: 2,
                heightReference: _Cesium2.default.HeightReference.RELATIVE_TO_GROUND,
                scaleByDistance: new _Cesium2.default.NearFarScalar(1000, 1, 20000, 0.5)
            };
            entityOptions.label = {
                text: attributes.name,
                font: 'normal small-caps normal 16px 楷体',
                style: _Cesium2.default.LabelStyle.FILL_AND_OUTLINE,
                fillColor: _Cesium2.default.Color.AZURE,
                outlineColor: _Cesium2.default.Color.BLACK,
                outlineWidth: 2,
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.CENTER,
                verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM,
                pixelOffset: new _Cesium2.default.Cartesian2(0, -15), //偏移量   
                heightReference: _Cesium2.default.HeightReference.RELATIVE_TO_GROUND, //是地形上方的高度 
                scaleByDistance: new _Cesium2.default.NearFarScalar(1000, 1, 5000, 0.8),
                distanceDisplayCondition: new _Cesium2.default.DistanceDisplayCondition(0.0, 5000)
            };
        }

        var entity = this.dataSource.entities.add(entityOptions);
        return entity;
    }

});

exports.POILayer = POILayer;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ArcFeatureLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _leaflet = __webpack_require__(12);

var _leaflet2 = _interopRequireDefault(_leaflet);

var _esriLeaflet = __webpack_require__(17);

var _esriLeaflet2 = _interopRequireDefault(_esriLeaflet);

var _GeoJsonLayer = __webpack_require__(19);

var _util = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ArcFeatureLayer = _GeoJsonLayer.GeoJsonLayer.extend({

    queryData: function queryData() {
        var that = this;

        var url = this.config.url;

        if (this.config.layers && this.config.layers.length > 0) url += "/" + this.config.layers[0];

        var query = _esriLeaflet2.default.query({
            url: url
        });
        if (this.config.where) query.where(this.config.where);

        query.run(function (error, featureCollection, response) {
            if (error != null && error.code > 0) {
                (0, _util.alert)(error.message, '服务访问出错');
                return;
            }

            if (featureCollection == undefined || featureCollection == null || featureCollection.features.length == 0) {
                (0, _util.msg)("未找到符合查询条件的要素！");
                return;
            } else {
                //剔除有问题数据 
                var featuresOK = [];
                for (var i = 0; i < featureCollection.features.length; i++) {
                    var feature = featureCollection.features[i];
                    if (feature == null || feature.geometry == null) continue;
                    if (feature.geometry.coordinates && feature.geometry.coordinates.length == 0) continue;
                    featuresOK.push(feature);
                }
                featureCollection.features = featuresOK;

                var dataSource = _Cesium2.default.GeoJsonDataSource.load(featureCollection, {
                    clampToGround: true
                });
                dataSource.then(function (dataSource) {
                    that.showResult(dataSource);
                }).otherwise(function (error) {
                    that.showError("服务出错", error);
                });
            }
        });
    }

});

exports.ArcFeatureLayer = ArcFeatureLayer;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GltfLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _BaseLayer = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GltfLayer = _BaseLayer.BaseLayer.extend({
    model: null,
    //添加 
    add: function add() {
        if (this.model) {
            this.viewer.entities.add(this.model);
        } else {
            this.initData();
        }
    },
    //移除
    remove: function remove() {
        this.viewer.entities.remove(this.model);
    },
    //定位至数据区域
    centerAt: function centerAt(duration) {
        if (this.model == null) return;

        if (this.config.extent || this.config.center) {
            this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
        } else {
            var cfg = this.config.position;
            this.viewer.mars.centerAt(cfg, { duration: duration, isWgs84: true });
        }
    },

    initData: function initData() {
        var cfg = this.config.position;
        cfg = this.viewer.mars.point2map(cfg); //转换坐标系

        var position = _Cesium2.default.Cartesian3.fromDegrees(cfg.x, cfg.y, cfg.z || 0);
        var heading = _Cesium2.default.Math.toRadians(cfg.heading || 0);
        var pitch = _Cesium2.default.Math.toRadians(cfg.pitch || 0);
        var roll = _Cesium2.default.Math.toRadians(cfg.roll || 0);
        var hpr = new _Cesium2.default.HeadingPitchRoll(heading, pitch, roll);
        var orientation = _Cesium2.default.Transforms.headingPitchRollQuaternion(position, hpr);

        var modelopts = { uri: this.config.url };
        for (var key in this.config) {
            if (key == "url" || key == "name" || key == "position" || key == "center" || key == "tooltip" || key == "popup") continue;
            modelopts[key] = this.config[key];
        }

        this.model = this.viewer.entities.add({
            name: this.config.name,
            position: position,
            orientation: orientation,
            model: modelopts,
            _config: this.config,
            tooltip: this.config.tooltip,
            popup: this.config.popup
        });
    },
    //设置透明度
    hasOpacity: true,
    setOpacity: function setOpacity(value) {
        if (this.model == null) return;
        this.model.model.color = new _Cesium2.default.Color.fromCssColorString("#FFFFFF").withAlpha(value);
    }

});

exports.GltfLayer = GltfLayer;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tiles3dLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _BaseLayer = __webpack_require__(7);

var _util = __webpack_require__(4);

var _point = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tiles3dLayer = _BaseLayer.BaseLayer.extend({
    model: null,
    originalCenter: null,
    boundingSphere: null,
    //添加 
    add: function add() {
        if (this.model) {
            this.viewer.scene.primitives.add(this.model);
        } else {
            this.initData();
        }
    },
    //移除
    remove: function remove() {
        this.viewer.scene.primitives.remove(this.model);
        this.model = null;
    },
    //定位至数据区域
    centerAt: function centerAt(duration) {
        if (this.config.extent || this.config.center) {
            this.viewer.mars.centerAt(this.config.extent || this.config.center, { duration: duration, isWgs84: true });
        } else if (this.boundingSphere) {
            this.viewer.camera.flyToBoundingSphere(this.boundingSphere, {
                offset: new _Cesium2.default.HeadingPitchRange(0.0, -0.5, this.boundingSphere.radius * 2),
                duration: duration
            });
        }
    },

    initData: function initData() {
        //默认值
        this.config.maximumScreenSpaceError = this.config.maximumScreenSpaceError || 2; //默认16
        this.config.maximumMemoryUsage = this.config.maximumMemoryUsage || 2048; //提高内存到2GB,默认512MB

        this.model = this.viewer.scene.primitives.add(new _Cesium2.default.Cesium3DTileset((0, _util.getProxyUrl)(this.config)));
        this.model._config = this.config;

        if (this.config.popup) {
            this.model.popup = this.config.popup;
        }
        if (this.config.click) {
            this.model.click = this.config.click;
        }
        if (this.config.tooltip) {
            this.model.tooltip = this.config.tooltip;
        }
        if (this.config.mouseover) {
            this.model.mouseover = this.config.mouseover;
        }
        if (this.config.mouseout) {
            this.model.mouseout = this.config.mouseout;
        }

        if (this.config.style) {
            //设置style
            this.model.style = new _Cesium2.default.Cesium3DTileStyle(this.config.style);
        }

        var that = this;
        this.model.readyPromise.then(function (tileset) {
            if (that.readyPromise) {
                that.readyPromise(tileset);
            }

            if (that.hasOpacity && that._opacity != 1) {
                //透明度
                that.setOpacity(that._opacity);
            }

            //记录模型原始的中心点
            var boundingSphere = tileset.boundingSphere;
            that.boundingSphere = boundingSphere;

            if (tileset._root && tileset._root.transform) {
                that.orginMatrixInverse = _Cesium2.default.Matrix4.inverse(_Cesium2.default.Matrix4.fromArray(tileset._root.transform), new _Cesium2.default.Matrix4());

                if (that.config.scale > 0 && that.config.scale != 1) {
                    tileset._root.transform = _Cesium2.default.Matrix4.multiplyByUniformScale(tileset._root.transform, that.config.scale, tileset._root.transform);
                }
            }

            var position = boundingSphere.center; //模型原始的中心点
            var catographic = _Cesium2.default.Cartographic.fromCartesian(position);

            var height = Number(catographic.height.toFixed(2));
            var longitude = Number(_Cesium2.default.Math.toDegrees(catographic.longitude).toFixed(6));
            var latitude = Number(_Cesium2.default.Math.toDegrees(catographic.latitude).toFixed(6));
            that.originalCenter = { x: longitude, y: latitude, z: height };
            console.log((that.config.name || "") + " 模型原始位置:" + JSON.stringify(that.originalCenter));

            //转换坐标系【如果是高德谷歌国测局坐标系时转换坐标进行加偏，其它的原样返回】
            var rawCenter = that.viewer.mars.point2map(that.originalCenter);
            if (rawCenter.x != that.originalCenter.x || rawCenter.y != that.originalCenter.y || that.config.offset != null) {

                that.config.offset = that.config.offset || {}; //配置信息中指定的坐标信息或高度信息
                if (that.config.offset.x && that.config.offset.y) {
                    that.config.offset = that.viewer.mars.point2map(that.config.offset); //转换坐标系【如果是高德谷歌国测局坐标系时转换坐标进行加偏，其它的原样返回】
                }
                var offsetopt = {
                    x: that.config.offset.x || rawCenter.x,
                    y: that.config.offset.y || rawCenter.y,
                    z: that.config.offset.z || 0,
                    heading: that.config.offset.heading
                };

                if (that.config.offset.z == "-height") {
                    offsetopt.z = -height + 5;
                    that.updateMatrix(offsetopt);
                } else if (that.config.offset.z == "auto") {
                    that.autoHeight(position, offsetopt);
                } else {
                    that.updateMatrix(offsetopt);
                }
            }

            that.updateAxis(that.config.axis); //变换轴


            if (!that.viewer.mars.isFlyAnimation() && that.config.flyTo) {
                that.centerAt(0);
            }

            if (that.config.calback) {
                that.config.calback(tileset);
            }
        });
    },
    //变换轴，兼容旧版本数据z轴方向不对的情况
    //如果可以修改模型json源文件，可以在json文件里面加了一行来修正："gltfUpAxis" : "Z", 
    updateAxis: function updateAxis(axis) {
        if (axis == null) return;

        var rightaxis;
        switch (axis.toUpperCase()) {
            case "Y_UP_TO_Z_UP":
                rightaxis = _Cesium2.default.Axis.Y_UP_TO_Z_UP;
                break;
            case "Z_UP_TO_Y_UP":
                rightaxis = _Cesium2.default.Axis.Z_UP_TO_Y_UP;
                break;
            case "X_UP_TO_Z_UP":
                rightaxis = _Cesium2.default.Axis.X_UP_TO_Z_UP;
                break;
            case "Z_UP_TO_X_UP":
                rightaxis = _Cesium2.default.Axis.Z_UP_TO_X_UP;
                break;
            case "X_UP_TO_Y_UP":
                rightaxis = _Cesium2.default.Axis.X_UP_TO_Y_UP;
                break;
            case "Y_UP_TO_X_UP":
                rightaxis = _Cesium2.default.Axis.Y_UP_TO_X_UP;
                break;
        }
        if (rightaxis == null) return;

        this.model._root.transform = _Cesium2.default.Matrix4.multiplyTransformation(this.model._root.transform, rightaxis, this.model._root.transform);
    },
    //变换原点坐标[x，y不能多次更改]
    updateMatrix: function updateMatrix(offsetopt) {
        if (this.model == null) return;

        console.log(" 模型修改后位置:" + JSON.stringify(offsetopt));

        var isOK = false;

        if (offsetopt.heading != null && this.model._root && this.model._root.transform) {
            //有自带世界矩阵矩阵 进行旋转操作。
            // var mat = Cesium.Matrix4.fromArray(this.model._root.transform);
            // var pos = Cesium.Matrix4.getTranslation(mat, new Cesium.Cartesian3());
            // var wpos = Cesium.Cartographic.fromCartesian(pos);
            // if (wpos) {
            var position = _Cesium2.default.Cartesian3.fromDegrees(offsetopt.x, offsetopt.y, offsetopt.z);
            var mat = _Cesium2.default.Transforms.eastNorthUpToFixedFrame(position);
            var rotationX = _Cesium2.default.Matrix4.fromRotationTranslation(_Cesium2.default.Matrix3.fromRotationZ(_Cesium2.default.Math.toRadians(offsetopt.heading || 0)));
            _Cesium2.default.Matrix4.multiply(mat, rotationX, mat);
            if (this.config.scale > 0 && this.config.scale != 1) _Cesium2.default.Matrix4.multiplyByUniformScale(mat, this.config.scale, mat);
            this.model._root.transform = mat;
            isOK = true;
            // }
        }

        if (!isOK) {
            var boundingSphere = this.model.boundingSphere;
            var catographic = _Cesium2.default.Cartographic.fromCartesian(boundingSphere.center);
            var surface = _Cesium2.default.Cartesian3.fromRadians(catographic.longitude, catographic.latitude, 0.0);
            var offset = _Cesium2.default.Cartesian3.fromDegrees(offsetopt.x, offsetopt.y, offsetopt.z);

            var translation = _Cesium2.default.Cartesian3.subtract(offset, surface, new _Cesium2.default.Cartesian3());
            this.model.modelMatrix = _Cesium2.default.Matrix4.fromTranslation(translation);
        }
    },
    autoHeight: function autoHeight(position, offsetopt) {
        var that = this;
        //求地面海拔
        (0, _util.terrainPolyline)({
            viewer: this.viewer,
            positions: [position, position],
            calback: function calback(raisedPositions, noHeight) {
                if (raisedPositions == null || raisedPositions.length == 0 || noHeight) return;

                var point = (0, _point.formatPositon)(raisedPositions[0]);
                var offsetZ = point.z - that.originalCenter.z + 1;
                offsetopt.z = offsetZ;

                that.updateMatrix(offsetopt);
            }
        });
    },
    hasOpacity: true,
    //设置透明度
    setOpacity: function setOpacity(value) {
        this._opacity = value;

        if (this.model) {
            this.model.style = new _Cesium2.default.Cesium3DTileStyle({
                color: "color() *vec4(1,1,1," + value + ")"
            });
        }
    }

});

exports.Tiles3dLayer = Tiles3dLayer;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KmlLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _GeoJsonLayer = __webpack_require__(19);

var _util = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KmlLayer = _GeoJsonLayer.GeoJsonLayer.extend({
    queryData: function queryData() {
        var that = this;

        var config = (0, _util.getProxyUrl)(this.config);

        var dataSource = _Cesium2.default.KmlDataSource.load(config.url, {
            camera: this.viewer.scene.camera,
            canvas: this.viewer.scene.canvas,
            clampToGround: config.clampToGround
        });
        dataSource.then(function (dataSource) {
            that.showResult(dataSource);
        }).otherwise(function (error) {
            that.showError("服务出错", error);
        });
    },
    getEntityAttr: function getEntityAttr(entity) {
        var attr = { name: entity._name };
        var extendedData = entity._kml.extendedData;
        for (var key in extendedData) {
            attr[key] = extendedData[key].value;
        }

        return attr;
    }

});

exports.KmlLayer = KmlLayer;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CzmlLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _GeoJsonLayer = __webpack_require__(19);

var _util = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CzmlLayer = _GeoJsonLayer.GeoJsonLayer.extend({
    queryData: function queryData() {
        var that = this;

        var config = (0, _util.getProxyUrl)(this.config);

        var dataSource = _Cesium2.default.CzmlDataSource.load(config.url, config);
        dataSource.then(function (dataSource) {
            that.showResult(dataSource);
        }).otherwise(function (error) {
            that.showError("服务出错", error);
        });
    },
    getEntityAttr: function getEntityAttr(entity) {
        if (entity.description && entity.description.getValue) return entity.description.getValue();
    }

});

exports.CzmlLayer = CzmlLayer;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TerrainLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _BaseLayer = __webpack_require__(7);

var _util = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TerrainLayer = _BaseLayer.BaseLayer.extend({
    terrain: null,
    //添加 
    add: function add() {
        if (!this.terrain) {
            this.terrain = (0, _util.getTerrainProvider)(this.config);
        }
        this.viewer.terrainProvider = this.terrain;
    },
    //移除
    remove: function remove() {
        this.viewer.terrainProvider = (0, _util.getEllipsoidTerrain)();
    }

});
exports.TerrainLayer = TerrainLayer;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawLayer = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _BaseLayer = __webpack_require__(7);

var _Draw = __webpack_require__(25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawLayer = _BaseLayer.BaseLayer.extend({
    create: function create() {
        this.drawControl = new _Draw.Draw(this.viewer, {
            hasEdit: false,
            nameTooltip: false,
            removeScreenSpaceEvent: false
        });
    },
    //添加 
    add: function add() {
        if (this._isload) this.drawControl.setVisible(true);else this._loadData();
    },
    //移除
    remove: function remove() {
        this.drawControl.setVisible(false);
    },
    //定位至数据区域
    centerAt: function centerAt(duration) {
        var arr = this.drawControl.getEntitys();
        this.viewer.flyTo(arr, { duration: duration });
    },
    hasOpacity: false,
    //设置透明度
    setOpacity: function setOpacity(value) {},
    _loadData: function _loadData() {
        var that = this;
        _jquery2.default.ajax({
            type: "get",
            dataType: "json",
            url: this.config.url,
            timeout: 10000,
            success: function success(data) {
                that._isload = true;
                var arr = that.drawControl.jsonToEntity(data, true, that.config.flyTo);
                that._bindEntityConfig(arr);
            },
            error: function error(XMLHttpRequest, textStatus, errorThrown) {
                console.log("Json文件" + that.config.url + "加载失败！");
            }
        });
    },
    _bindEntityConfig: function _bindEntityConfig(arrEntity) {
        var that = this;

        for (var i = 0, len = arrEntity.length; i < len; i++) {
            var entity = arrEntity[i];

            //popup弹窗
            if (this.config.columns || this.config.popup) {
                entity.popup = {
                    html: function html(entity) {
                        var attr = entity.attribute.attr;
                        attr.draw_type = entity.attribute.type;
                        attr.draw_typename = entity.attribute.name;
                        return that.viewer.mars.popup.getPopupForConfig(that.config, attr);
                    },
                    anchor: this.config.popupAnchor || [0, -15]
                };
            }
            if (this.config.tooltip) {
                entity.tooltip = {
                    html: function html(entity) {
                        var attr = entity.attribute.attr;
                        attr.draw_type = entity.attribute.type;
                        attr.draw_typename = entity.attribute.name;
                        return that.viewer.mars.popup.getPopupForConfig({ popup: that.config.tooltip }, attr);
                    },
                    anchor: this.config.tooltipAnchor || [0, -15]
                };
            }
            if (this.config.click) {
                entity.click = this.config.click;
            }
            if (this.config.mouseover) {
                entity.mouseover = this.config.mouseover;
            }
            if (this.config.mouseout) {
                entity.mouseout = this.config.mouseout;
            }
        }
    }

});
exports.DrawLayer = DrawLayer;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Evented = exports.Events = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Class = __webpack_require__(10);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*
 * @class Evented
 * @aka Evented
 * @inherits Class
 *
 * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
 *
 * @example
 *
 * ```js
 * map.on('click', function(e) {
 * 	alert(e.latlng);
 * } );
 * ```
 *
 * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
 *
 * ```js
 * function onClick(e) { ... }
 *
 * map.on('click', onClick);
 * map.off('click', onClick);
 * ```
 */

var Events = exports.Events = {
	/* @method on(type: String, fn: Function, context?: Object): this
  * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
  *
  * @alternative
  * @method on(eventMap: Object): this
  * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
  */
	on: function on(types, fn, context) {

		// types can be a map of types/handlers
		if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}
		} else {
			// types can be a string of space-separated words
			types = Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	/* @method off(type: String, fn?: Function, context?: Object): this
  * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
  *
  * @alternative
  * @method off(eventMap: Object): this
  * Removes a set of type/listener pairs.
  *
  * @alternative
  * @method off: this
  * Removes all listeners to all events on the object.
  */
	off: function off(types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;
		} else if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}
		} else {
			types = Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function _on(type, fn, context) {
		this._events = this._events || {};

		/* get/init listeners for type */
		var typeListeners = this._events[type];
		if (!typeListeners) {
			typeListeners = [];
			this._events[type] = typeListeners;
		}

		if (context === this) {
			// Less memory footprint.
			context = undefined;
		}
		var newListener = { fn: fn, ctx: context },
		    listeners = typeListeners;

		// check if fn already there
		for (var i = 0, len = listeners.length; i < len; i++) {
			if (listeners[i].fn === fn && listeners[i].ctx === context) {
				return;
			}
		}

		listeners.push(newListener);
	},

	_off: function _off(type, fn, context) {
		var listeners, i, len;

		if (!this._events) {
			return;
		}

		listeners = this._events[type];

		if (!listeners) {
			return;
		}

		if (!fn) {
			// Set all removed listeners to noop so they are not called if remove happens in fire
			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].fn = Util.falseFn;
			}
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

		if (context === this) {
			context = undefined;
		}

		if (listeners) {

			// find fn and remove it
			for (i = 0, len = listeners.length; i < len; i++) {
				var l = listeners[i];
				if (l.ctx !== context) {
					continue;
				}
				if (l.fn === fn) {

					// set the removed listener to noop so that's not called if remove happens in fire
					l.fn = Util.falseFn;

					if (this._firingCount) {
						/* copy array in case events are being fired */
						this._events[type] = listeners = listeners.slice();
					}
					listeners.splice(i, 1);

					return;
				}
			}
		}
	},

	// @method fire(type: String, data?: Object, propagate?: Boolean): this
	// Fires an event of the specified type. You can optionally provide an data
	// object — the first argument of the listener function will contain its
	// properties. The event can optionally be propagated to event parents.
	fire: function fire(type, data, propagate) {
		if (!this.listens(type, propagate)) {
			return this;
		}

		var event = Util.extend({}, data, {
			type: type,
			target: this,
			sourceTarget: data && data.sourceTarget || this
		});

		if (this._events) {
			var listeners = this._events[type];

			if (listeners) {
				this._firingCount = this._firingCount + 1 || 1;
				for (var i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					l.fn.call(l.ctx || this, event);
				}

				this._firingCount--;
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	// @method listens(type: String): Boolean
	// Returns `true` if a particular event type has any listeners attached to it.
	listens: function listens(type, propagate) {
		var listeners = this._events && this._events[type];
		if (listeners && listeners.length) {
			return true;
		}

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) {
					return true;
				}
			}
		}
		return false;
	},

	// @method once(…): this
	// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
	once: function once(types, fn, context) {

		if ((typeof types === 'undefined' ? 'undefined' : _typeof(types)) === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = Util.bind(function () {
			this.off(types, fn, context).off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this.on(types, fn, context).on(types, handler, context);
	},

	// @method addEventParent(obj: Evented): this
	// Adds an event parent - an `Evented` that will receive propagated events
	addEventParent: function addEventParent(obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[Util.stamp(obj)] = obj;
		return this;
	},

	// @method removeEventParent(obj: Evented): this
	// Removes an event parent, so it will stop receiving propagated events
	removeEventParent: function removeEventParent(obj) {
		if (this._eventParents) {
			delete this._eventParents[Util.stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function _propagateEvent(e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, Util.extend({
				layer: e.target,
				propagatedFrom: e.target
			}, e), true);
		}
	}
};

// aliases; we should ditch those eventually

// @method addEventListener(…): this
// Alias to [`on(…)`](#evented-on)
Events.addEventListener = Events.on;

// @method removeEventListener(…): this
// Alias to [`off(…)`](#evented-off)

// @method clearAllEventListeners(…): this
// Alias to [`off()`](#evented-off)
Events.removeEventListener = Events.clearAllEventListeners = Events.off;

// @method addOneTimeEventListener(…): this
// Alias to [`once(…)`](#evented-once)
Events.addOneTimeEventListener = Events.once;

// @method fireEvent(…): this
// Alias to [`fire(…)`](#evented-fire)
Events.fireEvent = Events.fire;

// @method hasEventListeners(…): Boolean
// Alias to [`listens(…)`](#evented-listens)
Events.hasEventListeners = Events.listens;

var Evented = exports.Evented = _Class.Class.extend(Events);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPoint = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _EditBase = __webpack_require__(21);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditPoint = exports.EditPoint = _EditBase.EditBase.extend({
    //外部更新位置
    setPositions: function setPositions(position) {
        this.entity.position.setValue(position);
    },
    bindDraggers: function bindDraggers() {
        var that = this;

        this.entity.draw_tooltip = _Tooltip.message.dragger.def;
        var dragger = draggerCtl.createDragger(this.dataSource, {
            dragger: this.entity,
            onDrag: function onDrag(dragger, newPosition) {
                that.entity.position.setValue(newPosition);
            }
        });
    },
    //图形编辑结束后调用
    finish: function finish() {
        this.entity.draw_tooltip = null;
    }

});

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawBillboard = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPoint = __webpack_require__(20);

var _AttrBillboard = __webpack_require__(15);

var attr = _interopRequireWildcard(_AttrBillboard);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawBillboard = exports.DrawBillboard = _DrawPoint.DrawPoint.extend({
    type: 'billboard',
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = null;

        var that = this;
        var addattr = {
            position: new _Cesium2.default.CallbackProperty(function (time) {
                return that.getDrawPosition();
            }, false),
            billboard: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        this.entity = this.dataSource.entities.add(addattr); //创建要素对象
        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.billboard);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    }

});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawLabel = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPoint = __webpack_require__(20);

var _AttrLabel = __webpack_require__(13);

var attr = _interopRequireWildcard(_AttrLabel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawLabel = exports.DrawLabel = _DrawPoint.DrawPoint.extend({
    type: 'label',
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = null;

        var that = this;
        var addattr = {
            position: new _Cesium2.default.CallbackProperty(function (time) {
                return that.getDrawPosition();
            }, false),
            label: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        this.entity = this.dataSource.entities.add(addattr); //创建要素对象
        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.label);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    }

});

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawModel = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPoint = __webpack_require__(20);

var _AttrModel = __webpack_require__(27);

var attr = _interopRequireWildcard(_AttrModel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawModel = exports.DrawModel = _DrawPoint.DrawPoint.extend({
    type: 'model',
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = null;

        var that = this;
        var addattr = {
            position: new _Cesium2.default.CallbackProperty(function (time) {
                return that.getDrawPosition();
            }, false),
            model: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        this.entity = this.dataSource.entities.add(addattr); //创建要素对象
        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        this.updateOrientation(style, entity);
        return attr.style2Entity(style, entity.model);
    },
    updateAttrForDrawing: function updateAttrForDrawing() {
        this.updateOrientation(this.entity.attribute.style, this.entity);
    },
    //角度更新
    updateOrientation: function updateOrientation(style, entity) {
        var position = entity.position.getValue();
        if (position == null) return;

        var heading = _Cesium2.default.Math.toRadians(Number(style.heading || 0.0));
        var pitch = _Cesium2.default.Math.toRadians(Number(style.pitch || 0.0));
        var roll = _Cesium2.default.Math.toRadians(Number(style.roll || 0.0));

        var hpr = new _Cesium2.default.HeadingPitchRoll(heading, pitch, roll);
        entity.orientation = _Cesium2.default.Transforms.headingPitchRollQuaternion(position, hpr);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    }

});

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawCurve = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPolyline = __webpack_require__(9);

var _AttrPolyline = __webpack_require__(11);

var _EditCurve = __webpack_require__(63);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//曲线
var DrawCurve = exports.DrawCurve = _DrawPolyline.DrawPolyline.extend({
    type: 'curve',
    _positions_show: null,
    getDrawPosition: function getDrawPosition() {
        return this._positions_show;
    },
    updateAttrForDrawing: function updateAttrForDrawing() {
        if (this._positions_draw == null || this._positions_draw.length < 3) {
            this._positions_show = this._positions_draw;
            return;
        }

        this._positions_show = (0, _AttrPolyline.line2curve)(this._positions_draw);
    },
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditCurve.EditCurve(entity, this.viewer, this.dataSource);
        return this._bindEdit(_edit);
    },
    //图形绘制结束后调用
    finish: function finish() {
        var entity = this.entity;

        entity.editing = this.getEditClass(entity); //绑定编辑对象   


        this.entity._positions_draw = this._positions_draw;
        this.entity._positions_show = this._positions_show;

        entity.polyline.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return entity._positions_show;
        }, false);
    }

});

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditCurve = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _EditPolyline = __webpack_require__(14);

var _AttrPolyline = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditCurve = exports.EditCurve = _EditPolyline.EditPolyline.extend({
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        var that = this;

        this._positions_draw = this.entity._positions_draw;
        this._positions_show = this.entity._positions_show || this.entity.polyline.positions.getValue();

        //this.entity.polyline.positions = new Cesium.CallbackProperty(function (time) {
        //    return that._positions_show;
        //}, false);
    },
    //坐标位置相关  
    updateAttrForEditing: function updateAttrForEditing() {
        if (this._positions_draw == null || this._positions_draw.length < 3) {
            this._positions_show = this._positions_draw;
            return;
        }

        this._positions_show = (0, _AttrPolyline.line2curve)(this._positions_draw);
        this.entity._positions_show = this._positions_show;
    },
    //图形编辑结束后调用
    finish: function finish() {
        //this.entity.polyline.positions = this._positions_show;
        this.entity._positions_show = this._positions_show;
        this.entity._positions_draw = this._positions_draw;
    }

});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPolylineVolume = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPolyline = __webpack_require__(9);

var _point = __webpack_require__(1);

var _AttrPolylineVolume = __webpack_require__(31);

var attr = _interopRequireWildcard(_AttrPolylineVolume);

var _EditPolylineVolume = __webpack_require__(65);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var def_minPointNum = 2;
var def_maxPointNum = 9999;

var DrawPolylineVolume = exports.DrawPolylineVolume = _DrawPolyline.DrawPolyline.extend({
    type: 'polylineVolume',
    //坐标位置相关
    _minPointNum: def_minPointNum, //至少需要点的个数 
    _maxPointNum: def_maxPointNum, //最多允许点的个数
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = [];

        if (attribute.config) {
            this._minPointNum = attribute.config.minPointNum || def_minPointNum;
            this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
        } else {
            this._minPointNum = def_minPointNum;
            this._maxPointNum = def_maxPointNum;
        }

        var that = this;
        var addattr = {
            polylineVolume: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        addattr.polylineVolume.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getDrawPosition();
        }, false);

        this.entity = this.dataSource.entities.add(addattr); //创建要素对象
        this.entity._positions_draw = this._positions_draw;

        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.polylineVolume);
    },
    updateAttrForDrawing: function updateAttrForDrawing() {},
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditPolylineVolume.EditPolylineVolume(entity, this.viewer, this.dataSource);
        _edit._minPointNum = this._minPointNum;
        _edit._maxPointNum = this._maxPointNum;
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束后调用
    finish: function finish() {
        this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象   
        this.entity.polylineVolume.positions = this.getDrawPosition();
    }

});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPolylineVolume = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _EditPolyline = __webpack_require__(14);

var _AttrPolyline = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditPolylineVolume = exports.EditPolylineVolume = _EditPolyline.EditPolyline.extend({
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        var that = this;

        this._positions_draw = this.entity.polylineVolume.positions.getValue();
        this.entity.polylineVolume.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getPosition();
        }, false);
    },
    //图形编辑结束后调用
    finish: function finish() {
        this.entity.polylineVolume.positions = this.getPosition();
    }

});

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawCorridor = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPolyline = __webpack_require__(9);

var _point = __webpack_require__(1);

var _AttrCorridor = __webpack_require__(67);

var attr = _interopRequireWildcard(_AttrCorridor);

var _EditCorridor = __webpack_require__(68);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var def_minPointNum = 2;
var def_maxPointNum = 9999;

var DrawCorridor = exports.DrawCorridor = _DrawPolyline.DrawPolyline.extend({
    type: 'corridor',
    //坐标位置相关
    _minPointNum: def_minPointNum, //至少需要点的个数 
    _maxPointNum: def_maxPointNum, //最多允许点的个数
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = [];

        if (attribute.config) {
            this._minPointNum = attribute.config.minPointNum || def_minPointNum;
            this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
        } else {
            this._minPointNum = def_minPointNum;
            this._maxPointNum = def_maxPointNum;
        }

        var that = this;
        var addattr = {
            corridor: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        addattr.corridor.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getDrawPosition();
        }, false);

        this.entity = this.dataSource.entities.add(addattr); //创建要素对象
        this.entity._positions_draw = this._positions_draw;

        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.corridor);
    },
    updateAttrForDrawing: function updateAttrForDrawing() {},
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditCorridor.EditCorridor(entity, this.viewer, this.dataSource);
        _edit._minPointNum = this._minPointNum;
        _edit._maxPointNum = this._maxPointNum;
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束后调用
    finish: function finish() {
        var entity = this.entity;

        entity.editing = this.getEditClass(entity); //绑定编辑对象   

        entity._positions_draw = this.getDrawPosition();
        entity.corridor.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return entity._positions_draw;
        }, false);
    }

});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};
    if (entityattr == null) {
        //默认值
        entityattr = {
            fill: true
        };
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "color":
                //填充颜色
                entityattr.material = new _Cesium2.default.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
            case "cornerType":
                switch (value) {
                    case "BEVELED":
                        entityattr.cornerType = _Cesium2.default.CornerType.BEVELED;
                        break;
                    case "MITERED":
                        entityattr.cornerType = _Cesium2.default.CornerType.MITERED;
                        break;
                    case "ROUNDED":
                        entityattr.cornerType = _Cesium2.default.CornerType.ROUNDED;
                        break;
                    default:
                        entityattr.cornerType = value;
                        break;
                }
                break;

        }
    }

    //如果未设置任何material，设置默认颜色
    if (entityattr.material == null) {
        entityattr.material = _Cesium2.default.Color.fromRandom({
            minimumGreen: 0.75,
            maximumBlue: 0.75,
            alpha: Number(style.opacity || 1.0)
        });
    }

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return entity.corridor.positions.getValue();
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = Util.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: {
            type: "LineString",
            coordinates: coordinates
        }
    };
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditCorridor = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _EditPolyline = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditCorridor = exports.EditCorridor = _EditPolyline.EditPolyline.extend({
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        //var that = this;

        this._positions_draw = this.entity._positions_draw || this.entity.corridor.positions.getValue();
        //this.entity.corridor.positions = new Cesium.CallbackProperty(function (time) {
        //    return that.getPosition();
        //}, false);
    },
    //图形编辑结束后调用
    finish: function finish() {
        this.entity._positions_draw = this.getPosition();
    }

});

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPolygon = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPolyline = __webpack_require__(9);

var _point = __webpack_require__(1);

var _AttrPolygon = __webpack_require__(16);

var attr = _interopRequireWildcard(_AttrPolygon);

var _EditPolygon = __webpack_require__(28);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var def_minPointNum = 3;
var def_maxPointNum = 9999;

var DrawPolygon = exports.DrawPolygon = _DrawPolyline.DrawPolyline.extend({
    type: 'polygon',
    //坐标位置相关
    _minPointNum: def_minPointNum, //至少需要点的个数 
    _maxPointNum: def_maxPointNum, //最多允许点的个数
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = [];

        if (attribute.config) {
            this._minPointNum = attribute.config.minPointNum || def_minPointNum;
            this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
        } else {
            this._minPointNum = def_minPointNum;
            this._maxPointNum = def_maxPointNum;
        }

        var that = this;
        var addattr = {
            polygon: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        addattr.polygon.hierarchy = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getDrawPosition();
        }, false);

        //线：绘制时前2点时 + 边线宽度大于1时
        addattr.polyline = {
            clampToGround: attribute.style.clampToGround,
            show: false
        };

        this.entity = this.dataSource.entities.add(addattr); //创建要素对象

        this.bindOutline(this.entity); //边线


        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.polygon);
    },
    bindOutline: function bindOutline(entity) {
        //是否显示：绘制时前2点时 或 边线宽度大于1时
        entity.polyline.show = new _Cesium2.default.CallbackProperty(function (time) {
            var arr = entity.polygon.hierarchy.getValue();
            if (arr.length < 3) return true;

            return entity.polygon.outline && entity.polygon.outline.getValue() && entity.polygon.outlineWidth && entity.polygon.outlineWidth.getValue() > 1;
        }, false);

        entity.polyline.positions = new _Cesium2.default.CallbackProperty(function (time) {
            if (!entity.polyline.show.getValue()) return null;

            var arr = entity.polygon.hierarchy.getValue();
            if (arr.length < 3) return arr;

            return arr.concat([arr[0]]);
        }, false);
        entity.polyline.width = new _Cesium2.default.CallbackProperty(function (time) {
            var arr = entity.polygon.hierarchy.getValue();
            if (arr.length < 3) return 2;

            return entity.polygon.outlineWidth;
        }, false);

        entity.polyline.material = new _Cesium2.default.ColorMaterialProperty(new _Cesium2.default.CallbackProperty(function (time) {
            var arr = entity.polygon.hierarchy.getValue();

            if (arr.length < 3) return entity.polygon.material.color.getValue();

            return entity.polygon.outlineColor.getValue();
        }, false));
    },
    updateAttrForDrawing: function updateAttrForDrawing() {

        var style = this.entity.attribute.style;
        if (style.extrudedHeight) {
            //存在extrudedHeight高度设置时
            var maxHight = (0, _point.getMaxHeight)(this.getDrawPosition());
            this.entity.polygon.extrudedHeight = maxHight + Number(style.extrudedHeight);
        }
    },
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditPolygon.EditPolygon(entity, this.viewer, this.dataSource);
        _edit._minPointNum = this._minPointNum;
        _edit._maxPointNum = this._maxPointNum;
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束后调用
    finish: function finish() {
        var entity = this.entity;

        entity.editing = this.getEditClass(entity); //绑定编辑对象   

        entity._positions_draw = this.getDrawPosition();
        entity.polygon.hierarchy = new _Cesium2.default.CallbackProperty(function (time) {
            return entity._positions_draw;
        }, false);
    }

});

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawRectangle = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPolyline = __webpack_require__(9);

var _point = __webpack_require__(1);

var _AttrRectangle = __webpack_require__(32);

var attr = _interopRequireWildcard(_AttrRectangle);

var _EditRectangle = __webpack_require__(71);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawRectangle = exports.DrawRectangle = _DrawPolyline.DrawPolyline.extend({
    type: 'rectangle',
    //坐标位置相关
    _minPointNum: 2, //至少需要点的个数 
    _maxPointNum: 2, //最多允许点的个数
    getRectangle: function getRectangle() {
        var positions = this.getDrawPosition();
        if (positions.length < 2) return null;
        return _Cesium2.default.Rectangle.fromCartesianArray(positions);
    },
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = [];

        var that = this;
        var addattr = {
            rectangle: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        addattr.rectangle.coordinates = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getRectangle();
        }, false);

        //线：边线宽度大于1时
        addattr.polyline = {
            clampToGround: attribute.style.clampToGround,
            show: false
        };

        this.entity = this.dataSource.entities.add(addattr); //创建要素对象
        this.bindOutline(this.entity); //边线

        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.rectangle);
    },
    bindOutline: function bindOutline(entity) {
        //是否显示：边线宽度大于1时
        entity.polyline.show = new _Cesium2.default.CallbackProperty(function (time) {
            return entity.rectangle.outline && entity.rectangle.outline.getValue() && entity.rectangle.outlineWidth && entity.rectangle.outlineWidth.getValue() > 1;
        }, false);
        entity.polyline.positions = new _Cesium2.default.CallbackProperty(function (time) {
            if (!entity.polyline.show.getValue()) return null;

            var positions = entity._draw_positions;
            var height = entity.rectangle.height ? entity.rectangle.height.getValue() : 0;

            var re = _Cesium2.default.Rectangle.fromCartesianArray(positions);
            var pt1 = _Cesium2.default.Cartesian3.fromRadians(re.west, re.south, height);
            var pt2 = _Cesium2.default.Cartesian3.fromRadians(re.east, re.south, height);
            var pt3 = _Cesium2.default.Cartesian3.fromRadians(re.east, re.north, height);
            var pt4 = _Cesium2.default.Cartesian3.fromRadians(re.west, re.north, height);

            return [pt1, pt2, pt3, pt4, pt1];
        }, false);
        entity.polyline.width = new _Cesium2.default.CallbackProperty(function (time) {
            return entity.rectangle.outlineWidth;
        }, false);
        entity.polyline.material = new _Cesium2.default.ColorMaterialProperty(new _Cesium2.default.CallbackProperty(function (time) {
            return entity.rectangle.outlineColor.getValue();
        }, false));
    },
    updateAttrForDrawing: function updateAttrForDrawing() {
        var style = this.entity.attribute.style;
        if (!style.clampToGround) {
            var maxHight = (0, _point.getMaxHeight)(this.getDrawPosition());

            this.entity.rectangle.height = maxHight;
            style.height = maxHight;

            if (style.extrudedHeight) this.entity.rectangle.extrudedHeight = maxHight + Number(style.extrudedHeight);
        }
    },
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditRectangle.EditRectangle(entity, this.viewer, this.dataSource);
        _edit._minPointNum = this._minPointNum;
        _edit._maxPointNum = this._maxPointNum;
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束后调用
    finish: function finish() {
        var entity = this.entity;

        entity.editing = this.getEditClass(entity); //绑定编辑对象   

        entity._positions_draw = this._positions_draw;
        //entity.rectangle.coordinates = this.getRectangle(); 
        entity.rectangle.coordinates = new _Cesium2.default.CallbackProperty(function (time) {
            if (entity._positions_draw.length < 2) return null;
            return _Cesium2.default.Rectangle.fromCartesianArray(entity._positions_draw);
        }, false);
    }

});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditRectangle = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _EditPolygon = __webpack_require__(28);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditRectangle = exports.EditRectangle = _EditPolygon.EditPolygon.extend({
    //getRectangle: function () {
    //    var positions = this._positions_draw;
    //    if (positions.length < 2) return null;
    //    return Cesium.Rectangle.fromCartesianArray(positions);
    //},
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        var that = this;
        this._positions_draw = this.entity._positions_draw;
        //this.entity.rectangle.coordinates = new Cesium.CallbackProperty(function (time) {
        //    return that.getRectangle();
        //}, false);
    },
    //图形编辑结束后调用
    finish: function finish() {
        this.entity._positions_draw = this._positions_draw;
        //this.entity.rectangle.coordinates = this.getRectangle();
    },
    isClampToGround: function isClampToGround() {
        return this.entity.attribute.style.clampToGround;
    },
    bindDraggers: function bindDraggers() {
        var that = this;

        var clampToGround = this.isClampToGround();
        var positions = this.getPosition();

        for (var i = 0, len = positions.length; i < len; i++) {
            var position = positions[i];

            if (this.entity.rectangle.height != undefined) {
                var newHeight = this.entity.rectangle.height.getValue();
                position = (0, _point.setPositionsHeight)(position, newHeight);
            }

            if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                position = (0, _point.updateHeightForClampToGround)(position);
            }

            //各顶点
            var dragger = draggerCtl.createDragger(this.dataSource, {
                position: position,
                //clampToGround: clampToGround,
                onDrag: function onDrag(dragger, position) {
                    if (that.entity.rectangle.height != undefined) {
                        var newHeight = that.entity.rectangle.height.getValue();
                        position = (0, _point.setPositionsHeight)(position, newHeight);
                        dragger.position = position;
                    }

                    positions[dragger.index] = position;

                    //============高度调整拖拽点处理=============
                    if (that.heightDraggers && that.heightDraggers.length > 0) {
                        var extrudedHeight = that.entity.rectangle.extrudedHeight.getValue();
                        that.heightDraggers[dragger.index].position = (0, _point.setPositionsHeight)(position, extrudedHeight);
                    }
                }
            });
            dragger.index = i;
            this.draggers.push(dragger);
        }

        //创建高程拖拽点
        if (this.entity.rectangle.extrudedHeight) this.bindHeightDraggers(this.entity.rectangle);
    }

});

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawCircle = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPolyline = __webpack_require__(9);

var _point = __webpack_require__(1);

var _EventType = __webpack_require__(8);

var EventType = _interopRequireWildcard(_EventType);

var _Tooltip = __webpack_require__(3);

var _AttrCircle = __webpack_require__(29);

var attr = _interopRequireWildcard(_AttrCircle);

var _EditCircle = __webpack_require__(73);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawCircle = exports.DrawCircle = _DrawPolyline.DrawPolyline.extend({
    type: 'ellipse',
    //坐标位置相关
    _minPointNum: 2, //至少需要点的个数 
    _maxPointNum: 2, //最多允许点的个数
    getShowPosition: function getShowPosition() {
        if (this._positions_draw && this._positions_draw.length > 1) return this._positions_draw[0];
        return null;
    },
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = [];

        if (attribute.type == "ellipse") //椭圆
            this._maxPointNum = 3;else //圆
            this._maxPointNum = 2;

        var that = this;
        var addattr = {
            position: new _Cesium2.default.CallbackProperty(function (time) {
                return that.getShowPosition();
            }, false),
            ellipse: attr.style2Entity(attribute.style),
            attribute: attribute
        };

        this.entity = this.dataSource.entities.add(addattr); //创建要素对象 
        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.ellipse);
    },
    updateAttrForDrawing: function updateAttrForDrawing(isLoad) {
        if (!this._positions_draw) return;

        if (isLoad) {
            this.addPositionsForRadius(this._positions_draw);
            return;
        }

        if (this._positions_draw.length < 2) return;

        var style = this.entity.attribute.style;

        //高度处理
        if (!style.clampToGround) {
            var height = this.formatNum(_Cesium2.default.Cartographic.fromCartesian(this._positions_draw[0]).height, 2);
            this.entity.ellipse.height = height;
            style.height = height;

            if (style.extrudedHeight) {
                var extrudedHeight = height + Number(style.extrudedHeight);
                this.entity.ellipse.extrudedHeight = extrudedHeight;
            }
        }

        //半径处理
        var radius = this.formatNum(_Cesium2.default.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2);
        this.entity.ellipse.semiMinorAxis = radius; //短半轴

        if (this._maxPointNum == 3) {
            //长半轴
            var semiMajorAxis;
            if (this._positions_draw.length == 3) {
                semiMajorAxis = this.formatNum(_Cesium2.default.Cartesian3.distance(this._positions_draw[0], this._positions_draw[2]), 2);
            } else {
                semiMajorAxis = radius;
            }
            this.entity.ellipse.semiMajorAxis = semiMajorAxis;

            style.semiMinorAxis = radius;
            style.semiMajorAxis = semiMajorAxis;
        } else {
            this.entity.ellipse.semiMajorAxis = radius;

            style.radius = radius;
        }
    },
    addPositionsForRadius: function addPositionsForRadius(position) {
        this._positions_draw = [position];

        var style = this.entity.attribute.style;

        //获取椭圆上的坐标点数组
        var cep = _Cesium2.default.EllipseGeometryLibrary.computeEllipsePositions({
            center: position,
            semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(), //长半轴
            semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(), //短半轴
            rotation: _Cesium2.default.Math.toRadians(Number(style.rotation || 0)),
            granularity: 2.0
        }, true, false);

        //长半轴上的坐标点
        var majorPos = new _Cesium2.default.Cartesian3(cep.positions[0], cep.positions[1], cep.positions[2]);
        this._positions_draw.push(majorPos);

        if (this._maxPointNum == 3) {
            //椭圆
            //短半轴上的坐标点 
            var minorPos = new _Cesium2.default.Cartesian3(cep.positions[3], cep.positions[4], cep.positions[5]);
            this._positions_draw.push(minorPos);
        }
    },
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditCircle.EditCircle(entity, this.viewer, this.dataSource);
        _edit._minPointNum = this._minPointNum;
        _edit._maxPointNum = this._maxPointNum;
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束后调用
    finish: function finish() {
        var entity = this.entity;

        entity.editing = this.getEditClass(entity); //绑定编辑对象   

        entity._positions_draw = this._positions_draw;
        //this.entity.position = this.getShowPosition();
        entity.position = new _Cesium2.default.CallbackProperty(function (time) {
            if (entity._positions_draw && entity._positions_draw.length > 0) return entity._positions_draw[0];
            return null;
        }, false);
    }

});

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditCircle = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _EditPolygon = __webpack_require__(28);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditCircle = exports.EditCircle = _EditPolygon.EditPolygon.extend({
    //getShowPosition: function () {
    //    if (this._positions_draw && this._positions_draw.length > 0)
    //        return this._positions_draw[0];
    //    return null;
    //},
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        var that = this;
        this._positions_draw = this.entity._positions_draw;
        //this.entity.position = new Cesium.CallbackProperty(time => {
        //    return that.getShowPosition();
        //}, false);
    },
    //图形编辑结束后调用
    finish: function finish() {
        this.entity._positions_draw = this._positions_draw;
        //this.entity.position = this.getShowPosition();
    },
    isClampToGround: function isClampToGround() {
        return this.entity.attribute.style.clampToGround;
    },
    getPosition: function getPosition() {
        //加上高度
        if (this.entity.ellipse.height != undefined) {
            var newHeight = this.entity.ellipse.height.getValue();
            for (var i = 0, len = this._positions_draw.length; i < len; i++) {
                this._positions_draw[i] = (0, _point.setPositionsHeight)(this._positions_draw[i], newHeight);
            }
        }
        return this._positions_draw;
    },
    bindDraggers: function bindDraggers() {
        var that = this;

        var clampToGround = this.isClampToGround();
        var positions = this.getPosition();

        var diff = new _Cesium2.default.Cartesian3();
        var newPos = new _Cesium2.default.Cartesian3();
        var style = this.entity.attribute.style;

        //中心点
        var position = positions[0];
        if (clampToGround) {
            //贴地时求贴模型和贴地的高度
            position = (0, _point.updateHeightForClampToGround)(position);
            positions[0] = position;
        }

        var dragger = draggerCtl.createDragger(this.dataSource, {
            position: position,
            //clampToGround: clampToGround,
            onDrag: function onDrag(dragger, position) {
                _Cesium2.default.Cartesian3.subtract(position, positions[dragger.index], diff); //记录差值

                positions[dragger.index] = position;

                //============高度处理=============
                if (!style.clampToGround) {
                    var height = that.formatNum(_Cesium2.default.Cartographic.fromCartesian(position).height, 2);
                    that.entity.ellipse.height = height;
                    style.height = height;
                }

                //============半径同步处理=============
                _Cesium2.default.Cartesian3.add(dragger.majorDragger.position.getValue(), diff, newPos);
                dragger.majorDragger.position = newPos;

                if (dragger.minorDragger) {
                    _Cesium2.default.Cartesian3.add(dragger.minorDragger.position.getValue(), diff, newPos);
                    dragger.minorDragger.position = newPos;
                }

                //============高度调整拖拽点处理=============
                if (that.entity.attribute.style.extrudedHeight != undefined) that.updateDraggers();
            }
        });
        dragger.index = 0;
        this.draggers.push(dragger);

        //获取椭圆上的坐标点数组
        var cep = _Cesium2.default.EllipseGeometryLibrary.computeEllipsePositions({
            center: position,
            semiMajorAxis: this.entity.ellipse.semiMajorAxis.getValue(), //长半轴
            semiMinorAxis: this.entity.ellipse.semiMinorAxis.getValue(), //短半轴
            rotation: _Cesium2.default.Math.toRadians(Number(style.rotation || 0)),
            granularity: 2.0
        }, true, false);

        //长半轴上的坐标点
        var majorPos = new _Cesium2.default.Cartesian3(cep.positions[0], cep.positions[1], cep.positions[2]);
        if (clampToGround) {
            //贴地时求贴模型和贴地的高度
            majorPos = (0, _point.updateHeightForClampToGround)(majorPos);
        }
        positions[1] = majorPos;
        var majorDragger = draggerCtl.createDragger(this.dataSource, {
            position: majorPos,
            type: draggerCtl.PointType.EditAttr,
            tooltip: _Tooltip.message.dragger.editRadius,
            //clampToGround: clampToGround,
            onDrag: function onDrag(dragger, position) {
                if (that.entity.ellipse.height != undefined) {
                    var newHeight = that.entity.ellipse.height.getValue();
                    position = (0, _point.setPositionsHeight)(position, newHeight);
                    dragger.position = position;
                }
                positions[dragger.index] = position;

                var radius = that.formatNum(_Cesium2.default.Cartesian3.distance(positions[0], position), 2);
                that.entity.ellipse.semiMajorAxis = radius;

                if (style.radius) {
                    //圆
                    that.entity.ellipse.semiMinorAxis = radius;
                    style.radius = radius;
                } else {
                    style.semiMajorAxis = radius;
                }

                if (that.entity.attribute.style.extrudedHeight != undefined) that.updateDraggers();
            }
        });
        majorDragger.index = 1;
        dragger.majorDragger = majorDragger;
        this.draggers.push(majorDragger);

        //短半轴上的坐标点
        if (this._maxPointNum == 3) {
            //椭圆
            //短半轴上的坐标点 
            var minorPos = new _Cesium2.default.Cartesian3(cep.positions[3], cep.positions[4], cep.positions[5]);
            if (clampToGround) {
                //贴地时求贴模型和贴地的高度
                minorPos = (0, _point.updateHeightForClampToGround)(minorPos);
            }
            positions[2] = minorPos;
            var minorDragger = draggerCtl.createDragger(this.dataSource, {
                position: minorPos,
                type: draggerCtl.PointType.EditAttr,
                tooltip: _Tooltip.message.dragger.editRadius,
                //clampToGround: clampToGround,
                onDrag: function onDrag(dragger, position) {
                    if (that.entity.ellipse.height != undefined) {
                        var newHeight = that.entity.ellipse.height.getValue();
                        position = (0, _point.setPositionsHeight)(position, newHeight);
                        dragger.position = position;
                    }
                    positions[dragger.index] = position;

                    var radius = that.formatNum(_Cesium2.default.Cartesian3.distance(positions[0], position), 2);
                    that.entity.ellipse.semiMinorAxis = radius;

                    if (style.radius) {
                        //圆
                        that.entity.ellipse.semiMajorAxis = radius;
                        style.radius = radius;
                    } else {
                        style.semiMinorAxis = radius;
                    }

                    if (that.entity.attribute.style.extrudedHeight != undefined) that.updateDraggers();
                }
            });
            minorDragger.index = 2;
            dragger.minorDragger = minorDragger;
            this.draggers.push(minorDragger);
        }

        //创建高度拖拽点
        if (this.entity.ellipse.extrudedHeight) {
            var extrudedHeight = this.entity.ellipse.extrudedHeight.getValue();

            //顶部 中心点
            var position = (0, _point.setPositionsHeight)(positions[0], extrudedHeight);
            var draggerTop = draggerCtl.createDragger(this.dataSource, {
                position: position,
                onDrag: function onDrag(dragger, position) {
                    position = (0, _point.setPositionsHeight)(position, that.entity.ellipse.height);
                    positions[0] = position;

                    that.updateDraggers();
                }
            });
            this.draggers.push(draggerTop);

            var _pos = this._maxPointNum == 3 ? [positions[1], positions[2]] : [positions[1]];
            this.bindHeightDraggers(this.entity.ellipse, _pos);

            this.heightDraggers.push(draggerTop); //拖动高度时联动修改此点高
        }
    }

});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawEllipsoid = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPolyline = __webpack_require__(9);

var _point = __webpack_require__(1);

var _EventType = __webpack_require__(8);

var EventType = _interopRequireWildcard(_EventType);

var _Tooltip = __webpack_require__(3);

var _AttrEllipsoid = __webpack_require__(33);

var attr = _interopRequireWildcard(_AttrEllipsoid);

var _EditEllipsoid = __webpack_require__(75);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawEllipsoid = exports.DrawEllipsoid = _DrawPolyline.DrawPolyline.extend({
    type: 'ellipsoid',
    //坐标位置相关
    _minPointNum: 2, //至少需要点的个数 
    _maxPointNum: 3, //最多允许点的个数 
    getShowPosition: function getShowPosition() {
        if (this._positions_draw && this._positions_draw.length > 0) return this._positions_draw[0];
        return null;
    },
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = [];

        var that = this;
        var addattr = {
            position: new _Cesium2.default.CallbackProperty(function (time) {
                return that.getShowPosition();
            }, false),
            ellipsoid: attr.style2Entity(attribute.style),
            attribute: attribute
        };

        this.entity = this.dataSource.entities.add(addattr); //创建要素对象 
        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.ellipsoid);
    },
    updateAttrForDrawing: function updateAttrForDrawing(isLoad) {
        if (!this._positions_draw) return;

        if (isLoad) {
            this.addPositionsForRadius(this._positions_draw);
            return;
        }

        if (this._positions_draw.length < 2) return;

        var style = this.entity.attribute.style;

        //半径处理
        var radius = this.formatNum(_Cesium2.default.Cartesian3.distance(this._positions_draw[0], this._positions_draw[1]), 2);
        style.extentRadii = radius; //短半轴
        style.heightRadii = radius;

        //长半轴
        var semiMajorAxis;
        if (this._positions_draw.length == 3) {
            semiMajorAxis = this.formatNum(_Cesium2.default.Cartesian3.distance(this._positions_draw[0], this._positions_draw[2]), 2);
        } else {
            semiMajorAxis = radius;
        }
        style.widthRadii = semiMajorAxis;

        this.updateRadii(style);
    },
    updateRadii: function updateRadii(style) {
        this.entity.ellipsoid.radii.setValue(new _Cesium2.default.Cartesian3(style.extentRadii, style.widthRadii, style.heightRadii));
    },
    addPositionsForRadius: function addPositionsForRadius(position) {
        this._positions_draw = [position];

        var style = this.entity.attribute.style;

        //获取椭圆上的坐标点数组
        var cep = _Cesium2.default.EllipseGeometryLibrary.computeEllipsePositions({
            center: position,
            semiMajorAxis: Number(style.extentRadii), //长半轴
            semiMinorAxis: Number(style.widthRadii), //短半轴 
            rotation: _Cesium2.default.Math.toRadians(Number(style.rotation || 0)),
            granularity: 2.0
        }, true, false);

        //长半轴上的坐标点
        var majorPos = new _Cesium2.default.Cartesian3(cep.positions[0], cep.positions[1], cep.positions[2]);
        this._positions_draw.push(majorPos);

        //短半轴上的坐标点 
        var minorPos = new _Cesium2.default.Cartesian3(cep.positions[3], cep.positions[4], cep.positions[5]);
        this._positions_draw.push(minorPos);
    },
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditEllipsoid.EditEllipsoid(entity, this.viewer, this.dataSource);
        _edit._minPointNum = this._minPointNum;
        _edit._maxPointNum = this._maxPointNum;
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束后调用
    finish: function finish() {
        this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象   
        this.entity._positions_draw = this._positions_draw;
        this.entity.position = this.getShowPosition();
    }

});

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditEllipsoid = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _EditBase = __webpack_require__(21);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditEllipsoid = exports.EditEllipsoid = _EditBase.EditBase.extend({
    _positions_draw: null,
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        this._positions_draw = this.entity.position.getValue();
    },
    //图形编辑结束后调用
    finish: function finish() {
        this._positions_draw = null;
    },
    updateRadii: function updateRadii(style) {
        var radii = new _Cesium2.default.Cartesian3(Number(style.extentRadii), Number(style.widthRadii), Number(style.heightRadii));
        this.entity.ellipsoid.radii.setValue(radii);
    },
    bindDraggers: function bindDraggers() {
        var that = this;

        var style = this.entity.attribute.style;

        //位置中心点
        var position = this.entity.position.getValue();
        var dragger = draggerCtl.createDragger(this.dataSource, {
            position: (0, _point.addPositionsHeight)(position, style.heightRadii),
            onDrag: function onDrag(dragger, position) {
                this._positions_draw = position;
                that.entity.position.setValue(position);

                that.updateDraggers();
            }
        });
        this.draggers.push(dragger);

        //获取椭圆上的坐标点数组
        var cep = _Cesium2.default.EllipseGeometryLibrary.computeEllipsePositions({
            center: position,
            semiMajorAxis: Number(style.extentRadii), //长半轴
            semiMinorAxis: Number(style.widthRadii), //短半轴 
            rotation: _Cesium2.default.Math.toRadians(Number(style.rotation || 0)),
            granularity: 2.0
        }, true, false);

        //长半轴上的坐标点
        var majorPos = new _Cesium2.default.Cartesian3(cep.positions[0], cep.positions[1], cep.positions[2]);
        var majorDragger = draggerCtl.createDragger(this.dataSource, {
            position: majorPos,
            type: draggerCtl.PointType.EditAttr,
            tooltip: _Tooltip.message.dragger.editRadius,
            onDrag: function onDrag(dragger, position) {
                var newHeight = _Cesium2.default.Cartographic.fromCartesian(that._positions_draw).height;
                position = (0, _point.setPositionsHeight)(position, newHeight);
                dragger.position = position;

                var radius = that.formatNum(_Cesium2.default.Cartesian3.distance(that._positions_draw, position), 2);
                style.extentRadii = radius; //短半轴

                that.updateRadii(style);
                that.updateDraggers();
            }
        });
        dragger.majorDragger = majorDragger;
        this.draggers.push(majorDragger);

        //短半轴上的坐标点  
        var minorPos = new _Cesium2.default.Cartesian3(cep.positions[3], cep.positions[4], cep.positions[5]);
        var minorDragger = draggerCtl.createDragger(this.dataSource, {
            position: minorPos,
            type: draggerCtl.PointType.EditAttr,
            tooltip: _Tooltip.message.dragger.editRadius,
            onDrag: function onDrag(dragger, position) {
                var newHeight = _Cesium2.default.Cartographic.fromCartesian(that._positions_draw).height;
                position = (0, _point.setPositionsHeight)(position, newHeight);
                dragger.position = position;

                var radius = that.formatNum(_Cesium2.default.Cartesian3.distance(that._positions_draw, position), 2);
                style.widthRadii = radius; //长半轴

                that.updateRadii(style);
                that.updateDraggers();
            }
        });
        dragger.minorDragger = minorDragger;
        this.draggers.push(minorDragger);
    }

});

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawWall = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawPolyline = __webpack_require__(9);

var _point = __webpack_require__(1);

var _AttrWall = __webpack_require__(34);

var attr = _interopRequireWildcard(_AttrWall);

var _EditWall = __webpack_require__(77);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var def_minPointNum = 2;
var def_maxPointNum = 9999;

var DrawWall = exports.DrawWall = _DrawPolyline.DrawPolyline.extend({
    type: 'wall',
    //坐标位置相关
    _minPointNum: def_minPointNum, //至少需要点的个数 
    _maxPointNum: def_maxPointNum, //最多允许点的个数
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        this._positions_draw = [];

        if (attribute.config) {
            this._minPointNum = attribute.config.minPointNum || def_minPointNum;
            this._maxPointNum = attribute.config.maxPointNum || def_maxPointNum;
        } else {
            this._minPointNum = def_minPointNum;
            this._maxPointNum = def_maxPointNum;
        }

        this.maximumHeights = [];
        this.minimumHeights = [];

        var that = this;
        var addattr = {
            wall: attr.style2Entity(attribute.style),
            attribute: attribute
        };
        addattr.wall.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getDrawPosition();
        }, false);
        addattr.wall.minimumHeights = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getMinimumHeights();
        }, false);
        addattr.wall.maximumHeights = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getMaximumHeights();
        }, false);

        this.entity = this.dataSource.entities.add(addattr); //创建要素对象   
        return this.entity;
    },
    style2Entity: function style2Entity(style, entity) {
        return attr.style2Entity(style, entity.wall);
    },
    maximumHeights: null,
    getMaximumHeights: function getMaximumHeights(entity) {
        return this.maximumHeights;
    },
    minimumHeights: null,
    getMinimumHeights: function getMinimumHeights(entity) {
        return this.minimumHeights;
    },
    updateAttrForDrawing: function updateAttrForDrawing() {
        var style = this.entity.attribute.style;
        var position = this.getDrawPosition();
        var len = position.length;

        this.maximumHeights = new Array(len);
        this.minimumHeights = new Array(len);

        for (var i = 0; i < len; i++) {
            var height = _Cesium2.default.Cartographic.fromCartesian(position[i]).height;
            this.minimumHeights[i] = height;
            this.maximumHeights[i] = height + Number(style.extrudedHeight);
        }
    },
    //获取编辑对象  
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditWall.EditWall(entity, this.viewer, this.dataSource);
        _edit._minPointNum = this._minPointNum;
        _edit._maxPointNum = this._maxPointNum;
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束后调用
    finish: function finish() {
        this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象   
        this.entity.wall.positions = this.getDrawPosition();
        this.entity.wall.minimumHeights = this.getMinimumHeights();
        this.entity.wall.maximumHeights = this.getMaximumHeights();
    }

});

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditWall = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _EditPolyline = __webpack_require__(14);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditWall = exports.EditWall = _EditPolyline.EditPolyline.extend({
    //修改坐标会回调，提高显示的效率
    changePositionsToCallback: function changePositionsToCallback() {
        var that = this;

        this._positions_draw = this.entity.wall.positions.getValue();
        this.entity.wall.positions = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getPosition();
        }, false);

        this.minimumHeights = this.entity.wall.minimumHeights.getValue();
        this.entity.wall.minimumHeights = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getMinimumHeights();
        }, false);

        this.maximumHeights = this.entity.wall.maximumHeights.getValue();
        this.entity.wall.maximumHeights = new _Cesium2.default.CallbackProperty(function (time) {
            return that.getMaximumHeights();
        }, false);
    },
    maximumHeights: null,
    getMaximumHeights: function getMaximumHeights(entity) {
        return this.maximumHeights;
    },
    minimumHeights: null,
    getMinimumHeights: function getMinimumHeights(entity) {
        return this.minimumHeights;
    },
    //坐标位置相关  
    updateAttrForEditing: function updateAttrForEditing() {
        var style = this.entity.attribute.style;
        var position = this.getPosition();
        var len = position.length;

        this.maximumHeights = new Array(len);
        this.minimumHeights = new Array(len);

        for (var i = 0; i < len; i++) {
            var height = _Cesium2.default.Cartographic.fromCartesian(position[i]).height;
            this.minimumHeights[i] = height;
            this.maximumHeights[i] = height + Number(style.extrudedHeight);
        }
    },
    //图形编辑结束后调用
    finish: function finish() {
        this.entity.wall.positions = this.getPosition();
    },
    bindDraggers: function bindDraggers() {
        var that = this;

        var clampToGround = this.isClampToGround();

        var positions = this.getPosition();
        var style = this.entity.attribute.style;
        var hasMidPoint = positions.length < this._maxPointNum; //是否有新增点

        for (var i = 0, len = positions.length; i < len; i++) {
            var loc = positions[i];

            //各顶点
            var dragger = draggerCtl.createDragger(this.dataSource, {
                position: loc,
                clampToGround: clampToGround,
                onDrag: function onDrag(dragger, position) {
                    positions[dragger.index] = position;

                    //============高度调整拖拽点处理=============
                    if (that.heightDraggers && that.heightDraggers.length > 0) {
                        that.heightDraggers[dragger.index].position = (0, _point.addPositionsHeight)(position, style.extrudedHeight);
                    }

                    //============新增点拖拽点处理=============
                    if (hasMidPoint) {
                        if (dragger.index > 0) {
                            //与前一个点之间的中点 
                            that.draggers[dragger.index * 2 - 1].position = _Cesium2.default.Cartesian3.midpoint(position, positions[dragger.index - 1], new _Cesium2.default.Cartesian3());
                        }
                        if (dragger.index < positions.length - 1) {
                            //与后一个点之间的中点 
                            that.draggers[dragger.index * 2 + 1].position = _Cesium2.default.Cartesian3.midpoint(position, positions[dragger.index + 1], new _Cesium2.default.Cartesian3());
                        }
                    }
                }
            });
            dragger.index = i;
            this.draggers.push(dragger);

            //中间点，拖动后新增点
            if (hasMidPoint) {
                var nextIndex = i + 1;
                if (nextIndex < len) {
                    var midpoint = _Cesium2.default.Cartesian3.midpoint(loc, positions[nextIndex], new _Cesium2.default.Cartesian3());
                    var draggerMid = draggerCtl.createDragger(this.dataSource, {
                        position: midpoint,
                        type: draggerCtl.PointType.AddMidPoint,
                        tooltip: _Tooltip.message.dragger.addMidPoint,
                        clampToGround: clampToGround,
                        onDragStart: function onDragStart(dragger, position) {
                            positions.splice(dragger.index, 0, position); //插入点 
                            that.updateAttrForEditing();
                        },
                        onDrag: function onDrag(dragger, position) {
                            positions[dragger.index] = position;
                        },
                        onDragEnd: function onDragEnd(dragger, position) {
                            that.updateDraggers();
                        }
                    });
                    draggerMid.index = nextIndex;
                    this.draggers.push(draggerMid);
                }
            }
        }

        //创建高程拖拽点
        this.bindHeightDraggers();
    },
    //高度调整拖拽点
    heightDraggers: null,
    bindHeightDraggers: function bindHeightDraggers() {
        var that = this;

        this.heightDraggers = [];

        var positions = this.getPosition();
        var style = this.entity.attribute.style;
        var extrudedHeight = Number(style.extrudedHeight);

        for (var i = 0, len = positions.length; i < len; i++) {
            var loc = (0, _point.addPositionsHeight)(positions[i], extrudedHeight);

            var dragger = draggerCtl.createDragger(this.dataSource, {
                position: loc,
                type: draggerCtl.PointType.MoveHeight,
                tooltip: _Tooltip.message.dragger.moveHeight,
                onDrag: function onDrag(dragger, position) {
                    var thisHeight = _Cesium2.default.Cartographic.fromCartesian(position).height;
                    style.extrudedHeight = that.formatNum(thisHeight - that.minimumHeights[dragger.index], 2);

                    for (var i = 0; i < positions.length; i++) {
                        if (i == dragger.index) continue;
                        that.heightDraggers[i].position = (0, _point.addPositionsHeight)(positions[i], style.extrudedHeight);
                    }
                    that.updateAttrForEditing();
                }
            });
            dragger.index = i;

            this.draggers.push(dragger);
            this.heightDraggers.push(dragger);
        }
    }

});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DrawPModel = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _DrawBase = __webpack_require__(26);

var _point = __webpack_require__(1);

var _AttrModel = __webpack_require__(27);

var attr = _interopRequireWildcard(_AttrModel);

var _Tooltip = __webpack_require__(3);

var _EditPModel = __webpack_require__(79);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DrawPModel = exports.DrawPModel = _DrawBase.DrawBase.extend({
    type: 'point',
    //根据attribute参数创建Entity
    createFeature: function createFeature(attribute) {
        var _this = this;

        this._positions_draw = _Cesium2.default.Cartesian3.ZERO;

        var style = attribute.style;

        var modelPrimitive = this.primitives.add(_Cesium2.default.Model.fromGltf({
            url: style.modelUrl,
            modelMatrix: this.getModelMatrix(style),
            minimumPixelSize: style.minimumPixelSize || 30
        }));
        modelPrimitive.readyPromise.then(function (model) {
            _this.style2Entity(style, _this.entity);
        });
        modelPrimitive.attribute = attribute;
        this.entity = modelPrimitive;

        return this.entity;
    },
    getModelMatrix: function getModelMatrix(cfg, position) {
        var hpRoll = new _Cesium2.default.HeadingPitchRoll(_Cesium2.default.Math.toRadians(cfg.heading || 0), _Cesium2.default.Math.toRadians(cfg.pitch || 0), _Cesium2.default.Math.toRadians(cfg.roll || 0));
        var fixedFrameTransform = _Cesium2.default.Transforms.eastNorthUpToFixedFrame;

        var modelMatrix = _Cesium2.default.Transforms.headingPitchRollToFixedFrame(position || this._positions_draw, hpRoll, this.viewer.scene.globe.ellipsoid, fixedFrameTransform);
        if (cfg.scale) _Cesium2.default.Matrix4.multiplyByUniformScale(modelMatrix, cfg.scale, modelMatrix);
        return modelMatrix;
    },
    style2Entity: function style2Entity(style, entity) {
        entity.modelMatrix = this.getModelMatrix(style, entity.position);
        return attr.style2Entity(style, entity);
    },
    //绑定鼠标事件
    bindEvent: function bindEvent() {
        var _this2 = this;

        this.getHandler().setInputAction(function (event) {
            var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.endPosition, _this2.entity);
            if (point) {
                _this2._positions_draw = point;
                _this2.entity.modelMatrix = _this2.getModelMatrix(_this2.entity.attribute.style);
            }
            _this2.tooltip.showAt(event.endPosition, _Tooltip.message.draw.point.start);
        }, _Cesium2.default.ScreenSpaceEventType.MOUSE_MOVE);

        this.getHandler().setInputAction(function (event) {
            var point = (0, _point.getCurrentMousePosition)(_this2.viewer.scene, event.position, _this2.entity);
            if (point) {
                _this2._positions_draw = point;
                _this2.disable();
            }
        }, _Cesium2.default.ScreenSpaceEventType.LEFT_CLICK);
    },
    //获取编辑对象类
    getEditClass: function getEditClass(entity) {
        var _edit = new _EditPModel.EditPModel(entity, this.viewer, this.dataSource);
        return this._bindEdit(_edit);
    },
    //获取属性处理类
    getAttrClass: function getAttrClass() {
        return attr;
    },
    //图形绘制结束,更新属性
    finish: function finish() {
        this.entity.modelMatrix = this.getModelMatrix(this.entity.attribute.style);

        this.entity.editing = this.getEditClass(this.entity); //绑定编辑对象     
        this.entity.position = this.getDrawPosition();
    }

});

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EditPModel = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Dragger = __webpack_require__(6);

var draggerCtl = _interopRequireWildcard(_Dragger);

var _Tooltip = __webpack_require__(3);

var _EditBase = __webpack_require__(21);

var _AttrCircle = __webpack_require__(29);

var circleAttr = _interopRequireWildcard(_AttrCircle);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditPModel = exports.EditPModel = _EditBase.EditBase.extend({
    //外部更新位置
    setPositions: function setPositions(position) {
        this.entity.position = position;
        this.entity.modelMatrix = this.getModelMatrix();
    },
    getModelMatrix: function getModelMatrix(position) {
        var cfg = this.entity.attribute.style;

        var hpRoll = new _Cesium2.default.HeadingPitchRoll(_Cesium2.default.Math.toRadians(cfg.heading || 0), _Cesium2.default.Math.toRadians(cfg.pitch || 0), _Cesium2.default.Math.toRadians(cfg.roll || 0));
        var fixedFrameTransform = _Cesium2.default.Transforms.eastNorthUpToFixedFrame;

        var modelMatrix = _Cesium2.default.Transforms.headingPitchRollToFixedFrame(position || this.entity.position, hpRoll, this.viewer.scene.globe.ellipsoid, fixedFrameTransform);
        if (cfg.scale) _Cesium2.default.Matrix4.multiplyByUniformScale(modelMatrix, cfg.scale, modelMatrix);
        return modelMatrix;
    },
    bindDraggers: function bindDraggers() {
        if (!this.entity.ready) {
            var that = this;
            this.entity.readyPromise.then(function (model) {
                that.bindDraggers();
            });
            return;
        }

        var that = this;

        this.entity.draw_tooltip = _Tooltip.message.dragger.def;

        var dragger = draggerCtl.createDragger(this.dataSource, {
            dragger: this.entity,
            onDrag: function onDrag(dragger, newPosition) {
                that.entity.position = newPosition;
                that.entity.modelMatrix = that.getModelMatrix(newPosition);

                that.updateDraggers();
            }
        });

        var style = this.entity.attribute.style;

        var position = this.entity.position;
        var height = _Cesium2.default.Cartographic.fromCartesian(position).height;
        var radius = this.entity.boundingSphere.radius;

        //辅助显示：创建角度调整底部圆
        this.entityAngle = this.dataSource.entities.add({
            name: '角度调整底部圆',
            position: new _Cesium2.default.CallbackProperty(function (time) {
                return that.entity.position;
            }, false),
            ellipse: circleAttr.style2Entity({
                "fill": false,
                "outline": true,
                "outlineColor": "#ffff00",
                "outlineOpacity": 0.8,
                "radius": radius,
                "height": height
            })
        });

        //创建角度调整 拖拽点
        var majorPos = this.getHeadingPosition();
        var majorDragger = draggerCtl.createDragger(this.dataSource, {
            position: majorPos,
            type: draggerCtl.PointType.EditAttr,
            tooltip: _Tooltip.message.dragger.editHeading,
            onDrag: function onDrag(dragger, position) {
                var heading = that.getHeading(that.entity.position, position);
                style.heading = that.formatNum(heading, 1);
                //console.log(heading);

                that.entity.modelMatrix = that.getModelMatrix();
                dragger.position = that.getHeadingPosition();
            }
        });
        this.draggers.push(majorDragger);

        //辅助显示：外接包围盒子
        //this.entityBox = this.dataSource.entities.add({
        //    name: '外接包围盒子',
        //    position: new Cesium.CallbackProperty(time => {
        //        return that.entity.position;
        //    }, false),
        //    box: {
        //        dimensions: new Cesium.Cartesian3(radius, radius, radius),
        //        fill: false,
        //        outline: true,
        //        outlineColor: Cesium.Color.YELLOW
        //    }
        //});

        //缩放控制点 
        var position_scale = (0, _point.addPositionsHeight)(position, radius);
        var dragger = draggerCtl.createDragger(this.dataSource, {
            position: position_scale,
            type: draggerCtl.PointType.MoveHeight,
            tooltip: _Tooltip.message.dragger.editScale,
            onDrag: function onDrag(dragger, positionNew) {
                var radiusNew = _Cesium2.default.Cartesian3.distance(positionNew, position);

                var radiusOld = dragger.radius / style.scale;
                var scaleNew = radiusNew / radiusOld;

                dragger.radius = radiusNew;
                style.scale = that.formatNum(scaleNew, 2);

                that.entity.modelMatrix = that.getModelMatrix();
                that.updateDraggers();
            }
        });
        dragger.radius = radius;
        this.draggers.push(dragger);

        //this.entityBox = this.dataSource.entities.add({
        //    name: '缩放控制点连接线',
        //    polyline: {
        //        positions: [
        //            position,
        //            position_scale
        //        ],
        //        width: 1,
        //        material: Cesium.Color.YELLOW
        //    }
        //});

    },
    destroyDraggers: function destroyDraggers() {
        _EditBase.EditBase.prototype.destroyDraggers.call(this);

        if (this.entityAngle) {
            this.dataSource.entities.remove(this.entityAngle);
            delete this.entityAngle;
        }
        if (this.entityBox) {
            this.dataSource.entities.remove(this.entityBox);
            delete this.entityBox;
        }
    },
    //图形编辑结束后调用
    finish: function finish() {
        this.entity.draw_tooltip = null;
    },
    getHeadingPosition: function getHeadingPosition() {
        //创建角度调整底部圆  
        var position = this.entity.position;
        var radius = this.entity.boundingSphere.radius;
        var angle = -Number(this.entity.attribute.style.heading || 0);

        var rotpos = new _Cesium2.default.Cartesian3(radius, 0.0, 0.0);

        var mat = _Cesium2.default.Transforms.eastNorthUpToFixedFrame(position);
        var rotationX = _Cesium2.default.Matrix4.fromRotationTranslation(_Cesium2.default.Matrix3.fromRotationZ(_Cesium2.default.Math.toRadians(angle)));
        _Cesium2.default.Matrix4.multiply(mat, rotationX, mat);

        mat = _Cesium2.default.Matrix4.getRotation(mat, new _Cesium2.default.Matrix3());
        rotpos = _Cesium2.default.Matrix3.multiplyByVector(mat, rotpos, rotpos);
        rotpos = _Cesium2.default.Cartesian3.add(position, rotpos, rotpos);
        return rotpos;
    },
    //获取点相对于中心点的地面角度
    getHeading: function getHeading(positionCenter, positionNew) {

        //获取该位置的默认矩阵 
        var mat = _Cesium2.default.Transforms.eastNorthUpToFixedFrame(positionCenter);
        mat = _Cesium2.default.Matrix4.getRotation(mat, new _Cesium2.default.Matrix3());

        var xaxis = _Cesium2.default.Matrix3.getColumn(mat, 0, new _Cesium2.default.Cartesian3());
        var yaxis = _Cesium2.default.Matrix3.getColumn(mat, 1, new _Cesium2.default.Cartesian3());
        var zaxis = _Cesium2.default.Matrix3.getColumn(mat, 2, new _Cesium2.default.Cartesian3());

        //计算该位置 和  positionCenter 的 角度值
        var dir = _Cesium2.default.Cartesian3.subtract(positionNew, positionCenter, new _Cesium2.default.Cartesian3());
        //z crosss (dirx cross z) 得到在 xy平面的向量
        dir = _Cesium2.default.Cartesian3.cross(dir, zaxis, dir);
        dir = _Cesium2.default.Cartesian3.cross(zaxis, dir, dir);
        dir = _Cesium2.default.Cartesian3.normalize(dir, dir);

        var heading = _Cesium2.default.Cartesian3.angleBetween(xaxis, dir);

        var ay = _Cesium2.default.Cartesian3.angleBetween(yaxis, dir);
        if (ay > Math.PI * 0.5) {
            heading = 2 * Math.PI - heading;
        }

        return -_Cesium2.default.Math.toDegrees(heading);
    }

});

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//百度地图

var height = 33746824;
var width = 33554054;

function BaiduImageryProvider(option) {
    var url;
    switch (option.layer) {
        case "vec":
        default:
            url = 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'ph' : 'pl') + '&scaler=1&p=1';
            break;
        case "img_d":
            url = 'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46';
            break;
        case "img_z":
            url = 'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'sh' : 'sl') + '&v=020';
            break;

        case "custom":
            //Custom 各种自定义样式
            //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
            option.customid = option.customid || 'midnight';
            url = 'http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=' + option.customid;
            break;

        case "time":
            //实时路况
            var time = new Date().getTime();
            url = 'http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=' + time + '&label=web2D&v=017';
            break;
    }
    this._url = url;

    this._tileWidth = 256;
    this._tileHeight = 256;
    this._maximumLevel = 18;

    var rectangleSouthwestInMeters = new Cesium.Cartesian2(-width, -height);
    var rectangleNortheastInMeters = new Cesium.Cartesian2(width, height);
    this._tilingScheme = new Cesium.WebMercatorTilingScheme({ rectangleSouthwestInMeters: rectangleSouthwestInMeters, rectangleNortheastInMeters: rectangleNortheastInMeters });

    this._credit = undefined;
    this._rectangle = this._tilingScheme.rectangle;
    this._ready = true;
}
Cesium.defineProperties(BaiduImageryProvider.prototype, {
    url: {
        get: function get() {
            return this._url;
        }
    },

    token: {
        get: function get() {
            return this._token;
        }
    },

    proxy: {
        get: function get() {
            return this._proxy;
        }
    },

    tileWidth: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileWidth must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileWidth;
        }
    },

    tileHeight: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileHeight must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileHeight;
        }
    },

    maximumLevel: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._maximumLevel;
        }
    },

    minimumLevel: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return 0;
        }
    },

    tilingScheme: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tilingScheme;
        }
    },

    rectangle: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._rectangle;
        }
    },

    tileDiscardPolicy: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileDiscardPolicy;
        }
    },

    errorEvent: {
        get: function get() {
            return this._errorEvent;
        }
    },

    ready: {
        get: function get() {
            return this._ready;
        }
    },

    readyPromise: {
        get: function get() {
            return this._readyPromise.promise;
        }
    },

    credit: {
        get: function get() {
            return this._credit;
        }
    },

    usingPrecachedTiles: {
        get: function get() {
            return this._useTiles;
        }
    },

    hasAlphaChannel: {
        get: function get() {
            return true;
        }
    },

    layers: {
        get: function get() {
            return this._layers;
        }
    }
});

BaiduImageryProvider.prototype.getTileCredits = function (x, y, level) {
    return undefined;
};

BaiduImageryProvider.prototype.requestImage = function (x, y, level) {
    if (!this._ready) {
        throw new DeveloperError('requestImage must not be called before the imagery provider is ready.');
    }

    var tileW = this._tilingScheme.getNumberOfXTilesAtLevel(level);
    var tileH = this._tilingScheme.getNumberOfYTilesAtLevel(level);

    var url = this._url.replace('{x}', x - tileW / 2).replace('{y}', tileH / 2 - y - 1).replace('{z}', level).replace('{s}', Math.floor(Math.random() * 10));

    return Cesium.ImageryProvider.loadImage(this, url);
};

exports.BaiduImageryProvider = BaiduImageryProvider;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FeatureGridImageryProvider = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FeatureGridImageryProvider(options) {
    options = _Cesium2.default.defaultValue(options, _Cesium2.default.defaultValue.EMPTY_OBJECT);
    this.options = options;

    this._tileWidth = _Cesium2.default.defaultValue(options.tileWidth, 256);
    this._tileHeight = _Cesium2.default.defaultValue(options.tileHeight, 256);
    this._minimumLevel = _Cesium2.default.defaultValue(options.minimumLevel, 0);
    this._maximumLevel = options.maximumLevel;

    if (options.rectangle && options.rectangle.xmin && options.rectangle.xmax && options.rectangle.ymin && options.rectangle.ymax) {
        var xmin = options.rectangle.xmin;
        var xmax = options.rectangle.xmax;
        var ymin = options.rectangle.ymin;
        var ymax = options.rectangle.ymax;
        options.rectangle = _Cesium2.default.Rectangle.fromDegrees(xmin, ymin, xmax, ymax);
    }
    this._tilingScheme = _Cesium2.default.defaultValue(options.tilingScheme, new _Cesium2.default.GeographicTilingScheme({ ellipsoid: options.ellipsoid }));
    this._rectangle = _Cesium2.default.defaultValue(options.rectangle, this._tilingScheme.rectangle);
    this._rectangle = _Cesium2.default.Rectangle.intersection(this._rectangle, this._tilingScheme.rectangle);
    this._hasAlphaChannel = _Cesium2.default.defaultValue(options.hasAlphaChannel, true);

    this._errorEvent = new _Cesium2.default.Event();
    this._readyPromise = _Cesium2.default.when.resolve(true);
    this._credit = undefined;
    this._ready = true;
}

_Cesium2.default.defineProperties(FeatureGridImageryProvider.prototype, {
    url: {
        get: function get() {
            return this._url;
        }
    },

    token: {
        get: function get() {
            return this._token;
        }
    },

    proxy: {
        get: function get() {
            return this._proxy;
        }
    },

    tileWidth: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileWidth must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileWidth;
        }
    },

    tileHeight: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileHeight must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileHeight;
        }
    },

    maximumLevel: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._maximumLevel;
        }
    },

    minimumLevel: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug'); 
            return 0;
        }
    },

    tilingScheme: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tilingScheme;
        }
    },

    rectangle: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._rectangle;
        }
    },

    tileDiscardPolicy: {
        get: function get() {
            //>>includeStart('debug', pragmas.debug);
            if (!this._ready) {
                throw new DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
            }
            //>>includeEnd('debug');

            return this._tileDiscardPolicy;
        }
    },

    errorEvent: {
        get: function get() {
            return this._errorEvent;
        }
    },

    ready: {
        get: function get() {
            return this._ready;
        }
    },

    readyPromise: {
        get: function get() {
            return this._readyPromise.promise;
        }
    },

    credit: {
        get: function get() {
            return this._credit;
        }
    },

    usingPrecachedTiles: {
        get: function get() {
            return this._useTiles;
        }
    },

    hasAlphaChannel: {
        get: function get() {
            return true;
        }
    },

    layers: {
        get: function get() {
            return this._layers;
        }
    }
});

FeatureGridImageryProvider.prototype.getTileCredits = function (x, y, level) {
    return undefined;
};

//显示瓦片信息
FeatureGridImageryProvider.prototype.requestImage = function (x, y, level) {
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    if (level < this._minimumLevel) return canvas;

    if (this.options.debuggerTileInfo) {
        var context = canvas.getContext('2d');

        context.strokeStyle = '#ffff00';
        context.lineWidth = 2;
        context.strokeRect(1, 1, 255, 255);

        var label = 'L' + level + 'X' + x + 'Y' + y;
        context.font = 'bold 25px Arial';
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.fillText(label, 127, 127);
        context.fillStyle = '#ffff00';
        context.fillText(label, 124, 124);
    }
    return canvas;
};

FeatureGridImageryProvider.prototype._getGridKey = function (opts) {
    return opts.level + "_x" + opts.x + "_y" + opts.y;
};

FeatureGridImageryProvider.prototype.addImageryCache = function (opts) {
    if (opts.level < this._minimumLevel || opts.level < opts.maxLevel - 1) return;

    //console.log('新增' + JSON.stringify(opts));
    if (this.options.addImageryCache) {
        opts.key = this._getGridKey(opts);
        this.options.addImageryCache(opts);
    }
};

FeatureGridImageryProvider.prototype.removeImageryCache = function (opts) {
    if (opts.maxLevel < this._minimumLevel && this.options.removeAllImageryCache) {
        this.options.removeAllImageryCache();
    }
    if (opts.level < this._minimumLevel) return;

    //console.log('删除' + JSON.stringify(opts));
    if (this.options.removeImageryCache) {
        opts.key = this._getGridKey(opts);
        this.options.removeImageryCache(opts);
    }
};

exports.FeatureGridImageryProvider = FeatureGridImageryProvider;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHeadingPitchRollByOrientation = getHeadingPitchRollByOrientation;
exports.getHeadingPitchRollByMatrix = getHeadingPitchRollByMatrix;
exports.getHeadingPitchRollForLine = getHeadingPitchRollForLine;
exports.getRotateCenterPoint = getRotateCenterPoint;
exports.getPositionTranslation = getPositionTranslation;
exports.getOffsetLine = getOffsetLine;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var matrix3Scratch = new _Cesium2.default.Matrix3(); //一些涉及矩阵计算的方法

var matrix4Scratch = new _Cesium2.default.Matrix4();

// 根据模型的orientation求方位角
function getHeadingPitchRollByOrientation(position, orientation) {
    var matrix = _Cesium2.default.Matrix4.fromRotationTranslation(_Cesium2.default.Matrix3.fromQuaternion(orientation, matrix3Scratch), position, matrix4Scratch);
    var hpr = getHeadingPitchRollByMatrix(position, matrix);
    return hpr;
}

// 根据模型的matrix矩阵求方位角
//Cesium.Transforms.fixedFrameToHeadingPitchRoll 
function getHeadingPitchRollByMatrix(position, matrix) {
    // 计算当前模型中心处的变换矩阵
    var m1 = _Cesium2.default.Transforms.eastNorthUpToFixedFrame(position, _Cesium2.default.Ellipsoid.WGS84, new _Cesium2.default.Matrix4());
    // 矩阵相除
    var m3 = _Cesium2.default.Matrix4.multiply(_Cesium2.default.Matrix4.inverse(m1, new _Cesium2.default.Matrix4()), matrix, new _Cesium2.default.Matrix4());
    // 得到旋转矩阵
    var mat3 = _Cesium2.default.Matrix4.getRotation(m3, new _Cesium2.default.Matrix3());
    // 计算四元数
    var q = _Cesium2.default.Quaternion.fromRotationMatrix(mat3);
    // 计算旋转角(弧度)
    var hpr = _Cesium2.default.HeadingPitchRoll.fromQuaternion(q);

    // 得到角度
    //var heading = Cesium.Math.toDegrees(hpr.heading);
    //var pitch = Cesium.Math.toDegrees(hpr.pitch);
    //var roll = Cesium.Math.toDegrees(hpr.roll);
    //console.log('heading : ' + heading, 'pitch : ' + pitch, 'roll : ' + roll);

    return hpr;
}

var cartesian3 = new _Cesium2.default.Cartesian3();
var matrix4Scratch = new _Cesium2.default.Matrix4();
var rotationScratch = new _Cesium2.default.Matrix3();

//求localStart点到localEnd点的方向
function getHeadingPitchRollForLine(localStart, localEnd, ellipsoid) {
    ellipsoid = ellipsoid || _Cesium2.default.Ellipsoid.WGS84;

    var velocity = _Cesium2.default.Cartesian3.normalize(_Cesium2.default.Cartesian3.subtract(localEnd, localStart, cartesian3), cartesian3);
    _Cesium2.default.Transforms.rotationMatrixFromPositionVelocity(localStart, velocity, ellipsoid, rotationScratch);
    var modelMatrix = _Cesium2.default.Matrix4.fromRotationTranslation(rotationScratch, localStart, matrix4Scratch);

    _Cesium2.default.Matrix4.multiplyTransformation(modelMatrix, _Cesium2.default.Axis.Z_UP_TO_X_UP, modelMatrix);

    var hpr = getHeadingPitchRollByMatrix(localStart, modelMatrix);
    return hpr;
}

//获取点point1绕点center的地面法向量旋转顺时针angle角度后新坐标
function getRotateCenterPoint(center, point1, angle) {
    // 计算center的地面法向量
    var chicB = _Cesium2.default.Cartographic.fromCartesian(center);
    chicB.height = 0;
    var dB = _Cesium2.default.Cartographic.toCartesian(chicB);
    var normaB = _Cesium2.default.Cartesian3.normalize(_Cesium2.default.Cartesian3.subtract(dB, center, new _Cesium2.default.Cartesian3()), new _Cesium2.default.Cartesian3());

    // 构造基于center的法向量旋转90度的矩阵
    var Q = _Cesium2.default.Quaternion.fromAxisAngle(normaB, _Cesium2.default.Math.toRadians(angle));
    var m3 = _Cesium2.default.Matrix3.fromQuaternion(Q);
    var m4 = _Cesium2.default.Matrix4.fromRotationTranslation(m3);

    // 计算point1点相对center点的坐标A1
    var A1 = _Cesium2.default.Cartesian3.subtract(point1, center, new _Cesium2.default.Cartesian3());

    //对A1应用旋转矩阵
    var p = _Cesium2.default.Matrix4.multiplyByPoint(m4, A1, new _Cesium2.default.Cartesian3());
    // 新点的坐标
    var pointNew = _Cesium2.default.Cartesian3.add(p, center, new _Cesium2.default.Cartesian3());

    return pointNew;
}

//获取点的offest平移矩阵后点
function getPositionTranslation(position, offest, degree, type) {
    degree = degree || 0;
    type = type || "z";

    var rotate = _Cesium2.default.Math.toRadians(-degree); //转成弧度
    type = "UNIT_" + type.toUpperCase();
    var quaternion = _Cesium2.default.Quaternion.fromAxisAngle(_Cesium2.default.Cartesian3[type], rotate); //quaternion为围绕这个z轴旋转d度的四元数
    var rotateMatrix3 = _Cesium2.default.Matrix3.fromQuaternion(quaternion); //rotateMatrix3为根据四元数求得的旋转矩阵
    var pointCartesian3 = new _Cesium2.default.Cartesian3(offest.x, offest.y, offest.z); //point的局部坐标
    var rotateTranslationMatrix4 = _Cesium2.default.Matrix4.fromRotationTranslation(rotateMatrix3, _Cesium2.default.Cartesian3.ZERO); //rotateTranslationMatrix4为旋转加平移的4x4变换矩阵，这里平移为(0,0,0)，故填个Cesium.Cartesian3.ZERO
    _Cesium2.default.Matrix4.multiplyByTranslation(rotateTranslationMatrix4, pointCartesian3, rotateTranslationMatrix4); //rotateTranslationMatrix4 = rotateTranslationMatrix4  X  pointCartesian3
    var originPositionCartesian3 = _Cesium2.default.Ellipsoid.WGS84.cartographicToCartesian(_Cesium2.default.Cartographic.fromCartesian(position)); //得到局部坐标原点的全局坐标
    var originPositionTransform = _Cesium2.default.Transforms.eastNorthUpToFixedFrame(originPositionCartesian3); //m1为局部坐标的z轴垂直于地表，局部坐标的y轴指向正北的4x4变换矩阵
    _Cesium2.default.Matrix4.multiplyTransformation(originPositionTransform, rotateTranslationMatrix4, rotateTranslationMatrix4); //rotateTranslationMatrix4 = rotateTranslationMatrix4 X originPositionTransform
    var pointCartesian = new _Cesium2.default.Cartesian3();
    _Cesium2.default.Matrix4.getTranslation(rotateTranslationMatrix4, pointCartesian); //根据最终变换矩阵m得到p2
    return pointCartesian;
}

//计算平行线，offset正负决定方向（单位米）
function getOffsetLine(positions, offset) {
    var arrNew = [];
    for (var i = 1; i < positions.length; i++) {
        var point1 = positions[i - 1];
        var point2 = positions[i];

        var dir12 = _Cesium2.default.Cartesian3.subtract(point1, point2, new _Cesium2.default.Cartesian3());
        var dir21left = _Cesium2.default.Cartesian3.cross(point1, dir12, new _Cesium2.default.Cartesian3());

        var p1offset = computedOffsetData(point1, dir21left, offset * 1000);
        var p2offset = computedOffsetData(point2, dir21left, offset * 1000);

        if (i == 1) {
            arrNew.push(p1offset);
        }
        arrNew.push(p2offset);
    }
    return arrNew;
}

function computedOffsetData(ori, dir, wid) {
    var currRay = new _Cesium2.default.Ray(ori, dir);
    return _Cesium2.default.Ray.getPoint(currRay, wid, new _Cesium2.default.Cartesian3());
}

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Measure = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _Draw = __webpack_require__(25);

var _EventType = __webpack_require__(8);

var DrawEventType = _interopRequireWildcard(_EventType);

var _AttrLabel = __webpack_require__(13);

var _AttrPolygon = __webpack_require__(16);

var polygonAttr = _interopRequireWildcard(_AttrPolygon);

var _util = __webpack_require__(4);

var _point = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Measure = function Measure(opts) {
    var viewer = opts.viewer;

    //显示测量结果文本的字体
    var _labelAttr = {
        "color": "#ffffff",
        "font_family": "楷体",
        "font_size": 20,
        "border": true,
        "border_color": "#000000",
        "border_width": 3,
        "background": true,
        "background_color": "#000000",
        "background_opacity": 0.5,
        "scaleByDistance": true,
        "scaleByDistance_far": 800000,
        "scaleByDistance_farValue": 0.5,
        "scaleByDistance_near": 1000,
        "scaleByDistance_nearValue": 1,
        "pixelOffset": [0, -15],
        disableDepthTestDistance: Number.POSITIVE_INFINITY //一直显示，不被地形等遮挡
    };
    if (opts.label) {
        for (var key in opts.label) {
            _labelAttr[key] = opts.label[key];
        }
    }

    var thisType = ""; //当前正在绘制的类别 
    var drawControl = new _Draw.Draw(viewer, { hasEdit: false, removeScreenSpaceEvent: false });

    //事件监听
    drawControl.on(DrawEventType.DrawAddPoint, function (e) {
        var entity = e.entity;
        switch (thisType) {
            case "length":
            case "section":
                workLength.showAddPointLength(entity);
                break;
            case "area":
                workArea.showAddPointLength(entity);
                break;
            case "volume":
                workVolume.showAddPointLength(entity);
                break;
            case "height":
                workHeight.showAddPointLength(entity);
                break;
            case "super_height":
                workSuperHeight.showAddPointLength(entity);
                break;
            case "angle":
                workAngle.showAddPointLength(entity);
                break;

        }
    });
    drawControl.on(DrawEventType.DrawRemovePoint, function (e) {
        switch (thisType) {
            case "length":
            case "section":
                workLength.showRemoveLastPointLength(e);
                break;
            case "area":
                workArea.showRemoveLastPointLength(e);
                break;
            case "volume":
                workVolume.showRemoveLastPointLength(e);
                break;
            case "height":
                workHeight.showRemoveLastPointLength(e);
                break;
            case "super_height":
                workSuperHeight.showRemoveLastPointLength(e);
                break;
            case "angle":
                workAngle.showRemoveLastPointLength(e);
                break;
        }
    });
    drawControl.on(DrawEventType.DrawMouseMove, function (e) {
        var entity = e.entity;
        switch (thisType) {
            case "length":
            case "section":
                workLength.showMoveDrawing(entity);
                break;
            case "area":
                workArea.showMoveDrawing(entity);
                break;
            case "volume":
                workVolume.showMoveDrawing(entity);
                break;
            case "height":
                workHeight.showMoveDrawing(entity);
                break;
            case "super_height":
                workSuperHeight.showMoveDrawing(entity);
                break;
            case "angle":
                workAngle.showMoveDrawing(entity);
                break;
        }
    });

    drawControl.on(DrawEventType.DrawCreated, function (e) {
        var entity = e.entity;
        switch (thisType) {
            case "length":
            case "section":
                workLength.showDrawEnd(entity);
                break;
            case "area":
                workArea.showDrawEnd(entity);
                break;
            case "volume":
                workVolume.showDrawEnd(entity);
                break;
            case "height":
                workHeight.showDrawEnd(entity);
                break;
            case "super_height":
                workSuperHeight.showDrawEnd(entity);
                break;
            case "angle":
                workAngle.showDrawEnd(entity);
                break;
        }
    });

    var dataSource = drawControl.getDataSource();

    /*长度测量*/
    function measuerLength(options) {
        endLastDraw();

        thisType = "length";
        options = options || {};
        options.type = thisType;
        if (!options.hasOwnProperty("terrain")) options.terrain = true;

        workLength.start(options);
    }

    /*剖面分析*/
    function measureSection(options) {
        endLastDraw();

        thisType = "section";
        options = options || {};
        options.type = thisType;
        options.terrain = true;

        workLength.start(options);
    }

    /*面积测量*/
    function measureArea(options) {
        endLastDraw();

        thisType = "area";
        options = options || {};
        options.type = thisType;

        workArea.start(options);
    };

    /*体积测量*/
    function measureVolume(options) {
        endLastDraw();

        thisType = "volume";
        options = options || {};
        options.type = thisType;

        workVolume.start(options);
    };

    /*高度测量*/
    function measureHeight(options) {
        endLastDraw();

        options = options || {};

        if (options.hasOwnProperty("isSuper") && !options.isSuper) {
            thisType = "height";
            options.type = thisType;
            workHeight.start(options);
        } else {
            thisType = "super_height";
            options.type = thisType;
            workSuperHeight.start(options);
        }
    };

    /*角度测量*/
    function measureAngle(options) {
        endLastDraw();

        thisType = "angle";
        options = options || {};
        options.type = thisType;

        workAngle.start(options);
    };

    //如果上次未完成绘制就单击了新的，清除之前未完成的。
    function endLastDraw() {
        workLength.clearLastNoEnd();
        workArea.clearLastNoEnd();
        workVolume.clearLastNoEnd();
        workHeight.clearLastNoEnd();
        workSuperHeight.clearLastNoEnd();
        workAngle.clearLastNoEnd();

        drawControl.stopDraw();
    }

    /*清除测量*/
    function clearMeasure() {
        thisType = "";
        endLastDraw();

        //dataSource.entities.removeAll();
        drawControl.deleteAll();
    };

    /** 更新量测结果的单位  */
    function updateUnit(thisType, unit) {
        var arr = dataSource.entities.values;
        for (var i in arr) {
            var entity = arr[i];
            if (entity.label && entity.isMarsMeasureLabel && entity.attribute && entity.attribute.value) {
                if (entity.attribute.type != thisType) continue;
                if (thisType == "area") {
                    entity.label.text._value = (entity.attribute.textEx || "") + formatArea(entity.attribute.value, unit);
                } else {
                    entity._label.text._value = (entity.attribute.textEx || "") + formatLength(entity.attribute.value, unit);
                }
            }
        }
    }

    var workLength = {
        options: null,
        arrLables: [], //各线段label
        totalLable: null, //总长label 
        disTerrainScale: 1.2, //贴地时的概略比例
        //清除未完成的数据
        clearLastNoEnd: function clearLastNoEnd() {
            if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
            if (this.arrLables && this.arrLables.length > 0) {
                var arrLables = this.arrLables;
                if (arrLables && arrLables.length > 0) {
                    for (var i in arrLables) {
                        dataSource.entities.remove(arrLables[i]);
                    }
                }
            }
            this.totalLable = null;
            this.arrLables = [];
        },
        //开始绘制
        start: function start(options) {
            this.options = options;

            //总长label 
            var entityattr = (0, _AttrLabel.style2Entity)(_labelAttr, {
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.LEFT,
                verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM,
                show: false
            });

            this.totalLable = dataSource.entities.add({
                label: entityattr,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });
            this.arrLables = [];

            drawControl.startDraw({
                type: "polyline",
                config: {
                    addHeight: options.addHeight
                },
                style: options.style || {
                    "lineType": "glow",
                    "color": "#ebe12c",
                    "width": 9,
                    "glowPower": 0.1,
                    "clampToGround": this.options.type == "section" || this.options.terrain //是否贴地 
                }
            });
        },
        //绘制增加一个点后，显示该分段的长度
        showAddPointLength: function showAddPointLength(entity) {
            var positions = drawControl.getPositions(entity);

            var entityattr = (0, _AttrLabel.style2Entity)(_labelAttr, {
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.LEFT,
                verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM,
                show: true
            });

            var tempSingleLabel = dataSource.entities.add({
                position: positions[positions.length - 1],
                label: entityattr,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            if (positions.length == 1) {
                tempSingleLabel.label.text = "起点";
                //tempSingleLabel.attribute.value = 0;
            } else {
                var distance = this.getLength(positions);
                var distancestr = formatLength(distance, this.options.unit);

                tempSingleLabel.label.text = distancestr;
                tempSingleLabel.attribute.value = distance;

                //屏蔽比较小的数值
                if (this.getLength([positions[positions.length - 2], positions[positions.length - 1]]) < 5) tempSingleLabel.show = false;
            }
            this.arrLables.push(tempSingleLabel);
        },
        showRemoveLastPointLength: function showRemoveLastPointLength(e) {
            var label = this.arrLables.pop();
            dataSource.entities.remove(label);

            this.showMoveDrawing(e.entity);
            this.totalLable.position = e.position;
        },
        //绘制过程移动中，动态显示长度信息
        showMoveDrawing: function showMoveDrawing(entity) {
            var positions = drawControl.getPositions(entity);
            if (positions.length < 2) {
                this.totalLable.label.show = false;
                return;
            }

            var distance = this.getLength(positions);
            var distancestr = formatLength(distance, this.options.unit);

            this.totalLable.position = positions[positions.length - 1];
            this.totalLable.label.text = "总长:" + distancestr;
            this.totalLable.label.show = true;

            this.totalLable.attribute.value = distance;
            this.totalLable.attribute.textEx = "总长:";

            if (this.options.calback) this.options.calback(distancestr, distance);
        },
        //绘制完成后
        showDrawEnd: function showDrawEnd(entity) {
            var positions = drawControl.getPositions(entity);
            var count = this.arrLables.length - positions.length;
            if (count >= 0) {
                for (var i = this.arrLables.length - 1; i >= positions.length - 1; i--) {
                    dataSource.entities.remove(this.arrLables[i]);
                }
                this.arrLables.splice(positions.length - 1, count + 1);
            }
            entity._totalLable = this.totalLable;
            entity._arrLables = this.arrLables;

            this.totalLable = null;
            this.arrLables = [];

            if (entity.polyline == null) return;

            if (this.options.type == "section") this.updateSectionForTerrain(entity);else if (this.options.terrain) this.updateLengthForTerrain(entity);
        },
        //计算贴地线
        updateLengthForTerrain: function updateLengthForTerrain(entity) {
            var that = this;
            var positions = entity.polyline.positions.getValue();
            var arrLables = entity._arrLables;
            var totalLable = entity._totalLable;
            var unit = totalLable && totalLable.unit;

            var index = 0;
            var all_distance = 0;

            function getLineFD() {
                index++;

                if (index >= positions.length && totalLable) {
                    var distancestr = formatLength(all_distance, unit);

                    totalLable.label.text = "总长:" + distancestr;
                    totalLable.attribute.value = all_distance;

                    if (that.options.calback) that.options.calback(distancestr, all_distance);
                    return;
                }

                var arr = [positions[index - 1], positions[index]];
                (0, _util.terrainPolyline)({
                    viewer: viewer,
                    positions: arr,
                    calback: function calback(raisedPositions, noHeight) {
                        var distance = that.getLength(raisedPositions);
                        if (noHeight) {
                            distance = distance * that.disTerrainScale; //求高度失败，概略估算值
                        }

                        var thisLabel = arrLables[index];
                        if (thisLabel) {
                            var distancestr = formatLength(distance, unit);

                            thisLabel.label.text = distancestr;
                            thisLabel.attribute.value = distance;
                        }

                        all_distance += distance;
                        getLineFD();
                    }
                });
            }
            getLineFD();
        },

        //计算剖面
        updateSectionForTerrain: function updateSectionForTerrain(entity) {
            var positions = entity.polyline.positions.getValue();
            if (positions.length < 2) return;

            var arrLables = entity._arrLables;
            var totalLable = entity._totalLable;
            var unit = totalLable && totalLable.unit;

            var index = 0;
            var positionsNew = [];

            var alllen = 0;
            var arrLen = [];
            var arrHB = [];
            var arrLX = [];
            var arrPoint = [];

            var that = this;
            function getLineFD() {
                index++;

                var arr = [positions[index - 1], positions[index]];
                (0, _util.terrainPolyline)({
                    viewer: viewer,
                    positions: arr,
                    calback: function calback(raisedPositions, noHeight) {
                        if (noHeight) {
                            if (index == 1) positionsNew = positionsNew.concat(arr);else positionsNew = positionsNew.concat([positions[index]]);
                        } else {
                            positionsNew = positionsNew.concat(raisedPositions);
                        }

                        var h1 = _Cesium2.default.Cartographic.fromCartesian(positions[index - 1]).height;
                        var h2 = _Cesium2.default.Cartographic.fromCartesian(positions[index]).height;
                        var hstep = (h2 - h1) / raisedPositions.length;

                        for (var i = 0; i < raisedPositions.length; i++) {
                            //长度
                            if (i != 0) {
                                alllen += _Cesium2.default.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
                            }
                            arrLen.push(Number(alllen.toFixed(1)));

                            //海拔高度
                            var point = (0, _point.formatPositon)(raisedPositions[i]);
                            arrHB.push(point.z);
                            arrPoint.push(point);

                            //路线高度
                            var fxgd = Number((h1 + hstep * i).toFixed(1));
                            arrLX.push(fxgd);
                        }

                        if (index >= positions.length - 1) {
                            if (totalLable) {
                                var distance = that.getLength(positionsNew);
                                var distancestr = formatLength(distance, unit);

                                totalLable.label.text = "总长:" + distancestr;
                                totalLable.attribute.value = distance;
                            }
                            if (that.options.calback) that.options.calback({
                                distancestr: distancestr,
                                distance: distance,
                                arrLen: arrLen,
                                arrLX: arrLX,
                                arrHB: arrHB,
                                arrPoint: arrPoint
                            });
                        } else {
                            var distance = that.getLength(raisedPositions);
                            var distancestr = formatLength(distance, unit);

                            var thisLabel = arrLables[index];
                            thisLabel.label.text = distancestr;
                            thisLabel.attribute.value = distance;

                            getLineFD();
                        }
                    }
                });
            }
            getLineFD();
        },
        //计算长度，单位：米
        getLength: function getLength(positions) {
            var distance = 0;
            for (var i = 0, len = positions.length - 1; i < len; i++) {
                distance += _Cesium2.default.Cartesian3.distance(positions[i], positions[i + 1]);
            }
            return distance;
        }
    };

    var workArea = {
        options: null,
        totalLable: null, //面积label
        //清除未完成的数据
        clearLastNoEnd: function clearLastNoEnd() {
            if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
            this.totalLable = null;
        },
        //开始绘制
        start: function start(options) {
            this.options = options;

            var entityattr = (0, _AttrLabel.style2Entity)(_labelAttr, {
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.CENTER,
                verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM,
                show: false
            });

            this.totalLable = dataSource.entities.add({
                label: entityattr,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            drawControl.startDraw({
                type: "polygon",
                style: options.style || {
                    color: "#00fff2",
                    outline: true,
                    outlineColor: "#fafa5a",
                    outlineWidth: 1,
                    opacity: 0.4,
                    clampToGround: true //贴地
                }
            });
        },
        //绘制增加一个点后，显示该分段的长度
        showAddPointLength: function showAddPointLength(entity) {},
        //绘制中删除了最后一个点
        showRemoveLastPointLength: function showRemoveLastPointLength(e) {
            var positions = drawControl.getPositions(e.entity);
            if (positions.length < 3) {
                this.totalLable.label.show = false;
            }
        },
        //绘制过程移动中，动态显示长度信息
        showMoveDrawing: function showMoveDrawing(entity) {
            var positions = drawControl.getPositions(entity);
            if (positions.length < 3) {
                this.totalLable.label.show = false;
                return;
            }

            var polygon = polygonAttr.toGeoJSON(entity);
            var area = turf.area(polygon);
            var areastr = formatArea(area, this.options.unit);

            //求中心点  
            var maxHeight = (0, _point.getMaxHeight)(positions);
            var center = turf.centerOfMass(polygon);
            var ptcenter = _Cesium2.default.Cartesian3.fromDegrees(center.geometry.coordinates[0], center.geometry.coordinates[1], maxHeight + 1);

            this.totalLable.position = ptcenter;
            this.totalLable.label.text = "面积:" + areastr;
            this.totalLable.label.show = true;

            this.totalLable.attribute.value = area;
            this.totalLable.attribute.textEx = "面积:";

            if (this.options.calback) this.options.calback(areastr, area);
        },
        //绘制完成后
        showDrawEnd: function showDrawEnd(entity) {
            if (entity.polygon == null) return;

            var polyPositions = entity.polygon.hierarchy.getValue();

            //最后的高程加1，以确保端点显示在模型上面
            for (var i = 0, len = polyPositions.length; i < len; i++) {
                polyPositions[i].z = polyPositions[i].z + 1;
            }

            entity._totalLable = this.totalLable;
            this.totalLable = null;
        }
    };

    var workVolume = {
        options: null,
        totalLable: null, //体积label
        prevEntity: null, //立体边界
        //清除未完成的数据
        clearLastNoEnd: function clearLastNoEnd() {
            if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
            this.totalLable = null;

            if (this.prevEntity != null) dataSource.entities.remove(this.prevEntity);
            this.prevEntity = null;
        },
        //开始绘制
        start: function start(options) {
            this.options = options;

            var entityattr = (0, _AttrLabel.style2Entity)(_labelAttr, {
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.CENTER,
                verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM,
                show: false
            });

            this.totalLable = dataSource.entities.add({
                label: entityattr,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            drawControl.startDraw({
                type: "polygon",
                style: options.style || {
                    color: "#00fff2",
                    outline: true,
                    outlineColor: "#fafa5a",
                    outlineWidth: 1,
                    opacity: 0.4,
                    clampToGround: true //贴地
                }
            });
        },
        //绘制增加一个点后，显示该分段的长度
        showAddPointLength: function showAddPointLength(entity) {},
        //绘制中删除了最后一个点
        showRemoveLastPointLength: function showRemoveLastPointLength(e) {},
        //绘制过程移动中，动态显示长度信息
        showMoveDrawing: function showMoveDrawing(entity) {},
        //绘制完成后
        showDrawEnd: function showDrawEnd(entity) {
            if (entity.polygon == null) return;

            var positions = entity.polygon.hierarchy.getValue();
            var result = this.computeCutVolume(positions);

            var maxHeight = result.maxHeight;
            var totalCutVolume = result.totalCutVolume;

            var totalCutVolumestr = totalCutVolume.toFixed(2) + "立方米"; ///formatArea(totalCutVolume, this.options.unit);

            //求中心点 
            var centroid = (0, _point.centerOfMass)(positions);
            var ptcenter = _Cesium2.default.Cartesian3.fromRadians(centroid.longitude, centroid.latitude, maxHeight + 10);

            this.totalLable.position = ptcenter;
            this.totalLable.label.text = "挖方体积:" + totalCutVolumestr;
            this.totalLable.label.show = true;

            this.totalLable.attribute.value = totalCutVolume;
            this.totalLable.attribute.textEx = "挖方体积:";

            if (this.options.calback) this.options.calback(areastr, totalCutVolume);

            dataSource.entities.remove(entity);
            //显示立体边界
            entity = dataSource.entities.add({
                polygon: {
                    hierarchy: {
                        positions: positions
                    },
                    extrudedHeight: maxHeight,
                    closeTop: false,
                    closeBottom: false,
                    material: new _Cesium2.default.Color.fromCssColorString("#00fff2").withAlpha(0.5),
                    outline: true,
                    outlineColor: new _Cesium2.default.Color.fromCssColorString("#fafa5a").withAlpha(0.4),
                    outlineWidth: 1
                }
            });

            entity._totalLable = this.totalLable;
            this.totalLable = null;
        },
        computeCutVolume: function computeCutVolume(positions) {
            var minHeight = 15000;
            for (var i = 0; i < positions.length; i++) {
                var cartographic = _Cesium2.default.Cartographic.fromCartesian(positions[i]);
                var height = viewer.scene.globe.getHeight(cartographic);
                if (minHeight > height) minHeight = height;
            }

            var granularity = Math.PI / Math.pow(2, 11);
            granularity = granularity / 64;

            var polygonGeometry = new _Cesium2.default.PolygonGeometry.fromPositions({
                positions: positions,
                vertexFormat: _Cesium2.default.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
                granularity: granularity
            });
            //polygon subdivision
            var geom = new _Cesium2.default.PolygonGeometry.createGeometry(polygonGeometry);

            var totalCutVolume = 0;
            var maxHeight = 0;

            var i0, i1, i2;
            var height1, height2, height3;
            var p1, p2, p3;
            var cartesian;
            var cartographic;
            var bottomArea;

            for (var i = 0; i < geom.indices.length; i += 3) {
                i0 = geom.indices[i];
                i1 = geom.indices[i + 1];
                i2 = geom.indices[i + 2];

                cartesian = new _Cesium2.default.Cartesian3(geom.attributes.position.values[i0 * 3], geom.attributes.position.values[i0 * 3 + 1], geom.attributes.position.values[i0 * 3 + 2]);

                cartographic = _Cesium2.default.Cartographic.fromCartesian(cartesian);
                height1 = viewer.scene.globe.getHeight(cartographic);
                p1 = _Cesium2.default.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0 /*height1 + 1000*/);

                if (maxHeight < height1) maxHeight = height1;

                cartesian = new _Cesium2.default.Cartesian3(geom.attributes.position.values[i1 * 3], geom.attributes.position.values[i1 * 3 + 1], geom.attributes.position.values[i1 * 3 + 2]);

                cartographic = _Cesium2.default.Cartographic.fromCartesian(cartesian);
                height2 = viewer.scene.globe.getHeight(cartographic);

                var p2 = _Cesium2.default.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0 /*height2 + 1000*/);

                if (maxHeight < height2) maxHeight = height2;

                cartesian = new _Cesium2.default.Cartesian3(geom.attributes.position.values[i2 * 3], geom.attributes.position.values[i2 * 3 + 1], geom.attributes.position.values[i2 * 3 + 2]);

                cartographic = _Cesium2.default.Cartographic.fromCartesian(cartesian);
                height3 = viewer.scene.globe.getHeight(cartographic);
                p3 = _Cesium2.default.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0 /*height3 + 1000*/);

                if (maxHeight < height3) maxHeight = height3;

                bottomArea = this.computeAreaOfTriangle(p1, p2, p3);
                totalCutVolume = totalCutVolume + bottomArea * (height1 - minHeight + height2 - minHeight + height3 - minHeight) / 3;
            }

            return {
                maxHeight: maxHeight,
                totalCutVolume: totalCutVolume
            };
        },
        computeAreaOfTriangle: function computeAreaOfTriangle(pos1, pos2, pos3) {
            var a = _Cesium2.default.Cartesian3.distance(pos1, pos2);
            var b = _Cesium2.default.Cartesian3.distance(pos2, pos3);
            var c = _Cesium2.default.Cartesian3.distance(pos3, pos1);
            var S = (a + b + c) / 2;
            return Math.sqrt(S * (S - a) * (S - b) * (S - c));
        }

    };

    var workHeight = {
        options: null,
        totalLable: null, //高度label  
        //清除未完成的数据
        clearLastNoEnd: function clearLastNoEnd() {
            if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
            this.totalLable = null;
        },
        //开始绘制
        start: function start(options) {
            this.options = options;

            var entityattr = (0, _AttrLabel.style2Entity)(_labelAttr, {
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.RIGHT,
                verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM,
                show: false
            });

            this.totalLable = dataSource.entities.add({
                label: entityattr,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            drawControl.startDraw({
                type: "polyline",
                config: { maxPointNum: 2 },
                style: options.style || {
                    "lineType": "glow",
                    "color": "#ebe12c",
                    "width": 9,
                    "glowPower": 0.1
                }
            });
        },
        //绘制增加一个点后，显示该分段的长度
        showAddPointLength: function showAddPointLength(entity) {},
        //绘制中删除了最后一个点
        showRemoveLastPointLength: function showRemoveLastPointLength(e) {
            if (this.totalLable) this.totalLable.label.show = false;
        },
        //绘制过程移动中，动态显示长度信息
        showMoveDrawing: function showMoveDrawing(entity) {
            var positions = drawControl.getPositions(entity);
            if (positions.length < 2) {
                this.totalLable.label.show = false;
                return;
            }

            var cartographic = _Cesium2.default.Cartographic.fromCartesian(positions[0]);
            var cartographic1 = _Cesium2.default.Cartographic.fromCartesian(positions[1]);
            var height = Math.abs(cartographic1.height - cartographic.height);
            var heightstr = formatLength(height, this.options.unit);

            this.totalLable.position = _Cesium2.default.Cartesian3.midpoint(positions[0], positions[1], new _Cesium2.default.Cartesian3());
            this.totalLable.label.text = "高度差:" + heightstr;
            this.totalLable.label.show = true;

            this.totalLable.attribute.value = height;
            this.totalLable.attribute.textEx = "高度差:";

            if (this.options.calback) this.options.calback(heightstr, height);
        },
        //绘制完成后
        showDrawEnd: function showDrawEnd(entity) {
            entity._totalLable = this.totalLable;
            this.totalLable = null;
        }
    };

    var workSuperHeight = {
        options: null,
        totalLable: null, //高度差label
        xLable: null, //水平距离label
        hLable: null, //水平距离label
        //清除未完成的数据
        clearLastNoEnd: function clearLastNoEnd() {
            if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
            if (this.xLable != null) dataSource.entities.remove(this.xLable);
            if (this.hLable != null) dataSource.entities.remove(this.hLable);

            this.totalLable = null;
            this.xLable = null;
            this.hLable = null;
        },
        //开始绘制
        start: function start(options) {
            this.options = options;

            var entityattr = (0, _AttrLabel.style2Entity)(_labelAttr, {
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.RIGHT,
                verticalOrigin: _Cesium2.default.VerticalOrigin.CENTER,
                show: false
            });
            this.totalLable = dataSource.entities.add({
                label: entityattr,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            var entityattr2 = (0, _AttrLabel.style2Entity)(_labelAttr, {
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.CENTER,
                verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM,
                show: false
            });
            entityattr2.pixelOffset = new _Cesium2.default.Cartesian2(0, 0);
            this.xLable = dataSource.entities.add({
                label: entityattr2,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            this.hLable = dataSource.entities.add({
                label: entityattr2,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            drawControl.startDraw({
                type: "polyline",
                //minMaxPoints: { min: 2, max: 2, isSuper: true },
                config: { maxPointNum: 2 },
                style: options.style || {
                    "lineType": "glow",
                    "color": "#ebe12c",
                    "width": 9,
                    "glowPower": 0.1
                }
            });
        },
        //绘制增加一个点后，显示该分段的长度
        showAddPointLength: function showAddPointLength(entity) {
            var lonlats = drawControl.getPositions(entity);
            if (lonlats.length == 4) {
                var mouseEndPosition = lonlats[3].clone();
                lonlats.pop();
                lonlats.pop();
                lonlats.pop();
                lonlats.push(mouseEndPosition);
            }

            if (lonlats.length == 2) {
                var zCartesian = this.getZHeightPosition(lonlats[0], lonlats[1]);
                var hDistance = this.getHDistance(lonlats[0], lonlats[1]);
                if (hDistance > 3.0) {
                    lonlats.push(zCartesian);
                    lonlats.push(lonlats[0]);
                }
            }

            this.showSuperHeight(lonlats);
        },
        //绘制中删除了最后一个点 
        showRemoveLastPointLength: function showRemoveLastPointLength(e) {
            var lonlats = drawControl.getPositions(e.entity);
            if (lonlats.length == 2) {
                lonlats.pop();
                lonlats.pop();

                this.totalLable.label.show = false;
                this.hLable.label.show = false;
                this.xLable.label.show = false;
            }
        },
        //绘制过程移动中，动态显示长度信息
        showMoveDrawing: function showMoveDrawing(entity) {
            var lonlats = drawControl.getPositions(entity);
            if (lonlats.length == 4) {
                var mouseEndPosition = lonlats[3].clone();
                lonlats.pop();
                lonlats.pop();
                lonlats.pop();
                lonlats.push(mouseEndPosition);
            }

            if (lonlats.length == 2) {
                var zCartesian = this.getZHeightPosition(lonlats[0], lonlats[1]);
                var hDistance = this.getHDistance(lonlats[0], lonlats[1]);
                if (hDistance > 3.0) {
                    lonlats.push(zCartesian);
                    lonlats.push(lonlats[0]);
                }
            }
            this.showSuperHeight(lonlats);
        },
        //绘制完成后
        showDrawEnd: function showDrawEnd(entity) {
            entity._arrLables = [this.totalLable, this.hLable, this.xLable];

            this.totalLable = null;
            this.hLable = null;
            this.xLable = null;
        },

        /**
         * 超级 高程测量
         * 由4个点形成的三角形（首尾点相同），计算该三角形三条线段的长度
         * @param {Array} positions 4个点形成的点数组
         */
        showSuperHeight: function showSuperHeight(positions) {
            var vLength; //垂直距离
            var hLength; //水平距离
            var lLength; //长度
            var height;
            if (positions.length == 4) {
                var midLPoint = _Cesium2.default.Cartesian3.midpoint(positions[0], positions[1], new _Cesium2.default.Cartesian3());
                var midXPoint, midHPoint;
                var cartographic0 = _Cesium2.default.Cartographic.fromCartesian(positions[0]);
                var cartographic1 = _Cesium2.default.Cartographic.fromCartesian(positions[1]);
                var cartographic2 = _Cesium2.default.Cartographic.fromCartesian(positions[2]);
                var tempHeight = cartographic1.height - cartographic2.height;
                height = cartographic1.height - cartographic0.height;
                lLength = _Cesium2.default.Cartesian3.distance(positions[0], positions[1]);
                if (height > -1 && height < 1) {
                    midHPoint = positions[1];
                    this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差:", height);
                    this.updateSuperHeightLabel(this.hLable, midLPoint, "", lLength);
                } else {
                    if (tempHeight > -0.1 && tempHeight < 0.1) {
                        midXPoint = _Cesium2.default.Cartesian3.midpoint(positions[2], positions[1], new _Cesium2.default.Cartesian3());
                        midHPoint = _Cesium2.default.Cartesian3.midpoint(positions[2], positions[3], new _Cesium2.default.Cartesian3());
                        hLength = _Cesium2.default.Cartesian3.distance(positions[1], positions[2]);
                        vLength = _Cesium2.default.Cartesian3.distance(positions[3], positions[2]);
                    } else {
                        midHPoint = _Cesium2.default.Cartesian3.midpoint(positions[2], positions[1], new _Cesium2.default.Cartesian3());
                        midXPoint = _Cesium2.default.Cartesian3.midpoint(positions[2], positions[3], new _Cesium2.default.Cartesian3());
                        hLength = _Cesium2.default.Cartesian3.distance(positions[3], positions[2]);
                        vLength = _Cesium2.default.Cartesian3.distance(positions[1], positions[2]);
                    }
                    this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差:", vLength);
                    this.updateSuperHeightLabel(this.xLable, midXPoint, "", hLength);
                    this.updateSuperHeightLabel(this.hLable, midLPoint, "", lLength);
                }
            } else if (positions.length == 2) {
                vLength = _Cesium2.default.Cartesian3.distance(positions[1], positions[0]);
                var midHPoint = _Cesium2.default.Cartesian3.midpoint(positions[0], positions[1], new _Cesium2.default.Cartesian3());
                if (xLable.label.show) {
                    xLable.label.show = false;
                    hLable.label.show = false;
                }
                this.updateSuperHeightLabel(this.totalLable, midHPoint, "高度差:", vLength);
            }

            var heightstr = formatLength(vLength, this.options.unit);
            if (this.options.calback) this.options.calback(heightstr, vLength);
        },
        /**
         * 超级 高程测量 显示标签
         * @param {Cesium.Label} currentLabel 显示标签
         * @param {Cesium.Cartesian3} postion 坐标位置
         * @param {String} type 类型("高度差"，"水平距离"，"长度")
         * @param {Object} value 值
         */
        updateSuperHeightLabel: function updateSuperHeightLabel(currentLabel, postion, type, value) {
            if (currentLabel == null) return;

            currentLabel.position = postion;
            currentLabel.label.text = type + formatLength(value, this.options.unit);
            currentLabel.label.show = true;

            currentLabel.attribute.value = value;
            currentLabel.attribute.textEx = type;
        },

        /**
           * 带有高度差的两点，判断其直角点 
           */
        getZHeightPosition: function getZHeightPosition(cartesian1, cartesian2) {
            var carto1 = _Cesium2.default.Cartographic.fromCartesian(cartesian1);
            var lng1 = Number(_Cesium2.default.Math.toDegrees(carto1.longitude));
            var lat1 = Number(_Cesium2.default.Math.toDegrees(carto1.latitude));
            var height1 = Number(carto1.height.toFixed(2));

            var carto2 = _Cesium2.default.Cartographic.fromCartesian(cartesian2);
            var lng2 = Number(_Cesium2.default.Math.toDegrees(carto2.longitude));
            var lat2 = Number(_Cesium2.default.Math.toDegrees(carto2.latitude));
            var height2 = Number(carto2.height.toFixed(2));

            if (height1 > height2) return _Cesium2.default.Cartesian3.fromDegrees(lng2, lat2, height1);else return _Cesium2.default.Cartesian3.fromDegrees(lng1, lat1, height2);
        },

        /**
         * 带有高度差的两点，计算两点间的水平距离 
         */
        getHDistance: function getHDistance(cartesian1, cartesian2) {
            var zCartesian = this.getZHeightPosition(cartesian1, cartesian2);

            var carto1 = _Cesium2.default.Cartographic.fromCartesian(cartesian2);
            var cartoZ = _Cesium2.default.Cartographic.fromCartesian(zCartesian);

            var hDistance = _Cesium2.default.Cartesian3.distance(cartesian1, zCartesian);

            if (Math.abs(Number(cartoZ.height) - Number(carto1.height)) < 0.01) {
                hDistance = _Cesium2.default.Cartesian3.distance(cartesian2, zCartesian);
            }

            return hDistance;
        }

    };

    var workAngle = {
        options: null,
        totalLable: null, //角度label  
        exLine: null, //辅助线
        //清除未完成的数据
        clearLastNoEnd: function clearLastNoEnd() {
            if (this.totalLable != null) dataSource.entities.remove(this.totalLable);
            this.totalLable = null;

            if (this.exLine != null) dataSource.entities.remove(this.exLine);
            this.exLine = null;
        },
        //开始绘制
        start: function start(options) {
            this.options = options;

            var entityattr = (0, _AttrLabel.style2Entity)(_labelAttr, {
                horizontalOrigin: _Cesium2.default.HorizontalOrigin.LEFT,
                verticalOrigin: _Cesium2.default.VerticalOrigin.BOTTOM,
                show: false
            });

            this.totalLable = dataSource.entities.add({
                label: entityattr,
                isMarsMeasureLabel: true,
                attribute: {
                    unit: this.options.unit,
                    type: this.options.type
                }
            });

            drawControl.startDraw({
                type: "polyline",
                config: { maxPointNum: 2 },
                style: options.style || {
                    "lineType": "arrow",
                    "color": "#ebe967",
                    "width": 9,
                    "clampToGround": true
                }
            });
        },
        //绘制增加一个点后，显示该分段的长度
        showAddPointLength: function showAddPointLength(entity) {},
        //绘制中删除了最后一个点
        showRemoveLastPointLength: function showRemoveLastPointLength(e) {
            if (this.exLine) {
                this.exLine.polyline.show = false;
            }
            if (this.totalLable) this.totalLable.label.show = false;
        },
        //绘制过程移动中，动态显示长度信息
        showMoveDrawing: function showMoveDrawing(entity) {
            var positions = drawControl.getPositions(entity);
            if (positions.length < 2) {
                this.totalLable.label.show = false;
                return;
            }

            var len = _Cesium2.default.Cartesian3.distance(positions[0], positions[1]);

            //求方位角
            var point1 = (0, _point.formatPositon)(positions[0]);
            var point2 = (0, _point.formatPositon)(positions[1]);

            var pt1 = turf.point([point1.x, point1.y, point1.z]);
            var pt2 = turf.point([point2.x, point2.y, point2.z]);
            var bearing = Math.round(turf.rhumbBearing(pt1, pt2));

            //求参考点
            var newpoint = turf.destination(pt1, len / 3000, 0, { units: 'kilometers' }); //1/3
            newpoint = { x: newpoint.geometry.coordinates[0], y: newpoint.geometry.coordinates[1], z: point1.z };
            var new_position = _Cesium2.default.Cartesian3.fromDegrees(newpoint.x, newpoint.y, newpoint.z);

            this.updateExLine([positions[0], new_position]); //参考线


            this.totalLable.position = positions[1];
            this.totalLable.label.text = "角度:" + bearing + "°\n距离:" + formatLength(len);
            this.totalLable.label.show = true;

            this.totalLable.attribute.value = bearing;
            this.totalLable.attribute.textEx = "角度:";

            if (this.options.calback) this.options.calback(bearing + '°', bearing);
        },
        updateExLine: function updateExLine(positions) {
            if (this.exLine) {
                this.exLine.polyline.show = true;
                this.exLine.polyline.positions.setValue(positions);
            } else {
                this.exLine = dataSource.entities.add({
                    polyline: {
                        positions: positions,
                        width: 3,
                        clampToGround: true,
                        material: new _Cesium2.default.PolylineDashMaterialProperty({
                            color: _Cesium2.default.Color.RED
                        })
                    }
                });
            }
        },
        //绘制完成后
        showDrawEnd: function showDrawEnd(entity) {
            entity._totalLable = this.totalLable;
            this.totalLable = null;
            this.exLine = null;
        }

    };

    /**  进行单位换算，格式化显示面积    */
    function formatArea(val, unit) {
        if (val == null) return "";

        if (unit == null || unit == "auto") {
            if (val < 1000000) unit = "m";else unit = "km";
        }

        var valstr = "";
        switch (unit) {
            default:
            case "m":
                valstr = val.toFixed(2) + '平方米';
                break;
            case "km":
                valstr = (val / 1000000).toFixed(2) + '平方公里';
                break;
            case "mu":
                valstr = (val * 0.0015).toFixed(2) + '亩';
                break;
            case "ha":
                valstr = (val * 0.0001).toFixed(2) + '公顷';
                break;
        }

        return valstr;
    }

    /**  单位换算，格式化显示长度     */
    function formatLength(val, unit) {
        if (val == null) return "";

        if (unit == null || unit == "auto") {
            if (val < 1000) unit = "m";else unit = "km";
        }

        var valstr = "";
        switch (unit) {
            default:
            case "m":
                valstr = val.toFixed(2) + '米';
                break;
            case "km":
                valstr = (val * 0.001).toFixed(2) + '公里';
                break;
            case "mile":
                valstr = (val * 0.00054).toFixed(2) + '海里';
                break;
            case "zhang":
                valstr = (val * 0.3).toFixed(2) + '丈';
                break;
        }
        return valstr;
    }

    return {
        measuerLength: measuerLength,
        measureHeight: measureHeight,
        measureArea: measureArea,
        measureAngle: measureAngle,

        measureVolume: measureVolume,
        measureSection: measureSection,

        updateUnit: updateUnit,
        clearMeasure: clearMeasure,

        formatArea: formatArea,
        formatLength: formatLength
    };
}; //提供测量长度、面积等 [绘制基于draw]

exports.Measure = Measure;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FlowEcharts = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//CompositeCoordinateSystem
function CompositeCoordinateSystem(GLMap, api) {
    this._GLMap = GLMap;
    this.dimensions = ['lng', 'lat'];
    this._mapOffset = [0, 0];

    this._api = api;
} //参考了开源：https://github.com/sharpzao/EchartsCesium
//当前版本由火星科技开发 http://marsgis.cn 


CompositeCoordinateSystem.prototype.dimensions = ['lng', 'lat'];

CompositeCoordinateSystem.prototype.setMapOffset = function (mapOffset) {
    this._mapOffset = mapOffset;
};

CompositeCoordinateSystem.prototype.getBMap = function () {
    return this._GLMap;
};

var backAngle = _Cesium2.default.Math.toRadians(80);

CompositeCoordinateSystem.prototype.dataToPoint = function (data) {
    var defVal = [99999, 99999];

    var position = _Cesium2.default.Cartesian3.fromDegrees(data[0], data[1]);
    if (!position) {
        return defVal;
    }
    var px = this._GLMap.cartesianToCanvasCoordinates(position);
    if (!px) {
        return defVal;
    }

    //判断是否在球的背面
    var scene = this._GLMap;
    //if (scene.camera.positionCartographic.height > 10000) {//全球视野时才考虑判断
    //    var cartesianNew;
    //    if (scene.mode === Cesium.SceneMode.SCENE3D) {   //三维模式下
    //        var pickRay = scene.camera.getPickRay(px);
    //        cartesianNew = scene.globe.pick(pickRay, scene);
    //    }
    //    else { //二维模式下
    //        cartesianNew = scene.camera.pickEllipsoid(px, scene.globe.ellipsoid);
    //    }
    //    if (cartesianNew) {
    //        var carto = scene.globe.ellipsoid.cartesianToCartographic(cartesianNew);
    //        var _camera_x = Cesium.Math.toDegrees(carto.longitude);
    //        var _camera_y = Cesium.Math.toDegrees(carto.latitude);
    //        if (Math.abs(_camera_x - data[0]) > 1 || Math.abs(_camera_y - data[1]) > 1)
    //            return [NaN, NaN];
    //    }
    //}
    if (scene.mode === _Cesium2.default.SceneMode.SCENE3D) {
        var angle = _Cesium2.default.Cartesian3.angleBetween(scene.camera.position, position);
        if (angle > backAngle) return false;
    }
    //判断是否在球的背面


    return [px.x - this._mapOffset[0], px.y - this._mapOffset[1]];
};

CompositeCoordinateSystem.prototype.pointToData = function (pt) {
    var mapOffset = this._mapOffset;
    var pt = this._bmap.project([pt[0] + mapOffset[0], pt[1] + mapOffset[1]]);
    return [pt.lng, pt.lat];
};

CompositeCoordinateSystem.prototype.getViewRect = function () {
    var api = this._api;
    return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
};

CompositeCoordinateSystem.prototype.getRoamTransform = function () {
    return echarts.matrix.create();
};

// For deciding which dimensions to use when creating list data
CompositeCoordinateSystem.dimensions = CompositeCoordinateSystem.prototype.dimensions;

CompositeCoordinateSystem.create = function (ecModel, api) {
    var coordSys;

    ecModel.eachComponent('GLMap', function (GLMapModel) {
        var painter = api.getZr().painter;
        if (!painter) return;

        var viewportRoot = painter.getViewportRoot();
        var GLMap = echarts.glMap;
        coordSys = new CompositeCoordinateSystem(GLMap, api);
        coordSys.setMapOffset(GLMapModel.__mapOffset || [0, 0]);
        GLMapModel.coordinateSystem = coordSys;
    });

    ecModel.eachSeries(function (seriesModel) {
        if (seriesModel.get('coordinateSystem') === 'GLMap') {
            seriesModel.coordinateSystem = coordSys;
        }
    });
};

/////////扩展echarts///////////
if (window.echarts) {
    echarts.registerCoordinateSystem('GLMap', CompositeCoordinateSystem);
    echarts.registerAction({
        type: 'GLMapRoam',
        event: 'GLMapRoam',
        update: 'updateLayout'
    }, function (payload, ecModel) {});

    echarts.extendComponentModel({
        type: 'GLMap',
        getBMap: function getBMap() {
            // __bmap is injected when creating BMapCoordSys
            return this.__GLMap;
        },
        defaultOption: {
            roam: false
        }
    });

    echarts.extendComponentView({
        type: 'GLMap',
        init: function init(ecModel, api) {
            this.api = api;
            echarts.glMap.postRender.addEventListener(this.moveHandler, this);
        },
        moveHandler: function moveHandler(type, target) {
            this.api.dispatchAction({
                type: 'GLMapRoam'
            });
        },
        render: function render(GLMapModel, ecModel, api) {},
        dispose: function dispose(target) {
            echarts.glMap.postRender.removeEventListener(this.moveHandler, this);
        }
    });
}

////////////FlowEcharts/////////////// 
function FlowEcharts(_mapContainer, option) {
    this._mapContainer = _mapContainer;

    this._overlay = this._createChartOverlay();
    this._overlay.setOption(option);
}

FlowEcharts.prototype._createChartOverlay = function () {
    var scene = this._mapContainer.scene;
    scene.canvas.setAttribute('tabIndex', 0);

    var chartContainer = document.createElement('div');
    chartContainer.style.position = 'absolute';
    chartContainer.style.top = '0px';
    chartContainer.style.left = '0px';
    chartContainer.style.width = scene.canvas.width + 'px';
    chartContainer.style.height = scene.canvas.height + 'px';
    chartContainer.style.pointerEvents = 'none';
    chartContainer.setAttribute('id', 'echarts');
    chartContainer.setAttribute('class', 'echartMap');
    this._mapContainer.container.appendChild(chartContainer);
    this._echartsContainer = chartContainer;

    echarts.glMap = scene;
    return echarts.init(chartContainer);
};

FlowEcharts.prototype.dispose = function () {
    if (this._echartsContainer) {
        this._mapContainer.container.removeChild(this._echartsContainer);
        this._echartsContainer = null;
    }
    if (this._overlay) {
        this._overlay.dispose();
        this._overlay = null;
    }
};

FlowEcharts.prototype.updateOverlay = function (option) {
    if (this._overlay) {
        this._overlay.setOption(option);
    }
};

FlowEcharts.prototype.getMap = function () {
    return this._mapContainer;
};

FlowEcharts.prototype.getOverlay = function () {
    return this._overlay;
};

FlowEcharts.prototype.show = function () {
    var container = document.getElementById(this._id);
    container.style.visibility = "visible";
};

FlowEcharts.prototype.hide = function () {
    var container = document.getElementById(this._id);
    container.style.visibility = "hidden";
};

exports.FlowEcharts = FlowEcharts;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MapVLayer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //mapv+cesium融合，by http://marsgis.cn 


var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _MapVRenderer = __webpack_require__(86);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var divId = 0;

/**
 * @class mapVLayer
 * @classdesc MapV 图层。
 * @category Visualization MapV 
 * @param {mapv.DataSet} dataSet - MapV 图层数据集。
 * @param {Object} mapVOptions - MapV 图层参数。
 * @param {Object} options - 参数。
 * @param {string} [options.attributionPrefix] - 版权信息前缀。
 * @param {string} [options.attribution='© 2018 百度 MapV'] - 版权信息。
 * @fires mapVLayer#loaded
 */

var MapVLayer = function () {
	function MapVLayer(t, e, i, n) {
		_classCallCheck(this, MapVLayer);

		this.map = t, this.scene = t.scene, this.mapvBaseLayer = new _MapVRenderer.MapVRenderer(t, e, i, this), this.mapVOptions = i, this.initDevicePixelRatio(), this.canvas = this._createCanvas(), this.render = this.render.bind(this), void 0 != n ? (this.container = n, n.appendChild(this.canvas)) : (this.container = t.container, this.addInnerContainer()), this.bindEvent(), this._reset();
	}

	_createClass(MapVLayer, [{
		key: "initDevicePixelRatio",
		value: function initDevicePixelRatio() {
			this.devicePixelRatio = window.devicePixelRatio || 1;
		}
	}, {
		key: "addInnerContainer",
		value: function addInnerContainer() {
			this.container.appendChild(this.canvas);
		}
	}, {
		key: "bindEvent",
		value: function bindEvent() {
			var _this = this;

			//绑定cesium事件与mapv联动
			this.innerMoveStart = this.moveStartEvent.bind(this), this.innerMoveEnd = this.moveEndEvent.bind(this);

			this.scene.camera.moveStart.addEventListener(this.innerMoveStart, this);
			this.scene.camera.moveEnd.addEventListener(this.innerMoveEnd, this);

			//解决cesium有时 moveStart 后没有触发 moveEnd
			var handler = new _Cesium2.default.ScreenSpaceEventHandler(this.canvas);
			handler.setInputAction(function (event) {
				_this.innerMoveEnd();
			}, _Cesium2.default.ScreenSpaceEventType.LEFT_UP);
			handler.setInputAction(function (event) {
				_this.innerMoveEnd();
			}, _Cesium2.default.ScreenSpaceEventType.MIDDLE_UP);

			this.handler = handler;
		}
	}, {
		key: "unbindEvent",
		value: function unbindEvent() {
			this.scene.camera.moveStart.removeEventListener(this.innerMoveStart, this);
			this.scene.camera.moveEnd.removeEventListener(this.innerMoveEnd, this);
			this.scene.postRender.removeEventListener(this._reset, this);

			if (this.handler) {
				this.handler.destroy();
				this.handler = null;
			}
		}
	}, {
		key: "moveStartEvent",
		value: function moveStartEvent() {
			this.mapvBaseLayer && this.mapvBaseLayer.animatorMovestartEvent();
			//this._unvisiable()

			this.scene.postRender.addEventListener(this._reset, this);

			console.log('mapv moveStartEvent');
		}
	}, {
		key: "moveEndEvent",
		value: function moveEndEvent() {
			this.scene.postRender.removeEventListener(this._reset, this);

			this.mapvBaseLayer && this.mapvBaseLayer.animatorMoveendEvent();
			this._reset();
			//this._visiable() 
			console.log('mapv moveEndEvent');
		}
	}, {
		key: "zoomStartEvent",
		value: function zoomStartEvent() {
			this._unvisiable();
		}
	}, {
		key: "zoomEndEvent",
		value: function zoomEndEvent() {
			this._unvisiable();
		}
	}, {
		key: "addData",
		value: function addData(t, e) {
			void 0 != this.mapvBaseLayer && this.mapvBaseLayer.addData(t, e);
		}
	}, {
		key: "updateData",
		value: function updateData(t, e) {
			void 0 != this.mapvBaseLayer && this.mapvBaseLayer.updateData(t, e);
		}
	}, {
		key: "getData",
		value: function getData() {
			return this.mapvBaseLayer && (this.dataSet = this.mapvBaseLayer.getData()), this.dataSet;
		}
	}, {
		key: "removeData",
		value: function removeData(t) {
			void 0 != this.mapvBaseLayer && this.mapvBaseLayer && this.mapvBaseLayer.removeData(t);
		}
	}, {
		key: "removeAllData",
		value: function removeAllData() {
			void 0 != this.mapvBaseLayer && this.mapvBaseLayer.clearData();
		}
	}, {
		key: "_visiable",
		value: function _visiable() {
			return this.canvas.style.display = "block";
		}
	}, {
		key: "_unvisiable",
		value: function _unvisiable() {
			return this.canvas.style.display = "none";
		}
	}, {
		key: "_createCanvas",
		value: function _createCanvas() {
			var t = document.createElement("canvas");
			t.id = this.mapVOptions.layerid || "mapv" + divId++, t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.style.pointerEvents = "none", t.style.zIndex = this.mapVOptions.zIndex || 100, t.width = parseInt(this.map.canvas.width), t.height = parseInt(this.map.canvas.height), t.style.width = this.map.canvas.style.width, t.style.height = this.map.canvas.style.height;
			var e = this.devicePixelRatio;
			return "2d" == this.mapVOptions.context && t.getContext(this.mapVOptions.context).scale(e, e), t;
		}
	}, {
		key: "_reset",
		value: function _reset() {
			this.resizeCanvas(), this.fixPosition(), this.onResize(), this.render();
		}
	}, {
		key: "draw",
		value: function draw() {
			this._reset();
		}
	}, {
		key: "show",
		value: function show() {
			this._visiable();
		}
	}, {
		key: "hide",
		value: function hide() {
			this._unvisiable();
		}
	}, {
		key: "destroy",
		value: function destroy() {
			//释放	
			this.unbindEvent();
			this.remove();
		}
	}, {
		key: "remove",
		value: function remove() {
			void 0 != this.mapvBaseLayer && (this.removeAllData(), this.mapvBaseLayer.destroy(), this.mapvBaseLayer = void 0, this.canvas.parentElement.removeChild(this.canvas));
		}
	}, {
		key: "update",
		value: function update(t) {
			void 0 != t && this.updateData(t.data, t.options);
		}
	}, {
		key: "resizeCanvas",
		value: function resizeCanvas() {
			if (void 0 != this.canvas && null != this.canvas) {
				var t = this.canvas;
				t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.width = parseInt(this.map.canvas.width), t.height = parseInt(this.map.canvas.height), t.style.width = this.map.canvas.style.width, t.style.height = this.map.canvas.style.height;
			}
		}
	}, {
		key: "fixPosition",
		value: function fixPosition() {}
	}, {
		key: "onResize",
		value: function onResize() {}
	}, {
		key: "render",
		value: function render() {
			void 0 != this.mapvBaseLayer && this.mapvBaseLayer._canvasUpdate();
		}
	}]);

	return MapVLayer;
}();

exports.MapVLayer = MapVLayer;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MapVRenderer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //mapv+cesium融合，by http://marsgis.cn 


var mapv = __webpack_require__(87);

var baiduMapLayer = mapv ? mapv.baiduMapLayer : null;
var BaseLayer = baiduMapLayer ? baiduMapLayer.__proto__ : Function;

var backAngle = _Cesium2.default.Math.toRadians(80);

var MapVRenderer = exports.MapVRenderer = function (_BaseLayer) {
	_inherits(MapVRenderer, _BaseLayer);

	function MapVRenderer(t, e, i, n) {
		_classCallCheck(this, MapVRenderer);

		var _this = _possibleConstructorReturn(this, (MapVRenderer.__proto__ || Object.getPrototypeOf(MapVRenderer)).call(this, t, e, i));

		if (!BaseLayer) {
			return _possibleConstructorReturn(_this);
		}

		_this.map = t, _this.scene = t.scene, _this.dataSet = e;
		i = i || {}, _this.init(i), _this.argCheck(i), _this.initDevicePixelRatio(), _this.canvasLayer = n, _this.stopAniamation = !1, _this.animation = i.animation, _this.clickEvent = _this.clickEvent.bind(_this), _this.mousemoveEvent = _this.mousemoveEvent.bind(_this), _this.bindEvent();

		return _this;
	}

	_createClass(MapVRenderer, [{
		key: "initDevicePixelRatio",
		value: function initDevicePixelRatio() {
			this.devicePixelRatio = window.devicePixelRatio || 1;
		}
	}, {
		key: "clickEvent",
		value: function clickEvent(t) {
			var e = t.point;
			_get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), "clickEvent", this).call(this, e, t);
		}
	}, {
		key: "mousemoveEvent",
		value: function mousemoveEvent(t) {
			var e = t.point;
			_get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), "mousemoveEvent", this).call(this, e, t);
		}
	}, {
		key: "addAnimatorEvent",
		value: function addAnimatorEvent() {}
	}, {
		key: "animatorMovestartEvent",
		value: function animatorMovestartEvent() {
			var t = this.options.animation;
			this.isEnabledTime() && this.animator && (this.steps.step = t.stepsRange.start);
		}
	}, {
		key: "animatorMoveendEvent",
		value: function animatorMoveendEvent() {
			this.isEnabledTime() && this.animator;
		}
	}, {
		key: "bindEvent",
		value: function bindEvent() {
			this.map;
			this.options.methods && (this.options.methods.click, this.options.methods.mousemove);
		}
	}, {
		key: "unbindEvent",
		value: function unbindEvent() {
			var t = this.map;
			this.options.methods && (this.options.methods.click && t.off("click", this.clickEvent), this.options.methods.mousemove && t.off("mousemove", this.mousemoveEvent));
		}
	}, {
		key: "getContext",
		value: function getContext() {
			return this.canvasLayer.canvas.getContext(this.context);
		}
	}, {
		key: "init",
		value: function init(t) {
			this.options = t;
			this.initDataRange(t);
			this.context = this.options.context || "2d";

			if (this.options.zIndex && this.canvasLayer && this.canvasLayer.setZIndex) this.canvasLayer.setZIndex(this.options.zIndex);

			this.initAnimator();
		}
	}, {
		key: "_canvasUpdate",
		value: function _canvasUpdate(t) {
			this.map;
			var e = this.scene;
			if (this.canvasLayer && !this.stopAniamation) {
				var i = this.options.animation,
				    n = this.getContext();
				if (this.isEnabledTime()) {
					if (void 0 === t) return void this.clear(n);
					"2d" === this.context && (n.save(), n.globalCompositeOperation = "destination-out", n.fillStyle = "rgba(0, 0, 0, .1)", n.fillRect(0, 0, n.canvas.width, n.canvas.height), n.restore());
				} else this.clear(n);
				if ("2d" === this.context) for (var o in this.options) {
					n[o] = this.options[o];
				} else n.clear(n.COLOR_BUFFER_BIT);
				var a = {
					transferCoordinate: function transferCoordinate(t) {
						var defVal = [99999, 99999];

						//坐标转换
						var position = _Cesium2.default.Cartesian3.fromDegrees(t[0], t[1]);
						if (!position) {
							return defVal;
						}
						var px = e.cartesianToCanvasCoordinates(position);
						if (!px) {
							return defVal;
						}

						//判断是否在球的背面  
						if (e.mode === _Cesium2.default.SceneMode.SCENE3D) {
							var angle = _Cesium2.default.Cartesian3.angleBetween(e.camera.position, position);
							if (angle > backAngle) return false;
						}
						//判断是否在球的背面

						return [px.x, px.y];
					}
				};
				void 0 !== t && (a.filter = function (e) {
					var n = i.trails || 10;
					return !!(t && e.time > t - n && e.time < t);
				});
				var c = this.dataSet.get(a);
				this.processData(c), "m" == this.options.unit && this.options.size, this.options._size = this.options.size;
				var h = _Cesium2.default.SceneTransforms.wgs84ToWindowCoordinates(e, _Cesium2.default.Cartesian3.fromDegrees(0, 0));

				this.drawContext(n, new mapv.DataSet(c), this.options, h), this.options.updateCallback && this.options.updateCallback(t);
			}
		}
	}, {
		key: "updateData",
		value: function updateData(t, e) {
			var i = t;
			i && i.get && (i = i.get()), void 0 != i && this.dataSet.set(i), _get(MapVRenderer.prototype.__proto__ || Object.getPrototypeOf(MapVRenderer.prototype), "update", this).call(this, {
				options: e
			});
		}
	}, {
		key: "addData",
		value: function addData(t, e) {
			var i = t;
			t && t.get && (i = t.get()), this.dataSet.add(i), this.update({
				options: e
			});
		}
	}, {
		key: "getData",
		value: function getData() {
			return this.dataSet;
		}
	}, {
		key: "removeData",
		value: function removeData(t) {
			if (this.dataSet) {
				var e = this.dataSet.get({
					filter: function filter(e) {
						return null == t || "function" != typeof t || !t(e);
					}
				});
				this.dataSet.set(e), this.update({
					options: null
				});
			}
		}
	}, {
		key: "clearData",
		value: function clearData() {
			this.dataSet && this.dataSet.clear(), this.update({
				options: null
			});
		}
	}, {
		key: "draw",
		value: function draw() {
			this.canvasLayer.draw();
		}
	}, {
		key: "clear",
		value: function clear(t) {
			t && t.clearRect && t.clearRect(0, 0, t.canvas.width, t.canvas.height);
		}
		/**
      * @function MapVRenderer.prototype.destroy
      * @description 释放资源。
      */

	}, {
		key: "destroy",
		value: function destroy() {
			this.unbindEvent();
			this.clear(this.getContext());
			this.clearData();
			this.animator && this.animator.stop();
			this.animator = null;
			this.canvasLayer = null;
		}
	}]);

	return MapVRenderer;
}(BaseLayer);

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_87__;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AnimationLineMaterialProperty = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Color = _Cesium2.default.Color; //动态线效果 by 木遥 （QQ 346819890）

var defaultValue = _Cesium2.default.defaultValue;
var defined = _Cesium2.default.defined;
var defineProperties = _Cesium2.default.defineProperties;
var Event = _Cesium2.default.Event;
var createPropertyDescriptor = _Cesium2.default.createPropertyDescriptor;
var Property = _Cesium2.default.Property;
var Material = _Cesium2.default.Material;

var defaultColor = new _Cesium2.default.Color(0, 0, 0, 0);

function AnimationLineMaterialProperty(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);

    this._definitionChanged = new Event();
    this._color = undefined;
    this._colorSubscription = undefined;

    this.color = options.color || defaultColor; //颜色
    this._duration = options.duration || 1000; //时长

    var _material = AnimationLineMaterialProperty.getImageMaterial(options.url, options.repeat);
    this._materialType = _material.type; //材质类型
    this._materialImage = _material.image; //材质图片

    this._time = undefined;
}

defineProperties(AnimationLineMaterialProperty.prototype, {
    /**
     * Gets a value indicating if this property is constant.  A property is considered
     * constant if getValue always returns the same result for the current definition.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type {Boolean}
     * @readonly
     */
    isConstant: {
        get: function get() {
            return false;
        }
    },
    /**
     * Gets the event that is raised whenever the definition of this property changes.
     * The definition is considered to have changed if a call to getValue would return
     * a different result for the same time.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type {Event}
     * @readonly
     */
    definitionChanged: {
        get: function get() {
            return this._definitionChanged;
        }
    },
    /**
     * Gets or sets the Property specifying the {@link Color} of the line.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type {Property}
     */
    color: createPropertyDescriptor('color')
});

/**
 * Gets the {@link Material} type at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the type.
 * @returns {String} The type of material.
 */
AnimationLineMaterialProperty.prototype.getType = function (time) {
    return this._materialType;
};

/**
 * Gets the value of the property at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the value.
 * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
 * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
 */
AnimationLineMaterialProperty.prototype.getValue = function (time, result) {
    if (!defined(result)) {
        result = {};
    }
    result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
    result.image = this._materialImage;
    if (this._time === undefined) {
        this._time = time.secondsOfDay;
    }
    result.time = (time.secondsOfDay - this._time) * 1000 / this._duration;
    return result;
};

/**
 * Compares this property to the provided property and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Property} [other] The other property.
 * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
AnimationLineMaterialProperty.prototype.equals = function (other) {
    return this === other || //
    other instanceof AnimationLineMaterialProperty && Property.equals(this._color, other._color);
};

var cacheIdx = 0;
var nameEx = "AnimationLine";

AnimationLineMaterialProperty.getImageMaterial = function (imgurl, repeat) {
    cacheIdx++;
    var typeName = nameEx + cacheIdx + "Type";
    var imageName = nameEx + cacheIdx + "Image";

    Material[typeName] = typeName;
    Material[imageName] = imgurl;

    Material._materialCache.addMaterial(Material[typeName], {
        fabric: {
            type: Material.PolylineArrowLinkType,
            uniforms: {
                color: new Color(1, 0, 0, 1.0),
                image: Material[imageName],
                time: 0,
                repeat: repeat || new _Cesium2.default.Cartesian2(1.0, 1.0)
            },
            //source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
            //    {\n\
            //        czm_material material = czm_getDefaultMaterial(materialInput);\n\
            //        vec2 st = repeat * materialInput.st;\n\
            //        if (texture2D(image, vec2(0.0, 0.0)).a == 1.0) {\n\
            //            discard;\n\
            //        } else {\n\
            //            material.alpha = texture2D(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;\n\
            //        }\n\
            //        material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\n\
            //        return material;\n\
            //    }"
            source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                        {\n\
                            czm_material material = czm_getDefaultMaterial(materialInput);\n\
                            vec2 st = repeat * materialInput.st;\n\
                            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                            if(color.a == 0.0)\n\
                            {\n\
                                material.alpha = colorImage.a;\n\
                                material.diffuse = colorImage.rgb; \n\
                            }\n\
                            else\n\
                            {\n\
                                material.alpha = colorImage.a * color.a;\n\
                                material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb); \n\
                            }\n\
                            return material;\n\
                        }"
        },
        translucent: function translucent() {
            return true;
        }
    });

    return {
        type: Material[typeName],
        image: Material[imageName]
    };
};

exports.AnimationLineMaterialProperty = AnimationLineMaterialProperty;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ElliposidFadeMaterialProperty = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Color = _Cesium2.default.Color; //动态波纹效果 by 木遥 （QQ 346819890）

var defaultValue = _Cesium2.default.defaultValue;
var defined = _Cesium2.default.defined;
var defineProperties = _Cesium2.default.defineProperties;
var Event = _Cesium2.default.Event;
var createPropertyDescriptor = _Cesium2.default.createPropertyDescriptor;
var Property = _Cesium2.default.Property;
var Material = _Cesium2.default.Material;

var defaultColor = Color.WHITE;

function ElliposidFadeMaterialProperty(options) {
    options = defaultValue(options, defaultValue.EMPTY_OBJECT);

    this._definitionChanged = new Event();
    this._color = undefined;
    this._colorSubscription = undefined;

    this.color = options.color;

    this._time = undefined;
}

defineProperties(ElliposidFadeMaterialProperty.prototype, {
    /**
     * Gets a value indicating if this property is constant.  A property is considered
     * constant if getValue always returns the same result for the current definition.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type {Boolean}
     * @readonly
     */
    isConstant: {
        get: function get() {
            return false;
        }
    },
    /**
     * Gets the event that is raised whenever the definition of this property changes.
     * The definition is considered to have changed if a call to getValue would return
     * a different result for the same time.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type {Event}
     * @readonly
     */
    definitionChanged: {
        get: function get() {
            return this._definitionChanged;
        }
    },
    /**
     * Gets or sets the Property specifying the {@link Color} of the line.
     * @memberof PolylineGlowMaterialProperty.prototype
     * @type {Property}
     */
    color: createPropertyDescriptor('color')
});

/**
 * Gets the {@link Material} type at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the type.
 * @returns {String} The type of material.
 */
ElliposidFadeMaterialProperty.prototype.getType = function (time) {
    return Material.EllipsoidFadeType;
};

/**
 * Gets the value of the property at the provided time.
 *
 * @param {JulianDate} time The time for which to retrieve the value.
 * @param {Object} [result] The object to store the value into, if omitted, a new instance is created and returned.
 * @returns {Object} The modified result parameter or a new instance if the result parameter was not supplied.
 */
ElliposidFadeMaterialProperty.prototype.getValue = function (time, result) {
    if (!defined(result)) {
        result = {};
    }
    result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);

    if (this._time === undefined) {
        this._time = time.secondsOfDay;
    }
    result.time = time.secondsOfDay - this._time;
    return result;
};

/**
 * Compares this property to the provided property and returns
 * <code>true</code> if they are equal, <code>false</code> otherwise.
 *
 * @param {Property} [other] The other property.
 * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
ElliposidFadeMaterialProperty.prototype.equals = function (other) {
    return this === other || //
    other instanceof ElliposidFadeMaterialProperty && Property.equals(this._color, other._color);
};

//材质处理 start
var Material = _Cesium2.default.Material;
Material.EllipsoidFadeType = 'EllipsoidFade'; /**  渐变的气泡 */
Material._materialCache.addMaterial(Material.EllipsoidFadeType, {
    fabric: {
        type: Material.EllipsoidFadeType,
        uniforms: {
            color: new Color(1, 0, 0, 1.0),
            time: 1
        },
        source: "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    material.diffuse = 1.5 * color.rgb;\n\
                    vec2 st = materialInput.st;\n\
                    float dis = distance(st, vec2(0.5, 0.5));\n\
                    float per = fract(time);\n\
                    if(dis > per * 0.5){\n\
                        //material.alpha = 0.0;\n\
                        discard;\n\
                    }else {\n\
                            material.alpha = color.a  * dis / per / 2.0;\n\
                    }\n\
                    return material;\n\
                }"
    },
    translucent: function translucent() {
        return true;
    }
});
//材质处理 end


exports.ElliposidFadeMaterialProperty = ElliposidFadeMaterialProperty;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DivPoint = undefined;

var _Cesium = __webpack_require__(0);

var _Cesium2 = _interopRequireDefault(_Cesium);

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _Class = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DivPoint = exports.DivPoint = _Class.Class.extend({
    position: null,
    anchor: null,
    initialize: function initialize(viewer, opts) {
        this.viewer = viewer;

        this.position = opts.position;
        this.anchor = opts.anchor;

        //添加html
        this.$view = (0, _jquery2.default)(opts.html);
        this.$view.css({
            position: 'absolute',
            left: '0',
            top: '0'
        });
        this.$view.appendTo("#" + viewer._container.id);

        var that = this;
        if (opts.click || opts.popup) {
            this.$view.click(function (e) {
                if (opts.popup) viewer.mars.popup.show(opts, that.position);
                if (opts.click) opts.click(opts, that, e);
            });
        }
        if (opts.tooltip) {
            this.$view.hover(function () {
                //移入
                viewer.mars.tooltip.show(opts, that.position);
            }, function () {
                //移出
                viewer.mars.tooltip.close();
            });
        }
        this.$view.on('mousewheel', function (event) {
            //$(viewer.scene.canvas).trigger(event);
        });

        //移动事件
        viewer.scene.postRender.addEventListener(this.updateViewPoint, this);
    },
    backAngle: _Cesium2.default.Math.toRadians(75),
    updateViewPoint: function updateViewPoint() {
        if (!this._visible) return;

        var scene = this.viewer.scene;
        var point = _Cesium2.default.SceneTransforms.wgs84ToWindowCoordinates(scene, this.position);
        if (point == null) return;

        //判断是否在球的背面
        if (scene.mode === _Cesium2.default.SceneMode.SCENE3D) {
            var scene = viewer.scene;
            var cartesianNew;
            if (scene.mode === _Cesium2.default.SceneMode.SCENE3D) {
                //三维模式下
                var pickRay = scene.camera.getPickRay(point);
                cartesianNew = scene.globe.pick(pickRay, scene);
            } else {
                //二维模式下
                cartesianNew = scene.camera.pickEllipsoid(point, scene.globe.ellipsoid);
            }
            if (cartesianNew) {
                var len = _Cesium2.default.Cartesian3.distance(this.position, cartesianNew);
                if (len > 1000 * 1000) return false;
            }
        }
        //判断是否在球的背面

        var x = point.x;
        var y = point.y - this.$view.height();
        if (this.anchor) {
            x += this.anchor[0];
            y += this.anchor[1];
        } else {
            x -= this.$view.width() / 2; //默认为div下侧中心点
        }

        this.$view.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
    },
    _visible: true,
    setVisible: function setVisible(val) {
        this._visible = val;
        if (val) this.$view.show();else this.$view.hide();
    },
    destroy: function destroy() {
        this.viewer.scene.postRender.removeEventListener(this.updateViewPoint, this);
        this.$view.remove();

        this.$view = null;
        this.position = null;
        this.anchor = null;
        this.viewer = null;
    }
});

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TilesEditor = undefined;

var _Class = __webpack_require__(10);

var TilesEditor = exports.TilesEditor = _Class.Class.extend({
    viewer: null,
    options: null,
    initialize: function initialize(viewer, options) {
        //必须的参数
        this.viewer = viewer;
        this.scene = this.viewer.scene;

        this.options = options;
        this.position = options.position;
        this.heading = options.heading || 0;
        this.range = options.range || 100;

        this.dragging = false;
        this.rotating = false;
        this.enable = false;

        this.billboards = this.viewer.scene.primitives.add(new Cesium.BillboardCollection());
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

        //用来平移位置的指示器
        this.movep = this.billboards.add({
            position: this.position,
            color: new Cesium.Color.fromCssColorString("#FFFF00"),
            image: options.moveImg,
            show: false,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        });
        //用来旋转的指示器
        this.rotatep = this.billboards.add({
            position: this.position ? this.rotationPos() : null,
            color: new Cesium.Color.fromCssColorString("#FFFF00"),
            image: options.rotateImg,
            show: false,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        });
    },
    update: function update(opts) {
        for (var key in opts) {
            this[key] = opts[key];
        }

        this.movep.position = this.position;
        this.rotatep.position = this.rotationPos();
    },

    //获取当前矩阵
    modelMatrix: function modelMatrix() {
        var mat = Cesium.Transforms.eastNorthUpToFixedFrame(this.position);
        var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(this.heading));
        Cesium.Matrix4.multiply(mat, rotationX, mat);

        //比例变换
        if (this.scale > 0 && this.scale != 1) Cesium.Matrix4.multiplyByUniformScale(mat, this.scale, mat);

        //垂直轴变换
        if (this.axis && this.axis != "") {
            var rightaxis;
            switch (this.axis.toUpperCase()) {
                case "Y_UP_TO_Z_UP":
                    rightaxis = Cesium.Axis.Y_UP_TO_Z_UP;
                    break;
                case "Z_UP_TO_Y_UP":
                    rightaxis = Cesium.Axis.Z_UP_TO_Y_UP;
                    break;
                case "X_UP_TO_Z_UP":
                    rightaxis = Cesium.Axis.X_UP_TO_Z_UP;
                    break;
                case "Z_UP_TO_X_UP":
                    rightaxis = Cesium.Axis.Z_UP_TO_X_UP;
                    break;
                case "X_UP_TO_Y_UP":
                    rightaxis = Cesium.Axis.X_UP_TO_Y_UP;
                    break;
                case "Y_UP_TO_X_UP":
                    rightaxis = Cesium.Axis.Y_UP_TO_X_UP;
                    break;
            }
            if (rightaxis) mat = Cesium.Matrix4.multiplyTransformation(mat, rightaxis, mat);
        }
        return mat;
    },


    //依据位置和朝向计算 旋转的位置
    rotationPos: function rotationPos() {
        var rotpos = new Cesium.Cartesian3(this.range, 0.0, 0.0);
        //依据位置和朝向计算 旋转矩阵  
        var mat = Cesium.Matrix4.getRotation(this.modelMatrix(), new Cesium.Matrix3());

        rotpos = Cesium.Matrix3.multiplyByVector(mat, rotpos, rotpos);
        rotpos = Cesium.Cartesian3.add(this.position, rotpos, rotpos);
        return rotpos;
    },
    pickTerrain: function pickTerrain(wndpos) {
        var ray = this.viewer.camera.getPickRay(wndpos);
        var pos = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return pos;
    },
    setEnable: function setEnable(v) {
        if (v) {
            var self = this;
            this.handler.setInputAction(function (p) {
                self.handler_onLeafDown(p);
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.handler.setInputAction(function (p) {
                self.handler_onMouseMove(p);
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.handler.setInputAction(function (p) {
                self.handler_onLeftUp(p);
            }, Cesium.ScreenSpaceEventType.LEFT_UP);

            this.rotatep.show = true;
            this.movep.show = true;
        } else {
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);

            this.rotatep.show = false;
            this.movep.show = false;
        }
        this._enable = false;
    },
    handler_onLeafDown: function handler_onLeafDown(event) {
        var pickedObjects = this.scene.drillPick(event.position, 2);

        for (var i = 0; i < pickedObjects.length; i++) {
            var pickedObject = pickedObjects[i];

            if (Cesium.defined(pickedObject) && pickedObject.primitive === this.movep) {
                this.dragging = true;
                this.scene.screenSpaceCameraController.enableRotate = false;
                break;
            } else if (Cesium.defined(pickedObject) && pickedObject.primitive === this.rotatep) {
                this.rotating = true;
                this.scene.screenSpaceCameraController.enableRotate = false;
                break;
            }
        }
    },
    handler_onMouseMove: function handler_onMouseMove(event) {
        var position = this.pickTerrain(event.endPosition);
        if (!position) return;

        if (this.dragging) {
            this.position = position;
            this.movep.position = this.position;
            this.rotatep.position = this.rotationPos();

            if (this.options.onPosition) {
                this.options.onPosition(this.position);
            }
        } else if (this.rotating) {
            this.rotatep.position = position;
            this.range = Cesium.Cartesian3.distance(this.position, position);

            //获取该位置的默认矩阵 
            var mat = Cesium.Transforms.eastNorthUpToFixedFrame(this.position);
            mat = Cesium.Matrix4.getRotation(mat, new Cesium.Matrix3());

            var xaxis = Cesium.Matrix3.getColumn(mat, 0, new Cesium.Cartesian3());
            var yaxis = Cesium.Matrix3.getColumn(mat, 1, new Cesium.Cartesian3());
            var zaxis = Cesium.Matrix3.getColumn(mat, 2, new Cesium.Cartesian3());
            //计算该位置 和  position 的 角度值
            var dir = Cesium.Cartesian3.subtract(position, this.position, new Cesium.Cartesian3());
            //z crosss (dirx cross z) 得到在 xy平面的向量
            dir = Cesium.Cartesian3.cross(dir, zaxis, dir);
            dir = Cesium.Cartesian3.cross(zaxis, dir, dir);
            dir = Cesium.Cartesian3.normalize(dir, dir);

            this.heading = Cesium.Cartesian3.angleBetween(xaxis, dir);

            var ay = Cesium.Cartesian3.angleBetween(yaxis, dir);
            if (ay > Math.PI * 0.5) {
                this.heading = 2 * Math.PI - this.heading;
            }
            if (this.options.onHeading) {
                this.options.onHeading(this.heading);
            }
        }
    },
    handler_onLeftUp: function handler_onLeftUp(event) {
        if (this.dragging || this.rotating) {
            this.rotating = this.dragging = false;
            this.scene.screenSpaceCameraController.enableRotate = true;
            //如果没有这句话 会导致billboards的某些没有刷新，无法再次点击
            this.billboards._createVertexArray = true;
        }
    },
    remove: function remove() {
        //从场景中移除
        if (this.billboards) {
            this.scene.primitives.remove(this.billboards);
            this.billboards = undefined;
        }
        this.enable = false;
    },

    destroy: function destroy() {
        this.remove();
        this.handler.destroy();
        this.handler = null;
        this.viewer = null;
    }
});

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ellipsoid = exports.rectangle = exports.circle = exports.polygon = exports.wall = exports.polylineVolume = exports.polyline = exports.model = exports.point = exports.label = exports.billboard = undefined;

var _AttrBillboard = __webpack_require__(15);

var billboard = _interopRequireWildcard(_AttrBillboard);

var _AttrLabel = __webpack_require__(13);

var label = _interopRequireWildcard(_AttrLabel);

var _AttrPoint = __webpack_require__(24);

var point = _interopRequireWildcard(_AttrPoint);

var _AttrModel = __webpack_require__(27);

var model = _interopRequireWildcard(_AttrModel);

var _AttrPolyline = __webpack_require__(11);

var polyline = _interopRequireWildcard(_AttrPolyline);

var _Attr = __webpack_require__(31);

var polylineVolume = _interopRequireWildcard(_Attr);

var _Attr2 = __webpack_require__(34);

var wall = _interopRequireWildcard(_Attr2);

var _AttrPolygon = __webpack_require__(16);

var polygon = _interopRequireWildcard(_AttrPolygon);

var _Attr3 = __webpack_require__(29);

var circle = _interopRequireWildcard(_Attr3);

var _Attr4 = __webpack_require__(32);

var rectangle = _interopRequireWildcard(_Attr4);

var _Attr5 = __webpack_require__(33);

var ellipsoid = _interopRequireWildcard(_Attr5);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.billboard = billboard;
exports.label = label;
exports.point = point;
exports.model = model;
exports.polyline = polyline;
exports.polylineVolume = polylineVolume;
exports.wall = wall;
exports.polygon = polygon;
exports.circle = circle;
exports.rectangle = rectangle;
exports.ellipsoid = ellipsoid;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseWidget = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jquery = __webpack_require__(5);

var _jquery2 = _interopRequireDefault(_jquery);

var _Class = __webpack_require__(10);

var _Util = __webpack_require__(2);

var Util = _interopRequireWildcard(_Util);

var _loader = __webpack_require__(36);

var _widgetManager = __webpack_require__(35);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _resources_cache = [];

var BaseWidget = _Class.Class.extend({
    viewer: null,
    options: {},
    config: {}, //配置的config信息 
    path: "", //当前widget目录相对路径 
    isActivate: false, //是否激活状态
    isCreate: false,
    initialize: function initialize(cfg, map) {
        this.viewer = map;
        this.config = cfg;
        this.path = cfg.path || '';
        this.init();
    },
    addCacheVersion: function addCacheVersion(_resource) {
        if (_resource == null) return _resource;

        var cacheVersion = (0, _widgetManager.getCacheVersion)();
        if (cacheVersion) {
            if (_resource.indexOf('?') == -1) _resource += "?time=" + cacheVersion;else if (_resource.indexOf('time=' + cacheVersion) == -1) _resource += "&time=" + cacheVersion;
        }
        return _resource;
    },
    //激活插件
    activateBase: function activateBase() {
        var that = this;

        if (this.isActivate) {
            //已激活状态时跳出 
            this.changeWidgetView(function (viewopts) {
                if (viewopts._dom) {
                    //将层置顶
                    (0, _jquery2.default)(".layui-layer").each(function () {
                        (0, _jquery2.default)(this).css("z-index", 19891000);
                    });
                    (0, _jquery2.default)(viewopts._dom).css("z-index", 19891014);
                }
            });
            return;
        }

        this.beforeActivate();
        this.isActivate = true;
        //console.log('激活widget:' + this.config.uri);

        if (!this.isCreate) {
            //首次进行创建 
            if (this.options.resources && this.options.resources.length > 0) {
                var resources = [];

                for (var i = 0; i < this.options.resources.length; i++) {
                    var _resource = this.options.resources[i];
                    _resource = this._getUrl(_resource);

                    if (_resources_cache.indexOf(_resource) != -1) continue; //不加重复资源

                    resources.push(_resource);
                }
                _resources_cache = _resources_cache.concat(resources); //不加重复资源

                _loader.Loader.async(resources, function () {
                    var result = that.create(function () {
                        that._createWidgetView();
                        that.isCreate = true;
                    });
                    if (result) return;
                    if (that.config.createAtStart) {
                        that.config.createAtStart = false;
                        that.isActivate = false;
                        that.isCreate = true;
                        return;
                    }
                    that._createWidgetView();
                    that.isCreate = true;
                });
                return;
            } else {
                var result = this.create(function () {
                    that._createWidgetView();
                    this.isCreate = true;
                });
                if (result) return;
                if (that.config.createAtStart) {
                    that.config.createAtStart = false;
                    that.isActivate = false;
                    that.isCreate = true;
                    return;
                }
            }
            this.isCreate = true;
        }
        this._createWidgetView();

        return this;
    },
    //创建插件的view
    _createWidgetView: function _createWidgetView() {
        var viewopts = this.options.view;
        if (viewopts === undefined || viewopts === null) {
            this._startActivate();
        } else if (Util.isArray(viewopts)) {
            this._viewcreate_allcount = viewopts.length;
            this._viewcreate_okcount = 0;

            for (var i = 0; i < viewopts.length; i++) {
                this.createItemView(viewopts[i]);
            }
        } else {
            this._viewcreate_allcount = 1;
            this._viewcreate_okcount = 0;
            this.createItemView(viewopts);
        }
    },
    changeWidgetView: function changeWidgetView(calback) {
        var viewopts = this.options.view;
        if (viewopts === undefined || viewopts === null) {
            return false;
        } else if (Util.isArray(viewopts)) {
            var hascal = false;
            for (var i = 0; i < viewopts.length; i++) {
                hascal = hascal || calback(viewopts[i]);
            }
            return hascal;
        } else {
            return calback(viewopts);
        }
    },
    createItemView: function createItemView(viewopt) {
        switch (viewopt.type) {
            default:
            case "window":
                this._openWindow(viewopt);
                break;
            case "divwindow":
                this._openDivWindow(viewopt);
                break;
            case "append":
                this._appendView(viewopt);
                break;
            case "custom":
                //自定义 
                var view_url = this._getUrl(viewopt.url);

                var that = this;
                viewopt.open(view_url, function (html) {
                    that.winCreateOK(viewopt, html);

                    that._viewcreate_okcount++;
                    if (that._viewcreate_okcount >= that._viewcreate_allcount) {
                        that._startActivate(html);
                    }
                }, this);
                break;
        }
    },
    _viewcreate_allcount: 0,
    _viewcreate_okcount: 0,
    //==============layer弹窗================= 
    _openWindow: function _openWindow(viewopt) {
        var that = this;
        var view_url = this._getUrl(viewopt.url);

        var opts = {
            type: 2,
            content: [view_url, 'no'],
            success: function success(layero) {
                viewopt._layerOpening = false;
                viewopt._dom = layero;

                //得到iframe页的窗口对象，执行iframe页的方法：viewWindow.method();
                var viewWindow = window[layero.find('iframe')[0]['name']];

                //隐藏弹窗
                if (that.config.hasOwnProperty("visible") && !that.config.visible) (0, _jquery2.default)(layero).hide();

                layer.setTop(layero);
                that.winCreateOK(viewopt, viewWindow);

                that._viewcreate_okcount++;
                if (that._viewcreate_okcount >= that._viewcreate_allcount) that._startActivate(layero);

                //通知页面,页面需要定义initWidgetView方法
                if (viewWindow && viewWindow.initWidgetView) viewWindow.initWidgetView(that);else console.error("" + view_url + "页面没有定义function initWidgetView(widget)方法，无法初始化widget页面!");
            }
        };
        if (viewopt._layerIdx > 0) {
            //debugger
        }

        viewopt._layerOpening = true;
        viewopt._layerIdx = layer.open(this._getWinOpt(viewopt, opts));
    },
    _openDivWindow: function _openDivWindow(viewopt) {
        var view_url = this._getUrl(viewopt.url);
        //div弹窗
        var that = this;
        this.getHtml(view_url, function (data) {
            var opts = {
                type: 1,
                content: data,
                success: function success(layero) {
                    viewopt._layerOpening = false;
                    viewopt._dom = layero;

                    //隐藏弹窗
                    if (that.config.hasOwnProperty("visible") && !that.config.visible) (0, _jquery2.default)(layero).hide();

                    layer.setTop(layero);
                    that.winCreateOK(viewopt, layero);

                    that._viewcreate_okcount++;
                    if (that._viewcreate_okcount >= that._viewcreate_allcount) that._startActivate(layero);
                }
            };
            viewopt._layerOpening = true;
            viewopt._layerIdx = layer.open(that._getWinOpt(viewopt, opts));
        });
    },
    _getUrl: function _getUrl(url) {
        url = this.addCacheVersion(url);

        if (url.startsWith("/") || url.startsWith(".") || url.startsWith("http")) return url;else return this.path + url;
    },
    _getWinOpt: function _getWinOpt(viewopt, opts) {
        //优先使用cofig中配置，覆盖js中的定义 
        var def = (0, _widgetManager.getDefWindowOptions)();
        var windowOptions = _jquery2.default.extend(def, viewopt.windowOptions);
        windowOptions = _jquery2.default.extend(windowOptions, this.config.windowOptions);
        viewopt.windowOptions = windowOptions; //赋值 

        var that = this;
        var _size = this._getWinSize(windowOptions);

        //默认值
        var defOpts = {
            title: windowOptions.noTitle ? false : this.config.name || ' ',
            area: _size.area,
            offset: _size.offset,
            shade: 0,
            maxmin: false,
            zIndex: layer.zIndex,
            end: function end() {
                // 销毁后触发的回调
                viewopt._layerIdx = -1;
                viewopt._dom = null;
                that.disableBase();
            },
            full: function full(dom) {
                //最大化后触发的回调
                that.winFull(dom);
            },
            min: function min(dom) {
                //最小化后触发的回调
                that.winMin(dom);
            },
            restore: function restore(dom) {
                //还原 后触发的回调
                that.winRestore(dom);
            }
        };
        var cfgOpts = _jquery2.default.extend(defOpts, windowOptions);
        return _jquery2.default.extend(cfgOpts, opts || {});
    },
    //计算弹窗大小和位置
    _getWinSize: function _getWinSize(windowOptions) {
        //获取高宽 
        var _width = this.bfb2Number(windowOptions.width, document.documentElement.clientWidth, windowOptions);
        var _height = this.bfb2Number(windowOptions.height, document.documentElement.clientHeight, windowOptions);

        //计算位置offset
        var offset = '';
        var position = windowOptions.position;
        if (position) {
            if (typeof position == "string") {
                //t顶部,b底部,r右边缘,l左边缘,lt左上角,lb左下角,rt右上角,rb右下角
                offset = position;
            } else if ((typeof position === 'undefined' ? 'undefined' : _typeof(position)) == "object") {
                var _top;
                var _left;

                if (position.hasOwnProperty("top") && position.top != null) {
                    _top = this.bfb2Number(position.top, document.documentElement.clientHeight, windowOptions);
                }
                if (position.hasOwnProperty("bottom") && position.bottom != null) {
                    windowOptions._hasresize = true;

                    var _bottom = this.bfb2Number(position.bottom, document.documentElement.clientHeight, windowOptions);

                    if (_top != null) {
                        _height = document.documentElement.clientHeight - _top - _bottom;
                    } else {
                        _top = document.documentElement.clientHeight - _height - _bottom;
                    }
                }

                if (position.hasOwnProperty("left") && position.left != null) {
                    _left = this.bfb2Number(position.left, document.documentElement.clientWidth, windowOptions);
                }
                if (position.hasOwnProperty("right") && position.right != null) {
                    windowOptions._hasresize = true;
                    var _right = this.bfb2Number(position.right, document.documentElement.clientWidth, windowOptions);

                    if (_left != null) {
                        _width = document.documentElement.clientWidth - _left - _right;
                    } else {
                        _left = document.documentElement.clientWidth - _width - _right;
                    }
                }

                if (_top == null) _top = (document.documentElement.clientHeight - _height) / 2;
                if (_left == null) _left = (document.documentElement.clientWidth - _width) / 2;

                offset = [_top + 'px', _left + 'px'];
            }
        }

        //最大最小高度判断
        if (windowOptions.hasOwnProperty("minHeight") && _height < windowOptions.minHeight) {
            windowOptions._hasresize = true;
            _height = windowOptions.minHeight;
        }
        if (windowOptions.hasOwnProperty("maxHeight") && _height > windowOptions.maxHeight) {
            windowOptions._hasresize = true;
            _height = windowOptions.maxHeight;
        }

        //最大最小宽度判断
        if (windowOptions.hasOwnProperty("minHeight") && _width < windowOptions.minWidth) {
            windowOptions._hasresize = true;
            _width = windowOptions.minWidth;
        }
        if (windowOptions.hasOwnProperty("maxWidth") && _width > windowOptions.maxWidth) {
            windowOptions._hasresize = true;
            _width = windowOptions.maxWidth;
        }

        var area;
        if (_width && _height) area = [_width + 'px', _height + 'px'];else area = _width + 'px';

        return { area: area, offset: offset };
    },
    bfb2Number: function bfb2Number(str, allnum, windowOptions) {
        if (typeof str == 'string' && str.indexOf("%") != -1) {
            windowOptions._hasresize = true;

            return allnum * Number(str.replace("%", "")) / 100;
        }
        return str;
    },
    //==============直接添加到index上=================  
    _appendView: function _appendView(viewopt) {

        if (this.isCreate && viewopt._dom) {
            (0, _jquery2.default)(viewopt._dom).show({
                duration: 500
            });
            this._startActivate(viewopt._dom);
        } else {
            var view_url = this._getUrl(viewopt.url);
            var that = this;
            that.getHtml(view_url, function (html) {

                viewopt._dom = (0, _jquery2.default)(html).appendTo(viewopt.parent || 'body');

                that.winCreateOK(viewopt, html);

                that._viewcreate_okcount++;
                if (that._viewcreate_okcount >= that._viewcreate_allcount) that._startActivate(html);
            });
        }
    },

    //释放插件
    disableBase: function disableBase() {
        if (!this.isActivate) return;
        this.beforeDisable();

        var has = this.changeWidgetView(function (viewopts) {
            if (viewopts._layerIdx != null && viewopts._layerIdx != -1) {
                if (viewopts._layerOpening) {
                    //窗口还在加载中
                    //console.log('释放widget窗口还在加载中:' + viewopts._layerIdx);

                }
                layer.close(viewopts._layerIdx);
                return true;
            } else {
                if (viewopts.type == "append" && viewopts._dom) (0, _jquery2.default)(viewopts._dom).hide({
                    duration: 1000
                });
                if (viewopts.type == "custom" && viewopts.close) viewopts.close();
                return false;
            }
        });
        if (has) return;

        this.disable();
        this.isActivate = false;
        //console.log('释放widget:' + this.config.uri);
    },
    //设置view弹窗的显示和隐藏
    setViewVisible: function setViewVisible(visible) {
        this.changeWidgetView(function (viewopts) {
            if (viewopts._layerIdx != null && viewopts._layerIdx != -1) {
                if (visible) {
                    (0, _jquery2.default)("#layui-layer" + viewopts._layerIdx).show();
                } else {
                    (0, _jquery2.default)("#layui-layer" + viewopts._layerIdx).hide();
                }
            } else if (viewopts.type == "append" && viewopts._dom) {
                if (visible) (0, _jquery2.default)(viewopts._dom).show();else (0, _jquery2.default)(viewopts._dom).hide();
            }
        });
    },
    //设置view弹窗的css
    setViewCss: function setViewCss(style) {
        this.changeWidgetView(function (viewopts) {
            if (viewopts._layerIdx != null && viewopts._layerIdx != -1) {
                (0, _jquery2.default)("#layui-layer" + viewopts._layerIdx).css(style);
            } else if (viewopts.type == "append" && viewopts._dom) {
                (0, _jquery2.default)(viewopts._dom).css(style);
            }
        });
    },
    //主窗体改变大小后触发
    indexResize: function indexResize() {
        if (!this.isActivate) return;

        var that = this;
        this.changeWidgetView(function (viewopts) {
            if (viewopts._layerIdx == null || viewopts._layerIdx == -1 || viewopts.windowOptions == null || !viewopts.windowOptions._hasresize) return;

            var _size = that._getWinSize(viewopts.windowOptions);
            var _style = {
                width: _size.area[0],
                height: _size.area[1],
                top: _size.offset[0],
                left: _size.offset[1]
            };
            (0, _jquery2.default)(viewopts._dom).attr("myTopLeft", true);

            layer.style(viewopts._layerIdx, _style);

            if (viewopts.type == "divwindow") layer.iframeAuto(viewopts._layerIdx);
        });
    },
    _startActivate: function _startActivate(layero) {
        this.activate(layero);
        if (this.config.success) {
            this.config.success(this);
        }
        if (!this.isActivate) {
            //窗口打开中没加载完成时，被释放
            this.disableBase();
        }
    },
    //子类继承后覆盖 
    init: function init() {},
    //子类继承后覆盖 
    create: function create(endfun) {},
    //子类继承后覆盖
    beforeActivate: function beforeActivate() {},
    activate: function activate(layero) {},

    //子类继承后覆盖
    beforeDisable: function beforeDisable() {},
    disable: function disable() {},

    //子类继承后覆盖 
    winCreateOK: function winCreateOK(opt, result) {},
    //窗口最大化后触发
    winFull: function winFull() {},
    //窗口最小化后触发
    winMin: function winMin() {},
    //窗口还原 后触发
    winRestore: function winRestore() {},

    //公共方法
    getHtml: function getHtml(url, callback) {
        _jquery2.default.ajax({
            url: url,
            type: "GET",
            dataType: 'html',
            timeout: 0, //永不超时
            success: function success(data) {
                callback(data);
            }
        });
    }

});

exports.BaseWidget = BaseWidget;

/***/ })
 ]);
});