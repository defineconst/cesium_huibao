/**
 * 三维场景声明创建对象入口文件
 */
import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'umi';
import styles from './style.less';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import { ModalDrag } from '@/utils/ModalDrag.js';
import { _addHangPian } from '../layer';

@connect(({ Login, HUIBAO }) => ({
  Login, HUIBAO
}))
class MainCesium extends Component {

  componentDidMount() {
    this.start() //组件加载后立即执行start函数
  }

  start = () => {
    this.initMap({
    }).then((viewer) => {
      viewer.mars.openFlyAnimation();

      //水纹扩散效果,
      /* var center = Cesium.Cartesian3.fromDegrees(117.29, 32.0581, 1); 
      viewer.entities.add({
          position: center,
          ellipse: {
              height: 0.0,
              semiMinorAxis: 80000.0,
              semiMajorAxis: 80000.0,
              material: new mars3d.ElliposidFadeMaterialProperty({
                  color: new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 0.9)
              }),
          }
      }); */
      return _addHangPian() //加载dom航片，geoserver发布，函数已封装再layer.js中
    })
  }

  //初始化三维地图场景，拿到viewer对象
  initMap = () => {
    return new Promise(resolve => {
      mars3d.createMap({
        id: 'cesiumContainer',
        url: '/config/marsConfig.json',
        success: (viewer) => {
          // viewer.camera.setView()
          window.viewer = viewer;
          var drawHelper = new DrawHelper(viewer);
          this.props.dispatch({
            type: 'HUIBAO/setCommon',
            payload: {
              viewer,
              drawHelper
            }
          })
          /* viewer.imageryLayers.add(new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
            layer: "tdtBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })) */

          viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=6e179266b26b2e2c5c4cce2c91823f40",
            layer: "tdtAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
        }));
          /* new MeasureTool({
            viewer: viewer,
            target: 'measure'
          }) */
          resolve(viewer)
        },
      });
    })
  };

  //放大地图
  zoomIn = () => {
    const { viewer } = this.props.HUIBAO;
    let cameraPos = viewer.camera.position;
    let ellipsoid = viewer.scene.globe.ellipsoid;
    let cartographic = ellipsoid.cartesianToCartographic(cameraPos);
    let height = cartographic.height;
    let centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
    let centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height / 1.5),
      duration: 1.0
    });
  }

  //缩小地图
  zoomOut = () => {
    const { viewer } = this.props.HUIBAO; // 获取当前镜头位置的笛卡尔坐标
    let cameraPos = viewer.camera.position; // 获取当前坐标系标准
    let ellipsoid = viewer.scene.globe.ellipsoid; // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    let cartographic = ellipsoid.cartesianToCartographic(cameraPos);  // 获取镜头的高度
    let height = cartographic.height;
    // 根据上面当前镜头的位置，获取该中心位置的经纬度坐标
    let centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
    let centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));
    // 镜头拉远
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height * 1.5),
      duration: 1.0,
    });
  }

  render() {
    return (
      <>
        <div className={styles.cesiumContainer} id="cesiumContainer">
          <div className={styles.toolbar}>
            <div className={styles.bar} onClick={this.zoomIn}>
              <span className="icon iconfont icon-zoomin"></span>
            </div>
            <div className={styles.bar} onClick={this.zoomOut}>
              <span className="icon iconfont icon-zoomout"></span>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default MainCesium