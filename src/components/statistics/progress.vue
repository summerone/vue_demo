<template>
  <div>
    <mt-header title="统计">
      <router-link :to="{ path:'/statistics', query: { option: option} }" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
     <div class="progress_header blod">
       <span>{{name}}-未完成（{{statisticsListNew.length}}）</span>
     </div>
    <div class="progress_content"
         v-infinite-scroll="scroll"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10"
    >
      <div class="content-item mb10"  v-for="value in statisticsListNew" @click="handleRouter(value.id)">
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
                    <p class="state" v-else="value.xs_status == 1">已过期</p>
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
  export default{
    name:'progress',
    data(){
      return {
        id:'progress',
        name:'',
        option:'',
        statisticsList:[],
        statisticsListNew:[],
        searchCondition:{
          page:1,rows:5
        },
        pressPages:0,
        principal_user_id:'',
        status_router:'',
        loading:false,
        nextStatus :'加载中.....'
      };
    },
    mounted: function () {
      this.$nextTick(function () {
        this.init();
      })
    },
    methods: {
      init:function(){
        this.searchCondition = {page:1,rows:5};
        var router =  this.$router.currentRoute.query;
        this.option = router.option;
        this.searchCondition.search_tj_down = router.search_tj_down;
        if(router.name){
          this.name =  router.name;
          this.searchCondition.statistics_id = router.principal_id;
          this.statisticsDetail();
        }else if(router.dept_name){
          this.name =  router.dept_name;
          this.searchCondition.dept_id = router.dept_id;
          this.queryTaskByDepartment();
        }else if(router.pj_name){
          this.name =  router.pj_name;
          this.searchCondition.user_id = router.user_id;
          this.queryTaskHJ();
        }else if(router.pj_dept_name){
          this.name =  router.pj_dept_name;
          this.searchCondition.dept_id = router.dept_id;
          this.queryTaskHJ();
        }else{
          this.name = '合计';
          this.queryTaskHJ();
        }
      },
      queryTaskByDepartment:function(){
        this.searchCondition.page = 1;
        var _this = this;
        _this.$http.post('/statistics/queryTaskByDepartment',
          _this.searchCondition
        )
          .then(function (res) {
            if(res.data.code == 100){
              _this.statisticsListNew = res.data.rows;
              _this.pressPages = (res.data.total % _this.searchCondition.rows >0 ?(res.data.total / _this.searchCondition.rows) + 1 : res.data.total / _this.searchCondition.rows);
              _this.searchCondition.page+=1;
              if(_this.statisticsListNew.length == 0){
                _this.$toast('没有查出相关数据');
                return;
              }
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      statisticsDetail:function(){
        this.searchCondition.page = 1;
        var _this = this;
        _this.$http.post('/task/queryTaskAll',
          _this.searchCondition
        )
          .then(function (res) {
            if(res.data.code == 100){
              _this.statisticsListNew = res.data.list;
              _this.pressPages = (res.data.total % _this.searchCondition.rows >0 ?(res.data.total / _this.searchCondition.rows) + 1 : res.data.total / _this.searchCondition.rows);
              _this.searchCondition.page+=1;
              if(_this.statisticsListNew.length == 0){
                _this.$toast('没有查出相关数据');
                return;
              }
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      queryTaskHJ:function(){
        this.searchCondition.page = 1;
        var _this = this;
        _this.$http('/task/queryTaskHJ',
          {params:_this.searchCondition}
        )
          .then(function (res) {
            if(res.data.code == 100){
              _this.statisticsListNew = res.data.rows;
              _this.pressPages = (res.data.total % _this.searchCondition.rows >0 ?(res.data.total / _this.searchCondition.rows) + 1 : res.data.total / _this.searchCondition.rows);
              _this.searchCondition.page+=1;
              if(_this.statisticsListNew.length == 0){
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
        this.searchCondition.option = this.option;
        this.searchCondition.taskId = taskId;
        this.searchCondition.name = this.name;
        this.searchCondition.routerBack = '/progress';
        if(this.$router.currentRoute.query.progressHJ){
          this.searchCondition.progressHJ = 'progressHJ';
        }
        this.$router.push({path:'/task_detail',query:this.searchCondition})
      },
      ajaxFunction:function(){
          var _this = this;
        if(_this.$router.currentRoute.query.name){
            return  _this.$http.post('/task/queryTaskAll',
                       _this.searchCondition
                     )
        }else if(this.$router.currentRoute.query.dept_name){
          return  _this.$http.post('/statistics/queryTaskByDepartment',
                       _this.searchCondition
                   )
        }else{
          return _this.$http('/task/queryTaskHJ',
                    {params:_this.searchCondition}
                  )
        }
      },
      scroll:function(){
        var _this = this;
        _this.nextStatus = '加载中.....';
        _this.loading = false;
        if (_this.searchCondition.page==1){
          return;
        }
        if(_this.searchCondition.page>_this.pressPages){
          _this.$toast('没有更多消息');
          return;
        }
        _this.ajaxFunction()
        .then(function (res) {
          if(res.data.code == 100){
            var list = res.data.list;
            var list = res.data.rows;
            _this.searchCondition.page+=1;
            _this.loading = true;
            setTimeout(() => {  //更新返回数组
              for (var i = 0; i < list.length; i++) {
                _this.statisticsListNew.push(list[i]);
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
  .progress_content{position: absolute;top:90px;left:0;right:0;bottom: 0;overflow: scroll;}
  .progress_header{background: #fff;padding:10px;border-bottom: 1px solid #eee}
  .progress_content{overflow: auto;}
  .content-title h4{text-align:left;padding:10px 10px;border-bottom:1px solid #e2e2e2;font-weight:500;font-size:16px;}
  .content-item{background-color: #fff;padding:10px 0;}
  .content-item .left-icon{display: inline-block;vertical-align:top ;text-align: center;}
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
