/**
 * Cesium
 */
// turf 
const Ajax = require('axios')
let waterImg = require('./img/water.jpg')
// let yanmo_position = require(`${window.host}/huibao/yanmotu.geojson`)

export function _addDixingtu() {
  return new Promise((resolve, reject) => {
    let viewer = window.viewer;
    var terrainProvider = new Cesium.CesiumTerrainProvider({
      url: `${window.host}/huibao/mq_terrain`
      // url: 'http://localhost:8085/huibao/test'
    });
    viewer.terrainProvider = terrainProvider;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(108.79, 26.45, 15000.0),
      duration: 2.0,
      /* orientation : {
        heading : Cesium.Math.toRadians(0),
        pitch : Cesium.Math.toRadians(-35.0),
        roll : 0.0
      } */
    });
    resolve()
  })
}
export function _removeDixingtu() {
  return new Promise((resolve, reject) => {
    let viewer = window.viewer;
    var terrainProvider = new Cesium.CesiumTerrainProvider({
      url: 'http://data.marsgis.cn/terrain'
    });
    // viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({}) //测试，置空地形
    viewer.terrainProvider = terrainProvider;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(108.79, 26.45, 15000.0)
    });
    resolve()
  })
}

export function _addHangPian() {
  const { hangpian_dom } = window.globalConfig
  return new Promise((resolve, reject) => {
    // 此处是wms服务的加载方式
    // var provider = new Cesium.WebMapServiceImageryProvider({
    //   url: hangpian_dom.url,
    //   layers: hangpian_dom.name,
    //   parameters: {
    //     service: 'WMS',
    //     format: 'image/png',
    //     transparent: true,
    //   }
    // });

    //以下是wmts切片服务的加载方式
    let matrixIds = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10',
      'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];

    let provider = new Cesium.WebMapTileServiceImageryProvider({
      url: hangpian_dom.url,
      layer: hangpian_dom.name,
      style: 'raster',
      format: 'image/png',
      tileMatrixSetID: 'EPSG:4326',
      tileMatrixLabels: matrixIds,
      tilingScheme: new Cesium.GeographicTilingScheme({//此处很重要，很重要。。。
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1
      })
    });
    provider.name = 'hangpian'
    viewer.imageryLayers.addImageryProvider(provider);
    resolve()
  })
}

// export function _addShuimian

export function _addQiukuaituPolygon({ fillColor, strokeColor, strokeWidth, clampToGround }) {
  return new Promise((resolve, reject) => {
    console.log(window.viewer, fillColor, strokeColor)
    const viewer = window.viewer

    let dataSource = _getDataSource("qiukuaitu_polygon")
    dataSource && viewer.dataSources.remove(dataSource);
    if (!clampToGround) {
      viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
    }
    Cesium.GeoJsonDataSource.load(`${window.host}/huibao/fenhutu.geojson?_t=${new Date().getTime()}`, {
      stroke: Cesium.Color.fromAlpha(Cesium.Color.fromBytes(strokeColor.r, strokeColor.g, strokeColor.b), strokeColor.a),
      fill: Cesium.Color.fromAlpha(Cesium.Color.fromBytes(fillColor.r, fillColor.g, fillColor.b), fillColor.a),
      strokeWidth: strokeWidth,
      clampToGround: clampToGround, //为true，设置了贴地，边框样式失效
    }).then((dataSource) => {
      dataSource.name = 'qiukuaitu_polygon'
      viewer.dataSources.add(dataSource);
      viewer.flyTo(dataSource, {
        duration: 2.0
      })
      resolve()
    });
  })
}

export function _addQiukuaituLine({ fillColor, strokeColor, strokeWidth, clampToGround }) {
  return new Promise((resolve, reject) => {
    console.log(window.viewer, fillColor, strokeColor)
    const viewer = window.viewer

    let dataSource = _getDataSource("qiukuaitu_line")
    dataSource && viewer.dataSources.remove(dataSource);
    if (!clampToGround) {
      viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
    }
    Cesium.GeoJsonDataSource.load(`${window.host}/huibao/fenhutu_line.geojson?_t=${new Date().getTime()}`, {
      stroke: Cesium.Color.fromAlpha(Cesium.Color.fromBytes(strokeColor.r, strokeColor.g, strokeColor.b), strokeColor.a),
      fill: Cesium.Color.fromAlpha(Cesium.Color.fromBytes(fillColor.r, fillColor.g, fillColor.b), fillColor.a),
      strokeWidth: strokeWidth,
      clampToGround: clampToGround, //为true，设置了贴地，边框样式失效
    }).then((dataSource) => {
      dataSource.name = 'qiukuaitu_line'
      viewer.dataSources.add(dataSource);
      viewer.flyTo(dataSource, {
        duration: 2.0
      })
      resolve()
    });
  })
}

function _getDataSource(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    return;
  }
  const viewer = window.viewer
  let dataSources = viewer.dataSources
  for (let i = 0; i < dataSources.length; i++) {
    let dataSource = dataSources.get(i)
    if (dataSource.name === name) {
      return dataSource;
    }
  }
  return null;
}

