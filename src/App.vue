<template>
  <div id="app">
    <Layout>
      <Header-nav></Header-nav>
      <Content>
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script>
import HeaderNav from './components/Header/HeaderNav'
export default {
  name: "app",
  
  components: {
    HeaderNav
  },

};
</script>




