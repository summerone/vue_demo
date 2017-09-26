<template>
  <div class="index" >
    <!--移动端头部-->
    <div  class="index-header">
      <!--背景图-->
      <div class="bg-picture">
        <!--<img src="../../assets/images/banner.png" style="height: 100%;width: 100%;">-->
      </div>
      <!--新建任务按钮-->
      <router-link to="/newTask">
        <button class="new-task" style="font-size: 16px">
          <i class="iconfont icon-add" v-bind:style="{color:'#38adff'}"></i>
          <span>新建任务</span>
        </button>
      </router-link>
    </div>
    <!--pc端头部-->
    <div class="pcHeader">
      <el-row>
        <el-col :span="2">
          <i class=" iconfont icon-home "></i>
          <span>首页</span>
        </el-col>
        <el-col :span="4" :offset="18">
          <router-link to="/newTask">
            <button>
              <i class="iconfont icon-add"></i>
              <span>新建任务</span>
            </button>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <!--事项及评价统计-->
    <el-row >
        <el-col :xs="24" :sm="24" :md="14">
          <el-row class="white mb10" >
            <el-col :span="8" class="btn-item1 item">
              <el-row>
                <el-col :span="8" class="t-r">
                  <i class="iconfont icon-icon1 mr5 relative">
                    <span class="symbol" v-show="(db_list[0] >= 1)"></span>
                  </i>
                </el-col>
                <el-col :span="16" class="t-l ">
                  <div><a class="f16" @click="jumpPage('index','total','db_0')">我的待办</a></div>
                  <div @click="jumpPage('index','total','db_1')"><span class="f12">未阅</span><b class="ml20 count-1 font_size">{{db_list[0]}}</b></div>
                  <div @click="jumpPage('index','total','db_2')"><span class="f12">已阅</span><b class="ml20 font_size">{{db_list[1]}}</b></div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" class="item">
              <el-row>
                <el-col :span="8" class="t-r">
                  <i class="iconfont icon-guanzhu2 mr5 relative">
                    <!--<span class="symbol" v-show="(gzr_list[0] >= 1) || (gzr_list[1] >= 1)"></span>-->
                  </i>
                </el-col>
                <el-col :span="16" class="t-l">
                  <div><a class="f16" @click="jumpPage('index','total','gz_0')">我的关注</a></div>
                  <div @click="jumpPage('index','total','gz_1')"><span class="f12">进行中</span><b class="ml12 count-1 font_size">{{gzr_list[0]}}</b></div>
                  <div @click="jumpPage('index','total','gz_2')"><span class="f12">已完成</span><b class="ml12 font_size">{{gzr_list[1]}}</b></div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" class="btn-item3 item">
              <el-row>
                <el-col :span="8" class="t-r">
                  <i class="iconfont icon-icon2 mr5 relative" >
                    <!--<span class="symbol" v-show="(fqr_list[0] >= 1) || (fqr_list[1] >= 1)"></span>-->
                  </i>
                </el-col>
                <el-col :span="16" class="t-l">
                  <div><a class="f16" @click="jumpPage('index','total','fq_0')">我的发起</a></div>
                  <div @click="jumpPage('index','total','fq_1')"><span class="f12">进行中</span><b class="ml12 count-1 font_size">{{fqr_list[0]}}</b></div>
                  <div @click="jumpPage('index','total','fq_2')"><span class="f12">已完成</span><b class="ml12 font_size">{{fqr_list[1]}}</b></div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      <!--评价统计-->
        <el-col :xs="24" :sm="24" :md="9">
          <el-row class="evalute-total">
            <el-col :span="8" class="left">
                <span class="icon" >
                  <i class="iconfont icon-dangfenglianzhengjianshe" v-bind:style="{fontSize:'30px'}"></i>
                </span>
                <span>评价</span>
            </el-col>
            <el-col :span="16" class="right">
              <el-row class="one row-item" @click.native="jumpPage('index','pj','ypj')">
                <el-col :span="14">
                  <span class="one t-l">已评价</span>
                </el-col>
                <el-col :span="10">
                  <span class="t-l two">{{pj_list[0]}}</span>
                </el-col>
              </el-row>
              <el-row class="row-item" @click.native="jumpPage('index','pj','dpj')">
                <el-col :span="14">
                  <span class="one t-l">待我评价</span>
                </el-col>
                <el-col :span="10">
                  <span class="t-l two count-1">{{pj_list[1]}}</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    <!--评价列表项-->
    <div class="content-wrap">
      <!--头部标题-->
      <el-row class="content-title">
        <el-col :span="6">
          <h4>最新评价</h4>
        </el-col>
        <el-col :span="5" :offset="13" style="text-align: right;padding-right: 10px;" @click.native="getRecentComment()">
          <a>
              <i class="iconfont icon-icon4 vt-m"></i>
              <span>刷新</span>
          </a>
        </el-col>
      </el-row>
      <!--列项-->
      <div class="content-item-wrap"
            v-for="(el,index) in recentComment" :key="index" @click="handleRouter(el.id)">
        <el-row class="content-item">
          <el-col :xs="5"  :sm="4" :md="3" class="left-icon">
            <span class="icon">
              <i class="iconfont icon-activity"
                 v-if="el.start_status == '1'"
                 v-bind:style="{fontSize:'30px'}"></i>
              <i class="iconfont icon-duihua"
                 v-if="el.start_status == '2'"
                 v-bind:style="{fontSize:'30px'}"></i>
            </span>
          </el-col>
          <el-col :xs="19" :sm="20" :md="21" class="right-text">
            <ul>
              <li class="one">
                <span>{{el.task_title}}</span>
                <!--<span v-if="el.start_status == '2'">我收到的任务</span>-->
                <!--<span v-if="el.start_status == '1'">我发起的任务</span>-->
                <span class="state">已评价</span><br>
                <!--<small class="time">开始时间：{{el.update_time | dateForm}}</small>-->
              </li>
              <!--<li>-->
                <!--<span>{{el.task_title}}</span>-->
              <!--</li>-->
              <li class="fontColor">
                <span>截止时间：</span>
                <span>{{el.end_time | dateNum}}</span>
              </li>
              <!--<li class="fontColor">-->
                <!--<span>创建人：</span>-->
                <!--<span>{{el.input_user_name}}</span>-->
              <!--</li>-->
              <li class="fontColor">
                <span>承办人：</span>
                <span>{{el.principal_name}}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
        <el-row class="evalute-content"  v-if="el.grade != null">
          <el-col :xs="5"  :sm="4" :md="3">
              <span class="v-line">
                <i class="iconfont icon-pingjia1-copy line-icon"></i>
              </span>
          </el-col>
          <el-col :xs="19" :sm="20" :md="21" class="evalute-text">
            <ul>
              <li class="smile" v-if="el.grade == '3'">
                <i class="iconfont icon-smile" ></i>
                <span >好评</span>
              </li>
              <li class="medium" v-if="el.grade == '2'">
                <i class="iconfont icon-zhongping-copy"></i>
                <span>中评</span>
              </li>
              <li class="bad" v-if="el.grade == '1'">
                <i class="iconfont icon-cry"></i>
                <span>差评</span>
              </li>
              <li>
                <span>{{el.appraise_name}}：</span>
                <span>{{el.remark | trunc(10)}}</span><br>
                <small class="time">{{el.input_time | dateForm}}</small>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <!--无数据是提示信息-->
      <div  v-if="noticeImg">
        <img style="width: 130px;margin-top: 10px;" src="../../assets/images/notask_03.png" alt="">
        <p class="notask">暂无最新评价数据</p>
        <!--<p>去创建一个新任务吧！</p>-->
      </div>
    </div>
    <!--底部导航组件-->
    <v-nav></v-nav>
  </div>
