<!--
 * @Author: yanghaohao
 * @Date: 2020-09-01 10:46:42
 * @LastEditTime: 2021-01-19 16:03:48
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
      :close-on-click-modal="false"
      @closed="cancelSubmit()"
    >
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="100px"
        class="dialog_form"
      >
        <el-form-item
          ref="dataFrom"
          label="任务名称"
          prop="taskName"
        >
          <el-input v-model="dataForm.taskName" />
        </el-form-item>
        <el-form-item
          ref="dataForm"
          label="任务说明"
          prop="remark"
        >
          <el-input
            v-model="dataForm.remark"
            type="textarea"
            rows="2"
          />
        </el-form-item>
        <el-form-item
          ref="dataForm"
          label="专题模板"
          prop="templateId"
        >
          <!-- <el-input
            v-model="dataForm.templateName"
            readonly
            @focus="getTemplate"
          ></el-input> -->
          <!-- <div> -->
          <sv-select-contact
            v-model="dataForm.templateId"
            title="专题模板"
            :api="[
              '/fk/fkTemplateGroup/list',
              '/fk/fkTemplate/getTemplate'
            ]"
          />
          <!-- <el-button @click="getTemplate()" >选择模板</el-button> -->
        </el-form-item>
        <el-form-item
          label="截止时间"
          prop="endTime"
        >
          <el-date-picker
            v-model="dataForm.endTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="expireTimeOption"
          />
        </el-form-item>
        <el-form-item
          label="提醒通知"
          prop="valueSwitch"
        >
          <el-switch
            v-model="dataForm.valueSwitch"
            active-color="#0091ff"
            inactive-color="#666666"
            active-value="1"
            inactive-value="0"
          />
          <img
            width="20px"
            src="~@/assets/img/warning.png"
            alt
          >
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
          />
        </el-form-item>
        <el-form-item
          v-if="dataForm.valueSwitch == 1"
          label="通知方式"
          prop="radio"
        >
          <el-radio-group v-model="dataForm.radio">
            <el-radio :label="1">
              短信
            </el-radio>
            <el-radio :label="2">
              电话
            </el-radio>
            <el-radio :label="3">
              短信+电话
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="bottom_content">
        <!-- <div class="startTaskTitle">
          子任务：
          <el-switch
            v-model="dataForm.taskSwitch"
            active-color="#0091ff"
            inactive-color="#666666"
          ></el-switch>
        </div> -->
        <div class="add_container">
          <div class="button_tab">
            <!-- 切换点击样式写法 -->
            <!-- <class="plateform-active"
            :class="buttonType=='0'?'plateform-active':''" > -->
            <span class="tab_title">子平台</span>
            <!-- <el-button @click="showHuman()" size="small">人员</el-button> -->
          </div>
          <div>
            <div class="platform_slide">
              <span
                v-for="item in dataForm.platformList"
                :key="item.id"
                class="span_item"
              >
                {{ item.platformName }}
                <span
                  style="cursor: pointer"
                  class="el-icon-circle-close"
                  @click="
                    delectUnitType(item)
                  "
                />
              </span>
            </div>
            <sv-button
              style="margin: 5px"
              @click="getItemModel()"
            >
              新增平台+
            </sv-button>
          </div>
          <!-- <div v-if="buttonType == 1" class="personSlide">
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
          </div> -->
        </div>
        <!--添加平台弹窗-->
        <el-dialog
          title="请选择平台"
          :visible.sync="platformDialogVisible"
          width="400px"
          append-to-body
        >
          <!-- <div class="searchWrapper">
            <input type="text" />
          </div> -->
          <div>
            <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
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
            > -->

            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group
              v-model="checkList"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="city in platList"
                :key="city.id"
                :label="city.id"
              >
                {{ city.platformName }}
              </el-checkbox>
            </el-checkbox-group>
            <el-button
              style="margin: 20px 10px 0px 250px"
              @click="confirmAddUnitType"
            >
              确定添加
            </el-button>
          </div>
        </el-dialog>
        <!--代码的力量，模板登场 -->
        <!-- <el-dialog
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
        </el-dialog> -->
      </div>
      <div class="dialog_footer">
        <sv-button
          width="52px"
          @click="cancelSubmit()"
        >
          取 消
        </sv-button>
        <sv-button
          type="primary"
          width="52px"
          style="margin-left: 5px"
          @click="dataFormSubmit()"
        >
          确 定
        </sv-button>
      </div>
    </el-dialog>
    <sv-dialog-hint
      ref="submitFail"
      type="fail"
    />
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'PublishSpecialTopicTaskDialog',
  data() {
    return {
      expireTimeOption: {
        disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      dialogVisible: true,
      // 平台人员切换
      buttonType: '0',
      // 选择平台弹窗
      platformDialogVisible: false,
      templateDialogVisible: false,
      checkModelList: [],
      // 子平台
      platList: [],
      // 模板树控件
      treeList: [],
      treeListProps: {
        label: 'name',
        children: 'children',
      },
      dataForm: {
        searchName: '',
        // 表单数据
        taskName: '',
        remark: '',
        templateId: '',
        // templateName: '',
        endTime: '',
        valueSwitch: '0',
        taskSwitch: false,
        remindDay: '',
        status: '1',
        // 通知方式
        radio: 1,
        // 平台及人员信息
        platformList: [],
        // 任务负责人
        contactorId: '',
        mailContactorEntity: {
          id: '',
          name: '',
          type: '1',
        },
        // 任务参与人
        contactorList: [],
        type: '',
      },
      // 此处添加表单验证规则
      dataRule: {
        taskName: [{ required: true, message: '请填写任务名称' }],
        templateId: [
          {
            required: true,
            message: '请选择专题模板',
          },
        ],
        endTime: [
          { required: true, message: '请选择截止时间' },

        ],
      },

      dataList: [],
      groupIds: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      // 选择的数据
      // dataListSelections: [],
      // 平台数据
      checkList: [],
      checkListId: [],
      checkListName: [],
      editCheckListId: [],
      confirmButton: false,
      isIndeterminate: false,
      checkAll: false,
    };
  },

  mounted() {
    this.getTreeList();
  },
  methods: {
    /**
     * @description:
     * @param {*}
     * @return {*}
     */
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.platList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.platList.length;
      console.log('this.checkListddddd', this.checkList);
    },

    /**
     * @description: 全选按钮事件
     * @param {Boolean} isChecked 全选，则值为true；否则false
     */
    handleCheckAllChange(isChecked) {
      if (isChecked) {
        this.checkList = [];
        this.platList.forEach((item) => this.checkList.push(item.id));
        this.isIndeterminate = false;
        this.checkAll = true;
      } else if (this.checkList.length > 0 && this.checkList.length !== this.platList.length) {
        this.isIndeterminate = true;
        this.checkAll = false;
      } else {
        this.checkList = [];
        this.isIndeterminate = false;
        this.checkAll = false;
      }
      window.console.log('this.checkList', this.checkList, this.platList);
    },

    /**
     * @description: 开关弹窗
     * @param {}
     * @return {}
     */
    cancelSubmit() {
      this.$emit('cancelSubmit');
    },

    /**
     * @description: 子任务的平台人员模块切换
     * @param {}
     * @return {}
     */
    showPlateform() {
      this.buttonType = '0';
    },
    showHuman() {
      this.buttonType = '1';
    },
    //
    /**
     * @description: 获取平台&模板弹窗
     * @param {type}
     * @return {type}
     */
    getItemModel() {
      this.$http({
        url: this.$http.adornUrl('/sys/platform/getPlatform'),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platList = data.data;
        } else {
          this.$message(data.msg);
        }
      });
      this.platformDialogVisible = true;
      console.log('gggggggggggg', this.checkList);
    },
    getTemplate() {
      this.templateDialogVisible = true;
    },

    /** 以下为模板树的相关函数
     * @description: 获取树形控件数据
     * @param {}
     * @return {}
     */
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl('/fk/fkTemplateGroup/list'),
        method: 'get',
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
        data.forEach((d) => {
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
        url: this.$http.adornUrl('/fk/fkTemplate/list'),
        method: 'post',
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
    /**
     * @description: 删除已经选择的子平台
     * @param {Oject} data：删除的子平台对象
     * @return {*}
     */
    delectUnitType(data) {
      this.checkList = this.checkList.filter((id) => id !== data.platformId);
      this.checkListName = this.checkListName.filter((name) => name !== data.platformName);
      //   this.dataForm.platformList = [];
      // for (let i = 0; i < this.checkList.length; i++) {
      //   this.dataForm.platformList.push({
      //     platformName: this.checkListName[i],
      //     platformId: this.checkList[i],
      //   });
      // }
      this.dataForm.platformList = this.dataForm.platformList.filter(
        (x) => x.platformId !== data.platformId,
      );
      // console.log('listId', data, this.checkList, this.dataForm.platformList);
    },
    /**
     * @description:子平台的选择确认提交
     * @param {*}
     * @return {*}
     */
    confirmAddUnitType() {
      this.dataForm.platformList = [];
      this.checkListName = [];
      this.platList.forEach((item) => {
        if (this.checkList.find((items) => items === item.id)) {
          this.checkListName.push(item.platformName);
        }
      });
      // console.log('this.checkListName', this.checkListName);
      for (let i = 0; i < this.checkList.length; i += 1) {
        this.dataForm.platformList.push({
          platformName: this.checkListName[i],
          platformId: this.checkList[i],
        });
      }
      // console.log('this.dataForm.checkList', this.checkList);
      // console.log('this.dataForm.platformList', this.dataForm.platformList);
      this.platformDialogVisible = false;
      this.confirmButton = true;
    },
    // platSelectionChangeHandle(val) {},
    // selectionChangeHandle(val) {
    //   this.dataListSelections = val;
    // },
    /**
     * @description: 模板选择完毕后的提交确认
     * @param {type}
     * @return {type}
     */

    // confirmSelect() {
    //   // this.dataForm.templateName = this.dataListSelections[0].name;
    //   this.templateDialogVisible = false;
    // },
    /**
     * @description: 提交表单验证，完成新任务发布功能
     * @param {type}
     * @return {type}
     */
    dataFormSubmit() {
      if (this.dataForm.valueSwitch === '1') {
        if (this.dataForm.remindDay === '') {
          this.$refs.submitFail.visible = true;
          this.$refs.submitFail.supplementText = '请填写提前通知天数';
          return;
        }
        const time = moment(this.dataForm.endTime).format('YYYY-MM-DD');
        const mydate = moment(moment(new Date()).format('YYYY-MM-DD'));
        if (Number(mydate.diff(time, 'day')) + Number(this.dataForm.remindDay) > 0) {
          this.$refs.submitFail.visible = true;
          this.$refs.submitFail.supplementText = '提前通知时间应从今天起至截止日期';
          return;
        }
      }
      if (this.dataForm.platformList.length === 0)
      {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '请选择子平台';
        return;
      }
      if (this.dataForm.templateId == '' || this.dataForm.taskName == '' || this.dataForm.endTime == '') {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '带星号必填项不能为空！';
        return;
      }
      const contactorDataList = [];
      if (this.dataForm.contactorId != '') {
        contactorDataList.push({
          contactorId: this.dataForm.contactorId,
          type: 0,
        });
      }
      if (this.dataForm.contactorList.length > 0) {
        this.dataForm.contactorList.forEach((item) => {
          contactorDataList.push({ contactorId: item.id, type: 1 });
        });
      }
    

      console.log('dffffffffff', this.dataForm.platformList),
      this.$refs.dataForm.validate((vaild) => {
        if (vaild) {
          this.$http({
            url: this.$http.adornUrl('/fk/fkTask/save'),
            method: 'post',
            data: this.$http.adornData({
              name: this.dataForm.taskName,
              remark: this.dataForm.remark,
              endTime: this.dataForm.endTime,
              isRemind: this.dataForm.valueSwitch,
              isSontask: this.dataForm.taskSwitch,
              advanceRemindDay: this.dataForm.remindDay,
              remindWay: this.dataForm.radio,
              status: this.dataForm.status,
              // templateId: this.dataListSelections[0].id,
              templateId: this.dataForm.templateId,
              platformList: this.dataForm.platformList,
              // contactorList: [
              //   {
              //     contactorName: this.dataForm.contactorName,
              //     contactorId: this.dataForm.contactorId,
              //     type: this.dataForm.type,
              //   },
              // ],
              contactorList: contactorDataList,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              });
              this.dialogVisible = false;
              this.$emit('refreshDataList');
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
       // padding: 5px;
        .tab_title{
              border-left: 3px solid rgba(0, 145, 255, 1);
    font-size: 14px;
    display: inline-block;
    height: 14px;
    line-height: 14px;
    padding-left: 10px;
    //position: absolute;
    margin: 15px 0px 0px 15px;
    color: #333333;
    font-weight: 500;
    font-family: PingFangSC-Medium;
        }
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
