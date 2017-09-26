 <template>
  <div id="taskIndex" style="padding-bottom: 60px">
    <mt-header title="任务">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <mt-search v-model="value" v-show="search"></mt-search>
    <!--搜索框-->
    <!--<div v-on:click="handleIconClick" v-show="search ? false:true">-->
      <div>
        <el-row style="margin-top:5px">
          <el-col :xs=" {span: 22, offset: 1}" :md="{span: 24, offset: 0}">
            <el-input
              placeholder="请输入内容"
              icon="search"
              v-model="searchCondition.input_val"
              v-on:blur="init(searchCondition.search_tj_up,searchCondition.search_tj_down,searchCondition.search_tj_down_1,'',stutas.stutasA,stutas.stutasB,stutas.stutasC)"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
    <!--</div>-->
    <!--选项-->
    <div class="selectOuter" v-show="search ? false:true">
      <div class="selectPanl">
        <el-row>
          <el-col  :xs=" {span: 5, offset: 1}" :sm="{span: 2, offset: 1}" :md = "{span: 2, offset: 1}"  :class="{'selected' : stutasSelectA.a}"><span v-on:click="init('',searchCondition.search_tj_down,searchCondition.search_tj_down_1,'','a',stutas.stutasB,stutas.stutasC)">全部</span></el-col>
          <div class="selectedAll">
            <div class="selectedChildren">
              <el-col  :class="{'selected' : stutasSelectA.b}":xs=" {span: 5, offset: 1}" :md="{span: 5, offset: 1}"><span  v-on:click="init('1',searchCondition.search_tj_down,searchCondition.search_tj_down_1,'','b',stutas.stutasB,stutas.stutasC)">我收到的</span></el-col>
              <el-col  :class="{'selected' : stutasSelectA.c}" :xs=" {span: 5, offset: 1}" :md="{span: 5, offset: 1}"><span v-on:click="init('3',searchCondition.search_tj_down,searchCondition.search_tj_down_1,'','c',stutas.stutasB,stutas.stutasC)">我关注的</span></el-col>
              <el-col  :class="{'selected' : stutasSelectA.d}" :xs=" {span: 5, offset: 1}" :md="{span: 5, offset: 1}"><span v-on:click="init('2',searchCondition.search_tj_down,searchCondition.search_tj_down_1,'','d',stutas.stutasB,stutas.stutasC)">我发起的</span></el-col>
            </div>
          </div>
        </el-row>
      </div>

      <div class="selectPanl">
      <el-row>
        <el-col  :xs=" {span: 5, offset: 1}" :sm="{span: 2, offset: 1}" :md = "{span: 2, offset: 1}"  v-bind:class="{'selected' : stutasSelectB.f}"><span  v-on:click="init(searchCondition.search_tj_up,'',searchCondition.search_tj_down_1,'',stutas.stutasA,'f',stutas.stutasC)">全部</span></el-col>
        <div class="selectedAll">
          <div class="selectedChildren">
            <el-col  v-bind:class="{'selected' : stutasSelectB.h}" :xs=" {span: 5, offset: 1}" :md="{span: 3, offset: 1}"><span v-on:click="init(searchCondition.search_tj_up,'2',searchCondition.search_tj_down_1,'',stutas.stutasA,'h',stutas.stutasC)">进行中</span></el-col>
            <el-col  v-bind:class="{'selected' : stutasSelectB.i}" :xs=" {span: 5, offset: 1}" :md="{span: 3, offset: 1}"><span v-on:click="init(searchCondition.search_tj_up,'3',searchCondition.search_tj_down_1,'',stutas.stutasA,'i',stutas.stutasC)">已完成</span></el-col>
          </div>
        </div>
      </el-row>
    </div>

      <div class="selectPanl">
        <el-row>
          <el-col  :xs=" {span: 5, offset: 1}" :sm="{span: 2, offset: 1}" :md = "{span: 2, offset: 1}"  v-bind:class="{'selected' : stutasSelectC.l}"><span  v-on:click="init(searchCondition.search_tj_up,searchCondition.search_tj_down,'','',stutas.stutasA,stutas.stutasB,'l')">全部</span></el-col>
          <div class="selectedAll">
            <div class="selectedChildren">
              <!--<el-col  v-bind:class="{'selected' : stutasSelectB.g}" :xs=" {span: 5, offset: 1}" :md="{span: 3, offset: 1}"><span v-on:click="init(searchCondition.search_tj_up,'1','',stutas.stutasA,'g')">已过期</span></el-col>-->
              <el-col  v-bind:class="{'selected' : stutasSelectC.m}" :xs=" {span: 5, offset: 1}" :md="{span: 3, offset: 1}"><span v-on:click="init(searchCondition.search_tj_up,searchCondition.search_tj_down,'1','',stutas.stutasA,stutas.stutasB,'m')">已逾期</span></el-col>
              <el-col  v-bind:class="{'selected' : stutasSelectC.n}" :xs=" {span: 5, offset: 1}" :md="{span: 3, offset: 1}"><span v-on:click="init(searchCondition.search_tj_up,searchCondition.search_tj_down,'2','',stutas.stutasA,stutas.stutasB,'n')">未逾期</span></el-col>
              <!--<el-col  v-bind:class="{'selected' : stutasSelectB.j}" :xs=" {span: 5, offset: 1}" :md="{span: 3, offset: 1}"><span v-on:click="init(searchCondition.search_tj_up,'4','',stutas.stutasA,'j')">已评价</span></el-col>-->
              <!--<el-col  v-bind:class="{'selected' : stutasSelectB.k}" :xs=" {span: 5, offset: 1}" :md="{span: 3, offset: 1}"><span v-on:click="init(searchCondition.search_tj_up,'5','',stutas.stutasA,'k')">待我评价</span></el-col>-->
            </div>
          </div>
        </el-row>
      </div>
    </div>
    <!--任务面板列表-->
    <div class="mt10 taskIndexSctroll"
         v-infinite-scroll="scroll"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="10"
    >
      <div class="content-item white mb10"  v-for="(el,index) in taskList" @click="handleRouter(el.id)" >
        <el-row class="content-item  pt10 pb10">
          <el-col :xs="5" :sm="4" :md="3">
          <span class="icon t-c">
             <i class="iconfont " :class="{'icon-duihua': el.start_status == 2}" v-bind:style="{fontSize:'30px'}"></i>
             <i class="iconfont " style="color: rgb(74, 161, 218);" :class="{'icon-activity': el.start_status == 1}" v-bind:style="{fontSize:'30px'}"></i>
          </span>
          </el-col>
          <el-col :xs="19" :sm="20" :md="21">
            <ul>
              <li>
                <span>{{el.task_title}}</span>
                <!--<span v-if="el.start_status == 1" class="content">我发起的任务</span>-->
                <!--<span v-if="el.start_status == 2" class="content">我收到的任务</span>-->
                <!--<span class="fr pr20 ypjColor">已评价</span>-->
                <span class="fr pr20 " style="color:#A0D675;" v-if="el.xs_status == 1">已过期</span>
                <span class="fr pr20 " style="color:#ffcc00;"  v-else-if="el.xs_status == 2 || el.xs_status == 5">进行中</span>
                <span class="fr pr20 " style="color:#5BCFAE;" v-else-if="el.xs_status == 3">待评价</span>
                <span class="fr pr20 " style="color:red;" v-else-if="el.xs_status == 6">已终止</span>
                <span class="fr pr20 ypjColor"  v-else-if="el.xs_status == 4">已评价</span>
                <br>
                <!--<span class="fontColor f12">开始时间:{{el.start_time | date}}</span>-->
              </li>
              <!--<li >-->
                <!--<span>{{el.task_title}}</span>-->
              <!--</li>-->
              <li class="fontColor">
                <span>截止时间：</span>
                <span>{{el.end_time | dateNum}}</span>
              </li>
              <!--<li class="fontColor">-->
                <!--<span>创建人：</span>-->
                <!--<span >{{el.input_user_name | trunc(10)}}</span>-->
              <!--</li>-->
              <li class="fontColor">
                <span>承办人：</span>
                <span >{{el.principal_name | trunc(10)}}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
        <el-row class="evalute-content" v-if="el.grade != null">
          <el-col :xs="5" :sm="4" :md="3" style="text-align: center">
            <span class="v-line" >
              <i class="iconfont icon-pingjia1-copy line-icon"></i>
            </span>
          </el-col>
          <el-col :xs="19" :sm="20" :md="21" class="evalute-text" >
            <ul>
              <li class="smile">
                <i class="iconfont green" :class="{'icon-smile':el.grade == '3'}"></i>
                <i class="iconfont blue" :class="{'icon-zhongping-copy':el.grade == '2'}"></i>
                <i class="iconfont red" :class="{'icon-cry':el.grade == '1'}"></i>
                <span v-if="el.grade == '3'">好评</span>
                <span class="blue" v-else-if="el.grade == '2'">中评</span>
                <span class="red" v-else="el.grade == '1'">差评</span>
              </li>
              <li>
                <span>{{el.appraise_name}}：</span>
                <span>{{el.remark | trunc(10)}}</span><br>
                <small class="time  fontColor">{{el.start_time | date}}</small>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <p class="loading" v-show="loading">{{nextStatus}}</p>
      <div class = 'loading' v-show="loadingImg">
        <img style="width: 130px;margin-top: 10px;" src="../../assets/images/notask_03.png" alt="">
        <p class="notask">暂无任务</p>
        <p>去创建一个新任务吧！</p>
      </div>
    </div>
    <!--新建任务按钮-->
    <div class="newTaskbtn" style="position: fixed;bottom: 70px;right: 15px;font-size: 22px;">
      <router-link to="/newTask">
        <i class="iconfont icon-xiala1" style="font-size: 50px;color:#38adff "></i>
      </router-link>
    </div>
    <!--底部导航组件-->
    <v-nav></v-nav>
  </div>
