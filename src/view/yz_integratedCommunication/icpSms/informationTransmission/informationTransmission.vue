<!--@author：llp-->
<template>
  <div>
    <el-row>
      <div class="navsBar" style="height: 80px">
        <information-navbar ref="InformationNavbar" :placeholder="placeholder" @handleAdd="handleAdd"
                            @handleEdit="handleEdit" @handleSearch="handleSearch"
                            @handleExportContactor="handleExportContactor"
                            @handleDelete="handleDelete"></information-navbar>
      </div>
    </el-row>
    <el-row>
      <el-col :span="17" class="tableContainer">
        <el-main style="margin-top:16px;margin-left:16px">
          <!--tab标签-->
          <el-tabs v-model="activeName" type="card" @tab-click="changeTabPane">
            <template>
              <el-tab-pane  v-for="(bar,index) in navBarList" :key="index" :label="bar.name" :name="bar.name" >
                <!--标签内容-->
                <!-- <phone-grouping-table ref="PhoneGroupingTable"
                                      v-if="activeName=='政务联络网' || activeName=='政务通信录'"
                                      @row-click="handleRowClick"
                                      @clearSearchText="clearSearchText"
                                      @handleSelectionChange="handleSelectionChange"></phone-grouping-table>
                <frequent-grouping-table ref="FrequentGroupingTable"
                                         v-if="activeName=='短信分组'"
                                         @clearSearchText="clearSearchText"
                                         @handleSelectionChange="handleSelectionChange"></frequent-grouping-table>
                <frequent-contacts-table ref="FrequentContactsTable"
                                         v-if="activeName=='常用联系人'"
                                         @clearSearchText="clearSearchText"
                                         @handleSelectionChange="handleSelectionChange"></frequent-contacts-table>
                <emergency-address-book-table ref="EmergencyAddressBookTable"
                                              v-if="activeName=='预案联络网'"
                                              @clearSearchText="clearSearchText"
                                              @handleSelectionChange="handleSelectionChange"></emergency-address-book-table> -->
                <phone-grouping-table ref="PhoneGroupingTable"
                                      v-if="activeCode=='phone'"
                                      @row-click="handleRowClick"
                                      @clearSearchText="clearSearchText"
                                      @handleSelectionChange="handleSelectionChange"></phone-grouping-table>
                <frequent-grouping-table ref="FrequentGroupingTable"
                                         v-if="activeCode=='sms'"
                                         @clearSearchText="clearSearchText"
                                         @handleSelectionChange="handleSelectionChange"></frequent-grouping-table>
                <frequent-contacts-table ref="FrequentContactsTable"
                                         v-if="activeCode=='commonlyused'"
                                         @clearSearchText="clearSearchText"
                                         @handleSelectionChange="handleSelectionChange"></frequent-contacts-table>
                <emergency-address-book-table ref="EmergencyAddressBookTable"
                                              v-if="activeCode=='emergency'"
                                              @clearSearchText="clearSearchText"
                                              @handleSelectionChange="handleSelectionChange"></emergency-address-book-table>
              </el-tab-pane>
            </template>
          </el-tabs>
        </el-main>
      </el-col>
      <el-col :span="6">
        <send-msg-panel ref="SendMsgPanel"></send-msg-panel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import InformationNavbar from "@/view/yz_integratedCommunication/icpSms/informationTransmission/informationNavbar";
  import PhoneGroupingTable from "@/view/yz_integratedCommunication/icpSms/informationTransmission/phoneGroupingTable";
  import FrequentContactsTable
    from "@/view/yz_integratedCommunication/icpSms/informationTransmission/frequentContactsTable";
  import FrequentGroupingTable
    from "@/view/yz_integratedCommunication/icpSms/informationTransmission/frequentGroupingTable";
  import EmergencyAddressBookTable
    from "@/view/yz_integratedCommunication/icpSms/informationTransmission/emergencyAddressBookTable";
  import SendMsgPanel from "@/view/yz_integratedCommunication/icpSms/informationTransmission/sendMsgPanel";
  import {replaceContactorGroupsConfig, filterGroupName} from '@/assets/js/yz_common.js'

  export default {
    name: "informationTransmission",
    components: {
      SendMsgPanel,
      EmergencyAddressBookTable,
      FrequentGroupingTable,
      FrequentContactsTable,
      PhoneGroupingTable,
      InformationNavbar
    },
    data() {
      return {
        IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
        placeholder: "请输入姓名/单位/职位/号码",
        activeName: "政务联络网",//默认选中的tab
        // activeName: window.g.IsYangZhouProject ? "政务通信录" : "政务联络网",//默认选中的tab
        activeCode: "phone",//默认选中的tab 分组code
        navBarList: [
          {
            name: "政务联络网",
            code: "phone",
            enabled: true
          }, {
            name: "短信分组",
            code: "sms",
            enabled: true
          }, {
            name: "常用联系人",
            code: "commonlyused",
            enabled: true
          }, {
            name: "预案联络网",
            code: "emergency",
            enabled: true
          }
        ],//导航条
        // navBarList: window.g.IsYangZhouProject ? [
        //   {
        //     name: "政务通信录"
        //   }, {
        //     name: "短信分组"
        //   }, {
        //     name: "常用联系人"
        //   }, {
        //     name: "预案联络网"
        //   }
        // ] : [
        //   {
        //     name: "政务联络网"
        //   }, {
        //     name: "短信分组"
        //   }, {
        //     name: "常用联系人"
        //   }, {
        //     name: "预案联络网"
        //   }
        // ],//导航条
        selectedList: [],//选中的数组
        searchText: '',//搜索
        sendPeopleList:[]//需要发送的短信列表
      }
    },
    mounted(){
      this.$nextTick(() => {
        // 3.0不要这个方法了
        // this.initContactorGroupsConfig(); // 初始化分组配置
        switch (this.activeCode) {
          case 'phone':
            this.$refs.InformationNavbar.exportContactorIsShow = true;
            break;
          case 'sms':
            this.$refs.InformationNavbar.exportContactorIsShow = true;
            break;
          case 'commonlyused':
            this.$refs.InformationNavbar.exportContactorIsShow = false;
            break;
          case 'emergency':
            this.$refs.InformationNavbar.exportContactorIsShow = false;
            break;
        }
        // if (this.IsYangZhouProject) {
        //   switch (this.activeName) {
        //     case '政务通信录':
        //       this.$refs.InformationNavbar.exportContactorIsShow = true;
        //       break;
        //     case '短信分组':
        //       this.$refs.InformationNavbar.exportContactorIsShow = true;
        //       break;
        //     case '常用联系人':
        //       this.$refs.InformationNavbar.exportContactorIsShow = false;
        //       break;
        //     case '预案联络网':
        //       this.$refs.InformationNavbar.exportContactorIsShow = false;
        //       break;
        //   }
        // } else {
        //    switch (this.activeName) {
        //     case '政务联络网':
        //       this.$refs.InformationNavbar.exportContactorIsShow = true;
        //       break;
        //     case '短信分组':
        //       this.$refs.InformationNavbar.exportContactorIsShow = true;
        //       break;
        //     case '常用联系人':
        //       this.$refs.InformationNavbar.exportContactorIsShow = false;
        //       break;
        //     case '预案联络网':
        //       this.$refs.InformationNavbar.exportContactorIsShow = false;
        //       break;
        //   }
        // }
      });
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-10-14
       * @lastEditor hexinting
       * @lastDate 2020-10-14
       * @description 初始化分组配置
       */
      initContactorGroupsConfig() {
        let contactorGroups = JSON.parse(sessionStorage.getItem("contactorGroups")); // 后端返回的分组配置列表
        this.navBarList = replaceContactorGroupsConfig(this.navBarList); // 根据后端返回分组，替换联系人大分组名字配置
      },
      handleSelectionChange(data) {
        this.$nextTick(() => {
          this.$refs.SendMsgPanel.showData(data);
        })
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-10-14
       * @description 新增方法
       */
      handleAdd() {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case 'phone':
              this.$refs.PhoneGroupingTable[0].handleAdd();
              break;
            case 'sms':
              this.$refs.FrequentGroupingTable[1].handleAdd();
              break;
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case '政务通信录':
          //       this.$refs.PhoneGroupingTable[0].handleAdd();
          //       break;
          //     case '短信分组':
          //       this.$refs.FrequentGroupingTable[1].handleAdd();
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case '政务联络网':
          //       this.$refs.PhoneGroupingTable[0].handleAdd();
          //       break;
          //     case '短信分组':
          //       this.$refs.FrequentGroupingTable[1].handleAdd();
          //       break;
          //   }
          // }
        });
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-10-14
       * @description 修改方法
       */
      handleEdit() {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case 'phone':
              this.$refs.PhoneGroupingTable[0].handleEdit();
              break;
            case 'sms':
              this.$refs.FrequentGroupingTable[1].handleEdit();
              break;
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case '政务通信录':
          //       this.$refs.PhoneGroupingTable[0].handleEdit();
          //       break;
          //     case '短信分组':
          //       this.$refs.FrequentGroupingTable[1].handleEdit();
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case '政务联络网':
          //       this.$refs.PhoneGroupingTable[0].handleEdit();
          //       break;
          //     case '短信分组':
          //       this.$refs.FrequentGroupingTable[1].handleEdit();
          //       break;
          //   }
          // }
        });
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-10-14
       * @description 删除方法
       */
      handleDelete() {
        this.$nextTick(() => {
          switch (this.activeCode) {
            case 'phone':
              this.$refs.PhoneGroupingTable[0].handleDelete();
              break;
            case 'sms':
              this.$refs.FrequentGroupingTable[1].handleDelete();
              break;
            case 'commonlyused':
              this.$refs.FrequentContactsTable[2].handleDelete();
              break;
          }
          // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
          // if (this.IsYangZhouProject) {
          //   switch (this.activeName) {
          //     case '政务通信录':
          //       this.$refs.PhoneGroupingTable[0].handleDelete();
          //       break;
          //     case '短信分组':
          //       this.$refs.FrequentGroupingTable[1].handleDelete();
          //       break;
          //     case '常用联系人':
          //       this.$refs.FrequentContactsTable[2].handleDelete();
          //       break;
          //   }
          // } else {
          //   switch (this.activeName) {
          //     case '政务联络网':
          //       this.$refs.PhoneGroupingTable[0].handleDelete();
          //       break;
          //     case '短信分组':
          //       this.$refs.FrequentGroupingTable[1].handleDelete();
          //       break;
          //     case '常用联系人':
          //       this.$refs.FrequentContactsTable[2].handleDelete();
          //       break;
          //   }
          // }
        });
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-10-14
       * @description 搜索方法
       */
      handleSearch(text) {
        switch (this.activeCode) {
          case "phone":
            this.$refs.PhoneGroupingTable[0].searchText = text;
            this.$refs.PhoneGroupingTable[0].currentPage = 1;
            this.$refs.PhoneGroupingTable[0].getContactorList();
            break;
          case "sms":
            this.$refs.FrequentGroupingTable[1].searchText = text;
            this.$refs.FrequentGroupingTable[1].currentPage = 1;
            this.$refs.FrequentGroupingTable[1].getContactorList();
            break;
          case "commonlyused":
            this.$refs.FrequentContactsTable[2].searchText = text;
            this.$refs.FrequentContactsTable[2].currentPage = 1;
            this.$refs.FrequentContactsTable[2].getCommonContactorListData();
            break;
          case "emergency":
            this.$refs.EmergencyAddressBookTable[3].searchText = text;
            this.$refs.EmergencyAddressBookTable[3].currentPage = 1;
            this.$refs.EmergencyAddressBookTable[3].getContactorList();
            break;
        }
        // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
        // if (this.IsYangZhouProject) {
        //   switch (this.activeName) {
        //     case "政务通信录":
        //       this.$refs.PhoneGroupingTable[0].searchText = text;
        //       this.$refs.PhoneGroupingTable[0].currentPage = 1;
        //       this.$refs.PhoneGroupingTable[0].getContactorList();
        //       break;
        //     case "短信分组":
        //       this.$refs.FrequentGroupingTable[1].searchText = text;
        //       this.$refs.FrequentGroupingTable[1].currentPage = 1;
        //       this.$refs.FrequentGroupingTable[1].getContactorList();
        //       break;
        //     case "常用联系人":
        //       this.$refs.FrequentContactsTable[2].searchText = text;
        //       this.$refs.FrequentContactsTable[2].currentPage = 1;
        //       this.$refs.FrequentContactsTable[2].getCommonContactorListData();
        //       break;
        //     case "预案联络网":
        //       this.$refs.EmergencyAddressBookTable[3].searchText = text;
        //       this.$refs.EmergencyAddressBookTable[3].currentPage = 1;
        //       this.$refs.EmergencyAddressBookTable[3].getContactorList();
        //       break;
        //   }
        // } else {
        //   switch (this.activeName) {
        //     case "政务联络网":
        //       this.$refs.PhoneGroupingTable[0].searchText = text;
        //       this.$refs.PhoneGroupingTable[0].currentPage = 1;
        //       this.$refs.PhoneGroupingTable[0].getContactorList();
        //       break;
        //     case "短信分组":
        //       this.$refs.FrequentGroupingTable[1].searchText = text;
        //       this.$refs.FrequentGroupingTable[1].currentPage = 1;
        //       this.$refs.FrequentGroupingTable[1].getContactorList();
        //       break;
        //     case "常用联系人":
        //       this.$refs.FrequentContactsTable[2].searchText = text;
        //       this.$refs.FrequentContactsTable[2].currentPage = 1;
        //       this.$refs.FrequentContactsTable[2].getCommonContactorListData();
        //       break;
        //     case "预案联络网":
        //       this.$refs.EmergencyAddressBookTable[3].searchText = text;
        //       this.$refs.EmergencyAddressBookTable[3].currentPage = 1;
        //       this.$refs.EmergencyAddressBookTable[3].getContactorList();
        //       break;
        //   }
        // }
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-10-14
       * @description 
       */
      handleExportContactor(){
        switch (this.activeCode) {
          case "phone":
            this.$refs.PhoneGroupingTable[0].handleExportContactor();
            break;
          case "sms":
            this.$refs.FrequentGroupingTable[1].handleExportContactor();
            break;
        }
        // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
        // if (this.IsYangZhouProject) {
        //   switch (this.activeName) {
        //     case "政务通信录":
        //       this.$refs.PhoneGroupingTable[0].handleExportContactor();
        //       break;
        //     case "短信分组":
        //       this.$refs.FrequentGroupingTable[1].handleExportContactor();
        //       break;
        //   }
        // } else {
        //   switch (this.activeName) {
        //     case "政务联络网":
        //       this.$refs.PhoneGroupingTable[0].handleExportContactor();
        //       break;
        //     case "短信分组":
        //       this.$refs.FrequentGroupingTable[1].handleExportContactor();
        //       break;
        //   }
        // }
      },
      handleRowClick() {

      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-10-14
       * @description 
       */
      changeTabPane(tab) {
        // 融合通讯大分组设为可配置状态，扬州定制的分组先注释 date:2020-11-05 author:hexinting
        this.activeCode = filterGroupName(tab.name);
        if (this.activeCode == 'emergency') {
          // if (tab.name == '预案联络网') {
          this.$refs.InformationNavbar.addIsShow = false;
          this.$refs.InformationNavbar.editIsShow = false;
          this.$refs.InformationNavbar.deleteIsShow = false;
          this.$refs.InformationNavbar.exportContactorIsShow = false;
        } else if (this.activeCode == 'commonlyused') {
        // } else if (tab.name == '常用联系人') {
          this.$refs.InformationNavbar.addIsShow = false;
          this.$refs.InformationNavbar.editIsShow = false;
          this.$refs.InformationNavbar.deleteIsShow = true;
          this.$refs.InformationNavbar.exportContactorIsShow = false;
        } else {
          this.$refs.InformationNavbar.addIsShow = true;
          this.$refs.InformationNavbar.editIsShow = true;
          this.$refs.InformationNavbar.deleteIsShow = true;
          this.$refs.InformationNavbar.exportContactorIsShow = true;
        }
      },
      editMsg(row) {
        let postData = {
          id:row.id,
          reEdit:'true'
        };
        this.$api.smsQueue(postData).then(res=>{
          if (res.errorcode==0){
            for (let i=0;i<res.data.length;i++){
              let arr = {name:res.data[i].name,mobile:res.data[i].smsTo};
              this.sendPeopleList.push(arr)
            }
          } else {
            this.$message.error("数据加载失败!");
          }
        });
        let content = {caseId:row.caseId,id: row.id, smstypeId: row.smstypeId, content: row.content,isUrgeSMS:'false'};
        this.$nextTick(() => {
          this.$refs.SendMsgPanel.peopleList = this.sendPeopleList;
          this.$refs.SendMsgPanel.showMsgContent(content);
        });
      },
      editUrgentMsg(row) {
        let postData = {
          id:row.id,
          reEdit:'true'
        };
        this.$api.promptSmsQueue(postData).then(res=>{
          if (res.errorcode==0){
            for (let i=0;i<res.data.length;i++){
              let arr = {name:res.data[i].contactorName,mobile:res.data[i].number};
              this.sendPeopleList.push(arr)
            }
          } else {
            this.$message.error("数据加载失败!");
          }
        });
        let content = {caseId:row.caseId,id: row.id, smstypeId: row.smstypeId, content: row.content,count:row.count,interval:row.interval,isUrgeSMS:'true'};
        this.$nextTick(() => {
          this.$refs.SendMsgPanel.peopleList = this.sendPeopleList;
          this.$refs.SendMsgPanel.showMsgContent(content);
        });
      },
      clearSearchText() {
        this.$nextTick(() => {
          this.$refs.InformationNavbar.searchText = '';
        })
      },
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
