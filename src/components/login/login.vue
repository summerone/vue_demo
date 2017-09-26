<template>
  <div class="loadingContent">
    <div class="media">
      <div class="loadingHeader">
        <img src="../../assets/images/loading_03.png" alt="">
      </div>
      <div class="lodingInput">
          <div class="nameInput">
            <i class="iconfont icon-renyuan1"></i>
            <input type="text" v-model.trim="userName" placeholder="用户名/邮箱/电话" style="font-size: 14px">
          </div>
          <div class="palssWord">
            <i class="iconfont icon-mm"></i>
            <input type="password" v-model.trim="password" placeholder="密码" style="font-size: 14px">
          </div>
          <div class="buttomLoading">
            <button  style="font-size: 16px" @click="login">登录</button>
          </div>
          <div class="Wpassword">
            <router-link to="/pwdChange">
              <span>忘记密码?</span>
            </router-link>
          </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    name:'login',
    beforeRouteEnter(to, from , next){
        next(vm =>{
            vm.$root.$children[0].isVisible = false;
            vm.$root.$children[0].layout = {span:24};
        })
    },
    beforeRouteLeave(to, from , next){
      this.$root.$children[0].isVisible = true;
      this.$root.$children[0].layout = {span:23, offset:1};
      next();
    },
    data(){
      return {
        userName:'',
        password:''
      };
    },
    mounted: function () {
      this.$nextTick(function (){
        this.delAllCookie();
      })
    },
    methods: {
      login(){  //登录请求方法
        let self = this;
        if(this.userName && this.password){
          this.$http.post('/login/doLogin',{
            userName:this.userName,
            password:this.password
          })
            .then(function (res) {
              if(res.data.code === 100){
                self.global_user.global_userName=self.userName;
                self.global_user.global_name=res.data.otherRes.data.name;
                self.$router.push('index');
//                  var Days = 30;
//                  var exp = new Date();
//                  exp.setTime(exp.getTime() + Days*24*60*60*1000);
//                  var nameList = URLEncoder.encode(res.data.otherRes.data.name,'utf-8');
//                console.log(res.data.otherRes.data);
                document.cookie = escape(res.data.otherRes.data.name) + "="+ escape(res.data.otherRes.data.id);
                document.cookie = escape(res.data.otherRes.data.leader_name) + "="+ escape(res.data.otherRes.data.leader_id);
              }else{
                self.$toast(res.data.msg);
              }
            })
            .catch(function (err) {
              self.$messagebox.alert('请求失败！')
            })
        }else{  //没输入用户名及密码
          self.$toast('请输入用户名及密码！')
        }
      },
      delAllCookie(){
        var myDate=new Date();
        myDate.setTime(-1000);//设置时间
        var data=document.cookie;
        var dataArray=data.split("; ");
        for(var i=0;i<dataArray.length;i++){
          var varName=dataArray[i].split("=");
          document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();
        }
      }
    }
  }
</script>

<style  scoped>
  .buttomLoading button:hover{background: #2EA0E3;}
  .buttomLoading button{width: 85%;padding: 2px;color: #fff;background:  #26a2ff;height:40px;border: 0;box-shadow:0.1px 1.1px 7.1px -0.9px #26a2ff;border-radius: 5px;}
  .lodingInput input{width: 73%;padding:3px;padding-left:35px;height:30px;border-radius: 3px;box-shadow:0.1px 1.1px 9.1px 0.1px   #eee;;border:0;background: #fff}
  .lodingInput{text-align: center;}
  div.Wpassword{width:90%;color:#eee;text-align: right;margin-top: 10px;}
  div.Wpassword a{color:#aaa}
  .lodingInput div{margin-top: 15px;position: relative;color: #aaa}
  .lodingInput div i{position: absolute;left:10%;top:5px;}
  .loadingContent{position: absolute;top: 0;bottom: 0;left: 0;right: 0;background: #fff;overflow: scroll}
  .loadingHeader {text-align: center}
  .loadingHeader img{width: 50%;height: auto;margin-top: 10%;}
</style>
