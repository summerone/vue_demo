<template>
  <div class="task_detail mb5" :class="{'pb50':isPadding}">
    <mt-header title="任务详情">
      <router-link :to="routertask" slot="left">
        <mt-button icon="back" ></mt-button>
      </router-link>
    </mt-header>

    <mt-cell :title="task_sort">
      <i slot="icon" class="icon iconfont icon-qr_code_light"></i>
    </mt-cell>

    <div class="text relative">
      <mt-field   class="mt10 disabled" v-bind:value="detailsList.task_title" disabled></mt-field>
      <mt-field v-bind:value="detailsList.task_content"
                type="textarea" rows="3"
                class="relative disabled"
                disabled>
        <!--已读未读-->
        <span  class="weidu"
               @click="goPeople"
               v-if="detailsList.task_status == '1'">{{readStatus}}</span>
      </mt-field>
      <!--标志完成-->
      <i class="iconfont icon-wancheng1 yanse"
         v-if="detailsList.task_status == '2' || detailsList.task_status == '4'"
         style="display: inline-block;position: absolute;top: 10px;right: 20px;font-size: 40px;z-index:99"
      ></i>
    </div>

    <mt-cell :title="'附件' + '('+ appendixList.length +')'"  class="kongbai mt10">
      <i slot="icon" class="icon iconfont icon-fujian3"></i>
    </mt-cell>
    <mt-cell  v-for="(el,index) in appendixList" :key="index"
              @click.native.stop="viewPicture('/taskManage' + el.path,el.type)"
              :title="el.appendix_name | trunc(12)" >
      <img slot="icon" v-if="el.type=='.txt'" src="../../assets/images/txt.jpg" class="pictureSize">
      <img slot="icon" v-if="el.type=='.doc'" src="../../assets/images/doc.jpg" class="pictureSize">
      <img slot="icon" v-if="el.type=='.xlsx' || el.type=='.xls'" src="../../assets/images/excle.jpg" class="pictureSize">
      <img slot="icon"
           v-if="!(el.type=='.jpg'||el.type=='.png'||el.type=='.xlsx'||el.type=='.xls'||el.type=='.doc'||el.type=='.txt')"
           src="../../assets/images/wenjian.jpg" class="pictureSize">
      <img slot="icon" v-if="el.type=='.jpg' || el.type=='.png'" :src="'/taskManage'+el.path" class="pictureSize" >
      <span style="color: #888888" >查看</span>
    </mt-cell>

    <mt-cell title="优先级"  class="mt10 mb10" v-if="task_sort == '专项任务'">
      <i slot="icon" class="icon iconfont icon-youxianji01"></i>
      <span v-if="detailsList.level === '1'">高</span>
      <span v-if="detailsList.level === '2'">普通</span>
      <span v-if="detailsList.level === '3'">低</span>
    </mt-cell>

    <div class="time-progress mb5">
      <mt-cell  :title="'时间进度'+ '('+ childrenTask.length +')'" class="time_jd">
        <i slot="icon" class="icon iconfont icon-jindu" style="color: rgba(163, 164, 165, 0.63);"></i>
        <span style="color: #888888">{{timeProgress(endtime)}}</span>
      </mt-cell>
      <!--含有子任务的部分-->
      <mt-cell   is-link
                v-for="(el,index) in childrenTask"
                :key="index" @click.native="handleRouter(el.id)">
        <i slot="icon" class="icon iconfont icon-zirenwu pl20"></i>
        <el-row slot="title" style="width: 80%;display: inline-block;">
          <el-col :span="11">
            <span class="f12">{{el.task_title | trunc(7)}}</span>
          </el-col>
          <el-col :span="7" class="mt5 pr10">
            <el-progress :percentage="percentage(el.start_time,el.end_time)" :show-text="false"></el-progress>
          </el-col>
          <el-col :span="6"><span class="f12">{{timeProgress(el.end_time)}}</span></el-col>
        </el-row>
        <!--<span class="cbr">王主任</span>-->
      </mt-cell>
    </div>

    <mt-cell title="承办人">
      <i slot="icon" class="icon iconfont icon-friendfamous"></i>
      <div class="cbr" v-for="cbr in principalList" :key="cbr.name"
           v-bind:style="{ background:'rgb('+Math.floor(Math.random()*256)+','+
           Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')'}">
        {{cbr.name.length>=3?cbr.name.substr(cbr.name.length-2):cbr.name}}</div>
      <span v-if="principalList.length > 0">{{principalList.length}}人</span>
    </mt-cell>

    <mt-cell title="关注人" >
      <i slot="icon" class="icon iconfont icon-people"></i>
      <div class="cbr" v-for="gzr in followList" :key="gzr.name"
           v-bind:style="{ background:'rgb('+Math.floor(Math.random()*256)+','+
           Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')'}">
        {{gzr.name.length>=3?gzr.name.substr(gzr.name.length-2):gzr.name}}</div>
      <span v-if="followList.length > 0">{{followList.length}}人</span>
    </mt-cell>

    <mt-cell title="通知方式">
      <i slot="icon" class="icon iconfont icon-icons64x6479"></i>
      <div>
        <el-checkbox-group v-model="check_fs">
          <!--<el-checkbox label="微信" disabled></el-checkbox>-->
          <el-checkbox label="短信" disabled></el-checkbox>
        </el-checkbox-group>
      </div>
    </mt-cell>
    <mt-cell title="完成期"  style="margin-bottom: 10px;">
      <i slot="icon" class="icon iconfont icon-calendar"></i>
      <span>{{detailsList.end_time | dateNum}}</span>
    </mt-cell>

    <!--评价和日志部分-->
    <mt-navbar v-model="selected">
      <div style="width: 20%;">
        <mt-tab-item id="1">评价</mt-tab-item>
      </div>
      <div style="width: 20%;">
        <mt-tab-item id="2">日志</mt-tab-item>
      </div>
      <div style="width: 25%;">
        <mt-tab-item id="3">退回原因</mt-tab-item>
      </div>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <!--评价部分-->
      <mt-tab-container-item id="1">
        <el-row class="evalute-content" id="evalute-content"
                 v-if="detailsList.task_status === '4' || detailsList.task_status === '5'">
          <el-col :span="5" class="line-box" style="text-align: center;">
              <i class="iconfont icon-pingjia1-copy line-icon"></i>
          </el-col>
          <el-col :span="19" :offset="5" class="evalute-text pr20">
            <ul>
              <li class="smile" v-if="evaluateContent.grade == '3'">
                <i class="iconfont icon-smile" ></i>
                <span >好评</span>
              </li>
              <li class="medium" v-if="evaluateContent.grade == '2'">
                <i class="iconfont icon-zhongping-copy"></i>
                <span>中评</span>
              </li>
              <li class="bad" v-if="evaluateContent.grade == '1'">
                <i class="iconfont icon-cry"></i>
                <span>差评</span>
              </li>
              <li>
                <span>{{evaluateName}}：</span>
                <span>{{evaluateContent.remark}}</span><br>
                <small class="time">{{evaluateContent.input_time | dateForm}}</small>
              </li>
            </ul>
          </el-col>
        </el-row>
        <el-row v-else="">
          <div class="p20">
            <span class="pl10"> 无数据！！</span>
          </div>
        </el-row>
      </mt-tab-container-item>
      <!--日志部分-->
      <mt-tab-container-item id="2">
        <el-row class="log-box relative" v-for="(el,index) in logList" :key="index">
          <el-col :span="5" class="log-line">
            <img src="../../assets/images/zhi.png" class="zhi">
          </el-col>
          <el-col :span="19" :offset="5" class="log-content">
            <ul>
              <li>{{el.input_user_name}}：{{el.task_log}}</li>
              <li><small style="color:#b1b0b5;">{{el.input_time | dateForm }}</small></li>
            </ul>
          </el-col>
        </el-row>
      </mt-tab-container-item>
      <!--退回原因-->
      <mt-tab-container-item id="3">
        <el-row class="log-box relative" v-for="(el,index) in returnReason" :key="index">
          <el-col :span="5" class="log-line">
            <i class="iconfont icon-tuihuo line-icon" style="font-size: 26px;top: 12px;"></i>
          </el-col>
          <el-col :span="19" :offset="5" class="log-content">
            <ul>
              <li>{{el.input_user_name}}：{{el.task_log}}</li>
              <li><small style="color:#b1b0b5;">{{el.input_time | dateForm }}</small></li>
            </ul>
          </el-col>
        </el-row>
        <el-row v-if="returnReason.length == 0">
          <div class="p20">
            <span class="pl10"> 无数据！！</span>
          </div>
        </el-row>
      </mt-tab-container-item>
    </mt-tab-container>
    <!--底部工具条一：进行中 && 发起人-->
    <el-row class="bg_blue f_white pt5 pb5 mt10 toolBtn"
            v-if="(task_status == '1') && (rank == '1')">
      <!--<el-col :span="6" class="t-c" @click.native="goNewTask">-->
        <!--<div><i class="iconfont icon-icon7" style="font-size: 22px;"></i></div>-->
        <!--<div class="pt5"><span>建子任务</span></div>-->
      <!--</el-col>-->
      <el-col :span="8" class="t-c" @click.native= 'cuiban'>
        <div><i class="iconfont icon-shouye10" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>催办</span></div>
      </el-col>
      <el-col :span="8" class="t-c" @click.native="handleRequest(stopTaskUrl,'/task')">
        <div><i class="iconfont icon-shouye14" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>终止任务</span></div>
      </el-col>
      <el-col :span="8" class="t-c" @click.native="delTask">
        <div><i class="iconfont icon-icon11" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>删除</span></div>
      </el-col>
    </el-row>
    <!--底部工具条二：进行中 && 承办人-->
    <el-row class="bg_blue f_white pt5 pb5 mt10 toolBtn"
            v-if="(task_status == '1') && (rank == '3')">
      <el-col :span="8"  class="t-c" @click.native="goLog()">
        <div><i class="iconfont icon-icon10" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>工作日志</span></div>
      </el-col>
      <el-col :span="8" class="t-c" @click.native="goNewTask">
        <div><i class="iconfont icon-icon7" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>建子任务</span></div>
      </el-col>
      <el-col :span="8"  class="t-c" @click.native="markFinish">
        <div><i class="iconfont icon-icon9" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>标记完成</span></div>
      </el-col>
    </el-row>
    <!--底部工具条三：完成 && 专项任务 && 发起人-->
    <el-row class="bg_blue f_white pt5 pb5 mt10 toolBtn"
            v-if="(task_sort == '专项任务') && (task_status == '2') && (rank == '1')">
      <el-col :span="8" class="t-c" @click.native="goEvaluate">
        <div><i class="iconfont icon-shouye11" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>去评价</span></div>
      </el-col>
      <el-col :span="8" class="t-c" @click.native="goReturn">
        <div><i class="iconfont icon-huitui" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>退回</span></div>
      </el-col>
      <el-col :span="8" class="t-c" @click.native="delTask">
        <div><i class="iconfont icon-icon11" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>删除</span></div>
      </el-col>
    </el-row>
    <!--底部工具条四：完成 && 日常任务 && 关注人-->
    <el-row class="bg_blue f_white pt5 pb5 mt10 toolBtn"
             v-if="(task_sort == '日常任务') && (task_status == '2') && (rank == '2')">
      <el-col :span="6" :offset="9" class="t-c" @click.native="goEvaluate">
        <div><i class="iconfont icon-shouye11" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>去评价</span></div>
      </el-col>
    </el-row>
    <!--底部工具条五：完成 && 日常任务 && 发起人-->
    <el-row class="bg_blue f_white pt5 pb5 mt10 toolBtn"
            v-if="(task_sort == '日常任务') && (task_status == '2') && (rank == '1')">
      <el-col :span="6" :offset="9" class="t-c" @click.native="delTask">
        <div><i class="iconfont icon-shouye1" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>删除</span></div>
      </el-col>
    </el-row>
    <!--底部工具条六：终止 && 发起人-->
    <el-row class="bg_blue f_white pt5 pb5 mt10 toolBtn"
            v-if="(task_status == '3') && (rank == '1')">
      <el-col :span="12" class="t-c" @click.native="handleRequest(restartTaskUrl,'/task')">
        <div><i class="iconfont icon-icon1" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>重新开启</span></div>
      </el-col>
      <el-col :span="12" class="t-c" @click.native="delTask">
        <div><i class="iconfont icon-icon11" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>删除</span></div>
      </el-col>
    </el-row>
    <!--底部工具条七：已评价 && 当前用户是发起人-->
    <el-row class="bg_blue f_white pt5 pb5 mt10 toolBtn"
            v-if="(task_status == '4') && (rank == '1')">
      <el-col :span="6" :offset="9" class="t-c" @click.native="archiveTask">
        <div><i class="iconfont icon-shouye1" style="font-size: 22px;"></i></div>
        <div class="pt5"><span>归档</span></div>
      </el-col>
    </el-row>

    <!--//附件查看-->
    <transition name="slide-fade">
      <div class="showPicture" style="position: fixed;
          top: 0;left: 0;right: 0;bottom: 0;background-color: #000;cursor: zoom-in;
          vertical-align: middle;z-index: 99;
          display: flex;justify-content: center;align-items: center"
           v-if="isShow" @click.stop="isShow = !isShow">
        <img :src="picUrl" class="previewImg"/>
      </div>
    </transition>
  </div>
