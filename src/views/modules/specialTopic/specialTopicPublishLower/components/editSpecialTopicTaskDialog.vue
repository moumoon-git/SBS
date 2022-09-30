<!--
 * @Author: yanghaohao
 * @Date: 2020-09-01 10:46:42
 * @LastEditTime: 2020-10-27 11:16:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SBS\src\views\modules\specialTopic\specialTopicPublishTop\components\editSpecialTopicTaskDialog.vue
-->

<template>
  <div class="publishSpecialTopicTaskDialog">
    <el-dialog
      title="编辑专题任务"
      :visible.sync="dialogVisible"
      width="400px"
      @closed="cancelEdit()"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="100px"
        class="dialog_form"
      >
        <el-form-item label="任务名称" ref="dataFrom" prop="taskName">
          <el-input v-model="dataForm.taskName"></el-input>
        </el-form-item>
        <el-form-item label="任务说明" ref="dataForm" prop="remark">
          <el-input
            type="textarea"
            v-model="dataForm.remark"
            rows="2"
          ></el-input>
        </el-form-item>
        <el-form-item label="专题模板" prop="templateName">
          <el-input
            style="width: 260px"
            v-model="dataForm.templateName"
            disabled
          ></el-input>
          <el-button @click="getTemplate()">选择模板</el-button>
        </el-form-item>
        <el-form-item label="截止时间" prop="endTime">
          <el-date-picker
            v-model="dataForm.endTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="提醒通知" prop="valueSwitch">
          <el-switch
            v-model="dataForm.valueSwitch"
            active-color="#0091ff"
            inactive-color="#666666"
            active-value="1"
            inactive-value="0"
          ></el-switch>
          <img width="20px" src="~@/assets/img/warning.png" alt />
          <div class="remark">
            注：开启提醒后，专题采集截止时间结束前，自动提醒相关平台负责人和任务负责人
          </div>
        </el-form-item>

        <el-form-item
          v-if="dataForm.valueSwitch == 1"
          label="提前通知"
          prop="remindDay"
        >
          <el-input
            v-model="dataForm.remindDay"
            placeholder="请填写天数"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="dataForm.valueSwitch == 1"
          label="通知方式"
          prop="radio"
        >
          <el-radio-group v-model="dataForm.radio">
            <el-radio label="1">短信</el-radio>
            <el-radio label="2">电话</el-radio>
            <el-radio label="3">短信+电话</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="bottom_content">
        <div class="startTaskTitle">
          子任务：
          <el-switch
            v-model="dataForm.taskSwitch"
            active-color="#0091ff"
            inactive-color="#666666"
            active-dataForm.taskSwitch="1"
            inactive-dataForm.taskSwitch="0"
          ></el-switch>
        </div>
        <div v-if="dataForm.taskSwitch == 1" class="add_container">
          <div style="display: flex">
            <!--切换点击样式写法
                        class="plateform-active" 
            :class="buttonType=='0'?'plateform-active':''" >-->
            <sv-button
              @click="showPlateform()"
              style="background-color: #0091ff; color: #fff"
              >平台</sv-button
            >
            <sv-button @click="showHuman()">人员</sv-button>
          </div>
          <div v-if="buttonType == 0" class="platform_slide">
            <span
              v-for="(item, index) in dataForm.platformList"
              :key="index"
              class="span_item"
              >{{ item.platformName }}
              <span style="cursor: pointer" @click="delectUnitType()">×</span>
            </span>
            <sv-button @click="getItemModel()">+</sv-button>
          </div>
          <div v-if="buttonType == 1" class="personSlide">
            <sv-select-contact
              title="任务负责人"
              v-model="dataForm.contactorId"
              :detail="dataForm.mailContactorEntity"
            />
            <sv-select-contact
              title="任务参与人"
              v-model="dataForm.contactorList"
              :multiple="true"
            />
          </div>
        </div>
        <!--添加平台弹窗-->
        <el-dialog
          title="请选择平台"
          :visible.sync="platformDialogVisible"
          width="30%"
          append-to-body
        >
          <div class="searchWrapper">
            <input type="text" />
          </div>
          <div>
            <el-checkbox-group v-model="checkList">
              <div v-for="(item, index) in platList" :key="index">
                <el-checkbox :label="item.id + '&' + item.platformName">{{
                  item.platformName
                }}</el-checkbox>
              </div>
            </el-checkbox-group>
            <el-button
              style="marginbottom: 10px"
              @click="
                confirmAddUnitType('checkListId', 'checkListName', 'checkList')
              "
              >确定添加</el-button
            >
          </div>
        </el-dialog>
        <!--代码的力量，模板登场 -->
        <el-dialog
          title="选择专题模板"
          :visible.sync="templateDialogVisible"
          width="50%"
          append-to-body
        >
          <div class="dialogWrapper" style="display: flex">
            <div class="contentList" style="width: 500px">
              <el-input
                placeholder="请输入专题名称关键字"
                v-model="dataForm.searchName"
              ></el-input>
              <el-tree
                :data="treeList"
                :props="treeListProps"
                default-expand-all
                node-key="id"
                highlight-current
                @node-click="handleNodeClick"
                ref="tree"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <i class="el-icon-folder-opened"></i>
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
            <div class="rightContent" style="margin-left: 100px; width: 500px">
              <el-table
                :data="dataList"
                style="width: 100%; overflow-y: auto"
                @selection-change="selectionChangeHandle"
              >
                <el-table-column
                  type="selection"
                  header-align="left"
                  align="center"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="专题名称"
                  width="180"
                ></el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelSubmit()">取 消</el-button>
            <el-button type="primary" @click="confirmSelect()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="dialog_footer">
        <sv-button @click="cancelEdit()">取 消</sv-button>
        <sv-button type="primary" @click="dataFormSubmit()">确 定</sv-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "publishSpecialTopicTaskDialog",
  data() {
    return {
      dialogVisible: true,
      //平台人员切换
      buttonType: "0",
      //选择平台弹窗
      platformDialogVisible: false,
      templateDialogVisible: false,
      checkModelList: [],
      //模板树控件
      treeList: [],
      treeListProps: {
        label: "name",
        children: "children",
      },
      dataForm: {
        id: "",
        searchName: "",
        //表单数据
        taskName: "",
        remark: "",
        templateName: "",
        templateId: "",
        endTime: "",
        valueSwitch: "0",
        taskSwitch: "0",
        remindDay: "",
        status: "1",
        //通知方式
        radio: "1",
        //平台及人员信息
        platformList: [
          {
            platformName: "",
            platformId: "",
            taskId: "",
            id: "",
          },
        ],
        // 任务负责人
        contactorId: "",
        mailContactorEntity: {
          id: "",
          name: "",
          type: "1",
        },
        // 任务参与人
        contactorList: [],
        type: "",
      },
      //此处添加表单验证规则
      dataRule: {},

      dataList: [],
      groupIds: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      //选择的数据
      dataListSelections: [],
      //平台数据
      platList: [],
      checkList: [],
      checkListId: [],
      checkListName: [],
      editCheckListId: [],
      confirmButton: false,
    };
  },
  mounted() {
    this.getTreeList();
  },
  methods: {
    /**
     * @description: 关闭此弹窗
     * @param {}
     * @return {}
     */
    cancelEdit() {
      this.$emit("cancelEdit");
    },

    /**
     * @description: 平台人员切换
     * @param {}
     * @return {}
     */
    showPlateform() {
      this.buttonType = "0";
    },
    showHuman() {
      this.buttonType = "1";
    },
    /**
     * @description:子平台的选择确认提交
     * @param {type}
     * @return {type}
     */
    confirmAddUnitType(id, name, list) {
      this.dataForm.platformList = [
        {
          platformName: "",
          platformId: "",
        },
      ];
      this[id] = [];
      this[name] = [];
      this[list].forEach((v) => {
        this[id].push(v.split("&")[0]);
        this[name].push(v.split("&")[1]);
      });
      // this.dataForm.platformList=[{
      //  platformName:'',
      //  platformId:'',
      // }];
      for (let i = 0; i < this.checkListName.length; i++) {
        this.dataForm.platformList.push({
          platformName: this.checkListName[i],
          platformId: this.checkListId[i],
        });
      }
      this.platformDialogVisible = false;
      this.confirmButton = true;
    },
    /**
     * @description:删除子平台
     * @param {type}
     * @return {type}
     */
    delectUnitType(index, id, name, list) {},
    /**
     * @description: 打开平台&模板弹窗
     * @param {type}
     * @return {type}
     */
    getItemModel() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform/getPlatform`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platList = data.data;
        } else {
          this.$message(data.msg);
        }
      });
      this.platformDialogVisible = true;
    },
    getTemplate() {
      this.templateDialogVisible = true;
    },

    /**以下均为模板树的相关函数
     * @description: 获取树
     * @param {type}
     * @return {type}
     */
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl("/fk/fkTemplateGroup/list"),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.treeList = data.data;
          this.getDataList();
        } else {
          this.$message(data.msg);
        }
      });
    },
    /**
     * @description: 点击树形事件
     * @param {}
     * @return {}
     */
    handleNodeClick(obj) {
      this.groupIds = [];
      this.pageIndex = 1;
      this.groupIds = [obj.id];
      if (obj.children != null) {
        this.getChildren(obj.children);
      }
      this.treeId = obj.id;
      this.getDataList();
    },
    /**
     * @description: 获取子节点
     * @param {}
     * @return {}
     */
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.groupIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d);
          }
        });
      }
    },
    /**
     * @description:刷新表格数据
     * @param {type}
     * @return {type}
     */
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/fk/fkTemplate/list`),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.searchName,
          groupIds: this.groupIds,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    /**
     * @description: 模板选择确认
     * @param {type}
     * @return {type}
     */
    confirmSelect() {
      this.dataForm.templateName = this.dataListSelections[0].name;
      this.templateDialogVisible = false;
    },

    /**
     * @description: 从父组件获取数据并对相应变量赋值
     * @param {拿到的data数据}
     * @return {}
     */
    init(data) {
      this.dataForm.id = data.id;
      this.$http({
        url: this.$http.adornUrl(`/fk/fkTask/info?id=${this.dataForm.id}`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.dataForm.templateName = data.data.templateName;
          this.dataForm.radio = data.data.remindWay;
          this.dataForm.templateId = data.data.templateId;
          this.dataForm.platformList = data.data.platformList;
          console.log("platformList", this.dataForm.platformList);
          this.dataForm.platformList.forEach((v) => {
            this.checkList.push(v.platformId + "&" + v.platformName);
          });
        } else {
          this.$message.error(data.msg);
        }
      });

      this.dataForm.taskName = data.name;
      this.dataForm.remark = data.remark;
      this.dataForm.endTime = data.endTime;
      this.dataForm.valueSwitch = data.isRemind;
      this.dataForm.taskSwitch = data.isSontask;
      this.dataForm.remindDay = data.advanceRemindDay;
      this.dataForm.status = data.status;
      // this.dataForm.contactorName = data.contactorList.contactorName;
      // this.dataForm.contactorList = data.contactorList.contactorId;
      this.dataForm.type = data.contactorList.type;
      let totalContactorList = data.contactorList;
      totalContactorList.forEach((item) => {
        if (item.type == "0") {
          this.dataForm.contactorId = item.contactorId;
          this.dataForm.mailContactorEntity = {
            id: item.contactorId,
            name: item.contactorName,
          };
        } else if (item.type == "1") {
          this.dataForm.contactorList.push({
            id: item.contactorId,
            name: item.contactorName,
          });
        }
      });
    },

    /**
     * @description: 编辑完进行提交表单验证
     * @param {type}
     * @return {type}
     */
    dataFormSubmit() {
      this.$refs["dataForm"].validate((vaild) => {
        if (vaild) {
          this.$http({
            url: this.$http.adornUrl(`/fk/fkTask/update`),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id,
              name: this.dataForm.taskName,
              remark: this.dataForm.remark,
              endTime: this.dataForm.endTime,
              isRemind: this.dataForm.valueSwitch,
              isSontask: this.dataForm.taskSwitch,
              advanceRemindDay: this.dataForm.remindDay,
              remindWay: this.dataForm.radio,
              status: this.dataForm.status,
              templateId: this.dataForm.templateId,
              platformList: this.dataForm.platformList,
              contactorList: [
                {
                  contactorName: this.dataForm.contactorName,
                  contactorId: this.dataForm.contactorId,
                  type: this.dataForm.type,
                },
              ],
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.dialogVisible = false;
              this.$emit("refreshDataList");
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
* {
  font-family: PingFangSC-Regular, PingFang SC;
}

.publishSpecialTopicTaskDialog {
  /deep/.el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 23px 3px rgba(201, 201, 201, 0.27);
  }
  /deep/.el-dialog__header {
    height: 40px;
    line-height: 40px;
    background-color: #f1f4f6;
    border-radius: 5px 5px 0px 0px;
    padding: 0px;
  }
  /deep/.el-dialog__title {
    font-size: 14px;
    padding-left: 20px;
  }
  /deep/.el-dialog__headerbtn {
    top: 0px;
  }
  /deep/.el-dialog__body {
    padding: 0px;
  }
  /deep/.el-input--medium .el-input__inner {
    height: 30px;
    line-height: 30px;
    width: 200px;
  }
  .dialog_form {
    font-size: 14px;
    padding: 20px;
    border-bottom: 1px solid#f1f6ff;
    /deep/.el-textarea__inner {
      resize: none;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
      width: 150px;
      overflow: hidden;
      line-height: 28px;
      border: 1px solid #dddddd;
      border-radius: 4px;
      outline: none;
      color: #666666;
      background: #ffffff;
      overflow: hidden;
      padding: 0 10px;
      &::-webkit-input-placeholder {
        color: #b4b4b4;
      }
      &:-moz-placeholder {
        color: #b4b4b4;
      }
      &::-moz-placeholder {
        color: #b4b4b4;
      }
      &:-ms-input-placeholder {
        color: #b4b4b4;
      }
      &:hover {
        border-color: #b4b4b4;
      }
      &:focus {
        border-color: #0091ff;
      }
    }
    /deep/ .el-input--medium .el-input__inner {
      height: 30px;
      line-height: 30px;
      width: 150px;
      &::-webkit-input-placeholder {
        color: #b4b4b4;
      }
      &:-moz-placeholder {
        color: #b4b4b4;
      }
      &::-moz-placeholder {
        color: #b4b4b4;
      }
      &:-ms-input-placeholder {
        color: #b4b4b4;
      }
    }
    /deep/.el-input {
      width: 150px !important;
    }
    /deep/ .el-button {
      height: 30px;
      line-height: 28px;
      font-size: 14px;
      display: inline-block;
      padding: 0px 5px;
    }
    .remark {
      line-height: 20px;
      color: #999999;
    }
  }
  .bottom_content {
    .add_container {
      .platform_slide {
        .span_item {
          margin-left: 5px;
          border: 1px solid #f2f2f2;
          background-color: #f1f4f6;
        }
      }
    }
  }
  .dialog_footer {
    border-top: 1px solid #f2f2f2;
    padding: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>