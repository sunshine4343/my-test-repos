import React, { Component } from 'react';
import { Button, Card, Table, Icon, Input, Select, message } from 'antd';
import { PAGE_SIZE } from '../../config';
import { reqProductList, reqUpdateProdStatus, reqSearchProduct } from '../../api/index';
import { connect } from 'react-redux';
import { createSaveProductAction } from '../../redux/action_creators/product_action';
const { Option } = Select;

// @Form.create()
@connect(
    state => ({}),
    {
        saveProductList: createSaveProductAction
    }
)
class Product extends Component {
    state = {
        productList: [], // 商品列表数据
        current: 1, // 当前商品页数
        total: '',
        keyWord: '',
        searchType: 'productName',// 搜索类型
        isLoading: true,
    }

    componentDidMount() {
        this.getProductList();
    }

    getProductList = async (number = 1) => {
        let result;
        if (this.isSearch) {
            const { searchType, keyWord } = this.state;
            result = await reqSearchProduct(number, PAGE_SIZE, searchType, keyWord);
        } else {

            result = await reqProductList(number, PAGE_SIZE);
        }

        this.setState({ isLoading: false });

        const { status, data } = result;
        const { list, pageNum, total } = data;
        if (status === 0) {
            this.setState({ productList: list, total, current: pageNum });
            this.props.saveProductList(list);
        } else {
            message.error('获取商品列表失败');
        }
    }


    updateProdStatus = async ({ _id, status }) => {
        let productList = [...this.state.productList];
        if (status === 1) status = 2;
        else status = 1;
        let result = await reqUpdateProdStatus(_id, status);
        if (result.status === 0) {
            message.success('更新商品状态成功');
            productList = productList.map(item => {
                if (item._id === _id) {
                    item.status = status
                }
                return item
            });
            this.setState({ productList });
        }
        else message.error('更新商品状态失败')
    }

    search = async () => {
        this.isSearch = true;
        this.getProductList()

    }
    render() {
        const dataSource = this.state.productList;

        const columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                width: '18%',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
                width: '10%',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                // dataIndex: 'status',
                key: 'status',
                align: 'center',
                width: '10%',
                render: (item) => (
                    <div>
                        <Button
                            type={item.status === 1 ? 'danger' : 'primary'}
                            onClick={() => { this.updateProdStatus(item) }}
                        >{item.status === 1 ? '下架' : '上架'}</Button><br />
                        <span>{item.status === 1 ? '在售' : '已停售'}</span> </div>)
            }, {
                title: '操作',
                // dataIndex: 'opera',
                key: 'opera',
                align: 'center',
                width: '10%',
                render: (item) => (
                    <div>
                        <Button type='link' onClick={() => { this.props.history.push(`/admin/prod_about/product/detail/${item._id}`) }}>详情</Button><br />
                        <Button type='link' onClick={() => { this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`) }}>修改</Button>
                    </div>)
            },
        ];

        const { total, current } = this.state;
        return (
            <div>
                <Card
                    title={
                        <div>
                            <Select defaultValue="productName" onChange={(value) => { this.setState({ searchType: value }) }} >
                                <Option value="productName">按名称搜索</Option>
                                <Option value="productDesc">按描述搜索</Option>
                            </Select>
                            <Input
                                allowClear
                                style={{ margin: '0px 10px', width: '20%' }}
                                placeholder='关键字'
                                onChange={(event) => { this.setState({ keyWord: event.target.value }) }}
                            />
                            <Button type='primary' onClick={this.search}><Icon type='search' />搜索</Button>
                        </div>
                    }
                    extra={<Button type='primary' onClick={() => { this.props.history.push('/admin/prod_about/product/add_update') }}><Icon type='plus-circle' />添加商品</Button>} >
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        bordered
                        rowKey='_id'
                        pagination={{
                            pageSize: PAGE_SIZE,
                            total,
                            current,
                            onChange: this.getProductList

                        }}
                        loading={this.state.isLoading}
                    />;
                </Card>
            </div>
        )
    }
}
export default Product