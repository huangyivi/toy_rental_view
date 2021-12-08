import React, { useState } from 'react'

import './index.css'
import { Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { UserAPi } from '../../utils/api';
import { useNavigate } from 'react-router';

function Login () {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();
  const onChange = (e) => {
    let type = e.target.dataset.type;
    if(type === 'username') {
        setUsername(e.target.value);
    }else {
        setPassword(e.target.value);
    }
  }
  const onFinish = () => {
    if(username === '' || password === '') {
        message.warning('请填写完整信息');
        return;
    }
    let data = new URLSearchParams();
    data.append('username',username);
    data.append('password',password);
    UserAPi.login(data).then(res => {
        let data = res.data;
        if(data.success) {
            message.success(data.message);
            sessionStorage.setItem('user',JSON.stringify(data.data));
            navigate('/home/toy')
        }else {
            message.error(data.message);
        }
    })
  }
  return (
    <div className='login-container grid-center'>
      <div className='login-space grid-center'>
        <div>
          <div>
            <h1>管理员登录</h1>
          </div>
          <div>
            <Input data-type="username" onChange={onChange} placeholder='用户名' value={username} addonBefore={<UserOutlined />} />
          </div>
          <div>
            <Input.Password data-type="password" onChange={onChange} placeholder='密码' value={password} addonBefore={<LockOutlined />} />
          </div>
          <div>
            <Button type='primary' onClick={onFinish}>登录</Button>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Login