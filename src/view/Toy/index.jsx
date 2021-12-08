import { Col, message, Row, Space, Modal, DatePicker,Select,Input, Button, Table } from 'antd'
import React, { Component } from 'react'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ToyApi } from '../../utils/api'
import moment from 'moment'
import { getDate } from '../../utils/utils'
const { Search } = Input
const {Option} = Select


export default class Toy extends Component {
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
    this.onSearch = this.onSearch.bind(this);
    this.onConditionChange = this.onConditionChange.bind(this);
  }
  state = {
    dataSource: [],
    selectedRowKeys: [],
    isEditModalVisible: false,
    isAddModalVisible: false,
    t_id: '',
    t_name: '',
    t_date: getDate(),
    t_price: 0,
    t_attach_num: 0,
    t_state: 10,
    t_out: '否',
    search_condition: 't_name',
    search_val: ""
  }

  // 保存修改信息
  saveInfo () {
    let {
      t_id,
      t_name,
      t_date,
      t_price,
      t_attach_num,
      t_state,
      t_out
    } = this.state
    let data = new URLSearchParams()
    data.append('t_id', t_id)
    data.append('t_name', t_name)
    data.append('t_date', t_date)
    data.append('t_price', t_price)
    data.append('t_attach_num', t_attach_num)
    data.append('t_state', t_state)
    data.append('t_out', t_out)
    ToyApi.edit(data).then(res => {
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
    let { t_id, t_name, t_date, t_price, t_attach_num, t_state, t_out } = record
    this.setState({
      isEditModalVisible: true,
      t_id,
      t_name,
      t_date,
      t_price,
      t_attach_num,
      t_state,
      t_out
    })
  }
  closeEdit () {
    this.setState({
      isEditModalVisible: false
    })
  }

  // 搜索
  onSearch () {
    if(this.state.search_val === '') {
      this.getAll();
      return;
    }
    let data = new URLSearchParams();
    data.append('condition',this.state.search_condition);
    data.append('value',this.state.search_val);
    ToyApi.search(data).then(res => {
      let data = res.data;
      if(data.success) {
        let temp  = data.data;
        for(let item of temp) {
          item.key = item.t_id;
        }
        this.setState({
          dataSource : temp
        })
        message.success(data.message);
      }else {
        message.error(data.message);
      }
    })
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  }
  onConditionChange(val) {
    this.setState({
      search_condition : val
    })
  }

  // 新增
  openAdd () {
    this.setState({
      isAddModalVisible: true,
      t_name: '',
      t_date: getDate(),
      t_price: 0,
      t_attach_num: 0,
      t_state: 10,
      t_out: '否'
     })
  }
  closeAdd () {
    this.setState({
      isAddModalVisible: false
    })
  }
  add () {
    let { t_name, t_date, t_price, t_attach_num, t_state, t_out } = this.state
    let data = new URLSearchParams()
    data.append('t_name', t_name)
    data.append('t_date', t_date)
    data.append('t_price', t_price)
    data.append('t_attach_num', t_attach_num)
    data.append('t_state', t_state)
    data.append('t_out', t_out)
    ToyApi.add(data).then(res => {
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
    ToyApi.getAll()
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
      ToyApi.del(data).then(res => {
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
    if (this.state.selectedRowKeys.length == 0) {
      message.warning('请选择要删除的数据！')
      return
    }
    let hide = message.loading('删除数据中...');
    let res = window.confirm('您确定要删除吗？>_<')
    if (res) {
      let ids = this.state.selectedRowKeys
      let promises = []
      for (let id of ids) {
        promises.push(
          new Promise((resolve, reject) => {
            let data = new URLSearchParams()
            data.append('id', id)
            ToyApi.del(data).then(res => {
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
          hide();
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
      t_name,
      t_date,
      t_price,
      t_attach_num,
      t_state,
      t_out,
      search_val,
      search_condition
    } = this.state
    const columns = [
      {
        title: '名称',
        dataIndex: 't_name',
        key: 't_name'
      },
      {
        title: '进货日期',
        dataIndex: 't_date',
        key: 't_date'
      },
      {
        title: '价格',
        dataIndex: 't_price',
        key: 't_price',
        sorter: (a,b)=>a.t_price-b.t_price
      },
      {
        title: '附件数量',
        dataIndex: 't_attach_num',
        key: 't_attach_num',
        sorter: (a,b)=>a.t_attach_num-b.t_attach_num
      },
      {
        title: '几成新',
        dataIndex: 't_state',
        key: 't_state',
        sorter: (a,b)=>a.t_state-b.t_state
      },
      {
        title: '是否出租',
        dataIndex: 't_out',
        key: 't_out'
      },
      {
        title: '操作',
        key: 'option',
        render: (text, record) => (
          <Space size='middle' key={record.t_id}>
            <Button
              type='primary'
              onClick={this.openEdit.bind(this, record)}
              icon={<EditOutlined />}
            />
            <Button
              type='primary'
              danger
              onClick={this.del.bind(this, record.t_id)}
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
        <Option value="t_name">名称</Option>
        <Option value="t_date">日期</Option>
        <Option value="t_price">价格</Option>
        <Option value="t_attach_num">附件数量</Option>
        <Option value="t_state">几成新</Option>
        <Option value="t_out">是否出租</Option>
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
              data-key="search_val"
            />
          </Col>
          <Col className='grid-center' span={4}>
            <Button
              type='primary'
              onClick={this.openAdd}
              icon={<PlusOutlined />}
              size={'middle'}
            >
              添加玩具
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
              删除玩具
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
            <div>名称</div>
            <Input data-key='t_name' value={t_name} onChange={this.onText} />
          </div>
          <div>
            <div>日期</div>
            <DatePicker
              defaultValue={moment(t_date)}
              format={'YYYY-MM-DD'}
              onChange={this.onDateChange}
            />
          </div>
          <div>
            <div>价格</div>
            <Input data-key='t_price' value={t_price} onChange={this.onText} />
          </div>
          <div>
            <div>附件数量</div>
            <Input
              data-key='t_attach_num'
              value={t_attach_num}
              onChange={this.onText}
            />
          </div>
          <div>
            <div>几成新</div>
            <Input data-key='t_state' value={t_state} onChange={this.onText} />
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
            <div>名称</div>
            <Input data-key='t_name' value={t_name} onChange={this.onText} />
          </div>
          <div>
            <div>日期</div>
            <DatePicker
              defaultValue={moment(t_date)}
              format={'YYYY-MM-DD'}
              onChange={this.onDateChange}
            />
          </div>
          <div>
            <div>价格</div>
            <Input data-key='t_price' value={t_price} onChange={this.onText} />
          </div>
          <div>
            <div>附件数量</div>
            <Input
              data-key='t_attach_num'
              value={t_attach_num}
              onChange={this.onText}
            />
          </div>
          <div>
            <div>几成新</div>
            <Input data-key='t_state' value={t_state} onChange={this.onText} />
          </div>
          <div>
            <div>是否出租</div>
            <Input data-key='t_out' value={t_out} onChange={this.onText} />
          </div>
        </Modal>
      </div>
    )
  }
}
