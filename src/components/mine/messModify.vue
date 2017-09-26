<template>
  <div class="self—modify">
    <mt-header title="电话"></mt-header>
    <mt-field  placeholder="请输入电话号码" v-model="newText"></mt-field>

    <div style="text-align: center;">
      <mt-button type="primary" style="width: 90%;" class="mt20" @click.native="change">保存</mt-button>
    </div>
  </div>
</template>
<script>
  export default{
      name:'messModify',
      data(){
          return{
              newText:''
          }
      },
    methods:{
          change:function(){
              var vm=this;
            var reg_tel = /^((0\d{2,3}\d{7,8})|(1[35847]\d{9}))$/;//电话验证
            if(!reg_tel.test(vm.newText)||vm.newText==null){
              vm.$messagebox.alert("请输入正确电话号码");
              return;
            }
            this.$http.post('/mine/updateUserinfo', {
              phone: vm.newText
            }).then(function (res) {
              if(res.data.code==100){
                vm.$messagebox.alert(res.data.msg);
                /*修改成功后自动调登录接口*/
                setTimeout( () => {vm.$router.push("/selfMessage")},
                  2000);
              }else{
                vm.$messagebox.alert(res.data.msg);
              }
            });
          }
    }
  }
</script>
<style scoped>

</style>