</template>
<script>
  import VNav from '../navbar/navbar.vue'
export default {
  name: 'taskIndex',
  data () {
    return {
      value : "",
      search : false,
      taskList:[],
      searchCondition:{  //分页属性
        page:1,
        rows:5,
        search_tj_up:'',
        search_tj_down:'',
        input_val:''
      },
      total:0,
      loading:false,
      nextStatus:'加载中....',
      loadingImg:false,
      pages:0,
      stutasSelectA:{'a':true,'b':false,'c':false,'d':false},
//      stutasSelectB:{'f':true,'g':false,'h':false,'i':false,'j':false,'k':false},
      stutasSelectB:{'f':true,'h':false,'i':false},
      stutasSelectC:{'l':true,'m':false,'n':false},
      stutas:{stutasA:'',stutasB:'',stutasC:''}
    }
  },
  mounted: function () {
      //初始化判断
    let query = this.$router.currentRoute.query;
    //从首页跳转过来
    if(query.hasOwnProperty('from') && query.from === 'index'){
      if(query.type === 'total'){
          switch (query.title){ //统计数值
            case 'db_0':
              this.init('',2,'',5,'a','f','l');
              break;
            case 'db_1':
              this.init('',11,'',5,'a','f','l');
              break;
            case 'db_2':
              this.init('',10,'',5,'a','f','l');
              break;
            case 'gz_0':
              this.init(3,'','','','a','f','l');
              break;
            case 'gz_1':
              this.init(3,2,'','','a','f','l');
              break;
            case 'gz_2':
              this.init(3,3,'','','a','f','l');
              break;
            case 'fq_0':
              this.init(2,'','',4,'a','f','l');
              break;
            case 'fq_1':
              this.init(2,2,'',4,'a','f','l');
              break;
            case 'fq_2':
              this.init(2,3,'',4,'a','f','l');
              break;
          }
      }else if(query.type === 'pj'){ //已评价，待评价
          switch (query.title){
            case 'ypj':
              this.init('',4,'','','a','f','l');
              break;
            case 'dpj':
              this.init('',5,'','','a','f','l');
              break;
          }
      }
    }else if(query.hasOwnProperty('search_tj_down')){
      this.init('',query.search_tj_down,'','','a','f','l');
    }else{
      this.$nextTick(function () {
        this.init('','','','','a','f','l');
      })
    }
  },
  methods : {
    init:function(search_tj_up,search_tj_down,search_tj_down_1,statistics_tj,stutasA,stutasB,stutasC){
      var _this = this;
      _this.nextStatus = '加载中....';
      _this.loading = false;
      _this.loadingImg = false;
      _this.searchCondition.page = 1;
      _this.searchCondition.search_tj_up = search_tj_up;
      _this.searchCondition.search_tj_down = search_tj_down;
      _this.searchCondition.search_tj_down_1 = search_tj_down_1;
      _this.searchCondition.statistics_tj = statistics_tj;
      _this.stutas = {stutasA:stutasA,stutasB:stutasB,stutasC:stutasC};
      for(var key in this.stutasSelectA){
        if(key == stutasA){
          this.stutasSelectA[key] = true;
        }else{
          this.stutasSelectA[key] = false;
        }
      }
      for(var key in this.stutasSelectB){
        if(key == stutasB){
          this.stutasSelectB[key] = true;
        }else{
          this.stutasSelectB[key] = false;
        }
      }
      for(var key in this.stutasSelectC){
        if(key == stutasC){
          this.stutasSelectC[key] = true;
        }else{
          this.stutasSelectC[key] = false;
        }
      }
      this.$http.post('/task/queryTaskAll',
        this.searchCondition
      )
        .then(function (res) {
          if(res.data.code == 100){
            _this.taskList = res.data.list;
            if(_this.taskList.length == 0){
              _this.loadingImg = true;
              return false;
            }
            _this.pages = (res.data.total % _this.searchCondition.rows >0 ?(res.data.total / _this.searchCondition.rows) + 1 : res.data.total / _this.searchCondition.rows);
            _this.searchCondition.page+=1;
          }else{ _this.$toast(res.data.msg);}
        })
        .catch(function (err) {
          _this.$messagebox.alert('请求失败！')
        })
    },
    scroll:function(){
      var _this = this;
      if (_this.searchCondition.page==1){
        return;
      }
      if(_this.searchCondition.page - 1> _this.searchCondition.page){
        _this.$toast('没有更多消息');
        return;
      }
      if(_this.searchCondition.page>_this.pages){
        _this.$toast('没有更多消息');
        return;
      }
      _this.$http.post('/task/queryTaskAll',
        _this.searchCondition
      ).then(function (res) {
        if(res.data.code == 100){
          var list = res.data.list;
          _this.searchCondition.page+=1;
          _this.loading = true;
          setTimeout(() => {  //更新返回数组
            for (var i = 0; i < list.length; i++) {
              _this.taskList.push(list[i]);
            }
            _this.loading = false;
          },2500);
        }
      }).catch(function (err) {
        _this.$messagebox.alert('请求失败！');
      })
    },
    handleIconClick:function(){
      this.search = true;
    },
    handleRouter:function (taskId) {
      this.$router.push({path:'/task_detail',query:{taskId:taskId}})
    }
  },
  components:{
    'v-nav':VNav
  }
}
</script>

