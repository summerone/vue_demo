<template>
  <div>
    <mt-header title="统计">
      <router-link :to="pathRoter" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="progress_header blod">
      <span>{{name}}-已完成（{{statisticsListgd.length}}）</span>
    </div>
    <div class="progress_selected ">
      <span>任务分类：</span>
      <el-select v-model="selected" placeholder="请选择">
        <el-option
          v-for="item in option"
          :key="item.name"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="progress_content"
         v-infinite-scroll="scroll"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10"
    >
      <div class="content-item mb10"  v-for="value in statisticsListgd" @click="handleRouter(value.id)">
        <el-row class="content-item  pt10 pb10">
          <el-col :xs="5" :sm="4" :md="4" class="left-icon">
              <span class="icon">
                <i class="iconfont " :class="{'icon-duihua': value.start_status == 2}" v-bind:style="{fontSize:'30px'}"></i>
                <i class="iconfont " style="color: rgb(74, 161, 218);" :class="{'icon-activity': value.start_status == 1}" v-bind:style="{fontSize:'30px'}"></i>
              </span>
          </el-col>
          <el-col :xs="19" :sm="20" :md="20" class="right-text" >
            <ul>
              <li class="one">
                <span>{{value.task_title}}</span>
                <!--<span v-if="value.start_status == 1">{{name}}发起的任务</span>-->
                <!--<span v-else-if="value.start_status == 2">{{name}}收到的任务</span>-->
                <p class="state" v-if="value.xs_status == 2">未完成</p>
                <p class="state" v-else-if="value.xs_status == 5">未过期</p>
                <p class="state" v-else-if="value.xs_status == 1">已过期</p>
                <p class="state" v-else-if="value.xs_status == 8">逾期完成</p>
                <p class="state" v-else-if="value.xs_status == 9">提前完成</p>
                <!--<p><small>开始时间:{{value.start_time |date}}</small></p>-->
              </li>
              <!--<li>-->
                <!--<span> {{value.task_title}}</span>-->
              <!--</li>-->
              <li class="fontColor">
                <span>截止时间：</span>
                <span>{{value.end_time |dateNum}}</span>
              </li>
              <li class="fontColor">
                <span>创建人：</span>
                <span>{{value.input_user_name | trunc(10)}}</span>
              </li>
              <!--<li class="fontColor">-->
                <!--<span>承办人：</span>-->
                <!--<span>{{value.principal_name | trunc(10)}}</span>-->
              <!--</li>-->
            </ul>
          </el-col>
          <el-row class="evalute-content"  v-if="value.grade != null">
            <el-col :xs="5" :sm="4" :md="4" style="text-align: center">
                <span class="v-line" >
                  <i class="iconfont icon-pingjia1-copy line-icon"></i>
                </span>
            </el-col>
            <el-col :xs="19" :sm="20" :md="20" class="evalute-text" >
              <ul>
                <li class="smile">
                  <i class="iconfont green" :class="{'icon-smile':value.grade == '3'}"></i>
                  <i class="iconfont blue" :class="{'icon-zhongping-copy':value.grade == '2'}"></i>
                  <i class="iconfont red" :class="{'icon-cry':value.grade == '1'}"></i>
                  <span v-if="value.grade == '3'">好评</span>
                  <span class="blue" v-else-if="value.grade == '2'">中评</span>
                  <span class="red" v-else="value.grade == '1'">差评</span>
                </li>
                <li>
                  <span>{{value.appraise_name}}：</span>
                  <span>{{value.remark | trunc(10)}}</span><br>
                  <small class="time  fontColor">{{value.start_time | date}}</small>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-row>
      </div>
      <p class="loading" v-show="loading">{{nextStatus}}</p>
    </div>
  </div>
