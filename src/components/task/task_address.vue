<template>
  <div>
    <div class="headerAddress">
      <mt-header title="通讯录">
        <router-link to="" slot="left">
          <mt-button icon="back" @click="closecAddress"></mt-button>
        </router-link>
      </mt-header>
      <div class="address_input">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <template>
                <el-select v-model="select" clearable placeholder="请选择" v-on:change="init">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.dept_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="grid-content bg-purple-light">
              <i class="iconfont icon-search" v-show="!search"></i>
              <input type="text" placeholder="搜索人员" v-model="search" class="search_inpt"
                     style="margin-top: 10px;height: 24px;border-radius: 0px;
                   border-bottom-right-radius: 5px;border-top-right-radius: 5px;width: 98%;" v-on:blur="init">
            </div>
          </el-col>
        </el-row>
      </div>
      <!--这部分是通讯录列表-->
      <div  class='address_content'>
        <div class="address_parson">
          <ul>
            <li class="d_jump" v-for="(address,key) in addressOptions">
              <div class="address_mage" v-bind:id="key" ><span>{{key}}</span></div>
              <a class="mint-cell" v-for="el in address">
                <div class="mint-cell-wrapper">
                  <div class="mint-cell-title">
                    <label class="mint-checklist-label">
                    <span class="mint-checkbox">
                      <input type="checkbox" class="mint-checkbox-input" @click="checkOne($event,el)">
                      <span class="mint-checkbox-core"></span>
                    </span>
                      <span class="width_cicle margin_left" v-bind:style="{ background: el.background }">{{el.name.slice(0,1)}}</span>
                      <div style="display: inline-block;vertical-align: middle;">
                        <div>
                          <span class="mint-checkbox-label margin_left">{{el.name}}</span>
                        </div>
                        <div style="margin-top: 5px;">
                          <span style="color:rgb(199, 195, 195);font-size: 14px;margin-left: 10px;">{{el.dept_name}}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div class="mint-cell-value">
                    <span></span></div>
                </div>
                <div class="mint-cell-right">
                </div>
              </a>
            </li>
          </ul>

          <!-- 链接字母-->
          <div class="address_href">
            <ul><li v-for="(address,key,index) in addressList" @click="jump(index)">{{key}}</li></ul>
          </div>
          <div class="address_button">
            <div style="float: left;margin-top: 12px;color: #2b9de2;margin-left: 15px;">
              <label>已选择：{{count_ry}}人</label>
            </div>
            <div>
              <el-button type="primary" style="float: right;margin: 6px;" @click="determine()">确定</el-button>
              <el-button type="primary" style="float: right;margin: 6px;background: #fff;color: black;border: 1px solid #aaa;" @click="emptyCheck()">清空</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Toast } from 'mint-ui';
  import bus from '../../assets/common/eventBus';
  export default{
    name:'address',
    data(){
      return {
        name:'',
        search:'',
        paramslist:{},
        count_ry:'0',
        addressList:'',
        adressString:[],
        select:'',
        options:'',
        type:'',
        url:''
      };
    },
    watch:{
      type:function(){
        this.emptyCheck();
      },
    },
    mounted: function () {
      var _this=this;
      this.$nextTick(function () {
        this.init();
      });
    },
    computed: {
      addressOptions: function () {
        for(var i in this.addressList){
          this.addressList[i].forEach(function(value,i){
            if(typeof value.background == 'undefined'){
              var r=Math.floor(Math.random()*256);
              var g=Math.floor(Math.random()*256);
              var b=Math.floor(Math.random()*256);
              value.background = "rgb("+r+','+g+','+b+")";
            }
          })
        }
        return this.addressList;
      }
    },
    methods: {
      init() {
        var _this = this;
        var deptID = this.select==''?0:this.select;
        this.$http.post('/queryAddress',{
          name:_this.search,
          dept_id:deptID,
        }).then(function (res) {
          _this.addressList = res.data.otherRes.address;
          _this.options = res.data.otherRes.dept;
        }).catch(function (err) {
          Toast({ message: '加载异常'});
        });
      },
      checkAllFun(ev){
        var flg = ev.target.checked;
        var checkInpAll = document.getElementsByClassName('mint-checkbox-input');
        for(var i=0;i<checkInpAll.length;i++){
          if(flg){
            checkInpAll[i].checked = true;
            this.count_ry = checkInpAll.length;
          }else{
            checkInpAll[i].checked = false;
            this.count_ry = 0;
          }
        }
      },
      closecAddress(){
        this.search = '';
        this.adressString = [];
        var checkInpAll = document.getElementsByClassName('mint-checkbox-input');
        for(var i=0;i<checkInpAll.length;i++){
          checkInpAll[i].checked = false;
          this.count_ry = 0;
        }
        this.select = '';
        this.init();
        this.$emit('onAddren',[false]);
      },
      checkOne(ev,obj){
        var _this = this;
        var flg_one = ev.target.checked;
        if(flg_one){
          this.adressString.push({id:obj.id,name:obj.name,background:obj.background});
          this.count_ry++;
        }else{
          this.adressString.forEach(function(value,index){
            if(value.id == obj.id){
              _this.adressString.splice(index,1);
            }
          });
          this.count_ry--;
        }
      },
      determine(){
        this.$emit('onAddress',this.adressString);
        var personArray = this.adressString;
        if(personArray.length == 0){
          Toast({message: '请选择人员'});
          return;
        }else if(this.type == 'Y' && personArray.length > 5){
          Toast({message: '承办人不能大于5个'});
          return;
        }else{
          if(this.type == 'N' && personArray.length > 2){
            Toast({message: '关注人不能大于2个'});
            return;
          }else{
            this.$emit('onAddren',[false, personArray, this.type]);
            this.search = '';
            this.select = '';
//            this.init();
          }
        }
      },
      emptyCheck(){
        var checkInpAll = document.getElementsByClassName('mint-checkbox-input');
        for(var i=0;i<checkInpAll.length;i++){
          checkInpAll[i].checked = false;
          this.count_ry = 0;
        }
          this.adressString = [];
      },
      jump (index) {
        var jump = document.querySelectorAll('.d_jump');
        var total = jump[index].offsetTop+96;
        var distance = document.documentElement.scrollTop || document.body.scrollTop;
        var step = total / 20;// 平滑滚动，时长500ms，每10ms一跳，共50跳
        if (total > distance) {
          smoothDown()
        } else {
          let newTotal = distance - total;
          step = newTotal / 50;
          smoothUp()
        }
        function smoothDown () {
          if (distance < total) {
            distance += step;
            document.body.scrollTop = distance;
            document.documentElement.scrollTop = distance;
            setTimeout(smoothDown, 10)
          } else {
            document.body.scrollTop = total;
            document.documentElement.scrollTop = total
          }
        }
        function smoothUp () {
          if (distance > total) {
            distance -= step
            document.body.scrollTop = distance
            document.documentElement.scrollTop = distance
            setTimeout(smoothUp, 10)
          } else {
            document.body.scrollTop = total
            document.documentElement.scrollTop = total
          }
        }
      },
    }
  }
