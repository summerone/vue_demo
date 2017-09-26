<template>
  <div id="evaluate">
    <mt-header title="评价" >
      <router-link :to="{path:'/task_detail',query:{taskId:taskId}}" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <!--常用语弹框-->
    <el-popover
      ref="normal"
      placement="bottom"
      width="60%"
      v-model="sheetVisible"
      trigger="click">
      <ul class="f14 cyy">
        <li v-for="(el,i) in cyy_value" :key="'v1'+i" :class="{'active':el.state}" @click="toggleColor(i)">{{el.text}}</li>
      </ul>
    </el-popover>
    <mt-cell >
      <span v-popover:normal class="f14">常用语选择<i class="iconfont icon-unfold"></i></span>
    </mt-cell>
    <!--评价内容-->
    <mt-field placeholder="请输入评价内容" type="textarea" rows="5" v-model="evaluateContent"></mt-field>

    <!--评价等级-->
    <div  id="fwpj">
      <el-row >
        <el-col  :span="8" style="text-align: left;margin-left:10px">服务评分</el-col>
        <el-col  :span="5" v-for="(el,i) in selectIcon" :key="'v2'+i" @click.native="toggleLevel(i)">
          <span class="pingjia"
                :class="[{'nice_color':el.selectState&&i===0},{'middle_color':el.selectState&&i===1},
                {'bad_color':el.selectState&&i===2}]">
            <i class="icon iconfont  fontsize" :class="el.icon"></i>{{el.text}}
          </span>
        </el-col>
        <el-col  :span="1"></el-col>
      </el-row>
    </div>
    <!--提交按钮-->
    <el-row style="margin-top:20px">
      <el-col  :xs=" {span: 22, offset: 1}">
        <mt-button type="primary" size="large"
                    @click.native="submitEvaluate()">提交</mt-button>
      </el-col>
      <el-col  :xs=" {span: 1, offset: 0}"></el-col>
    </el-row >
</div>
</template>

<script type="text/javascript">
export default {
  name: 'evaluate',
  data () {
    return {
      sheetVisible : false,
      celvalue : "请选择",
      introduction : '',
      cyy_value:[   //常用语板块
        {text:'完美，希望以后工作中继续发扬！',state:true},
        {text:'确实完成的不错！',state:false},
        {text:'还有待进步，再接再厉！',state:false},
        {text:'已经超期了只能差评了！',state:false},
      ],
      evaluateContent:'', //评价内容
      selectIcon:[  //评价等级生成内容
        {icon:'icon-smile',text:'好评',level:3,selectState:false},
        {icon:'icon-zhongping-copy',text:'中评',level:2,selectState:false},
        {icon:'icon-cry',text:'差评',level:1,selectState:false}
      ],
      evaluateLevel:'',  //评价等级
      taskId:5,//任务id
    }
  },
  mounted(){
      //获取taskid
      this.taskId = this.$router.currentRoute.query.taskId;
  },
  methods : {
    toggleColor:function (i) { //常用语背景色切换
        let self = this;
        self.sheetVisible = false;
        this.cyy_value.forEach(function (value,index) {
          if(index === i){
            value.state = true;
            self.evaluateContent = value.text;
          }else{
              value.state = false;
          }
        })
    },
    toggleLevel:function (i) {  //评价等级颜色切换
      let self = this;
      this.selectIcon.forEach(function (value,index) {
        if(index === i){
          value.selectState = true;
          self.evaluateLevel = value.level;
        }else{
          value.selectState = false;
        }
      })
    },
    //提交评价
    submitEvaluate(){
        let self = this;
        if(!self.evaluateLevel){
          self.$toast('服务评分不能为空！');
          return false;
        }
        if(!self.evaluateContent){
          self.$toast('评价内容不能为空！');
          return false;
        }
        self.$http.post('	/task/evaluate/insertEvaluate',{
            task_id:self.taskId,
            grade:self.evaluateLevel,
            remark:self.evaluateContent,
        })
          .then(function (res) {
              if(res.data.code === 100){
                  self.$toast(res.data.msg);
                  //内容初始化
                  self.evaluateLevel = '';
                  self.evaluateContent = '';
                  self.selectIcon.forEach(function (value,index) {
                    value.selectState = false;
                  });
                  setTimeout(function () {
                    self.$router.push({path:'/task_detail',query:{taskId:self.taskId,selected:'1'}});
                  },200)
              }else{
                  self.$toast(res.data.msg);
              }
          })
          .catch(function (err) {
            self.$toast('操作失败！');
          })
    }
  }
}
</script>
<style scoped>
#option{
  margin-bottom: 10px
}
#fwpj{
  margin-top: 2px;
  background-color: #fff;
  line-height: 40px
}
.fontsize{
  font-size: 20px;
  margin-right: 8px;
  vertical-align: middle;
}
.pingjia{
  text-align: left;
  margin-right: 10px
}
.pingjia-div{
  width: 100%;
  padding-right: 10%
}

ul.cyy li{
  margin: 0 -10px;
  padding: 4px 10px;
}
.active{
  background: #f6f6f6;
}
.level_active{
  color: #ffc027;
}
</style>
