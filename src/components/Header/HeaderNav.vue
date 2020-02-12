<template>
  <div class="headerNav">
    <Menu
      mode="horizontal"
      theme="primary"
      active-name="home"
      @on-select="menuClick"
    >
      <MenuItem v-for="menu in menuItemList" :name="menu.name" :key="menu.name">
        <Icon :type="menu.icon" />
        {{ menu.text }}
      </MenuItem>

      <MenuItem style="float:right;margin-right:25px;" name="menuRight">
        <span class="userRight"> {{ userName }}</span>

        <Dropdown @on-click="putPass">
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
          { text: '写工作日志', icon: 'ios-paper', name: 'home' },
          { text: '工作日志记录', icon: 'ios-people', name: 'show_log' },
        ],

        userName: '',
        userId: '',
        putmodal: false,
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
        this.$router.push(`/${name}`);
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

  .headerNav {
    padding: 0 -15px 0 -15px;
  }
</style>
