<!--@author：llp-->
<template>
  <div>
    <nav-bar :selectedName="toName" :navBarList="toNameData" @changTab="changToTab"></nav-bar>
    <el-row>
      <el-header style="height: 80px">
        <div class="navsBar">
          <icp-group-talk-nav-bar
            ref="IcpGroupTalkNavBar"
            :placeholder="placeholder"
            @handleAdd="handleAdd"
            @handleEdit="handleEdit" @handleSearch="handleSearch"
            @handleDelete="handleDelete"
          ></icp-group-talk-nav-bar>
        </div>
      </el-header>
    </el-row>
    <el-row>
      <el-main>
        <el-col :span="17" class="tableContainer">
          <el-main style="margin-top:16px;margin-left:16px">
            <!--tab标签-->
            <el-tabs v-model="activeName" type="card">
              <template>
                <el-tab-pane v-for="(bar,index) in navBarList" :key="index" :label="bar.name" :name="bar.name">
                  <!--标签内容-->
                  <!-- 注释原因：动态配置分组名字，改为用code判断 author：hexinting date:2020-11-05 -->
                  <phone-grouping-table ref="PhoneGroupingTable"
                                        @handleSelectionChange="handleSelectionChange"
                                        @clearSearchText="clearSearchText"
                                        v-if="activeCode=='phone'"></phone-grouping-table>
                  <cluster-grouping-table ref="ClusterGroupingTable"
                                          @handleSelectionChange="handleSelectionChange"
                                          @clearSearchText="clearSearchText"
                                          v-if="activeCode=='GroupTalk'"></cluster-grouping-table>
                  <!-- <phone-grouping-table ref="PhoneGroupingTable"
                                        @handleSelectionChange="handleSelectionChange"
                                        @clearSearchText="clearSearchText"
                                        v-if="activeName=='政务联络网' || activeName=='政务通信录'"></phone-grouping-table>
                  <cluster-grouping-table ref="ClusterGroupingTable"
                                          @handleSelectionChange="handleSelectionChange"
                                          @clearSearchText="clearSearchText"
                                          v-if="activeName=='集群分组'"></cluster-grouping-table> -->
                </el-tab-pane>
              </template>
            </el-tabs>
          </el-main>
        </el-col>
        <el-col :span="6">
          <icp-group-talk-detail ref="IcpVideoDetails"></icp-group-talk-detail>
        </el-col>
      </el-main>
    </el-row>
  </div>
</template>

