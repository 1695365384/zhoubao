 class Login {
  token = '';
  loginUrl = 'api/login';
  constructor() {}

  //判断登录状态
  isLogin() {
    const stroage = localStorage.getItem('login');
    if (stroage) {
      this.token = JSON.parse(stroage);
      return true;
    } else {
      this.token = undefined;
      return false;
    }
  }

  //登录
  async loginSatart(userName, password) {
   
  }
}
const login =  new Login();
export default login

  