export function _removeQiukuaitu() {
  return new Promise((resolve, reject) => {
    console.log(window.viewer)
    const viewer = window.viewer

    let dataSource1 = _getDataSource("qiukuaitu_polygon")
    let dataSource2 = _getDataSource("qiukuaitu_line")
    dataSource1 && viewer.dataSources.remove(dataSource1);
    dataSource2 && viewer.dataSources.remove(dataSource2);
    resolve()
  })
}

export function _addYanmotuPolygon({ fillColor, strokeColor, strokeWidth, clampToGround, heightAboveGround}) {
  return new Promise((resolve, reject) => {
    console.log(window.viewer, fillColor, strokeColor)
    const viewer = window.viewer

    let dataSource = _getDataSource("yanmotu_polygon")
    dataSource && viewer.dataSources.remove(dataSource);

    if (!clampToGround) {
      viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
    }

    Cesium.GeoJsonDataSource.load(`${window.host}/huibao/yanmotu.geojson?_t=${new Date().getTime()}`, {
      // stroke: Cesium.Color.fromCssColorString('#d09400'),
      // fill:Cesium.Color.fromCssColorString('#d09400'),
      stroke: Cesium.Color.fromAlpha(Cesium.Color.fromBytes(strokeColor.r, strokeColor.g, strokeColor.b), strokeColor.a),
      fill: Cesium.Color.fromAlpha(Cesium.Color.fromBytes(fillColor.r, fillColor.g, fillColor.b), fillColor.a),
      strokeWidth: strokeWidth,
      clampToGround: clampToGround //为true，设置了贴地，边框样式失效
    }).then((dataSource) => {
      // this.shenzhenOutline = data;
      // data.show = false;
      dataSource.name = 'yanmotu_polygon'
      viewer.dataSources.add(dataSource);

      var entities = dataSource.entities.values;
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        let positions = entity.polygon.hierarchy.getValue().positions
        let positionsTemp = []
        for(let j=0 ; j < positions.length; j++){
          var ellipsoid = viewer.scene.globe.ellipsoid;
          var cartographic = ellipsoid.cartesianToCartographic(positions[j]);
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          var lng = Cesium.Math.toDegrees(cartographic.longitude);
          positionsTemp.push([lng,lat])
        }

        var polygon = turf.polygon( [positionsTemp] );
        let scaleRate = 5*(heightAboveGround-1000)/1000000;
        var buffered = turf.buffer(polygon, scaleRate, {units: 'miles'});
        // var buffered = turf.transformScale(polygon,scaleRate)

        let positions_result = []
        var coords = buffered.geometry.coordinates[0]
        for(let t=0;t<coords.length;t++){
          positions_result.push(Cesium.Cartesian3.fromDegrees(coords[t][0],coords[t][1]))
        }
        entity.polygon.hierarchy = new Cesium.PolygonHierarchy(positions_result, [new Cesium.PolygonHierarchy()])
      }

      viewer.flyTo(dataSource, {
        duration: 2.0
      })
      resolve()
    });
  })
}

//暂时没用上
export function _adjustYanmotu({height}){
  //调整面装高度
  let dataSource_polygon = _getDataSource("yanmotu_polygon")
  var entities_polygon = dataSource_polygon.entities.values;
  for (var i = 0; i < entities_polygon.length; i++) {
    let entity = entities_polygon[i];
    entity.polygon.height = height 
  }

  //调整线高度
  let dataSource_polyline = _getDataSource("yanmotu_line")
  var entities_polyline = dataSource_polyline.entities.values;
  for (var i = 0; i < entities_polyline.length; i++) {
    let entity = entities_polyline[i];
    entity.polyline.height = height 
  }
}

export function _addYanmoShuiXiaoguo() {
  return new Promise((resolve, reject) => {
    Ajax.get(`${window.host}/huibao/yanmotu.geojson?_t=${new Date().getTime()}`).then((response) => {
      // 在这儿实现 setState
      let arr_polygon = []
      let coordinates = response.data.features[0].geometry.coordinates[0][0]
      for(let i = 0; i<coordinates.length; i++){
        arr_polygon.push(coordinates[i][0])
        arr_polygon.push(coordinates[i][1])
      }

      var djk_Polygon = viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArray(arr_polygon)
            ),
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
          })
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
          aboveGround: true
        }),
        show: true
      }));
      djk_Polygon.appearance.material = new Cesium.Material({
        fabric: {
          type: 'Water',
          uniforms: {
            normalMap: waterImg,
            frequency: 10000.0,
            animationSpeed: 0.01,
            amplitude: 50
          }
        }
      });
    }).catch(function (error) {
      // 处理请求出错的情况
    });
    resolve();
  })
}

