import myAxios from './myAxios';
import jsonp from 'jsonp';
import {message} from 'antd';
// 引入项目的基本路径
import {BASE_URL,WEATHRE_AK,CITY} from '../config';

// 登录请求
// export const reqLogin = (username, password) => myAxios.post(BASE_URL + '/login', qs.stringify({username,password}))
export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, {
    username,
    password
});

// 获取商品列表请求
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`);

// 获取天气信息(接口失效了)
export const reqWeather = () => {
    //axios.get('http://api.map.baidu.com/telematics/v3/weather?location='+CITY+'&output=json&ak='+WEATHRE_AK)
    return new Promise((resolve, reject) => {
        jsonp('http://api.map.baidu.com/telematics/v3/weather?location=' + CITY + '&output=json&ak=' + WEATHRE_AK,
            (err, data) => {
                if (err) {
                    message.error('请求天气接口失败，请联系管理员');
                    return new Promise(() => {});
                } else {
                    const {
                        dayPictureUrl,
                        temperature,
                        weather
                    } = data.results[0].weather_data[0];
                    // console.log(data.results[0].weather_data[0].dayPictureUrl);
                    // console.log(data.results[0].weather_data[0].temperature);
                    // console.log(data.results[0].weather_data[0].weather);
                    let weatherObj = {
                        dayPictureUrl,
                        temperature,
                        weather
                    };
                    resolve(weatherObj);
                }
            });
    })
}

// 新增商品分类
export const reqAddCategory = ({
    categoryName
}) => myAxios.post(`${BASE_URL}/manage/category/add`, {
    categoryName
});

export const reqUpdateCategory = ({categoryId,categoryName})=>myAxios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName});

export const reqProductList = (pageNum,pageSize)=>myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum,pageSize}});

export const reqUpdateProdStatus =  (productId,status)=>myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status});

export const reqSearchProduct = (pageNum,pageSize,searchType,keyWord)=>myAxios.get(`${BASE_URL}/manage/product/search`,{params:{pageNum,pageSize,[searchType]:keyWord}});

// 获取商品详细信息
export const reqProduById = (productId)=>myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}});

// export const reqCategoryInfo = (categoryId)=>myAxios.get(`${BASE_URL}/manage/category/info`,{params:{categoryId}});
// 请求删除图片(根据图片唯一名删除)
export const reqDeletePicture = (name)=>myAxios.post(`${BASE_URL}/manage/img/delete`,{name});

export const reqAddProduct = (productObj)=>myAxios.post(`${BASE_URL}/manage/product/add`,{...productObj});

export const reqUpdateProduct = (productObj)=>myAxios.post(`${BASE_URL}/manage/product/update`,{...productObj});

// 请求所有角色列表
export const reqRoleList = ()=>myAxios.get(`${BASE_URL}/manage/role/list`);

export const reqAddRole = ({roleName})=>myAxios.post(`${BASE_URL}/manage/role/add`,{roleName});

export const reqAuthRole = (roleObj)=>myAxios.post(`${BASE_URL}/manage/role/update`,{...roleObj,auth_time:Date.now()});

export const reqUserList = ()=>myAxios.get(`${BASE_URL}/manage/user/list`);

export const reqAddUser = (userObj)=>myAxios.post(`${BASE_URL}/manage/user/add`,{...userObj});