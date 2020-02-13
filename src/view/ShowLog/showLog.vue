<template>
  <div >
    

        <Header-nav @showModal="showModal" />
         <Spin
      size="large"
      style="position: fixed;top:0;left:0;right:0;bottom:0; "
      fix
      v-show="spinShow"
    ></Spin>
    <Modal v-model="putmodal" :mask-closable="false" title="修改用户密码">
      <Form
        :model="putPassForm"
        :rules="putPassFormRule"
        label-position="left"
        :label-width="100"
        ref="putPassForm"
      >
        <FormItem label="旧密码" prop="usedPassWord">
          <Input v-model="putPassForm.usedPassWord" type="password" />
        </FormItem>
        <FormItem label="新密码" prop="passWord">
          <Input v-model="putPassForm.passWord" type="password" />
        </FormItem>
        <FormItem label="确认密码" prop="againPass">
          <Input v-model="putPassForm.againPass" type="password" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="putOk" :disabled="!putPassOkDisable"
          >确定</Button
        >
        <Button type="text" @click="putmodal = false">取消</Button>
      </div>
    </Modal>

    <Modal
      v-model="logout"
      :mask-closable="false"
      title="确定要注销登录吗"
      @on-ok="logoutFunc"
      @on-cancel="logout = false"
    >
    </Modal>
    <!--    查询条件部分-->
    <Row style="padding:20px;">
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
              style="width: 70%"
            ></DatePicker>
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
              <Option
                v-for="item in cascadeData"
                :value="item.label"
                :key="item.value"
                >{{ item.label }}</Option
              >
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
          <Table :columns="logTabHead" :data="tabData" :border="true"></Table>
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
      <Col span="11" style="margin-left: 15px;">
        <Card style="height: 670px;overflow-y: scroll;">
          <List item-layout="vertical">
            <ListItem v-for="item in tabData" :key="item.title">
              <ListItemMeta :title="item.userName">
                <template slot="description">
                  <p v-for="(text, index) in item.body">
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
  import HeaderNav from '../../components/Header/HeaderNav';
  import tabTemplate from './tabTemplate'

  export default {
    name: 'showLog',

    data() {
      return {
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

          putmodal: false /**修改密码的模态框显示 */,
        logout: false /**注销登录模态框修改 */,
        putPassForm: {
          usedPassWord: '',
          passWord: '',
          againPass: '',
        },
        spinShow:false,/**控制加载中的显示 */
        putPassOkDisable: false,
        putPassFormRule: {
          usedPassWord: [
            {
              required: true,
              message: '旧密码不能为空',
              trigger: 'change',
            },
            {
              type: 'string',
              min: 6,
              message: '密码长度不要少于6位',
              trigger: 'change',
            },
            {
              type: 'string',
              max: 18,
              message: '密码长度不要大于18位',
              trigger: 'change',
            },
          ],
          againPass: [
            {
              required: true,
              message: '确认密码不能为空',
              trigger: 'change',
            },
            {
              type: 'string',
              min: 6,
              message: '密码长度不要少于6位',
              trigger: 'change',
            },
            {
              type: 'string',
              max: 18,
              message: '密码长度不要大于18位',
              trigger: 'change',
            },
            {
              type: 'string',
              message: '两次输入的密码不一致',
              trigger: 'change',
              validator: (rule, value) => {
                return value === this._data.putPassForm.passWord;
              },
            },
          ],
          passWord: [
            {
              required: true,
              message: '新密码不为能空',
              trigger: 'change',
            },
             {
              type: 'string',
              message: '新密码不能和旧密码相同',
              trigger: 'change',
              validator: (rule, value) => {
                return value !== this._data.putPassForm.usedPassWord;
              },
            },
            {
              type: 'string',
              min: 6,
              message: '密码长度不要少于6位',
              trigger: 'change',
            },
            {
              type: 'string',
              max: 18,
              message: '密码长度不要大于18位',
              trigger: 'change',
            },
          ],
        },
      };
    },
    components: {
      HeaderNav,
    },
    created() {
      this.getUser();
      this.getLogList();
    },
    methods: {
         //显示修改密码模态框
      showModal(isShow) {
        if (isShow === 'putPass') {
          this.putmodal = true;
        } else if (isShow === 'logout') {
          this.logout = true;
        }
      },
     async putOk() {
        const {passWord,usedPassWord} = this.putPassForm  
        const userinfo = JSON.parse(localStorage.getItem('login'))
        const result = await this.$http.post('/api/putPassWord',{data:{id:String(userinfo.id),passWord,usedPassWord}})
        const {respCode,respMsg} = result.data

        if(respCode==='200'){
          this.spinShow = true
          this.putmodal = false

          setTimeout(()=>{
            this.$refs['putPassForm'].resetFields();
            localStorage.removeItem('login')
            setTimeout(()=>{
               this.$Message.info('修改密码成功,跳转登录页面重新登录');
              this.spinShow = false
              this.$router.push('/login')
            },500)
          },500)
        }else {
           this.$Message.info(respMsg);
        }
      },
      /**注销登录 */
      logoutFunc() {
        localStorage.removeItem('login');
        this.$router.push('/login');
      },
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
              this.$Notice.open('获取列表失败');
            }
          })
          .catch(err => {
            if (err) {
              this.$Notice.error({
                title: '服务器异常',
              });
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
                title: '服务器异常',
              });
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
     watch:{
      'putPassForm.passWord':function(newVal,oldVal){
        this.$refs['putPassForm'].validate(valid=>{
          this.putPassOkDisable = valid 
        })
      },
      'putPassForm.usedPassWord':function(newVal,oldVal){
         this.$refs['putPassForm'].validate(valid=>{
          this.putPassOkDisable = valid
        })
      },
      'putPassForm.againPass':function(newVal,oldVal){
         this.$refs['putPassForm'].validate(valid=>{
          this.putPassOkDisable = valid
        })
      },
    }
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
