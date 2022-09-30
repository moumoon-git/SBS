<template>
  <div class="shlc">
    <div class="header">
      <span class="header_title">审批流程管理</span>
      <el-select
        clearable
        v-model="unitTypeValue"
        style="margin-right: 5px; margin-left: 5px"
        placeholder="请选择填报单位类型"
        @change="search"
      > 
        <el-option
          v-for="item in unitType"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        ></el-option>
      </el-select> 
      <el-select
        clearable
        v-model="searchFormTypeDataId"
        style="margin-right: 5px"
        placeholder="请选择流程类型"
        @change="search"
      >
        <el-option
          v-for="item in formTypeData"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        ></el-option>
      </el-select>
      <!-- <el-select v-model="formStatusDataValue" placeholder="请选择表单状态">
        <el-option
          v-for="item in formStatusData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->
      <el-date-picker
        style="margin-right: 5px"
        v-model="searchData.searchTimeDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="dateSelect"
        value-format="yyyy-MM-dd"
        @change="search"
      ></el-date-picker>
      <el-input
        suffix-icon="el-icon-search"
        v-model="searchData.input"
        clearable
        placeholder="请输入流程名称、流程说明内容关键字"
        @change="search"
      ></el-input>
      <!-- <el-button class="search" type="primary" style="margin-left:5px" @click="search">查询</el-button> -->
      <!-- 隐藏的按钮 -->
      <div style="z-index: -1; position: absolute">
        <el-upload
          :with-credentials="true"
          :show-file-list="false"
          :on-progress="beforeUploadFile"
          :on-error="handleError"
          :on-success="handleAvatarSuccess"
          :action="documenttoken"
          :headers="{ token: $cookie.get('token') }"
          style="display: inline-flex; margin: 0 10px"
        >
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              请填写我们提供
              <br />的模板进行导入
            </div>
            <el-button
              ref="importButton"
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-text="正在导入通讯录，可能需要几分钟时间，请耐心等待.."
              v-if="
                isAuth('mail:mailgroup:xlsInput') &&
                !sharedPlatform.noticeBarVisible
              "
              plain
            >
              <img src="../../../assets/img/upload.svg" />
              导入
            </el-button>
          </el-tooltip>
        </el-upload>
        <el-button
          ref="exportTemplateBtn"
          class="search"
          type="primary"
          style="margin-right: 10px"
          @click="downloadtemplate()"
          >导出模板</el-button
        >
        <el-dropdown style="margin-right: 10px">
          <el-button plain>
            <img src="../../../assets/img/download.svg" />导出
          </el-button>
          <el-dropdown-menu slot="dropdown" split-button="true">
            <el-dropdown-item
              ref="conditionExportBtn"
              @click.native="conditionExport"
              >条件导出</el-dropdown-item
            >
            <el-dropdown-item
              ref="unconditionExportBtn"
              @click.native="unConditionExport"
              >无条件导出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <el-button style="margin-left:5px;height:36px">
        <img src="../../../assets/img/upload.svg" />
        导入
      </el-button>
      <el-button style="margin-left:5px;height:36px">
        <img src="../../../assets/img/download.svg" />
        导出
      </el-button> -->
      <el-button
        class="search"
        type="primary"
        style="margin: 0 5px"
        @click="clickAddApplyForm"
        >新增奖励流程</el-button
      >
      <!-- 更多按钮 -->
      <div
        class="more-button-container"
        :class="moreBtnIsFocus ? 'more-button-focus' : 'more-button-unfocus'"
      >
        <div @click="moreBtnIsFocus = !moreBtnIsFocus">
          <span>更多</span>
          <!-- <i :class="moreBtnIsFocus?'el-icon-caret-top':'el-icon-caret-bottom'"></i> -->
          <i class="el-icon-caret-bottom"></i>
        </div>
        <div class="more-button-content">
          <div class="more-button-content-item-header">导出</div>
          <div class="more-button-content-item" @click="moreClick(1)">
            导出模板
          </div>
          <div class="more-button-content-item" @click="moreClick(2)">
            条件导出
          </div>
          <div class="more-button-content-item" @click="moreClick(3)">
            无条件导出
          </div>
          <div class="more-button-content-line"></div>
          <div class="more-button-content-item" @click="moreClick(4)">导入</div>
        </div>
      </div>
      <!-- 更多按钮 -->
      <el-dialog
        title="新增奖励流程"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="closeClickModal"
      >
        <el-form :rules="rules" :model="addApplyFormData" class="addApplyForm">
          <el-form-item required label="流程名称" :label-width="formLabelWidth">
            <el-input
              v-model="addApplyFormData.name"
              autocomplete="off"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item required label="流程类型" :label-width="formLabelWidth">
            <el-select
              v-model="addApplyFormData.formType"
              clearable
              @change="changeFormType('addApplyFormData', 'formType')"
              placeholder="请选择流程类型"
            >
              <el-option
                v-for="item in formTypeData"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item required label="奖励类型" :label-width="formLabelWidth">
            <el-select
              v-model="addApplyFormData.rewardType"
              clearable
              placeholder="请选择奖励类型"
            >
              <el-option
                v-for="item in rewardTypeListData"
                :key="item.id"
                :label="item.registerName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="process_explain"
            label="流程说明"
            :label-width="formLabelWidth"
            width="300px"
          >
            <el-input
              type="textarea"
              resize="none"
              v-model="addApplyFormData.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            style="position: relative"
            label="填报单位类型"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-button @click="addUnit" class="addUnitButton">
              <span class="crossArrow">+</span>添加填报单位
            </el-button>
            <div
              class="addUnit"
              style="
                position: absolute;
                min-width: 150px;
                background-color: white;
              "
              v-show="addUnitButton"
            >
              <el-checkbox-group @change="selectUnitType" v-model="checkList">
                <div v-for="(item, index) in unitType" :key="index">
                  <el-checkbox :label="item.id + '&' + item.typeName">{{
                    item.typeName
                  }}</el-checkbox>
                </div>
              </el-checkbox-group>
              <el-button
                style="marginbottom: 10px"
                @click="
                  confirmAddUnitType(
                    'checkListId',
                    'checkListName',
                    'checkList'
                  )
                "
                >确定添加</el-button
              >
            </div>
            <div class="showAddUnit" v-if="confirmButton">
              <span
                class="showUnit"
                v-for="(item, index) in checkListName"
                :key="index"
              >
                {{ item }}
                <span
                  class="delect-error"
                  @click="
                    delectUnitType(
                      index,
                      'checkListId',
                      'checkListName',
                      'checkList'
                    )
                  "
                  >×</span
                >
              </span>
            </div>
          </el-form-item>
          <el-form-item required label="审核流程" :label-width="formLabelWidth">
            <el-button class="addProcessButton" @click="addProcess('process')">
              <span class="crossArrow">+</span>添加流程
            </el-button>
            <div class="showProcess" v-if="showProcess">
              <span
                class="processBox"
                v-for="(item, index) in process"
                :key="index"
              >
                <span class="processLeft">
                  {{ index + 1 }}
                  <!-- <span
                    @click="delectAuditProcess(index,'process')"
                    class="el-icon-error"
                  ></span>-->
                  <img
                    style="width: 22px"
                    src="../../../assets/img/del2.svg"
                    @click="delectAuditProcess(index, 'process')"
                    alt
                  />
                </span>
                <div class="boxProcessSelect">
                  <el-select
                    class="processSelect"
                    v-model="process[index].depId"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in unitType"
                      :key="item.id"
                      :label="item.typeName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddApplyForm"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- <el-tooltip content="车" placement="top">
        <img
          src="../../../assets/img/car.png"
          style="width:16px"
          @click="edit('carUnitListId','carUnitListName','carUnitList','-100','carData','editFormCarVisible')"
        />
      </el-tooltip>
      <el-tooltip content="岗亭" placement="top">
        <img
          src="../../../assets/img/sentryBox.png"
          style="width:16px"
          @click="edit('sentryBoxUnitListId','sentryBoxUnitListName','sentryBoxUnitList','-200','sentryBoxData','editFormSentryBoxVisible')"
        />
      </el-tooltip>
      <el-tooltip content="成员" placement="top">
        <img
          src="../../../assets/img/member.png"
          style="width:16px"
          @click="edit('memberUnitListId','memberUnitListName','memberUnitList','-300','memberData','editFormMemberVisible')"
        />
      </el-tooltip>-->
      <editDialog
        v-if="editFormVisible.editFormCarVisible"
        @beforeClose="editFormVisible.editFormCarVisible = false"
        @confirmAddUnitType="
          confirmAddUnitType('carUnitListId', 'carUnitListName', 'carUnitList')
        "
        @delectUnitType="
          delectUnitType(
            $event,
            'carUnitListId',
            'carUnitListName',
            'carUnitList'
          )
        "
        @closeDialogForm="closeDialogForm('editFormCarVisible')"
        @editDelectAuditProcess="editDelectAuditProcess($event, 'carData')"
        :editData="ediInittData.carData"
        :editTitle="editTitle.carTitle"
        :editShowUnitListId="carUnitListId"
        :editShowUnitListName="carUnitListName"
        :acceptUnit="acceptDialogEditCheckList"
      ></editDialog>
      <editDialog
        v-if="editFormVisible.editFormSentryBoxVisible"
        @beforeClose="editFormVisible.editFormSentryBoxVisible = false"
        @confirmAddUnitType="
          confirmAddUnitType(
            'sentryBoxUnitListId',
            'sentryBoxUnitListName',
            'sentryBoxUnitList'
          )
        "
        @delectUnitType="
          delectUnitType(
            $event,
            'sentryBoxUnitListId',
            'sentryBoxUnitListName',
            'sentryBoxUnitList'
          )
        "
        @closeDialogForm="closeDialogForm('editFormSentryBoxVisible')"
        @editDelectAuditProcess="
          editDelectAuditProcess($event, 'sentryBoxData')
        "
        :editData="ediInittData.sentryBoxData"
        :editTitle="editTitle.sentryBoxTitle"
        :editShowUnitListId="sentryBoxUnitListId"
        :editShowUnitListName="sentryBoxUnitListName"
        :acceptUnit="acceptDialogEditCheckList"
      ></editDialog>
      <editDialog
        v-if="editFormVisible.editFormMemberVisible"
        @beforeClose="editFormVisible.editFormMemberVisible = false"
        @confirmAddUnitType="
          confirmAddUnitType(
            'memberUnitListId',
            'memberUnitListName',
            'memberUnitList'
          )
        "
        @delectUnitType="
          delectUnitType(
            $event,
            'memberUnitListId',
            'memberUnitListName',
            'memberUnitList'
          )
        "
        @closeDialogForm="closeDialogForm('editFormMemberVisible')"
        @editDelectAuditProcess="editDelectAuditProcess($event, 'memberData')"
        :editData="ediInittData.memberData"
        :editTitle="editTitle.memberTitle"
        :editShowUnitListId="memberUnitListId"
        :editShowUnitListName="memberUnitListName"
        :acceptUnit="acceptDialogEditCheckList"
      ></editDialog>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :header-row-class-name="titleColor"
        :cell-style="cellStyle"
        @select="selectCheckBox"
        @select-all="selectAllCheckBox"
        border
        height="calc(100vh - 240px)"
      >
        <el-table-column
          align="center"
          v-if="moreBtnIsFocus"
          type="selection"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="审核流程名称"
        ></el-table-column>
        <el-table-column
          align="center"
          class="columnEllipsis"
          prop="remark"
          label="流程说明"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="unitList"
          label="填报单位类型"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.unitList
              .map((item) => {
                return item.unitIdString;
              })
              .join()
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="tikuTypeString"
          label="流程类型"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="gmtCreate"
          label="创建时间"
        ></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            {{
            scope.row.status === 0 ? "已停用" : "已启用"
          }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.status == 0"
              class="item"
              effect="dark"
              content="启用"
              placement="top"
            >
              <img
                src="../../../assets/img/qu2.svg"
                @click="changeUsingStatus(scope.$index)"
                style="cursor: pointer"
                class="status"
                @mouseenter="mouseEnterImg('status', scope.$index)"
                @mouseleave="mouseLeaveImg('status', scope.$index)"
              />
            </el-tooltip>

            <el-tooltip
              v-if="scope.row.status == 1"
              class="item"
              effect="dark"
              content="停用"
              placement="top"
            >
              <img
                src="../../../assets/img/status_start.svg"
                @click="changeUsingStatus(scope.$index)"
                style="cursor: pointer"
                class="status"
                @mouseenter="mouseEnterImg('status', scope.$index)"
                @mouseleave="mouseLeaveImg('status', scope.$index)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <img
                src="../../../assets/img/edit2.svg"
                @click="editForm(scope.$index)"
                style="cursor: pointer"
                class="edit"
                @mouseenter="mouseEnterImg('edit', scope.$index)"
                @mouseleave="mouseLeaveImg('edit', scope.$index)"
              />
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <img
                v-if="
                  scope.row.tikuType != '4' &&
                  scope.row.tikuType != '5' &&
                  scope.row.tikuType != '6'
                "
                src="../../../assets/img/del2.svg"
                @click="delectFormData(scope.row)"
                style="cursor: pointer"
                class="del"
                @mouseenter="mouseEnterImg('del', scope.$index)"
                @mouseleave="mouseLeaveImg('del', scope.$index)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="编辑表单申请"
      v-if="dialogEditFormVisible"
      :visible.sync="dialogEditFormVisible"
      :close-on-click-modal="closeClickModal"
    >
      <el-form :model="DetailData">
        <el-form-item required label="流程名称" :label-width="formLabelWidth">
          <el-input
            v-model="DetailData.name"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item required label="流程类型" :label-width="formLabelWidth">
          <el-select
            v-model="DetailData.tikuType"
            @change="changeFormType('DetailData', 'tikuType')"
            clearable
            placeholder="请选择流程类型"
          >
            <el-option
              v-for="item in formTypeData"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="奖励类型" :label-width="formLabelWidth">
          <el-select
            v-model="DetailData.tikuId"
            clearable
            placeholder="请选择奖励类型"
          >
            <el-option
              v-for="item in rewardTypeListData"
              :key="item.id"
              :label="item.registerName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="流程说明"
          :label-width="formLabelWidth"
          width="300px"
        >
          <el-input
            type="textarea"
            resize="none"
            v-model="DetailData.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="position: relative"
          required
          label="填报单位类型"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-button @click="addUnit" class="addUnitButton">
            <span class="crossArrow">+</span>添加填报单位
          </el-button>
          <div
            class="addUnit"
            style="position: absolute; minWidth: 150px; backgroundColor: white"
            v-show="addUnitButton"
          >
            <el-checkbox-group v-model="editCheckList">
              <div v-for="(item, index) in unitType" :key="index">
                <el-checkbox :label="item.id + '&' + item.typeName">{{
                  item.typeName
                }}</el-checkbox>
              </div>
            </el-checkbox-group>
            <el-button
              style="marginbottom: 10px"
              @click="
                confirmAddUnitType(
                  'editCheckListId',
                  'editCheckListName',
                  'editCheckList'
                )
              "
              >确定添加</el-button
            >
          </div>
          <div class="showAddUnit" v-if="acceptEditCheckList.length != 0">
            <span
              class="showUnit"
              v-for="(item, index) in editCheckListName"
              :key="index"
            >
              {{ item }}
              <span
                class="delect-error"
                @click="
                  delectUnitType(
                    index,
                    'editCheckListId',
                    'editCheckListName',
                    'editCheckList'
                  )
                "
                >×</span
              >
            </span>
          </div>
        </el-form-item>
        <el-form-item
          required
          label="审核流程"
          @click="editAddProcess(DetailData.processList.length)"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-button
            class="addProcessButton"
            @click="addProcess('DetailData', DetailData.processList.length)"
          >
            <span class="crossArrow">+</span>添加流程
          </el-button>
          <div class="showProcess" v-if="DetailData.processList.length != 0">
            <span
              class="processBox"
              v-for="(item, index) in DetailData.processList"
              :key="index"
            >
              <span class="processLeft">
                {{ index + 1 }}
                <!-- <span
                  @click="delectAuditProcess(index,'DetailData')"
                  class="el-icon-error"
                ></span>-->
                <img
                  style="width: 22px"
                  src="../../../assets/img/del2.svg"
                  @click="delectAuditProcess(index, 'DetailData')"
                  alt
                />
              </span>
              <div class="boxProcessSelect">
                <el-select
                  class="processSelect"
                  @change="processChange(index)"
                  v-model="DetailData.processList[index].depId"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in unitType"
                    :key="item.id"
                    :label="item.typeName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataApplyForm">确 定</el-button>
      </div>
    </el-dialog>
    <div class="bottomPagination">
      <el-pagination
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, prev, pager, next, sizes, jumper"
        background
        :total="totalLength"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import editDialog from "./editDialog";
import $ from "jquery";
import Cookies from "js-cookie";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  name: "shlc",
  components: {
    editDialog,
  },
  data() {
    return {
      closeClickModal: false, //禁止点击model关闭dialog
      sharedPlatform: {
        noticeBarVisible: false,
      },
      documenttoken: "", // 获取到的token
      fullscreenLoading: false, //导入加载提示
      //车、岗亭、成员是否打开编辑表单
      editFormVisible: {
        editFormCarVisible: false,
        editFormSentryBoxVisible: false,
        editFormMemberVisible: false,
      },
      //车、岗亭、成员初始化数据
      ediInittData: {
        carData: {},
        sentryBoxData: {},
        memberData: {},
      },
      //车、岗亭、成员标题
      editTitle: {
        carTitle: "编辑车表单申请",
        sentryBoxTitle: "编辑岗亭表单申请",
        memberTitle: "编辑成员表单申请",
      },
      //车、岗亭、成员添加填报单位展示
      carUnitList: [],
      carUnitListId: [],
      carUnitListName: [],
      sentryBoxUnitList: [],
      sentryBoxUnitListId: [],
      sentryBoxUnitListName: [],
      memberUnitList: [],
      memberUnitListId: [],
      memberUnitListName: [],
      formTypeData: [], //表单类型
      searchFormTypeDataId: "", //搜索区表单类型id
      // formTypeDataId: "", //表单类型id
      formStatusData: [
        {
          value: "0",
          label: "已停用",
        },
        {
          value: "1",
          label: "已启用",
        },
      ], //表单状态
      formStatusDataValue: "", //表单状态的值
      unitType: [], //单位类型
      unitTypeValue: "", //单位类型的值
      checkList: [], //添加填报单位下的选项
      checkListId: [],
      checkListName: [],
      editCheckList: [], //编辑填报单位下的选项
      editCheckListId: [],
      editCheckListName: [],
      rewardTypeListData: [], //奖励类型列表
      process: [], //审批流程
      processList: [], //传入的审核流程列表
      value: "",
      value1: "",
      tableData: [], //列表数据
      DetailData: [], //根据id获取到的某一条数据
      multipleSelection: [],
      dialogFormVisible: false, //是否打开新增表单
      dialogEditFormVisible: false, //是否打开编辑表单
      id: "", //储存当前编辑表单的id
      totalLength: 0, //数据总条数
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
      addUnitButton: false,
      searchData: {
        currentSize: 10, //当前每页条数
        currentPage: 1, //当前页
        input: "",
        searchTimeDate: "",
      }, //查询参数
      addApplyFormData: {
        name: "",
        rewardType: "", //奖励类型，对应tikuid
        remark: "",
        formType: "", //表单类型，对应tikuType
      }, //新增申请表单数据
      selectionData: [], //复选框被选中的数据
      confirmButton: false, //判断是否点击确定添加按钮
      showProcess: false, //是否显示流程内容
      acceptEditCheckList: [], // 用于接收编辑单位下的选项
      acceptDialogEditCheckList: [], //用于接收弹窗编辑单位下的选项
      //用于表单验证
      rules: {
        name: [{ required: true, message: "请添加填报单位", trigger: "blur" }],
      },
      // “更多”按钮触发
      moreBtnIsFocus: false,
    };
  },
  methods: {
    //条件导出
    conditionExport() {
      const url =
        window.SITE_CONFIG["baseUrl"] +
          `/approve/approveManage/xlsOutputCondition?unitType=${
            this.unitTypeValue
          }&tikuType=${this.searchFormTypeDataId}&startTime=${
            this.searchData.searchTimeDate == ""
              ? ""
              : this.searchData.searchTimeDate[0]
          }&endTime=${
            this.searchData.searchTimeDate == ""
              ? ""
              : this.searchData.searchTimeDate[1]
          }&page=${this.searchData.currentPage}&limit=${
            this.searchData.currentSize
          }&search=${this.searchData.input}&token=${this.$cookie.get("token")}`;
      const request = {
        method: 'get',
        url,
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = '审核流程列表条件导出.xls';
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    //无条件导出
    unConditionExport() {
      let ids = [];
      this.multipleSelection.forEach((v) => {
        ids.push(v.id);
      });
      if (ids.length == 0) {
        this.$alert("请选择数据导出", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        const request = {
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/approve/approveManage/xlsOutputSelect',
          headers: {
            token: this.$cookie.get('token'),
          },
          params: {
            checkedIds: String(ids),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
          if (response.data) {
            const a = document.createElement('a');
            a.target = '_blank';
            a.download = '审核流程列表无条件导出.xls';
            a.href = window.URL.createObjectURL(new Blob([response.data]));
            a.click();
          }
        });
      }
    },
    //导出模板
    downloadtemplate() {
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/approve/approveManage/gettemplate',
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = '流程导入模板.xls';
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      this.fullscreenLoading = true;
    },
    // 上传失败的回调
    handleError(err, file, fileList) {},
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      this.filename = file.name;
      this.search();
      if (file.response.errorData.length == 0) {
        this.$message({
          message: "导入成功!",
          type: "success",
        });
      } else if (file.response.errorData.length > 0) {
        // this.$message.error({
        //   type: "error",
        //   message: `${file.response.msg}`,
        // });
        let str = document.createElement("div");
        file.response.errorData.forEach((item) => {
          let cdiv = document.createElement("div");
          cdiv.innerHTML = item.errorMsg;
          cdiv.style.marginTop = "10px";
          str.appendChild(cdiv);
        });
        this.$message({
          dangerouslyUseHTMLString: true,
          message: `<div>${file.response.msg}</div>${str.innerHTML}`,
          type: "error",
        });
      }
    },
    //设置点击阴影
    setBoxShadow(index) {
      console.log(index);
      let tableBody = document.getElementsByClassName("el-table__body")[0];
      tableBody
        .getElementsByTagName("tr")
        [index].setAttribute(
          "style",
          "box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1)"
        );
      let tableTr = tableBody.getElementsByTagName("tr")[index];
      tableTr
        .getElementsByTagName("td")[0]
        .setAttribute("style", "border-left: 3px solid #0091ff");
      //重新设置悬浮阴影
      $(".el-table__body tr:eq(" + index + ")").hover(function () {
        $(".el-table__body tr:eq(" + index + ")").css(
          "box-shadow",
          "0px 0px 11px 3px rgba(67, 85, 114, 0.1)"
        );
      });
    },
    //取消点击阴影
    cancelBoxShadow(index) {
      let tableBody = document.getElementsByClassName("el-table__body")[0];
      tableBody
        .getElementsByTagName("tr")
        [index].setAttribute("style", "box-shadow: none");
      let tableTr = tableBody.getElementsByTagName("tr")[index];
      tableTr.getElementsByTagName("td")[0].setAttribute("style", "none");
      //重新设置悬浮阴影
      $(".el-table__body tr:eq(" + index + ")").hover(
        function () {
          $(".el-table__body tr:eq(" + index + ")").css(
            "box-shadow",
            "0px 0px 11px 3px rgba(67, 85, 114, 0.1)"
          );
        },
        function () {
          $(".el-table__body tr:eq(" + index + ")").css("box-shadow", "none");
        }
      );
    },
    //被选中
    isCheck(index) {
      document
        .getElementsByClassName("edit")
        [index].setAttribute("src", require("../../../assets/img/edit.svg"));
      if (
        document.getElementsByClassName("del").length != 0
          ? document.getElementsByClassName("del")[index]
            ? true
            : false
          : false
      ) {
        document
          .getElementsByClassName("del")
          [index].setAttribute("src", require("../../../assets/img/del.svg"));
      }
      if (this.tableData[index].status == 0) {
        document
          .getElementsByClassName("status")
          [index].setAttribute("src", require("../../../assets/img/qu3.svg"));
      } else {
        document
          .getElementsByClassName("status")
          [index].setAttribute(
            "src",
            require("../../../assets/img/status_start_active.svg")
          );
      }
    },
    //取消选中
    noCheck(index) {
      document
        .getElementsByClassName("edit")
        [index].setAttribute("src", require("../../../assets/img/edit2.svg"));
      if (
        document.getElementsByClassName("del").length != 0
          ? document.getElementsByClassName("del")[index]
            ? true
            : false
          : false
      ) {
        document
          .getElementsByClassName("del")
          [index].setAttribute("src", require("../../../assets/img/del2.svg"));
      }
      if (this.tableData[index].status == 0) {
        document
          .getElementsByClassName("status")
          [index].setAttribute("src", require("../../../assets/img/qu2.svg"));
      } else {
        document
          .getElementsByClassName("status")
          [index].setAttribute(
            "src",
            require("../../../assets/img/status_start.svg")
          );
      }
    },
    //复选框全选事件
    selectAllCheckBox(selection) {
      this.selectionData = selection;
      for (let index = 0; index < this.tableData.length; index++) {
        if (selection.length == 0) {
          console.log("反选情况");
          this.noCheck(index);
          // this.cancelBoxShadow(index);
        } else {
          this.isCheck(index);
          // this.setBoxShadow(index);
        }
      }
    },
    //复选框被选中事件
    selectCheckBox(selection, row) {
      console.log("复选框被选中", selection, row);
      this.selectionData = selection.slice(0);
      //最后一个复选框被取消的情况
      if (selection.length == 0) {
        this.tableData.forEach((val, index) => {
          if (val.id == row.id) {
            console.log("index", index);
            this.noCheck(index);
            // this.cancelBoxShadow(index);
          }
        });
        // this.noCheck(row);
        return;
      }
      //判断是否被选中
      selection.forEach((v) => {
        if (v.id == row.id) {
          //被选中
          this.tableData.forEach((val, index) => {
            if (val.id == row.id) {
              this.isCheck(index);
              // this.setBoxShadow(index);
            }
          });
        } else {
          //取消选中
          this.tableData.forEach((val, index) => {
            if (val.id == row.id) {
              this.noCheck(index);
              // this.cancelBoxShadow(index);
            }
          });
        }
      });
    },
    //鼠标移入事件
    mouseEnterImg(val, index) {
      //判断数据是否存在，存在则不执行后面代码
      if (this.selectionData) {
        for (let v in this.selectionData) {
          if (this.selectionData[v].id == this.tableData[index].id) {
            return;
          }
        }
      }
      if (val == "edit") {
        document
          .getElementsByClassName("edit")
          [index].setAttribute("src", require("../../../assets/img/edit.svg"));
      }
      if (val == "del") {
        document
          .getElementsByClassName("del")
          [index].setAttribute("src", require("../../../assets/img/del.svg"));
      }
      if (val == "status") {
        if (this.tableData[index].status == 0) {
          document
            .getElementsByClassName("status")
            [index].setAttribute("src", require("../../../assets/img/qu3.svg"));
        } else {
          document
            .getElementsByClassName("status")
            [index].setAttribute(
              "src",
              require("../../../assets/img/status_start_active.svg")
            );
        }
      }
    },
    //鼠标离开事件
    mouseLeaveImg(val, index) {
      //判断数据是否存在，存在则不执行后面代码
      if (this.selectionData) {
        for (let v in this.selectionData) {
          if (this.selectionData[v].id == this.tableData[index].id) {
            return;
          }
        }
      }
      if (val == "edit") {
        document
          .getElementsByClassName("edit")
          [index].setAttribute("src", require("../../../assets/img/edit2.svg"));
      }
      if (val == "del") {
        document
          .getElementsByClassName("del")
          [index].setAttribute("src", require("../../../assets/img/del2.svg"));
      }
      if (val == "status") {
        if (this.tableData[index].status == 0) {
          document
            .getElementsByClassName("status")
            [index].setAttribute("src", require("../../../assets/img/qu2.svg"));
        } else {
          document
            .getElementsByClassName("status")
            [index].setAttribute(
              "src",
              require("../../../assets/img/status_start.svg")
            );
        }
      }
    },

    cellStyle(data) {
      if (data.columnIndex == 6 && data.row.status == 1) {
        return "color: #666";
      }
      if (data.columnIndex == 6 && data.row.status == 0) {
        return "color: #666";
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      if (val == undefined) {
        return;
      }
      this.searchData.currentSize = val;
      this.search(); //更新列表数据
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      if (val == undefined) {
        return;
      }
      this.searchData.currentPage = val;
      this.search(); //更新列表数据
      //切换页数的时候取消所有选中
      for (let index = 0; index < this.tableData.length; index++) {
        this.noCheck(index);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    titleColor({ row, rowIndex }) {
      if (rowIndex === 0) {
        console.log(row);
        return "title-row";
      }
      return "";
    },
    addUnit() {
      this.addUnitButton = !this.addUnitButton;
    },
    //数据列表
    manageList() {
      console.log(this.searchData);
      this.$http({
        url: this.$http.adornUrl(`/approve/approveManage/list`),
        method: "post",
        data: this.$http.adornData({
          page: this.searchData.currentPage,
          limit: this.searchData.currentSize,
          tikuId: "",
          tikuType: "",
          status: "",
          search: "",
          startTime: "",
          endTime: "",
        }),
      }).then((data) => {
        this.tableData = data.data.page.list;
        this.totalLength = data.data.page.totalCount;
      });
    },
    //表单类型
    getFormType() {
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveTikuType/listByModule?module=reward`
        ),
        method: "post",
      }).then((data) => {
        this.formTypeData = data.data.data;
      });
    },
    //填报单位类型跟审核流程选单位
    getUnitType() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platformtype/listAll`),
        method: "get",
      }).then((data) => {
        this.unitType = data.data.data;
      });
    },
    //查询
    search() {
      this.$http({
        url: this.$http.adornUrl(`/approve/approveManage/list`),
        method: "post",
        data: this.$http.adornData({
          page:
            this.searchData.currentPage == undefined
              ? 1
              : this.searchData.currentPage,
          limit:
            this.searchData.currentSize == undefined
              ? 10
              : this.searchData.currentSize,
          tikuId: "",
          // tikuType: this.formTypeData.id,
          tikuType: this.searchFormTypeDataId,
          // status: this.formStatusData.value,
          status: this.formStatusDataValue,
          unitType: this.unitTypeValue,
          // search: this.searchData.input,
          search: this.searchData.input,
          startTime:
            this.searchData.searchTimeDate == null
              ? ""
              : this.searchData.searchTimeDate[0],
          endTime:
            this.searchData.searchTimeDate == null
              ? ""
              : this.searchData.searchTimeDate[1],
        }),
      }).then((data) => {
        this.tableData = data.data.page.list;
        this.totalLength = data.data.page.totalCount;
      });
    },
    //编辑表单
    editForm(index) {
      //先判断点击的是不是人/车/岗亭的编辑
      switch (this.tableData[index].tikuId) {
        case -100:
          this.edit(
            "carUnitListId",
            "carUnitListName",
            "carUnitList",
            `${this.tableData[index].id}`,
            "carData",
            "editFormCarVisible"
          );
          break;
        case -200:
          this.edit(
            "sentryBoxUnitListId",
            "sentryBoxUnitListName",
            "sentryBoxUnitList",
            `${this.tableData[index].id}`,
            "sentryBoxData",
            "editFormSentryBoxVisible"
          );
          break;
        case -300:
          this.edit(
            "memberUnitListId",
            "memberUnitListName",
            "memberUnitList",
            `${this.tableData[index].id}`,
            "memberData",
            "editFormMemberVisible"
          );
          break;
        default:
          //清空，避免上一次值残留
          this.editCheckListId = [];
          this.editCheckListName = [];
          this.editCheckList = [];
          this.id = this.tableData[index].id;
          this.$http({
            url: this.$http.adornUrl(`/approve/approveManage/info/${this.id}`),
            method: "get",
          }).then((data) => {
            // console.log(data.data.data.processList[0].depId);
            this.changeFormType(null, null, data.data.data.tikuType); //根据流程类型获取奖励类型列表
            this.DetailData = data.data.data;
            //主要用于编辑页面展示
            data.data.data.unitList.forEach((v) => {
              this.editCheckList.push(v.unitId + "&" + v.unitIdString);
            });
            this.editCheckList.forEach((v) => {
              this.editCheckListId.push(v.split("&")[0]);
              this.editCheckListName.push(v.split("&")[1]);
            });
            this.acceptEditCheckList = this.editCheckList; //接收填报单位数据用于判断
            this.dialogEditFormVisible = true;
          });
      }
    },
    //点击新增申请表单
    clickAddApplyForm() {
      //清空表单数据
      this.addApplyFormData.name = "";
      this.addApplyFormData.rewardType = "";
      this.addApplyFormData.formType = "";
      (this.addApplyFormData.remark = ""), (this.checkList = []);
      this.checkListName = [];
      this.checkListId = [];
      this.process = [];
      this.showProcess = false; //默认不显示流程内容
      this.confirmButton = false; //默认不显示填报单位类型
      this.dialogFormVisible = true;
    },
    //新增申请表单
    addApplyForm() {
      for (let i = 0; i < this.process.length; i++) {
        this.processList.push({
          depId: this.unitType.filter((item) => {
            return item.id == this.process[i].depId;
          })[0].id,
          depName: this.unitType.filter((item) => {
            return item.id == this.process[i].depId;
          })[0].typeName,
          sortNum: i + 1,
        });
      }
      this.$http({
        url: this.$http.adornUrl(`/approve/approveManage/save`),
        method: "post",
        data: this.$http.adornData({
          name: this.addApplyFormData.name,
          tikuId: this.addApplyFormData.rewardType, //奖励类型
          tikuType: this.addApplyFormData.formType, //表单类型
          remark: this.addApplyFormData.remark,
          unitTypes: this.checkListId,
          processList: this.processList,
        }),
      }).then((data) => {
        Promise.resolve(this.manageList()).then(() => {
          this.dialogFormVisible = false;
        });
      });
    },
    //删除表单数据
    delectFormData(row) {
      let id = row.id;
      this.$confirm("确定要进行[删除]操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (row.status == 1) {
          this.$alert("该流程正在进行中无法删除", "提示", {
            confirmButtonText: "确定",
            callback: (action) => {
              return;
            },
          });
        } else {
          this.$http({
            url: this.$http.adornUrl(`/approve/approveManage/delete`),
            method: "post",
            data: this.$http.adornData({
              ids: [id],
            }),
          }).then((data) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.manageList();
          });
        }
      });
    },
    //更新修改申请表单
    updataApplyForm() {
      let unitId = [];
      // this.DetailData.unitList.forEach(v => {
      //   unitId.push(v.unitId);
      // }),
      this.editCheckListId.forEach((v) => {
        unitId.push(v);
      }),
        this.$http({
          url: this.$http.adornUrl(`/approve/approveManage/update`),
          method: "post",
          data: this.$http.adornData({
            id: this.id,
            name: this.DetailData.name,
            tikuId: this.DetailData.tikuId,
            tikuType: this.DetailData.tikuType,
            remark: this.DetailData.remark,
            unitTypes: unitId,
            // this.DetailData.unitTypes == null ? [] : this.DetailData.unitTypes,
            processList: this.DetailData.processList,
          }),
        }).then((data) => {
          Promise.resolve(this.manageList()).then(() => {
            //更新列表数据
            this.dialogEditFormVisible = false;
          });
        });
    },
    //更改使用状态（已停用--已启用）
    changeUsingStatus(index) {
      let id = this.tableData[index].id;
      let status = this.tableData[index].status;
      if (status == 1) {
        status = 0;
      } else {
        status = 1;
      }
      this.$http({
        url: this.$http.adornUrl(`/approve/approveManage/updateStatus`),
        method: "post",
        data: this.$http.adornData({
          id,
          status,
        }),
      }).then((data) => {
        if (data && data.data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
          });
          //将图标初始化
          if (this.selectionData) {
            for (let index = 0; index < this.tableData.length; index++) {
              this.noCheck(index);
            }
            this.selectionData = [];
          }
          this.manageList(); //更新列表数据
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //确认新增申请表单
    confirmAddApplyForm() {
      this.addApplyForm();
    },
    //表单申请添加填报单位
    selectUnitType(val) {},
    //确定添加单位类型
    confirmAddUnitType(id, name, list) {
      this[id] = [];
      this[name] = [];
      this[list].forEach((v) => {
        this[id].push(v.split("&")[0]);
        this[name].push(v.split("&")[1]);
      });
      this.addUnitButton = !this.addUnitButton;
      this.confirmButton = true;
      this.acceptEditCheckList = this[list];
      this.acceptDialogEditCheckList = this[list];
    },
    //删除单位类型
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
      this.acceptEditCheckList = this[list]; //用于接收做判断
      this.acceptDialogEditCheckList = this[list]; //用于接收做判断
    },
    //根据表单类型id获取奖励类型列表
    changeFormType(name, property, id) {
      if (id) {
        this.$http({
          url: this.$http.adornUrl(
            `/approve/approveTikuType/getTikuListByType?type=${id}`
          ),
          method: "get",
        }).then((data) => {
          this.rewardTypeListData = data.data.data;
        });
        return;
      }
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveTikuType/getTikuListByType?type=${this[name][property]}`
        ),
        method: "get",
      }).then((data) => {
        this.rewardTypeListData = data.data.data;
      });
    },
    //删除审核流程
    delectAuditProcess(index, val) {
      if (val == "DetailData") {
        this[val].processList.splice(index, 1);
        return;
      }
      this[val].splice(index, 1);
      if (this[val].length == 0) {
        this.showProcess = false;
      }
    },
    //车、岗亭、成员删除审核流程
    editDelectAuditProcess(index, val) {
      this.ediInittData[val].processList.splice(index, 1);
    },
    //新增添加流程
    addProcess(val, len) {
      if (val == "DetailData") {
        this[val].processList.push({
          depId: "",
          depName: "",
          sortNum: len + 1,
        });
        return;
      }
      this[val].push({
        depId: "",
        depName: "",
        sortNum: "",
      });
      this.showProcess = true;
      console.log(this[val]);
    },
    //编辑流程进行修改
    processChange(index) {
      console.log(this.DetailData.processList[index].depId);
      this.DetailData.processList[index].depName = this.unitType.filter((v) => {
        return this.DetailData.processList[index].depId == v.id;
      })[0].typeName;
      console.log(this.DetailData.processList);
    },
    //车、岗亭、成员编辑页面
    edit(id, name, list, params, val, dialog) {
      this[id] = [];
      this[name] = [];
      this[list] = [];
      this.$http({
        url: this.$http.adornUrl(`/approve/approveManage/info/${params}`),
        method: "get",
      }).then((data) => {
        this.ediInittData[val] = data.data.data;
        this.acceptDialogEditCheckList = data.data.data; //用于接收填报单位数据进行判断
        //主要用于编辑页面展示
        data.data.data.unitList.forEach((v) => {
          this[list].push(v.unitId + "&" + v.unitIdString);
        });
        this[list].forEach((v) => {
          this[id].push(v.split("&")[0]);
          this[name].push(v.split("&")[1]);
        });
        this.editFormVisible[dialog] = true;
      });
    },
    //关闭车、岗亭、成员窗口
    closeDialogForm(dialog) {
      this.editFormVisible[dialog] = false;
    },
    /**
     * @method
     * @desc 点击更多里的选项，链接到对应已经做好的但隐藏的按钮
     * @param {number} option 按钮类型
     */
    moreClick(option) {
      switch (option) {
        case 1:
          this.$refs.exportTemplateBtn.$el.click();
          break;
        case 2:
          this.$refs.conditionExportBtn.$el.click();
          break;
        case 3:
          this.$refs.unconditionExportBtn.$el.click();
          break;
        case 4:
          this.$refs.importButton.$el.click();
          break;
      }
    },
  },
  created() {
    // this.handleSizeChange(); //获取当前每页条数
    // this.handleCurrentChange(); //获取当前页
    this.getFormType(); //获取表单类型数据
    this.manageList(); //获取数据列表
    this.getUnitType(); //获取填报单位类型跟审批流程选单位
    this.documenttoken = `${httpaddress}/approve/approveManage/xlsInput?token=${this.$cookie.get(
      "token"
    )}`;
  },
};
</script>

<style scoped lang="less">
* {
  font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
    Roboto-Regular, SourceHanSansCN-Regular;
}
.shlc {
  background-color: #ffffff;
  height: calc(100vh - 112px);
  overflow: hidden;
  border-radius: 4px;
  .header {
    padding: 10px;
    // height: 56px;
    display: flex;
    justify-content: flex-end;
    // line-height: 36px;
    .more-button-container {
      margin-left: 2px;
      display: inline-block;
      position: relative;
      width: 80px;
      height: 36px;
      line-height: 36px;
      border: 1px solid #dddee1;
      border-radius: 4px;
      // font-size: 16px;
      text-align: center;
      color: #666666;
      user-select: none;
      // margin-left: 10px;
      cursor: pointer;
      .more-button-content {
        position: absolute;
        top: 50px;
        right: 0;
        width: 160px;
        z-index: 1;
        transform: scaleY(0);
        transform-origin: center top;
        transition: transform 0.5s;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        .more-button-content-item-header {
          color: #999999;
          text-align: left;
          padding: 21px 0 15px 20px;
          line-height: 14px;
          cursor: auto;
        }
        .more-button-content-item {
          text-align: left;
          padding: 13px 0 15px 20px;
          line-height: 14px;
          &:hover {
            background: rgba(0, 145, 255, 0.1);
          }
        }
        .more-button-content-line {
          border-bottom: 1px solid #e6e6e6;
          width: 132px;
          height: 13px;
          margin: 0 auto;
          margin-bottom: 14px;
          cursor: auto;
        }
      }
      i {
        transition: transform 0.5s;
      }
      &.more-button-unfocus:hover {
        border-color: #b4b4b4;
      }
      &.more-button-focus {
        border-color: #0091ff;
        i {
          transform: rotate(-180deg);
        }
        .more-button-content {
          z-index: 1;
          transform: scaleY(1);
        }
      }
    }
    .header_title {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      border-left: 3px solid #0091ff;
      padding-left: 10px;
      height: 16px;
      line-height: 16px;
      display: inline-block;
      margin: auto auto auto 0;
      min-width: 109px;
    }
    .el-input {
      width: 300px;
    }
    /deep/ .el-dialog__header {
      background-color: #f1f4f6;
    }
    .search {
      background-color: #0091ff;
    }
    /deep/ .el-dialog {
      // /deep/ .el-dialog__body {
      //   border-bottom: 1px solid #f2f2f2;
      // }
      /deep/ .process_explain {
        /deep/ .el-textarea__inner {
          // min-height: 100px !important;
        }
      }
    }
  }
  .content {
    // height: 730px;
    height: calc(100vh - 240px);
    .el-table {
      height: 100%;
      -webkit-box-shadow: none;
      box-shadow: none;
      font-size: 14px;
      /deep/ .el-table__body {
        /deep/ td {
          border-left: none;
          border-right: none;
        }
        tr {
          background: none;
        }
        tr:hover {
          box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
          td:nth-child(1) {
            border-left: 3px solid #0091ff;
          }
        }
      }
      /deep/ .el-table__row {
        // font-family: PingFangSC-Regular, PingFang SC;
        // font-weight: normal;
        .cell {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      /deep/.title-row th {
        background: #f1f5ff;
        text-align: center;
      }
    }
  }
  /deep/ .el-dialog__body {
    border-bottom: 1px solid #f2f2f2;
  }
  .addUnit {
    border: 1px solid #ccc;
    padding: 0 20px;
    z-index: 10000;
  }
  .crossArrow {
    color: #3f92fe;
    font-size: 16px;
    font-weight: bold;
    margin-right: 4px;
  }
  .showAddUnit {
    margin-left: -20px;
    .showUnit {
      display: inline-block;
      height: 30px;
      padding: 0 5px;
      line-height: 28px;
      background-color: #fafafa;
      color: #9a9a9a;
      text-align: center;
      margin: 20px 0 0 20px;
      position: relative;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-sizing: border-box;
      .delect-error {
        display: inline-block;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
        color: #979797;
        margin: 0 4px;
      }
    }
  }
  .addUnitButton {
    padding: 10px;
  }
  .addProcessButton {
    border: rgb(34, 34, 34) solid #d9d9d9;
    padding: 10px;
  }
  .showProcess {
    min-height: 75px;
    position: relative;
    padding-bottom: 20px;
    .processBox {
      display: inline-block;
      position: relative;
      width: 160px;
      height: 43px;
      line-height: 41px;
      border: 1px solid #d9d9d9;
      margin-top: 20px;
      margin-right: 60px;
      border-radius: 4px;
      background-color: #f1f6ff;
      .processSelect {
        width: 98px;
        position: absolute;
        top: -1px;
        left: 30px;
      }
      img {
        position: absolute;
        right: 4px;
        top: 10px;
        z-index: 1000;
        cursor: pointer;
      }
      .processLeft {
        display: inline-block;
        width: 25px;
        height: 41px;
        color: white;
        text-align: center;
        background-color: #9bc4fc;
      }
    }
    /deep/ .el-input__inner {
      height: 33px;
    }
  }
  .addApplyForm {
    /deep/ .el-form-item__label {
      color: #555555;
    }
  }
  .bottomPagination {
    position: relative;
  }
  /deep/ .el-pagination {
    height: 72px;
    position: absolute;
    right: 20px;
    top: 5px;
    // margin-right: 20px;
    // margin-top: 20px;
  }
  .boxProcessSelect {
    /deep/ .el-icon-arrow-up::before {
      margin-top: 6px;
    }
  }
  /deep/ .el-dialog__header {
    background-color: #f1f4f6;
    padding: 20px;
  }
  /deep/ .el-dialog__footer {
    padding: 20px;
  }
}
</style>

