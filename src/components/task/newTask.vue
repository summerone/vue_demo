<template>
  <div class="newTask relative">
    <div v-show="isBuild">
    <mt-header title="新建任务">
      <router-link v-if="prentParams.title" :to="{ path:'/task_detail', query: { taskId:  prentParams.taskId} }" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <router-link v-if="!prentParams.title" :to="{ path:'/index' }" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <mt-cell v-bind:title="prentParams.title==null?'分类选择':prentParams.task_sort+'：'+prentParams.title" is-link @click.native="handlePop()">
      <i slot="icon" class="icon iconfont icon-qr_code_light"></i>
      <span v-if="!prentParams.title">{{popData.taskSort}}</span>
    </mt-cell>
    <mt-field  placeholder="任务标题（必填）" class="mt10" v-model="taskTitle"></mt-field>
    <mt-field  placeholder="任务内容（必填）" type="textarea" rows="3" v-model="taskContent"></mt-field>
    <el-upload
      class="upload-demo"
      action="/taskManage/ueditor_1.4.3.3/jsp/controller.jsp?action=uploadfile&encode=utf-8"
      :show-file-list="true"
      :multiple="true"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-preview="showFun">
      <span class="uploadTitle" style="font-size: 14px"><i class="icon iconfont icon-fujian3"></i> 附件</span>
      <el-button size="small" class="yanse"><i class="icon iconfont icon-shangchuan1 " style="font-size: 20px;"></i>上传</el-button>
    </el-upload>
    <mt-cell v-if="isYxj" title="优先级"  is-link value="请选择" class="mt10 mb10" @click.native="handlePop2()">
      <i slot="icon" class="icon iconfont icon-youxianji01"></i>
      <span>{{popData.priority}}</span>
    </mt-cell>

    <mt-cell title="承办人" is-link @click.native="openAddress('Y')">
      <i slot="icon" class="icon iconfont icon-friendfamous"></i>
      <div class="cbr" v-for="cbr in personArray1" :key="cbr.name"
           v-bind:style="{ background:cbr.background}">
        {{cbr.name.length>=3?cbr.name.substr(cbr.name.length-2):cbr.name}}</div>
      <span v-if="personArray1.length==0">
        <i slot="is-link" class="icon iconfont icon-roundadd vt-m" style="font-size: 20px;"></i>
      </span>
    </mt-cell>
    <mt-cell title="关注人" is-link @click.native="openAddress('N')">
      <i slot="icon" class="icon iconfont icon-people"></i>
      <div class="cbr" v-for="gzr in personArray2" :key="gzr.name"
           v-bind:style="{ background:gzr.background}">
        {{gzr.name.length>=3?gzr.name.substr(gzr.name.length-2):gzr.name}}</div>
      <span v-if="personArray2.length==0">
        <i slot="is-link" class="icon iconfont icon-roundadd vt-m" style="font-size: 20px;"></i>
      </span>
    </mt-cell>
    <mt-cell title="通知方式">
      <i slot="icon" class="icon iconfont icon-icons64x6479"></i>
      <div>
        <el-checkbox-group v-model="check_fs">
          <!--<el-checkbox label="微信" disabled></el-checkbox>-->
          <el-checkbox label="短信"></el-checkbox>
        </el-checkbox-group>
      </div>
    </mt-cell>
    <mt-cell title="完成期" is-link @click.native="openTimePicker('picker')">{{time | dateNum }}
      <i slot="icon" class="icon iconfont icon-calendar"></i>
    </mt-cell>
    <mt-datetime-picker
      ref="newTask_picker"
      type="date"
      v-model="time"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleChange">
    </mt-datetime-picker>
    <mt-button type="primary"  class="mt10 posi" size="large" @click="preservationTasks()">保存</mt-button>
    </div>

    <v-address v-on:onAddren="addrenFun" v-show="isAddren" ref="txl"></v-address>
    <!--表单分类选择弹框-->
    <mt-popup
      style="width: 100%;"
      v-model="popData.popupVisible1"
      position="bottom">
      <mt-picker :slots="popData.slots1" :showToolbar="true" @change="onValuesChange">
        <div class="toolbar-content pb6 pt6" style="border: 1px solid #e2e2e2;">
          <button style="border: none;background: #fff" class="yanse f18 pl20" @click="popData.popupVisible1 = !popData.popupVisible1">取消</button>
          <button  style="border: none;background: #fff" class="fr yanse f18 pr20" @click="getValue()">确定</button>
        </div>
      </mt-picker>
    </mt-popup>
    <!--优先级弹框-->
    <mt-popup
      style="width: 100%;"
      v-model="popData.popupVisible2"
      position="bottom">
      <mt-picker :slots="popData.slots2" :showToolbar="true" @change="onValuesChange2">
        <div class="toolbar-content pb6 pt6" style="border: 1px solid #e2e2e2;" >
          <button style="border: none;background: #fff" class="yanse f18 pl20" @click="popData.popupVisible2 = !popData.popupVisible2">取消</button>
          <button  style="border: none;background: #fff" class="fr yanse f18 pr20" @click="getValue2()">确定</button>
        </div>
      </mt-picker>
    </mt-popup>
    <!--查看图片的弹框-->
    <div class="showPicture" style="position: fixed;
    top: 0;left: 0;right: 0;bottom: 0;background-color: #000;cursor: zoom-in;
    vertical-align: middle;z-index: 999;display: flex;justify-content: center;align-items: center" v-if="isShow" @click.stop="isShow = !isShow">
    <img :src="picUrl"  style="width: 100%"/>
    </div>

    <!--弹出层部分-->
    <div v-if="isAbc" style="font-size:18px;position: fixed;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0,0,0,0.4);z-index:10;">
      <div class="tank">
        <div style="text-align: center;">
          <img src="../../assets/images/success.png" style="width: 50%;height: 60%;margin-top: -84px;">
        </div>
        <div style="text-align: center;">
          <span>保存成功!</span>
        </div>
        <div style="text-align: center;margin-top: 10px">
          <button class="pt10 pb10" style="width: 70%;background-color: rgb(85, 195, 241);color: white;border-radius: 18px;border: none;font-size: 16px;" @click="newTask()">再建一条</button>
        </div>
        <div style="text-align: center;margin-top: 10px;">
          <button class="pt10 pb10" style="font-size: 16px;width: 70%;background-color: #fff;border-radius: 18px;border: 1px solid  rgb(85, 195, 241);color: rgb(85, 195, 241)" @click="returnFirst()">返回首页</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  import task_address from './task_address.vue'

  export default{
    name:'newTask',
    data(){
      return{
        prentParams:'',
        isAddren:false,
        isBuild:true,
        cookiePerson:'',//coookie中取登录人员
        personArray1:[],//承办人
        personArray2:[],//关注人
        personID1:[],//承办人ID
        personID2:[],//关注人ID
        check_fs:[],//发送方式
        time:new Date(),//完成期
        taskTitle:'',
        taskContent:'',
        fileLists:[],
        taskSortList:[],//用于存储分类选择数组
        priorityList:['高', '普通','低'],
        popData:{
          taskSortID:'',//分类ID
          taskSort:'', //分类选项
          priority:'',//优先级
          change1:'',//中间数据
          change2:'',
          popupVisible1:false,//弹框状态
          popupVisible2:false,
          slots1:[
            {flex:1, values:[]}
          ],
          slots2:[
            {flex:1, values:[]}
          ],
        },
        picUrl:'',
        isShow:false,
        isYxj:true,
        showCancelButton:false,
        isAbc:false
      }
    },
    mounted: function () {
      this.$nextTick(function (){
        this.prentParams = this.$router.currentRoute.query;
        this.popData.taskSort = this.prentParams.task_sort;
        this.popData.taskSortID = this.prentParams.task_sortID;
        var r={background:'',id:document.cookie.split(';')[0].split('=')[1],name:unescape(document.cookie.split(';')[0].split('=')[0])};
        var k={background:'',id:document.cookie.split(';')[1].split('=')[1],name:unescape(document.cookie.split(';')[1].split('=')[0])};
        this.cookiePerson = r;
        if(!this.prentParams.task_sortID){
          this.init();
        }
      })
    },
    methods:{
      init: function () {
        var _this = this;
        this.$http.get('/queryTask_sort').then(function (res) {
          if(res.data.code==100){
            for(var i=0;i<res.data.otherRes.list.length;i++) {
              _this.taskSortList.push(res.data.otherRes.list[i]);
              _this.popData.slots1[0].values.push(res.data.otherRes.list[i].name);
            }
          }else{
            Toast({ message: '加载失败'});
          }
        }).catch(function (err) {
          Toast({ message: '加载异常'});
        });
      },
      addrenFun:function (res) {
        var person = res[1];
        if(res[2] == 'Y'){
          this.personArray1 = person;
          this.personID1=[];
          for(var i=0;i<person.length;i++){
            this.personID1.push(person[i].id);
          }
        }else if(res[2] == 'N'){
          this.personArray2 = person;
          if(this.popData.taskSort && this.popData.taskSortID==2){
            var k = true;
            for(var i=0;i<person.length;i++){
              if(person[i].id==this.cookiePerson.id){
                k = false;
              }
            }
            if(k){
              person.push(this.cookiePerson)
              this.personID2.push(parseInt(this.cookiePerson.id));
            }
          }
          this.personID2=[];
          for(var i=0;i<person.length;i++){
            this.personID2.push(person[i].id);
          }
        }
        this.isAddren = res[0];
        this.isBuild =!res[0];
      },
      openAddress(obj){
        let data = this.popData.change1[0];
        if(data=='日常任务'){
          return;
        }else {
          this.isAddren = true;
          this.isBuild = false;
          this.$refs.txl.type = obj;
        }

      },
      //点击弹出表单分类选择框
      handlePop:function () {
        if(this.prentParams.taskId==null){
          this.popData.popupVisible1 = true;
        }else{
          this.$router.push({path:'/task_detail',query:{taskId:this.prentParams.taskId}})
        }
      },
      //点击弹出优先级选择框
      handlePop2:function () {
        this.popData.popupVisible2 = true;
        //动态添加优先级级别
        this.popData.slots2[0].values.splice(0,this.priorityList.length)
        for(var i=0;i<this.priorityList.length;i++){
          this.popData.slots2[0].values.push(this.priorityList[i]);
        }
      },
      //选择框change事件监听
      onValuesChange(picker, values) {
        this.popData.change1 = values;
        for(var i=0;i<this.taskSortList.length;i++){
          if(this.taskSortList[i].name == values){
            this.popData.taskSortID = this.taskSortList[i].id
          }
        }
      },
      onValuesChange2(picker, values) {
        this.popData.change2 = values;
      },
      //点击表单分类选择框确定按钮操作
      getValue:function () {
        let data = this.popData.change1[0];
        if((data !== undefined) && (data !== null)){
          this.popData.taskSort = data;
          this.personArray1 = [];
          this.personArray2 = [];
          this.personID1 = [];
          this.personID2 = [];
          if(data=='日常任务'){
            this.isYxj=false;
            var r={background:'',id:document.cookie.split(';')[0].split('=')[1],name:unescape(document.cookie.split(';')[0].split('=')[0])};
            var k={background:'',id:document.cookie.split(';')[1].split('=')[1],name:unescape(document.cookie.split(';')[1].split('=')[0])};
            this.personArray1.push(r);
            this.personArray2.push(k);
            this.personID1.push(document.cookie.split(';')[0].split('=')[1]);
            this.personID2.push(document.cookie.split(';')[1].split('=')[1]);
          }else {
            var k = true;
            for(var i=0;i<this.personArray2.length;i++){
              if(this.personArray2[i].id==this.cookiePerson.id){
                k = false;
              }
            }
            if(k){
              this.personArray2.push(this.cookiePerson)
              this.personID2.push(parseInt(this.cookiePerson.id));
            }
            this.isYxj=true;
          }
          this.popData.popupVisible1 = false;
        }else{
          this.$toast('请选择选项！');
        }
      },
      getValue2:function () {
        let data = this.popData.change2[0];
        if((data !== undefined) && (data !== null)){
          this.popData.priority = data;
          this.popData.popupVisible2 = false;
        }else{
          this.$toast('请选择选项！');
        }
      },
      //时间选择弹框
      openTimePicker(){
        this.$refs.newTask_picker.open();
      },
      handleChange(value) {
        this.time = value;
      },
      //文件上传删除
      handleRemove(file, fileList){
        this.fileLists.splice(0,this.fileLists.length);
        for(var i=0;i<fileList.length;i++){
          var name = fileList[i].response.original;
          var url = fileList[i].response.url;
          var type = fileList[i].response.type;
          var fileContentR = '{"name":"'+name+'","path":"'+url+'","type":"'+type+'"}';
          this.fileLists.push(fileContentR);
        }
      },
      //文件上传成功
      handleSuccess(response, file, fileList){
        if(response.state=='SUCCESS'){
          var fileContent = '{"appendix_name":"'+response.original+'","path":"'+response.url+'","type":"'+response.type+'"}';
          this.fileLists.push(fileContent);
          Toast({ message: '上传成功'})
        }else if(response.state=='不允许的文件类型'){
          Toast({ message: '不允许的文件类型'})
        }
      },
      //显示上传文件信息
      showFun(file){
        //window.location.href ='/taskManage' +file.response.url;
        if(file.response.type === '.jpg' || file.response.type === '.png'){
          this.picUrl = '/taskManage' +file.response.url;
          this.isShow =  true;
        }else{
          Toast({ message: '只能查看图片！'});
          return false;
        }
      },
      //文件上传异常
      handleError(err, file, fileList){
        Toast({ message: '文件上传异常'})
      },
      //保存任务
      preservationTasks(){
        if(!(this.prentParams.date=='') && this.prentParams.date<this.time){
          TaskPrompt('子任务完成期不能大于父任务完成期');return;
        }
        if(this.popData.taskSortID==''){
          TaskPrompt('请填写分类选择');return;
        }
        if(this.taskTitle==''){
          TaskPrompt('请填写任务标题');return;
        }
        if(this.taskContent==''){
          TaskPrompt('请填写任务内容');return;
        }
        if(this.popData.priority=='' && this.popData.change1[0]=='专项任务'){
          TaskPrompt('请选择优先级');return;
        }
        if(this.personArray1.length<=0 || this.personArray2.length<=0){
          TaskPrompt('请填写承办人或关注人');return;
        }
//        if(this.check_fs.length<=0){
//          TaskPrompt('请选择通知方式');return;
//        }
        function TaskPrompt(msg){
          Toast({ message: msg})
        }
        var levelID;
        if(this.popData.priority.trim()=='高'){
          levelID = 1;
        }else if(this.popData.priority.trim()=='普通'){
          levelID = 2;
        }else if(this.popData.priority.trim()=='低'){
          levelID = 3;
        }
        var sendWayID = 0;
        if(this.check_fs.length==1 && this.check_fs[0]=='微信'){
          sendWayID = 1;
        }else if(this.check_fs.length==1 && this.check_fs[0]=='短信'){
          sendWayID = 2;
        }else if(this.check_fs.length==2){
          sendWayID = 3;
        }
        var Time = this.time
        var _this =this;
        this.$http.post('/insertTask',{
          parent_id:this.prentParams.taskId,//父任务
          task_sort:this.popData.taskSortID,//分类选择
          task_title:this.taskTitle,//任务标题
          task_content:this.taskContent,//任务内容
          appendixList:this.fileLists,//附件
          level:levelID,//优先级
          principalList:this.personID1,//承办人
          followList:this.personID2,//关注人
          send_way:sendWayID,//发送方式
          end_time:Time.getFullYear() + '-' + (Time.getMonth()+1)+ '-' + Time.getDate(),//完成日期
        }).then(function (res) {
          if(res.data.code == 100){
            _this.isAbc=true;
          }else{
            Toast({message: res.data.msg})
          }
        }).catch(function (err) {
          Toast({ message: '发送异常'})
        });
      },
      //在建一条
      newTask(){
        location.reload()
      },
      //返回首页
      returnFirst(){
        this.$router.push({path:'/index'})
      }
    },
    components:{
      'v-address':task_address
    }
  }
</script>
<style scoped>
  .posi{
    border-radius:0;
    height: 50px;
    /*position: fixed;*/
    /*z-index: 999;*/
    /*bottom: 0;*/
  }
  .yanse{
    color: #26a2ff;
  }
  /*人员样式*/
  .cbr{
    display: inline-block;
    width: 36px;
    height:36px;
    line-height: 36px;
    text-align: center;
    margin-right: 2px;
    border-radius:50%;
    background: #26a2ff;
    color: #fff;
  }
  .el-button{
    border: 0px solid;
  }

  .tank{
    background-color: white;width: 70%;border-radius: 5px;margin: 45% auto;padding: 60px 0 20px ;
  }
  @media screen and (min-width: 600px){
    .tank{
        width: 30%;margin: 10% auto;
    }
  }

</style>
