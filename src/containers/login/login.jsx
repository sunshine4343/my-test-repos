import React, { Component } from 'react'
import { Form, Input, Button, Icon, message } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { createSaveUserInfoAction } from '../../redux/action_creators/login_actions';
// import axios from 'axios';
import { reqLogin } from '../../api';
import './css/login.less';
import logo from '../../static/imgs/logo.png';
const { Item } = Form;

@connect( state => ({ isLogin: state.userInfo.isLogin }),
{
    saveUserInfo: createSaveUserInfoAction
})
@Form.create()
class Login extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            const { username, password } = values;
            if (!err) {
                let result = await reqLogin(username, password);
                const { status, data, msg } = result;
                if (status === 0) {
                    // console.log('data',data);
                    // 1.服务器返回的user信息和token交由redux
                    this.props.saveUserInfo(data);
                    // 2.跳转到admin
                    this.props.history.replace('/admin');
                } else {
                    message.warning(msg, 1);
                }
                console.log(result);
            } else {
                message.error('表单输入有误，请检查！');
            }
        })
    }

    pwdValidator = (rule, value, callback) => {
        // console.log(value);
        if (!value) {
            callback('密码必须输入');
        } else if (value.length > 12) {
            callback('密码必须小于等于12位');
        } else if (value.length < 4) {
            callback('密码必须大于等于4位');
        } else if (!(/^\w+$/).test(value)) {
            callback('密码必须是字母、数字、下划线');
        } else {
            callback();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isLogin } = this.props;
        if (isLogin) {
            return <Redirect to='/admin/home' />
        }

        return (
            <div className='login'>
                <header>
                    <img src={logo} alt="logo" />
                    <h1>商品管理系统{this.props.test}</h1>
                </header>
                <section>
                    <h1>用户登录</h1>
                    {/* 以后会加上antd的Form组件 */}
                    <Form /* ref={this.formRef}  */ onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('username', {
                                rules: [
                                    { required: true, message: '用户名必须输入!' },
                                    { max: 12, message: '用户名必须小于等于12位' },
                                    { mix: 4, message: '用户名必须大于等于4位' },
                                    { pattern: /^\w+$/, message: "用户名必须是字母、数字、下划线" }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    autoComplete='username'
                                />,
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    { validator: this.pwdValidator },

                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    autoComplete='current-password'
                                />,
                            )}
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default Login
// export default connect(
//     state => ({ isLogin: state.userInfo.isLogin }),
//     {
//         saveUserInfo: createSaveUserInfoAction
//     }
// )(Form.create()(Login));