<template>
  <div class="log">
    <mt-header title="退回原因" >
      <router-link :to="{path:'/task_detail',query:{taskId:taskId}}" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <!--评价内容-->
    <mt-field placeholder="请输入..." type="textarea" rows="5" v-model="content"></mt-field>
    <!--提交按钮-->
    <el-row style="margin-top:20px">
      <el-col  :xs=" {span: 22, offset: 1}">
        <mt-button type="primary" size="large"
                   @click.native="submitReason()" >提交</mt-button>
      </el-col>
      <el-col  :xs=" {span: 1, offset: 0}"></el-col>
    </el-row >
  </div>
</template>
<script>
  export default{
    name:'returnReason',
    data(){
      return{
        taskId:'',//任务id
        content:''//内容
      }
    },
    mounted(){
      //获取taskid
      this.taskId = this.$router.currentRoute.query.taskId;
    },
    methods:{
      //提交日志
      submitReason(){
        let self = this;
        if(!self.content){
          self.$toast('提交内容不能为空！');
          return false;
        }
        self.$http.post('/task/insertTaskReturn',{
          task_id:self.taskId,
          task_log:self.content
        }).then(function (res) {
          let data = res.data;
          if(data.code === 100){
            self.$toast(data.msg);
            self.content = '';
            setTimeout(function () {
              self.$router.push({path:'/index'});
            },1000)
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
