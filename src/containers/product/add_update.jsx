import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Card, Button, Icon, Form, Input, Select, message } from 'antd'
import { reqCategoryList, reqAddProduct, reqProduById, reqUpdateProduct } from '../../api'
import PicturesWall from './picture_wall';
import RichTextEditor from './rich_text_editor';
const { Item } = Form;
const { Option } = Select;

@connect(
    state => ({ categoryList: state.categoryList, productList: state.productList }),
    {

    }
)
@Form.create()
class AddUpdate extends Component {
    state = {
        categoryList: [],
        operaType: 'add',
        categoryId: '',
        name: '',
        desc: '',
        price: '',
        detail: '',
        imgs: [],
        _id: ''
    }

    getProductList = async (id) => {
        let result = await reqProduById(id);
        const { status, data } = result;
        if (status === 0) {
            this.setState({ ...data });
            this.refs.pictureWall.setFileList(data.imgs);
            this.refs.richTextEditor.setRichText(data.detail);
        }
    }

    componentDidMount() {
        // this.pictureWall = React.createRef();
        // this.richTextEditor = React.createRef();

        const { categoryList, productList } = this.props;
        const { id } = this.props.match.params;
        if (categoryList.length)
            this.setState({ categoryList });
        else this.getCategoryList();
        if (id) {
            this.setState({ operaType: 'update' });
            if (productList.length) {
                let result = productList.find(item => {
                    return item._id === id;
                });
                if (result) {
                    this.setState({ ...result });
                    this.refs.pictureWall.setFileList(result.imgs);
                    this.refs.richTextEditor.setRichText(result.detail);
                }
            }
            else this.getProductList(id);
        }
        else this.setState({ operaType: 'add' });
    }
    getCategoryList = async () => {
        let result = await reqCategoryList();
        const { status, msg, data } = result;
        if (status === 0) {
            this.setState({ categoryList: data });
        } else {
            message.error(msg);
        }
    }
    handleSubmit = (event) => {
        event.preventDefault();
        let imgs = this.refs.pictureWall.getImgArr();
        let detail = this.refs.richTextEditor.getRichText();
        const { operaType, _id } = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return
            }

            let result;

            if (operaType === 'add') {
                result = await reqAddProduct({ ...values, imgs, detail });
            } else {
                result = await reqUpdateProduct({ ...values, imgs, detail, _id });
            }

            const { status, msg } = result;
            if (status === 0) {
                message.success('????????????');
                this.props.history.replace('/admin/prod_about/product');
            }
            else message.error(msg);

        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { operaType } = this.state;
        return (
            <Card
                title={
                    <div>
                        <Button type="link" onClick={this.props.history.goBack}>
                            <Icon type="arrow-left" />
                            <span>??????</span>
                        </Button>
                        <span>{operaType === 'add' ? '????????????' : '????????????'}</span>
                    </div>}
            >
                <Form
                    onSubmit={this.handleSubmit}
                    labelCol={{ md: 2 }}
                    wrapperCol={{ md: 7 }}
                >
                    <Item label="????????????">
                        {
                            getFieldDecorator('name', {
                                initialValue: this.state.name || '',
                                rules: [{ required: true, message: '?????????????????????' }],
                            })(
                                <Input
                                    placeholder="????????????"
                                />
                            )
                        }
                    </Item>
                    <Item label="????????????">
                        {getFieldDecorator('desc', {
                            initialValue: this.state.desc || '',
                            rules: [
                                { required: true, message: '?????????????????????' },
                            ],
                        })(
                            <Input
                                placeholder="????????????"
                            />
                        )}
                    </Item>
                    <Item label="????????????">
                        {getFieldDecorator('price', {
                            initialValue: this.state.price || '',
                            rules: [
                                { required: true, message: '?????????????????????' },
                            ],
                        })(
                            <Input
                                placeholder="????????????"
                                addonAfter="???"
                                prefix="???"
                                type="number"
                            />
                        )}
                    </Item>
                    <Item label="????????????">
                        {getFieldDecorator('categoryId', {
                            initialValue: this.state.categoryId || '',
                            rules: [
                                { required: true, message: '?????????????????????' },
                            ],
                        })(
                            <Select>
                                <Option value="">???????????????</Option>
                                {
                                    this.state.categoryList.map(item => {
                                        return <Option key={item._id} value={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </Item>
                    <Item label="????????????" wrapperCol={{ md: 12 }}>
                        <PicturesWall ref='pictureWall' />
                    </Item>
                    <Item label="????????????" wrapperCol={{ md: 16 }}>
                        <RichTextEditor
                            ref='richTextEditor'
                        />
                    </Item>
                    <Button type="primary" htmlType="submit">??????</Button>
                </Form>
            </Card>
        )
    }
}

export default AddUpdate
