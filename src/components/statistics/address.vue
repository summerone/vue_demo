<template>

  <div class="content_">
    <div class="address_opatype" @click="hansClose()">  </div>

    <div  class="headerAddress">
      <div class="address_header"><span class="blue">已选择：{{checkedList.length}}人</span></div>
      <div class="address_choolse">
        <ul>
          <li v-for="el in checkedList">
            <div class="width_cicle" v-bind:style="{background:el.background}">{{el.name.slice(0,2)}}</div>
          </li>
        </ul>
      </div>
      <div class="address_input">
        <i class="iconfont icon-search" v-show="!search"></i>
        <input type="text" placeholder="搜索" v-model="search">
      </div>
      <div  class='address_content'>
        <div class="address_parson">
          <ul style="margin-bottom: 48px;">
            <li class="d_jump" v-for="(el,key) in reversedOptions1">
              <div class="address_mage" v-bind:id="key"><span>{{key}}</span></div>
              <a class=" mint-cells" v-for="(value,key) in el"><!---->
                <div class=" mint-cell-wrappers">
                  <div class="mint-cell-titles"><!---->
                    <label class="mint-checklist-labels">
                    <span class="mint-checkboxs"  :class="{'backBlue':value.checked}" @click.prevent="backgrd(value)">
                      <input type="checkbox" class="mint-checkbox-inputs"  >
                      <span class="mint-checkbox-cores" >
                        <i class="iconfont icon-check"></i>
                      </span>
                    </span>
                      <span class="width_cicle margin_left"  v-bind:style="{background:value.background}">{{value.name.slice(0,2)}}</span>
                      <span class="mint-checkbox-labels margin_left">{{value.name}}</span>
                    </label>
                  </div>
                </div>
              </a>
            </li>
          </ul>
          <div class="address_href">
            <ul>
              <li v-for="(value,key,index) in options1" v-on:click="jump(index)">{{key}}</li>
            </ul>
          </div>
          <div class="address_button">
            <button v-on:click="resete">重置</button><button v-on:click="surePerson">确定</button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>
