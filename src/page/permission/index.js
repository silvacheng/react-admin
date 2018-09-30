import React from 'react';
import { Card, Button, Modal, Table, Form, Input, Select, message, Tree} from 'antd';
import axios from './../../axios/index';
import Utils from '../../utils/utils';
import menuConfig from './../../config/menuConfig'
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
export default class PermissionUser extends React.Component{

    state = {
        isRoleVisible: false,
        isPremVisible: false
    }

    componentDidMount() {
        this.requestList();
    }    

    requestList = () => {
        axios.get({
            url: '/role/list',
            data: {
                params:{}
            }
        }).then(res => {
            if(res.code === 0){
                let list = res.result.item_list.map((item, index) => {
                    item.key = index
                    return item
                })
                this.setState({
                    list,
                    pagination: Utils.pagination(res, (current)=> {
                        this.params.page = current
                        this.requestList();
                    })
                })
            } 
        })
    }

    // 点击创建角色按钮
    handleRole = () => {
        this.setState({
            isRoleVisible: true
        })
    }

    // 提交创建角色的数据
    handleRoleSubmit = () => {
        let data = this.roleForm.props.form.getFieldsValue();
        axios.get({
            url: '/role/create',
            data: {
                params: {
                    ...data
                }
            }
        }).then(res => {
            if(res.code === 0) {
                this.setState({
                    isRoleVisible: false
                })
                message.success('创建角色成功');
                this.requestList();
            }
        })
    }

    // 点击设置权限按钮
    handlePermission = () => {
        let item = this.state.selectItem;
        if(!item) {
            Modal.info({
                title: '提示',
                content: '请选择一个角色'
            })
            return;
        }
        this.setState({
            isPremVisible: true,
            roleInfo: item,
        })
        let menuList = item.menus;
        this.setState({
            menuInfo: menuList
        })
    }
    // 提交角色权限设置
    handlePremEditSubmit = () => {
        let postData = this.PremEditForm.props.form.getFieldsValue();
        postData.role_id = this.state.selectItem.id;
        postData.menus = this.state.menuInfo.join(',');
        axios.get({
            url: '/permission/edit',
            data: {
                params: {
                    ...postData
                }
            }
        }).then(res => {
            if(res.code === 0) {
                this.setState({
                    isPremVisible: false
                })
                this.requestList();
            }
        })
    }

    // 选中表格中的某条数据
    onRowClick = (record, index) => {
        let selectKey = [index];
        this.setState({
            selectedRowKeys: selectKey,
            selectItem: record
        })
    }

    render() {

        const columns = [
            {
                title: '角色ID',
                dataIndex: 'id'
            },
            {
                title: '角色名称',
                dataIndex: 'role_name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: Utils.formatDate
            },
            {
                title: '使用状态',
                dataIndex: 'status',
                render(status) {
                    return status === 1 ? '启用' : '停用'
                }
            },
            {
                title: '授权时间',
                dataIndex: 'authorize_time',
                render: Utils.formatDate
            },
            {
                title: '授权人',
                dataIndex: 'authorize_user_name'
            },
        ];
        
        const selectedRowKeys = this.state.selectedRowKeys;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys
        }

        return (
            <div>
                <Card>
                    <Button type="primary" style={{marginRight: 10}} onClick={this.handleRole}>创建角色</Button>
                    <Button type="primary" style={{marginRight: 10}} onClick={this.handlePermission}>设置权限</Button>
                    <Button type="primary" style={{marginRight: 10}} onClick={this.handleUserAuth}>用户授权</Button>
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
                    title="角色创建"
                    visible={this.state.isRoleVisible}
                    onOk={this.handleRoleSubmit}
                    onCancel={() => {
                        this.roleForm.props.form.resetFields();
                        this.setState({
                            isRoleVisible: false
                        })
                    }}
                >
                    <RoleForm wrappedComponentRef={(inst) => this.roleForm = inst}/>     
                </Modal>
                <Modal
                    title="权限设置"
                    visible={this.state.isPremVisible}
                    onOk={this.handlePremEditSubmit}
                    width={600}
                    onCancel={() => {
                        this.setState({
                            isPremVisible: false
                        })
                    }}
                >
                    <PremEditForm 
                        roleInfo={this.state.roleInfo} 
                        menuInfo={this.state.menuInfo} 
                        wrappedComponentRef={(inst) => this.PremEditForm = inst}
                        patchMenuInfo={(checkedKeys)=>{
                            this.setState({
                                menuInfo: checkedKeys
                            });
                        }}
                    />     
                </Modal>
            </div>
        );
    }
}

// 角色创建
class RoleForm extends React.Component{
    
    render() {

        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        }
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                {
                    getFieldDecorator('role_name',{
                        initialValue: ''
                    })(
                        <Input type="text" placeholder="请输入角色名称"/>
                    )
                }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                {
                    getFieldDecorator('status',{
                        initialValue: 1
                    })(
                        <Select>
                            <Option value={1}>开启</Option>
                            <Option value={0}>关闭</Option>
                        </Select>
                    )
                }
                </FormItem>
            </Form>
        )
    }
}
RoleForm = Form.create({})(RoleForm)

// 角色创建
class PremEditForm extends React.Component{

    state = {};

    // 设置选中的节点，通过父组件方法再传递回来
    onCheck = (checkedKeys) => {
        this.props.patchMenuInfo(checkedKeys);
    };

    renderTreeNodes = (data, key='') => {
        return data.map((item) => {
            let _key = key + item.key;
            console.log(_key);
            if (item.children) {
                return (
                <TreeNode title={item.title} key={_key} dataRef={item} className="op-role-tree">
                    {this.renderTreeNodes(item.children, _key)}
                </TreeNode>
                );
            } else if (item.btnList) { // 有平行路由的不去加载
                return (
                    <TreeNode title={item.title} key={_key} dataRef={item} className="op-role-tree">
                        {this.renderBtnTreedNode(item, _key)}
                    </TreeNode>
                );
            }
          return <TreeNode {...item} />;
        });
    }    
    
    renderBtnTreedNode = (menu, key='') => {
        const btnNodeTree = [];

        menu.btnList.forEach((item) => {
            btnNodeTree.push(<TreeNode title={item.title} key={key+'/' + item.key} className="op-role-tree"></TreeNode>)
        })
        return btnNodeTree;
    }


    render() {

        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        }
        let roleInfo = this.props.roleInfo;
        let menuInfo = this.props.menuInfo;
        console.log(menuInfo)
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled maxLength="8" placeholder={roleInfo.role_name}/>
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                {
                    getFieldDecorator('status',{
                        initialValue: 1
                    })(
                        <Select>
                            <Option value={1}>开启</Option>
                            <Option value={0}>关闭</Option>
                        </Select>
                    )
                }
                </FormItem>
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={menuInfo||[]}
                    onCheck={(checkedKeys) => this.onCheck(checkedKeys)}
                >
                    <TreeNode title="平台权限" key="platform_all">
                        {this.renderTreeNodes(menuConfig)}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}
PremEditForm = Form.create({})(PremEditForm)

