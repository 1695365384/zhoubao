<template>
  <div>
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

    <!-- <Modal
      v-model="logout"
      :mask-closable="false"
      title="确定要注销登录吗"
      @on-ok="logoutFunc"
      @on-cancel="logout = false"
    >
    </Modal> -->

    <Layout>
      <Header-nav @showModal="showModal"></Header-nav>
      <Content>
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script>
  import HeaderNav from '@/components/Header/HeaderNav';
  export default {
    name: 'index',
    components: {
      HeaderNav,
    },
    data() {
      return {
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
              message: '密码必须是8-16位且必须同时包含数字,大小写字母,特殊字符不限制,下划线除外',
              trigger: 'blur',
              validator: (rule, value) => {
                const reg = new RegExp('^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9\\W]{8,16}$', 'g');
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
              message: '密码必须是8-16位且必须同时包含数字,大小写字母,特殊字符不限制,下划线除外',
              trigger: 'blur',
              validator: (rule, value) => {
                const reg = new RegExp('^(?![a-z0-9]+$)(?![A-Za-z]+$)(?![A-Z0-9]+$)[a-zA-Z0-9\\W]{8,16}$', 'g');
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

    methods: {
      putPassModalChage(status) {
        if (!status) {
          this.$refs['putPassForm'].resetFields();
        }
      },
      //显示修改密码模态框
      showModal(isShow) {
        if (isShow === 'putPass') {
          this.putmodal = true;
        } else if (isShow === 'logout') {
          const loginout = this.logoutFunc;
          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定要退出登录吗?</p>',
            onOk: () => {
              loginout();
            },
            onCancel: () => {},
          });
        }
      },
      putOk() {
        this.$refs['putPassForm'].validate(async valid => {
          if (valid) {
            this.spinShow = true;
            const { passWord, usedPassWord } = this.putPassForm;
            const userinfo = JSON.parse(localStorage.getItem('login'));
            const result = await this.$http.post('/api/putPassWord', {
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
                localStorage.removeItem('login');
                setTimeout(() => {
                  this.spinShow = false;
                  this.$router.push('/login');
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
      /**注销登录 */
      logoutFunc() {
        localStorage.removeItem('login');
        this.$router.push('/login');
      },
    },
  };
</script>
