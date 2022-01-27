import React, { Component } from 'react';
import { Card, Button, Table, Icon, Modal, Form, Input, Tree, message, } from 'antd';
import { PAGE_SIZE } from '../../config';
import dayjs from 'dayjs';
import { reqRoleList, reqAddRole, reqAuthRole } from '../../api';
import menuList from '../../config/menu_config';
import { connect } from 'react-redux'
const { Item } = Form;
const { TreeNode } = Tree;

@connect(
    state => ({ username: state.userInfo.user.username }),
    {}
)
@Form.create()
class Role extends Component {
    state = {
        isShowAuth: false,
        isShowAdd: false,
        roleList: [],
        autoExpandParent: true,
        checkedKeys: [],
        menuList, _id: ''
    }

    getRoleList = async () => {
        let result = await reqRoleList()
        const { status, data } = result
        if (status === 0) this.setState({ roleList: data })
    }

    componentDidMount() {
        this.getRoleList();
    }

    handleOk = () => {

        this.props.form.validateFields(async (err, values) => {
            if (err) return

            let result = await reqAddRole(values);
            const { status, msg } = result;
            if (status === 0) {
                message.success('新增角色成功');
                this.getRoleList();
                this.setState({ isShowAdd: false });
            } else {
                message.error(msg);
            }
        })
    }

    handleCancel = () => {
        this.setState({ isShowAdd: false });
        this.props.form.resetFields();
    }


    handleAuthOK = async () => {
        this.setState({ isShowAuth: false });
        const { username } = this.props;
        const { _id, checkedKeys } = this.state;
        let result = await reqAuthRole({ _id, menus: checkedKeys, auth_name: username });
        const { status, msg } = result;
        if (status === 0) {
            message.success('授权成功', 1);
            this.setState({ isShowAuth: false });
            this.getRoleList();
        } else {
            message.error(msg, 1);
        }
    }

    handleAuthCancel = () => {
        this.setState({ isShowAuth: false });
    }

    onCheck = checkedKeys => { this.setState({ checkedKeys }); };

    showAuth = (id) => {
        const { roleList } = this.state;
        let result = roleList.find((item) => {
            return item._id === id;
        });
        if (result) this.setState({ checkedKeys: result.menus });
        this.setState({ isShowAuth: true, _id: id });
    }

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });


    showAdd = () => {
        this.props.form.resetFields();
        this.setState({ isShowAdd: true });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const dataSource = this.state.roleList;
        const columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: (time) => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                key: 'auth_time',
                render: (time) => time ? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss') : ''
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name',
            }, {
                title: '操作',
                key: 'option',
                align: 'center',
                render: (item) => { return <div><Button type='link' onClick={() => { this.showAuth(item._id) }}>设置权限</Button></div> }
            },
        ];

        // treeData是树形菜单的原数据
        const treeData = this.state.menuList;
        let { isShowAdd } = this.state;

        return (<div>
            <Card
                title={
                    <div>
                        <Button type='primary' onClick={() => { this.showAdd() }} ><Icon type='plus' />新增角色</Button>
                    </div>
                } >
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    rowKey='_id'
                    pagination={{
                        pageSize: PAGE_SIZE,
                        // total,
                        // current,
                        // onChange: this.getProductList

                    }}
                    loading={false}
                />
            </Card>
            <Modal
                title={'添加角色'}
                visible={isShowAdd}
                okText='确定'
                cancelText='取消'
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form onSubmit={() => {
                    this.handleSubmit();
                    console.log('asdasd');
                }} className="login-form">

                    <Item>
                        {getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '角色名称必须输入!' },
                            ],
                        })(
                            <Input
                                placeholder="请输入角色名称"
                            />,
                        )}
                    </Item>
                </Form>
            </Modal>
            <Modal
                title="设置权限"
                visible={this.state.isShowAuth}
                onOk={this.handleAuthOK}
                onCancel={this.handleAuthCancel}
                okText="确认"
                cancelText="取消"
            >
                <Tree
                    checkable   // 允许选择
                    onExpand={this.onExpand}    // 收缩或展开菜单的回调
                    // expandedKeys={this.state.expandedKeys}  // 配置默认展开哪几项
                    autoExpandParent={this.state.autoExpandParent}  // 是否自动展开父节点 
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    defaultExpandAll
                >
                    <TreeNode title='平台功能' key='top'>
                        {this.renderTreeNodes(treeData)}
                    </TreeNode>
                </Tree>
            </Modal>
        </div>)
    }
}

export default Role;