</template>
<script>
  export default{
    name:'task_detail',
    data(){
      return{
        task_id:'',//保存当前任务id
        selected:'2',//默认展开日志
        detailsList:'',//详情列表
        appendixList:'',//附件
        principalList:[],//承办人
        followList:[],//关注人
        check_fs:[],//发送方式
        task_status:'',//任务状态
        task_sort:'',//任务分类
        task_sortID:'',//任务分类ID
        childrenTask:[],//子任务
        endtime:'',// 完成期
        evaluateContent:{},//评价内容
        evaluateName:'',//评价人
        logList:[],//日志
        returnReason:[],//退回原因
        rank:'',//用户权限（1、发起人，2.关注人，3、负责人）
        stopTaskUrl:'/task/stopTask',//终止任务请求路径
        restartTaskUrl:'/task/resetTaskByID',//重启任务请求路径
        delTaskUrl:'/task/delTaskByID',//删除任务请求路径
        markFinishUrl:'/task/updateTaskStatus',//标志完成请求路径
        archiveUrl:'/task/archiveTaskByID',//归档请求路径
        cuibanUrl:'/press/press_duanxin',//催办请求路径
        picUrl:'',//附件路径
        isShow:false,//附件查看判断
        isPadding:true,//是否加底部padding判断,
        routertask:{path:'/task'}
      }
    },
    mounted: function () {
      var _this = this;
      let query = this.$router.currentRoute.query;
      if(query.hasOwnProperty('selected')){
         this.selected = query.selected;
      }
      this.task_id = query.taskId;
      if(query.index){//判断路由是否从首页跳转到详情
          _this.routertask = {path:'/'}
      }else if(query.name == '我'){
        _this.routertask = {path:'/archive',query:{'mainname':'我',task_sort:query.task_sort}};
        return;
      }else if((!query.option)&&query.routerBack){
        _this.progressFun();
      }
      switch (query.option){
        case "taskMember":
          _this.progressFun();
          break;
        case "taskDepartment":
            if(query.routerBack == '/progress'){
                if(query.progressHJ){//判断合计的返回
                  var obj = {option:query.option,search_tj_down:query.search_tj_down}
                }else{
                   var obj = {option:query.option,dept_name:query.name,dept_id:query.dept_id,search_tj_down:query.search_tj_down}
                }
            }else{
                if(query.archiveHJ){
                  var obj = {option:query.option,search_tj_down:query.search_tj_down,task_sort:query.task_sort,}
                }else{
                  var obj = {option:query.option,dept_name:query.name,task_sort:query.task_sort,dept_id:query.dept_id,search_tj_down:query.search_tj_down}
                }
            }
           _this.routertask = {path:query.routerBack,query:obj};
          break;
        case "evaluationMembers":
          var obj = {option:query.option,pj_name:query.name,user_id:query.user_id,search_tj_down:query.search_tj_down}
          _this.routertask = {path:query.routerBack,query:obj};
          break;
        case "evaluationDepartment":
          var obj = {option:query.option,pj_dept_name:query.name,dept_id:query.dept_id,search_tj_down:query.search_tj_down}
          _this.routertask = {path:query.routerBack,query:obj};
          break;
      }
        this.$nextTick(function (){
          this.getTaskDetail();
        })
    },
    methods:{
      backFrom:function(){
        history.back();
      },
      progressFun:function(){//判断人员详情从哪进入的
        var _this = this;
        let query = this.$router.currentRoute.query;
        if(query.routerBack == '/progress'){
          if(query.progressHJ){
            var obj = {option:query.option,search_tj_down:query.search_tj_down}
          }else{
            var obj = {option:query.option,name:query.name,principal_id:query.statistics_id,search_tj_down:query.search_tj_down};
          }
        }else if(query.routerBack == '/archive'){
          if(query.archiveHJ){
            var obj = {option:query.option,search_tj_down:query.search_tj_down,task_sort:query.task_sort,}
          }else{
            var obj = {option:query.option,auditor_name:query.name,task_sort:query.task_sort,principal_id:query.statistics_id,search_tj_down:query.search_tj_down}
          }
        }
        _this.routertask = {path:query.routerBack,query:obj};
        },
        //获取任务详情
      getTaskDetail: function (id) {
        let _this = this;
        this.$http.get('/queryTask_detail',{
          params:{
            task_id: _this.task_id,
          }
        }).then(function (res) {
            let data = res.data;
            if(data.code === 100){
              switch (data.data.send_way){//发送方式
                case '1':
                  _this.check_fs = ['微信'];
                  break;
                case '2':
                  _this.check_fs = ['短信'];
                  break;
                case '3':
                  _this.check_fs = ['微信','短信'];
                  break;
              }
              _this.detailsList = data.data;//详情列表
              _this.appendixList = data.data.appendix;//附件
              _this.principalList = data.data.principal;//承办人
              _this.followList = data.data.follow;//关注人
              _this.task_status = data.data.task_status;//任务状态
              _this.task_sort = data.otherRes.sort.name;//任务分类
              _this.task_sortID = data.otherRes.sort.id;//任务分类ID
              _this.rank =  data.otherRes.rank;//用户权限
              _this.childrenTask = data.data.childrenTask;//子任务
              _this.endtime = data.data.end_time;//完成期
              _this.logList = data.data.handleLog.filter(function (item) {
                  return (item.log_status !== '3')
              });//日志
              _this.returnReason = data.data.handleLog.filter(function (item) {
                  return (item.log_status === '3')
              });//退回原因
              if(data.data.task_status === '4' || data.data.task_status === '5'){
                _this.evaluateContent = data.data.appraise;//评价内容
                _this.evaluateName = data.otherRes.appraise.name;//评价人
              }
              //样式判断
              setTimeout(function () {
                let toolBtn = document.getElementsByClassName('toolBtn');
                if(!toolBtn.length){
                  _this.isPadding = false;
                }
              },350)
            }else{
              _this.$toast(data.msg);
            }
        }).catch(function (err) {
          _this.$toast({ message: '加载失败'})
        });
      },
      //时间进度计算
      timeProgress:function (time) {
        let today = (new Date()).getTime();
        if((time - today) < 0){
          return '100%';
        }else{
          let day = (time - today)/(1000*60*60*24);
          return '剩余'+ Math.ceil(day) + '天';
        }
      },
      //进度条百分百计算
      percentage(start,end){
        let today = (new Date()).getTime();
        let per = (today - start)/(end - start)*100;
        return (per >= 0 && per <= 100) ? per : 100;
      },
      //请求公用处理方法
      handleRequest(url,router){
        let self = this;
        self.$http.post(url,{
          task_id:self.task_id
        })
        .then(function (res) {
            let data = res.data;
            if(data.code === 100){
              self.$toast(data.msg);
              setTimeout(function () {
                self.$router.push(router);
              },1000)
            }else{
              self.$toast(data.msg);
            }
          })
        .catch(function (err) {
          self.$toast('操作失败！')
        })
      },
      //催办
      cuiban(){
        let self = this;
        self.$messagebox.confirm('是否对该任务进行催办？','提示')
          .then(function () {
            self.$http.get(self.cuibanUrl,{
                params:{
                  task_id:self.task_id
                }
            })
              .then(function (res) {
                let data = res.data;
                if(data.code === 100){
                  self.$toast(data.msg);
                }else{
                  self.$toast(data.msg);
                }
              })
              .catch(function (err) {
                self.$toast('操作失败！')
              })
          },function () {})
      },
      //删除任务
      delTask(){
        let self = this;
        self.$messagebox.confirm('如果该任务下有子任务也会删除，是否确定删除该任务？','提示')
          .then(function () {
            self.$http.post(self.delTaskUrl,{
              task_id:self.task_id
            })
              .then(function (res) {
                let data = res.data;
                if(data.code === 100){
                  self.$toast(data.msg);
//                  self.$messagebox.alert('删除成功！即将跳转任务列表页','提示');
                  setTimeout(function () {
                    self.$router.push('/task');
                  },1000)
                }else{
                  self.$toast(data.msg);
                }
              })
              .catch(function (err) {
                self.$toast('操作失败！')
              })
          },function () {})
      },
      //标志完成
      markFinish(){
          let self = this;
          self.$messagebox.confirm('标记完成后，如果该任务下有子任务也会标记为完成，请确认是否标记为完成？','提示')
            .then(function () {
              self.$http.post(self.markFinishUrl,{
                task_id:self.task_id
              })
                .then(function (res) {
                  let data = res.data;
                  if(data.code === 100){
                    self.$toast(data.msg);
//                  self.$messagebox.alert('删除成功！即将跳转任务列表页','提示');
                    setTimeout(function () {
                      self.$router.push('/task');
                    },1000)
                  }else{
                    self.$toast(data.msg);
                  }
                })
                .catch(function (err) {
                  self.$toast('操作失败！')
                })
            },function () {})
      },
      //归档
      archiveTask(){
        let self = this;
        self.$http.post(self.archiveUrl,{
          task_id:self.task_id
        })
          .then(function (res) {
            let data = res.data;
            if(data.code === 100){
              self.$messagebox.alert('归档成功，可以在个人中心查看归档后的任务！');
              setTimeout(function () {
                self.$router.push('/task');
              },1500)
            }else{
              self.$toast(data.msg);
            }
          })
          .catch(function (err) {
            self.$toast('操作失败！')
          })
      },
      //去评价
      goEvaluate(){
          let self = this;
          this.$router.push({path:'evaluate',query:{taskId:self.task_id}})
      },
      //写工作日志
      goLog(){
        let self = this;
        this.$router.push({path:'log',query:{taskId:self.task_id}})
      },
      // 退回原因
      goReturn(){
        let self = this;
        this.$router.push({path:'returnReason',query:{taskId:self.task_id}})
      },
      //查看子任务详情
      handleRouter:function (taskId) {
        this.$router.push({path:'/task_detail',query:{taskId:taskId}})
      },
      //查看已读未读
      goPeople(){
        let self = this;
        this.$router.push({path:'/people',query:{taskId:self.task_id}})
      },
      //新建子任务
      goNewTask(){
        let self = this;
        this.$router.push({
          path:'/newTask',
          query:{taskId:self.task_id,
            title:self.detailsList.task_title,
            date:self.detailsList.end_time,
            task_sort:self.task_sort,
            task_sortID:self.task_sortID
          }
        })
      },
      //附件查看
      viewPicture(url,type){
          if(type === '.jpg' || type === '.png'){
              this.picUrl = url;
              this.isShow =  true;
          }else{
            window.location.href = url;
          }
      }
    },
    computed:{
      //已读状态
        readStatus:function () {
          let count = 0;
          this.principalList.forEach(function (value,index) {
            if(value.read_status === 'N'){
               count++;
            }
          });
          return (count > 0)? count + '人未读':'全部已读';
        }
    },
    watch:{
        '$route':function (to,from) {//查看子任务
          this.task_id = this.$router.currentRoute.query.taskId;
          this.$nextTick(function (){
            this.getTaskDetail();
          })
        }
    }
  }
