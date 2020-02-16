<template>
  <div class="wrap">
    <Modal
      v-model="putmodal"
      :mask-closable="false"
      @on-visible-change="putPassModalChage"
      title="修改用户密码"
    >
      <Form
        :model="putPassForm"
        :rules="putPassFormRule"
        label-position="left"
        :label-width="100"
        ref="putPassForm"
      >
        <FormItem label="旧密码" prop="usedPassWord">
          <Input
            v-model="putPassForm.usedPassWord"
            placeholder="请输入原始密码"
            type="password"
          />
        </FormItem>
        <FormItem label="新密码" prop="passWord">
          <Input
            v-model="putPassForm.passWord"
            placeholder="新密码"
            type="password"
          />
        </FormItem>
        <FormItem label="确认密码" prop="againPass">
          <Input
            v-model="putPassForm.againPass"
            type="password"
            placeholder="确认密码"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" @click="putOk">确定</Button>
        <Button type="text" @click="putmodal = false">取消</Button>
      </div>
    </Modal>
    <Spin
      size="large"
      style="position: fixed;top:0;left:0;right:0;bottom:0;z-index:999; "
      fix
      v-show="spinShow"
    ></Spin>
    <Captcha
      @onSuccess="onSuccess"
      :captchaModal="captchaModal"
      @modalChange="modalChange"
    />
    <Row>
      <Col>
        <Menu
          :theme="'dark'"
          class="menuWrapper"
          mode="horizontal"
          :active-name="activePath"
          @on-select="menuClick"
        >
          <MenuItem name="user">
            用户管理
          </MenuItem>

          <MenuItem name="admin_log">
            读取周报
          </MenuItem>

          <div class="login">
            <!-- <span style="margin-right:20px;"
              ><Icon type="md-contact" size="46"  />&nbsp;{{
                adminName ? adminName : '未登录'
              }}</span
            > -->
            <Dropdown trigger="click" @on-click="dropClick">
              <a href="javascript:void(0)">
                <span
                  ><Icon
                    type="md-contact"
                    size="46"
                    class="adminIcon"
                  />&nbsp;{{ adminName ? adminName : '未登录' }}</span
                >
                <Icon
                  type="ios-arrow-down"
                  size="20"
                  style="color:#fff;"
                ></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="loginout" v-show="adminName"
                  >退出登录</DropdownItem
                >
                <DropdownItem name="login" v-show="!adminName"
                  >登录</DropdownItem
                >
                <DropdownItem name="putPass" v-show="adminName">
                  修改密码</DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
            <!-- <Button type="info" @click="loginClick">{{
              adminName ? '退出登录' : '点我登录'
            }}</Button> -->
          </div>
        </Menu>
      </Col>
    </Row>
    <Row>
      <Col v-if="adminName">
        <router-view></router-view>
      </Col>
    </Row>

    <!-- 登录模态框 -->
    <Modal
      v-model="loginModal"
      title="管理员登录"
      @on-ok="isLoginNow"
      ok-text="登录"
      @on-cancel="loginModal = false"
    >
      <Form
        ref="formInline"
        :model="formInline"
        :ruleInline="ruleInline"
        inline
      >
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="请输入账号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <br />
        <FormItem prop="password">
          <Input
            type="password"
            v-model="formInline.password"
            placeholder="请输入密码"
            maxlength="50"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import Captcha from '../../components/Captcha/captcha';
  export default {
    name: 'admin',
    data() {
      return {
        captchaModal: false,
        loginStatus: true,
        loginModal: false,
        loginOut: false,

        activePath: '' /**当前路由*/,
        formInline: {
          user: '',
          password: '',
        },
        adminName: '' /**管理员名称*/,
        adminLoginShow: false,
        ruleInline: {
          /*表单校验*/
          user: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur',
            },
            {
              type: 'string',
              max: 12,
              message: '用户名太长了',
              trigger: 'blur',
            },
            {
              type: 'string',
              message: '禁止使用下划线等特殊符号',
              trigger: 'blur',
              validator: (rule, value) => {
                const reg = new RegExp('_', 'g');
                return !reg.test(value);
              },
            },
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur',
            },
            {
              type: 'string',
              max: 18,
              message: '密码的长度不能超过18位',
              trigger: 'blur',
            },
            {
              type: 'string',
              min: 8,
              message: '密码长度不能少于8位',
              trigger: 'blur',
            },
            {
              type: 'string',
              message: '禁止使用下划线等特殊符号',
              trigger: 'blur',
              validator: (rule, value) => {
                const reg = new RegExp('_', 'g');
                return !reg.test(value);
              },
            },
          ],
        },
        spinShow: false,

        putPassFormRule: {
          usedPassWord: [
            {
              required: true,
              message: '旧密码不能为空',
              trigger: 'blur',
            },
            {
              type: 'string',
              max: 18,
              message: '密码长度不要大于18位',
              trigger: 'blur',
            },
          ],
          againPass: [
            {
              required: true,
              message: '确认密码不能为空',
              trigger: 'blur',
            },
            {
              type: 'string',
              min: 8,
              message: '密码长度不要少于6位',
              trigger: 'blur',
            },
            {
              type: 'string',
              max: 18,
              message: '密码长度不要大于18位',
              trigger: 'blur',
            },
            {
              type: 'string',
              message: '两次输入的密码不一致',
              trigger: 'blur',
              validator: (rule, value) => {
                return value === this._data.putPassForm.passWord;
              },
            },
            {
              type: 'string',
              message:
                '密码必须是8-16位且必须同时包含数字,大小写字母,特殊字符不限制,下划线除外',
              trigger: 'blur',
              validator: (rule, value) => {
                const reg = new RegExp(
                  '^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9\\W]{8,16}$',
                  'g',
                );
                return reg.test(value);
              },
            },
          ],
          passWord: [
            {
              required: true,
              message: '新密码不为能空',
              trigger: 'blur',
            },
            {
              type: 'string',
              message: '新密码不能和旧密码相同',
              trigger: 'blur',
              validator: (rule, value) => {
                return value !== this._data.putPassForm.usedPassWord;
              },
            },
            {
              type: 'string',
              min: 8,
              message: '密码长度不要少于8位',
              trigger: 'blur',
            },
            {
              type: 'string',
              max: 18,
              message: '密码长度不要大于18位',
              trigger: 'blur',
            },
            {
              type: 'string',
              message:
                '密码必须是8-16位且必须同时包含数字,大小写字母,特殊字符不限制,下划线除外',
              trigger: 'blur',
              validator: (rule, value) => {
                const reg = new RegExp(
                  '^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9\\W]{8,16}$',
                  'g',
                );
                return reg.test(value);
              },
            },
          ],
        },
        putmodal: false /**修改密码的模态框显示 */,
        logout: false /**注销登录模态框修改 */,
        putPassForm: {
          usedPassWord: '',
          passWord: '',
          againPass: '',
        },
      };
    },
    components: {
      Captcha,
    },
    created() {
      if (!this.getAuth()) {
        this.loginModal = true;
      } else {
        let admin = JSON.parse(window.localStorage.getItem('admin'));
        let { name } = admin;
        this.adminName = name;
      }
      this.getUrlPath();
    },
    methods: {
      putPassModalChage(status) {
        if (!status) {
          this.$refs['putPassForm'].resetFields();
        }
      },
      putOk() {
        this.$refs['putPassForm'].validate(async valid => {
          if (valid) {
            this.spinShow = true;
            const { passWord, usedPassWord } = this.putPassForm;
            const userinfo = JSON.parse(localStorage.getItem('admin'));
            const result = await this.$http.post('/api/sys_user/putPassword', {
              data: {
                id: String(userinfo.id),
                passWord: passWord.trim(),
                usedPassWord: usedPassWord.trim(),
              },
            });

            const { respCode, respMsg } = result.data;

            if (respCode === '200') {
              this.putmodal = false;
              this.$Message.info('修改密码成功,正在跳转登录页面重新登录');
              setTimeout(() => {
                this.$refs['putPassForm'].resetFields();
                setTimeout(() => {
                  this.spinShow = false;
                  this.loginOutClick();
                }, 0);
              }, 1000);
            } else {
              this.$Message.info(respMsg);
            }
          } else {
            return;
          }
        });
      },
      isLoginNow() {
        this.$refs['formInline'].validate(valid => {
          if (valid) {
            this.captchaModal = true;
            this.loginModal = false;
          } else {
            return;
          }
        });
      },

      dropClick(name) {
        if (name === 'login') {
          this.loginModal = true;
        } else if (name === 'loginout') {
          this.loginOutFunc();
        } else if (name === 'putPass') {
          this.putmodal = true;
        }
      },
      onSuccess(status) {
        if (status === 'success') {
          this.fetchLogin();
        }
      },
      menuClick(path) {
        this.$router.push(`/admin/${path}`);
      },
      modalChange(modalStatus) {
        this.captchaModal = modalStatus;
        if (!modalStatus && !this.spinShow) {
          this.loginModal = true;
        }
      },
      /**获取登陆状态*/
      getAuth() {
        let admin = !!window.localStorage.getItem('admin');
        return admin;
      },

      /**退出登录*/
      loginOutClick() {
        this.spinShow = true;

        setTimeout(() => {
          window.localStorage.removeItem('admin');
          this.adminName = '';
          this.$Notice.info({
            title: '退出登录成功',
          });
          this.spinShow = false;
          window.location.reload();
        }, 1000);
      },

      /**退出登录模态框 */
      loginOutFunc() {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定要退出登录吗?</p>',
          onOk: () => {
            this.loginOutClick();
          },
          onCancel: () => {},
        });
      },

      /**登录发请求 */
      fetchLogin() {
        this.spinShow = true;

        let data = {
          userName: this.formInline.user,
          passWord: this.formInline.password,
        };
        this.$http.post('/api/sys_user/login', { data: data }).then(res => {
          if (res.data.respCode === '200') {
            this.spinShow = false;
            this.$Notice.info({
              title: '登陆成功',
            });
            this.adminName = res.data.data.name;
            const {userName,id,relation,name} = res.data.data

            window.localStorage.setItem('admin', JSON.stringify({userName,id,relation,name}));
            this.$router.push(`/admin/admin_log`);
          } else {
            this.$Notice.error({
              title: res.data.respMsg,
            });
            this.spinShow = false;
            this.loginModal = true;
          }
        });
      },

      /**获取地址栏*/
      getUrlPath() {
        let path = this.$route.path;
        let url = path.split('/admin/')[1];
        this.activePath = url;
      },
    },
  };
</script>

<style lang="css" scoped>
  .wrap {
    position: relative;
  }
  .login {
    position: relative;
  }
  .login span {
    color: #fff;
  }

  .adminIcon {
    position: absolute;
    left: -3rem;
    top: 10%;
  }
  /* .menuWrapper .ivu-icon {
    font-size: 46px;
    position: absolute;
    left: -30%;
    top: 10%;
  } */
</style>
