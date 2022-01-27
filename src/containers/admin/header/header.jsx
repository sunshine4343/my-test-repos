import React, { Component } from 'react';
import { Icon, Button, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import screenfull from 'screenfull';
import { connect } from 'react-redux';
import { createDeleteUserInfoAction } from '../../../redux/action_creators/login_actions'
import { reqWeather } from '../../../api/index';
import './css/header.less';
import dayjs from 'dayjs';
import menuList from '../../../config/menu_config';
const { confirm } = Modal;
@connect(
    state => ({ userInfo: state.userInfo, title: state.title }),
    { deleteUser: createDeleteUserInfoAction }
)
@withRouter
class Header extends Component {
    state = {
        isFull: false,
        date: dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
        weatherInfo: {},
        title: ''
    }
    // 切换全屏按钮的回调
    fullScreen = () => {
        // this.setState({ isFull: !this.state.isFull })
        screenfull.toggle();
    }

    logOut = () => {
        confirm({
            title: '确认退出?',
            content: '若退出需要重新登录',
            cancelText: '取消',
            okText: '确认',
            onOk: () => {
                this.props.deleteUser();
            }
        });
    }

    getTitle = () => {
        // console.log(this.props.location.pathname)
        let { pathname } = this.props.location;
        let pathKey = this.props.location.pathname.split('/').reverse()[0];
        if (pathname.indexOf('product') !== -1) pathKey = 'product';
        let title = '';
        menuList.forEach(item => {
            if (item.children instanceof Array) {
                let temp = item.children.find(child => {
                    return child.key === pathKey;
                });
                if (temp) title = temp.title;
            } else {
                if (pathKey === item.key) title = item.title;
            }
        })
        this.setState({ title })
        // return title;
    }

    getWeather = async () => {
        let weather = await reqWeather();
        this.setState({ weatherInfo: weather });
    }
    componentDidMount() {
        // 给screenfull绑定监听
        screenfull.on('change', () => {
            let isFull = !this.state.isFull
            this.setState({ isFull })
        });
        this.timeID = setInterval(() => {
            this.setState({ date: dayjs().format('YYYY年MM月DD日 HH:mm:ss') });
        }, 1000);
        this.getWeather();
        this.getTitle();
    }

    componentWillUnmount() {
        clearInterval(this.timeID);
    }

    render() {
        let { isFull, weatherInfo } = this.state;
        let { user } = this.props.userInfo;
        return (
            <header className='header'>
                <div className='header-top'>
                    <Button size={'small'} onClick={this.fullScreen}>
                        <Icon type={isFull ? "fullscreen-exit" : "fullscreen"} />
                    </Button>
                    <span className='username'>欢迎，{user.username}</span>
                    <Button type='link' onClick={this.logOut}>退出登录</Button>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        {this.props.title || this.state.title}
                    </div>
                    <div className='header-bottom-right'>
                        {/* 2021-12-29 10:53:20 */}
                        {dayjs().format('YYYY年MM月DD日HH:mm:ss ')}
                        {/* <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气信息" />
                        晴&nbsp;&nbsp;&nbsp;温度：2~5℃ */}
                        <img src={weatherInfo.dayPictureUrl} alt="天气信息" />
                        {weatherInfo.weather}&nbsp;&nbsp;&nbsp;温度：{weatherInfo.temperature}
                    </div>
                </div>
            </header>
        )
    }
}
export default Header;