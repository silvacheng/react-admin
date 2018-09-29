import React from 'react';
import { Card, Table, Button, message, Form, Modal, Input, Radio, Select, DatePicker} from 'antd';
import BaseForm from '../../component/BaseForm/index';
import Utils from '../../utils/utils';
import axios from '../../axios/index';
import Moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;
export default class User extends React.Component {

    state ={
        list: []
    }

    params= {
        page: 1
    }
    
    formList = [
        {
            type: 'INPUT',
            label: '用户名',
            field: 'user_name',
            placeholder: '请输入用户名',
            width: 100
        },
        {
            type: 'INPUT',
            label: '用户手机号',
            field: 'user_mobile',
            placeholder: '请输入用户手机号',
            width: 100
        },
        {
            type: 'DATE',
            label: '入职日期',
            field: 'date',
            placeholder: '请输入入职日期'
        }

    ]

    componentDidMount () {
        this.requestList();
    }
    
    requestList = () => {
        axios.requestListPost(this, '/table/list1', this.params, true)
    }

    // 从子组件BaseForm 响应的方法
    handleFilter = (params) => {
        this.params = params;
        this.requestList();
    }

    // 操作
    handleOperate = (type) => {
        let item = this.state.selectItem;
        if(type === 'create') {
            this.setState({
                title: '创建员工',
                isVisible: true,
                type
            })
        } else if (type === 'edit' || type === 'detail') {
            if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个用户'
                })
                return;
            }
            this.setState({
                title: type === 'edit' ? '编辑员工': '员工详情',
                isVisible: true,
                userInfo: item,
                type
            })
        } else if (type === 'delete') {
            if(!item){
                Modal.info({
                    title: '提示',
                    content: '请选择一个用户'
                })
                return;
            }
            let _this = this;
            Modal.confirm({
                title: '确认删除',
                content: '是否要删除当前员工',
                onOk() {
                    axios.ajax({
                        url: '/user/delete',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then(res => {
                        if(res.code === 0) {
                            _this.setState({
                                isVisible: false
                            })
                            message.success('删除成功');
                            _this.requestList();
                        }
                    })
                },
                onCancel() {
                    _this.setState({
                        isVisible: false
                    })
                }
            })
        }

    }

    // 创建或编辑员工提交
    handleSubmit = () => {
        let type = this.state.type;
        // console.log(this.UserForm.props.form)

        let data = this.UserForm.props.form.getFieldsValue(); 
        axios.ajax({
            url: type === 'create'? '/user/add' : '/user/edit',
            data: {
                params: {
                    ...data
                }
            }
        }).then(res => {
            if(res.code === 0) {
                this.setState({
                    isVisible: false
                })
                // 清空UserForm表格数据
                this.UserForm.props.form.resetFields();
                // 提示
                let str = type === 'create' ? '创建' : '编辑';
                message.success(`${str}成功`);
                // 重新获取
                this.requestList();
            }
        })
    }

    // 选中某条数据
    onRowClick = (record, index) => {
        let selectKey = [index];
        this.setState({
            selectedRowKeys: selectKey,
            selectItem: record
        })
    }

    render() {

        const columns = [{
            title: 'id',
            dataIndex: 'id'
          }, {
            title: '用户名',
            dataIndex: 'username'
          }, {
            title: '性别',
            dataIndex: 'sex',
            render(sex){
                return sex ==1 ?'男':'女'
            }
          }, {
            title: '状态',
            dataIndex: 'state',
            render(state){
                let config = {
                    '1':'咸鱼一条',
                    '2':'风华浪子',
                    '3':'北大才子一枚',
                    '4':'百度FE',
                    '5':'创业者'
                }
                return config[state];
            }
          },{
            title: '爱好',
            dataIndex: 'interest',
            render(interest){
                let config = {
                    '1':'游泳',
                    '2':'打篮球',
                    '3':'踢足球',
                    '4':'跑步',
                    '5':'爬山',
                    '6':'骑行',
                    '7':'桌球',
                    '8':'麦霸'
                }
                return config[interest];
            }
          },{
            title: '爱好',
            dataIndex: 'isMarried',
            render(isMarried){
                return isMarried?'已婚':'未婚'
            }
          },{
            title: '生日',
            dataIndex: 'birthday'
          },{
            title: '联系地址',
            dataIndex: 'address'
          },{
            title: '早起时间',
            dataIndex: 'time'
          }
        ];
        const selectedRowKeys = this.state.selectedRowKeys;

        const rowSelection = {
            type: 'radio',
            selectedRowKeys
        }
        // 详情页不用展示模态框的ok与cancel按钮
        let footer = {};
        if(this.state.type === 'detail') {
            footer = {
                footer: null
            }
        }
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter} />
                </Card>
                <Card style={{marginTop: 10}}>
                    <Button onClick={() => this.handleOperate('create')} type="primary" style={{marginRight: 20}}>创建员工</Button>
                    <Button onClick={() => this.handleOperate('edit')} type="primary" style={{marginRight: 20}}>编辑员工</Button>
                    <Button onClick={() => this.handleOperate('detail')} type="primary" style={{marginRight: 20}}>员工详情</Button>
                    <Button onClick={() => this.handleOperate('delete')} type="danger">删除员工</Button>
                </Card>
                <div className="content-wrap">
                    <Table
                        bordered
                        columns={columns}
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        rowSelection={rowSelection}
                        onRow={(record, index) => {
                            return {
                                onClick: () => {
                                    this.onRowClick(record, index)
                                }
                            }
                        }}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    width={600}
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.UserForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    { ...footer }
                >
                    <UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst) => this.UserForm = inst}></UserForm>
                </Modal>
            </div>
        )
    }
}