</template>
<!--javascript-->
<script>
  import VNav from '../navbar/navbar.vue'
  export default{
    name:'index',
    components:{
      'v-nav':VNav
    },
    data(){
      return {
        pj_list:[],//统计数据
        db_list:[],
        gzr_list:[],
        fqr_list:[],
        recentComment:'',//最新评价数据
        noticeImg:false,//没数据提示
      };
    },
    mounted(){
        this.getTotal();
        this.getRecentComment();
    },
    methods:{
        //跳转任务首页
        jumpPage(from,type,title){
          this.$router.push({path:'task',query:{from:from,type:type,title:title}})
        },
        //获取统计数据
        getTotal(){
            let self = this;
            self.$http.get('/task/queryTask')
              .then(function (res) {
                let data = res.data;
                if(data.code === 100){
                  self.pj_list = data.otherRes.pj_list;
                  self.db_list = data.otherRes.db_list;
                  self.gzr_list = data.otherRes.gzr_list;
                  self.fqr_list = data.otherRes.fqr_list;
                }else{
                  self.$toast(data.msg);
                }
              })
              .catch(function (err) {
                  self.$messagebox('提示','请求失败！');
              })
        },
      //获取最新评价
        getRecentComment(){
          let self = this;
          self.$http.post('/task/queryIsReadByID',{
             search_tj_down:4,
          })
            .then(function (res) {
              let data = res.data;
              if(data.code === 100){
                  self.recentComment = data.rows;
                  if(!data.rows.length){
                      self.noticeImg = true;
                  }else{
                    self.noticeImg = false;
                  }
              }else{
                  self.$toast(data.msg);
              }
            })
            .catch(function (err) {
              self.$messagebox('提示','最新评价数据请求失败');
            })
        },
      //查看详情
      handleRouter:function (taskId) {
        this.$router.push({path:'/task_detail',query:{'index':'index',taskId:taskId}})
      }
    }
  }
