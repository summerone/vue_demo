<template>
  <div style="width: 100%;padding-bottom: 60px" class="">
    <!--头部-->
    <mt-header title="我的">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div style="height: 120px;background-color: #26a2ff;padding-top: 10px;margin-top: -1px;" align="center">
      <div class="div_img">
        <div style="overflow: hidden;height: 60px;width: 60px;
        border-radius: 50%;border: 1px solid white;
        display: flex;justify-content: center;align-items: center">
          <img src="../../assets/images/person.png" style="width: 60px;height: 60px;margin:5px;">
        </div>
      </div>
      <div>
        <label style="color: white;">{{myname}}</label>
      </div>
    </div>
    <!--任务完成情况统计-->
    <el-row style="background: #fff;padding: 10px" >
      <el-col :xs="6" :sm="6" style="text-align: center;border-right: 1px solid #eef1f6;" >
        <el-row><span @click="meunList('')">{{total}}</span></el-row>
        <el-row><span class="sortColor" @click="meunList('')">任务总数</span></el-row>
      </el-col>
      <el-col :xs="6" :sm="6" style="text-align: center;border-right: 1px solid #eef1f6;">
        <el-row><span  @click="meunList('3')">{{finish}}</span></el-row>
        <el-row><span class="sortColor" @click="meunList('3')">已完成</span></el-row>
      </el-col>
      <el-col :xs="6" :sm="6" style="text-align: center;border-right: 1px solid #eef1f6;">
        <el-row><span class="red" @click="meunList('2')">{{no_finish}}</span></el-row>
        <el-row><span class="sortColor" @click="meunList('2')">未完成</span></el-row>
      </el-col>
      <el-col :xs="6" :sm="6" style="text-align: center;">
        <el-row><span  @click="meunList('1')">{{timeout}}</span></el-row>
        <el-row><span class="sortColor" @click="meunList('1')">已过期</span></el-row>
      </el-col>
    </el-row>
    <!--详细导航条-->
    <div style="margin-top: 10px;width: 100%;">
      <mt-cell title="个人信息" is-link to="/selfMessage" style="text-align: left">
        <i slot="icon" class="icon iconfont icon-renyuan1"
           style="font-size: 20px;color: #9acd2d;vertical-align: middle"></i>
        <span style="color: green;"></span>
      </mt-cell>
      <mt-cell title="用户管理" is-link to="/userList" style="text-align: left">
        <i slot="icon" class="icon iconfont icon-icon-test"
           style="font-size: 20px;color: #38adff;vertical-align: middle"></i>
        <span style="color: green;"></span>
      </mt-cell>
      <mt-cell title="归档任务" is-link @click.native="placefileIcon()" style="text-align: left">
        <i slot="icon" class="icon iconfont icon-placefileIcon"
           style="font-size: 20px;color: #38adff;vertical-align: middle"></i>
        <span style="color: green;"></span>
      </mt-cell>
      <mt-cell title="帮助中心" is-link style="text-align: left;" class="mt10">
        <i slot="icon" class="icon iconfont icon-bangzhuzhongxin1"
           style="font-size: 20px;color: #ff7800;vertical-align: middle"></i>
        <span style="color: green;"></span>
      </mt-cell>

      <!--<el-row class="pic">
          <el-col v-for="el in piclist" :md="{span:12}">
            <div class="cover"></div>
              <img :src=el.path style="width: auto;height: auto;max-width: 100%;max-height: 100%">
          </el-col>
      </el-row>-->
    </div>
    <!--底部导航组件-->
    <v-nav></v-nav>
  </div>
</template>
<script>
  import VNav from '../navbar/navbar.vue'
  export default{
    name:'mine',
    data(){
      return {
          msg:'abc',
          myname:'',
          radio:'1',
          total:0,
          finish:0,
          no_finish:0,
          timeout:0,
          piclist:[{path:"taskManage/img/10.jpg",},{path:"taskManage/img/10.jpg"},{path:"taskManage/img/10.jpg"}]

      }
    },
    mounted:function () {
      this.init();
    },
    methods: {
      init(){
        var vm = this;
        this.$http.post('/statistics/queryMeTask',{
          //page:1,
          //rows:1,
          //userName:vm.global_user.global_userName
        })
          .then(function (res) {
            if(res.data.code == '100'){
              vm.myname=vm.global_user.global_userName;
              vm.finish=res.data.data.finish;
              vm.no_finish=res.data.data.no_finish;
              vm.timeout=res.data.data.timeout;
              vm.total=res.data.data.total;
            }else{
              vm.$toast(res.data.msg);
            }
          })
      },
      meunList:function(search_tj_down){
        this.$router.push({path:'task',query:{'search_tj_down':search_tj_down}});
      },
      placefileIcon:function(){
        this.$router.push({ name: 'archive', query: {'mainname':'我'}});
      }
    },
    components:{
        'v-nav':VNav
    }
  }
</script>
<style type="text/css" scoped>
  .pic img:hover{width: 100%;background: #39ad26;opacity: .6;position: fixed;z-index:2;top: 0;bottom: 0;left: 0;right: 0}

  .div_img{
   border: 1px white solid;
    height: 70px;width: 70px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .div_msg{
    background-color: white;
    border-radius: 12px;
    width: 90%;height: 45%;
    padding: 5px;line-height: 36px;
    margin-top: 17px;
  }
  .div_msg_info{
    width: 25%;float: left;
  }
  .div_msg_info_span{
    font-size: 20px
  }
  .div_msg_info_span_1{
    color: #DDDBDB
  }
  .mint-cell-text{
    position: absolute;margin-top: 2px;margin-left: 8px;
  }
  .icon-question{
    margin-left: 10px;
  }

  .sortColor{
    color: #a9a9a9;
  }
</style>
