import React from 'react';
import { Card, Table, Button, message, Form, Modal } from 'antd';
import axios from '../../axios/index';
import BaseForm from '../../component/BaseForm/index';
const FormItem = Form.Item;

export default class Order extends React.Component{

    state = {
        list: [],
        isShowOrderConfirm: false,
        orderInfo: {}
    }

    params = {
        page: 1
    }    

    formList = [
        {
            type: 'SELECT',
            label: '城市',
            field: 'city_id',
            placeholder: '全部',
            initalValue: '1',
            width: 80,
            list:[{id: '0', name: '全部'},{id: '1', name: '北京'},{id: '2', name: '上海'},{id: '3', name: '杭州'},{id: '4', name: '深圳'}]
        },
        {
            type: 'DATEPICKER',
            width: 180,
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field: 'order_status',
            placeholder: '全部',
            initalValue: '1',
            width: 80,
            list:[{id: '0', name: '全部'},{id: '1', name: '进行中'},{id: '2', name: '结束行程'},{id: '3', name: '临时停车'}]
        }
        
        
    ]

    componentDidMount = () => {
       this.requestList();
    }
    
    // 从子组件BaseForm 响应的方法
    handleFilter = (params) => {
        this.params = params;
        this.requestList();
    }

    // 获取订单列表
    requestList = () => {
        axios.requestListPost(this, '/order/list', this.params, true);
        // axios.ajax({
        //     url: '/order/list',
        //     data: {
        //         params: this.params
        //     }
        // }).then(res => {
        //     if(res.code === 0) {
        //         this.setState({
        //             list: res.result.item_list,
        //             pagination: Utils.pagination(res, (current)=> {
        //                 this.params.page = current
        //                 this.requestList();
        //             })
        //         })
        //     }
        // })
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
                    {/* <FilterForm/> */}
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
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