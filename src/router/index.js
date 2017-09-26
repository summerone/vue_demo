import Vue from 'vue'
import Router from 'vue-router'
//主页页面
import index from '@/components/index/index'
import task from '@/components/task/taskIndex'
import statistics from '@/components/statistics/statistics'
import mine from '@/components/mine/mine'
import evaluate from '@/components/evaluate/evaluate'
import log from '@/components/log/Log'
import returnReason from '@/components/returnReason/ReturnReason'

//登录
import login from '@/components/login/login'
import pwdChange from '@/components/login/pwdChange'
import resetPwd from '@/components/login/resetPwd'

import progress from '@/components/statistics/progress'
import department from '@/components/statistics/department'
import condition from '@/components/statistics/condition'
import archive from '@/components/statistics/archive.vue'
import selfMessage from '@/components/mine/selfMessage.vue'
import messModify from '@/components/mine/messModify.vue'
import resetMima from '@/components/mine/resetMima.vue'
import newTask from '@/components/task/newTask.vue'
import task_address from '@/components/task/task_address.vue'
import task_detail from '@/components/task/task_detail.vue'
import userList from '@/components/mine/userList.vue'
import addUser from '@/components/mine/addUser.vue'
import people from '@/components/task/People'
Vue.use(Router);

export default new Router({
  routes: [
    { //首页
      path: '/index',
      name: 'index',
      component: index
    },
    { //任务
      path: '/task',
      name: 'taskIndex',
      component: task
    },
    { //统计
      path: '/statistics',
      name: 'statistics',
      component: statistics
    },
    { //个人中心
      path: '/mine',
      name: 'mine',
      component: mine
    },
    { //登录
      path: '/login',
      name: 'login',
      component: login
    },
    { //忘记密码
      path: '/pwdChange',
      name: 'pwdChange',
      component: pwdChange
    },
    { //重置密码
      path: '/resetPwd',
      name: 'resetPwd',
      component: resetPwd
    },
    {
      path:'/progress',
      name:'progress',
      component:progress
    },
    {
      path:'/archive',
      name:'archive',
      component:archive
    },
    { //个人信息
      path:'/selfMessage',
      name:'selfMessage',
      component:selfMessage
    },
    { //个人信息修改
      path:'/messModify',
      name:'messModify',
      component:messModify
    },
    { //重置密码
      path:'/resetMima',
      name:'resetMima',
      component:resetMima
    },
    { //新建任务
      path:'/newTask',
      name:'newTask',
      component:newTask
    },
    { //评价
      path:'/evaluate',
      name:'evaluate',
      component:evaluate
    },
    { //日志
      path:'/log',
      name:'log',
      component:log
    },
    { //退回原因
      path:'/returnReason',
      name:'returnReason',
      component:returnReason
    },
    { //任务详情
      path:'/task_address',
      name:'address',
      component:task_address
    },
    {
      path:'/task_detail',
      name:'task_detail',
      component:task_detail
    },
    { //用户列表
      path:'/userList',
      name:'userList',
      component:userList
    },
    { //添加用户
      path:'/addUser',
      name:'addUser',
      component:addUser
    },
    { //人员
      path:'/people',
      name:'people',
      component:people
    },
    { //统计条件
      path:'/condition',
      name:'condition',
      component:condition
    },
    { //统计按部门
      path:'/department',
      name:'department',
      component:department
    },
    {
      path:'*',redirect:'/index'
    }
  ]
})
