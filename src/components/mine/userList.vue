<template>
  <!--<el-col class="userlist" :md={span:24} :xs={span:24} :sm={span:24}>-->
    <div class="test">
    <mt-header title="用户列表">
      <router-link :to="{ path:'/mine' }" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>

    <!--搜索框-->
    <div class="address_input">
      <el-row>
        <el-col :md={span:4,push:2} :xs={span:8,pull:0} :sm={span:8,push:2}  class="deptSearch">
          <div class="grid-content bg-purple">
            <template>
              <el-select style="margin-top: 0px;border-radius: 0px;
                   border-bottom-right-radius: 5px;border-top-right-radius: 5px;width: 95%;"v-model="select_dept" clearable placeholder="请选择部门" v-on:change="chooseDept">
                <el-option
                  v-for="item in deptlist"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId">
                </el-option>
              </el-select>
            </template>
          </div>
        </el-col>
        <el-col :md={span:10,push:2}  :xs={span:15,push:0} :sm={span:15,push:2} class="pepoSearch">
          <input  style="margin-top: 10px;border-radius: 0px;
                   border-bottom-right-radius: 5px;border-top-right-radius: 5px;width: 98%;" v-model="search_content" @change="searchInput($event)" type="search" placeholder="请输入人员姓名">
        </el-col>
      </el-row>
    </div>

    <!--人员列表-->
    <ul v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="check">
      <li  v-for="el in deptlist" v-if="el.userList.length>0">
        <mt-cell :title="el.deptName"  style="background:#f8f8f8"></mt-cell>
        <ul >
          <li v-for="user in el.userList">
            <mt-cell :title="user.name" >
              <span slot="icon"  :style="{ background: user.background }" class="circle mr5 ">{{user.userName}}</span>
            </mt-cell>
          </li>
        </ul>
      </li>
    </ul>

    <!--添加用户按钮-->
    <div class="newTaskbtn" style="position: fixed;bottom: 50px;right: 10px;">
      <router-link to="/addUser">
        <mt-palette-button content="+" mainButtonStyle="color:#fff;background-color:#38adff;">
          <div class="my-icon-button"></div>
        </mt-palette-button>
      </router-link>
    </div>
  </div>

  <!--</el-col>-->
</template>
<script>
  import {MessageBox} from 'mint-ui';
  export default{
    name:'userList',
    data() {
      return {
        select_dept:'',
        search_content:'',
        total:0,//总数
        total_page:0,
        current:1,
        size:8,
        deptlist:[],
        lastTime:'',
        loading:false,
        check:true
      }
    },
    created:function () {
      this.init();
    },
    methods: {
      chooseDept:function(){
        var obj=this;
        obj.current=1;
        obj.$http.post('/mine/querUserlist', {
          current:obj.current,
          size:obj.size,
          dept_id:obj.select_dept
        }).then(function (res) {
          //关闭下滑
          obj.loading = false;
          obj.deptlist=res.data.rows;
          obj.total=res.data.total;
          obj.total_page=obj.total % obj.size != 0 ? parseInt((obj.total / obj.size)+ 1 ) : obj.total / obj.size;
          obj.search_content='';
          obj.current+=1;
          /* obj.select_dept='';*/

        }).catch(function (err) {
          obj.$messagebox.alert("查询异常");
        })
      },
      loadMore:function(){
        var obj = this;
        if(obj.current==1){
          return;
        }
        var list;
        //跳过初次加载
        /* if (obj.current==1){
         return;
         }else if(obj.current>1){*/
//        obj.current++;
        //}
        /*判断是否为最后一页*/
        if(obj.current>obj.total_page){
          MessageBox('提示', '已全部加载');
          console.log(obj.current);
          console.log(obj.total_page);
          obj.loading=true;
          return;
        }
        obj.$http.post('/mine/querUserlist', {

          current:obj.current,
          size:obj.size

        }).then(function (res) {
          obj.current+=1;
          list = res.data.rows;
          obj.loading = true;
          setTimeout(function () {
            //更新返回数组
            for (var i = 0; i < list.length; i++){

                for(var j=0;j<obj.deptlist.length;j++){
                    if(list[i].deptId==obj.deptlist[j].deptId){
                      obj.deptlist[j].userList=obj.deptlist[j].userList.concat(list[i].userList);
                    }
                }

            }
            obj.loading = false;
          }, 1500);

        }).catch(function (err) {
          obj.$messagebox.alert('请求失败！')
        })
      },
      searchInput (event) {
        var obj = this;
        obj.lastTime = event.timeStamp;
        setTimeout(function(){
          if(obj.lastTime - event.timeStamp == 0){
            obj.current=1;//重置搜索内容的页数
            //初始查询
            obj.init();
          }
        },1500);
      },
      init: function () {
        var vm = this;
        this.$http.post('/mine/querUserlist',{

          current:vm.current,
          size:vm.size,
          params:vm.search_content

        }).then(function (res) {
          if(res.data.code == '100'){
            vm.deptlist=res.data.rows;
            vm.total=res.data.total;
            vm.total_page=vm.total % vm.size > 0 ? parseInt((vm.total / vm.size) + 1): vm.total / vm.size;
            vm.current+=1;
          }else{
            alert(res.data.msg)
          }
        })
      }
    },
  }
</script>
<style scoped>
  /*搜索框*/
  .userlist{
    position: absolute;
    top: 0;
    bottom:0;
    left: auto;
    right: auto;
    overflow: auto;
  }
  .address_input{text-align: center;color: #aaa}
  .address_input i{position: absolute;left: 37%;top:97px;font-size: 15px;}
  .address_input input{border:0;margin:10px auto;width: 90%;border-radius: 14px;padding:6px;background: #eee;text-align: center;height: 35px}
  .circle{
    display: inline-block;
    width:40px;
    height: 40px;
    line-height:40px;
    text-align: center;
    -webkit-border-radius:50%;
    -moz-border-radius:50%;
    border-radius:50%;
    color: #fff;
  }
  .colorOne{
    background: #5c6ea5;
  }
  .colorTwo{
    background: #b38979;
  }
  .colorThree{
    background: #f7b55e;
  }
</style>
