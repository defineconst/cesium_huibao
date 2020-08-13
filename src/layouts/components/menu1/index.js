import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'umi';
import styles from './style.less';
import { Modal,Button } from 'antd';
import { connect } from 'dva';

@connect(({ Login }) => ({
  Login
}))

class TopMenu1 extends Component{

  state = {
    firstMenu: '首页',
    secondMenu: '',
    scrollTop: 0,
    visible:false,
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


    const menuList = [
      {
        key: 'huibao_layer',
        name: '图层',
        disabled: false,
        children: [
          {
            key: 'hb_dixingtu',
            name: '地形图',
            disabled: false,
            callback: () => {
              this.setState({
                visible: true,
              });
            }
          },
          {
            key: 'hb_yanmotu',
            name: '淹没图',
            disabled: false,
            callback: () => {
              Modal.info({title: 'stay tuned.'})
            }
          },
          {
            key: 'hb_qiukuaitu',
            name: '丘块图',
            disabled: false,
            callback: () => {
              Modal.info({title: 'stay tuned.'})
            }
          }
        ]
      },
      {
        key: 'huibao_model',
        name: '模型库',
        disabled: false,
        children: [
          {
            key: 'build',
            name: '房屋',
            disabled: false,
          }
        ]
      }
    ];

    return (
      <div className={styles.box}>
        <div className={styles.nav}>
          <div className={styles.titBox}>
            <p>xxx</p>
          </div>
          <ul className={styles.menu}>
            {
              menuList.map((item, key) => (
                <li key={key} className={this.state.firstMenu === item.key ? styles.active : ''}>
                  <Link className={styles.first} disabled={item.disabled}>{item.name}</Link>
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
                                      >{v.name}</Link>
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


        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

export default withRouter(TopMenu1);

