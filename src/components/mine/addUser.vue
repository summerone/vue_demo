<template>
  <div class="adduser relative" id="adduser">
    <mt-header title="用户添加">
      <router-link :to="{ path:'/userList' }" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <mt-cell >
      <span slot="title" class="f14"><span class="red">*</span>用户账号</span>
      <mt-field class="adduser" :state="userName.state" @change="checkReg(1)" v-model="userName.val" placeholder="请输入账号"></mt-field>
    </mt-cell>
    <mt-cell >
      <span slot="title" class="f14"><span class="red">*</span>用户密码</span>
      <mt-field class="adduser" type="password":state="password.state" @change="checkReg(2)" v-model="password.val" placeholder="请输入密码"></mt-field>
    </mt-cell>
    <mt-cell >
      <span slot="title" class="f14"><span class="red">*</span>姓名</span>
      <mt-field class="adduser" :state="name.state" v-model="name.val" @change="checkReg(3)" placeholder="请输入姓名"></mt-field>
    </mt-cell>
    <mt-cell >
      <span slot="title" class="f14"><span class="red">*</span>电话</span>
      <mt-field class="adduser" :state="telephone.state" v-model="telephone.val"  @change="checkReg(4)" placeholder="请输入电话"></mt-field>
    </mt-cell>
    <mt-cell >
      <span slot="title" class="f14"><span class="red">*</span>税务人员编号</span>
      <mt-field class="adduser" :state="swrybh.state" v-model="swrybh.val" @change="checkReg(5)" placeholder="请输入税务人员编号"></mt-field>
    </mt-cell>
    <mt-cell  is-link @click.native="open()">
      <span slot="title" class="f14"><span class="red">*</span>科室</span>
      <span style="color: #acb1ac">{{value1.dept_name}}</span>
    </mt-cell>

    <mt-popup
      style="width: 100%;"
      v-model="popupVisible"
      position="bottom">
      <mt-picker
        :slots="slots"
        type="picker"
        value-key="dept_name"
        @change="onValuesChange"
        :showToolbar="true">
        <div class="toolbar-content pt6 pb6" style="border-bottom: 1px solid #e2e2e2;" >
          <button style="border: none;background: #fff;color: #26a2ff;margin-left: 25px;" class=" f18 pl20" @click="popupVisible=false">取消</button>
          <button  style="border: none;background: #fff;color: #26a2ff;margin-right: 25px;" class="fr f18 pr20" @click="sure(value2)">确定</button>
        </div>
      </mt-picker>
    </mt-popup>
    <mt-cell   @click.native="openAddress()">
      <span slot="title" class="f14"><span class="red">*</span>分管领导</span>
      <span style="color: #acb1ac">{{leader_Info.name}}</span>
    </mt-cell>
    <mt-button type="primary" size="large" class="mt20" @click="submit()">添加</mt-button>
    <v-address v-on:onAddress="addressFun" v-if="isAddress"></v-address>
  </div>
</template>
<script>
  import task_address from '../task/task_address.vue'
  export default{
    name:'addUser',
    components:{
      'v-address':task_address
    },
    data(){
      return{
        userName:{val:"",state:"error",},
        password:{val:"",state:"error",},
        name:{val:"",state:"error",},
        telephone:{val:"",state:"error",},
        swrybh:{val:"",state:"error",},
        value1:'',
        value2:'',
        leader_Info:{name:'',id:''},
        popupVisible:false,
        isAddress:false,
        reg:{userName:/^(\w){3,10}$/,password:/^\d{6}\b/,name:/[\u4e00-\u9fa5]/g,tel:/^((0\d{2,3}\d{7,8})|(1[35847]\d{9}))$/,swry_id:/^[1-9]\d{10}$/},
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot',
            textAlign: 'center',
            defaultIndex:2
          }
        ]
      }
    },
    mounted:function () {
      this.init();
    },
    methods:{
      openAddress(){
        this.isAddress=true;
      },
      addressFun(res){

        if(res.length>1){
          this.$messagebox.alert("只能选择一个分管领导");
          return;
        }else{
          this.isAddress=false;
        }
        this.leader_Info=res[0];

      },
      submit(){
        var vm = this;
        //税务人员代码不能为空
        if(vm.name==null||vm.telephone==null||vm.swrybh==null||vm.value1.id==null||vm.leader_Info.id==null){
          vm.$messagebox.alert("必选项不能为空");
          return;
        }
        if(vm.userName.state=="error"||vm.password.state=="error"||vm.name.state=="error"||vm.telephone.state=="error"||vm.swrybh.state=="error"){
          vm.$messagebox.alert("有选项内容错误");
          return;
        }


        this.$http.get('/mine/insertUser', {
          params:{
            userName:vm.userName.val,
            password:vm.password.val,
            name: vm.name.val,
            phone: vm.telephone.val,
            swry_id: vm.swrybh.val,
            dept_id: vm.value1.id,
            leader_id: vm.leader_Info.id
          }
        })
          .then(function (res) {
            if(res.data.code == '100'){
              vm.$messagebox.alert(res.data.msg);
            }else{
              vm.$messagebox.alert(res.data.msg);
            }
          })
      },
      init(){
        var vm = this;
        this.$http.post('/mine/queryDeptlist',{
          // params:{
          //}
        })
          .then(function (res) {
            if(res.data.code == '100'){
              vm.slots[0].values=res.data.rows;
            }else{
              vm.$messagebox.alert(res.data.msg);
            }
          })
      },
      open() {
        this.popupVisible = true;
      },
      onValuesChange(picker,values) {
        this.value2 = values[0];
      },
      sure(value2){
        this.value1 = value2;
        this.popupVisible = false;
      },
      checkReg(type){
        let _this=this;
        if(type==1){
          /*检验账号*/
          if(!_this.reg.userName.test(_this.userName.val)){
            _this.userName.state="error";
            _this.$messagebox.alert("请输入3-10位的字母,账号,数字,和下划线");
            return;
          }else{
            _this.userName.state="success";
            return;
          }
        }else if(type==2){
          /*检验密码*/
          if(!_this.reg.password.test(_this.password.val)){
            _this.password.state="error";
            _this.$messagebox.alert("请输入6位数字密码");
            return;
          }else {
            _this.password.state="success";
            return;
          }
        }else if(type==3){
            /*用户名*/
          if(!_this.reg.name.test(_this.name.val)){
            _this.$messagebox.alert("请输入正确姓名");
            _this.name.state="error";
            return;
          }else{
            _this.name.state="success";
            return;
          }
        }else if(type==4){
            /*电话*/
          if(!_this.reg.tel.test(_this.telephone.val)){
            _this.$messagebox.alert("请输入正确电话号码");
            _this.telephone.state="error";
            return;
          }else{
            _this.telephone.state="success";
            return;
          }

        }else{
            /*税务人员id*/
          if(!_this.reg.swry_id.test(_this.swrybh.val)){
            _this.$messagebox.alert("请输入11位税务人员编号");
            _this.swrybh.state="error";
            return;
          }else{
            _this.swrybh.state="success";
            return;
          }

        }
      }
    }
  }
</script>
<style scoped>


</style>
