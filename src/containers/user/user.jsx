import React, { Component } from 'react';
import { Form, Card, Input, Icon, Select, Button, Table, Modal, message } from 'antd';
import { reqUserList, reqAddUser } from '../../api/index';
import { PAGE_SIZE } from '../../config';
import dayjs from 'dayjs';
const { Item } = Form;
const { Option } = Select;

@Form.create()
class User extends Component {

    state = {
        isShowAdd: false, // 是否展示新增弹窗
        userList: [],
        roleList: []
    };
    getUserList = async () => {
        let result = await reqUserList();
        const { status, data, msg } = result;
        if (status === 0) {
            this.setState({ userList: data.users.reverse(), roleList: data.roles })
        } else {
            message.error(msg);
        }
    }

    componentDidMount() {
        this.getUserList();
    }
    // --------------Modal-start--------------
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            let result = await reqAddUser(values);
            const { status, data, msg } = result;
            console.log(data);
            if (status === 0) {
                message.success('添加用户成功！', 1);
                let userList = [...this.state.userList];
                userList.unshift(data);
                this.setState({ userList, isShowAdd: false });
            } else {
                message.error(msg, 1);
            }
        });
    };

    handleCancel = e => {
        this.setState({ isShowAdd: false })
    };
    //----------------Modal-end--------------------



    render() {

        // form-data
        const { getFieldDecorator } = this.props.form;

        // table-data
        const data = this.state.userList;
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone'
            }, {
                title: '注册时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: time => dayjs(time).format('YYYY年 MM月DD日 HH::mm:ss')
            }, {
                title: '所属角色',
                dataIndex: 'role_id',
                key: 'role_id',
                render: id => {
                    let result = this.state.roleList.find(item => {
                        return item._id === id;
                    });
                    if (result) return result.name
                }
            }, {
                title: '操作',
                dataIndex: 'option',
                render: () => {
                    return <div>
                        <Button type='link'>修改</Button>
                        <Button type='link'>删除</Button>
                    </div>
                }
            },
        ];

        return (
            <Card
                title={<Button type='primary' onClick={() => { this.setState({ isShowAdd: true }); this.props.form.resetFields(); }}>
                    <Icon type='plus' />创建用户</Button>}
                bordered={false}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowKey='_id'
                />
                {/* 新增用户提示框 */}
                <Modal
                    title="创建用户"
                    visible={this.state.isShowAdd}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText='确定'
                    cancelText='取消'
                >
                    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                        <Item label="用户名">
                            {getFieldDecorator('username', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '用户名必须输入！',
                                    },
                                ],
                            })(<Input placeholder='请输入用户名' />)}
                        </Item>
                        <Item label="密码" >
                            {getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '密码必须输入！',
                                    }
                                ]
                            })(<Input placeholder='请输入密码' />)}
                        </Item>
                        <Item label="手机号" >
                            {getFieldDecorator('phone', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '手机号必须输入!',
                                    }
                                ]
                            })(<Input placeholder='请输入手机号' />)}
                        </Item>
                        <Item label="邮箱">
                            {getFieldDecorator('email', {
                                initialValue: '',
                                rules: [{ required: true, message: '邮箱必须输入!' }],
                            })(<Input placeholder='请输入邮箱' />)}
                        </Item>
                        <Item label="角色" >
                            {getFieldDecorator('role_id', {
                                initialValue: '',
                                rules: [{ required: true, message: '请选择角色', },],
                            })(
                                <Select>
                                    <Option value=''>请选择一个角色</Option>
                                    {
                                        this.state.roleList.map(item => {
                                            return <Option key={item._id} value={item._id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            )

                            }

                        </Item>
                    </Form>
                </Modal>
            </Card>
        )
    }
}
export default User;