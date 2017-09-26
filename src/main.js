// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import promise from 'es6-promise'
promise.polyfill();//axios兼容ie
import axios from 'axios';  //ajax请求
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import App from './App';
import router from './router';
//基本样式
import './assets/css/base.css'
import './assets/font_icon/iconfont.css'
// import store from './store';
import './assets/common/reseteAjax.js' //ajax

Vue.prototype.$http = axios;
Vue.use(ElementUI);
Vue.use(Mint);
Vue.config.productionTip = false;

/*全局登录信息*/
Vue.prototype.global_user={global_userName:'',global_name:''};
/*添加人员信息全局信息*/

//时间格式化
Vue.filter('date', function(input){
  let oDate = new Date(input);
  return oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+' '+ (oDate.getHours()< 10 ? '0'+oDate.getHours() : oDate.getHours() )+':'+ (oDate.getMinutes()< 10 ? '0'+ oDate.getMinutes() : oDate.getMinutes())+':'+ (oDate.getSeconds()< 10 ? '0'+ oDate.getSeconds() : oDate.getSeconds());
});
Vue.filter('dateNum', function(input){
  let oDate = new Date(input);
  return oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate();
});
Vue.filter('dateForm', function(input){
  let dateFarm = new Date(input);
  return dateFarm.getFullYear()+'-'+(dateFarm.getMonth()+1)+'-'+dateFarm.getDate()+'  '+dateFarm.getHours()+':'+dateFarm.getMinutes()+':'+dateFarm.getSeconds();
});
//字符串截断
Vue.filter('trunc', function(value,num) {
  if(!value){
    return false;
  }else if(value.length <= num){
    return value;
  }else{
    let return_value = String(value);
    return return_value.substring(0,num)+"...";
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