</script>
<style scoped>
  div.el-select .el-input i.el-input__icon{top:60%}
  .address_content .address_button{background-color: #f7f5f5;width: 100%;position: fixed;bottom: 0;border-top: 1px solid #eee}
  .address_parson .address_href ul li{color:#aaa;line-height: 1.4;text-align: center}
  .address_parson .address_href{ background: transparent; padding-left:30px;padding-right:10px;overflow:scroll;
    z-index:3;position: fixed;top:22%;right:0px;bottom: 50px;font-size: 12px;}
  .address_parson{position: relative;top:0;right:0;bottom: 0;overflow: scroll;margin-bottom: 48px}
  .address_opatype{width: 100%;background: black;opacity: .6;position: fixed;z-index:2;top: 0;bottom: 0;left: 0;right: 0}
  .mint-cell-wrapper{padding: 0}
  .margin_left{margin-left: 10px;}
  .mint-tab-container{overflow: auto;position: static}
  .address_content .address_mage{background: #eee;padding-left:6px;}
  .address_header{padding: 5px;}
  .headerAddress{width: 100%;background: #fff;position: absolute;top:0;right:0;bottom:0;z-index: 2;}
  .width_cicle{font-size:16px;display:inline-block;width: 32px;height:30px;line-height:30px;text-align:center;
    background: #795da3;border-radius: 50%;color: #fff;padding: 3px;}
  .address_choolse{padding:5px;overflow:hidden;border-bottom: 1px solid #eee;padding-bottom: 10px;}
  .address_choolse ul li{float: left;margin-right: 10px;}
  .address_input{
    text-align: center;  color: #aaa
  }
  .address_input i{
    position: absolute;left: 52%;top:15px;font-size: 15px;
  }
  .address_input input{
    border:0;margin:10px auto;width: 90%;border-radius: 10px;
    padding:6px;background: #eee;text-align: center
  }
  @media screen and (min-width: 900px){
    .address_content .address_button{
      width:92%;
    }
  }
</style>
