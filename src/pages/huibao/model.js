import { fetchAll,deleteUser, fetchTravel} from './service';

export default {
  namespace: 'HUIBAO',

  state: {
    //全局对象
    viewer:null,
    drawHelper:null,
    //模态框显示控制
    dixingtu_checked:false, 
    yanmotu_checked:false, 
    qiukuaitu_checked:false,
    zhujitu_checked:false,
    //飞行路线
    flyDataArr:[],
    drawControl:null,//绘制模型控制柄
    
    users:[],
  },

  effects: {
    *setCommon({ payload,callback  }, { call, put, select ,take}) {
      // console.log(payload)
      yield put({
        type:'updateCommon',
        payload
      })
    },
    *addFlyData({ payload,callback  }, { call, put, select ,take}) {
      const { flyDataArr } = yield select(_=>_.HUIBAO)
      yield put({
        type:'updateCommon',
        payload:{
          flyDataArr:[
          ...flyDataArr,payload.flyData
        ]}
      })
    },
    *removeFlyData({ payload,callback  }, { call, put, select ,take}) {
      const { flyDataArr } = yield select(_=>_.HUIBAO)
      let flyData = flyDataArr.filter(f=>f.id == payload.selectRouteId)
      flyDataArr.splice(flyDataArr.indexOf(flyData[0]),1)
      console.log(flyDataArr)
      yield put({
        type:'updateCommon',
        payload:{
          flyDataArr:[
          ...flyDataArr
        ]}
      })
    },
  },

  reducers: {
    updateCommon(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
  }
};