</script>
<style scoped>
  /*附件样式*/
  .pictureSize{
    height: 25px;
    width: 25px;
    vertical-align: middle;
    margin-left: 20px;
    margin-right: 10px;
  }
  .yanse{
    color: #26a2ff;
  }
  .toolBtn{
    line-height: 1;
    position: fixed;
    left: 0;
    bottom:0;
    z-index:99;
    right: 0;
  }
  /*人员样式*/
  .cbr{
    font-size: 12px;
    display: inline-block;
    width: 30px;
    height:30px;
    line-height: 30px;
    text-align: center;
    margin-right: 5px;
    border-radius:50%;
    background: #26a2ff;
    color: #fff;
  }
  /*未读定位*/
  .weidu{
    display: inline-block;
    color: #26a2ff;
    position: absolute;
    right: 8px;
    bottom:-25px;
    width: 60px;
  }
/*评价部分样式*/
  .evalute-content{
    /*height:90px;*/
    border-top:1px solid #eef1f6;
    overflow: hidden;
    position: relative;
  }
  .line-box{
    position: absolute;
    left:0;
    top:0;
    height:100%;
    background: url(../../assets/images/line.png) center  repeat-y ;
  }
  .line-icon{
    color: #37c6ff;
    display: inline-block;
    position: absolute;
    background: #f7f5f5;
    z-index: 1;
    top:30%;
    left:50%;
    margin-left:-15px;
    font-size:24px;
    line-height:30px;
    width:30px;
    height:30px;
    text-align: center;
  }
  .evalute-content ul{
    padding:6px 0;
    text-align: left;
  }
  .evalute-text ul li:first-child i{
    font-size: 18px;
    vertical-align: middle;
  }
  /*好评color、*/
  .evalute-content ul li:first-child.smile{
    color: #89ee6b;
  }
  /*中评color*/
  .evalute-content ul li:first-child.medium{
    color: #25c1ff;
  }
  /*差评color*/
  .evalute-content ul li:first-child.bad{
    color: #ff9c85;
  }
  /*日志部分样式*/
  .log-line{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: url(../../assets/images/line.png) center  repeat-y ;
  }
  .log-content{
    padding: 12px 20px 0 12px;
  }
  .zhi{
    width: 22px;
    height:22px;
    padding: 3px 0;
    display: inline-block;
    background-color: #f7f5f5;
    position: absolute;
    top:12px;
    left: 50%;
    margin-left: -11px;
  }

  .previewImg{
    width: 100%;
    /*height: 100%;*/
  }
  @media screen and (min-width: 600px){
    .previewImg{
      width: auto;
      height: auto;
    }
  }
</style>
