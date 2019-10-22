<template>
  <div>
    <Menu mode="horizontal" theme="primary">
      <MenuItem :name="0">
        <div class="header_navbar">工作日志处理系统</div>
      </MenuItem>

      <MenuItem :name="2">
        <div class="nav_item">写工作日志</div>
      </MenuItem>

      <MenuItem :name="3">
        <div class="nav_item">读取工作日志</div>
      </MenuItem>

      <div class="login">
        <span style="color:#fff;margin-right:20px;" v-show="loginStatus">刘为怀</span>
        <Button type="info" @click="loginClick">{{!loginStatus?'点我登录':"退出登录"}}</Button>
      </div>
    </Menu>

    <!-- 登录模态框 -->
    <Modal
      v-model="loginModal"
      title="管理员登录"
      @on-ok="fetchLogin"
      ok-text="登录"
      @on-cancel="loginModal=false"
    >
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="请输入账号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <br>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="请输入密码" maxlength="8">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "HeaderNav",
  data() {
    return {
      loginStatus: false,
      loginModal: false,
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 8,
            message: "密码长度不能超过8",
            trigger: "blur"
          }
        ]
      }
    };
  },

  created(){
    let login=JSON.parse(window.localStorage.getItem('admin'))
    this.loginStatus=login?true:false
  },
  methods: {
    /**打开登录模态框 */
    loginClick() {
      if (!this.loginStatus) {
        this.loginModal = true;
      }else {
        window.localStorage.removeItem('admin')
        this.loginStatus=false
      }

    },
    /**登录发请求 */  
    fetchLogin() {
      this.loginStatus = !this.loginStatus;
      window.localStorage.setItem('admin',JSON.stringify(this.formInline))
    }
  }
};
</script>

<style lang="css">
.header_navbar {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  float: left;
}

.login {
  float: right;
  margin-right: 50px;
}

</style>
