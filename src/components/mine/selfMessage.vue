<template>
  <div class="selfMess pb60">
    <mt-header title="个人信息">
      <router-link :to="{ path:'/mine' }" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <!--<mt-cell title="头像" is-link  style="text-align: left">
      <span style="color: #999999;"></span>
    </mt-cell>-->

    <mt-cell title="姓名"  style="text-align: left" class="mt10">
      <span style="color: #999999;">{{userInfo.name}}</span>
    </mt-cell>
    <!--to="/messModify"-->
    <mt-cell title="电话" style="text-align: left">
      <span style="color: #999999;">{{userInfo.phone}}</span>
    </mt-cell>
    <mt-cell title="税务人员编号"  style="text-align: left">
      <span style="color: #999999;">{{userInfo.swry_id}}</span>
    </mt-cell>
    <mt-cell title="科室"  style="text-align: left">
      <span style="color: #999999;">{{deptInfo.dept_name}}</span>
    </mt-cell>
    <mt-cell title="分管领导"   style="text-align: left" v-if="leaderInfo.name!=null">
      <span style="color: #999999;">{{leaderInfo.name}}</span>
    </mt-cell>

    <mt-cell title="修改密码" is-link to="/resetMima" style="text-align: left;" class="mt10">
      <span style="color: #999999;"></span>
    </mt-cell>

    <div style="text-align: center;">
      <mt-button type="primary" style="width: 90%;" class="mt20" @click.native="logout">退出</mt-button>
    </div>
  </div>
</template>
<script>
  import MtHeader from "../../../node_modules/mint-ui/packages/header/src/header";
  import {MessageBox} from 'mint-ui';
  export default{
    components: {MtHeader},
    name:'selfMessage',
    data() {
      return {
          userInfo:{},
          deptInfo:{},
          leaderInfo:{}
        /*name:'',
        phone:'',
        swry_id:'',
        leader_id:0,
        dept_id:0*/
      }
    },
    created:function () {
      var vm=this;
      vm.init();
    },
    methods:{
      logout:function(){
          var vm=this;
         vm.$http.get('/login/logout', {

        }).then(function (res) {
            if(res.data.code==100){
              vm.$messagebox.alert('已退出,即将跳入登录页面');
              setTimeout(() => {vm.$router.push("/login")},1500);
            }else{
              vm.$messagebox.alert('退出异常');
            }
        });
      },
      init: function () {
        var vm=this;
        vm.$http.get('/mine/queryUserinfo', {
            /*params: {
              current:obj.current,
              size:obj.size
            }*/
          }).then(function (res) {
              vm.userInfo=res.data.otherRes.userInfo;
              vm.deptInfo=res.data.otherRes.deptInfo;
              if(res.data.otherRes.leaderInfo==null){
                vm.leaderInfo.name='无';
              }else{
                vm.leaderInfo=res.data.otherRes.leaderInfo;
              }
          }).catch(function (err) {
            vm.$messagebox.alert('请求失败！')
          })
        }
    }
  }
</script>