</script>
<!--样式-->
<style scoped>
  i{ font-size: 18px; }
  .index{
    text-align: center;
    width:100%;
    padding-bottom:60px;
  }
  .fontColor{
    color:#8d8d8d;
  }
  /*移动端头部样式-start*/
  .index-header{
    position: relative;
    padding-bottom: 40px;
    background: #fff;
  }
  .bg-picture{
    height:120px;
    width:100%;
    background: #00f url('../../assets/images/banner.png') no-repeat;
    -webkit-background-size: cover;
    background-size:cover;
  }
  /*新建任务按钮样式*/
  button.new-task{
    width:65%;
    padding:12px 0;
    border-radius:28px;
    border:none;
    position: absolute;
    top:100px;
    left:0;
    right:0;
    margin:auto;
    z-index:99;
    background-color: #fff;
    box-shadow:0 5px 5px #f7f7f7;
  }
  /*移动端头部样式-end*/

  /*pc端头部样式*/
  .pcHeader{
    display: none;
    box-sizing: border-box;
    padding:11px 2px;
    background: #fff;
    box-shadow:5px 0 4px #c3adad;
    margin:0 -22px 10px;
  }
  .pcHeader button{
    color: #38adff;
    padding:4px 20px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    background: #fff;
    border:1px solid #e2e2e2;
    cursor: pointer;
  }
  /*
  *事项及评价统计
  */
  /*统计按钮样式-start*/
  .btn-wrap{
    color: #070707;
    background-color: #fff;
    margin-bottom:10px;
  }
  .btn-item-title{
    line-height: 1.4;
    font-size: 16px;
  }
  .btn-item{
    padding:10px 0 14px;
    background-color: #fff;
  }
  .item{
    padding:10px 0 14px;
  }
  .btn-item .btn-item-title i{
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }
  i.icon-icon1{
    color: #00a2ff;
  }
  i.icon-guanzhu2{
    color: #ffa23f;
  }
  i.icon-icon2{
    color: #ffcc00;
  }
  .btn-item-count {
    font-size:12px;
    line-height:2em;
  }
  .btn-item-count b{
    font-weight:600;
    font-size:14px;
  }
  .btn-item-count .title{
    text-align: right;
  }
  .font_size{
    font-size: 18px;
  }
  .count-1{
    color: #ff5858;
  }
  i .symbol{
    display: inline-block;
    width: 6px;
    height:6px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top:1px;
    background: #ff5d32;
  }
  .btn-item1{
    border-right:1px solid #eef1f6;
  }
  .btn-item3{
    border-left:1px solid #eef1f6;
  }
  /*统计按钮样式-end*/

  /*评价统计-start*/
  .evalute-total{
    background-color: #fff;
    margin-bottom:10px;
  }
  .evalute-total .left{
    padding:18px 0;
    border-right:1px solid #eef1f6;
  }
  .evalute-total .left span.icon{
    display:block;
    width:40px;
    height:40px;
    line-height:40px;
    border-radius:40%;
    background-color: #25c1ff;
    color: #fff;
    margin:0 auto;
  }
  .evalute-total .right>div span{
    display: inline-block;
    width: 60%;
  }
  .evalute-total .right>div span.one{
    padding-left:30px;
  }
  .evalute-total .right>div span.two{
    padding-left:10px;
  }
  .evalute-total .right>div.one{
    border-bottom:1px solid #eef1f6;
  }
  .evalute-total .right div.row-item{
    padding:12px 5px;
  }
  /*评价统计-end*/

  /*主题内容样式*/
  .content-title{
    border-bottom:1px solid #e2e2e2;
    padding:10px;
  }
  .content-title,.content-item{
    background-color: #fff;
  }
  .content-title h4{
    text-align: left;
    font-weight:500;
    font-size:16px;
  }
  .content-item{
    padding:10px 0;
  }
  .content-item .left-icon span.icon{
    display: block;
    width:40px;
    height:40px;
    line-height:40px;
    margin: 0 auto;
    border-radius: 6px;
    border:1px solid #e2e2e2;
    color: #ff7d5a;
  }
  .content-item .right-text{
    text-align: left;
    line-height:1.7em;
  }
  .content-item .right-text ul li.one{
    line-height:1.5em;
  }
  .time{
    color: #bebebe;
  }
  .right-text ul li.one .state{
    display: inline-block;
    float: right;
    padding-right: 20px;
    color: #3fcca7;
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

  /*媒体查询*/
  @media screen and (min-width: 992px){
    .el-col-md-9{
      float: right;
    }
    .pcHeader{
      display: block;
    }
    .index-header{
      display: none;
    }
  }
</style>

