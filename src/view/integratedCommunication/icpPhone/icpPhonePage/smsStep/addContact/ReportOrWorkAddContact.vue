<template>
  <div class="sms-tree">
    <el-dialog
      title="选择通讯录"
      :visible.sync="dialogFormVisible"
      width="1060px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="changeDialog"
      :modal-append-to-body='false'
    >
      <el-tabs v-model="activeAllModel" :style="rightHeightStyle" @tab-click="changePage">
        <el-tab-pane
          :label="item.label"
          :name="(index+1).toString()"
          v-for="(item,index) in tabArr"
          :key="index"
        ></el-tab-pane>
      </el-tabs>
      <el-row :gutter="20" style="padding:0 40px 15px;">
        <el-col :span="8">
          <address-group
            ref="addressGroup"
            :list="modifiedUserList"
            :listProps="modifiedUserProps"
            @handleNodeClick="handleNodeClick"
            :currentTab="activeAllModel"
            @selectCommonlyContactor="selectCommonlyContactor"
            @selectRecentlyContactor="selectRecentlyContactor"
          ></address-group>
        </el-col>
        <el-col :span="9">
          <div style="height:500px;border:1px solid #ccc;">
            <all-contact
              :searchText="searchText"
              :dataList="platShareMenuList"
              @selectData="getSelectData"
              @searchResult="searchResult"
              @delRepy="delRepy"
              @initContact="initContact"
            ></all-contact>
            <!-- 最近联系人使用该分页 start -->
            <el-pagination
              v-if="isRecentContactor"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total"
            ></el-pagination>
            <!-- 最近联系人使用该分页 end -->
            <el-pagination
              v-else
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 30, 50, 100]"
              :page-size="pageSize"
              layout="prev, pager, next, sizes, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </el-col>
        <el-col :span="7">
          <select-contact
            :allSelectData="allSelectData"
            :judge="judge"
            v-bind="$attrs"
            @initContact="initContact"
            v-on="$listeners"
            @delIt="delIt"
            @delAll="delAll"
          ></select-contact>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog :visible.sync="delGroupView" width="410px" title="删除分组" center append-to-body :close-on-click-modal="false">
      <div style="background-color: #fffada;padding: 5px 20px;margin-bottom: 40px;">
        <p>该分组包含多个子分组和联系人，删除该分组将同时移除该分组相关联系人。</p>
      </div>

      <p style="text-align:center;">是否删除该分组?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false">取 消</el-button>
        <el-button type="primary" @click="delGroupHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { treeDataTranslate } from "@/utils";
import AddressGroup from "./ReportOrWorkAddressGroup";
import AllContact from "./AllContact";
import SelectContact from "./SelectContact";
import { mapGetters } from "vuex";