<script>
  import bus from '../../assets/common/eventBus';
  export default{
    name:'address',
    data(){
      return {
        id:'selected',
        value1: [],
        search:'',
        options1 :[],
        checkedList:[],
        taskMember:false,
        time:{start:(new Date()).setMonth((new Date()).getMonth()-1),end:new Date()},
        user_id_list:''
      };
    },
    computed: {
      reversedOptions1: function () {
        for(var i in this.options1){
          this.options1[i].forEach(function(value,i){
            if(typeof value.background == 'undefined'){
              var r=Math.floor(Math.random()*230);
              var g=Math.floor(Math.random()*230);
              var b=Math.floor(Math.random()*230);
              value.background = "rgb("+r+','+g+','+b+")";
            }
          })
        }
        return this.options1;
      }
    },
    watch:{
      search:function(){
        this.init();
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.init();
        this.watchTime();
      })
    },
    methods: {
      init:function(){
        var _this = this;
        this.$http.post('/queryAddress',{name:_this.search})
          .then(function (res) {
            if(res.data.code == 100){
              _this.options1 = res.data.otherRes.address;
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      watchTime:function(){
        var _this = this;
        _this.taskMember = false;
        let query = this.$router.currentRoute.query;
        switch (query.option){
          case "taskMember":
            break;
          case "taskDepartment":
            break;
          case "evaluationMembers":
            _this.taskMember = true;
            break;
          case "evaluationDepartment":
            _this.taskMember = true;
            break;
        }
        bus.$on('startTime',function(msg){
          _this.time.start = msg.getFullYear() + '-' + (msg.getMonth() + 1) + '-' + msg.getDate() ;
        });
        bus.$on('endTime',function(msg){
          _this.time.end = msg.getFullYear() + '-' + (msg.getMonth() + 1) + '-' + msg.getDate() ;
        });
        var a =  new Date(this.time.start);
        var b = this.time.end;
        this.time.start = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() ;
        this.time.end = b.getFullYear() + '-' + (b.getMonth() + 1) + '-' + b.getDate() ;
      },
      resete:function(){
        this.checkedList = [];
        for(var key in this.options1){
          this.options1[key].forEach(function(value,key){
            value.checked = false;
          })
        }
      },
      ajaxFunction:function(){
        var _this = this;
        if(_this.taskMember){
          return _this.$http.post('/statistics/queryAppriByPeople',{
            input_user_id:_this.user_id_list,time_q:_this.time.start,time_z:_this.time.end,page:0
          });
        }else{
          return _this.$http.post('/statistics/queryStatistics',{
            user_id_list:_this.user_id_list,time_q:_this.time.start,time_z:_this.time.end,page:0
          })
        }
      },
      surePerson:function(){
        var _this = this;
        _this.user_id_list = '';
        _this.$emit('addren',false);
        _this.checkedList.forEach(function(value,index){
          _this.user_id_list +=( value.id+',');
        });
        _this.user_id_list = _this.user_id_list.slice(0,_this.user_id_list.length-1);
        _this.ajaxFunction()
          .then(function (res) {
            if(res.data.code == 100){
              _this.statisticsList = res.data.rows;
              bus.$emit('statisticsList', _this.statisticsList);
              _this.checkedList = [];
              for(var i in _this.options1){
                _this.options1[i].forEach(function(value,i){
                  value.checked = false;
                })
              }
              if(res.data.rows.length == 0){
                _this.$toast('没有查出相关数据');
              }
//              _this.pages = (res.data.total % _this.searchCondition.rows >0 ?(res.data.total / _this.searchCondition.rows) + 1 : res.data.total / _this.searchCondition.rows);
//              _this.searchCondition.page+=1;
            }else{ _this.$toast(res.data.msg);}
          })
          .catch(function (err) {
            _this.$messagebox.alert('请求失败！')
          })
      },
      hansClose(){
        var _this = this;
        this.search  = '';
        _this.checkedList = [];
        for(var i in _this.options1){
          _this.options1[i].forEach(function(value,i){
            value.checked = false;
          })
        }
        this.$emit('addren',false);
      },
      backgrd (obj){
        var _this = this;
        if(typeof obj.checked == 'undefined'){
          this.$set(obj,'checked',true);
        }else{
          obj.checked = !obj.checked;
        }
        this.checkedList = [];
        for(var i in this.options1){
          this.options1[i].forEach(function(value,i){
            if(value.checked){
              _this.checkedList.push(value)
            }
          })
        }
      },
      jump (index) {
        let jump = document.querySelectorAll('.d_jump');
        let total = jump[index].offsetTop+135;
        let distance = document.documentElement.scrollTop || document.body.scrollTop;
        let step = total / 50;// 平滑滚动，时长500ms，每10ms一跳，共50跳
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
  .content_{z-index: 1000}
  .mint-checklist-labels {  display: block;  padding: 0 10px;  }
  .mint-checkbox-inputs {  display: none;  }
  .mint-checkbox-labels {  vertical-align: middle;  }
  span.backBlue span.mint-checkbox-cores{background: #26a2ff}
  .mint-checkbox-cores i{color: #fff}
  .mint-checkbox-cores {  display: inline-block;  background-color: #fff;  border-radius: 100%;  border: 1px solid #ccc;  position: relative;  width: 20px;  height: 20px; line-height: 20px;text-align: center; vertical-align: middle;  }
  .mint-cell-titles{    -webkit-box-flex: 1;  flex: 1;}
  .mint-cell-wrappers{ background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);  background-size: 120% 1px;  background-repeat: no-repeat;  background-position: top left;  background-origin: content-box;  -ms-flex-align: center;  align-items: center;  box-sizing: border-box;  display: flex;  font-size: 16px;  line-height: 1;  min-height: inherit;  overflow: hidden;  width: 100%;}
  .mint-cells{  background-color: #fff;  box-sizing: border-box;  color: inherit;  min-height: 48px;  display: block;  overflow: hidden;  position: relative;  text-decoration: none;  }
  .address_content .address_button button{width: 50%;padding:15px;background: #F8F8F8;border: 0;border-right:1px solid #eee;color: #26a2ff}
  .address_content .address_button{background: #fff;position: fixed;bottom: 0;width: 80%;border-top: 1px solid #eee}
  /*.address_parson>ul{position: fixed;top:140px;bottom: 0;overflow: scroll;width:100%;}*/
  .address_parson .address_href ul li{color:#aaa;line-height: 1.2;text-align: center}
  .address_parson .address_href{  background:  transparent; position:static; filter:Alpha(opacity=50);padding-left:30px;padding-right:10px;overflow:scroll;z-index:3;position: fixed;top:15%;right:0px;bottom: 0;font-size: 12px;}
  .address_parson{position: relative;top:0;right:0;bottom: 0;overflow: scroll}
  .address_opatype{width: 100%;background: black;opacity: .6;position: fixed;z-index:2;top: 0;bottom: 0;left: 0;right: 0}
  .mint-cell-wrappers{padding: 0}
  .margin_left{margin-left: 10px;}
  div.mint-tab-container{overflow: auto;position: static}
  .address_content .address_mage{background: #eee;padding-left:6px;}
  .address_header{padding: 5px;}
/*.headerAddress{width: 80%;border: 1px solid #eee;background: #fff;position: fixed;top:0;right:0;bottom:0;z-index: 2;overflow: auto}*/
  .headerAddress{width: 80%;background: #fff;position: absolute;top:0;right:0;bottom:0;z-index: 2;}
  .width_cicle{font-size:10px;display:inline-block;width: 32px;height:30px;line-height:30px;text-align:center;border-radius: 50%;color: #fff;padding: 3px;}
  .address_choolse{height:36px;padding:5px;border-bottom: 1px solid #eee;padding-bottom: 10px;overflow-x: auto;overflow-y: hidden}
  .address_choolse ul{width: 40000%;}
  .address_choolse ul li{float: left;margin-right: 10px;}
  .address_input{text-align: center;color: #aaa}
  .address_input i{position: absolute;left: 37%;top:97px;font-size: 15px;}
  .address_input input{border:0;margin:10px auto;width: 90%;border-radius: 10px;padding:6px;background: #eee;text-align: center}
</style>
