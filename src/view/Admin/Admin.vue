<template>
  <div style="padding: 0 25px;">
    <Row>
      <Col>
        <Menu :theme="'dark'" class="menuWrapper" mode="horizontal" :active-name="activePath" @on-select="menuClick">
          <MenuItem name="user">
            用户管理
          </MenuItem>

          <MenuItem name="admin_log">
            读取周报
          </MenuItem>

          <div class="login">
            <span style="margin-right:20px;"><Icon type="md-contact" size="'18'" />&nbsp;{{adminName?adminName:'未登录'}}</span>
            <Button type="info" @click="loginClick">{{adminName?'退出登录':"点我登录"}}</Button>
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
      @on-ok="fetchLogin"
      ok-text="登录"
      @on-cancel="loginModal=false"
    >
      <Form ref="formInline" :model="formInline" :ruleInline="ruleInline" inline>
        <FormItem prop="user">
          <Input type="text" v-model="formInline.user" placeholder="请输入账号">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <br>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="请输入密码" maxlength="50">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
    </Modal>


<!--    确定退出登录模态框-->
    <Modal
      v-model="loginOut"
      title="提示"
      @on-ok="loginOutClick"
      ok-text="是"
      cancel-text="否"
      @on-cancel="loginOut=false">
      <p>是否退出登录</p>
    </Modal>
  </div>
</template>

<script>
    export default {
        name: 'admin',
        data() {
            return {
                loginStatus: true,
                loginModal: false,
                loginOut:false ,

                activePath:"",/**当前路由*/
                formInline: {
                    user: "",
                    password: ""
                },
                adminName: '', /**管理员名称*/
                adminLoginShow: false,
                ruleInline: {/*表单校验*/
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
                },
            }
        },
        created() {
            if (!this.getAuth()) {
                this.loginModal = true
            } else {
                let admin = JSON.parse(window.localStorage.getItem('admin'))
                let {name} = admin
                this.adminName = name
            }

            this.getUrlPath()
        },
        methods: {
            menuClick(path) {
                this.$router.push(`/admin/${path}`)
            },

            /**获取登陆状态*/
            getAuth() {
                let admin = !!window.localStorage.getItem('admin')
                return admin
            },

            /**打开登录模态框 */
            loginClick() {
                if (!this.adminName) {
                    this.loginModal = true
                } else {
                    this.loginOut=true
                }
            },

            /**退出登录*/
            loginOutClick(){
                window.localStorage.removeItem('admin')
                this.adminName = ''
                this.$Notice.info({
                    title:'退出登录成功'
                })
               window.location.reload();
            },

            /**登录发请求 */
            fetchLogin() {
                let data = {
                    userName: this.formInline.user,
                    passWord: this.formInline.password
                }
                this.$http.post('/api/sys_user/login', {data: data}).then(res => {
                    if (res.data.respCode === '200') {
                        this.$Notice.info({
                            title: '登陆成功'
                        })
                        this.adminName = res.data.data.name
                        window.localStorage.setItem('admin', JSON.stringify(res.data.data))
                      this.$router.push(`/admin/admin_log`)
                    }else {
                      this.$Notice.error({
                        title:res.data.respMsg
                      })
                      this.loginModal=true
                    }
                })

            },


            /**获取地址栏*/
            getUrlPath(){
                let path=this.$route.path
                let url=path.split('/admin/')[1]
                this.activePath=url
            },


        }
    }
</script>

<style >

.login {
  position: relative;
}
.login span {
  color: #fff;
}
 .ivu-icon{
    font-size: 46px;
    position: absolute;
    left: -30%;
    top: 10%;
  }
  .menuWrapper {
    margin-left: -25px; 
    margin-right: -25px;
  }
</style>
