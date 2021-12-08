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
import { BossApi } from '../../utils/api'
const { Search } = Input
const { Option } = Select

export default class Assistant extends Component {
  constructor (props) {
    super(props)
    this.onText = this.onText.bind(this)
    this.closeAdd = this.closeAdd.bind(this)
    this.openAdd = this.openAdd.bind(this)
    this.add = this.add.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onConditionChange = this.onConditionChange.bind(this)
  }
  state = {
    dataSource: [],
    isAddModalVisible: false,
    s_id: '',
    s_name: '',
    s_username: '',
    s_password: '',
    search_condition: 's_name',
    search_val: ''
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
    BossApi.search(data).then(res => {
      let data = res.data
      if (data.success) {
        let temp = data.data
        for (let item of temp) {
          item.key = item.t_id
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
      s_id: '',
      s_name: '',
      s_username: '',
      s_password: ''
    })
  }
  closeAdd () {
    this.setState({
      isAddModalVisible: false
    })
  }
  add () {
    let { s_name, s_username } = this.state
    let data = new URLSearchParams()
    data.append('s_name', s_name)
    data.append('s_username', s_username)
    data.append('s_password', 'root')
    BossApi.add(data).then(res => {
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
      t_date: str
    })
  }

  // 获取全局数据
  getAll () {
    let hide = message.loading('加载数据中')
    BossApi.getAll()
      .then(res => {
        let data = res.data
        if (data.success) {
          let temp = data.data
          for (let item of temp) {
            item.key = item.t_id
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
      BossApi.del(data).then(res => {
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

  componentDidMount () {
    this.getAll()
  }
  render () {
    const {
      dataSource,
      isAddModalVisible,
      s_id,
      s_name,
      s_username,
      s_password,
      search_val,
      search_condition
    } = this.state
    const columns = [
      {
        title: '管理员名称',
        dataIndex: 's_name',
        key: 's_name'
      },
      {
        title: '管理员账号',
        dataIndex: 's_username',
        key: 's_username'
      },
      {
        title: '操作',
        key: 'option',
        render: (text, record) => (
          <Space size='middle' key={record.s_id}>
            <Button
              type='primary'
              danger
              onClick={this.del.bind(this, record.s_id)}
              icon={<DeleteOutlined />}
            />
          </Space>
        )
      }
    ]

    const searchCondiction = (
      <Select defaultValue={search_condition} onChange={this.onConditionChange}>
        <Option value='s_name'>管理员姓名</Option>
        <Option value='s_username'>管理员账号</Option>
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
              添加管理员
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            <Table
              pagination={{ position: ['bottomCenter'] }}
              dataSource={dataSource}
              columns={columns}
            />
          </Col>
          <Col span={2}></Col>
        </Row>

        {/* 新增信息框 */}
        <Modal
          title='新增管理员'
          visible={isAddModalVisible}
          onOk={this.add}
          onCancel={this.closeAdd}
        >
          <div>
            <div>姓名</div>
            <Input data-key='s_name' value={s_name} onChange={this.onText} />
          </div>
          <div>
            <div>账号</div>
            <Input data-key='s_username' value={s_username} onChange={this.onText} />
          </div>
        </Modal>
      </div>
    )
  }
}
