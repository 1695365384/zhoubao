<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
 import HeaderNav from '@/components/Header/HeaderNav';
  export default {
    name: 'app',
    components:{
      HeaderNav
    },
    data(){
      return {
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
        putmodal: false /**修改密码的模态框显示 */,
        logout: false /**注销登录模态框修改 */,
        putPassForm: {
          usedPassWord: '',
          passWord: '',
          againPass: '',
        },
      }
    },

    methods:{
      showModal(name){
        console.log(name)
      },
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
     




    
    }
  };
</script>
