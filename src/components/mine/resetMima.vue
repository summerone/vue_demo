<template>
  <div class="resetMima pb60" >
    <mt-header title="修改密码">
      <router-link :to="{ path:'/selfMessage' }" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <mt-field  placeholder="原密码" type="password" v-model="old_password"></mt-field>
    <mt-field  placeholder="新密码" type="password" v-model="new_password"></mt-field>
    <mt-field  placeholder="确认密码" type="password" v-model="confirm_password"></mt-field>

    <div style="text-align: center;">
      <mt-button type="primary" style="width: 100%;" class="mt20" @click.native="submit">确定</mt-button>
    </div>
  </div>
</template>
<script>
  export default{
      name:'resetMima',
      methods:{
        submit:function(){
          var vm=this;

          if (vm.old_password==null||vm.new_password==null){
            vm.$messagebox.alert('密码不能为空');
            return;
          }

          if(!vm.check(vm.old_password)||!vm.check(vm.new_password)){
            vm.$messagebox.alert('请输入6位数字密码');
            return;
          }

          if (vm.new_password!=vm.confirm_password){
            vm.$messagebox.alert('确认密码错误');
            return;
          }
          this.$http.post('/mine/changePwd', {
              oldPwd: vm.old_password,
              newPwd: vm.new_password
          }).then(function (res) {
            if(res.data.code==100){
              vm.$messagebox.alert(res.data.msg);
              /*修改成功后自动调登录接口*/
              setTimeout( () => {vm.login(vm.global_user.global_userName,vm.new_password)},
                2000);
            }else{
              vm.$messagebox.alert(res.data.msg);
            }
          });
        },
        login(name,Pwd){  //重新登录请求方法
          let self = this;
          this.$http.post('/login/doLogin',{
            userName:name,
            password:Pwd
          })
            .then(function (res) {
              if(res.data.code === 100){
                self.$router.push('index');
              }else{
                self.$toast(res.data.msg);
              }
            })
            .catch(function (err) {
              self.$messagebox.alert('请求失败！')
            })
        },
        check(content){
            debugger;
          var reg = /^\d{6}\b/;
          if(reg.test(content)){
              return true;
          }else{
              return false;
          }
        }
      },
      data(){
          return{
              old_password:'',
              new_password:'',
              confirm_password:''
          }
      }
  }
</script>
