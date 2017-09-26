<template>
    <div class="page-navbar">
      <!--<div class="marginBottom">-->
        <!--&lt;!&ndash;<mt-header fixed title="统计"></mt-header>&ndash;&gt;-->
      <!--</div>-->
      <mt-header v-bind:title="title">
        <router-link to="/" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>
        <!--<router-link to="/condition" slot="right">-->
           <mt-button icon="more" @click.native="routerCondition" slot="right"></mt-button>
        <!--</router-link>-->
      </mt-header>
      <mt-navbar class="page-part" v-model="selected" v-show="evaluationDepartment">
        <mt-tab-item id="1"><span  style="font-size: 14px">进展统计</span></mt-tab-item>
        <mt-tab-item id="2"><span style="font-size: 14px">归档统计</span></mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <v-time v-on:addren="addrenFun"></v-time>
          <v-header v-on:addren="addrenFun"></v-header>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <v-time v-on:addren="addrenFun"></v-time>
          <v-archiveContent v-on:addren="addrenFun"></v-archiveContent>
        </mt-tab-container-item>
      </mt-tab-container>
      <transition name="fade" :duration="1000"  mode="in-out" v-if="taskMember || mainNew">
        <v-address v-on:addren="addrenFun" v-show="addren"></v-address>
      </transition >
      <transition name="fade" :duration="1000"  mode="in-out" v-if="taskDepartment">
        <v-department v-on:addren="addrenFun" v-show="addren"></v-department>
      </transition >
      <v-nav></v-nav>
    </div>
</template>
<script>
  import header from './header.vue'
  import address from './address.vue'
  import department from './department.vue'
  import time from './time.vue'
  import archiveContent from './archiveContent.vue'
  import VNav from '../navbar/navbar.vue'
  export default{
    name:'statistics',
    data(){
      return {
        id:'selected',
        selected: '1',
        addren:false,
        depart:false,
        taskMember:false,
        taskDepartment:false,
        evaluationDepartment:true,
        mainNew:true,
        title:'展晒'
      };
  },
    mounted: function () {
      let _this = this;
      _this.taskMember = false;
      _this.taskDepartment = false;
      _this.evaluationDepartment = true;
      let query = this.$router.currentRoute.query;
      switch (query.option){
        case "taskMember":
          _this.title = '任务按成员';
          _this.taskMember = true;
          break;
        case "taskDepartment":
          _this.title = '任务按部门';
          _this.taskDepartment = true;
          _this.mainNew = false;
          break;
        case "evaluationMembers":
          _this.title = '评价按成员';
          _this.taskMember = true;
          _this.evaluationDepartment = false;
          break;
        case "evaluationDepartment":
          _this.title = '评价按部门';
          _this.taskDepartment = true;
          _this.mainNew = false;
          _this.evaluationDepartment = false;
          break;
      }
    },
    methods: {
      open(picker) {
        this.$refs[picker].open();
      },
      addrenFun:function (res) {
        this.addren = res;
      },
      handlestartChange(value) {
        this.time.start = value;
        //this.show = true;
      },
      handleendChange(value) {
        this.time.end = value;
      },
      routerCondition(){
        this.$router.push({ name: 'condition'});
      }
    },
    components:{
      'v-header':header,'v-address':address,
      'v-archiveContent':archiveContent,'v-time':time,
      'v-nav':VNav,
      'v-department':department
    }
  }
</script>
<style scoped>
  div.mint-tab-item-label{font-size:14px;}
  .fade-enter-active, .fade-leave-active {transition: opacity .5s}
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ { opacity: 0}
  .mt-picker{margin-top: 3px;padding:5px;background: #fff; border-top: 1px solid #eee;}
  .mint-navbar .mint-tab-item{padding: 13px 0;}
</style>
