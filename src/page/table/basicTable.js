import React from 'react';
import { Card, Table, Button, message } from 'antd';
import axios from '../../axios/index';
import { Modal} from 'antd';
import Utils from '../../utils/utils';
export default class BasicTable extends React.Component{

    state = {
        dataSource2: []
    }
    // 页码发生变化  不需要更新dom 因此不用放入state中
    params = {
        page: 1
    }

    componentDidMount () {
        const dataSource = [
            {
                id:'1',
                userName:'Jack',
                sex: 1,
                state:1,
                interest:1,
                birthday:'2010-01-01',
                address:'北京市海淀区奥林匹克公园',
                time:'09:00'
            },
            {
                id: '2',
                userName: 'Tom',
                sex: 1,
                state: 1,
                interest: 1,
                birthday: '2012-01-01',
                address: '北京市海淀区奥林匹克公园',
                time: '09:00'
            },
            {
                id: '3',
                userName: 'Lily',
                sex: 1,
                state: 1,
                interest: 1,
                birthday: '2014-01-01',
                address: '北京市海淀区奥林匹克公园',
                time: '09:00'
            }
        ]

        dataSource.map((item, index) => {
            item.key = index;
        })

        this.setState({
            dataSource
        })
        this.request();
    }
    
    request = () => {

        axios.ajax({
            url: '/table/list',
            data: {
                params:{
                    page:this.params.page
                }
            }
        }).then((res) => {
            if(res.code === 0) {
                this.setState({
                    dataSource2: res.result.list,
                    selectedRowKeys: [],
                    selectedRows: null,
                    pagination: Utils.pagination(res,(current) => {
                        //TODO
                        this.params.page = current;
                        this.request();
                    })
                })
            }
        }).catch((err) => {

        })
    }

    onRowClick = (record, index) => {
        let selectKey = [index];
        Modal.info({
            title: '信息',
            content: `姓名：${record.userName}   爱好：${record.interest}`
        })

        this.setState({
            selectItem: record,
            selectedRowKeys: selectKey
        })
    }

    // 多选执行删除动作
    handleDelete = (()=>{
        let rows = this.state.selectedRows;
        let ids = [];
        rows.map((item)=>{
            ids.push(item.id)
        })
        Modal.confirm({
            title:'删除提示',
            content: `您确定要删除这些数据吗？${ids.join(',')}`,
            onOk:()=>{
                message.success('删除成功');
                this.request();
            }
        })
    })


    render() {

        const columns = [
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName'
            },
            {
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                render(sex){
                    return sex === 1 ? '男' : '女'
                }
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render(state){
                    let config = {
                        '1':'在职',
                        '2':'离职',
                        '3':'工伤',
                        '4':'休假',
                        '5':'创业者'
                    }
                    return config[state]
                }
            },
            {
                title: '爱好',
                dataIndex: 'interest',
                key: 'interest',
                align: 'center',
                render(interest) {
                    let config = {
                        '1': '游泳',
                        '2': '打篮球',
                        '3': '踢足球',
                        '4': '跑步',
                        '5': '爬山',
                        '6': '骑行',
                        '7': '桌球',
                        '8': '麦霸'
                    }
                    return config[interest];
                }
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                key: 'birthday',
                align: 'center'
            },
            {
                title: '地址',
                dataIndex: 'address',
                key: 'address',
                align: 'center'
            },
            {
                title: '时间',
                dataIndex: 'time',
                key: 'time'
            }
        ]

        const selectedRowKeys = this.state.selectedRowKeys;

        const rowSelection = {
            type: 'radio',
            selectedRowKeys
        }

        const rowCheckSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange:(selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        }
        return (
            <div>
                <Card title="基础表格">
                    <Table 
                        dataSource={this.state.dataSource} 
                        columns={columns}
                        bordered
                        pagination={false}
                    />
                </Card>
                <Card title="动态数据表格" style={{margin: '10px 0'}}>
                    <Table 
                        dataSource={this.state.dataSource2} 
                        columns={columns}
                        bordered
                        pagination={false}
                    />
                </Card>
                <Card title="Mock-单选" style={{margin: '10px 0'}}>
                    <Table 
                        dataSource={this.state.dataSource2}
                        rowSelection={rowSelection}
                        onRow={(record, index) => {
                            return{
                                onClick: () => {
                                    this.onRowClick(record, index)
                                }
                            }
                        }} 
                        columns={columns}
                        bordered
                        pagination={false}
                    />
                </Card>
                <Card title="Mock-多选" style={{margin: '10px 0'}}>
                    <div style={{marginBottom:10}}>
                        <Button onClick={this.handleDelete}>删除</Button>
                    </div>
                    <Table 
                        dataSource={this.state.dataSource2}
                        rowSelection={rowCheckSelection}
                        columns={columns}
                        bordered
                        pagination={false}
                    />
                </Card>
                <Card title="Mock-分页" style={{margin: '10px 0'}}>
                    <Table 
                        dataSource={this.state.dataSource2}
                        columns={columns}
                        bordered
                        pagination={this.state.pagination}
                    />
                </Card>
            </div>
        )
    }
}