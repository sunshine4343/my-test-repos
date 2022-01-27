import React, { Component } from 'react';
import { Card, Button, Icon, Table, message, Modal, Form, Input } from 'antd';
import { connect } from 'react-redux';
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from '../../api';
import { createSaveCategoryAction } from '../../redux/action_creators/category_action';
import { PAGE_SIZE } from '../../config/index';
const { Item } = Form;
@connect(
    state => ({}),
    { saveCategory: createSaveCategoryAction }
)
@Form.create()
class Category extends Component {

    state = {
        categoryList: [],   // 商品分类列表
        visible: false,//控制弹窗的展示或隐藏
        operType: '',//操作类型
        isLoading: true,
        modalCurrentValue: '',
        modalCurrentId: ''
    }

    componentDidMount() {
        this.getCategoryList();
    }

    // 获取商品分类
    getCategoryList = async () => {
        let result = await reqCategoryList();
        this.setState({ isLoading: false });
        const { status, data, msg } = result;
        if (status === 0) {
            this.setState({ categoryList: data.reverse() });
            this.props.saveCategory(data);
        } else {
            message.error(msg, 1);
        }
    }

    showAdd = () => {
        this.setState({
            operType: 'add',
            visible: true,
            modalCurrentValue: '',//弹窗回显的值
            modalCurrentId: '',//当前操作的id
        });
    };

    showUpdate = (item) => {
        // console.log(item);
        const { name, _id } = item;
        this.setState({
            operType: 'update',
            visible: true,
            modalCurrentValue: name,
            modalCurrentId: _id
        });
    }

    toAdd = async (values) => {
        let result = await reqAddCategory(values);

        const { status, data, msg } = result;
        if (status === 0) {
            message.success('新增商品分类成功');
            let categoryList = [...this.state.categoryList];
            categoryList.unshift(data);
            this.setState({ categoryList, visible: false });
            this.props.form.resetFields();
        }
        if (status === 1)
            message.error(msg, 1);
    }

    toUpdate = async (categoryObj) => {
        console.log(categoryObj.categoryId, categoryObj.categoryName);
        let result = await reqUpdateCategory(categoryObj);
        const { status, msg } = result;
        if (status === 0) {
            message.success('更新分类名称成功', 1);
            this.getCategoryList();
            this.setState({
                visible: false
            });
            this.props.form.resetFields();
        } else {
            message.error(msg, 1);
        }

    }

    handleOk = () => {
        const { operType } = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                message.error('表单输入有误，请检查！', 1);
                return
            }
            if (operType === 'add') {
                this.toAdd(values)

            }
            if (operType === 'update') {
                const categoryId = this.state.modalCurrentId;
                const categoryName = values.categoryName;
                const categoryObj = { categoryId, categoryName }
                this.toUpdate(categoryObj);
            }
        })
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.props.form.resetFields()
    };

    render() {

        const dataSource = this.state.categoryList;
        const { operType, visible } = this.state;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '分类名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                // dataIndex: 'age',
                key: 'age',
                render: (item) => {
                    return (
                        <Button type='link' onClick={() => { this.showUpdate(item) }}>修改分类</Button>
                    )
                },
                width: '25%', align: 'center'
            }
        ];
        return (
            <div>
                <Card
                    extra={<Button type='primary' onClick={() => { this.showAdd() }}><Icon type='plus-circle' />添加</Button>}
                >
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowKey='_id'
                        pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }}
                        loading={this.state.isLoading}
                        bordered
                    />
                </Card>
                <Modal
                    title={operType === 'add' ? '新增分类' : '修改分类'}
                    visible={visible}
                    okText='确定'
                    cancelText='取消'
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form /* ref={this.formRef}  */ onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('categoryName', {
                                initialValue: this.state.modalCurrentValue,
                                rules: [
                                    { required: true, message: '分类名必须输入!' },
                                ],
                            })(
                                <Input
                                    placeholder="请输入分类名"
                                />,
                            )}
                        </Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Category