<style scoped>
  .taskIndexSctroll{position: absolute;left: 0;right: 0;bottom: 0;top:184px;overflow: auto;margin-bottom: 50px;}
  .loading{ background:transparent;margin: 0;  padding: 0;   margin-top: 8px;  height: 20px;  line-height: 20px;  font-size: 15px;  text-align: center;  }
  /*#taskIndex{margin-bottom: 50px;}*/
  ::-webkit-scrollbar {display: none;  }
  /*div.selectedAll div.selectedChildren{width: 400%;}*/
  div.selectedAll div.selectedChildren div{width: 60px;margin-left: 10px;float: left;text-align: left}
  div.selectedAll{height:25px;margin-left: 13%;}
  div.taskList div.divContent>div{margin-top: 10px;}
  div.taskList div.headerSpan div.content{margin-top: 0}
  div.taskList div.fontColor{padding:0;margin-top:0;color: #aaa;font-size: 10px;}
  .taskList div.iconContent{height:35px;line-height:35px;margin-top:5px;width:35px;border: 1px solid #eee;padding: 2px;margin-left: 10%;text-align: center;border-radius: 5px;}
  /*div.taskList div[data-v-032e85d7]{margin-top: 0px;}*/
.selectOuter{
  margin-top: 10px
}
.selectPanl{
  background-color: #fff;
  text-align: center;
  padding: 3px 0;
}
  div.selectedAll div.selectedChildren div.selected,.selected{
  background-color: #F6F7FB;
  color: #5DA8DD;  border-radius:5px;
  text-align: center;
}
  @media only screen and (min-width: 994px) {
    .selectOuter{width: 100%;margin: 0 auto;margin-top: 10px;}
    .divContent>div{margin-left: 0;margin-right: 30px;}
    .taskIndexSctroll{    left: 6%;  right: 2%;}
  }
.taskList div{
  background-color: #fff;
  /*margin-top: 10px;*/
  text-align: left;
  color: #818181
}
/*.taskList .content{
  color: black;
}*/
/*.icon-hq{
  padding: 5px;
  border: 1px solid  red;
}*/
.icon-hq i {
  color: #38ACFF;
  font-size: 30px;
}
.icon-dh i{
  color: #FF7D5B;  font-size: 30px
}
.box-card{
  border: 0;
  border-radius:0px;
  box-shadow: 0 0 0 0;
}
div .el-row{
  margin-top: 0
}
.el-card__body{
  margin-top: 0;
  padding:0;
}

/*任务列表样式-start*/
  /*左*/
  .content-item  span.icon{
    display: block;
    width:40px;
    height:40px;
    line-height:40px;
    margin: 0 auto;
    border-radius: 6px;
    border:1px solid #e2e2e2;
  }
  .content-item  span i.icon-duihua{
    color: #ff7d5a;
  }
  .content-item  span i.icon-activity{
    color: #4aa1da;
  }
  /*右*/
  .content-item .fontColor{
    color:#8d8d8d;
  }
  .jxzColor{
    color: #64A4D4;
  }
  .ypjColor{
    color: #3fcca7;
  }
  .ygqColor{
    color: #f7b966;
  }
  /*任务列表样式-end*/

/*新建任务按钮样式*/
.mint-palette-button{
  width:50px;
  height:50px;
  line-height:50px;
}
  /*底部评价*/
  .content-item-wrap{
    background: #fff;
    margin-bottom:10px;
  }
  .content-item-wrap i.icon-activity{
    color: #38adff;
  }
  .content-itme-wrap i.icon-duihua{
    color: #ff7d5a;
  }
  .evalute-content{
    height:90px;
    border-top:1px solid #eef1f6;
    overflow: hidden
  }
  .evalute-content .v-line{
    position: relative;
    display: inline-block;
    width:1px;
    height:100px;
    background: #e2e2e2;
  }
  .evalute-content .line-icon{
    color: #37c6ff;
    display: inline-block;
    position: absolute;
    background: #fff;
    z-index: 1;
    top:30%;
    left:-15px;
    font-size:24px;
    line-height:30px;
    width:30px;
    height:30px;
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
</style>
