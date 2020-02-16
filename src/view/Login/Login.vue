<template>
  <div class="yinlianBG" @keypress.enter="showCaptcha">
    <Row>
      <Col span="24" :xl="{ span: '24' }" :lg="{ span: '22' }">
        <Spin
          size="large"
          style="position: fixed;top:0;left:0;right:0;bottom:0; "
          fix
          v-show="spinShow"
        ></Spin>

        <Captcha
          @onSuccess="onSuccess"
          :captchaModal="captchaModal"
          @modalChange="modalChange"
        />
        <div class="userTitle">
          <h2>研究院外包</h2>
          <p>工作日志处理系统</p>
        </div>

        <div class="container">
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="userName">
              <Input
                type="text"
                v-model="formInline.userName"
                placeholder="用户名"
                autofocus
              >
                <Icon slot="prefix" type="ios-person-outline"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="passWord">
              <Input
                type="password"
                v-model="formInline.passWord"
                placeholder="密码"
              >
                <Icon slot="prefix" type="ios-lock-outline"></Icon>
              </Input>
            </FormItem>
          </Form>

          <Button
            type="primary"
            @click="showCaptcha"
            size="large"
            long
            shape="circle"
            >登录</Button
          >
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import Captcha from '../../components/Captcha/captcha';
  export default {
    name: 'Login',
    data() {
      return {
        errModal: false,
        msg: '',
        isValidate: false,
        captchaModal: false,
        formInline: {
          userName: '',
          passWord: '',
        },
        formValidate: false,
        ruleInline: {
          userName: [
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
          passWord: [
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
        errMsg: '',
        slide: undefined,
        spinShow: false,
      };
    },
    components: {
      Captcha,
    },
    mounted() {},
    methods: {
      showCaptcha() {
        this.$refs['formInline'].validate(value => {
          if (value) {
            this.captchaModal = true;
          }
        });
      },
      onSuccess(status) {
        if (status === 'success') {
          this.login();
        }
      },
      modalChange(status) {
        this.captchaModal = status;
      },
      async login() {
        this.spinShow = true;
        const result = await this.$http.post('/api/userLogin', {
          data: {
            userName: this.formInline.userName,
            passWord: this.formInline.passWord,
          },
        });
        const code = result.data.respCode;
        const userData = result.data.data;
        if (code === '200') {
          window.localStorage.setItem('login', JSON.stringify(userData));
          setTimeout(() => {
            this.spinShow = false;
            this.captchaModal = false;
            this.$router.push('/home');
          }, 1000);
        } else {
          this.isValidate = false;
          this.captchaModal = false;
          this.$Modal.confirm({
            title: '提示',
            content: `<p>${result.data.respMsg}</p>`,
            onOk: () => {
              this.spinShow = false;
            },
            onCancel: () => {
              this.spinShow = false;
            },
          });
        }
      },
    },
    watch: {
      'formInline.userName': function() {
        this.$refs['formInline'].validate(value => {
          this.formValidate = value;
        });
      },
      'formInline.passWord': function() {
        this.$refs['formInline'].validate(value => {
          this.formValidate = value;
        });
      },
    },
  };
</script>

<style scoped lang="css">
  .ivu-btn-primary {
    color: #fff;
    background-color: #3f35dc;
    border-color: #2d8cf0;
    background: linear-gradient(to right, #3f35dc 0%, #527ff8 100%);
  }
  .yinlianBG {
    height: 100%;
    width: 100%;
    background: url('../../assets/login_BG.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
  }
  #msg {
    margin-top: 15px;
  }

  .userTitle {
    position: absolute;
    top: 15rem;
    height: 10rem;
    left: 10%;
    width: 100%;
  }
  .userTitle h2 {
    color: #333333;
    font-size: 66px;
    font-weight: 500;
  }

  .userTitle p {
    font-size: 30px;
    color: #a9a9a9;
  }
  .container {
    width: 20rem;
    height: 20rem;
    position: absolute;
    left: 10%;
    top: 30rem;
    z-index: 1;
  }

  .ivu-input-group-append,
  .ivu-input-group-prepend {
  }
  /* .container::after {
    content: '';
    position: absolute;
    top: -10%;
    left: -20%;
    height: 120%;
    width: 140%;
    z-index: -1;
    background-color: #000;
    opacity: 0.5;
    border-radius: 15px;
    border: 1px solid #fff;
  } */

  #msg {
    width: 100%;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
  }
  a:link,
  a:visited,
  a:hover,
  a:active {
    margin-left: 100px;
    color: #0366d6;
  }
</style>
