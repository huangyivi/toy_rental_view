import React, { Component, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import './index.css'
import { Row, Col, Menu, Button, Modal, Input, message } from 'antd'
import router from '../../utils/router'
import { getDate } from '../../utils/utils'
import { useNavigate } from 'react-router'
import { UserAPi } from '../../utils/api'

export default function Home () {
  const [current, setCurrent] = useState('toys')
  const [isMyVisible, setVisible] = useState(false)
  const [old_pwd, setOld] = useState('')
  const [new_pwd, setNew] = useState('')
  const user = JSON.parse(sessionStorage.getItem('user'))
  const handleClick = function (e) {
    setCurrent(e.key)
  }
  const openMy = function () {
    setVisible(true)
  }
  const closeMy = function () {
    setVisible(false)
  }
  const navigate = useNavigate()

  const exit = function () {
    let res = window.confirm('确定要退出登录吗？')
    if (res) {
      navigate('/')
    }
  }
  const onText = function (e) {
    let key = e.target.dataset.key
    if (key === 'new') {
      setNew(e.target.value)
    } else {
      setOld(e.target.value)
    }
  }
  const changePwd = function () {
    if (old_pwd == '' || new_pwd == '') {
      message.warning('请输入相关信息')
      return
    }
    let data = new URLSearchParams()
    data.append('username', user.s_username)
    data.append('old_pwd', old_pwd)
    data.append('new_pwd', new_pwd)
    UserAPi.changePwd(data).then(res => {
      let data = res.data
      if (data.success) {
        message.success(data.message)
        alert('需要重新登录')
        navigate('/')
      } else {
        message.error(data.message)
      }
    })
  }
  return (
    <>
      <Row className='header '>
        <Col span={3} className='header-logo grid-center'>
          玩具出租管理
        </Col>
        <Col span={13}>
          <Menu
            theme='dark'
            mode='horizontal'
            onClick={handleClick}
            selectedKeys={[current]}
            className='header-menu'
          >
            {router.map(item => (
              <Menu.Item key={item.key}>
                <Link to={item.path}>{item.name}</Link>
              </Menu.Item>
            ))}
            {user.s_id === 12 ? (
              <Menu.Item key='assistant'>
                <Link to="assistant">职员管理</Link>
              </Menu.Item>
            ) : null}
          </Menu>
        </Col>
        <Col span={3} className='user grid-center'>
          <div>当前日期：{getDate()}</div>
        </Col>
        <Col span={2} className='user grid-center'>
          <div>管理员：{user.s_name}</div>
        </Col>
        <Col span={1} className='user grid-center'>
          <Button onClick={openMy} type='primary' size='small'>
            修改信息
          </Button>
        </Col>
        <Col span={2} className='user grid-center'>
          <Button onClick={exit} danger type='primary' size='small'>
            退出登录
          </Button>
        </Col>
      </Row>
      <Row className='content'>
        <Col span={24} className='grid-center'>
          <Outlet />
        </Col>
      </Row>
      <Row className='footer grid-center'>
        <Col span={24} className='footer-text'>
          信安1班 黄奕威 3119005415
        </Col>
      </Row>

      {/* 修改信息面板 */}
      <Modal
        title='我的信息'
        visible={isMyVisible}
        okText='修改密码'
        cancelText='取消'
        onOk={changePwd}
        onCancel={closeMy}
      >
        <div>
          <div>原密码</div>
          <Input data-key='old' value={old_pwd} onChange={onText} />
        </div>
        <div>
          <div>新密码</div>
          <Input data-key='new' value={new_pwd} onChange={onText} />
        </div>
      </Modal>
    </>
  )
}
