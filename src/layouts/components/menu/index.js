import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'umi';
import styles from './style.less';
import { Modal,Button } from 'antd';
import { connect } from 'dva';

const menuList = [
  /* {
    key: 'home',
    name: '首页',
    disabled: false,
  },*/
 /*  {
    key: 'openlayers',
    name: 'ol',
    disabled: false,
  },  */
  /* {
    key: 'manage',
    name: '用户&学生',
    disabled: false,
    children: [
      {
        key: 'user',
        name: '用户管理',
        disabled: false,
      },
      {
        key: 'student',
        name: '学生管理',
        disabled: false,
      },
    ]
  }, */
   /* {
    key: 'manage/user',
    name: '用户管理',
    disabled: false,
  },
  {
    key: 'manage/student',
    name: '学生管理',
    disabled: false,
  },
  {
    key: 'navigation?type=1',
    name: '导航管理',
    disabled: false
  },
  {
    key: 'modelmanage',
    name: '模型管理',
    disabled: false,
  },
  {
    key: 'relationshipdb',
    name: '关系型数据库',
    disabled: false,
  },
  {
    key: 'spatialdb',
    name: '空间数据库',
    disabled: false,
  },
  {
    key: 'movie',
    name: 'movie comments',
    disabled: false,
  },
  {
    key: 'system',
    name: '系统',
    disabled: false,
    children: [
      {
        key: 'visualization',
        name: '可视化界面',
        disabled: false,
      },
    ]
  },
   {
    key: 'monitor',
    name: '魔芋监测',
    disabled: false,
    children: [
      {
        key: 'visualization',
        name: '可视化界面',
        disabled: false,
      },
    ]
  },
  {
    key: 'mapbox',
    name: 'mapbox',
    disabled: false,
  }, */
  /* {
    key: 'a_guanxichaxun',
    name: '关系查询',
    disabled: false,
  },
  {
    key: 'a_shitishibie',
    name: '实体识别',
    disabled: false,
  },
  {
    key: 'a_fuwuchaxun',
    name: '服务查询',
    disabled: false,
  },
  {
    key: 'a_tuijian',
    name: '协同推荐',
    disabled: false,
  }, */
  /* {
    key: 'b_kc',
    name: 'kecheng',
    disabled: false,
  },
  {
    key: 'b_ms',
    name: '模式图',
    disabled: false,
  },
  {
    key: 'b_see',
    name: '全览',
    disabled: false,
  },
  {
    key: 'b_search',
    name: '关系查询',
    disabled: false,
  },
  {
    key: 'b_jiance',
    name: '代码检测',
    disabled: false,
  }, */
  /* {
    key: 'd_see',
    name: '全览',
    disabled: false,
  },
  {
    key: 'd_search',
    name: '关系查询',
    disabled: false,
  }, */
  /* {
    key: 'c_home',
    name: 'home',
    disabled: false,
  }, 
  {
    key: 'supermap_ol',
    name: 'supermap',
    disabled: false,
  },*/
  
 /*  {
    key: 'others',
    name: 'Others',
    disabled: false,
    children: [
      {
        key: 'online',
        name: 'xxx',
        disabled: false,
        callback: () => {
          Modal.info({title: 'stay tuned.'})
        }
      }
    ]
  },  */
];

@connect(({ Login }) => ({
  Login
}))

class TopMenu extends Component{

  state = {
    firstMenu: '首页',
    secondMenu: '',
    scrollTop: 0,
  };

  componentDidMount() {
    this.props.history.listen(route => {
      this.setState({
        firstMenu: route.pathname.split('\/')[1],
        secondMenu: route.pathname.split('\/')[2],
      });
      //路由变化回到顶部
      document.body.scrollTop = 0;
    })
  }

  exist = ()=>{
    const {dispatch,history} = this.props
    dispatch({
      type:'Login/exist'
    }).then(()=>{
      history.push('/')
    })
  }

  render() {
    // const { username } = this.props.Login
    return (
      <div className={styles.box}>
        <div className={styles.nav}>
          <div className={styles.titBox}>
            {/* <p>物理系统</p> */}
            {/* <p>晋商文化旅游信息平台</p> */}
            {/* <p>JAVA知识图谱</p> */}
            {/* <p>魔芋监测系统</p> */}
            {/* <p>语义地理信息服务智能检索</p>  */}
            {/* <p>MOVIES</p> */}
          </div>
          <ul className={styles.menu}>
            {
              menuList.map((item, key) => (
                <li key={key} className={this.state.firstMenu === item.key ? styles.active : ''}>
                  <Link className={styles.first} disabled={item.disabled} to={`/${item.key}`}>{item.name}</Link>
                  {
                    item.children &&
                    <Fragment>
                      <div className={styles.secondMenuBg}
                           style={{height: item.children.length * 50 + 'px'}} />
                      <div className={styles.secondMenu}>
                        {
                          item.children.map((v, k) => (
                            <div className={styles.secondMenuItem} key={k}>
                              {
                                v.callback &&
                                <a onClick={v.callback}>{v.name}</a>
                              }
                              {
                                !v.callback &&
                                <Link className={this.state.secondMenu === v.key ? styles.active : ''}
                                      disabled={v.disabled}
                                      to={`/${item.key}/${v.key}`}>{v.name}</Link>
                              }
                            </div>
                          ))
                        }
                      </div>
                    </Fragment>
                  }
                </li>
              ))
            }
          </ul>
          <div className={styles.personal}>
            <i />
            <p>{this.props.Login?this.props.Login.username:''}</p>
            {/* <Button type="link" onClick={this.exist}>退出</Button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TopMenu);

