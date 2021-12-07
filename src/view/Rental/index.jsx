import {
  Col,
  message,
  Row,
  Space,
  Modal,
  Select,
  Input,
  Button,
  Table,
  Tag
} from 'antd'
import React, { Component } from 'react'
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import { RentalApi, ToyApi, MemberApi } from '../../utils/api'
import { getDate } from '../../utils/utils'
const { Search } = Input
const { Option } = Select

export default class Rental extends Component {
  constructor (props) {
    super(props)
    this.onText = this.onText.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
    this.closeAdd = this.closeAdd.bind(this)
    this.openAdd = this.openAdd.bind(this)
    this.add = this.add.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onConditionChange = this.onConditionChange.bind(this)
    this.onMemberChange = this.onMemberChange.bind(this)
    this.onToyChange = this.onToyChange.bind(this)
    this.returnRent = this.returnRent.bind(this)
  }
  state = {
    allMembers: [],
    allToys: [],
    dataSource: [],
    isAddModalVisible: false,
    r_id: '',
    m_id: '',
    m_name: '',
    t_id: '',
    t_name: '',
    r_rent_date: '',
    r_return_date: '',
    s_rent_id: '',
    s_rent_name: '',
    s_return_id: '',
    s_return_name: '',
    search_condition: 'm_name',
    search_val: '',
    selected_member: '',
    selected_toy: ''
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
    RentalApi.search(data).then(res => {
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
  onConditionChange (val) {
    this.setState({
      search_condition: val
    })
  }
  onMemberChange (val) {
    this.setState({
      selected_member: val
    })
  }
  onToyChange (val) {
    this.setState({
      selected_toy: val
    })
  }

  // 新增
  openAdd () {
    this.setState({
      isAddModalVisible: true,
      selected_member: '',
      selected_toy: ''
    })
  }
  closeAdd () {
    this.setState({
      isAddModalVisible: false
    })
  }
  add () {
    let { selected_member, selected_toy } = this.state
    if (selected_member == '' || selected_toy == '') {
      message.warning('请选择响应数据！')
      return
    }
    let data = new URLSearchParams()
    data.append('m_id', selected_member)
    data.append('t_id', selected_toy)
    data.append('s_rent_id', 1)
    data.append('r_rent_date', getDate())
    RentalApi.add(data).then(res => {
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
    RentalApi.getAll()
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
    this.getAllMember()
    this.getAllToys()
  }

  // 删除数据
  del (id) {
    let res = window.confirm('您确定要删除吗？>_<')
    if (res) {
      let data = new URLSearchParams()
      data.append('id', id)
      RentalApi.del(data).then(res => {
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

  // 获取所有成员
  getAllMember () {
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
            allMembers: temp
          })
        } else {
          message.error(data.message)
        }
      })
      .finally(() => {
        hide()
      })
  }

  // 获取所有空闲玩具
  getAllToys () {
    let hide = message.loading('加载数据中')
    ToyApi.getAllFree()
      .then(res => {
        let data = res.data
        if (data.success) {
          let temp = data.data
          for (let item of temp) {
            item.key = item.t_id
          }
          this.setState({
            allToys: temp
          })
        } else {
          message.error(data.message)
        }
      })
      .finally(() => {
        hide()
      })
  }

  // 归还
  returnRent (r_id) {
    let data = new URLSearchParams()
    data.append('r_id', r_id)
    data.append('s_id', 1)
    data.append('date', getDate())
    RentalApi.return(data).then(res => {
      let data = res.data
      if (data.success) {
        message.success(data.message)
        this.getAll()
      } else {
        message.error(data.message)
      }
    })
  }
  componentDidMount () {
    this.getAll()
  }
  render () {
    const {
      selectedRowKeys,
      dataSource,
      isAddModalVisible,
      search_val,
      search_condition,
      selected_member,
      selected_toy,
      allMembers,
      allToys
    } = this.state
    const columns = [
      {
        title: '租赁人',
        dataIndex: 'm_name',
        key: 'm_name'
      },
      {
        title: '租赁玩具',
        dataIndex: 't_name',
        key: 't_name'
      },
      {
        title: '租赁日期',
        dataIndex: 'r_rent_date',
        key: 'r_rent_date'
      },
      {
        title: '租赁处理人',
        dataIndex: 's_rent_name',
        key: 's_rent_name'
      },
      {
        title: '归还日期',
        dataIndex: 'r_return_date',
        key: 'r_return_date'
      },
      {
        title: '归还处理人',
        dataIndex: 's_return_name',
        key: 's_return_name'
      },
      {
        title: '操作',
        key: 'option',
        render: (text, record) => (
          <Space size='middle' key={record.r_id}>
            {record.s_return_id ? <Tag color="success">已完成租赁</Tag> : (
              <>
                <Button
                  type='primary'
                  onClick={this.returnRent.bind(this, record.r_id)}
                  icon={<CheckOutlined />}
                />
                <Button
                  type='primary'
                  danger
                  onClick={this.del.bind(this, record.r_id)}
                  icon={<DeleteOutlined />}
                />
              </>
            )}
          </Space>
        )
      }
    ]



    const searchCondiction = (
      <Select defaultValue={search_condition} onChange={this.onConditionChange}>
        <Option value='m_name'>租赁人</Option>
        <Option value='t_name'>玩具</Option>
        <Option value='r_rent_date'>租赁日期</Option>
        <Option value='r_return_date'>归还日期</Option>
        <Option value='s_rent_name'>租赁处理人</Option>
        <Option value='s_return_name'>归还处理人</Option>
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
              添加记录
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
          title='修改信息'
          visible={isAddModalVisible}
          onOk={this.add}
          onCancel={this.closeAdd}
        >
          <div>
            <div>租赁人</div>
            <Select
              defaultValue={selected_member}
              onChange={this.onMemberChange}
            >
              {allMembers.map(item => (
                <Option key={item.m_id} value={item.m_id}>
                  {item.m_name}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <div>租赁玩具</div>
            <Select defaultValue={selected_toy} onChange={this.onToyChange}>
              {allToys.map(item => (
                <Option key={item.t_id} value={item.t_id}>
                  {item.t_name}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>
      </div>
    )
  }
}
