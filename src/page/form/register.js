import React from 'react';
import {Card, Form, Input, Button, Icon, Checkbox, Radio, Select, Switch, DatePicker, TimePicker, Upload, message, InputNumber} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
class FormRegister extends React.Component{

    state = {}

    handleSubmit = () => {
        let userInfo =  this.props.form.getFieldsValue();
        // console.log(userInfo);
        this.props.form.validateFields((err, values) => {
            if(!err) {
                message.success(`${userInfo.userName}  ---->  ${userInfo.password}`)
            }
        })
    }
    
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, imageUrl => this.setState({
            userImg: imageUrl,
            loading: false,
          }));
        }
    }   
    
    
    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: 24,
                sm: 4,
            },
            wrapperCol: {
                xs: 24,
                sm: 12,
            }
        }

        const offsetLayout = {
            wrapperCol:{
                xs:24,
                sm:{
                    span:12,
                    offset:4
                }
            }
        }

        const rowObject = {
            minRows: 3,
            maxRows: 6
        }


        return (
            <div>
                <Card title="注册表单">
                    <Form>
                        <FormItem label="用户名" {...formItemLayout}>
                        {
                                getFieldDecorator('userName',
                                    {
                                        initialValue : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '用户名不能为空'
                                            },
                                            {
                                                min:5, max:10,
                                                message: '长度不在范围内'
                                            },
                                            {
                                                pattern: new RegExp('^\\w+$', 'g'),
                                                message: '用户名必须为字母或者数字'
                                            }
                                        ]
                                    }
                                )(
                                    <Input prefix={<Icon type="user"/>} placeholder="请输入用户名"/>
                                ) 
                            }
                        </FormItem>
                        <FormItem label="密码"  {...formItemLayout}>
                        {
                                getFieldDecorator('password',
                                    {
                                        initialValue : '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '密码不能为空'
                                            },
                                            {
                                                min:6, max:16,
                                                message: '长度6 -- 16'
                                            }
                                        ]
                                    }
                                )(
                                    <Input prefix={<Icon type="lock"/>} placeholder="请输入密码"/>
                                ) 
                            }
                        </FormItem>
                        <FormItem label="性别" {...formItemLayout}>
                        {
                                getFieldDecorator('sex',
                                    {
                                        initialValue : 'male',
                                        rules: [
                                            {
                                                required: true
                                            }
                                        ]
                                    }
                                )(
                                    <RadioGroup>
                                        <Radio value="male">男</Radio>
                                        <Radio value="female">女</Radio>
                                    </RadioGroup>
                                ) 
                            }
                        </FormItem>
                        <FormItem label="年龄" {...formItemLayout}>
                        {
                                getFieldDecorator('age',
                                    {
                                        initialValue : 18,
                                        rules: [
                                            {
                                                required: true
                                            }
                                        ]
                                    }
                                )(
                                    <InputNumber></InputNumber>
                                ) 
                            }
                        </FormItem>
                        <FormItem label="当前状态" {...formItemLayout}>
                        {
                                getFieldDecorator('state',
                                    {
                                        initialValue : 'jack',
                                    }
                                )(
                                    <Select>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="tom">Tom</Option>
                                    </Select>
                                ) 
                            }
                        </FormItem>
                        <FormItem label="爱好" {...formItemLayout}>
                            {
                                getFieldDecorator('interest', {
                                    initialValue: ['2','5']
                                })(
                                    <Select mode="multiple">
                                        <Option value="1">游泳</Option>
                                        <Option value="2">打篮球</Option>
                                        <Option value="3">踢足球</Option>
                                        <Option value="4">跑步</Option>
                                        <Option value="5">爬山</Option>
                                        <Option value="6">骑行</Option>
                                        <Option value="7">桌球</Option>
                                        <Option value="8">麦霸</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="是否已婚" {...formItemLayout}>
                            {
                                getFieldDecorator('isMarried', {
                                    valuePropName:'checked',
                                    initialValue: false
                                })(
                                    <Switch/>
                                )
                            }
                        </FormItem>
                        <FormItem label="生日" {...formItemLayout}>
                            {
                                getFieldDecorator('birthday',{
                                    initialValue: moment('2018-09-20 16:16:32')
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="联系地址" {...formItemLayout}>
                            {
                                getFieldDecorator('address',{
                                    initialValue:'北京市海淀区奥林匹克公园'
                                })(
                                    <TextArea
                                        autosize={rowObject}
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="早起时间" {...formItemLayout}>
                            {
                                getFieldDecorator('time')(
                                    <TimePicker/>
                                )
                            }
                        </FormItem>
                        <FormItem label="头像" {...formItemLayout}>
                            {
                                getFieldDecorator('userImg')(
                                    <Upload
                                        listType="picture-card"
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        showUploadList={false}
                                        onChange={this.handleChange}
                                    >
                                    {this.state.userImg?<img src={this.state.userImg}/>: <Icon type="plus"/>}
                                    </Upload>
                                )
                            }
                        </FormItem>
                        <FormItem {...offsetLayout}>
                            {
                                getFieldDecorator('agree')(
                                   <Checkbox>我已阅读过<a href="#">慕课协议</a></Checkbox>
                                )
                            }
                        </FormItem>
                        <FormItem {...offsetLayout}>
                            <Button type="primary" onClick={this.handleSubmit}>注册</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
}
export default Form.create()(FormRegister)