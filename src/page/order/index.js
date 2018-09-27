import React from 'react';
import { Card, Table, Button, message, Form, Select, Modal } from 'antd';
import axios from '../../axios/index';
import Utils from '../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;

export default class Order extends React.Component{

    state = {
        list: []
    }

    params = {
        page: 1
    }    

    componentDidMount = () => {
       this.requestList();
    }
    

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

    onRowClick = (record, index) => {
        console.log(record, index)
        let selectKey = [index];
        this.setState({
            selectedRowKeys: selectKey,
            selectItem: record
        })
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
        
        return (
            <div>
                <Card>
                    <FilterForm/>
                </Card>
                <Card style={{marginTop: 10}}>
                    <Button type="primary" style={{marginRight: 20}}>订单详情</Button>
                    <Button type="primary">结束订单</Button>
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
                <FormItem label="订单状态">
                    {
                        getFieldDecorator('order_status')(
                            <Select
                                style={{width: 120}}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">进行中</Option>
                                <Option value="2">进行中(临时停车)</Option>
                                <Option value="2">行程结束</Option>
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