export default {
  name: "save_template",
  inheritAttrs: false,
  components: {
    AddressGroup,
    AllContact,
    SelectContact
  },

  data() {
    return {
      smsOrFax: 'sms',
      isRecentContactor: false, // 是否是最近联系人（用来判断分页）
      // 通讯录分组
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      },

      // 通讯录人员
      search: "",
      selectedNode: [],
      platShareMenuList: [],
      pageSize: 10,
      page: 1,
      total: 0,
      dialogFormVisible: false,
      form: {
        region: [],
        name: "",
        desc: ""
      },
      value: "",
      //  保存模板参数
      parentId: "",

      delGroupView: false,
      currentTreeId: [],

      allSelectData: [], //选中联系人

      currentCheck: [], //当前选中联系人

      judge: "", //判断点击的是联系人还是负责人
      activeAllModel: "3", //tabs选项
      tabArr: [
        { label: "政务联络网" },
        { label: "应急联动网" },
        { label: "基层联络网" },
        { label: "备勤联络网" },
        { label: "资源联络网" },
        { label: "短信分组" },
        { label: "快捷组" }
      ],
      rightHeightStyle: {
        display: "flex",
        "flex-direction": "column"
      }, // 切换样式
      tabName: "政务联络网",
      groupId: "", //组Id
      type: false,
      searchText: "", // 搜索框的值
      dateValue: ''
    };
  },
  mounted() {},
  created() {
    console.log('传真or短信', this.smsOrFax)
    this.tabArr = [
      { label: "部门值班组" },
      { label: "快捷组" },
      { label: "政务联络网" },
    ];
  },
  watch: {
    currentCheck(newV, oldV) {
      let delData = [];
      if (!this.type) {
        if (newV.length > oldV.length) {
          newV = this.delRepy(newV);
          // console.log(this.allSelectData)
          this.allSelectData = this.allSelectData.concat(
            [...newV].filter(x => [...oldV].every(y => y.id !== x.id))
          );
        } else {
          newV = this.delRepy(newV);
          delData = [...oldV].filter(x => [...newV].every(y => y.id !== x.id)); //要删除的数据
          this.allSelectData = [...this.allSelectData].filter(x =>
            [...delData].every(y => y.id !== x.id)
          );
        }
      }
    }
  },
  methods: {
    changePage() {
      //this.$refs.addressGroup.tabPosition = 0 // 改变tabPosition，让最近联系人的字体颜色还原
      this.searchText = ""; // 清空搜索框数据
      this.isRecentContactor = false; // 不触发最近联系人按钮，为false
      this.page = 1;
      this.pageSize = 10;
      this.total = 0;
      this.platShareMenuList = [];
      if (this.activeAllModel == "1") {
        this.getBuMenZhiBanTree();
        this.tabName = "部门值班组";
      } else if (this.activeAllModel == "3") {
        this.tabName = "政务联络网";
        this.getPhoneGroupingTree(1);
      } else if (this.activeAllModel == "2") {
          this.getShortcutGroupData();
          this.tabName = "快捷组";
        }
    },
    //电话分组树
    getPhoneGroupingTree(key) {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$api.telephoneGroupingTree(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    getBuMenZhiBanTree() {
      this.$api.subordinateGetSelectedGroup().then((res) => {
        this.modifiedUserList = res.data;
      });
    },
    //应急通讯录架构树
    getEmergencyAddressBookTree() {
      let data = {
        id: 0
      };
      let CallbackReload = this;
      this.$api.getBriefsByClassId(data, CallbackReload).then(result => {
          if (result) {
            this.modifiedUserList = [];
            for (let n in result.data) {
              this.modifiedUserList.push({
                id: result.data[n].id,
                name: result.data[n].name + "通讯录",
                versionId: result.data[n].versionId,
                children: []
              });
              let data = {
                id: result.data[n].versionId
              };
              this.$api.getStructTree(data, this).then(res => {
                this.modifiedUserList[n].children = res.data;
              });
            }
          }
        })
        .catch(err => {});
    },
    // 基层通讯录架构树
    gliaisonGroupList() {
      let data = {
        displayDefault: true
      };
      this.$api.gliaisonGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    // 备勤通讯录架构树
    dutyGroupList() {
      let data = {
        displayDefault: true
      };
      this.$api.dutyGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    // 资源通讯录架构树
    getResourceGroupingTree(key) {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$api.resourceGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    //获取短信分组
    getSmsGroupListTree(key) {
      let data = {
        displayDefault: true
      };
      this.$api.smsGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }

        this.modifiedUserList = res.data || [];
      });
    },
    // 获取传真分组数据
    getFaxGroupData() {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$api.faxGroupList(data).then(res => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    // 获取电话快捷组数据
    getPhoneGroupData() {
        let data = {
            displayDefault: true
        };
        this.$api.phoneQuickGroupList(data).then(res => { 
            if (res.errorcode != 0) {
            this.$message({
                message: res.msg,
                type: "error"
            });
            return;
        };
        this.modifiedUserList = res.data || [];
        });
      /*this.$http({
          url: window.g.ApiUrl + "/eos/communication/group/phoneQuickGroupList",
          headers:{'Authorization':sessionStorage.getItem("machineId")},
          method: "post",
          data: {
            displayDefault: true
          }
        }).then((res) => {
          this.modifiedUserList = res.data.data || [];
        });*/
    },
    getShortcutGroupData(key) {
      let data = {
        displayDefault: true //是否显示未分组联系人
      };
      this.$api.shortcutGroupList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.modifiedUserList = res.data || [];
      });
    },
    // 通讯录树型数据
    // getTreeList() {
    //   this.$http({
    //     url: this.$http.adornUrl("/mail/mailgroup/list"),
    //     method: "get"
    //   }).then(({ data }) => {
    //     // console.log(data)
    //     if (data && data.code == 0) {
    //       this.modifiedUserList = data.data;
    //       this.initContact();
    //     }
    //   });
    // },
    // // 初始化通讯录人员
    initContact() {
        this.getContactorList();
    },
    /**
     * 获取对应模块联系人
     * obj: 点击树的节点对象
     * author: hexinting
     * activeAllModel: 1(政务联络网), 2(应急联动网), 3(基层联络网), 4(备勤联络网), 5(资源联络网), 6(短信分组 or 传真分组), 7(快捷组)
     */
    getAllModuleContactors(obj) {
      if(this.activeAllModel == "1") this.groupId = obj.deptId; // 树id， 分组id
      else this.groupId = obj.id; // 树id， 分组id
      this.getContactorList();
    },
    /**
     * 点击树形节点事件
     * obj: 点击树的节点对象
     * author: hexinting
     */
    handleNodeClick(obj) {
      this.isRecentContactor = false;
      this.page = 1;
      this.pageSize = 10;
      this.total = 0;
      this.searchText = ""
      this.getAllModuleContactors(obj); // 获取对应模块联系人
    },
    //获取政务联系人数据
    getContactorList() {
      // this['formData' + this.tabPosition].rowData = null;
      var dictType = ""
      switch(Number(this.activeAllModel)){
        case 1:
          dictType=''
          break;
        case 3:
          dictType='governmentAffairs'
          break;
        case 2:
          dictType='quick'
          break;
      }
      let data;
      if (this.activeAllModel == "3") {
          data = {
            dictType,
            groupId: this.groupId,
            page: this.page,
            size: this.pageSize,
            searchText: this.searchText,
            type: "phone"
          };
           this.$api.contactorList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        if (res.data) {
          this.platShareMenuList = res.data.data || [];
          this.total = res.data.totalElements;
        }
      });
      } else if (this.activeAllModel == "1") {
         this.$api.getDutyPersonByDate({
          date: this.dateValue,
          deptId: this.groupId,
          searchText: this.searchText
        }).then((res) => {
          this.platShareMenuList = res.data || [];
        });
      } else {
        data = {
          dictType,
          groupId: this.groupId,
          page: this.page,
          size: this.pageSize,
          searchText: this.searchText,
          type: "phone"
        };
         this.$api.contactorList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        if (res.data) {
          this.platShareMenuList = res.data.data || [];
          this.total = res.data.totalElements;
        }
      });
      }
    },
    /**
     * @lastEidtor hexinting 
     * @lastDate 2020-11-13
     * @description 获取应急通讯录联系人
     */
    getEmergencyAddressData() {
      let data = {}
      if(this.smsOrFax === "fax") {
        data = {
          searchText: this.searchText,
          id: this.groupId,
          page: this.page,
          size: this.pageSize,
          isTop: true,
          type: "fax"
        };
      } else if (this.smsOrFax === "sms") {
        data = {
          searchText: this.searchText,
          id: this.groupId,
          page: this.page,
          size: this.pageSize,
          isTop: true,
          type: "sms"
        };
      } else { // bug8097 author:hexinting date:20201113
        data = {
          searchText: this.searchText,
          id: this.groupId,
          page: this.page,
          size: this.pageSize,
          isTop: true,
          type: "phone"
        };
      }
      this.$api.emergencyAddressBook(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.platShareMenuList = res.data.data || [];
        this.total = res.data.totalElements;
      });
    },
    getDataList(type, receiverData) {
      this.judge = type;
      this.dialogFormVisible = true;
      setTimeout(() => {
        if (receiverData) {
          this.currentCheck = receiverData;
        }
      });
    },
    getId(value) {
      this.parentId = value;
    },
    onSubmit() {
      // console.log(this.allSelectData)
      // this.$http({
      //   url: this.$http.adornUrl("/message/messageGroup/saveMessageContactorGroup"),
      //   method: "post",
      //   data: this.$http.adornData({
      //     phone: this.allSelectData.map(v=>v.mobile1?v.mobile1:v.phone).join(''),
      //     parentId: this.parentId?this.parentId:0,
      //     name: this.form.name,
      //     userIds: this.allSelectData.map(v=>v.id).join(''),
      //     messageGroup: [],
      //     mailGroup: [],
      //     id: -1,
      //   })
      // }).then(({ data }) => {
      //   console.log(data)
      //   if (data && data.code == 0) {
      //     this.$message({
      //       message: "保存分组成功",
      //       type: "success"
      //     });
      this.dialogFormVisible = false;

      //     this.$root("getDataList",1)

      //     //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
      //   }
      // });
      // this.$emit("addContact",this.allSelectData.map(v=>v.id))
    },
    delView(currentTreeId) {
      this.delGroupView = true;
      this.currentTreeId = currentTreeId;
    },
    delGroupHandle() {
      this.$http({
        url: this.$http.adornUrl(`/message/messageGroup/delete`),
        method: "POST",
        data: this.$http.adornData(
          {
            ids: [this.currentTreeId]
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.$emit("refreshData");
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        } else {
          this.$message({
            type: "info",
            message: "删除失败"
          });
        }
      });
    },
    getSelectData(val, type) {
      this.type = type; //是否点击树
      this.currentCheck = val;
    },
    searchResult(val) {
      this.searchText = val;
      this.page = 1;
      this.pageSize = 10;
      this.total = 0;
      this.getContactorList();
    },
    // 过滤选中的数据
    delRepy(filterData) {
      for (let i = 0; i < filterData.length; i++) {
        if (filterData[i] === undefined) {
          filterData.splice(i, 1);
          i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位
        }
      }
      return filterData;
    },
    // 删除选中
    delIt(id) {
      // console.log('this.currentCheck: ', this.currentCheck);
      this.currentCheck = this.currentCheck.filter(x => x.id != id);
      this.allSelectData = this.allSelectData.filter(x => x.id != id);
    },
    // 删除所有
    delAll() {
      this.currentCheck = [];
      this.allSelectData = [];
    },
    // 关闭弹窗
    changeDialog() {
        this.dialogFormVisible=false
      this.$emit("changeDialog");
    },
    // 页数尺寸改变
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.getAllModuleContactors({ id: this.groupId });
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.page = val;
      this.getAllModuleContactors({ id: this.groupId });
    },
    //获取最近联系人
    selectRecentlyContactor() {
      this.isRecentContactor = true;
      this.page = 1;
      this.pageSize = 1000; // 设置一个最大值
      this.searchText = '';
      this.$api.getRecentContactorList().then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            error: "error"
          });
          return;
        }
        res.data.data.forEach(item => {
          item.meetingType = "";
          // item.name = item.contactor;
        });
        setTimeout(() => {
          console.log("执行定时器内容");
          this.platShareMenuList = res.data.data || [];
          this.total = res.data.totalElements;
        }, 800);
      });
    },
    //获取常用联系人
    selectCommonlyContactor() {
      let data = {
        searchText: this.searchText,
        page: this.page,
        size: this.pageSize,
        type: "sms"
      };
      this.$api.commonContactorList(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            error: "error"
          });
          return;
        }
        this.platShareMenuList = res.data.data || [];
        this.total = res.data.totalElements;
      });
    }
  }
};
</script>

