<template>
  <div>
    <Spin
      size="large"
      style="position: fixed;top:0;left:0;right:0;bottom:0; "
      fix
      v-show="spinShow"
    ></Spin>

    <!--    查询条件部分-->
    <Row style="padding:20px;">
      <Col span="24">
        <Row>
          <Col span="4" offset="1">
            选择日期: &nbsp;
            <DatePicker
              format="yyyy-MM-dd"
              @on-change="dataSelectChange"
              type="daterange"
              placement="bottom-end"
              placeholder="请选择截止时间"
              style="width: 70%"
            ></DatePicker>
          </Col>

          <Col span="4">
            选择名字: &nbsp;
            <Select
              v-model="userName"
              placeholder="请选择或者搜索成员名字"
              filterable
              clearable
              style="width: 60%;"
            >
              <Option
                v-for="item in cascadeData"
                :value="item.label"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>

          <Col span="6">
            <Button type="primary" @click="getLogList">查询</Button>
          </Col>
        </Row>
      </Col>
    </Row>

    <Row style="margin-top: 15px;">
      <Col
        span="11"
        :sm="{ span: '24', offset: '0' }"
        :md="{ span: '22', offset: '1' }"
        :lg="{ span: '22', offset: '1' }"
        :xl="{ span: '11', offset: '1' }"
      >
        <Card>
          <Table
            :columns="logTabHead"
            :data="tabData"
            :loading="tabLoading"
            :border="true"
          ></Table>
          <div style="margin-top: 25px;">
            <Page
              v-if="pageTotal !== 0"
              :current="currentPage"
              @on-change="pageChange"
              :total="pageTotal"
              :page-size="pageSize"
            />
          </div>
        </Card>
      </Col>
      <Col
        span="11"
        :sm="{ span: '24', offset: '1' }"
        :md="{ span: '23', offset: '1' }"
        :lg="{ span: '22', offset: '1' }"
        :xl="{ span: '11', offset: '0' }"
      >
        <Card style="height: 609px;overflow-y: scroll;">
          <List item-layout="vertical">
            <ListItem v-for="item in tabData" :key="item.title">
              <ListItemMeta :title="item.userName">
                <template slot="description">
                  <p v-for="(text, index) in item.body" :key="text.target">
                    {{ (index + 1) | capNumber }}{{ text.target }}
                  </p>
                </template>
              </ListItemMeta>

              <template slot="extra">
                在 {{ item.createTime }} 时提交了周报
              </template>
            </ListItem>
          </List>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import tabTemplate from './tabTemplate';

  export default {
    name: 'showLog',

    data() {
      return {
        throttle_user: 0 /**节流阀 */,
        userTimeOut: undefined,
        logTimeOut: undefined,
        tabLoading: false,
        cascadeData: [] /** 选择成员下拉框的数据*/,
        selectDate: '' /** 当前选择的时间*/,
        userID: '' /**用户id*/,

        pageTotal: 0 /*总条数*/,
        currentPage: 1 /*当前页码*/,
        pageSize: 10 /**每页多少*/,
        pageHandlerData: [] /**分页后的数据*/,

        startTime: '' /**开始时间*/,
        endTIme: '' /**结束时间*/,
        userName: '' /**用户名称*/,

        logTabHead: [
          {
            type: 'expand',
            align: 'center',
            title: '展开内容',
            width: '100%',
            render: (h, params) => {
              return h(tabTemplate, {
                props: {
                  row: params.row.body,
                },
              });
            },
          },
          {
            type: 'index',
            align: 'center',
            width: '90%',
            indexMethod: (cont, index) => {
              return (this.currentPage - 1) * this.pageSize + cont._index + 1;
            },
          },

          {
            title: '姓名',
            className: 'demo-table-info-row',
            key: 'userName',
            align: 'center',
            width: '80%',
          },
          {
            title: '所属团队',
            key: 'team',
            align: 'center',
            width: '95%',
          },
          {
            title: '提交时间',
            key: 'createTime',
            align: 'center',
          },
        ],
        tabData: [],
        spinShow: false /**控制加载中的显示 */,
      };
    },
    created() {},
    mounted() {
      this.getUser();
      this.getLogList();
    },
    methods: {
      /*获取用户列表*/
      getUser() {
        this.$http
          .post('/api/user/get_user', {})
          .then(res => {
            if (res.data.respCode === '200') {
              let userList = res.data.data.list;
              this.cascadeData = userList.map(item => {
                return {
                  value: item.id,
                  label: item['userName'],
                };
              });
            } else {
              this.$Notice.open('没有用户数据');
            }
          })
          .catch(err => {
            if (err) {
              this.$Notice.error({
                title: '获取用户列表失败,正在重新请求',
              });
              this.userTimeOut = setTimeout(() => {
                this.throttle_user++;
                if (this.throttle_user > 6) {
                  return;
                } else {
                  this.getUser();
                }
              }, 2000);
            }
          });
      },

      /** 时间选择器改变的事件*/
      dataSelectChange(date) {
        this.selectDate = date;
        let [startTime, endTIme] = this.selectDate;
        this.startTime = startTime;
        this.endTIme = endTIme;
      },

      /**获取周报列表*/
      getLogList() {
        this.tabLoading = true;
        let startTime = this.startTime;
        let endTime = this.endTIme;
        let currentPage = this.currentPage + '';
        let pageSize = this.pageSize + '';
        let userName = this.userName + '';
        let data = {
          startTime,
          endTime,
          pageNo: currentPage,
          pageSize,
          userName,
        };
        this.$http
          .post('/api/weekly/get_logs', { data: data })
          .then(res => {
            let { respCode, data } = res.data;
            let logList = [];
            if (respCode && respCode === '200') {
              this.tabLoading = false;
              this.pageTotal = data['total'][0];
              this.tabData = data['list'].map(item => {
                return {
                  userName: item['user']['userName'],
                  team: item['team']['name'],
                  createTime: item['createTime'],
                  body: JSON.parse(item['body']),
                };
              });
            } else {
              this.$Notice.error({
                title: '周报查询失败',
              });
            }
          })
          .catch(err => {
            if (err) {
              this.$Notice.error({
                title: '请求周报列表失败,正在重新请求',
              });
              this.logTimeOut = setTimeout(() => {
                this.throttle_user++;
                if (this.throttle_user > 6) {
                  this.tabLoading = false;
                  return this.$Modal.confirm({
                    title: '提示',
                    content:
                      '<p>您的网络连接可能有问题,请检测您的网络连接后点击确定刷新重试</p>',
                    onOk: () => {
                      window.location.href = window.location.href;
                    },
                    onCancel: () => {
                      // this.$Message.info('Clicked cancel');
                    },
                  });
                } else {
                  this.getLogList();
                }
              }, 2000);
            }
          });
      },

      /**页码的点击事件*/
      pageChange(page) {
        this.currentPage = page;
        this.getLogList();
      },
    },
    filters: {
      capNumber(value) {
        if (!value) return '';
        switch (value) {
          case 1:
            return '一、';
          case 2:
            return '二、';
          case 3:
            return '三、';
          case 4:
            return '四、';
          case 5:
            return '五、';
          default:
            return '';
        }
      },
    },
    beforeDestroy() {
      this.userTimeOut = undefined;
      this.logTimeOut = undefined;
    },
  };
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
