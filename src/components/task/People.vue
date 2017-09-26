<template>
  <div class="people">
    <mt-header title="人员"  >
      <router-link :to="{path:'/task_detail',query:{taskId:taskId}}" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>

    <div class="btn-wrap t-c mt10 mb10">
      <el-button-group style="width: 90%">
        <el-button size="large"
                   @click.native="active = 'tab-wd'"
                   :class="[active == 'tab-wd'? 'btn-active':'btn-default']"
                   style="width: 50%">未读({{noRead.length}})</el-button>
        <el-button size="large"
                   @click.native="active = 'tab-yd'"
                   :class="[active == 'tab-yd'? 'btn-active':'btn-default']"
                   style="width: 50%">已读({{yesRead.length}})</el-button>
      </el-button-group>
    </div>

    <mt-tab-container v-model="active">
      <mt-tab-container-item id="tab-wd">
        <mt-cell v-for="(el,index) in noRead" :key="index" :title="el.name" >
          <span slot="icon" class="circle mr5 colorOne" v-bind:style="{ background:'rgb('+Math.floor(Math.random()*256)+','+
           Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')'}">
            {{el.name.length >= 3?el.name.substr(el.name.length-2):el.name}}
          </span>
        </mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item id="tab-yd">
        <mt-cell v-for="(el,index) in yesRead" :key="index" :title="el.name" >
          <span slot="icon" class="circle mr5 colorOne" v-bind:style="{ background:'rgb('+Math.floor(Math.random()*256)+','+
           Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')'}">
            {{el.name.length >= 3?el.name.substr(el.name.length-2):el.name}}
          </span>
        </mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
  export default{
      name:'people',
      data(){
          return {
              active:'tab-wd',
              yesRead:{},//已读数据
              noRead:{},//未读数据
              taskId:''
          }
      },
      mounted(){
        this.taskId = this.$router.currentRoute.query.taskId;
        this.getdata(this.$router.currentRoute.query.taskId);
      },
      methods:{
          //获取数据方法
          getdata(id){
             let self = this;
             self.$http.get('/task/queryIsReadByID',{
                 params:{
                     task_id:id
                 }
             }).then(function (res) {
                   let data = res.data;
                   if(data.code === 100){
                       self.yesRead = data.map_yesRead;
                       self.noRead =  data.map_noRead;
                   }else{
                       self.$toast(data.msg);
                   }
               }).catch(function (err) {
                 self.$toast('加载失败！');
               })
          }
      }
  }
</script>
<style scoped>
  .btn-active{
    background-color: #20a0ff;
    color: #fff;
  }
  .btn-default{
    color: #1d90e6;
    border-color: #1d90e6;
    outline: none;
  }
  .circle{
    display: inline-block;
    width:38px;
    height: 38px;
    line-height:38px;
    text-align: center;
    -webkit-border-radius:50%;
    -moz-border-radius:50%;
    border-radius:50%;
    color: #fff;
    font-size: 14px;
  }
</style>
