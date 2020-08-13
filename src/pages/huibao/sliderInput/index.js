/**
 * 封装的数字bar条，最新的react  hook写法
 */
import { useState,useEffect} from 'react'
import {Slider,InputNumber} from 'antd'
import classnames from 'classnames'

import styles from './index.less'

export default function SliderInput({hanldeAlphaClose, defaultValue =1 ,onChange,modal,step=0.1,min=0,max=1}){
  const [inputValue,setInputValue] = useState(defaultValue)
  useEffect(()=>{
    onChange && onChange(inputValue)
  },[inputValue]);

  function handleChange(value){
    if(isNaN(value)){
      return;
    }
    setInputValue(value);
  }

  return (
    <div className={classnames({[styles.alphaPopover]:true,[styles.modal]:!!modal})}>
      <div className={styles.cover} onClick={hanldeAlphaClose && hanldeAlphaClose}></div>
      <Slider 
        className = {styles.slider}
        min = { min }
        max = { max }
        onChange = {handleChange}
        value = {typeof inputValue === 'number' ? inputValue: 0}
        step = {step}
      />
      <InputNumber 
        className = {styles.input}
        min = {min}
        max = {max}
        step = {step}
        value = {inputValue}
        onChange = {handleChange}
      />
    </div>
  )
}