</template>
<script>
  import bus from '../../assets/common/eventBus';
  export default{
    name:'archive',
    data(){
      return {
        id:'selected',
        selected:'',
        name:'',
        searchConditiongd:{
          page:1,rows:5,task_sort :0
        },
        archivepages:0,
        statisticsListgd:[],
        nextStatus:'加载中......',
        loading:false,
        option:[],
        options:'',
        pathRoter:''
      };
    },
    mounted: function () {
      this.$nextTick(function () {
        this.init();
        this.warchparent();
      })
    },
    watch: {
      selected: function() {
          if(this.$router.currentRoute.query.mainname){
            this.queryStatisticsByUserId();
          }else{
            this.statisticsDetail();
          }
      }
    },
    methods: {
      init:function(){
        var _this = this;
        this.$http('/task_sort/queryTask_sort')
          .then(function (res) {
            if(res.data.code == 100){
              _this.option = res.data.rows;
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      warchparent:function(){
        this.searchConditiongd = {page:1,rows:5,task_sort :0};
        var router =  this.$router.currentRoute.query;
        this.searchConditiongd.search_tj_down = router.search_tj_down;
        this.options = router.option;
        this.pathRoter = { path:'/statistics', query: { option: this.options} };
        if(router.auditor_name){
          this.name =  router.auditor_name;
          this.selected = router.task_sort;
          this.searchConditiongd.statistics_id = router.principal_id;
          this.statisticsDetail();
        }else if(router.mainname){
          this.name =  router.mainname;
          this.selected = router.task_sort;
          this.pathRoter = { path:'/mine' };
          this.queryStatisticsByUserId();
        }else if(router.dept_name){
          this.selected = router.task_sort;
          this.name =  router.dept_name;
          this.searchConditiongd.dept_id = router.dept_id;
          this.queryTaskByDepartment();
        }else{
          this.name = '合计';
          this.selected = router.task_sort;
          this.queryTaskHJ();
        }
      },
      queryTaskByDepartment:function(){
        this.searchConditiongd.page = 1;
        var _this = this;
        _this.$http.post('/statistics/queryTaskByDepartment',
          _this.searchConditiongd
        )
          .then(function (res) {
            if(res.data.code == 100){
              _this.statisticsListgd = res.data.rows;
              _this.archivepages = (res.data.total % _this.searchConditiongd.rows >0 ?(res.data.total / _this.searchConditiongd.rows) + 1 : res.data.total / _this.searchConditiongd.rows);
              _this.searchConditiongd.page+=1;
              if(_this.statisticsListgd.length == 0){
                _this.$toast('没有查出相关数据');
                return;
              }
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      queryStatisticsByUserId:function(){
        var _this = this;
        _this.searchConditiongd.page = 1;
        _this.searchConditiongd.task_sort = this.selected;
        _this.$http('/statistics/queryStatisticsByUserId',
          {params:_this.searchConditiongd}
        ).then(function (res) {
          if(res.data.code == 100){
            _this.statisticsListgd = res.data.rows;
            _this.searchConditiongd.page+=1;
            if(_this.statisticsListgd.length == 0){
              _this.$toast('没有查出相关数据');
              return;
            }
          }
        }).catch(function (err) {
          _this.$messagebox.alert('请求失败！');
        })
      },
      statisticsDetail:function(){
        var _this = this;
        _this.searchConditiongd.page = 1;
        _this.searchConditiongd.task_sort = this.selected;
        _this.$http.post('/task/queryTaskAll',
         _this.searchConditiongd
        )
          .then(function (res) {
            if(res.data.code == 100){
              _this.statisticsListgd = res.data.list;
              if(_this.statisticsListgd.length == 0){
                _this.$toast('没有查出相关数据');
                return;
              }
              _this.archivepages =  (res.data.total % _this.searchConditiongd.rows >0 ?(res.data.total / _this.searchConditiongd.rows) + 1 : res.data.total / _this.searchConditiongd.rows);
              _this.searchConditiongd.page+=1;
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      queryTaskHJ:function(){
        this.searchConditiongd.page = 1;
        var _this = this;
        _this.$http('/task/queryTaskHJ',
          {params:_this.searchConditiongd}
        )
          .then(function (res) {
            if(res.data.code == 100){
              _this.statisticsListgd = res.data.rows;
              _this.archivepages = (res.data.total % _this.searchConditiongd.rows >0 ?(res.data.total / _this.searchConditiongd.rows) + 1 : res.data.total / _this.searchConditiongd.rows);
              _this.searchConditiongd.page+=1;
              if(_this.statisticsListgd.length == 0){
                _this.$toast('没有查出相关数据');
                return;
              }
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      handleRouter:function (taskId) {
        this.searchConditiongd.option = this.options;
        this.searchConditiongd.taskId = taskId;
        this.searchConditiongd.name = this.name;
        this.searchConditiongd.routerBack = '/archive';
        if(this.$router.currentRoute.query.archiveHJ){
          this.searchConditiongd.archiveHJ = 'archiveHJ';
        }
        this.$router.push({path:'/task_detail',query:this.searchConditiongd})
      },
      ajaxFunction:function(){
          var _this = this;
        if(_this.$router.currentRoute.query.auditor_name){
            return  _this.$http.post('/task/queryTaskAll',
                       _this.searchConditiongd
                     );
        }else if(this.$router.currentRoute.query.name){
          return _this.$http('/statistics/queryStatisticsByUserId',
                   {params:_this.searchConditiongd}
                  );
        }else if(this.$router.currentRoute.query.dept_name){
          return _this.$http('/statistics/queryTaskByDepartment',
                       {params:_this.searchConditiongd}
                  );
        }else{
          return _this.$http('/task/queryTaskHJ',
                       {params:_this.searchConditiongd}
                  );
        }
      },
      scroll:function(){
        var _this = this;
        _this.nextStatus = '加载中.....';
        _this.loading = false;
        if (_this.searchConditiongd.page==1){
          return;
        }
        if(_this.searchConditiongd.page>_this.archivepages){
          _this.$toast('没有更多消息');
          return;
        }
        _this.ajaxFunction()
         .then(function (res) {
          if(res.data.code == 100){
            var list = res.data.rows;
            _this.searchConditiongd.page+=1;
            _this.loading = true;
            setTimeout(() => {  //更新返回数组
              for (var i = 0; i < list.length; i++) {
                _this.statisticsListgd.push(list[i]);
              }
              _this.loading = false;
            }, 2500);
          }
        }).catch(function (err) {
          _this.$messagebox.alert('请求失败！');
        })
      }
    }
  }
</script>
<style scoped>
  .loading{ margin: 0;padding: 0; margin-top: 8px;height: 20px;line-height: 20px;font-size: 15px;text-align: center;  }
  .progress_selected span{color: #aaa}
  .progress_selected select{width: 70%;border:0}
  .progress_content{position: absolute;top:140px;left:0;right:0;bottom: 0;overflow: scroll;}
  .progress_header,.progress_selected{background: #fff;padding:10px;margin-bottom: 2px;}
  .progress_content .content-item{background-color: #fff;}
  .content-title h4{text-align:left;padding:10px 10px;border-bottom:1px solid #e2e2e2;font-weight:500;font-size:16px;}
  .content-item{background-color: #fff;padding:10px 0;}
  .content-item .left-icon{display: inline-block;vertical-align: top;text-align: center}
  .content-item .right-text{display: inline-block}
  .content-item  span.icon{  display: block;  width:40px;height:40px; line-height:40px; margin: 0 auto;border-radius: 6px;border:1px solid #e2e2e2;  }
  .content-item  span i.icon-duihua{ color: #ff7d5a;}
  .content-item  span i.icon-activity{color: #4aa1da;}
  .content-item .fontColor{  color:#8d8d8d;}
  .right-text ul li.one small{color: #bebebe;}
  .right-text ul li.one .state{display: inline-block;float: right;padding-right: 20px;color: #38adff;}
  .evalute-content{width: 100%; height:90px; border-top:1px solid #eef1f6;overflow: hidden}
  .evalute-content .v-line{ position: relative;  display: inline-block;  width:1px;  height:100px;  background: #e2e2e2;  }
  .evalute-content .line-icon{  color: #37c6ff;  display: inline-block; position: absolute;  background: #fff;  z-index: 1;  top:30%;  left:-15px;  font-size:24px;  line-height:30px;  width:30px;  height:30px;  }
  .evalute-content ul{  padding:6px 0;  text-align: left;  }
  .evalute-text ul li:first-child i{  font-size: 18px;  vertical-align: middle;  }
  /*好评color、*/
  .evalute-content ul li:first-child.smile{  color: #89ee6b;  }
  /*中评color*/
  .evalute-content ul li:first-child.medium{  color: #25c1ff; }
  /*差评color*/
  .evalute-content ul li:first-child.bad{  color: #ff9c85;  }
  @media only screen and (min-width: 994px) {
    .progress_content{    left: 6%;  right: 2%;}
  }
</style>
