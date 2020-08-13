import React, { Component } from 'react';
import styles from './style.less';

class moduleTitle extends Component{

  render () {
    return (
      <div className={styles.content}>
        <div className={styles.box}>
          <p >{this.props.titleEn}</p>
          <p>{this.props.titleDe}</p>
        </div>
      </div>
    );
  }
}

export default moduleTitle;

