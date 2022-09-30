<!--
 * @Author: yanghaohao
 * @Date: 2020-09-01 10:46:42
 * @LastEditTime: 2020-12-16 14:39:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SBS\src\views\modules\specialTopic\specialTopicPublishTop\components\publishSpecialTopicTaskDialog.vue
-->

<template>
  <div class="publishSpecialTopicTaskDialog">
    <el-dialog
      title="发布专题任务"
      :visible.sync="dialogVisible"
      width="500px"
      @closed="cancelSubmit()"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
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
        <el-form-item label="专题模板" ref="dataForm" prop="templateName">
          <el-input
            v-model="dataForm.templateName"
            readonly
            @focus="getTemplate"
          ></el-input>
          <!-- <el-button @click="getTemplate()" >选择模板</el-button> -->
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
            <el-radio :label="1">短信</el-radio>
            <el-radio :label="2">电话</el-radio>
            <el-radio :label="3">短信+电话</el-radio>
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
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </div>
        <div v-if="dataForm.taskSwitch == 1" class="add_container">
          <div class="button_tab">
            <!-- 切换点击样式写法 -->
            <!-- <class="plateform-active" 
            :class="buttonType=='0'?'plateform-active':''" > -->
            <el-button @click="showPlateform()" size="small">平台</el-button>
            <el-button @click="showHuman()" size="small">人员</el-button>
          </div>
          <div v-if="buttonType == 0">
            <div v-if="confirmButton" class="platform_slide">
              <span
                v-for="(item, index) in checkListName"
                :key="index"
                class="span_item"
              >
                {{ item }}
                <span
                  style="cursor: pointer"
                  class="el-icon-circle-close"
                  @click="
                    delectUnitType(
                      index,
                      'checkListId',
                      'checkListName',
                      'checkList'
                    )
                  "
                ></span>
              </span>
            </div>
            <sv-button @click="getItemModel()" style="margin: 5px"
              >新增平台+</sv-button
            >
          </div>
          <div v-if="buttonType == 1" class="personSlide">
            <!-- <div style="display: flex; padding: 5px">
              <span>任务负责人：</span>
            </div> -->
            <!--<sv-button class="addButton">新增负责人+</sv-button>
            <div>负责人1号</div> -->
            <sv-select-contact
              title="任务负责人"
              v-model="dataForm.contactorId"
              :detail="dataForm.mailContactorEntity"
            />
            <!-- <div style="display: flex; padding: 5px">
              <span>任务参与人：</span>
            </div> -->
            <!-- <sv-button class="addButton">新增参与人+</sv-button>
            <div>参与人1号</div> -->
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
          <!-- <div class="searchWrapper">
            <input type="text" />
          </div> -->
          <div>
            <el-checkbox-group
              @change="platSelectionChangeHandle"
              v-model="checkList"
            >
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

            <div class="rightContent" style="width: 400px; margin-left: 100px">
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
            <el-button @click="templateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmSelect()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="dialog_footer">
        <sv-button @click="cancelSubmit()" width="52px">取 消</sv-button>
        <sv-button
          type="primary"
          @click="dataFormSubmit()"
          width="52px"
          style="margin-left: 5px"
          >确 定</sv-button
        >
      </div>
    </el-dialog>
    <sv-dialog-hint ref="submitFail" type="fail" />
  </div>
</template>

