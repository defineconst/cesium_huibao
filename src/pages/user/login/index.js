import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
import { Link } from 'react-router-dom'
import { connect } from 'dva';
import {getCookie,setCookie} from '@/utils/cookie'

@connect(({ Login }) => ({
  Login
}))

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        this.props.dispatch({
          type:'Login/login',
          payload:{
            ...values
          }
        }).then((res)=>{
          const { success ,data ,err} = res;
          if(success && data){
            setCookie("username",data.username)
            setCookie("password",data.password)
            this.props.history.push('/d_see')
          }else{
            Modal.info({
              content:"未找到用户！"
            })
          }
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{width:'500px',margin: '0 auto',padding:'200px 0 0 0',height:'50px'}}>
        <h1 style={{textAlign:"center"}}>xxxxx</h1>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {/* {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a> */}
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
           &nbsp; &nbsp; Or &nbsp; &nbsp; <Link to={{
              pathname: `register`,
              state: 'hello',
              }}>注册 now!
              </Link>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

export default Form.create({ name: 'normal_login' })(NormalLoginForm);