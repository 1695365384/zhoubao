<template>
  <div class="yinlianBG">
     <Spin
      size="large"
      style="position: fixed;top:0;left:0;right:0;bottom:0; "
      fix
      v-show="spinShow"
    ></Spin>
    <Modal
      v-model="errModal"
      title="提示"
      @on-ok="ok"
      @on-cancel="cancel"
      :mask-closable="false"
    >
      <p>{{ errMsg }}</p>
    </Modal>
    <div class="container">
      <h2 class="userTitle">用户登录</h2>
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="userName">
          <Input
            type="text"
            v-model="formInline.userName"
            placeholder="Username"
          >
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="passWord">
          <Input
            type="password"
            v-model="formInline.passWord"
            placeholder="Password"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
      <!-- 验证码 -->
      <div ref="captcha" id="captcha" v-show="isSlide"></div>
      <!-- 验证结果 -->
      <div id="msg">
        <Button
          type="success"
          @click="login()"
          size="large"
          long
          shape="circle"
          :disabled="!isBtnShow"
          >登录</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
  import './slideBlock.css';
  import './slideBlock.js';

  export default {
    name: 'Login',
    data() {
      return {
        errModal: false,
        msg: '',
        isValidate: false,
        isSlide: true,
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
              trigger: 'change',
            },
            {
              type: 'string',
              max: 8,
              message: '用户名太长了',
              trigger: 'change',
            },
          ],
          passWord: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'change',
            },
            {
              type: 'string',
              max: 10,
              message: '密码的长度不能超过10位',
              trigger: 'change',
            },
            {
              type: 'string',
              min: 6,
              message: '密码长度不能短过6位',
              trigger: 'change',
            },
          ],
        },
        errMsg: '',
        slide: undefined,
        spinShow:false
      };
    },
    mounted() {
      this.getCaptcha();
    },
    methods: {
      getCaptcha() {
      this.slide=  jigsaw.init({
          el: this.$refs.captcha,
          onSuccess: this.onSuccess,
          onFail: this.onFail,
          onRefresh: this.cleanMsg,
        });
      },
      onSuccess() {
        // 后台登录认证
        this.isValidate = true;
      },
      onFail() {
      },
      cleanMsg() {
      },
      ok() {
        this.slide.reset();
      },
      cancel() {
        this.slide.reset();
      },

      async login() {
        const result = await this.$http.post('/api/userLogin', {
          data: {
            userName: this.formInline.userName,
            passWord: this.formInline.passWord,
          },
        });
        const code = result.data.respCode;
        const userData = result.data.data;
        if (code === '200') {
          window.localStorage.setItem('login',JSON.stringify(userData))
          this.spinShow = true
          setTimeout(()=>{
            this.spinShow=false
            this.$router.push('/home')
          },1000)
        } else {
          this.errModal = true;
          this.isValidate = false;
          this.errMsg = result.data.respMsg
        }
      },
    },
    computed: {
      isBtnShow: function() {
        if (this.formValidate && this.isValidate) {
          return true;
        } else {
          return false;
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
  .yinlianBG {
    height: 100%;
    width: 100%;
    background: url('../../assets/yjywaibao.jpg') no-repeat;
    background-size: 100% 100%;
  }
  #msg {
    margin-top: 15px;
  }
  .userTitle {
    font-size: 26px;
    font-weight: 500;
    color: #fff;
    text-align: center;
  }
  .container {
    width: 310px;
    height: auto;
    position: absolute;
    left: 50%;
    margin-left: 250px;
    top: 50%;
    margin-top: -155px;
    z-index: 1;
  }
  .container::after {
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
  }
  input {
    display: block;
    width: 100%;
    line-height: 40px;
    margin: 10px 0;
    padding: 0 10px;
    outline: none;
    border: 1px solid #c8cccf;
    border-radius: 4px;
    color: #6a6f77;
  }
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
