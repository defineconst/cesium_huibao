import React, { Component } from 'react';
import { withRouter } from 'umi';
import Meun from './components/menu'
import Menu1 from './components/menu1'
import Footer from './components/footer'
import styles from './index.less';
import {getCookie,setCookie} from '@/utils/cookie'

class BasicLayout extends Component {

  componentDidMount(){
    
  }

  render() {
    const { children, location, user } = this.props;
    
    return (
      <div className={`${styles.container} app`}>
        { location.pathname.indexOf('/login') === -1 && location.pathname.indexOf('/register') === -1 && <div>
            {/* <Menu1 /> */}
            <div className={styles.normal}>
              { this.props.children }
            </div>
            {/* <Footer /> */}
        </div>
        }
        { (location.pathname.indexOf('/login') !== -1 || location.pathname.indexOf('/register') !== -1) &&
          <div className={styles.normal}>
            { this.props.children }
          </div>
        }
        
      </div>
    );
  }
}
import { Form } from 'antd';

export default withRouter(BasicLayout);
