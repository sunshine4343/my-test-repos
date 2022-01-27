import axios from 'axios';
import {message} from 'antd';
import NProgress from 'nprogress';
import qs from 'querystring';
import store from '../redux/store';
import {createDeleteUserInfoAction} from '../redux/action_creators/login_actions';
import 'nprogress/nprogress.css'

const instance = axios.create({
    timeout: 4000 // 配置超时时间
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        NProgress.start();
        // 从redux中获取之前所保存的token
        const {token} = store.getState().userInfo;
        // 向请求头中添加token，用于校验身份
        if (token) {
            config.headers.Authorization = 'atguigu_' + token;
        }
        // 从配置对象中获取method和data
        const {method,data} = config;
        if (method.toLowerCase() === 'post') {
            if (data instanceof Object) {
                config.data = qs.stringify(data);
            }
        }
        // console.log(config.data);
        return config;
    });

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        NProgress.done();
        // 请求若成功
        return response.data;
    }, (error) => {
        NProgress.done();
        if(error.response.status===400){
            message.error('身份校验失败，请重新登录', 1);
            store.dispatch(createDeleteUserInfoAction())
        }else{
            message.error(error.message, 1);
        }
        // 请求若失败
        return new Promise(() => {});
    });

export default instance;