<!--@author：llp-->
<template>
  <div>
    <el-row>
      <div class="navsBar" style="height: 80px">
        <fax-nav-bar ref="FaxNavBar" :placeholder="placeholder" @handleAdd="handleAdd"
                     @handleEdit="handleEdit" @handleSearch="handleSearch"
                     @handleExportContactor="handleExportContactor"
                     @handleDelete="handleDelete"></fax-nav-bar>
      </div>
    </el-row>
    <el-row>
      <el-col :span="17" class="tableContainer">
        <el-main style="margin-top:16px;margin-left:16px">
          <!--tab标签-->
          <el-tabs v-model="activeName" type="card">
            <template v-for="(bar,index) in navBarList">
              <el-tab-pane :label="bar.name" :name="bar.name">
                <!--标签内容-->
                <fax-grouping-table v-if="activeName='传真分组'" ref="FaxGroupingTable"
                                    @clearSearchText="clearSearchText"
                                    @handleSelectionChange="handleSelectionChange"></fax-grouping-table>
              </el-tab-pane>
            </template>
          </el-tabs>
        </el-main>
      </el-col>
      <el-col :span="6">
        <send-fax-panel ref="SendFaxPanel"></send-fax-panel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FaxNavBar from "@/view/yz_integratedCommunication/icpFax/faxNavBar";
  import FaxGroupingTable from "@/view/yz_integratedCommunication/icpFax/sendFax/faxGroupingTable";
  import SendFaxPanel from "@/view/yz_integratedCommunication/icpFax/sendFax/sendFaxPanel";

  export default {
    name: "sendFax",
    components: {SendFaxPanel, FaxGroupingTable, FaxNavBar},
    data() {
      return {
        placeholder: "请输入姓名/单位/职位/号码",
        activeName: "传真分组",//默认选中的tab
        navBarList: [
          {
            name: "传真分组"
          }
        ]
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.$refs.FaxNavBar.exportContactorIsShow = true;
      });
    },
    methods: {
      //导出表格内的联系人数据为excel文件
      handleExportContactor(){
        this.$nextTick(()=>{
          this.$refs.FaxGroupingTable[0].handleExportContactor();
        });
      },
      //把表格内的联系号码添加到列表
      handleSelectionChange(data) {
        this.$nextTick(() => {
          this.$refs.SendFaxPanel.showData(data);
        })
      },
      //新增方法
      handleAdd() {
        this.$nextTick(() => {
          switch (this.activeName) {
            case '传真分组':
              this.$refs.FaxGroupingTable[0].handleAdd();
              break;
          }
        });
      },
      //修改方法
      handleEdit() {
        this.$nextTick(() => {
          this.$refs.FaxGroupingTable[0].handleEdit();
        });
      },
      //删除方法
      handleDelete() {
        this.$nextTick(() => {
          this.$refs.FaxGroupingTable[0].handleDelete();
        });
      },
      //搜索方法
      handleSearch(text) {
        this.$refs.FaxGroupingTable[0].searchText = text;
        this.$refs.FaxGroupingTable[0].currentPage = 1;
        this.$refs.FaxGroupingTable[0].getContactorList();
      },
      //清除搜索框内的消息
      clearSearchText(){
        this.$nextTick(() => {
          this.$refs.FaxNavBar.searchText = '';
        });
      }
    }
  }
</script>

<style scoped>
  .navsBar {
    margin: 0 30px;
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