export function _addYanmotuLine({ fillColor, strokeColor, strokeWidth, clampToGround ,heightAboveGround}) {
  return new Promise((resolve, reject) => {
    const viewer = window.viewer

    let dataSource = _getDataSource("yanmotu_line")
    dataSource && viewer.dataSources.remove(dataSource);

    if (!clampToGround) {
      viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({})
    }

    Cesium.GeoJsonDataSource.load(`${window.host}/huibao/yanmo.geojson?_t=${new Date().getTime()}`, {
      stroke: Cesium.Color.fromAlpha(Cesium.Color.fromBytes(strokeColor.r, strokeColor.g, strokeColor.b), strokeColor.a),
      fill: Cesium.Color.fromAlpha(Cesium.Color.fromBytes(fillColor.r, fillColor.g, fillColor.b), fillColor.a),
      strokeWidth: strokeWidth,
      clampToGround: clampToGround //为true，设置了贴地，边框样式失效
    }).then((dataSource) => {
      dataSource.name = 'yanmotu_line'
      viewer.dataSources.add(dataSource);

     /*  var entities = dataSource.entities.values;
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        let positions = entity.polyline.positions.getValue()
        let positionsTemp = []
        for(let j=0 ; j < positions.length; j++){
          var ellipsoid = viewer.scene.globe.ellipsoid;
          var cartographic = ellipsoid.cartesianToCartographic(positions[j]);
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          var lng = Cesium.Math.toDegrees(cartographic.longitude);
          positionsTemp.push([lng,lat])
        }

        var polyline = turf.lineString( positionsTemp );
        // var buffered = turf.buffer(polygon, , {units: 'miles'});
        let scaleRate = heightAboveGround/1000
        var buffered = turf.transformScale(polyline,scaleRate)

        let positions_result = []
        var coords = buffered.geometry.coordinates
        for(let t=0;t<coords.length;t++){
          positions_result.push(Cesium.Cartesian3.fromDegrees(coords[t][0],coords[t][1]))
        }
        entity.polyline.positions = positions_result
      }  */
      
      viewer.flyTo(dataSource, {
        duration: 2.0
      })
      resolve()
    });
  })
}


export function _removeYanmotu() {
  return new Promise((resolve, reject) => {
    const viewer = window.viewer
    let dataSource1 = _getDataSource("yanmotu_polygon");
    let dataSource2 = _getDataSource("yanmotu_line")
    dataSource1 && viewer.dataSources.remove(dataSource1);
    dataSource2 && viewer.dataSources.remove(dataSource2);
    resolve()
  })
}

export function _addZhujitu() {
  return new Promise((resolve, reject) => {
    Cesium.GeoJsonDataSource.load(`${window.host}/huibao/zhujitu.geojson?_t=${new Date().getTime()}`, {

    }).then((dataSource) => {
      let dataSourceMy = new Cesium.CustomDataSource('zhujitu');
      // dataSource.name = 'zhujitu'
      console.log(dataSource)
      // viewer.dataSources.add(dataSource);
      var entities = dataSource.entities.values;

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var inthtml = `<table style="width: 200px;"><tr>
          <th scope="col" colspan="4"  style="text-align:center;font-size:15px;"></th></tr><tr>
          <td >地块面积：</td><td >100平方米</td></tr><tr>
          <td >地块所属：</td><td >${entity.properties.ZJNR_12.getValue()}</td></tr><tr>
          <td >其他属性：</td><td >xxx</td></tr><tr></table>`;

        //添加实体
        var entitie = dataSourceMy.entities.add({
          name: entity.properties.ZJNR_12.getValue(),
          // position: Cesium.Cartesian3.fromDegrees(item.X, item.Y),
          position: entity.position,
          billboard: undefined,
          /* billboard: {
            image: 'img/marker/mark3.png',
            scale: 0.7,  //原始大小的缩放比例
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2)
          }, */
          label: {
            text: entity.properties.ZJNR_12.getValue(),
            font: 'normal small-caps normal 19px 楷体',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, 0),   //偏移量  
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2000000)
          },
          popup: {
            html: inthtml,
            anchor: [0, -25],
          }
        });

        // var entity = entities[i];
        // entity.billboard = undefined;
        // /* entity.point = new Cesium.PointGraphics({
        //   color: Cesium.Color.RED,
        //   pixelSize: 10
        // }); */
        // /* entity.billboard = new Cesium.BillboardGraphics({
        //   image: '',
        //   scale: 0.7,  //原始大小的缩放比例
        //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        //   scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2)
        // });  */
        // entity.label = new Cesium.LabelGraphics({
        //   text: entity.properties.ZJNR_12.getValue(),
        //   font: 'normal small-caps normal 14px 楷体',
        //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //   fillColor: Cesium.Color.AZURE,
        //   outlineColor: Cesium.Color.BLACK,
        //   outlineWidth: 2,
        //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //   pixelOffset: new Cesium.Cartesian2(0, 0),   //偏移量  
        //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2000000)
        // });
      }
      viewer.dataSources.add(dataSourceMy);
      viewer.flyTo(dataSourceMy, {
        duration: 2.0
      })
      resolve()
    })
  })
}

export function _removeZhujitu() {
  return new Promise((resolve, reject) => {
    const viewer = window.viewer

    let dataSource = _getDataSource("zhujitu")
    dataSource && viewer.dataSources.remove(dataSource);
    resolve()
  })
}