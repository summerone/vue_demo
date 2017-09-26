<template>
  <div class="log">
    <mt-header title="日志" >
      <router-link :to="{path:'/task_detail',query:{taskId:taskId}}" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <!--评价内容-->
    <mt-field placeholder="请输入..." type="textarea" rows="5" v-model="logContent"></mt-field>
    <!--提交按钮-->
    <el-row style="margin-top:20px">
      <el-col  :xs=" {span: 22, offset: 1}">
        <mt-button type="primary" size="large"
                   @click.native="submitLog()" >提交</mt-button>
      </el-col>
      <el-col  :xs=" {span: 1, offset: 0}"></el-col>
    </el-row >
  </div>
</template>
<script>
  export default{
      name:'log',
      data(){
          return{
              taskId:'',//任务id
              logContent:''//日志内容
          }
      },
      mounted(){
        //获取taskid
        this.taskId = this.$router.currentRoute.query.taskId;
      },
      methods:{
          //提交日志
         submitLog(){
            let self = this;
            if(!self.logContent){
              self.$toast('提交内容不能为空！');
              return false;
            }
            self.$http.post('/addHandleLog',{
                task_id:self.taskId,
                task_log:self.logContent
            }).then(function (res) {
                let data = res.data;
                if(data.code === 100){
                    self.$toast(data.msg);
                    self.logContent = '';
                    setTimeout(function () {
                      self.$router.push({path:'/task_detail',query:{taskId:self.taskId}});
                    },200)
                }else{
                    self.$toast(data.msg);
                }
            }).catch(function (err) {
                self.$toast('操作失败！');
            })
         }
      }
  }
</script>
