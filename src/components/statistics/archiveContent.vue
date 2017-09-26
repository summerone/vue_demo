<template>
  <div class="mt-picker">
    <div class="mt-table">
      <table  v-if="taskMember || mainNew">
        <thead>
        <tr>
          <td>负责人</td>
          <td>合计</td>
          <td>提前完成</td>
          <td>逾期完成</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(el,index) in statisticsList" >
          <td class="">{{el.name}}</td>
          <td class="blue" @click.prevent="routerList(el,9)">{{el.finish}}</td>
          <td class="green" @click.prevent="routerList(el,7)">{{el.before_finish}}</td>
          <td class="red" @click.prevent="routerList(el,8)">{{el.timeout_finish}}</td>
        </tr>
        <tr  class="backBack" v-if="statisticsList.length">
          <td class="">总任务数</td>
          <td class="blue" @click.prevent="routerListHj(6)">{{archive.finish}}</td>
          <td class="green" @click.prevent="routerListHj(1)">{{archive.before_finish}}</td>
          <td class="red" @click.prevent="routerListHj(2)">{{archive.timeout_finish}}</td>
        </tr>
        </tbody>
      </table>
      <table  v-if="evaluationMembers">
        <thead>
        <tr>
          <td  style="width: 40%">部门</td>
          <td  style="width: 20%">合计</td>
          <td  style="width: 20%">提前完成</td>
          <td  style="width: 20%">逾期完成</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(el,index) in statisticsList" >
          <td class="">{{el.dept_name | trunc(8)}}</td>
          <td class="blue" @click.prevent="routerListbm(el,4)">{{el.finish}}</td>
          <td class="green" @click.prevent="routerListbm(el,5)">{{el.before_finish}}</td>
          <td class="red" @click.prevent="routerListbm(el,6)">{{el.timeout_finish}}</td>
        </tr>
        <tr  class="backBack" v-if="statisticsList.length">
          <td class="">总任务数</td>
          <td class="blue" @click.prevent="routerListHj(6)">{{archive.finish}}</td>
          <td class="green" @click.prevent="routerListHj(1)">{{archive.before_finish}}</td>
          <td class="red" @click.prevent="routerListHj(2)">{{archive.timeout_finish}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import bus from '../../assets/common/eventBus';
  export default{
    name:'header',
    data(){
      return {
        id:'selected',
        statisticsList:[],
        archive:{finish:0,before_finish:0,timeout_finish:0},
        option:'',
        taskMember:'',
        evaluationMembers:'',
        mainNew:true
      };
    },
    mounted: function () {
      this.$nextTick(function () {
        this.watchList();
        this.option = this.$router.currentRoute.query.option;
      })
    },
    methods: {
      watchList:function(){
        let _this = this;
        _this.taskMember = false;
        _this.evaluationMembers = false;
        let query = this.$router.currentRoute.query;
        switch (query.option){
          case "taskMember":
            _this.taskMember = true;
            break;
          case "taskDepartment":
            _this.evaluationMembers = true;
            _this.mainNew = false;
            break;
          case "taskDepartment":
            break;
          case "evaluationMembers":
            break;
        }
        bus.$on('statisticsList',function(msg){
          _this.statisticsList = msg;
          _this.statisticsList.forEach(function(value,index){
            _this.archive.finish+=value.finish;
            _this.archive.before_finish+=value.before_finish;
            _this.archive.timeout_finish+=value.timeout_finish;
          });
        });
      },
      routerList:function(obj,status){
        this.$router.push({ name: 'archive', query: { 'option':this.option,'auditor_name':obj.name, 'principal_id': obj.principal_id,'search_tj_down':status }});
      },
      routerListHj:function(status){
        this.$router.push({ name: 'archive', query: { 'option':this.option, 'search_tj_down':status }});
      },
      routerListbm:function(obj,status){
        this.$router.push({ name: 'archive', query: { 'option':this.option,'dept_name':obj.dept_name,dept_id:obj.dept_id,'search_tj_down':status }});
      }
    }
  }
</script>
<style scoped>
  .backBack{background: #f5f5f5}
  .mint-tab-item-label{font-size: 15px;}
  .mt-picker{  margin-top: 10px;padding:0px;background: #fff; border-top: 1px solid #eee;  }
  .mt-table{margin-top: 5px;padding-top: 5px;margin-bottom: 50px;}
  .mt-table table{width: 100%;border-spacing: 0px;}
  .mt-table table thead tr td{padding:3px;margin:0;width: 25%;text-align: center;border-bottom: 1px solid #eee}
  .mt-table table tbody tr td{padding:6px;border-bottom: 1px solid #eee;text-align: center}
  .last-col{  color: #fd6c57;  }
</style>