<script>
  import NavBar from '@/yz_components/menu/navBar';
  import PhoneGroupingTable from "@/view/yz_integratedCommunication/icpSms/informationTransmission/phoneGroupingTable";
  import ClusterGroupingTable from "@/view/yz_integratedCommunication/icpVideo/clusterGroupingTable";
  import IcpGroupTalkNavBar from "@/view/yz_integratedCommunication/icpGroupTalk/icpGroupTalkNavBar";
  import IcpGroupTalkDetail from "@/view/yz_integratedCommunication/icpGroupTalk/icpGroupTalkDetail";
  import {replaceContactorGroupsConfig, filterGroupName} from '@/assets/js/yz_common.js'
  export default {
    name: "icpGroupTalk",
    components: {
      IcpGroupTalkDetail,
      IcpGroupTalkNavBar,
      PhoneGroupingTable, ClusterGroupingTable,
      'nav-bar': NavBar
    },
    data() {
      return {
        IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
        placeholder: '请输入名称/单位/职位/号码',//搜索词提示
        activeName: '集群分组',//默认选中的tab
        activeCode: 'GroupTalk',//默认选中的tab
        navBarList: [
          {
            name: '集群分组',
            code: 'GroupTalk',
            enabled: true
          }, {
            name: '政务联络网',
            code: 'phone',
            enabled: true
          }
        ],//tab菜单
        // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
        // navBarList: window.g.IsYangZhouProject ? [
        //   {
        //     name: '集群分组'
        //   }, {
        //     name: '政务通信录'
        //   }
        // ] : [
        //   {
        //     name: '集群分组'
        //   }, {
        //     name: '政务联络网'
        //   }
        // ],//tab菜单
        toName: '对讲',
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
      // 3.0不要这个方法了
      // this.initContactorGroupsConfig(); // 初始化分组配置
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-11-05
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 更改联系人大分组名字配置
       */
      tabChange(tab) {
        let groupCode = filterGroupName(tab.name); // 过滤分组名字,查找code
        this.activeCode = groupCode;
      },
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
       * @description 将表格内的信息添加到对讲机列表
       */
      handleSelectionChange(data) {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case "GroupTalk":
              this.$refs.IcpVideoDetails.showData(data.name, data.number);
              break;
            case "phone":
              this.$refs.IcpVideoDetails.showData(data.name, data.mobile);
              break;
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case "集群分组":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.number);
          //       break;
          //     case "政务通信录":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.mobile);
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case "集群分组":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.number);
          //       break;
          //     case "政务联络网":
          //       this.$refs.IcpVideoDetails.showData(data.name, data.mobile);
          //       break;
          //   }
          // }
        })
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 新增方法
       */
      handleAdd() {
        this.$nextTick(() => {
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[0].handleAdd();
          //       break;
          //     case "政务通信录":
          //       this.$refs.PhoneGroupingTable[1].handleAdd();
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[0].handleAdd();
          //       break;
          //     case "政务联络网":
          //       this.$refs.PhoneGroupingTable[1].handleAdd();
          //       break;
          //   }
          // }
          switch (this.activeCode) {
            case 'GroupTalk':
              this.$refs.ClusterGroupingTable[0].handleAdd();
              break;
            case "phone":
              this.$refs.PhoneGroupingTable[1].handleAdd();
              break;
          }
        });
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 修改方法
       */
      handleEdit() {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case 'GroupTalk':
              this.$refs.ClusterGroupingTable[0].handleEdit();
              break;
            case "phone":
              this.$refs.PhoneGroupingTable[1].handleEdit();
              break;
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[0].handleEdit();
          //       break;
          //     case "政务通信录":
          //       this.$refs.PhoneGroupingTable[1].handleEdit();
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[0].handleEdit();
          //       break;
          //     case "政务联络网":
          //       this.$refs.PhoneGroupingTable[1].handleEdit();
          //       break;
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
            case 'GroupTalk':
              this.$refs.ClusterGroupingTable[0].handleDelete();
              break;
            case "phone":
              this.$refs.PhoneGroupingTable[1].handleDelete();
              break;
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[0].handleDelete();
          //       break;
          //     case "政务通信录":
          //       this.$refs.PhoneGroupingTable[1].handleDelete();
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case '集群分组':
          //       this.$refs.ClusterGroupingTable[0].handleDelete();
          //       break;
          //     case "政务联络网":
          //       this.$refs.PhoneGroupingTable[1].handleDelete();
          //       break;
          //   }
          // }
        });
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 搜索方法
       */
      handleSearch(text) {
        switch (this.activeCode) {
          case "GroupTalk":
            this.$refs.ClusterGroupingTable[0].searchText = text;
            this.$refs.ClusterGroupingTable[0].currentPage = 1;
            this.$refs.ClusterGroupingTable[0].getTableData();
            break;
          case "phone":
            this.$refs.PhoneGroupingTable[1].searchText = text;
            this.$refs.PhoneGroupingTable[1].currentPage = 1;
            this.$refs.PhoneGroupingTable[1].getContactorList();
            break;
        }
        // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
        // if (this.IsYangZhouProject) {
        //   switch (this.activeName) {
        //     case "集群分组":
        //       this.$refs.ClusterGroupingTable[0].searchText = text;
        //       this.$refs.ClusterGroupingTable[0].currentPage = 1;
        //       this.$refs.ClusterGroupingTable[0].getTableData();
        //       break;
        //     case "政务通信录":
        //       this.$refs.PhoneGroupingTable[1].searchText = text;
        //       this.$refs.PhoneGroupingTable[1].currentPage = 1;
        //       this.$refs.PhoneGroupingTable[1].getContactorList();
        //       break;
        //   }
        // } else {
        //   switch (this.activeName) {
        //     case "集群分组":
        //       this.$refs.ClusterGroupingTable[0].searchText = text;
        //       this.$refs.ClusterGroupingTable[0].currentPage = 1;
        //       this.$refs.ClusterGroupingTable[0].getTableData();
        //       break;
        //     case "政务联络网":
        //       this.$refs.PhoneGroupingTable[1].searchText = text;
        //       this.$refs.PhoneGroupingTable[1].currentPage = 1;
        //       this.$refs.PhoneGroupingTable[1].getContactorList();
        //       break;
        //   }
        // }
      },
      //将搜索框内的值清空
      clearSearchText(){
        this.$refs.IcpGroupTalkNavBar.searchText = "";
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
