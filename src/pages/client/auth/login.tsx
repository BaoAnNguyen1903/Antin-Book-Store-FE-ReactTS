import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, App } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss'
import { loginAPI } from '@/services/api';

type FieldType = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false); // trạng thái loading
    const { message, notification } = App.useApp();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const {username, password} = values;
        setIsSubmit(true);
        const res = await loginAPI(username, password);
        setIsSubmit(false);
        if (res?.data) {
            localStorage.setItem("access_token", res.data.access_token);
            message.success("Đăng nhập thành công");
            navigate("/")
        } else {
            //error
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                // sẽ có trường hợp err sẽ trả ra arr nên nếu có thì trả ra message đầu tiên hoặc không thì trả ra res.message
                duration: 5,
            })
        }
        setIsSubmit(false);
    };

    return (
        <div className='login-page'>
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2 className='text text-large'>Đăng Ký Tài Khoản</h2>
                            <Divider/>
                        </div>
                        <Form
                            name='form-login'
                            onFinish={onFinish}
                            autoComplete='off'
                        >
                            <Form.Item<FieldType>
                                labelCol = {{ span: 24}} // whole column
                                label='Email'
                                name='username'
                                rules={[
                                    { required: true, message: 'Email không được để trống!'},
                                    { type: 'email', message: "Email không đúng định dạng!"}
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol = {{ span: 24}} // whole column
                                label='Mật khẩu'
                                name='password'
                                rules={[
                                    { required: true, message: 'Mật khẩu không được để trống!'}
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type='primary' htmlType='submit' loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <Divider>Or</Divider>
                            <p className='text text-normal' style={{textAlign: 'center'}}>
                                Chưa có tài khoản ? <Link to={"/register"}>Đăng Ký</Link>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;