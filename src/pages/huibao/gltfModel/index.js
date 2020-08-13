/**
 * 封装的加载gltf组件，接收外部传入的src，scale 等参数
 */
import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'umi';
import styles from './style.less';
import { Modal, Button, Checkbox, Row, Col, Message, Select, InputNumber, Divider, Tooltip, Table, Tag, List,Card, Form, Input, Icon, Radio } from 'antd';
import { connect } from 'dva';
import { ModalDrag } from '@/utils/ModalDrag.js';
import { _addHangPian } from '../layer';

//注入model
@connect(({ Login,HUIBAO }) => ({
  Login,HUIBAO
}))
class GltfModel extends Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }

  componentDidMount(){
    const { drawControl } = this.props.HUIBAO
    //事件监听(可以自行加相关代码实现业务需求，此处主要做示例)
    drawControl.on(mars3d.draw.event.DrawStart, function (e) {
      console.log('开始绘制');
    });
    drawControl.on(mars3d.draw.event.DrawAddPoint, function (e) {
      console.log('绘制过程中增加了点');
    });
    drawControl.on(mars3d.draw.event.DrawRemovePoint, function (e) {
      console.log('绘制过程中删除了点');
    });
    drawControl.on(mars3d.draw.event.DrawCreated, function (e) {
      console.log('创建完成');
    });
    drawControl.on(mars3d.draw.event.EditStart, function (e) {
      console.log('开始编辑');
    });
    drawControl.on(mars3d.draw.event.EditMovePoint, function (e) {
      console.log('编辑修改了点');
    });
    drawControl.on(mars3d.draw.event.EditRemovePoint, function (e) {
      console.log('编辑删除了点');
    });
    drawControl.on(mars3d.draw.event.EditStop, function (e) {
      console.log('停止编辑');
    });

    ////编辑时拖拽点颜色（修改内部默认值）
    //mars3d.draw.dragger.PointColor.Control = new Cesium.Color.fromCssColorString("#1c197d");          //位置控制拖拽点
    //mars3d.draw.dragger.PointColor.MoveHeight = new Cesium.Color.fromCssColorString("#9500eb");       //上下移动高度的拖拽点
    //mars3d.draw.dragger.PointColor.EditAttr = new Cesium.Color.fromCssColorString("#f73163");         //辅助修改属性（如半径）的拖拽点
    //mars3d.draw.dragger.PointColor.AddMidPoint = new Cesium.Color.fromCssColorString("#04c2c9").withAlpha(0.3);     //增加新点，辅助拖拽点

    ////标绘时的tooltip（修改内部默认值）
    //mars3d.draw.tooltip.draw.point.start = '单击 完成绘制';
    //mars3d.draw.tooltip.draw.polyline.start = '单击 开始绘制';
    //mars3d.draw.tooltip.draw.polyline.cont = '单击增加点，右击删除点';
    //mars3d.draw.tooltip.draw.polyline.end = '单击增加点，右击删除点<br/>双击完成绘制';
    //mars3d.draw.tooltip.draw.polyline.end2 = '单击完成绘制';
    //mars3d.draw.tooltip.edit.start = '单击后 激活编辑';
    //mars3d.draw.tooltip.edit.end = '释放后 完成修改';
    //mars3d.draw.tooltip.dragger.def = '拖动 修改位置'; //默认拖拽时提示  
    //mars3d.draw.tooltip.dragger.addMidPoint = '拖动 增加点';
    //mars3d.draw.tooltip.dragger.moveHeight = '拖动 修改高度';
    //mars3d.draw.tooltip.dragger.editRadius = '拖动 修改半径';
    //mars3d.draw.tooltip.dragger.editHeading = '拖动 修改方向';
    //mars3d.draw.tooltip.dragger.editScale = '拖动 修改缩放比例';
    //mars3d.draw.tooltip.del.def = '<br/>右击 删除该点';
    //mars3d.draw.tooltip.del.min = '无法删除，点数量不能少于';
    console.log(drawControl)
  }

  bindClick = (url,scale = 1) =>{
    console.log(url)
    this.drawModel(url,scale)
  }
  drawModel = (url, scale) => {
    const { drawControl } = this.props.HUIBAO
    drawControl && drawControl.startDraw({
      type: "model-p",
      style: {
        scale: scale || 1,
        modelUrl: require("" + url)
      }
    });
  }

  render(){
    const { title,src,scale,img } = this.props.params
    return (
    <>
      <Card
      hoverable
      style={{width: 120 }}
      bodyStyle={{padding:0,textAlign:"center"}}
      cover={<img alt="example" src={require(''+img)} />}
      onClick={()=>this.bindClick(src,scale)}
      >
        <Card.Meta title={title} style={{}}/>
        {/* <img 
        width={120}
        alt={title}
        src={require(''+src)}></img> */}
      </Card>
    </>
    )
  }
}
export default GltfModel