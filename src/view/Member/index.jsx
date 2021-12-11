import {
  Col,
  message,
  Row,
  Space,
  Modal,
  DatePicker,
  Select,
  Input,
  Button,
  Table
} from 'antd'
import React, { Component } from 'react'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { MemberApi } from '../../utils/api'
import moment from 'moment'
import { getDate } from '../../utils/utils'
const { Search } = Input
const { Option } = Select

export default class Member extends Component {
  constructor (props) {
    super(props)
    this.saveInfo = this.saveInfo.bind(this)
    this.openEdit = this.openEdit.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.onText = this.onText.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
    this.delByIds = this.delByIds.bind(this)
    this.closeAdd = this.closeAdd.bind(this)
    this.openAdd = this.openAdd.bind(this)
    this.add = this.add.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onConditionChange = this.onConditionChange.bind(this)
  }
  state = {
    dataSource: [],
    selectedRowKeys: [],
    isEditModalVisible: false,
    isAddModalVisible: false,
    m_id: '',
    m_name: '',
    m_addr: '',
    m_phone: '',
    m_enroll: getDate(),
    m_points: 0,
    m_money: 0,

    search_condition: 'm_name',
    search_val: ''
  }

  // 保存修改信息
  saveInfo () {
    let {
      m_id,
      m_name,
      m_addr,
      m_phone,
      m_enroll,
      m_points,
      m_money
    } = this.state
    let data = new URLSearchParams()
    data.append('m_id', m_id)
    data.append('m_name', m_name)
    data.append('m_enroll', m_enroll)
    data.append('m_points', m_points)
    data.append('m_money', m_money)
    data.append('m_addr', m_addr)
    data.append('m_phone', m_phone)
    MemberApi.edit(data).then(res => {
      let data = res.data
      if (data.success) {
        message.success(data.message)
        this.closeEdit()
        this.getAll()
      } else {
        message.error(data.message)
      }
    })
  }
  // 打开编辑界面
  openEdit (record) {
    let { m_id,
      m_name,
      m_addr,
      m_phone,
      m_enroll,
      m_points,
      m_money} = record
    this.setState({
      isEditModalVisible: true,
      m_id,
      m_name,
      m_addr,
      m_phone,
      m_enroll,
      m_points,
      m_money
    })
  }
  closeEdit () {
    this.setState({
      isEditModalVisible: false
    })
  }

  // 搜索
  onSearch () {
    if (this.state.search_val === '') {
      this.getAll()
      return
    }
    let data = new URLSearchParams()
    data.append('condition', this.state.search_condition)
    data.append('value', this.state.search_val)
    MemberApi.search(data).then(res => {
      let data = res.data
      if (data.success) {
        let temp = data.data
        for (let item of temp) {
          item.key = item.m_id
        }
        this.setState({
          dataSource: temp
        })
        message.success(data.message)
      } else {
        message.error(data.message)
      }
    })
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  }
  onConditionChange (val) {
    this.setState({
      search_condition: val
    })
  }

  // 新增
  openAdd () {
    this.setState({
      isAddModalVisible: true,
      m_name: '',
      m_addr: '',
      m_phone: "",
      m_enroll: getDate(),
      m_points: 0,
      m_money: 0
    })
  }
  closeAdd () {
    this.setState({
      isAddModalVisible: false
    })
  }
  add () {
    let { 
      m_name,
      m_addr,
      m_phone,
      m_enroll,
      m_points,
      m_money } = this.state
    let data = new URLSearchParams()
    data.append('m_name', m_name)
    data.append('m_enroll', m_enroll)
    data.append('m_points', m_points)
    data.append('m_money', m_money)
    data.append('m_addr', m_addr)
    data.append('m_phone', m_phone)
    MemberApi.add(data).then(res => {
      let data = res.data
      if (data.success) {
        message.success(data.message)
        this.closeAdd()
        this.getAll()
      } else {
        message.error(data.message)
      }
    })
  }

  // 绑定键盘监听
  onText (e) {
    let key = e.target.dataset.key
    let value = e.target.value
    this.setState({
      [key]: value
    })
  }

  // 日期选择监听
  onDateChange (date, str) {
    this.setState({
      m_enroll: str
    })
  }

  // 获取全局数据
  getAll () {
    let hide = message.loading('加载数据中')
    MemberApi.getAll()
      .then(res => {
        let data = res.data
        if (data.success) {
          let temp = data.data
          for (let item of temp) {
            item.key = item.m_id
          }
          this.setState({
            dataSource: temp
          })
        } else {
          message.error(data.message)
        }
      })
      .finally(() => {
        hide()
      })
  }

  // 删除数据
  del (id) {
    let res = window.confirm('您确定要删除吗？>_<')
    if (res) {
      let data = new URLSearchParams()
      data.append('id', id)
      MemberApi.del(data).then(res => {
        let data = res.data
        if (data.success) {
          message.success(data.message)
          this.getAll()
        } else {
          message.error(data.message)
        }
      })
    }
  }
  delByIds () {
    if (this.state.selectedRowKeys.length === 0) {
      message.warning('请选择要删除的数据！')
      return
    }
    let hide = message.loading('删除数据中...')
    let res = window.confirm('您确定要删除吗？>_<')
    if (res) {
      let ids = this.state.selectedRowKeys
      let promises = []
      for (let id of ids) {
        promises.push(
          new Promise((resolve, reject) => {
            let data = new URLSearchParams()
            data.append('id', id)
            MemberApi.del(data).then(res => {
              let data = res.data
              if (data.success) {
                resolve()
              } else {
                reject()
              }
            })
          })
        )
      }
      Promise.all(promises)
        .then(() => {
          message.success('删除成功')
        })
        .catch(err => {
          message.success('未知错误')
        })
        .finally(() => {
          this.getAll()
          hide()
        })
    }
  }

