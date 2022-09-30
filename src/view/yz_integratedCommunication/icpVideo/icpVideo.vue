<!--@author：llp-->
<template>
  <div>
    <nav-bar :selectedName="toName" :navBarList="toNameData" @changTab="changToTab"></nav-bar>
    <el-row>
      <el-header style="height: 80px">
        <div class="navsBar">
          <icp-video-navbar ref="IcpVideoNavbar" :placeholder="placeholder"
                            @handleAdd="handleAdd"
                            @handleUpdateGroup="handleUpdateGroup"
                            @handleUpdateTerminal="handleUpdateTerminal"
                            @handleEdit="handleEdit" @handleSearch="handleSearch"
                            @handleDelete="handleDelete"
          ></icp-video-navbar>
        </div>
      </el-header>
    </el-row>
    <el-row>
      <el-main>
        <el-col :span="17" class="tableContainer">
          <el-main style="margin-top:16px;margin-left:16px">
            <!--tab标签-->
            <el-tabs v-model="activeName" type="card" @tab-click="changeTabPane">
              <template>
                <el-tab-pane  v-for="(bar,index) in navBarList" :key="index" :label="bar.name" :name="bar.name">
                  <!--标签内容-->
                  <icp-video-grouping-table ref="IcpVideoGroupingTable"
                                            v-if="activeCode=='VideoGroup'"
                                            @clearSearchText="clearSearchText"
                                            @row-click="handleRowClick"
                                            @handleSelectionChange="handleSelectionChange"
                  ></icp-video-grouping-table>
                  <icp-video-terminal-grouping-table ref="IcpVideoTerminalGroupingTable"
                                                     v-if="activeCode=='VideoTerminalGroup'"
                                                     @clearSearchText="clearSearchText"
                                                     @row-click="handleRowClick"
                                                     @handleSelectionChange="handleSelectionChange"
                  ></icp-video-terminal-grouping-table>
                  <phone-grouping-table ref="PhoneGroupingTable" v-if="activeCode=='phone'"
                                        @row-click="handleRowClick"
                                        @clearSearchText="clearSearchText"
                                        @handleSelectionChange="handleSelectionChange"
                  ></phone-grouping-table>
                  <frequent-contacts-table ref="FrequentContactsTable"
                                           v-if="activeCode=='commonlyused'"
                                           @row-click="handleRowClick"
                                           @handleSelectionChange="handleSelectionChange"
                  ></frequent-contacts-table>
                  <icp-video-recent-contacts ref="IcpVideoRecentContacts"
                                             v-if="activeCode=='recentcontact'"
                                             @row-click="handleRowClick"
                                             @handleSelectionChange="handleSelectionChange"
                  ></icp-video-recent-contacts>
                  <emergency-address-book-table ref="EmergencyAddressBookTable"
                                                v-if="activeCode=='emergency'"
                                                @row-click="handleRowClick"
                                                @clearSearchText="clearSearchText"
                                                @handleSelectionChange="handleSelectionChange"
                  ></emergency-address-book-table>
                  <cluster-grouping-table ref="ClusterGroupingTable" v-if="activeCode=='GroupTalk'"
                                          @row-click="handleRowClick"
                                          @clearSearchText="clearSearchText"
                                          @handleSelectionChange="handleSelectionChange"
                  ></cluster-grouping-table>
                  <!-- 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting -->
                  <!-- <icp-video-grouping-table ref="IcpVideoGroupingTable"
                                            v-if="activeName=='视频分组'"
                                            @clearSearchText="clearSearchText"
                                            @row-click="handleRowClick"
                                            @handleSelectionChange="handleSelectionChange"
                  ></icp-video-grouping-table>
                  <icp-video-terminal-grouping-table ref="IcpVideoTerminalGroupingTable"
                                                     v-if="activeName=='终端分组'"
                                                     @clearSearchText="clearSearchText"
                                                     @row-click="handleRowClick"
                                                     @handleSelectionChange="handleSelectionChange"
                  ></icp-video-terminal-grouping-table>
                  <phone-grouping-table ref="PhoneGroupingTable" v-if="activeName=='政务联络网' || activeName=='政务通信录'"
                                        @row-click="handleRowClick"
                                        @clearSearchText="clearSearchText"
                                        @handleSelectionChange="handleSelectionChange"
                  ></phone-grouping-table>
                  <frequent-contacts-table ref="FrequentContactsTable"
                                           v-if="activeName=='常用联系人'"
                                           @row-click="handleRowClick"
                                           @handleSelectionChange="handleSelectionChange"
                  ></frequent-contacts-table>
                  <icp-video-recent-contacts ref="IcpVideoRecentContacts"
                                             v-if="activeName=='最近联系人'"
                                             @row-click="handleRowClick"
                                             @handleSelectionChange="handleSelectionChange"
                  ></icp-video-recent-contacts>
                  <emergency-address-book-table ref="EmergencyAddressBookTable"
                                                v-if="activeName=='预案联络网'"
                                                @row-click="handleRowClick"
                                                @clearSearchText="clearSearchText"
                                                @handleSelectionChange="handleSelectionChange"
                  ></emergency-address-book-table>
                  <cluster-grouping-table ref="ClusterGroupingTable" v-if="activeName=='集群分组'"
                                          @row-click="handleRowClick"
                                          @clearSearchText="clearSearchText"
                                          @handleSelectionChange="handleSelectionChange"
                  ></cluster-grouping-table> -->
                </el-tab-pane>
              </template>
            </el-tabs>
          </el-main>
        </el-col>
        <el-col :span="6">
          <icp-video-details ref="IcpVideoDetails"></icp-video-details>
        </el-col>
      </el-main>
    </el-row>
  </div>
