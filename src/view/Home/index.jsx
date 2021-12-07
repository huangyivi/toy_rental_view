import React, { Component } from 'react'
import { Routes, Link, Route } from 'react-router-dom'
import './index.css'
import { Row, Col, Menu } from 'antd'
import router from '../../utils/router'

export default class Home extends Component {
  state = {
    current: 'toys'
  }
  handleClick (e) {
    this.setState({
      current: e.key
    })
  }
  render () {
    const { current } = this.state
    return (
      <>
        <Row className='header '>
          <Col span={3} className='header-logo grid-center'>
            玩具出租管理
          </Col>
          <Col span={19}>
            <Menu
              theme='dark'
              mode='horizontal'
              onClick={this.handleClick.bind(this)}
              selectedKeys={[current]}
              className='header-menu'
            >
              {router.map(item => (
                <Menu.Item key={item.key}>
                  <Link to={item.path}>{item.name}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </Col>
          <Col span={2} className='user grid-center'>
            我的信息
          </Col>
        </Row>
        <Row className='content'>
          <Col span={24} className='grid-center'>
            <Routes>
              {router.map((item, key) => (
                <Route
                  path={item.path}
                  element={item.component}
                  exact={item.exact ? true : null}
                  key={item.key}
                ></Route>
              ))}
            </Routes>
          </Col>
        </Row>
        <Row className='footer grid-center'>
          <Col span={24} className='footer-text'>
            信安1班 黄奕威 3119005415
          </Col>
        </Row>
      </>
    )
  }
}
