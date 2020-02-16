<template>
  <div>
    <Modal
          v-model="captchaModalIsShow"
          title="验证"
          :mask-closable="false"
          footer-hide
          @on-visible-change="modalChange"
        >
          <!-- 验证码 -->
           <div ref="captcha" id="captcha"></div>
        </Modal>
    </div>
</template>

<script>
  import './slideBlock.js';

  export default {
    name: 'captcha',
    data(){
      return {
          captchaModalIsShow:false,
          captcha:undefined,
      }
    },
    props:{
      captchaModal:{
        type:Boolean
      }
    },
    created() {},

    mounted() {
      this.getCaptcha();
    },
    methods: {
      getCaptcha() {
       this.captcha= jigsaw.init({
          el: this.$refs.captcha,
          onSuccess: this.onSuccess,
          onFail: this.onFail,
          onRefresh: this.cleanMsg,
        });
      },
        onSuccess() {
        this.$emit('onSuccess','success')
          this.captchaModalIsShow = false
      },
      modalChange(status){
        if(status){
          this.captcha.reset()
        }
        this.$emit('modalChange',status)
        this.captchaModalIsShow = status
      },
      onFail() {},
      cleanMsg() {},
    },

    computed:{
      isShow:function(){
        return this.captchaModal
      }
    },
    watch:{
      captchaModal:function(newVal,oldVal){
        this.captchaModalIsShow = newVal
      }
    }
  };
</script>
<style lang="css" scoped>
  @import url('./slideBlock.css');
</style>