  componentDidMount () {
    this.getAll()
  }
  render () {
    const {
      selectedRowKeys,
      dataSource,
      isEditModalVisible,
      isAddModalVisible,
      m_name,
      m_addr,
      m_phone,
      m_enroll,
      m_points,
      m_money,
      search_val,
      search_condition
    } = this.state
    const columns = [
      {
        title: '姓名',
        dataIndex: 'm_name',
        key: 'm_name'
      },
      {
        title: '地址',
        dataIndex: 'm_addr',
        key: 'm_addr'
      },
      {
        title: '注册日期',
        dataIndex: 'm_enroll',
        key: 'm_enroll'
      },
      {
        title: '会员点数',
        dataIndex: 'm_points',
        key: 'm_points',
        sorter: (a, b) => a.m_points - b.m_points
      },
      {
        title: '余额',
        dataIndex: 'm_money',
        key: 'm_money',
        sorter: (a, b) => a.m_money - b.m_money
      },
      {
        title: '电话',
        dataIndex: 'm_phone',
        key: 'm_phone'
      },
      {
        title: '操作',
        key: 'option',
        render: (text, record) => (
          <Space size='middle' key={record.m_id}>
            <Button
              type='primary'
              onClick={this.openEdit.bind(this, record)}
              icon={<EditOutlined />}
            />
            <Button
              type='primary'
              danger
              onClick={this.del.bind(this, record.m_id)}
              icon={<DeleteOutlined />}
            />
          </Space>
        )
      }
    ]

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }

    const searchCondiction = (
      <Select defaultValue={search_condition} onChange={this.onConditionChange}>
        <Option value='m_name'>姓名</Option>
        <Option value='m_enroll'>注册日期</Option>
        <Option value='m_points'>点数</Option>
        <Option value='m_money'>余额</Option>
        <Option value='m_addr'>地址</Option>
        <Option value='m_phone'>电话</Option>
      </Select>
    )
    return (
      <div className='all-container'>
        <Row style={{ padding: '1rem 0' }}>
          <Col span={2}></Col>
          <Col span={6}>
            <Search
              addonBefore={searchCondiction}
              placeholder='请输入条件'
              allowClear
              onSearch={this.onSearch}
              value={search_val}
              onChange={this.onText}
              data-key='search_val'
            />
          </Col>
          <Col className='grid-center' span={4}>
            <Button
              type='primary'
              onClick={this.openAdd}
              icon={<PlusOutlined />}
              size={'middle'}
            >
              添加会员
            </Button>
          </Col>
          <Col className='grid-center' span={1}>
            <Button
              type='primary'
              danger
              icon={<DeleteOutlined />}
              size={'middle'}
              onClick={this.delByIds}
            >
              删除会员
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            <Table
              rowSelection={rowSelection}
              pagination={{ position: ['bottomCenter'] }}
              dataSource={dataSource}
              columns={columns}
            />
          </Col>
          <Col span={2}></Col>
        </Row>

        {/* 修改信息框 */}
        <Modal
          title='修改信息'
          visible={isEditModalVisible}
          onOk={this.saveInfo}
          onCancel={this.closeEdit}
        >
          <div>
            <div>姓名</div>
            <Input data-key='m_name' value={m_name} onChange={this.onText} />
          </div>
          <div>
            <div>注册日期</div>
            <DatePicker
              defaultValue={moment(m_enroll)}
              format={'YYYY-MM-DD'}
              onChange={this.onDateChange}
            />
          </div>
          <div>
            <div>会员点数</div>
            <Input
              data-key='m_points'
              value={m_points}
              onChange={this.onText}
            />
          </div>
          <div>
            <div>余额</div>
            <Input data-key='m_money' value={m_money} onChange={this.onText} />
          </div>
          <div>
            <div>地址</div>
            <Input data-key='m_addr' value={m_addr} onChange={this.onText} />
          </div>
          <div>
            <div>电话</div>
            <Input data-key='m_phone' value={m_phone} onChange={this.onText} />
          </div>
        </Modal>

        {/* 新增信息框 */}
        <Modal
          title='修改信息'
          visible={isAddModalVisible}
          onOk={this.add}
          onCancel={this.closeAdd}
        >
         <div>
            <div>姓名</div>
            <Input data-key='m_name' value={m_name} onChange={this.onText} />
          </div>
          <div>
            <div>注册日期</div>
            <DatePicker
              defaultValue={moment(m_enroll)}
              format={'YYYY-MM-DD'}
              onChange={this.onDateChange}
            />
          </div>
          <div>
            <div>会员点数</div>
            <Input
              data-key='m_points'
              value={m_points}
              onChange={this.onText}
            />
          </div>
          <div>
            <div>余额</div>
            <Input data-key='m_money' value={m_money} onChange={this.onText} />
          </div>
          <div>
            <div>地址</div>
            <Input data-key='m_addr' value={m_addr} onChange={this.onText} />
          </div>
          <div>
            <div>电话</div>
            <Input data-key='m_phone' value={m_phone} onChange={this.onText} />
          </div>
        </Modal>
      </div>
    )
  }
}
