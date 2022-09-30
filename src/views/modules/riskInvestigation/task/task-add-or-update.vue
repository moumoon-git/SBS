<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
      @closed="clearDialog"
      top="70px"
      style="margin-left: 120px"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        label-width="100px"
      >
        <!-- @keyup.enter.native="dataFormSubmit()" -->
        <el-row :gutter="20" class="left">
          <!-- 左侧 -->
          <el-col :span="12">
            <el-form-item label="巡查区域:" prop="groupIdName">
              <el-input
                placeholder="巡查区域"
                :readonly="type == 'show'"
                @focus="newArea = true"
                v-model="dataForm.groupIdName"
                :disabled="!isselectshow"
              ></el-input>
            </el-form-item>
            <el-form-item label="任务名称:" prop="name">
              <el-input
                :disabled="!isselectshow"
                placeholder="任务名称"
                v-model="dataForm.name"
                :readonly="type == 'show'"
              ></el-input>
            </el-form-item>
            <el-form-item label="巡查说明:" prop="remark">
              <el-input
                :disabled="!isselectshow"
                :readonly="type == 'show'"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                v-model="dataForm.remark"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 右侧 -->
          <el-col :span="12">
            <el-row :gutter="3">
              <el-col :span="12">
                <el-form-item
                  size="large"
                  label="巡查部门:"
                  prop="patrolDepString"
                >
                  <el-input
                    :disabled="!isselectshow"
                    v-model="dataForm.patrolDepString"
                    :readonly="type == 'show'"
                  >
                    <el-button
                      v-if="isselectshow"
                      slot="append"
                      @click="getPatrolDep"
                      :disabled="!isselectshow"
                      >选择</el-button
                    >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  size="large"
                  label="负责人:"
                  prop="patrolContactorString"
                >
                  <el-input
                    :disabled="!isselectshow"
                    v-model="dataForm.patrolContactorString"
                    :readonly="type == 'show'"
                  >
                    <el-button
                      v-if="isselectshow"
                      slot="append"
                      @click="getPatrolContactor"
                      :disabled="!isselectshow"
                      >选择</el-button
                    >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item
                  size="large"
                  label="处置部门:"
                  prop="handleDepString"
                >
                  <el-input
                    :disabled="!isselectshow"
                    v-model="dataForm.handleDepString"
                    :readonly="type == 'show'"
                  >
                    <el-button
                      v-if="isselectshow"
                      slot="append"
                      @click="getHandleDep"
                      :disabled="!isselectshow"
                      >选择</el-button
                    >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  size="large"
                  label="负责人:"
                  prop="handleContactorString"
                >
                  <el-input
                    :disabled="!isselectshow"
                    v-model="dataForm.handleContactorString"
                    :readonly="type == 'show'"
                  >
                    <el-button
                      v-if="isselectshow"
                      slot="append"
                      @click="getHandleContactor"
                      :disabled="!isselectshow"
                      >选择</el-button
                    >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="巡查地点:" prop="place" size="large">
              <el-input
                :disabled="!isselectshow"
                placeholder="巡查地点"
                v-model="dataForm.place"
                :readonly="type == 'show'"
              >
                <el-button
                  slot="append"
                  @click="handleLocation"
                  type="text"
                  icon="el-icon-location-outline"
                  :disabled="!isselectshow"
                ></el-button>
              </el-input>
            </el-form-item>
            <el-form-item size="large" label="巡查周期:" prop="period">
              <el-radio-group
                v-if="isselectshow"
                v-model="dataForm.period"
                fill="#409EFF"
                :disabled="type == 'show'"
              >
                <el-radio-button label="1" style="margin-right: 10px" border
                  >每日</el-radio-button
                >
                <el-radio-button
                  label="2"
                  style="margin-right: 10px; border-left: 1px solid #dcdfe6"
                  border
                  >每周</el-radio-button
                >
                <el-radio-button
                  label="3"
                  style="margin-right: 10px; border-left: 1px solid #dcdfe6"
                  border
                  >每月</el-radio-button
                >
                <el-radio-button
                  label="4"
                  style="border-left: 1px solid #dcdfe6"
                  >每年</el-radio-button
                >
              </el-radio-group>
              <el-radio-group
                v-if="!isselectshow"
                v-model="dataForm.period"
                :disabled="type == 'show'"
              >
                <el-radio-button v-if="dataForm.period == 1" label="1" border
                  >每日</el-radio-button
                >
                <el-radio-button v-if="dataForm.period == 2" label="2" border
                  >每周</el-radio-button
                >
                <el-radio-button v-if="dataForm.period == 3" label="3" border
                  >每月</el-radio-button
                >
                <el-radio-button v-if="dataForm.period == 4" label="4"
                  >每年</el-radio-button
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4" class="taskTree">
            <el-aside width="265px" style="margin-left: 20px">
              <TaskTree
                :isAdd="isAdd"
                :list="treeList"
                :listProps="treeProps"
                @handleNodeClick="handleNodeClick"
                @setCheckedIds="setCheckedIds"
                :Treeexpansion="Treeexpansion"
                :type="buttonVisible"
                :dataSelectedCount="dataSelectedCount"
                @searchTree="searchTree"
                @getAll="getAll"
                @getTreeList="getTreeList"
                :showOperationButton="type"
              ></TaskTree>
            </el-aside>
          </el-col>

          <el-col
            :span="19"
            style="
              border: 1px solid #e9ecf1;
              height: 360px !important;
              overflow: auto;
              margin-left: 51px;
            "
          >
            <el-form
              :inline="true"
              :model="searchDataForm"
              @keyup.enter.native="getDataList()"
              style="position: relative; margin: 12px 0 0 10px"
            >
              <el-form-item>
                <el-input
                  style="width: 350px"
                  v-model="searchDataForm.searchData"
                  placeholder="请输入检查项目名称、内容或巡查部门关键字"
                  clearable
                  @clear="getDataList"
                  suffix-icon="el-icon-search"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <el-button class="save" type="primary" @click="searchResult()"
                  >搜索</el-button
                >
                <span
                  @click="getChoicedData()"
                  :style="{
                    color: choiceDataHighLight ? '#0091FF' : '#000000',
                    cursor: 'pointer',
                  }"
                >
                  <span style="margin-left: 15px; font-size: 15px"
                    >已选择:</span
                  >
                  <span style="font-weight: bold; font-size: 15px"
                    >{{ dataSelectedCount }}项</span
                  >
                </span>
              </el-form-item>
            </el-form>

            <el-table
              :data="dataList"
              v-loading="dataListLoading"
              ref="dataListRef"
              @select="pushDataId"
              @select-all="selectAll"
              style="
                width: 100%;
                -webkit-box-shadow: initial;
                box-shadow: initial;
              "
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
                :selectable="selectable"
                v-if="isselectshow"
              ></el-table-column>
              <el-table-column
                prop="name"
                header-align="center"
                align="center"
                width="100"
                label="检查项目"
              ></el-table-column>
              <el-table-column
                prop="content"
                header-align="center"
                align="center"
                label="检查内容"
              ></el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
              v-if="type != 'show'"
              @size-change="sizeChangeDataHandle"
              @current-change="currentChangeDataHandle"
              :current-page="currDataPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="dataPageSize"
              :total="dataTotalCount"
              layout="total, sizes, prev, pager, next, jumper"
              style="margin: 10px 10px 10px 0"
            ></el-pagination>
            <!--分页-->
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
      <!-- 地图弹窗 -->
      <LocationDialog ref="LocationDialogRef" />
    </el-dialog>

    <!-- 巡查区域 -->
    <el-dialog
      title="请选择巡查区域"
      :visible.sync="newArea"
      width="30%"
      append-to-body
    >
      <el-tree
        :data="areaTreeList"
        :props="areaTreeProps"
        node-key="id"
        ref="areaTree"
        @current-change="areaTreeCurrentChangeHandle"
        :auto-expand-parent="true"
        :highlight-current="true"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newArea = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="submitArea" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 部门选项 -->
    <el-dialog
      title="请选择部门"
      :visible.sync="newgroups"
      width="30%"
      append-to-body
    >
      <el-tree
        :data="choiceTreeList"
        :props="choiceTreeProps"
        node-key="id"
        ref="eventTypeTree"
        @current-change="choiceTreeCurrentChangeHandle"
        :auto-expand-parent="true"
        :highlight-current="true"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newgroups = false" plain size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitChoice" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 负责人选项 -->
    <el-dialog
      title="请选择负责人"
      :visible.sync="newContactors"
      width="40%"
      append-to-body
    >
      <el-table
        :data="contactorsData"
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="name" label="名字"></el-table-column>
        <el-table-column prop="mobile1" label="电话"></el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="currPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <!--分页-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="newContactors = false" plain size="small"
          >取 消</el-button
        >
        <el-button @click="submitContactor" size="small" plain>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import TaskTree from "./task-tree";
