import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeletePicture } from '../../api';
import { BASE_URL } from '../../config';
// 将图片变成base64编码的
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
class PicturesWall extends React.Component {
    state = {
        previewVisible: false, // 是否展示展览窗
        previewImage: '', // 要预览的图片的URL地址base64编码
        fileList: []
    };

    // 从fileList提取出所有该商品对应的图片名字，构建一个数组，供新增商品使用
    getImgArr = () => {
        let result = [];
        this.state.fileList.forEach(item => {
            result.push(item.name)
        });
        return result;
    }

    setFileList = (imgArr) => {
        let fileList = [];
        imgArr.forEach((item, index) => {
            fileList.push({ uid: -index, name: item, url: `${BASE_URL}/upload/${item}` });
        });
        this.setState({ fileList });
    }
    // 关闭预览窗
    handleCancel = () => this.setState({ previewVisible: false });

    // 展示预览窗
    handlePreview = async file => {
        // 如果图片没有url也没有转换过base64，那么调用如下方法把图片转成base64
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    // 当图片状态发生改变的回调
    handleChange = async ({ file, fileList }) => {
        // 文件上传成功
        if (file.status === 'done') {
            fileList[fileList.length - 1].url = file.response.data.url;
            fileList[fileList.length - 1].name = file.response.data.name;
        }
        if (file.status === 'removed') {
            let result = await reqDeletePicture(file.name);
            const { status, msg } = result;
            if (status === 0) message.success('图片删除成功');
            else message.error(msg);

        }
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action={`${BASE_URL}/manage/img/upload`} // 接收图片服务器的地址
                    method='post'
                    name='image'
                    listType="picture-card" // 照片墙的展示方式
                    fileList={fileList} // 图片列表，一个数组里面包含着多个图片对象
                    onPreview={this.handlePreview}  // 当点击预览按钮的回调
                    onChange={this.handleChange}    // 图片状态改变的回调
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
export default PicturesWall;