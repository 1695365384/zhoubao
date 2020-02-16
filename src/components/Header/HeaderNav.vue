<template>
  <div class="headerNav">
    <Menu
      mode="horizontal"
      theme="primary"
      active-name="0"
      @on-select="menuClick"
    >
      <MenuItem name="0">
        <Icon type="md-brush" />
        写工作日志
      </MenuItem>

      <!-- <MenuItem name="1">
        <Icon type="ios-paper" />
        读工作日志
      </MenuItem> -->

      <MenuItem style="float:right;margin-right:25px;" name="menuRight">
        <!-- <span class="userRight">
          <Icon type="md-contact" :size="'25px'" />&nbsp; {{ userName }}</span
        > -->

        <Dropdown @on-click="putPass"  trigger="click" >
           <span class="userRight">
          <Icon type="md-contact" :size="'25px'" />&nbsp; {{ userName }}</span
        >
          <Icon type="ios-arrow-down"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="putPass">修改密码</DropdownItem>
            <DropdownItem name="logout">注销登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
  export default {
    name: 'HeaderNav',
    data() {
      
      return {
        menuItemList: [
          /*按钮的选项*/
          { text: '写工作日志', icon: 'md-brush', name: 'home' },
          { text: '读工作日志', icon: 'ios-paper', name: 'show_log' },
        ],

        userName: '',
        userId: '',
        putmodal: false,
        activeMenu: '',
      };
    },

    created() {
      this.getLoginInfo();
    },

    watch: {},
    methods: {
      /***点击导航选项 */
      menuClick(name) {
        if (name === 'menuRight') {
          return;
        }
        this.activeMenu = name;
        this.$router.push(`/${this.menuItemList[name].name}`);
      },

      getLoginInfo() {
        const user = JSON.parse(localStorage.getItem('login'));
        this.userName = user.userName;
        this.userId = user.id;
      },
      //修改密码
      putPass(name) {
        this.$emit('showModal', name);
      },
    },
  };
</script>

<style lang="css" >
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

  .headerNav {
    padding: 0 -15px 0 -15px;
  }

  .ivu-menu-item .ivu-icon {
    font-size: 18px;
  }

  .ivu-menu-item .ivu-icon.ivu-icon-md-contact {
    position: absolute;
    font-size: 46px;
    top: 10%;
    left: -80%;
  }

  /* .ivu-menu-item-active ,.ivu-menu-item-selected {
    color: #ccc !important;
  } */
</style>
