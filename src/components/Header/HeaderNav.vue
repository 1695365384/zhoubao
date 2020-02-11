<template>
  <div>
    <Menu mode="horizontal" theme="primary" active-name="home" @on-select="menuClick">
      <MenuItem v-for="menu in menuItemList" :name="menu.name" :key="menu.name">
        <Icon :type="menu.icon"/>
        {{menu.text}}
      </MenuItem>

    </Menu>


  </div>
</template>

<script>
    export default {
        name: "HeaderNav",
        data() {
            return {

                menuItemList: [/*按钮的选项*/
                    {text: "写工作日志", icon: 'ios-paper', name: "home"},
                    // {text:"读取工作日志",icon:'ios-people',name:"showLog"},
                ]

            };
        },

        created() {
            let login = JSON.parse(window.localStorage.getItem('admin'))
            this.loginStatus = login ? true : false
            this.isAdmin()
        },

        watch: {},
        methods: {


            /***点击导航选项 */
            menuClick(name) {
                this.$router.push(`/${name}`)
            },

            /**判断是否是登录页面*/

            isAdmin() {
                let path = this.$router
                console.log(path)
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
