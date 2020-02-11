<template>
  <div id="app">
    <Layout>
      <Header-nav v-if="loginStatus"></Header-nav>
      <Content>
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script>
import HeaderNav from './components/Header/HeaderNav';
import Login from './utils/loginStorage.js'
const isLogin =  Login.isLogin();
export default {
  name: "app",
  data(){
    return {
      loginStatus:undefined
    }
  },
  components: {
    HeaderNav
  },
  created(){
    if(isLogin){

    }
  }
};
</script>




