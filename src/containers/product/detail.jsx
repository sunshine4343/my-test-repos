import React, { Component } from 'react';
import { Button, Card, Icon, List, message } from 'antd';
import { connect } from 'react-redux';
import { reqProduById, reqCategoryList } from '../../api/index';
import { BASE_URL } from '../../config';
import './detail.less';
const { Item } = List;

@connect(
    state => ({
        productList: state.productList,
        categoryList: state.categoryList
    }),
    {}
)
class Detail extends Component {
    state = {
        name: '',
        desc: '',
        imgs: [],
        price: '',
        categoryId: '',
        categoryName: '',
        detail: '',
        isLoading: true
    }

    getCategoryList = async () => {
        let result = await reqCategoryList();
        const { status, data, msg } = result;
        if (status === 0) {
            let result = data.find((item) => {
                return item._id === this.categoryId
            });
            console.log(result);
            if (result) this.setState({ categoryName: result.name, isLoading: false })
        }
        else message.error(msg)
    }


    getProdInfo = async (id) => {
        let result = await reqProduById(id);
        const { status, data, msg } = result;
        if (status === 0) {
            // const { name, desc, imgs, price, categoryId, detail } = data;
            // this.setState({ name, desc, imgs, price, categoryId, detail });
            this.categoryId = data.categoryId;
            this.setState({ ...data });
        } else message.error(msg);
    }

    componentDidMount() {
        //console.log(this.props.categoryList);
        const reduxProductList = this.props.productList;
        const reduxCateList = this.props.categoryList;
        const { id } = this.props.match.params;
        if (reduxProductList.length) {
            let result = reduxProductList.find(item => item._id === id);
            if (result) {
                // const { name, desc, imgs, price, categoryId, detail } = result;
                // this.setState({ name, desc, imgs, price, categoryId, detail });
                this.categortId = result.categoryId;
                this.setState({ ...result });
                // console.log(this.categortId);
            }
        } else { this.getProdInfo(id); }
        if (reduxCateList.length) {
            let result = reduxCateList.find(item => item._id === this.categortId);
            this.setState({ categoryName: result.name, isLoading: false });
        }
        else { this.getCategoryList(); }

    }

    render() {
        return (
            <Card
                title={
                    <div className='left-top'>
                        <Button type='link' size='small' onClick={() => { this.props.history.goBack() }}>
                            <Icon type='arrow-left' style={{ fontSize: '20px' }} />
                        </Button>
                        <span>商品详情</span>
                    </div>
                }
            >
                <List
                    loading={this.state.isLoading}>
                    <Item style={{ justifyContent: 'flex-start' }}>
                        <span className='prod-title'>商品名称：</span>
                        <span>{this.state.name}</span>
                    </Item>
                    <Item style={{ justifyContent: 'flex-start' }}>
                        <span className='prod-title'>商品描述：</span>
                        <span>{this.state.desc}</span>
                    </Item>
                    <Item style={{ justifyContent: 'flex-start' }}>
                        <span className='prod-title'>商品价格：</span>
                        <span>{this.state.price}</span>
                    </Item>
                    <Item style={{ justifyContent: 'flex-start' }}>
                        <span className='prod-title'>所属分类：</span>
                        <span>{this.state.categoryName}</span>
                    </Item>
                    <Item style={{ justifyContent: 'flex-start' }}>
                        <span className='prod-title'>商品图片：</span>
                        {
                            this.state.imgs.map((item, index) => { return <img key={index} style={{ width: '200px' }} src={`${BASE_URL}/upload/` + item} alt='商品图片' /> })
                        }
                    </Item>
                    <Item style={{ justifyContent: 'flex-start' }}>
                        <span className='prod-title'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html: this.state.detail }}></span>
                    </Item>
                </List>

            </Card>
        )
    }
}

export default Detail