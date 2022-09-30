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
                  <phone-grouping-table ref="PhoneGroupingTable"
                                        @handleSelectionChange="handleSelectionChange"
                                        @clearSearchText="clearSearchText"
                                        v-if="activeName=='政务联络网'"></phone-grouping-table>
                  <cluster-grouping-table ref="ClusterGroupingTable"
                                          @handleSelectionChange="handleSelectionChange"
                                          @clearSearchText="clearSearchText"
                                          v-if="activeName=='集群分组'"></cluster-grouping-table>
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
  import NavBar from '../../../components/menu/navBar';
  import PhoneGroupingTable from "@/view/integratedCommunication/icpSms/informationTransmission/phoneGroupingTable";
  import ClusterGroupingTable from "@/view/integratedCommunication/icpVideo/clusterGroupingTable";
  import IcpGroupTalkNavBar from "@/view/integratedCommunication/icpGroupTalk/icpGroupTalkNavBar";
  import IcpGroupTalkDetail from "@/view/integratedCommunication/icpGroupTalk/icpGroupTalkDetail";

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
        placeholder: '请输入名称/单位/职位/号码',//搜索词提示
        activeName: '集群分组',//默认选中的tab
        navBarList: [
          {
            name: '集群分组'
          }, {
            name: '政务联络网'
          }
        ],//tab菜单
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
      //将表格内的信息添加到对讲机列表
      handleSelectionChange(data) {
        this.$nextTick(() => {
          switch (this.activeName) {
            case "集群分组":
              this.$refs.IcpVideoDetails.showData(data.name, data.number);
              break;
            case "政务联络网":
              this.$refs.IcpVideoDetails.showData(data.name, data.mobile);
              break;
          }
        })
      },
      //新增方法
      handleAdd() {
        this.$nextTick(() => {
          switch (this.activeName) {
            case '集群分组':
              this.$refs.ClusterGroupingTable[0].handleAdd();
              break;
            case "政务联络网":
              this.$refs.PhoneGroupingTable[1].handleAdd();
              break;
          }
        });
      },
      //修改方法
      handleEdit() {
        this.$nextTick(() => {
          switch (this.activeName) {
            case '集群分组':
              this.$refs.ClusterGroupingTable[0].handleEdit();
              break;
            case "政务联络网":
              this.$refs.PhoneGroupingTable[1].handleEdit();
              break;
          }
        });
      },
      //删除方法
      handleDelete() {
        this.$nextTick(() => {
          switch (this.activeName) {
            case '集群分组':
              this.$refs.ClusterGroupingTable[0].handleDelete();
              break;
            case "政务联络网":
              this.$refs.PhoneGroupingTable[1].handleDelete();
              break;
          }
        });
      },
      //搜索方法
      handleSearch(text) {
        switch (this.activeName) {
          case "集群分组":
            this.$refs.ClusterGroupingTable[0].searchText = text;
            this.$refs.ClusterGroupingTable[0].currentPage = 1;
            this.$refs.ClusterGroupingTable[0].getTableData();
            break;
          case "政务联络网":
            this.$refs.PhoneGroupingTable[1].searchText = text;
            this.$refs.PhoneGroupingTable[1].currentPage = 1;
            this.$refs.PhoneGroupingTable[1].getContactorList();
            break;
        }
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
