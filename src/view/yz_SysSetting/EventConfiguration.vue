<!-- 事件配置-->
<template>
  <div class="event-configuration">
    <!-- <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane label="报告单位" name="first">
        <report-unit ref="reportUnit" />
      </el-tab-pane>
      <el-tab-pane label="管理区域" name="second">
        <area-management />
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="third">
        <password-management class="box" ref="close" />
      </el-tab-pane>
      <el-tab-pane label="黑名单" name="fourth">
        <black-list class="box" ref="refresh" />
      </el-tab-pane>
      <el-tab-pane label="事件类型" name="five">
        <event-type-management class="box" />
      </el-tab-pane>
      <el-tab-pane label="事件等级" name="six">
        <event-level-management class="box" />
      </el-tab-pane>
      <el-tab-pane label="转发设置" name="seven">
        <forwarding-settings class="box" />
      </el-tab-pane>
      <el-tab-pane label="事件处置管理" name="second">
        <event-settings-home class="box" />
      </el-tab-pane>
      <el-tab-pane label="用户管理" name="nine" v-if="isAdmin">
        <event-settings-user class="box" />
      </el-tab-pane>
      <el-tab-pane label="会议管理" name="ten" v-if="IsOpenLabProject">
        <meeting-settings class="box" />
      </el-tab-pane>
      <el-tab-pane label="短信模板管理" name="stylemsg">
        <msgtemplate class="box" />
      </el-tab-pane>
    </el-tabs> -->
    <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
      <el-tab-pane v-for="item in tabList" :key="item.name" :label="item.label" :name="item.name">
        <component :is="item.component" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 报告单位
// import ReportUnit from '@/view/yz_SysSetting/reportUnit';
// 管理区域
import AreaManagement from '@/view/yz_SysSetting/areaManagement';
// 修改密码
// import PasswordManagement from '@/view/yz_SysSetting/passwordManagement';
// 黑名单
import BlackList from '@/view/yz_SysSetting/blackList';
// 事件类型
import EventTypeManagement from '@/view/yz_SysSetting/eventTypeManagement';
// 事件等级
import EventLevelManagement from '@/view/yz_SysSetting/eventLevelManagement';
// 转发设置
import ForwardingSettings from '@/view/yz_SysSetting/forwardingSettings';
// 事件处置管理
import EventSettingsHome from '@/view/yz_SysSetting/eventSettings/eventSettingHome';
// 用户管理
// import EventSettingsUser from '@/view/yz_SysSetting/eventSettingsUser';
// 会议管理
// import MeetingSettings from '@/view/yz_SysSetting/meetingSettings';
// 短信模板管理
import Msgtemplate from '@/view/yz_SysSetting/msgtemplate';

export default {
  name: 'EventConfiguration',
  components: {
    // 转发设置
    // ForwardingSettings,
    // 事件等级
    EventLevelManagement,
    // 事件类型
    // EventTypeManagement,
    // 黑名单
    // BlackList,
    // 修改密码
    // PasswordManagement,
    // 管理区域
    // AreaManagement,
    // 事件处置管理
    EventSettingsHome,
    // 用户管理
    // EventSettingsUser,
    // 报告单位
    // ReportUnit,
    // 会议管理
    // MeetingSettings,
    // 短信模板管理
    // Msgtemplate,
  },
  data() {
    return {
      activeName: '', // 默认选中tab
      selectedName: '',
      isAdmin: '', // 当前登录用户是否是管理员
      tabList: [
        // {
        //   label: '管理区域',
        //   name: 'AreaManagement',
        //   component: 'AreaManagement',
        //   ref: 'areaManagement',
        // },
        // {
        //   label: '修改密码',
        //   name: 'PasswordManagement',
        //   component: 'PasswordManagement',
        //   ref: 'passwordManagement',
        // },
        // {
        //   label: '黑名单',
        //   name: 'BlackList',
        //   component: 'BlackList',
        //   ref: 'blackList',
        // },
        // {
        //   label: '事件类型',
        //   name: 'EventTypeManagement',
        //   component: 'EventTypeManagement',
        //   ref: 'eventTypeManagement',
        // },
        {
          label: '事件等级',
          name: 'EventLevelManagement',
          component: 'EventLevelManagement',
          ref: 'eventLevelManagement',
        },
        // {
        //   label: '转发设置',
        //   name: 'ForwardingSettings',
        //   component: 'ForwardingSettings',
        //   ref: 'forwardingSettings',
        // },
        {
          label: '事件处置管理',
          name: 'EventSettingsHome',
          component: 'EventSettingsHome',
          ref: 'eventSettingsHome',
        },
        // {
        //   label: '用户管理',
        //   name: 'EventSettingsUser',
        //   component: 'EventSettingsUser',
        //   ref: 'eventSettingsUser',
        // },
        // {
        //   label: '会议管理',
        //   name: 'MeetingSettings',
        //   component: 'MeetingSettings',
        //   ref: 'meetingSettings',
        // },
        // {
        //   label: '短信模板管理',
        //   name: 'Msgtemplate',
        //   component: 'Msgtemplate',
        //   ref: 'msgtemplate',
        // },
        // {
        //   label: '报告单位',
        //   name: 'ReportUnit',
        //   component: 'ReportUnit',
        //   ref: 'reportUnit',
        // },
      ],
    };
  },
  created() {
    // 判断当前用户是否是管理员-是的话展示用户管理模块
    if (sessionStorage.getItem('isAdmin') === 'no') this.isAdmin = false;
    else this.isAdmin = true;
    this.activeName = this.tabList[0].name;
  },
  methods: {
    tabClick(tab) {
      this.selectedName = tab.label;
    },
    handleClose() {
      this.$emit('handleClose');
    },
  },
};
</script>