</template>

<script>
  import NavBar from '@/yz_components/menu/navBar';
  import IcpVideoNavbar from "@/view/yz_integratedCommunication/icpVideo/icpVideoNavbar";
  import IcpVideoGroupingTable from "@/view/yz_integratedCommunication/icpVideo/icpVideoGroupingTable";
  import IcpVideoTerminalGroupingTable from "@/view/yz_integratedCommunication/icpVideo/icpVideoTerminalGroupingTable";
  import PhoneGroupingTable from "@/view/yz_integratedCommunication/icpSms/informationTransmission/phoneGroupingTable";
  import FrequentGroupingTable
    from "@/view/yz_integratedCommunication/icpSms/informationTransmission/frequentGroupingTable";
  import FrequentContactsTable
    from "@/view/yz_integratedCommunication/icpSms/informationTransmission/frequentContactsTable";
  import IcpVideoRecentContacts from "@/view/yz_integratedCommunication/icpVideo/icpVideoRecentContacts";
  import EmergencyAddressBookTable
    from "@/view/yz_integratedCommunication/icpSms/informationTransmission/emergencyAddressBookTable";
  import ClusterGroupingTable from "@/view/yz_integratedCommunication/icpVideo/clusterGroupingTable";
  import IcpVideoDetails from "@/view/yz_integratedCommunication/icpVideo/icpVideoDetails";
  import {replaceContactorGroupsConfig, filterGroupName} from '@/assets/js/yz_common.js'
  export default {
    name: "icpVideo",
    components: {
      IcpVideoDetails,
      ClusterGroupingTable,
      EmergencyAddressBookTable,
      IcpVideoRecentContacts,
      FrequentContactsTable,
      FrequentGroupingTable,
      PhoneGroupingTable, IcpVideoTerminalGroupingTable, IcpVideoGroupingTable, IcpVideoNavbar,
      'nav-bar': NavBar
    },
    data() {
      return {
        IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
        placeholder: '请输入名称/单位/职位/号码',//搜索词提示
        activeName: '视频分组',//默认选中的tab
        activeCode: 'VideoGroup',//默认选中的tab 分组code
        navBarList: [
          {
            name: '视频分组',
            code: 'VideoGroup',
            enabled: true
          }, {
            name: '终端分组',
            code: 'VideoTerminalGroup',
            enabled: true
          }, {
            name: '政务联络网',
            code: 'phone',
            enabled: true
          }, {
            name: '常用联系人',
            code: 'commonlyused',
            enabled: true
          }, {
            name: '最近联系人',
            code: 'recentcontact',
            enabled: true
          }, {
            name: '预案联络网',
            code: 'emergency',
            enabled: true
          }, {
            name: '集群分组',
            code: 'GroupTalk',
            enabled: true
          }
        ],//tab菜单
        // navBarList: window.g.IsYangZhouProject ? [
        //   {
        //     name: '视频分组'
        //   }, {
        //     name: '终端分组'
        //   }, {
        //     name: '政务通信录'
        //   }, {
        //     name: '常用联系人'
        //   }, {
        //     name: '最近联系人'
        //   }, {
        //     name: '预案联络网'
        //   }, {
        //     name: '集群分组'
        //   }
        // ] : [
        //   {
        //     name: '视频分组'
        //   }, {
        //     name: '终端分组'
        //   }, {
        //     name: '政务联络网'
        //   }, {
        //     name: '常用联系人'
        //   }, {
        //     name: '最近联系人'
        //   }, {
        //     name: '预案联络网'
        //   }, {
        //     name: '集群分组'
        //   }
        // ],//tab菜单
        agent_id: '',//坐席号
        HWICP_Version: window.g.HWICP_Version,//icp版本
        toName: '会议',
        toNameData: [
          {
            name: '电话'
          },
          {
            name: '短信'
          },
          {
            name: '传真'
          },
          {
            name: '会议'
          },
          {
            name: '对讲'
          }
        ]
      }
    },
    mounted() {
      // if (this.activeName == '视频分组') {
      if (this.activeCode = 'VideoGroup') {
        this.$refs.IcpVideoNavbar.addIsShow = false;
        this.$refs.IcpVideoNavbar.updateIsShow = true;
        this.$refs.IcpVideoNavbar.updateTerminalIsShow = true;
        this.$refs.IcpVideoNavbar.editIsShow = true;
        this.$refs.IcpVideoNavbar.deleteIsShow = true;
        this.$refs.IcpVideoNavbar.searchText = '';
        this.$refs.IcpVideoNavbar.searchBarIsShow = true;
      }
      // 3.0不要这个方法了
      // this.initContactorGroupsConfig(); // 初始化分组配置
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-11-05
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 初始化分组配置
       */
      initContactorGroupsConfig() {
        let contactorGroups = JSON.parse(sessionStorage.getItem("contactorGroups")); // 后端返回的分组配置列表
        this.navBarList = replaceContactorGroupsConfig(this.navBarList); // 根据后端返回分组，替换联系人大分组名字配置
        // 导航栏
        this.navBarList.forEach(item => {
          if (item) {
            if (item.code === "VideoGroup") { // 视频分组
              this.activeName = item.name;
              this.activeCode = item.code;
            }
          }
        })
      },
      changToTab(tabName) {
        switch (tabName) {
          case '电话':
            this.$router.push({
              path: '/icpPhone'
            });
            break;
          case '短信':
            this.$router.push({
              path: '/icpSms'
            });
            break;
          case '传真':
            this.$router.push({
              path: '/icpFax'
            });
            break;
          case '会议':
            this.$router.push({
              path: '/icpVideo'
            });
            break;
          case '对讲':
            this.$router.push({
              path: '/icpGroupTalk'
            });
            break;
          default:
            break;
        }
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 根据tab名称，把对应表格字段数据添加到列表
       */
      handleSelectionChange(data) {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case "VideoGroup":
              this.$refs.IcpVideoDetails.showData(data.name, data.indexCode, '9');
              break;
            case "VideoTerminalGroup":
              this.$refs.IcpVideoDetails.showData(data.name, data.uri, '8');
              break;
            case "phone":
              this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
              break;
            case "commonlyused":
              this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
              break;
            case "recentcontact":
              this.$refs.IcpVideoDetails.showData(data.contactor, data.call, '1');
              break;
            case "emergency":
              this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
              break;
            case "GroupTalk":
              this.$refs.IcpVideoDetails.showData(data.name, data.number, '1');
              break;
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case "视频分组":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.indexCode, '9');
          //       break;
          //     case "终端分组":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.uri, '8');
          //       break;
          //     case "政务通信录":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
          //       break;
          //     case "常用联系人":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
          //       break;
          //     case "最近联系人":
          //       this.$refs.IcpVideoDetails.showData(data.contactor, data.call, '1');
          //       break;
          //     case "预案联络网":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
          //       break;
          //     case "集群分组":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.number, '1');
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case "视频分组":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.indexCode, '9');
          //       break;
          //     case "终端分组":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.uri, '8');
          //       break;
          //     case "政务联络网":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
          //       break;
          //     case "常用联系人":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
          //       break;
          //     case "最近联系人":
          //       this.$refs.IcpVideoDetails.showData(data.contactor, data.call, '1');
          //       break;
          //     case "预案联络网":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
          //       break;
          //     case "集群分组":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.number, '1');
          //       break;
          //   }
          // }
        })
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 切换分组方法，根据名称调用显示相关信息
       */
      changeTabPane(tab) {
        this.activeCode = filterGroupName(tab.name);
        if (this.activeCode == 'VideoGroup') {
        // if (tab.name == '视频分组') {
          this.$refs.IcpVideoNavbar.addIsShow = false;
          this.$refs.IcpVideoNavbar.updateIsShow = true;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = true;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (this.activeCode == 'VideoTerminalGroup') {
        // if (tab.name == '终端分组') {
          this.$refs.IcpVideoNavbar.addIsShow = true;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (this.activeCode == 'phone') {
        // if (tab.name == '政务联络网' || tab.name == '政务通信录') {
          this.$refs.IcpVideoNavbar.addIsShow = true;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (this.activeCode == 'commonlyused') {
        // if (tab.name == '常用联系人') {
          this.$refs.IcpVideoNavbar.addIsShow = false;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (this.activeCode == 'recentcontact') {
        // if (tab.name == '最近联系人') {
          this.$refs.IcpVideoNavbar.addIsShow = false;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = false;
          this.$refs.IcpVideoNavbar.deleteIsShow = false;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = false;
        }
        if (this.activeCode == 'emergency') {
        // if (tab.name == '预案联络网') {
          this.$refs.IcpVideoNavbar.addIsShow = false;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = false;
          this.$refs.IcpVideoNavbar.deleteIsShow = false;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (this.activeCode == 'GroupTalk') {
        // if (tab.name == '集群分组') {
          this.$refs.IcpVideoNavbar.addIsShow = true;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 新增方法
       */
      handleAdd() {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case 'VideoTerminalGroup':
              this.$refs.IcpVideoTerminalGroupingTable[1].handleAdd();
              break;
            case "phone":
              this.$refs.PhoneGroupingTable[2].handleAdd();
              break;
            case 'GroupTalk':
              this.$refs.ClusterGroupingTable[6].handleAdd();
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case '终端分组':
          //       this.$refs.IcpVideoTerminalGroupingTable[1].handleAdd();
          //       break;
          //     case "政务通信录":
          //       this.$refs.PhoneGroupingTable[2].handleAdd();
          //       break;
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[6].handleAdd();
          //       break
          //   }
          // } else {
          //    switch (this.activeName) {
          //     case '终端分组':
          //       this.$refs.IcpVideoTerminalGroupingTable[1].handleAdd();
          //       break;
          //     case "政务联络网":
          //       this.$refs.PhoneGroupingTable[2].handleAdd();
          //       break;
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[6].handleAdd();
          //       break
          //   }
          // }
        });
      },
      //更新视频分组方法
      handleUpdateGroup() {
        this.agent_id = sessionStorage.getItem("agent_id");
        if (this.HWICP_Version == 'HWICP-19.0') {
          //查询icp视频的根分组信息
          this.$icp19.ICPQueryGroupInfo(Number(this.agent_id), Number(0), Number(1), Number(10), Number(0));
          //更新视频分组的信息
          setTimeout(() => {
            this.$refs.IcpVideoGroupingTable[0].refreshGroupData();
            this.$message.success("更新成功!");
          },5000);
        }
      },
      //更新视频终端方法
      handleUpdateTerminal() {
        this.agent_id = sessionStorage.getItem("agent_id");
        if (this.HWICP_Version == 'HWICP-19.0') {
          let that = this;
          this.$icp19.ICPQueryDeviceInfo(Number(this.agent_id), Number(0), Number(1), Number(10), Number(0), "",function(res){
                console.log(res)
                console.log("更新设备信息成功!")
          });
          // this.$message.success("更新设备信息成功!");
        }
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 修改方法
       */
      handleEdit() {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case 'VideoGroup':
              this.$refs.IcpVideoGroupingTable[0].handleEdit();
              break;
            case 'VideoTerminalGroup':
              this.$refs.IcpVideoTerminalGroupingTable[1].handleEdit();
              break;
            case 'phone':
              this.$refs.PhoneGroupingTable[2].handleEdit();
              break;
            case 'commonlyused':
              this.$refs.FrequentContactsTable[3].handleEdit();
              break;
            case 'GroupTalk':
              this.$refs.ClusterGroupingTable[6].handleEdit();
              break
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case '视频分组':
          //       this.$refs.IcpVideoGroupingTable[0].handleEdit();
          //       break;
          //     case '终端分组':
          //       this.$refs.IcpVideoTerminalGroupingTable[1].handleEdit();
          //       break;
          //     case '政务通信录':
          //       this.$refs.PhoneGroupingTable[2].handleEdit();
          //       break;
          //     case '常用联系人':
          //       this.$refs.FrequentContactsTable[3].handleEdit();
          //       break;
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[6].handleEdit();
          //       break
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case '视频分组':
          //       this.$refs.IcpVideoGroupingTable[0].handleEdit();
          //       break;
          //     case '终端分组':
          //       this.$refs.IcpVideoTerminalGroupingTable[1].handleEdit();
          //       break;
          //     case '政务联络网':
          //       this.$refs.PhoneGroupingTable[2].handleEdit();
          //       break;
          //     case '常用联系人':
          //       this.$refs.FrequentContactsTable[3].handleEdit();
          //       break;
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[6].handleEdit();
          //       break
          //   }
          // }
        });
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 删除方法
       */
      handleDelete() {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case "VideoGroup":
              this.$refs.IcpVideoGroupingTable[0].handleDelete();
              break;
            case 'VideoTerminalGroup':
              this.$refs.IcpVideoTerminalGroupingTable[1].handleDelete();
              break;
            case 'phone':
              this.$refs.PhoneGroupingTable[2].handleDelete();
              break;
            case 'commonlyused':
              this.$refs.FrequentContactsTable[3].handleDelete();
              break;
            case 'GroupTalk':
              this.$refs.ClusterGroupingTable[6].handleDelete();
              break;
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case "视频分组":
          //       this.$refs.IcpVideoGroupingTable[0].handleDelete();
          //       break;
          //     case '终端分组':
          //       this.$refs.IcpVideoTerminalGroupingTable[1].handleDelete();
          //       break;
          //     case '政务通信录':
          //       this.$refs.PhoneGroupingTable[2].handleDelete();
          //       break;
          //     case '常用联系人':
          //       this.$refs.FrequentContactsTable[3].handleDelete();
          //       break;
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[6].handleDelete();
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case "视频分组":
          //       this.$refs.IcpVideoGroupingTable[0].handleDelete();
          //       break;
          //     case '终端分组':
          //       this.$refs.IcpVideoTerminalGroupingTable[1].handleDelete();
          //       break;
          //     case '政务联络网':
          //       this.$refs.PhoneGroupingTable[2].handleDelete();
          //       break;
          //     case '常用联系人':
          //       this.$refs.FrequentContactsTable[3].handleDelete();
          //       break;
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[6].handleDelete();
          //       break;
          //   }
          // }
        });
      },
      handleRowClick() {

      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 搜索方法
       */
      handleSearch(text) {
        switch (this.activeCode) {
          case "VideoGroup":
            this.$refs.IcpVideoGroupingTable[0].searchText = text;
            this.$refs.IcpVideoGroupingTable[0].currentPage = 1;
            this.$refs.IcpVideoGroupingTable[0].getVideoList();
            break;
          case "VideoTerminalGroup":
            this.$refs.IcpVideoTerminalGroupingTable[1].searchText = text;
            this.$refs.IcpVideoTerminalGroupingTable[1].currentPage = 1;
            this.$refs.IcpVideoTerminalGroupingTable[1].getTerminalListData();
            break;
          case "phone":
            this.$refs.PhoneGroupingTable[2].searchText = text;
            this.$refs.PhoneGroupingTable[2].currentPage = 1;
            this.$refs.PhoneGroupingTable[2].getContactorList();
            break;
          case "commonlyused":
            this.$refs.FrequentContactsTable[3].searchText = text;
            this.$refs.FrequentContactsTable[3].currentPage = 1;
            this.$refs.FrequentContactsTable[3].getCommonContactorListData();
            break;
          case "emergency":
            this.$refs.EmergencyAddressBookTable[5].searchText = text;
            this.$refs.EmergencyAddressBookTable[5].currentPage = 1;
            this.$refs.EmergencyAddressBookTable[5].getContactorList();
            break;
          case "GroupTalk":
            this.$refs.ClusterGroupingTable[6].searchText = text;
            this.$refs.ClusterGroupingTable[6].currentPage = 1;
            this.$refs.ClusterGroupingTable[6].getTableData();
            break;
        }
        // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
        // switch (this.activeName) {
        //   case "视频分组":
        //     this.$refs.IcpVideoGroupingTable[0].searchText = text;
        //     this.$refs.IcpVideoGroupingTable[0].currentPage = 1;
        //     this.$refs.IcpVideoGroupingTable[0].getVideoList();
        //     break;
        //   case "终端分组":
        //     this.$refs.IcpVideoTerminalGroupingTable[1].searchText = text;
        //     this.$refs.IcpVideoTerminalGroupingTable[1].currentPage = 1;
        //     this.$refs.IcpVideoTerminalGroupingTable[1].getTerminalListData();
        //     break;
        //   case "政务联络网":
        //     this.$refs.PhoneGroupingTable[2].searchText = text;
        //     this.$refs.PhoneGroupingTable[2].currentPage = 1;
        //     this.$refs.PhoneGroupingTable[2].getContactorList();
        //     break;
        //   case "政务通信录":
        //     this.$refs.PhoneGroupingTable[2].searchText = text;
        //     this.$refs.PhoneGroupingTable[2].currentPage = 1;
        //     this.$refs.PhoneGroupingTable[2].getContactorList();
        //     break;
        //   case "常用联系人":
        //     this.$refs.FrequentContactsTable[3].searchText = text;
        //     this.$refs.FrequentContactsTable[3].currentPage = 1;
        //     this.$refs.FrequentContactsTable[3].getCommonContactorListData();
        //     break;
        //   case "预案联络网":
        //     this.$refs.EmergencyAddressBookTable[5].searchText = text;
        //     this.$refs.EmergencyAddressBookTable[5].currentPage = 1;
        //     this.$refs.EmergencyAddressBookTable[5].getContactorList();
        //     break;
        //   case "集群分组":
        //     this.$refs.ClusterGroupingTable[6].searchText = text;
        //     this.$refs.ClusterGroupingTable[6].currentPage = 1;
        //     this.$refs.ClusterGroupingTable[6].getTableData();
        //     break;
        // }
      },
      //清空搜索框内容
      clearSearchText() {
        this.$refs.IcpVideoNavbar.searchText = '';
      }
    }
  }
</script>

<style scoped>
  >>> .el-header {
    padding: 0;
  }

  .navsBar {
    margin: 0px 30px;
    padding-left: 30px;
    background-color: white;
    display: flex;
    align-items: center;
    border: 1px solid rgba(219, 219, 219, 1);
    box-sizing: border-box;
    border-radius: 3px;
  }

  .tableContainer {
    margin-top: 16px;
    margin-left: 30px;
    height: 792px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  >>> .el-main {
    padding: 0;
  }


</style>
