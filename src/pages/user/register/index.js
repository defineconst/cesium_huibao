import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Modal,
  Radio
} from 'antd';
import { Link } from 'react-router-dom'
import { connect } from 'dva';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const residences = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];


@connect(({ Login }) => ({
  Login
}))

class RegistrationForm extends React.Component {
  
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = e => {
    const {dispatch,history} = this.props
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type:'Login/register',
          payload:{
            ...values
          }
        }).then((res)=>{
          const {success,data} = res
          if(success && data){
            this.props.history.push('/mapbox')
          }else{
            Modal.info({
              content:"用户名重复！"
            })
          }
        })
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('确认您的密码两次输入一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <div style={{width:'500px',margin: '0 auto',padding:'200px 0 0 0',height:'50px'}}>
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item
          label={
            <span>
              昵称&nbsp;
              <Tooltip title="你想要其他人叫你什么?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请填写您的昵称!', whitespace: true }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="密码" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请填写您的密码!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="再次确认密码" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请再次输入您的密码!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item label="班级">
          {getFieldDecorator('className', {
            rules: [
              {
                required: true,
                message: '请填写您的班级!',
                whitespace: true 
              }
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="专业">
          {getFieldDecorator('major', {
            rules: [
              {
                required: true,
                message: '请填写您的专业!',
                whitespace: true 
              }
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="角色">
          {getFieldDecorator('role')(
            <Radio.Group>
              <Radio value="COMMON">游客</Radio>
              <Radio value="ADMIN">管理员</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

export default Form.create({ name: 'register' })(RegistrationForm);