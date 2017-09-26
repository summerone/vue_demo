<template>
  <div>
    <ul style="text-align: center;color: #fff;">
      <li style="height: 53px">
        <span><i class="icon iconfont fontsize icon-sort"></i></span>
      </li>
      <li  class="pc-navli" v-for="(el,index) in liState"
           :key="index"
           @click="liToggle(index,el.to)"
           :class="{'liActive':el.toggle}">
        <div class="icon-margin">
          <i class="icon iconfont  fontsize" :class="el.icon"></i>
        </div>
        <span>{{el.text}}</span>
      </li>
      <!--<li  class="pc-navli" style="position: absolute;bottom: 0;left: 0;right: 0">-->
        <!--<a href="http://qywx.4008990000.net/#/ggfb"  style="color: #fff;">-->
          <!--<div class="icon-margin">-->
            <!--<i class="icon iconfont icon-home fontsize icon-huitui" ></i>-->
          <!--</div>-->
        <!--</a>-->
      <!--</li>-->
    </ul>
  </div>
</template>
<script>
  export default{
    name:'pcNav',
    data(){
      return{
        liState:[
          {icon:'icon-home',text:'首页',toggle:true,to:'/index'},
          {icon:'icon-qr_code_light',text:'任务',toggle:false,to:'/task'},
          {icon:'icon-rank',text:'展晒',toggle:false,to:'/statistics'},
          {icon:'icon-people',text:'我的',toggle:false,to:'/mine'}
        ]
      }
    },
    methods:{
      liToggle:function (index,url) { //li样式切换
        this.$router.replace(url);  //路由跳转
        this.liState.forEach(function (v,i) {
          v.toggle = (index === i)? true : false;
        })
      }
    }
  }
</script>
<style scoped>
  li{
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    height:75px;
    line-height:1.4em;
  }
  li.pc-navli:hover{
    background: #73c5ff;
  }
  .liActive{
    background: #73c5ff;
  }
  .fontsize{
    font-size: 22px;
  }
</style>
