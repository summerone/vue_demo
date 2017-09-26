<template>
    <div class="mt-picker mb50">
      <div class="mt-table">
        <table v-if="taskMember || mainNew">
          <thead>
          <tr>
            <td>负责人</td>
            <td>合计</td>
            <td>未过期</td>
            <td>已过期</td>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(el,index) in statisticsList">
              <td class="" >{{el.name}}</td>
              <td @click.prevent="routerList(el,2)" class="blue">{{el.no_finish}}</td>
              <td @click.prevent="routerList(el,6)" class="green" >{{el.no_timeout}}</td>
              <td @click.prevent="routerList(el,1)" class="red">{{el.timeout}}</td>
            </tr>
            <tr  class="backBack" v-if="statisticsList.length">
              <td class="" >总任务数</td>
              <td class="blue" @click.prevent="routerListHj(4)">{{header.no_finish}}</td>
              <td class="green" @click.prevent="routerListHj(5)">{{header.no_timeout}}</td>
              <td  class="red" @click.prevent="routerListHj(3)">{{header.timeout}}</td>
            </tr>
          </tbody>
        </table>
        <table v-if="taskDepartment">
          <thead>
          <tr>
            <td style="width: 40%">部门</td>
            <td style="width: 20%">合计</td>
            <td style="width: 20%">未过期</td>
            <td style="width: 20%">已过期</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(el,index) in statisticsList">
            <td class="" >{{el.dept_name | trunc(7)}}</td>
            <td  @click.prevent="routerListbm(el,1)" class="blue">{{el.no_finish}}</td>
            <td  @click.prevent="routerListbm(el,2)" class="green" >{{el.no_timeout}}</td>
            <td  @click.prevent="routerListbm(el,3)" class="red">{{el.timeout}}</td>
          </tr>
          <tr  class="backBack" v-if="statisticsList.length">
            <td class="" >总任务数</td>
            <td class="blue" @click.prevent="routerListHj(4)">{{header.no_finish}}</td>
            <td class="green" @click.prevent="routerListHj(5)">{{header.no_timeout}}</td>
            <td  class="red" @click.prevent="routerListHj(3)">{{header.timeout}}</td>
          </tr>
          </tbody>
        </table>
        <table v-if="evaluationMembers">
          <thead>
          <tr>
            <td>负责人</td>
            <td>好评</td>
            <td>中评</td>
            <td>差评</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(el,index) in statisticsList">
            <td class="" >{{el.name}}</td>
            <td @click.prevent="routerListpj(el,7)" class="blue">{{el.good_appri}}</td>
            <td @click.prevent="routerListpj(el,8)" class="green" >{{el.center_appri}}</td>
            <td @click.prevent="routerListpj(el,9)" class="red">{{el.bad_appri}}</td>
          </tr>
          <tr  class="backBack" v-if="statisticsList.length">
            <td class="" >总评价数</td>
            <td class="blue" @click.prevent="routerListHj(7)">{{queryDepartment.good_appri}}</td>
            <td class="green" @click.prevent="routerListHj(8)">{{queryDepartment.center_appri}}</td>
            <td  class="red" @click.prevent="routerListHj(9)">{{queryDepartment.bad_appri}}</td>
          </tr>
          </tbody>
        </table>
        <table v-if="evaluationDepartment">
          <thead>
          <tr>
            <td style="width: 40%">部门</td>
            <td style="width: 20%">好评</td>
            <td style="width: 20%">中评</td>
            <td style="width: 20%">差评</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(el,index) in statisticsList">
            <td class="" >{{el.dept_name | trunc(7)}}</td>
            <td @click.prevent="routerListpjbm(el,7)" class="blue">{{el.good_appri}}</td>
            <td @click.prevent="routerListpjbm(el,8)" class="green" >{{el.center_appri}}</td>
            <td @click.prevent="routerListpjbm(el,9)" class="red">{{el.bad_appri}}</td>
          </tr>
          <tr  class="backBack" v-if="statisticsList.length">
            <td class="" >总评价数</td>
            <td class="blue" @click.prevent="routerListHj(7)">{{queryDepartment.good_appri}}</td>
            <td class="green" @click.prevent="routerListHj(8)">{{queryDepartment.center_appri}}</td>
            <td  class="red" @click.prevent="routerListHj(9)">{{queryDepartment.bad_appri}}</td>
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
        option:'',
        taskMember:false,
        taskDepartment:false,
        evaluationMembers:false,
        evaluationDepartment:false,
        mainNew:true,
        header:{no_finish:0,no_timeout:0,timeout:0},
        queryDepartment:{bad_appri:0,center_appri:0,good_appri:0}
      };
    },
    mounted: function () {
      this.$nextTick(function () {
        this.watchList();
        this.init();
        this.option = this.$router.currentRoute.query.option;
      })
    },
    methods: {
      watchList:function(){
        let _this = this;
        _this.taskMember = false;
        _this.taskDepartment = false;
        _this.evaluationMembers = false;
        _this.evaluationDepartment = false;
        let query = this.$router.currentRoute.query;
        switch (query.option){
          case "taskMember":
            _this.taskMember = true;
            _this.mainNew = false;
            break;
          case "taskDepartment":
            _this.taskDepartment = true;
            _this.mainNew = false;
            break;
          case "evaluationMembers":
            _this.evaluationMembers = true;
            _this.mainNew = false;
            break;
          case "evaluationDepartment":
            _this.evaluationDepartment = true;
            _this.mainNew = false;
            break;
        }
        bus.$on('statisticsList',function(msg){
          _this.header = {no_finish:0,no_timeout:0,timeout:0};
          _this.queryDepartment = {bad_appri:0,center_appri:0,good_appri:0};
          _this.statisticsList = msg;
          _this.forEachList();
          _this.forEachListpj();
        });
      },
      ajaxFunction:function(){
          var _this = this;
          if(_this.taskMember || _this.mainNew){
              return _this.$http.post('/statistics/queryStatistics',{
                          user_id_list:'',time_q:'',time_z:'',page:1
                       })
          }else if(_this.taskDepartment){
            return _this.$http.post('/statistics/queryTaskByDept',{
                          dept_id:'',time_q:'',time_z:'',page:1
                     })
          }else if(_this.evaluationMembers){
            return _this.$http.post('/statistics/queryAppriByPeople',{
                          input_user_id:'',time_q:'',time_z:'',page:1
                   })
          }else if(_this.evaluationDepartment){
            return _this.$http.post('/statistics/queryAppriByDept',{
                     dept_id:'',time_q:'',time_z:'',page:1
                    })
          }
      },
      init:function(){
        var _this = this;
        _this.ajaxFunction()
          .then(function (res) {
            if(res.data.code == 100){
              _this.statisticsList = res.data.rows;
              if(  _this.statisticsList.length == 0){
                _this.$toast('没查出相关数据');
              }
              if(_this.taskMember || _this.taskDepartment){
                _this.forEachList();
              }else{
                _this.forEachListpj();
              }
              bus.$emit('statisticsList',_this.statisticsList);
//              _this.pages = (res.data.total % _this.searchCondition.rows >0 ?(res.data.total / _this.searchCondition.rows) + 1 : res.data.total / _this.searchCondition.rows);
//              _this.searchCondition.page+=1;
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      forEachList:function(){
        var _this = this;
        _this.statisticsList.forEach(function(value,index){
          _this.header.no_finish += value.no_finish;
          _this.header.no_timeout += value.no_timeout;
          _this.header.timeout += value.timeout;
        });
      },
      forEachListpj:function(){
        var _this = this;
        _this.statisticsList.forEach(function(value,index){
          _this.queryDepartment.good_appri += value.good_appri;
          _this.queryDepartment.center_appri += value.center_appri;
          _this.queryDepartment.bad_appri += value.bad_appri;
        });
      },
      routerList:function(obj,status){
        this.$router.push({ name: 'progress', query: { 'option':this.option,'name':obj.name,principal_id:obj.principal_id,'search_tj_down':status }});
      },
      routerListHj:function(status){
        this.$router.push({ name: 'progress', query: {'progressHJ':'progressHJ', 'option':this.option,'search_tj_down':status }});
      },
      routerListbm:function(obj,status){
        this.$router.push({ name: 'progress', query: { 'option':this.option,'dept_name':obj.dept_name,dept_id:obj.dept_id,'search_tj_down':status }});
      },
      routerListpj:function(obj,status){
        this.$router.push({ name: 'progress', query: { 'option':this.option,'pj_name':obj.name,user_id:obj.input_user_id,'search_tj_down':status }});
      },
      routerListpjbm:function(obj,status){
        this.$router.push({ name: 'progress', query: { 'option':this.option,'pj_dept_name':obj.dept_name,dept_id:obj.dept_id,'search_tj_down':status }});
      }
    }
  }
</script>
<style scoped>
  .backBack{background: #f5f5f5}
  .mint-tab-item-label{font-size: 15px;}
  .mt-picker{  margin-top: 10px;padding:0px;background: #fff; border-top: 1px solid #eee;  }
  .mt-table{margin-top: 5px;padding-top: 5px;}
  /*.mt-table tbody{position: r;top:200px;bottom: 0;left: 0;right: 0;overflow: scroll}*/
  .mt-table table{width: 100%;border-spacing: 0px;}
  .mt-table table thead tr td{padding:3px;margin:0;width: 25%;text-align: center;border-bottom: 1px solid #eee}
  .mt-table table tbody tr td{padding:6px;border-bottom: 1px solid #eee;text-align: center}
  .last-col{
    color: #fd6c57;
  }
</style>