<style scoped lang="scss">
// * {
//   margin: 0;
//   padding: 0;
// }
.el-form-item {
  margin: 10px 0;
}

.serchWrap {
  padding: 8px 10px;
  height: 50px;
  // min-height: 60px;
  // height: 7vh;
  display: flex;
  justify-content: flex-end;
  button {
    width: 25%;
    height: 35px;
    border-radius: 5px;
    background: rgb(14, 142, 190);
    color: #fff;
    border: none;
    font-size: 15px;
    border: 1px solid lightblue;
    /*font-family: "KatTi";*/
    /*letter-spacing: 5px;*/
  }
}
.el-select-dropdown__item {
  padding: 0 20px !important;
}
//  /deep/ .el-input{
//       width: 310px;
//   }

/deep/ .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: rgba(241, 244, 246, 1) !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: rgba(173, 182, 194, 1);
      }
    }
    span {
      color: #333333;
      padding-left: 20px;
      font-size: 15px;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}

/deep/ .el-tabs__nav-wrap {
  background-color: #f9fbff;
  padding: 0 25px;
}

// 分页样式
/deep/ .el-pagination {
  width: 100%;
  overflow: scroll;
  padding: 2px 0;
  text-align: right;
  button {
    min-width: initial;
  }
  .el-pagination__sizes {
    margin: 0 10px 0 0;
    min-width: initial;
  }
  .el-select .el-input {
    margin: 0;
  }
  .btn-prev {
    padding: 0 6px;
  }
  .el-pager li {
    min-width: 20.5px;
  }
  .el-pagination__jump {
    margin: 0;
  }
}

.opertion {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
