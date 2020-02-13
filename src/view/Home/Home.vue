<template>
  <div>
     <Spin
      size="large"
      style="position: fixed;top:0;left:0;right:0;bottom:0; "
      fix
      v-show="spinShow"
    ></Spin>
    <Header-nav @showModal="showModal"></Header-nav>
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
    <Row style="margin: 25px;">
      <Col span="8">
        <h1>今天是{{ time }}</h1>
      </Col>
      <Col span="16">
        <Row>
          <Col span="0">
            <!-- <label
              style="font-weight: 500;font-size: 20px;"
              for="cascadeCurrent"
              >请选择或者搜索你的名字:
            </label>
            <Select
              v-model="cascadeCurrent"
              placeholder="请选择或者输入你的名字"
              filterable
              clearable
              style="width: 50%;"
              id="cascadeCurrent"
              @on-change="selectUser"
              :label-in-value="true"
            >
              <Option
                v-for="item in cascadeData"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}
              </Option>
            </Select> -->
          </Col>
          <Col span="24" >
            <span style="padding-left: 25px;font-size: 20px;float:right;"
              >上次提交的时间:
              {{
                lastEmitTIme  ? lastEmitTIme : '暂无数据'
              }}</span>
          </Col>
        </Row>
      </Col>
    </Row>

    <Row>
      <Col>
        <Table
          :columns="tabHeader"
          :data="log_content"
          :disabled-hover="true"
          :border="true"
          style="margin: 0 15px;"
        >
          <template slot-scope="{ row, index }" slot="target">
            <span class="num_icon">{{ (index + 1) | capNumber }}</span>
            <Input
              style="width: 250px;font-weight: 700;font-size: 20px;"
              v-model="log_content[index].target"
              placeholder="请输入你的项目名称"
              @input="targetChange(index)"
              maxlength="50"
            />
          </template>
          <template slot-scope="{ row, index }" slot="Major">
            <div
              :key="majorIndex"
              v-for="(target, majorIndex) in row.Major"
              style="margin: 15px 0;"
              @keydown.tab="addContent(index, $event)"
            >
              <span class="num_icon">{{ (majorIndex + 1) | capIndex }}.</span>
              <Input
                :autofocus="true"
                placeholder="在输入框内点击tab键可以添加一项"
                required="true"
                v-model="log_content[index]['Major'][majorIndex].content"
                style="width: 80%;"
                @input="inputChange(index, majorIndex)"
                maxlength="50"
              />
              <span
                style="margin-left: 5px;border: 1px red solid;border-radius: 50%;padding: 2px;cursor: pointer;"
                @click="delContent(index, majorIndex)"
              >
                <Icon type="md-close" style="color: red;" />
              </span>
            </div>
            <div style="text-align: center;margin-bottom: 20px;">
              <Button
                size="small"
                type="success"
                shape="circle"
                @click="addContent(index)"
              >
                <Icon type="md-add" />
              </Button>
            </div>
          </template>

          <template slot-scope="{ row, index }" slot="btn">
            <div style="text-align: center;margin: 20px 0;">
              <Button
                type="error"
                :disabled="log_content.length === 1"
                @click="delTarget(index)"
                >删除项目
              </Button>
              <br />
              <br />
              <Button type="info" @click="addTarget">添加项目</Button>
            </div>
          </template>
        </Table>
      </Col>
    </Row>

    <Row>
      <Col style="text-align: right;margin: 25px;">
        <Button type="info" @click="emitLogList">提交周报</Button>
      </Col>
    </Row>

    <Row style="margin: 0 15px;">
      <Col>
        <h2>上周周报回顾</h2>
        <Table
          :columns="lastThead"
          :data="lastContent"
          :disabled-hover="true"
          :border="true"
        >
          <template slot-scope="{ row, index }" slot="target">
            <span class="num_icon">{{ (index + 1) | capNumber }}</span>
            <span style="font-weight: 700;font-size: 20px;">{{
              row.target
            }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="Major">
            <div
              :key="majorIndex"
              v-for="(target, majorIndex) in row.Major"
              style="margin: 15px 0;"
              @keydown.tab="addContent(index, $event)"
            >
              <span class="num_icon">{{ majorIndex + 1 }}.</span>
              {{ target.content }}
            </div>
          </template>
        </Table>
      </Col>
    </Row>

    <Spin
      size="large"
      style="position: fixed;top:0;left:0;right:0;bottom:0; "
      fix
      v-show="spinShow"
    ></Spin>
  </div>
</template>

<script>
  import HeaderNav from '@/components/Header/HeaderNav';
  export default {
    name: 'home',
    data() {
      return {
        putmodal: false /**修改密码的模态框显示 */,
        logout: false /**注销登录模态框修改 */,
        time: '' /**今天的时间 */,
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
        team_leader: [] /**级联选择器的绑定值 */,
        cascadeCurrent: '' /*当前选择的值*/,
        cascadeCurLabel: '',
        cascadeData: [],
        spinShow: false /*loading状态*/,
        tabHeader: [
          {
            title: '项目名称',
            slot: 'target',
            className: 'demo-table-info-column ',
          },
          {
            title: '工作内容',
            slot: 'Major',
            className: 'demo-table-info-column ',
          },
          {
            title: '操作',
            className: 'demo-table-info-column ',
            slot: 'btn',
          },
        ],
        log_content: [
          {
            target: '',
            Major: [{ content: '' }],
          },
        ],
        lastEmitTIme: '' /*上次提交时间*/,
        lastContent: [] /*上周周报内容*/,
        lastThead: [
          {
            title: '项目名称',
            slot: 'target',
            className: 'demo-table-info-column ',
          },
          {
            title: '工作内容',
            slot: 'Major',
            className: 'demo-table-info-column ',
          },
        ],
      };
    },
    components: {
      HeaderNav,
    },
    created() {
      this.getToday();
      let userData = JSON.parse(window.localStorage.getItem('userList'));
      // this.getLastUser();
      this.getWeekLogList();
      this.log_content = userData ? userData : this.log_content;
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
            },0)
          },1000)
        }else {
           this.$Message.info(respMsg);
        }
      },
      /**注销登录 */
      logoutFunc() {
        localStorage.removeItem('login');
        this.$router.push('/login');
      },
      getToday() {
        let time = new Date();
        this.time = `${time.getFullYear()}年${time.getMonth() +
          1}月${time.getDate()}日`;
      },
      /**获取上一次保存的用户*/
      // getLastUser() {
      //   const name = JSON.parse(localStorage.getItem('currentName'));
      //   if (name) {
      //     const { value, label } = name;
      //     this.cascadeCurrent = value;
      //     this.cascadeCurLabel = label;
      //     this.getWeekLogList();
      //   }
      // },
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
              this.$Notice.info({
                title: '获取用户列表失败',
              });
            }
          })
          .catch(err => {
            if (err) {
              this.$Notice.error({
                title: '服务器数据异常',
              });
            }
          });
      },

      /*删除工作*/
      delContent(index, majorIndex) {
        if (this.log_content[index]['Major'].length > 1) {
          this.log_content[index]['Major'].splice(majorIndex, 1);
        } else {
          this.$Notice.open({
            title: '提示',
            desc: '只剩最后一项了',
          });
        }
        this.saveUserData();
      },
      /*添加工作*/
      addContent(index) {
        if (
          !this.log_content[index]['Major'][
            this.log_content[index]['Major'].length - 1
          ]['content']
        ) {
          this.$Notice.warning({ desc: '有空的工作内容' });
        } else if (this.log_content[index]['Major'].length >= 10) {
          this.$Notice.info({ desc: '工作内容最多添加十条' });
        } else {
          this.log_content[index]['Major'].push({ content: '' });
        }
        this.saveUserData();
      },
      /*添加项目*/
      addTarget() {
        if (this.log_content.length < 5) {
          this.log_content.push({
            target: '',
            Major: [{ content: '' }],
          });
        } else {
          this.$Notice.info({
            title: '最多五个项目',
          });
        }
        this.saveUserData();
      },

      /*删除项目*/
      delTarget(index) {
        if (this.log_content.length > 1) {
          this.log_content.splice(index, 1);
        } else {
          this.$Notice.info({
            desc: '最后一条了',
          });
        }
        this.saveUserData();
      },

      /*提交周报*/
      emitLogList() {
        this.spinShow = true;
        const userId = JSON.parse(localStorage.getItem('login')).id
        
       if (!this.log_content.every(item => item.target)) {
          this.spinShow = false;

          return this.$Notice.error({
            title: '不要提交空的项目名称',
          });
        } else if (
          !this.log_content.every(item =>
            item.Major.every(list => list.content),
          )
        ) {
          this.spinShow = false;
          return this.$Notice.error({
            title: '请不要提交空的工作内容',
          });
        } else {
          setTimeout(() => {
              this.$http
                .post('/api/weekly/add_log', {
                  data: {
                    userId: userId+"",
                    body: JSON.stringify(this.log_content),
                  },
                })
                .then(res => {
                  if (res.data['respCode'] === '200') {
                    this.spinShow = false;
                    this.saveUserData();
                    setTimeout(() => {
                      this.$Notice.info({
                        title: '提交周报成功',
                      });
                      this.$router.push(`/show_log`);
                    }, 200);
                  } else {
                    this.$Notice.info({
                      title: '提交周报失败',
                    });
                    this.spinShow = false;
                  }
                })
                .catch(err => {
                  if (err) {
                    this.$Notice.error({
                      title: '服务器异常!',
                    });
                  }
                });
          }, 500);
        }
      },

      /*获取上周的周报*/
      getWeekLogList() {
        const userId = JSON.parse(localStorage.getItem('login'))
        if (userId) {
          this.$http
            .post('/api/weekly/get_last_logs', {
              data: {
                userId: userId.id + '',
              },
            })
            .then(res => {
              if (res.data['respCode'] === '200') {
                let { time, body } = res.data.data;
                if (time) {
                  this.lastEmitTIme = res.data.data.time;
                  if (body !== null) {
                    this.lastContent =
                      JSON.parse(res.data.data.body.body) != null
                        ? JSON.parse(res.data.data.body.body)
                        : [];
                  } else {
                    this.lastContent = [];
                  }
                } else {
                  this.$Notice.info({
                    title: '上周周报没有内容',
                  });
                  this.lastContent = [];
                  this.lastEmitTIme = '';
                }
              } else {
                this.$Notice.info({
                  title: '没有获取周报',
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
        }
      },

      /*选择用户的下拉框点击事件*/
      selectUser(e) {
        if (e !== undefined) {
          if (!this.cascadeCurrent) {
            this.lastEmitTIme = '';
            this.lastContent = [];
          }

          const { value, label } = e;
          localStorage.setItem('currentName', JSON.stringify({ value, label }));
          this.getWeekLogList();
        } else {
          localStorage.removeItem('currentName');
          this.lastEmitTIme = '';
          this.lastContent = [];
        }
      },

      /*保存用户的输入数据*/
      saveUserData() {
        window.localStorage.setItem(
          'userList',
          JSON.stringify(this.log_content),
        );
      },

      /**输入框的输入提示*/
      inputChange(index, majorIndex) {
        this.saveUserData();
        if (this.log_content[index]['Major'][majorIndex].content.length >= 50) {
          return this.$Notice.error({
            title: '内容过长，请新增一列',
          });
        }
      },

      targetChange(index) {
        this.saveUserData();
        if (this.log_content[index].target.length >= 50) {
          this.$Notice.error({
            title: '项目名称过长',
          });
        }
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
      capIndex(value) {
        if (value < 10) {
          return '0' + value;
        } else {
          return value;
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
<style lang="css">
  .ivu-table th.demo-table-info-column {
    background-color: #2db7f5;
    color: #fff;
    text-align: center;
  }

  .wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .num_icon {
    font-size: 18px;
    font-weight: 700;
    line-height: 100%;
    margin: 0 5px;
  }

    .demo-spin-container{
    	display: inline-block;
        width: 200px;
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
  
</style>