class UserForm extends React.Component{

    getState = (state) => {
        return {
            '1':'咸鱼一条',
            '2':'风华浪子',
            '3':'北大才子一枚',
            '4':'百度FE',
            '5':'创业者'            
        }[state]
    }

    render() {

        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span:16
            }
        }
        // 新增员工时  清空员工信息
        if(type === 'create') {
            userInfo = {};
        }

        return (
            <Form layout="horizontal">
                <FormItem label="用户名" {...formItemLayout}>
                    {
                       userInfo && type === 'detail' ? userInfo.username :
                        getFieldDecorator('username', {
                            initialValue: userInfo.username
                        })(
                            <Input type="text" placeholder="请输入用户名"/>
                        )
                    }
                </FormItem>
                <FormItem label="性别" {...formItemLayout}>
                    {
                        userInfo && type === 'detail' ? userInfo.sex === 1 ? '男': '女' :
                        getFieldDecorator('sex', {
                            initialValue: userInfo.sex
                        })(
                            <RadioGroup>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </RadioGroup>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        userInfo && type === 'detail' ? this.getState(userInfo.state) :
                        getFieldDecorator('state', {
                            initialValue: userInfo.state
                        })(
                            <Select>
                                <Option value={1}>咸鱼一条</Option>
                                <Option value={2}>风华浪子</Option>
                                <Option value={3}>北大才子一枚</Option>
                                <Option value={4}>百度FE</Option>
                                <Option value={5}>创业者</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="生日" {...formItemLayout}>
                    {
                        userInfo && type === 'detail' ? userInfo.birthday :
                        getFieldDecorator('birthday', {
                            initialValue: Moment(userInfo.birthday)
                        })(
                            <DatePicker/>
                        )
                    }
                </FormItem>
                <FormItem label="联系地址" {...formItemLayout}>
                    {
                        userInfo && type === 'detail' ? userInfo.address :
                        getFieldDecorator('address', {
                            initialValue: userInfo.address
                        })(
                            <TextArea rows={3} placeholder="请输入联系地址"/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
UserForm = Form.create({})(UserForm);