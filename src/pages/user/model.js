import { fetchLogin,fetchRegister} from './service';

export default {
  namespace: 'Login',

  state: {
    username:'',
    role:'',
  },

  effects: {
    *login({ payload,callback  }, { call, put, select ,take}) {
      let response = yield call(fetchLogin, payload);
      if(response.success && response.data){
        yield put({
          type:'initName',
          payload:response.data
        })
      }
      return response
    },
    *exist({ payload,callback  }, { call, put, select ,take}) {
      
      yield put({
        type:'deleteName',
        payload:''
      })
    },
    *register({ payload,callback  }, { call, put, select ,take}) {
      let response = yield call(fetchRegister, payload);
      if(response.success && response.data){
        yield put({
          type:'initName',
          payload:response.data.username
        })
      }
      return response
    },
    
  },

  reducers: {
    initName(state, action) {
      return {
        ...state,
        username: action.payload.username,
        role:action.payload.role
      };
    },
    deleteName(state,action){
      return {
        ...state,
        username: action.payload
      };
    }
  }
};
