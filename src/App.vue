<template>
  <div id="app">
    <el-row style="height: 100%">
      <el-col :md="1"
              v-if="isVisible"
              class="pcNav-wrap"
              style="background: #36a8fe;height: 100%;position: fixed;top: 0;left: 0;z-index:10">
        <pc-nav ref="pcNav"></pc-nav>
      </el-col>
      <el-col :xs="24" :sm="24" :md="layout" class="router_content">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import pcNav from './components/navbar/pcNav.vue'
  export default {
    name: 'app',
    components:{
      'pc-nav':pcNav
    },
    data(){
      return{
        isVisible:true,//显示隐藏pc端导航
        layout:{span:23, offset:1},//动态布局
      }
    }
  }
</script>

<style>
  #app{
    height:100%;
  }
 .router_content{
    height:100%;
    position: absolute;
    top: 0;
    bottom:0;
    left: auto;
    right: auto;
    overflow: auto;
  }
  /*header及mint-cell的全局字体大小*/
  .mint-header-title{
    font-size: 16px;
  }
  .mint-cell-text{
    font-size:14px;
  }
  .mint-cell-value{
    font-size:14px;
  }
  /*覆盖添加用户界面的输入框靠右显示*/
  .adduser .mint-field-core{
    text-align: right;
  }
  .adduser.mint-cell:last-child{
    background-size:100% 0;
  }
  /*通讯录上方搜索框样式修改*/
  .address_input .el-input__inner{
    border-radius: 0;
    margin-top: 10px;
    margin-left: 5px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-color: #eeeeee;
    border: none;
    border-right: 1px solid #dad3d3;
  }
  .address_input .el-select{
    width: 100%;
  }
  /*任务详情文本域背景色*/
  .disabled .mint-field-core{
    background-color: #fff;
  }

  /*媒体查询*/
  .pcNav-wrap{
    display: none;
  }
  @media screen and (min-width:992px){
    .ph-nav{
      display: none;
    }
    .pcNav-wrap{
      display: block;
    }
    .router_content{
      padding: 0 22px 0;
    }
  }

  /*新建任务上传样式*/
  .upload-demo div{
    font-size: 14px;
    background-color: #fff;
    border-top: 1px solid #f7f5f5;
    height: 48px;
    width: 100%;
    display: block;
    text-align: left;
    line-height: 48px;
  }
  .upload-demo div span{
    padding-left: 10px;
  }
  .upload-demo button{
    font-size: 14px;
    float: right;
    margin-top:7px;
    margin-right:4px;
  }
</style>