<script>
import moment from "moment";
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
      //子平台
      platList: [],
      //模板树控件
      treeList: [],
      treeListProps: {
        label: "name",
        children: "children"
      },
      dataForm: {
        searchName: "",
        //表单数据
        taskName: "",
        remark: "",
        templateName: "",
        endTime: "",
        valueSwitch: "0",
        taskSwitch: "0",
        remindDay: "",
        status: "1",
        //通知方式
        radio: 1,
        //平台及人员信息
        platformList: [
          {
            platformName: "",
            platformId: ""
          }
        ],
        // 任务负责人
        contactorId: "",
        mailContactorEntity: {
          id: "",
          name: "",
          type: "1"
        },
        // 任务参与人
        contactorList: [],
        type: ""
      },
      //此处添加表单验证规则
      dataRule: {
        taskName: [{ required: true, message: "请填写任务名称" }],
        templateName: [
          {
            required: true,
            message: "请选择专题模板"
          }
        ]
      },

      dataList: [],
      groupIds: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      //选择的数据
      dataListSelections: [],
      //平台数据
      checkList: [],
      checkListId: [],
      checkListName: [],
      editCheckListId: [],
      confirmButton: false
    };
  },

  mounted() {
    this.getTreeList();
  },
  methods: {
    /**
     * @description: 开关弹窗
     * @param {}
     * @return {}
     */
    cancelSubmit() {
      this.$emit("cancelSubmit");
    },

    /**
     * @description: 子任务的平台人员模块切换
     * @param {}
     * @return {}
     */
    showPlateform() {
      this.buttonType = "0";
    },
    showHuman() {
      this.buttonType = "1";
    },
    //
    /**
     * @description: 获取平台&模板弹窗
     * @param {type}
     * @return {type}
     */
    getItemModel() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform/getPlatform`),
        method: "get"
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

    /**以下为模板树的相关函数
     * @description: 获取树形控件数据
     * @param {}
     * @return {}
     */
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl("/fk/fkTemplateGroup/list"),
        method: "get"
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
    //
    /**
     * @description: 获取点击树节点的子节点
     * @param {type}
     * @return {type}
     */
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach(d => {
          this.groupIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d);
          }
        });
      }
    },
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/fk/fkTemplate/list`),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.searchName,
          groupIds: this.groupIds
        })
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
    /**
     * @description: 删除已经选择的子平台
     * @param {type}
     * @return {type}
     */
    delectUnitType(index, id, name, list) {
      this[id].splice(index, 1);
      this[name].splice(index, 1);
      console.log(list);
      if (list) {
        this[list].splice(index, 1);
      }
      if (this[list].length == 0) {
        this.confirmButton = false;
      }
      //this.acceptEditCheckList = this[list]; //用于接收做判断
      //this.acceptDialogEditCheckList = this[list]; //用于接收做判断
    },
    /**
     * @description:子平台的选择确认提交
     * @param {type}
     * @return {type}
     */
    confirmAddUnitType(id, name, list) {
      this[id] = [];
      this[name] = [];
      this[list].forEach(v => {
        this[id].push(v.split("&")[0]);
        this[name].push(v.split("&")[1]);
      });
      for (let i = 0; i < this.checkListName.length; i++) {
        this.dataForm.platformList.push({
          platformName: this.checkListName[i],
          platformId: this.checkListId[i]
        });
      }
      this.platformDialogVisible = false;
      this.confirmButton = true;
    },
    platSelectionChangeHandle(val) {},
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    /**
     * @description: 模板选择完毕后的提交确认
     * @param {type}
     * @return {type}
     */

    confirmSelect() {
      this.dataForm.templateName = this.dataListSelections[0].name;
      this.templateDialogVisible = false;
    },
    /**
     * @description: 提交表单验证，完成新任务发布功能
     * @param {type}
     * @return {type}
     */
    dataFormSubmit() {
      console.log(
        "提交数据查看",
        this.dataForm.contactorList,
        this.dataForm.mailContactorEntity
      );
      if (this.dataForm.templateName == "" || this.dataForm.taskName == "") {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = `带星号必填项不能为空！`;
        return;
      }
      let contactorDataList = [];
      contactorDataList.push({
        contactorId: this.dataForm.contactorId,
        type: 0
      });
      this.dataForm.contactorList.forEach(item => {
        contactorDataList.push({ contactorId: item.id, type: 1 });
      });
      console.log("dffffffffff", this.dataForm.platformList),
        this.$refs["dataForm"].validate(vaild => {
          if (vaild) {
            this.$http({
              url: this.$http.adornUrl(`/fk/fkTask/save`),
              method: "post",
              data: this.$http.adornData({
                name: this.dataForm.taskName,
                remark: this.dataForm.remark,
                endTime: this.dataForm.endTime,
                isRemind: this.dataForm.valueSwitch,
                isSontask: this.dataForm.taskSwitch,
                advanceRemindDay: this.dataForm.remindDay,
                remindWay: this.dataForm.radio,
                status: this.dataForm.status,
                templateId: this.dataListSelections[0].id,
                platformList: this.dataForm.platformList,
                // contactorList: [
                //   {
                //     contactorName: this.dataForm.contactorName,
                //     contactorId: this.dataForm.contactorId,
                //     type: this.dataForm.type,
                //   },
                // ],
                contactorList: contactorDataList
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500
                });
                this.dialogVisible = false;
                this.$emit("refreshDataList");
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
    }
  }
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
      width: 150px;
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
    .startTaskTitle {
      padding: 5px;
    }
    .add_container {
      .button_tab {
        padding: 5px;
      }
      .platform_slide {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        .span_item {
          border-radius: 5px;
          margin: 5px;
          border: 1px solid #f2f2f2;
          background-color: #f1f4f6;
          padding: 2px 5px;
        }
      }
      .personSlide {
        padding: 5px;
        .addButton {
          padding: 5px;
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