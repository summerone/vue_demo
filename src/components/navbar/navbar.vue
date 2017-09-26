<template>
  <mt-tabbar v-model="selected" fixed  class="ph-nav">
    <mt-tab-item id="/index" class="font-color" @click.native="handelRouter('/index')">
      <div class="icon-margin"><i class="icon iconfont icon-home fontsize"></i></div>
      首页
    </mt-tab-item>
    <mt-tab-item id="/task" class="font-color" @click.native="handelRouter('/task')">
      <div class="icon-margin"><i class="icon iconfont icon-qr_code_light fontsize"></i></div>
      任务
    </mt-tab-item>
    <mt-tab-item id="/statistics" class="font-color" @click.native="handelRouter('/statistics')">
      <div class="icon-margin"><i class="icon iconfont icon-rank fontsize"></i></div>
      展晒
    </mt-tab-item>
    <mt-tab-item id="/mine" class="font-color" @click.native="handelRouter('/mine')">
      <div class="icon-margin"><i class="icon iconfont icon-people fontsize"></i></div>
      我的
    </mt-tab-item>
  </mt-tabbar>
</template>
<script>
  export default {
    name: 'navbar',
    data () {
      return {selected: '/index'}
    },
    methods:{
      //路由跳转
      handelRouter(router){
        this.$router.push(router);
      }
    },
    mounted(){
      //带查询条件的跳转，页面刷新处理
      this.selected = this.$router.currentRoute.path;
    },
    watch: {

    }
  }
</script>
<style scoped>
  i{
    font-size: 22px;
  }
  .font-color{
    color: #989898
  }
  .icon-margin{
    margin-bottom: 2px;
  }
</style>
