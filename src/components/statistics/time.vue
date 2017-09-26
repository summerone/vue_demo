<template>
    <div class="mt-header" style="color: #8a8a8a;">
      <span class="start" is-link @click="open('picker1')" >起：{{time.start | dateNum}}</span><i class="iconfont icon-xiala2"></i>
      <span class="end" is-link @click="open('picker2')" >止：{{time.end | dateNum}}</span><i class="iconfont icon-xiala2"></i>
      <span class="parsen" @click="displayAddress()" v-if="taskMemberZ || mainNew">人员 <i class="iconfont icon-people"></i></span>
      <span class="parsen" @click="displayAddress()" v-else-if="evaluationMembersZ">部门 <i class="iconfont icon-renyuan2"></i></span>
      <mt-datetime-picker ref="picker1" type="date" v-model="value" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleChange1"></mt-datetime-picker>
      <mt-datetime-picker ref="picker2" type="date" v-model="value" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleChange2"></mt-datetime-picker>
    </div>
</template>
<script>
  import bus from '../../assets/common/eventBus';
  export default{
    name:'time',
    data(){
      return {
        id:'selected',
        selected: '1',
        pickerVisible:'',
        value: new Date(),
        endDate: new Date(),
        taskMemberZ:false,
        evaluationMembersZ:false,
        mainNew:true,
        time:{start:(new Date()).setMonth((new Date()).getMonth()-1),end:new Date()},
      };
    },
    mounted: function () {
      let _this = this;
      _this.taskMemberZ = false;
      _this.evaluationMembersZ = false;
      let query = this.$router.currentRoute.query;
      switch (query.option){
        case "taskMember":
          _this.taskMemberZ = true;
          break;
        case "taskDepartment":
          _this.evaluationMembersZ = true;
          _this.mainNew = false;
          break;
        case "evaluationMembers":
          _this.taskMemberZ = true;
          break;
        case "evaluationDepartment":
          _this.evaluationMembersZ = true;
          _this.mainNew = false;
          break;
      }
    },
    methods: {
      onValuesChange(picker, values) {
        if (values[0] > values[1]) {
          picker.setSlotValue(1, values[0]);
        }
      },
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange1(value) {
        this.time.start=value;
        bus.$emit('startTime',value)
      },
      handleChange2(value) {
        this.time.end=value;
        bus.$emit('endTime',value)
      },
      displayAddress(){
        this.$emit('addren',true);
      },
    }
  }
</script>
<style scoped>
  .mt-header{background:#fff;border-top:1px solid #eee;padding: 3px;padding-top: 6px;margin-top: 2px;}
  .mt-header i.icon-xiala2{font-size: 12px;}
  .mt-header .start{  display:inline-block;width: 33%;text-align: center }
  .mt-header .parsen{  border-left: 1px solid #aaa;padding:5px; padding-left: 10px; padding-right: 10px; }
  .mt-header .end{ display:inline-block; width: 33%;text-align: left; text-align: center }
</style>