import GroupSelect from "@/views/common/groupselect";
import $ from "jquery";
import LocationDialog from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';

export default {
  components: {
    GroupSelect,
    TaskTree,
    LocationDialog,
  },
  props:['currentNode'],
  data() {
    let self = this;

    return {
      isAdd: false, //是否显示搜素框新增按钮
      isChoice: false,
      treeIndex: "",
      treeData: [],
      choiceDataHighLight: false,
      isselectshow: true,
      datanewlist: [], //保存请求后得到的结果
      //巡查区域选择
      areaTreeList: [],
      areaTreeProps: {
        label: "name",
        children: "children",
      },
      //区域弹出框
      newArea: false,
      areaId: "",
      areaName: "",
      //部门选择弹出框
      newgroups: false,
      //负责人弹出框
      newContactors: false,
      //负责人数据
      contactorsData: [],
      choiceTreeList: [],
      choiceTreeProps: {
        label: "name",
        children: "children",
      },
      choiceId: "",
      choiceName: "",
      choiceType: "",
      selectedNode: [],
      contactorType: "",
      currentRow: "",
      buttonVisible: false,
      visible: false,
      dialogTitle: "",
      type: "",
      //选择负责人分页
      // 当前页数
      currPage: 1,
      // 每页显示条目个数
      pageSize: 10,
      // 总条目数
      totalCount: 0,
      //选择项目分页
      currDataPage: 1,
      dataPageSize: 5,
      dataTotalCount: 0,
      //提交数据
      dataForm: {
        id: "",
        name: "",
        groupId: "",
        groupIdName: "",
        remark: "",
        patrolDep: "",
        patrolDepString: "",
        handleDep: "",
        handleDepString: "",
        patrolContactor: "",
        patrolContactorString: "",
        handleContactor: "",
        handleContactorString: "",
        place: "",
        period: "",
        longitude: "",
        latitude: "",
        address: "",
        investigationTime: "",
        groupIds: [],
        cgcsLatitude: '',
        cgcsLongitude: ''
      },
      dataRule: {
        groupIdName: [
          { required: true, message: "巡查区域不能为空", trigger: "change" },
        ],
        name: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
        patrolDepString: [
          { required: true, message: "巡查部门不能为空", trigger: "change" },
        ],
        patrolContactorString: [
          { required: true, message: "巡查负责人不能为空", trigger: "change" },
        ],
        handleDepString: [
          { required: true, message: "处置部门不能为空", trigger: "change" },
        ],
        handleContactorString: [
          { required: true, message: "处置负责人不能为空", trigger: "change" },
        ],
        place: [
          { required: true, message: "巡查地点不能为空", trigger: "change" },
        ],
        period: [
          { required: true, message: "巡查周期不能为空", trigger: "blur" },
        ],
      },
      searchDataForm: {
        searchData: "",
      },
      searchTreeName: "",
      treeList: [],
      treeProps: {
        children: "children",
        label: "name",
      },
      treeId: "",
      checkedIds: [],
      checkedNodes: [],
      Treeexpansion: true,
      dataListLoading: false,
      dataList: [],
      showDataList: [],
      //勾选检查项目ID
      dataIds: [],
      //总共选择几项
      dataSelectedCount: 0,
      //查看树的id数组
      showTreeData: [],
      //查看框数据
      showData: [],
      // 高德地图开始
      markers: [
        [113.3245904, 23.2066805],
        [113.323623, 23.106341],
        [113.325399, 23.106156],
      ],
      searchOption: {
        city: "广州",
        citylimit: false,
      },
      plugin: [
        {
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                // console.log(result)
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  // self.lng=self.$cookie.get("longitude")
                  // self.lat=self.$cookie.get("latitude")
                  self.center = [self.lng, self.lat];
                  self.mapCenter = [self.lng, self.lat];
                  self.position = [self.lng, self.lat];
                  var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all",
                  });
                  geocoder.getAddress([self.lng, self.lat], function (
                    status,
                    result
                  ) {
                    if (status === "complete" && result.info === "OK") {
                      if (result && result.regeocode) {
                        console.log(result.regeocode);
                        self.address = result.regeocode.formattedAddress;

                        // self.$nextTick()
                      }
                    }
                  });
                  self.$nextTick();
                }
              });
            },
          },
        },
      ],
      lng: 0,
      lat: 0,
      count: 1,
      slotStyle: {
        padding: "2px 8px",
        background: "#eee",
        color: "#333",
        border: "1px solid #aaa",
      },
      zoom: 12,
      center: [113.3245904, 23.1066805],
      address: "",
      loaded: false,
      // 标记点的位置
      mapCenter: [113.3245904, 23.1066805],
      position: [113.3245904, 23.1066805],
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.position = [lng, lat];
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all",
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                // console.log(self)

                // self.$nextTick()
              }
            }
          });
        },
      },
      // 地图弹窗
      dialogVisible: false,
      //高德地图结束
    };
  },
  computed: {},
  mounted() {


    this.getChoiceData();
    this.getArea();
    this.getDataList();
  },
  watch: {
    deep: true,
    immediate: true,
  },

  methods: {
    handleLocation() {
      this.$refs.LocationDialogRef.open({
        longitude: this.dataForm.longitude,
        latitude: this.dataForm.latitude,
        address: this.dataForm.place,
        cgcsLongitude: this.dataForm.cgcsLongitude,
        cgcsLatitude: this.dataForm.cgcsLatitude
      }).then(({ longitude, latitude, address, cgcsLongitude, cgcsLatitude }) => {
        this.dataForm.longitude = longitude;
        this.dataForm.latitude = latitude;
        this.dataForm.place = address;
        this.dataForm.cgcsLatitude = cgcsLatitude;
        this.dataForm.cgcsLongitude = cgcsLongitude;
      });
    },
    //点击已选择
    getChoicedData() {
      this.isChoice = !this.isChoice;
      let dataArray = [];
      if (!this.isChoice) {
        this.choiceDataHighLight = false;
        this.checkedIds = [];
        this.getDataList();
      } else {
        // this.checkedIds = [];
        // this.getDataList();
        this.choiceDataHighLight = true;
        this.dataIds.forEach((item) => {
          let i = this.dataList.findIndex((item2) => item2.id == item);
          if (i > -1) {
            dataArray.push(this.dataList[i]);
          }
        });
        this.dataList = dataArray;
        this.dataList.forEach((row) => {
          this.dataIds.forEach((id) => {
            if (row.id == id) {
              this.$nextTick(() => {
                this.$refs.dataListRef.toggleRowSelection(row, true);
              });
            }
          });
        });
        console.log("已选择的数据", this.dataList);
      }
    },
    //巡查区域树形点击
    areaTreeCurrentChangeHandle(data, node) {
      this.areaId = "";
      this.areaName = "";
      console.log("树形", data);
      this.areaId = data.id;
      this.areaName = data.name;
    },
    submitArea() {
      this.newArea = false;
      this.dataForm.groupId = this.areaId;
      this.dataForm.groupIdName = this.areaName;
    },
    //巡查区域
    getArea() {
      this.$http({
        url: this.$http.adornUrl(
          "/investigation/investigationTaskGroup/listTree"
        ),
        method: "get",
        params: this.$http.adornParams({
          name: "",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.areaTreeList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //巡查部门选择
    getPatrolDep() {
      this.choiceType = "patrol";
      this.newgroups = true;
    },
    //处置部门选择
    getHandleDep() {
      this.choiceType = "handle";
      this.newgroups = true;
    },
    // 巡查部门负责人选择
    getPatrolContactor() {
      this.contactorType = "patrolContactor";
      // console.log("12222222222222", this.dataForm.patrolDep);
      if (this.dataForm.patrolDep != "") {
        this.selectedNode[0] = this.dataForm.patrolDep;
        this.getChoiceContactor();
        this.newContactors = true;
      } else {
        this.$message.error("请选择部门");
      }
    },
    //处置部门负责人选择
    getHandleContactor() {
      this.contactorType = "handleContactor";
      if (this.dataForm.handleDep != "") {
        this.selectedNode[0] = this.dataForm.handleDep;
        this.getChoiceContactor();
        this.newContactors = true;
      } else {
        this.$message.error("请选择部门");
      }
    },

    //获取部门
    getChoiceData() {
      this.$http({
        url: this.$http.adornUrl(`/mail/mailgroup/list`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.choiceTreeList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //获取负责人
    getChoiceContactor() {
      this.$http({
        url: this.$http.adornUrl("/mail/mailcontactor/list"),
        method: "POST",
        data: this.$http.adornData({
          groupId: this.selectedNode,
          limit: this.pageSize,
          page: 1,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.totalCount = data.data.totalCount;
          this.currPage = data.data.currPage;
          this.pageSize = data.data.pageSize;
          this.contactorsData = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //点击选择部门树
    choiceTreeCurrentChangeHandle(data, node) {
      // console.log("部门数", data);
      this.choiceId = data.id;
      this.choiceName = data.name;
      function findChilden(data, list) {
        list.push(data.id);
        let children = data.children;
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list);
          });
        }
      }
      this.selectedNode = [];
      findChilden(data, (this.selectedNode = []));
    },

    //提交选择
    submitChoice() {
      this.newgroups = false;
      if (this.choiceType == "patrol") {
        this.dataForm.patrolDepString = this.choiceName;
        this.dataForm.patrolDep = this.choiceId;
      } else {
        this.dataForm.handleDepString = this.choiceName;
        this.dataForm.handleDep = this.choiceId;
      }
    },
    handleCurrentChange(val) {
      // console.log("11111111111111111111111111222222221", val);
      this.currentRow = val;
    },
    //提交负责人
    submitContactor() {
      this.newContactors = false;
      if (this.contactorType == "patrolContactor") {
        this.dataForm.patrolContactor = this.currentRow.id;
        this.dataForm.patrolContactorString = this.currentRow.name;
      } else {
        this.dataForm.handleContactor = this.currentRow.id;
        this.dataForm.handleContactorString = this.currentRow.name;
      }
    },
    getNodeChildren(data) {
      console.log("nodenodenode", data);
      if (data != null) {
        data.forEach((d) => {
          // console.log("231111", this.checkedIds);
          this.checkedIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getNodeChildren(d.children);
          }
        });
      }
    },
    handleNodeClick(obj) {
      // console.log("点击节点", obj);
      this.checkedIds = [];
      this.checkedIds[0] = obj.id;
      if (obj.children != null && obj.children.length > 0) {
        // console.log(obj.children, "objchildren");
        this.getNodeChildren(obj.children);
      }
      //树形数据
      this.treeId = obj;
      this.getDataList();
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes;
    },
    // 获取数据列表
    getDataList() {
      // console.log("this.type:", this.type);
      console.log("比较数据为：", this.showDataList);
      this.dataListLoading = true;
      if (this.type == "show") {
        this.dataPageSize = 9999999;
      }
      this.$http({
        url: this.$http.adornUrl("/investigation/investigationInfor/list"),
        method: "post",
        data: this.$http.adornData({
          page: this.currDataPage,
          limit: this.dataPageSize,
          search: this.searchDataForm.searchData,
          groupIds: this.checkedIds,
        }),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.datanewlist = data.page.list;
            this.dataList = data.page.list;
            this.dataList.forEach((row) => {
              this.dataIds.forEach((id) => {
                if (row.id == id) {
                  this.$nextTick(() => {
                    this.$refs.dataListRef.toggleRowSelection(row, true);
                  });
                }
              });
            });
            this.dataTotalCount = data.page.totalCount;
            this.showData = this.dataList;
            // console.log("datanewlist:", this.datanewlist);
            // console.log("dataaaaaa", this.showData, this.dataList);
            // console.log("type:", this.type);
            // 查看的数据
            // this.showDataList = [{ id: 1, id: 2, id: 3, id: 4 }];
            if (this.type == "show") {
              let dataIndexArr = [];
              let index = "";
              let dataIndex = "";
              // console.log("this.showData:", this.showData);
              // console.log("长度为：", this.dataList.length);
              console.log(
                "dataList为",
                this.dataList,
                "dataList",
                this.showDataList
              );
              if (this.dataList.length > 0) {
                this.dataList.forEach((item1) => {
                  //查看里是否有此数据id
                  // index = this.showDataList.findIndex(item => item.id === row.id);
                  index = this.showDataList.findIndex(
                    (item2) => item2.id == item1.id
                  );
                  console.log("index:", index);
                  if (index == -1) {
                    dataIndex = this.showData.findIndex(
                      (item3) => item3.id == item1.id
                    );
                    console.log("dataIndex为", dataIndex);
                    dataIndexArr.push(dataIndex);
                  }
                  // console.log("index1111111111", index, dataIndex);
                  // if (index === -1) {
                  //   console.log("删除");
                  //   //此数据在哪个位置
                  //   dataIndex = this.showData.findIndex(
                  //     item => item.id === row.id
                  //   );
                  //   this.showData.splice(dataIndex, 1);
                  // }
                  // console.log("改变后的showdata为：", this.showData);
                });
                // console.log("dataIndexArr:", dataIndexArr);
                for (var i = dataIndexArr.length - 1; i >= 0; i--) {
                  this.showData.splice(dataIndexArr[i], 1);
                }
                this.dataList = this.showData;
                console.log("改变后的数据为：", this.dataList);

                this.dataTotalCount = this.dataList.length;
              }
            }
          } else {
            this.dataList = [];
            this.$message.error(data.msg);
          }
          this.dataListLoading = false;
        })
        .catch((err) => {
          this.dataListLoading = false;
        });
    },
    //查看树
    // if (d.groupCount == 0 && this.type == "show") {
    //   // let index = listData.findIndex(item => item.id == "8421");
    //   let treeIndex = data.findIndex(item => item.id == d.id);
    //   console.log("index", this.showTreeData, data, d, treeIndex);
    //   data.splice(treeIndex, 1);
    // }
    showTree() {
      if (this.treeList != null && this.treeList.length > 0) {
        // console.log("12345", this.treeList);
        this.treeList.forEach((d) => {
          // console.log("1234", d);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d.children);
          }
          if (d.groupCount == 0 && this.type == "show") {
            let cIndex = this.treeList.findIndex((item) => (item.id = d.id));
            // console.log("123", cIndex, this.treeList);
            this.treeList.splice(cIndex, 1);
          }
        });
      }
    },
    getChildren(data) {
      // console.log("222222222222222children", data);
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d);
          }
          if (d.groupCount == 0 && this.type == "show") {
            let cIndex = data.findIndex((item) => (item.id = d.id));
            data.splice(cIndex, 1);
          }
        });
      }
    },
    //获取树形列表
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl(
          `${
            this.type == "add"
              ? "/investigation/investigationGroup/listTree"
              : "/investigation/investigationTask/listTree"
          }`
        ),
        method: "get",
        params: this.$http.adornParams({
          taskId: this.dataForm.id,
          name: this.searchTreeName,
        }),
      }).then(({ data }) => {
        this.treeData = data.data;
        this.makeCount(this.treeData);
        // if (this.type == "show") {
        //   this.showTree();
        // }
      });
    },
    //搜索树
    searchTree(name) {
      this.searchTreeName = name;
      this.getTreeList();
    },
    init(id, type) {
      //先清除数据
      this.clearDataForm();
      this.getArea();
      this.dataForm.id = id;
      this.type = type;
      this.getDataList();
      this.$nextTick(() => {
        this.$refs.dataListRef.clearSelection();
      });
      this.getTreeList();
      //新增
      switch (type) {
        // type==='add' ? '新增' : '修改'
        case "add":
          this.visible = true;
          this.dialogTitle = "新增巡查任务";
          if(this.currentNode)
             { if(this.currentNode.id==0)
             {
this.dataForm.groupId = ''
          this.dataForm.groupIdName=''
             }
             else{
               this.dataForm.groupId = this.currentNode.id
          this.dataForm.groupIdName=this.currentNode.name}}

          break;
        case "show":
          this.dialogTitle = "查看巡查任务";
          this.isselectshow = false;
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationTask/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {

              this.dataForm.name = data.data.name;
              this.dataForm.groupId = data.data.groupId;
              this.dataForm.groupIdName = data.data.groupIdName;
              this.dataForm.remark = data.data.remark;
              this.dataForm.handleDepString = data.data.handleDepString;
              this.dataForm.patrolDepString = data.data.patrolDepString;
              this.dataForm.patrolContactorString =
                data.data.patrolContactorString;
              this.dataForm.handleContactorString =
                data.data.handleContactorString;
              this.dataForm.place = data.data.place;
              this.dataForm.period = data.data.period;
              this.dataForm.longitude = data.data.longitude;
              this.dataForm.latitude = data.data.latitude;
              this.dataForm.investigationTime = data.data.investigationTime;
              this.showDataList = data.data.investigationInforEntities;
              data.data.investigationInforEntities.forEach((d) => {
                this.dataForm.groupIds.push(d.id);
              });
              this.dataIds = this.dataForm.groupIds;
              console.log(
                "查看后的showDataList数据111111",
                this.showDataList,
                "总数据",
                this.dataList,
                "ids",
                this.dataForm.groupIds
              );
              this.getDataList();
              this.dataList.forEach((row) => {
                this.dataForm.groupIds.forEach((id) => {
                  if (row.id == id) {
                    this.$nextTick(() => {
                      this.$refs.dataListRef.toggleRowSelection(row, true);
                    });
                  }
                });
              });
              this.dataSelectedCount = this.dataForm.groupIds.length;
              // this.getDataList();
            } else {
              this.$message.error(data.msg);
            }
          });

          break;
        case "update":
          //修改
          this.dialogTitle = "修改巡查任务";

          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationTask/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.data.name;
              this.dataForm.groupId = data.data.groupId;
              this.dataForm.groupIdName = data.data.groupIdName;
              this.dataForm.remark = data.data.remark;
              this.dataForm.handleDepString = data.data.handleDepString;
              this.dataForm.patrolDepString = data.data.patrolDepString;
              this.dataForm.patrolContactorString =
                data.data.patrolContactorString;
              this.dataForm.handleContactorString =
                data.data.handleContactorString;
              this.dataForm.place = data.data.place;
              this.dataForm.period = data.data.period;
              this.dataForm.longitude = data.data.longitude;
              this.dataForm.latitude = data.data.latitude;
              this.dataForm.investigationTime = data.data.investigationTime;
              this.showDataList = data.data.investigationInforEntities;
              data.data.investigationInforEntities.forEach((d) => {
                this.dataForm.groupIds.push(d.id);
              });
              this.dataIds = this.dataForm.groupIds;
              this.dataList.forEach((row) => {
                this.dataForm.groupIds.forEach((id) => {
                  if (row.id == id) {
                    this.$nextTick(() => {
                      this.$refs.dataListRef.toggleRowSelection(row, true);
                    });
                  }
                });
              });
              this.dataSelectedCount = this.dataForm.groupIds.length;
            } else {
              this.$message.error(data.msg);
            }
          });

          break;
        default:
        // console.log("type异常......")
      }
      this.visible = true;
    },
    selectable(row, index) {
      if (row.type === "system") {
        return false;
      } else {
        return true;
      }
    },
    //勾选全部数据
    selectAll(rows) {
      // console.log(rows, "11111", this.dataIds);
      this.dataList.forEach((row) => {
        if (
          $(":checkbox").is(":checked") &&
          this.dataIds.indexOf(row.id) == -1
        ) {
          this.dataIds.push(row.id);
          this.findNodeIndex(this.treeData, row.groupId, 1);
          // console.log("勾选数据", this.dataIds);
        }
        if (rows.length == 0 && this.dataIds.indexOf(row.id) != -1) {
          let index = this.dataIds.indexOf(row.id);
          this.dataIds.splice(index, 1);
          this.findNodeIndex(this.treeData, row.groupId, -1);
          // console.log("去除数据", this.dataIds);
        }
        this.dataForm.groupIds = this.dataIds;
        this.dataSelectedCount = this.dataForm.groupIds.length;
        // this.$refs.dataTable.toggleRowSelection(row, true);
      });
    },
    //循环拼接数量显示
    makeCount(data) {
      // this.showTreeData = data;
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          // console.log("循环数据", d);
          if (d.name.indexOf("(") != -1) {
            d.name = d.name.substring(0, d.name.indexOf("("));
          }

          if (d.groupCount != 0) {
            // console.log("111111111111111111111");
            d.name = d.name + "   (" + d.groupCount + ")";
          } else {
            d.name = d.name + "   (" + "0" + ")";
          }
          if (d.children != null && d.children.length > 0) {
            this.makeCount(d.children);
          }
        });
      }
      this.treeList = data;
    },
    findNodeIndex(data, id, num) {
      if (data != null && data.length > 0) {
        this.treeIndex = data.findIndex((item) => item.id == id);
        if (this.treeIndex == -1) {
          data.forEach((d) => {
            if (d.children != null && d.children.length > 0) {
              this.findNodeIndex(d.children, id, num);
            }
          });
        } else {
          console.log("节点信息", data[this.treeIndex]);
          data[this.treeIndex].groupCount += num;
          if (data[this.treeIndex].parentId != 0) {
            this.findNodeIndex(
              this.treeData,
              data[this.treeIndex].parentId,
              num
            );
          }

          this.makeCount(this.treeData);
        }
      }
    },
    //勾选数据
    pushDataId(selection, row) {
      console.log("勾选数据", selection, row, this.treeData);
      if ($(":checkbox").is(":checked") && this.dataIds.indexOf(row.id) == -1) {
        this.dataIds.push(row.id);
        this.findNodeIndex(this.treeData, row.groupId, 1);
        // let i = this.treeData.findIndex((item) => (item.id = row.groupId));
        // if (this.treeIndex >= 0) {
        //   this.treeData[this.treeIndex].groupCount += 1;
        //   this.makeCount(this.treeData);
        // }
        console.log("树形数据", this.treeId);
        if (this.treeId.id == row.id) {
        }
      } else {
        let index = this.dataIds.indexOf(row.id);
        this.dataIds.splice(index, 1);
        this.findNodeIndex(this.treeData, row.groupId, -1);
      }
      this.dataForm.groupIds = this.dataIds;
      this.dataSelectedCount = this.dataForm.groupIds.length;
    },
    clearDataForm() {
      // console.log('clearDataForm')
      // this.dataForm.terminal = "";
      this.dataForm.name = "";
      this.dataForm.groupId = "";
      this.dataForm.groupIdName = "";
      this.dataForm.remark = "";
      this.dataForm.handleDepString = "";
      this.dataForm.patrolDepString = "";
      this.dataForm.patrolContactorString = "";
      this.dataForm.handleContactorString = "";
      this.dataForm.place = "";
      this.dataForm.period = "";
      this.dataForm.longitude = "";
      this.dataForm.latitude = "";
      this.dataForm.investigationTime = "";
      this.dataForm.groupIds = [];
      this.dataSelectedCount = 0;
      this.dataIds = [];
      this.checkedIds = [];
    },
    //表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationTask/${
                !this.dataForm.id ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              groupId: this.dataForm.groupId,
              remark: this.dataForm.remark,
              patrolDep: this.dataForm.patrolDep,
              handleDep: this.dataForm.handleDep,
              patrolContactor: this.dataForm.patrolContactor,
              handleContactor: this.dataForm.handleContactor,
              patrolDepString: this.dataForm.patrolDepString,
              handleDepString: this.dataForm.handleDepString,
              patrolContactorString: this.dataForm.patrolContactorString,
              handleContactorString: this.dataForm.handleContactorString,
              place: this.dataForm.place,
              period: this.dataForm.period,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              investigationTime: this.dataForm.investigationTime,
              groupIds: this.dataForm.groupIds,
              period: this.dataForm.period,
              cgcsLongitude: this.dataForm.cgcsLongitude,
              cgcsLatitude: this.dataForm.cgcsLatitude
              // groupIdName: this.dataForm.groupIdName
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.visible = false;
              this.$emit("refreshDataList");
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    //检查项目搜索
    searchResult() {
      this.getDataList();
    },
    // 检查项目每页显示条目个数改变时会触发
    sizeChangeDataHandle(val) {
      this.dataPageSize = val;
      this.getDataList();
    },
    // 检查项目当前页数改变时会触发
    currentChangeDataHandle(val) {
      this.currDataPage = val;
      this.getDataList();
    },
    // 每页显示条目个数改变时会触发
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.currPage = 1;
      if (this.contactorType == "patrolContactor") {
        this.selectedNode[0] = this.dataForm.patrolDep;
      } else {
        this.selectedNode[0] = this.dataForm.handleDep;
      }
      // search: "",
      //     platformId: String(this.sharedPlatform.platformId)
      this.$http({
        url: this.$http.adornUrl("/mail/mailcontactor/list"),
        method: "POST",
        data: this.$http.adornParams(
          {
            limit: this.pageSize,
            page: this.currPage,
            groupId: this.selectedNode,
          },
          false
        ),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.contactorsData = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 当前页数改变时会触发
    currentChangeHandle(val) {
      this.currPage = val;
      if (this.contactorType == "patrolContactor") {
        this.selectedNode[0] = this.dataForm.patrolDep;
      } else {
        this.selectedNode[0] = this.dataForm.handleDep;
      }
      this.$http({
        url: this.$http.adornUrl("/mail/mailcontactor/list"),
        method: "POST",
        data: this.$http.adornParams(
          {
            limit: this.pageSize,
            page: this.currPage,
            groupId: this.selectedNode,
          },
          false
        ),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.contactorsData = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 地图搜索回调事件
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach((poi) => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.center = [poi.lng, poi.lat];
          this.lng = poi.lng;
          this.lat = poi.lat;
          this.address = pois[0].name;
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length,
        };
        this.position = [center.lng, center.lat];
        this.center = [center.lng, center.lat];
      }
    },
    // 地图事件
    mounted() {

      loadPromise.then(() => {
        // console.log('-----')
        this.map = new AMap.Map("amap-demo1", {
          center: [121.59996, 31.197646],
          zoom: 12,
        });
        AMapUI.loadUI(["overlay/SimpleMarker"], (SimpleMarker) => {
          const marker = new SimpleMarker({
            iconLabel: "A",
            iconStyle: "red",
            map: this.map,
            position: this.map.getCenter(),
          });
        });
      });
    },
    // 地图提交
    LongitudeandLatitude() {
      // 经度赋值
      this.dataForm.longitude = this.lng;
      // 纬度赋值
      this.dataForm.latitude = this.lat;
      console.log("---------------", this.address);
      this.dataForm.place = this.address;
      this.dialogVisible = false;
    },
    clearDialog() {
      this.isselectshow = true;
      this.$refs["dataForm"].resetFields();
      this.searchDataForm.searchData = '';
    },
    getAll() {
      this.checkedIds = [];
      this.getDataList();
    },
  },
};
</script>

<style lang="less">
.left {
  .el-icon-location-outline {
    margin-left: 12px;
    color: blue;
  }
}
.search-box {
  border: 1px solid #666666;
  margin: 0px 0px 15px 0px;
}
.el-dialog {
  border-radius: 5px;
  /deep/ .el-dialog__header {
    background-color: #f1f4f6;
    border-radius: 5px 5px 0 0;
  }
}
// height: calc(100vh - 300px);
.taskTree {
  .el-aside {
    color: #333;
    // text-align: center;
    height: 360px;
    border: 1px solid #ebeef5;
    // margin-top: 1px;
    padding-top: 10px;
    // margin-left: 20px;
    .selectAllColor {
      padding-left: 45px;
    }
    .paddingLeft {
      padding-left: 45px;
    }
  }
  .el-button:focus,
  .el-button:hover {
    border-color: #269cf3;
  }
}
.el-input.is-disabled .el-input__inner {
  color: #666666;
}
.el-textarea.is-disabled .el-textarea__inner {
  color: #666666;
}
.el-radio-button__orig-radio:disabled:checked + .el-radio-button__inner {
  color: #666666;
}
</style>
