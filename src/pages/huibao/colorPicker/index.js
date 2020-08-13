/**
 * 封装的颜色选择器
 */
import {useState,useEffect} from 'react'
import {SketchPicker} from 'react-color'
import classnames from 'classnames'

import SliderInput from '../sliderInput';

import styles from './index.less';

export default function ColorPicker({onChange,className,defaultColor = {r:56,g:142,b:142,a:1}}){
  const [color,setColor] = useState(defaultColor)
  const [visible,setVisible] = useState(false)
  const [alphaVisible,setAlphaVisible] = useState(false)
  //透明度
  const [inputValue,setInputValue] = useState(defaultColor.a)

  useEffect(()=>{
    onChange && onChange(getColor1());
  },[inputValue,color])

  function getColor(){
    return `rgba(${color.r},${color.g},${color.b},${inputValue})`
  }

  function getColor1(){
    return {...color,a:inputValue}
  }

  function handleChange(c){
    setColor({
      ...c.rgb
    })
  }

  function handleClick(){
    setVisible(true)
  }
  
  function handleClose(){
    setVisible(false)
  }
  function handleAlphaChange(value){
    setInputValue(value)
  }
  function hanldeAlphaClose(){
    setAlphaVisible(false)
  }
  function handleAlphaClick(){
    setAlphaVisible(true)
  }


  return (
    <div className={classnames(styles.colorWapper,className)}>
      <div className={styles.color}>
        <div className={styles.left} onClick={handleClick}>
          <div className={styles.colorLine} style={{backgroundColor:getColor()}}></div>
        </div>
        <div className={styles.right} onClick={handleAlphaClick}>{inputValue}</div>
      </div>
      {
        visible ?
        (
          <div className={styles.popover}>
            <div className={styles.cover} onClick={handleClose}></div>
            <SketchPicker 
              disableAlpha={true}
              color = {color}
              onChange = {handleChange}
            />
          </div>
        ):null
      }
      {
        alphaVisible
        ?<SliderInput hanldeAlphaClose= {hanldeAlphaClose} onChange={handleAlphaChange} modal={true} />
        :null
      }
    </div>
  )

} 