import React from 'react';
import { Card, Table, Button, message, Form, Select, Modal, DatePicker } from 'antd';
import axios from '../../axios/index';
import Utils from '../../utils/utils';
import locale from 'antd/lib/date-picker/locale/zh_CN';
const FormItem = Form.Item;
const Option = Select.Option;

export default class Order extends React.Component{

    state = {
        list: [],
        isShowOrderConfirm: false,
        orderInfo: {}
    }

    params = {
        page: 1
    }    

    componentDidMount = () => {
       this.requestList();
    }
    
    // 获取订单列表
    requestList = () => {
        axios.ajax({
            url: '/order/list',
            data: {
                params: {
                    page: this.params.page
                }
            }
        }).then(res => {
            if(res.code === 0) {
                this.setState({
                    list: res.result.item_list,
                    pagination: Utils.pagination(res, (current)=> {
                        this.params.page = current
                        this.requestList();
                    })
                })
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

    // 点击结束订单按钮
    handleConfirm = () => {
        let item = this.state.selectItem;
        if(!item) {
            Modal.info({
                title: '提示',
                content: '请选择一条订单进行结束'
            })
            return
        }

        axios.ajax({
            url: '/order/ebike_info',
            data: {
                params: {
                    orderId: item.id
                }
            }
        }).then(res => {
            if(res.code === 0) {
                this.setState({
                    orderInfo: res.result,
                    isShowOrderConfirm: true
                })
            }
        })
    }

    // 结束订单
    handleFinishOrder = () => {
        let item = this.state.selectItem;
        axios.ajax({
            url: '/order/finish_order',
            data: {
                params: {
                    orderId: item.id
                }
            }
        }).then(res => {
            if(res.code === 0) {
                message.success('订单结束成功');
                this.setState({
                    isShowOrderConfirm: false
                })
                this.requestList();
            }
        })
    }

    openOrderDetail = () => {
        let item = this.state.selectItem;
        if(!item) {
            Modal.info({
                title: '提示',
                content: '请选择一条订单进行结束'
            })
            return;
        }

        window.open(`/#/common/order/detail/${item.id}`, '_blank')
        // window.location.href = `/#/common/order/detail/${item.id}`     

    }

    render() {

        const columns = [
            {
                title: '订单编号',
                dataIndex: 'order_sn'
            },
            {
                title: '车辆编号',
                dataIndex: 'bike_sn'
            },
            {
                title: '用户名',
                dataIndex: 'user_name'
            },
            {
                title: '手机号码',
                dataIndex: 'mobile'
            },
            {
                title: '里程',
                dataIndex: 'distance',
                render(distance) {
                    return Number(distance)/1000 + 'KM';
                }
            },
            {
                title: '行程时长',
                dataIndex: 'total_time'
            },
            {
                title: '状态',
                dataIndex: 'status'
            },
            {
                title: '开始时间',
                dataIndex: 'start_time'
            },
            {
                title: '结束时间',
                dataIndex: 'end_time'
            },
            {
                title: '订单金额',
                dataIndex: 'total_fee',
                render(total_fee) {
                    return Number(total_fee) / 10000 + '元';
                }
            },
            {
                title: '实付金额',
                dataIndex: 'user_pay',
                render(user_pay) {
                    return Number(user_pay) / 1000 + '元';
                }
            },
        ]
        
        const selectedRowKeys = this.state.selectedRowKeys;

        const rowSelection = {
            type: 'radio',
            selectedRowKeys
        }
        
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 18
            }
        }

        return (
            <div>
                <Card>
                    <FilterForm/>
                </Card>
                <Card style={{marginTop: 10}}>
                    <Button type="primary" style={{marginRight: 20}} onClick={this.openOrderDetail}>订单详情</Button>
                    <Button type="primary" onClick={this.handleConfirm}>结束订单</Button>
                </Card>
                <div className="content-wrapper">
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
                    title="结束订单"
                    visible={this.state.isShowOrderConfirm}
                    width={600}
                    onOk={this.handleFinishOrder}
                    onCancel={() => {
                        this.setState({
                            isShowOrderConfirm: false
                        })
                    }}
                >
                    <Form layout="horizontal">
                        <FormItem label="车辆编号" {...formItemLayout}>{this.state.orderInfo.bike_sn}</FormItem>
                        <FormItem label="剩余电量" {...formItemLayout}>{this.state.orderInfo.battary + '%'}</FormItem>
                        <FormItem label="行程开始时间" {...formItemLayout}>{this.state.orderInfo.start_time}</FormItem>
                        <FormItem label="当前位置" {...formItemLayout}>{this.state.orderInfo.location}</FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

class FilterForm extends React.Component{
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <FormItem label="城市">
                    {
                        getFieldDecorator('city_id')(
                            <Select
                                style={{width: 100}}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">北京</Option>
                                <Option value="2">上海</Option>
                                <Option value="3">深圳</Option>
                                <Option value="3">杭州</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="订单时间">
                    {
                        getFieldDecorator('start_time')(
                            <DatePicker locale={locale} showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间" style={{width: '200px'}}></DatePicker>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('end_time')(
                            <DatePicker locale={locale} showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间" style={{width: '200px'}}></DatePicker>
                        )
                    }
                </FormItem>
                <FormItem label="订单状态">
                    {
                        getFieldDecorator('order_status')(
                            <Select
                                style={{width: 120}}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">进行中</Option>
                                <Option value="2">进行中</Option>
                                <Option value="2">结束行程</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" style={{margin:'0 20px'}}>查询</Button>
                    <Button>重置</Button>
                </FormItem>
            </Form>
        )
    }
}
FilterForm = Form.create({})(FilterForm);