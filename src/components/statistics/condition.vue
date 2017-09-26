<template>
  <div class="statistics">
    <mt-header title="统计条件">
      <router-link to="/statistics" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <mt-cell title="按成员统计任务数"  is-link @click.native="condition('taskMember')">
      <i slot="icon" class="icon iconfont icon-tongji"></i>
    </mt-cell>
    <mt-cell title="按部门统计任务数"  is-link  class=" mb10" @click.native="condition('taskDepartment')">
      <i slot="icon" class="icon iconfont icon-tongji"></i>
    </mt-cell>
    <mt-cell title="按成员统计评价数"  is-link   @click.native="condition('evaluationMembers')">
      <i slot="icon" class="icon iconfont icon-tongji"></i>
    </mt-cell>
    <mt-cell title="按部门统计评价数"  is-link   @click.native="condition('evaluationDepartment')">
      <i slot="icon" class="icon iconfont icon-tongji"></i>
    </mt-cell>
  </div>
</template>
<script>
  import bus from '../../assets/common/eventBus';
  import navbar from '../navbar/navbar.vue'
  export default{
    name:'condition',
    data(){
      return {
        id:'condition',
      };
    },
    methods: {
      condition:function(option){
        this.$router.push({path:'/statistics',query:{option:option}})
      }
    },
    components:{
      'v-nav':navbar
    }
  }
</script>
<style scoped>
  .statistics i.icon-tongji{font-size: 22px;vertical-align: middle}
</style>
