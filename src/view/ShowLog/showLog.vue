<template>
  <div style="padding: 25px;">

    <!--    查询条件部分-->
    <Row>
      <Col span="16">
        <Row>
          <Col span="12">
            选择日期: &nbsp;
            <DatePicker
              format="yyyy-MM-dd"
              @on-change="dataSelectChange"
              type="daterange"
              placement="bottom-end"
              placeholder="请选择截止时间"
              style="width: 70%"></DatePicker>

          </Col>

          <Col span="8">
            选择名字: &nbsp;
            <Select
              v-model="userName"
              placeholder="请选择或者搜索你的名字"
              filterable
              clearable
              style="width: 60%;"
            >
              <Option v-for="item in cascadeData" :value="item.label" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>

          <Col span="4">
            <Button type="primary" @click="getLogList">查询</Button>
          </Col>

        </Row>
      </Col>
    </Row>


    <Row style="margin-top: 15px;">
      <Col span="11">
        <Card>
          <Table :columns="logTabHead"
                 :data="tabData"
                 :border="true"></Table>
          <div style="margin-top: 25px;">
            <Page v-if="pageTotal!==0" :current="currentPage" @on-change="pageChange" :total="pageTotal"
                  :page-size="pageSize"/>
          </div>
        </Card>


      </Col>
      <Col span="11" style="margin-left: 15px;">
        <Card style="height: 670px;overflow-y: scroll;">
          <List item-layout="vertical">
            <ListItem v-for="item in tabData" :key="item.title">
              <ListItemMeta :title="item.userName">
                <template slot="description">
                  <p v-for="(text,index) in item.body">{{index+1 | capNumber}}{{text.target}}</p>
                </template>
              </ListItemMeta>

              <template slot="extra">
                在 {{item.createTime}} 时提交了周报
              </template>
            </ListItem>
          </List>
        </Card>
      </Col>
    </Row>


  </div>
</template>

<script>
    import tabTemplate from './tabTemplate'

    export default {
        name: 'showLog',
        comments: {
            tabTemplate
        },
        data() {
            return {
                cascadeData: [], /** 选择成员下拉框的数据*/
                selectDate: '', /** 当前选择的时间*/
                userID: '', /**用户id*/

                pageTotal: 0,/*总条数*/
                currentPage: 1,/*当前页码*/
                pageSize: 10, /**每页多少*/
                pageHandlerData: [], /**分页后的数据*/

                startTime: "", /**开始时间*/
                endTIme: '', /**结束时间*/
                userName: '', /**用户名称*/

                logTabHead: [
                    {
                        type: 'expand',
                        align: 'center',
                        title: '展开内容',
                        width: '60%',
                        render: (h, params) => {
                            return h(tabTemplate, {
                                props: {
                                    row: params.row.body
                                }
                            })
                        }
                    },
                    {
                        type: 'index',
                        align: 'center',
                        indexMethod: (cont, index) => {
                            return ((this.currentPage - 1) * this.pageSize) + cont._index + 1
                        }
                    },

                    {
                        title: '姓名',
                        className: "demo-table-info-row",
                        key: 'userName',
                        align: 'center',
                    },
                    {
                        title: '所属团队',
                        key: 'team',
                        align: 'center',
                    },
                    {
                        title: '提交时间',
                        key: 'createTime',
                        align: 'center',
                    },
                ],
                tabData: [],
            }
        },
        created() {
            this.getUser();
            this.getLogList();
        },
        methods: {
            /*获取用户列表*/
            getUser() {
                this.$http.post('/api/user/get_user', {}).then(res => {
                    if (res.data.respCode === "200") {
                        let userList = res.data.data.list
                        this.cascadeData = userList.map(item => {
                            return {
                                value: item.id,
                                label: item['userName']
                            }
                        })
                    } else {
                        this.$Notice.open('获取列表失败')
                    }
                }).catch(err => {
                    if (err) {
                        this.$Notice.error({
                            title: "服务器异常"
                        })
                    }
                })
            },

            /** 时间选择器改变的事件*/
            dataSelectChange(date) {
                this.selectDate = date
                let [startTime, endTIme] = this.selectDate
                this.startTime = startTime
                this.endTIme = endTIme
            },

            /**获取周报列表*/
            getLogList() {
                let startTime = this.startTime
                let endTime = this.endTIme
                let currentPage = this.currentPage+''
                let pageSize = this.pageSize+''
                let userName = this.userName + ""
                let data = {
                    startTime,
                    endTime,
                    pageNo:currentPage,
                    pageSize,
                    userName,
                }
                this.$http.post('/api/weekly/get_logs', {data: data}).then(res => {
                        let {respCode, data} = res.data
                        let logList = []
                        if (respCode && respCode === '200') {
                            this.pageTotal = data['total'][0]
                            this.tabData = data['list'].map(item => {
                                return {
                                    userName: item['user']['userName'],
                                    team: item['team']['name'],
                                    createTime: item['createTime'],
                                    body: JSON.parse(item['body'])
                                }
                            })

                            this.$Notice.info({
                                title: '周报查询成功'
                            })
                        } else {
                            this.$Notice.error({
                                title: '周报查询失败'
                            })
                        }

                    }
                ).catch(err => {
                    if (err) {
                        this.$Notice.error({
                            title: '服务器异常'
                        })
                    }
                })
            },

            /**页码的点击事件*/
            pageChange(page) {
                this.currentPage = page
                this.getLogList()
            },

        }
        ,
        filters: {
            capNumber(value) {
                if (!value) return ''
                switch (value) {
                    case 1:
                        return "一、";
                    case 2:
                        return "二、";
                    case 3:
                        return "三、";
                    case 4:
                        return "四、";
                    case 5:
                        return "五、";
                    default :
                        return ''
                }
            }
        }


    }
</script>

<style>
  .demo-table-info-row {
    text-align: center;
    margin-top: 25px;
  }

  .demo-table-info-row th {
  }

  .show_tab {
    text-align: center;
    font-weight: 700;
    font-size: 20px;
  }


</style>
