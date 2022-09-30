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
                  <phone-grouping-table ref="PhoneGroupingTable" v-if="activeName=='政务联络网'"
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
                  ></cluster-grouping-table>
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
  import NavBar from '../../../components/menu/navBar';
  import IcpVideoNavbar from "@/view/integratedCommunication/icpVideo/icpVideoNavbar";
  import IcpVideoGroupingTable from "@/view/integratedCommunication/icpVideo/icpVideoGroupingTable";
  import IcpVideoTerminalGroupingTable from "@/view/integratedCommunication/icpVideo/icpVideoTerminalGroupingTable";
  import PhoneGroupingTable from "@/view/integratedCommunication/icpSms/informationTransmission/phoneGroupingTable";
  import FrequentGroupingTable
    from "@/view/integratedCommunication/icpSms/informationTransmission/frequentGroupingTable";
  import FrequentContactsTable
    from "@/view/integratedCommunication/icpSms/informationTransmission/frequentContactsTable";
  import IcpVideoRecentContacts from "@/view/integratedCommunication/icpVideo/icpVideoRecentContacts";
  import EmergencyAddressBookTable
    from "@/view/integratedCommunication/icpSms/informationTransmission/emergencyAddressBookTable";
  import ClusterGroupingTable from "@/view/integratedCommunication/icpVideo/clusterGroupingTable";
  import IcpVideoDetails from "@/view/integratedCommunication/icpVideo/icpVideoDetails";

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
        placeholder: '请输入名称/单位/职位/号码',//搜索词提示
        activeName: '视频分组',//默认选中的tab
        navBarList: [
          {
            name: '视频分组'
          }, {
            name: '终端分组'
          }, {
            name: '政务联络网'
          }, {
            name: '常用联系人'
          }, {
            name: '最近联系人'
          }, {
            name: '预案联络网'
          }, {
            name: '集群分组'
          }
        ],//tab菜单
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
      if (this.activeName == '视频分组') {
        this.$refs.IcpVideoNavbar.addIsShow = false;
        this.$refs.IcpVideoNavbar.updateIsShow = true;
        this.$refs.IcpVideoNavbar.updateTerminalIsShow = true;
        this.$refs.IcpVideoNavbar.editIsShow = true;
        this.$refs.IcpVideoNavbar.deleteIsShow = true;
        this.$refs.IcpVideoNavbar.searchText = '';
        this.$refs.IcpVideoNavbar.searchBarIsShow = true;
      }
    },
    methods: {
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
      //根据tab名称，把对应表格字段数据添加到列表
      handleSelectionChange(data) {
        this.$nextTick(() => {
          switch (this.activeName) {
            case "视频分组":
              this.$refs.IcpVideoDetails.showData(data.name, data.indexCode, '9');
              break;
            case "终端分组":
              this.$refs.IcpVideoDetails.showData(data.name, data.uri, '8');
              break;
            case "政务联络网":
              this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
              break;
            case "常用联系人":
              this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
              break;
            case "最近联系人":
              this.$refs.IcpVideoDetails.showData(data.contactor, data.call, '1');
              break;
            case "预案联络网":
              this.$refs.IcpVideoDetails.showData(data.name, data.mobile, '1');
              break;
            case "集群分组":
              this.$refs.IcpVideoDetails.showData(data.name, data.number, '1');
              break;
          }
        })
      },
      //切换分组方法，根据名称调用显示相关信息
      changeTabPane(tab) {
        if (tab.name == '视频分组') {
          this.$refs.IcpVideoNavbar.addIsShow = false;
          this.$refs.IcpVideoNavbar.updateIsShow = true;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = true;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (tab.name == '终端分组') {
          this.$refs.IcpVideoNavbar.addIsShow = true;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (tab.name == '政务联络网') {
          this.$refs.IcpVideoNavbar.addIsShow = true;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (tab.name == '常用联系人') {
          this.$refs.IcpVideoNavbar.addIsShow = false;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (tab.name == '最近联系人') {
          this.$refs.IcpVideoNavbar.addIsShow = false;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = false;
          this.$refs.IcpVideoNavbar.deleteIsShow = false;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = false;
        }
        if (tab.name == '预案联络网') {
          this.$refs.IcpVideoNavbar.addIsShow = false;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = false;
          this.$refs.IcpVideoNavbar.deleteIsShow = false;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
        if (tab.name == '集群分组') {
          this.$refs.IcpVideoNavbar.addIsShow = true;
          this.$refs.IcpVideoNavbar.updateIsShow = false;
          this.$refs.IcpVideoNavbar.updateTerminalIsShow = false;
          this.$refs.IcpVideoNavbar.editIsShow = true;
          this.$refs.IcpVideoNavbar.deleteIsShow = true;
          this.$refs.IcpVideoNavbar.searchText = '';
          this.$refs.IcpVideoNavbar.searchBarIsShow = true;
        }
      },
      //新增方法
      handleAdd() {
        this.$nextTick(() => {
          switch (this.activeName) {
            case '终端分组':
              this.$refs.IcpVideoTerminalGroupingTable[1].handleAdd();
              break;
            case "政务联络网":
              this.$refs.PhoneGroupingTable[2].handleAdd();
              break;
            case '集群分组':
              this.$refs.ClusterGroupingTable[6].handleAdd();
              break
          }
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
      //修改方法
      handleEdit() {
        this.$nextTick(() => {
          switch (this.activeName) {
            case '视频分组':
              this.$refs.IcpVideoGroupingTable[0].handleEdit();
              break;
            case '终端分组':
              this.$refs.IcpVideoTerminalGroupingTable[1].handleEdit();
              break;
            case '政务联络网':
              this.$refs.PhoneGroupingTable[2].handleEdit();
              break;
            case '常用联系人':
              this.$refs.FrequentContactsTable[3].handleEdit();
              break;
            case '集群分组':
              this.$refs.ClusterGroupingTable[6].handleEdit();
              break
          }
        });
      },
      //删除方法
      handleDelete() {
        this.$nextTick(() => {
          switch (this.activeName) {
            case "视频分组":
              this.$refs.IcpVideoGroupingTable[0].handleDelete();
              break;
            case '终端分组':
              this.$refs.IcpVideoTerminalGroupingTable[1].handleDelete();
              break;
            case '政务联络网':
              this.$refs.PhoneGroupingTable[2].handleDelete();
              break;
            case '常用联系人':
              this.$refs.FrequentContactsTable[3].handleDelete();
              break;
            case '集群分组':
              this.$refs.ClusterGroupingTable[6].handleDelete();
              break;
          }
        });
      },
      handleRowClick() {

      },
      //搜索方法
      handleSearch(text) {
        switch (this.activeName) {
          case "视频分组":
            this.$refs.IcpVideoGroupingTable[0].searchText = text;
            this.$refs.IcpVideoGroupingTable[0].currentPage = 1;
            this.$refs.IcpVideoGroupingTable[0].getVideoList();
            break;
          case "终端分组":
            this.$refs.IcpVideoTerminalGroupingTable[1].searchText = text;
            this.$refs.IcpVideoTerminalGroupingTable[1].currentPage = 1;
            this.$refs.IcpVideoTerminalGroupingTable[1].getTerminalListData();
            break;
          case "政务联络网":
            this.$refs.PhoneGroupingTable[2].searchText = text;
            this.$refs.PhoneGroupingTable[2].currentPage = 1;
            this.$refs.PhoneGroupingTable[2].getContactorList();
            break;
          case "常用联系人":
            this.$refs.FrequentContactsTable[3].searchText = text;
            this.$refs.FrequentContactsTable[3].currentPage = 1;
            this.$refs.FrequentContactsTable[3].getCommonContactorListData();
            break;
          case "预案联络网":
            this.$refs.EmergencyAddressBookTable[5].searchText = text;
            this.$refs.EmergencyAddressBookTable[5].currentPage = 1;
            this.$refs.EmergencyAddressBookTable[5].getContactorList();
            break;
          case "集群分组":
            this.$refs.ClusterGroupingTable[6].searchText = text;
            this.$refs.ClusterGroupingTable[6].currentPage = 1;
            this.$refs.ClusterGroupingTable[6].getTableData();
            break;
        }
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
