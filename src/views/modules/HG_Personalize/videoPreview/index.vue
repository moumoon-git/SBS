<template>
  <div class="playView">
    <el-header
      style="height: 80px; padding: 24px 16px; clear: both"
      class="left"
    >
      <div>
        <el-form
          :model="dataForm"
          @keyup.enter.native="getDataList()"
          style="min-width: 1500px"
        >
          <el-select
            v-model="cameraType"
            filterable
            clearableI
            @change="handleChangePlatform()"
            placeholder="请选择相机分类"
            size="small"
          >
            <el-option
              v-for="item in cameraSelect"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>

          <el-input
            v-model="dataForm.key"
            style="width: 200px"
            placeholder="请输入相机名称搜索"
            clearable
            size="small"
          ></el-input>
          <el-button @click="getDataList()" type="primary" size="small"
            >查询</el-button
          >
        </el-form>
      </div>

      <div style="width: 100%; display: flex; padding: 32px 0 0 0">
        <div class="tableClass">
          <div style>
            <el-table
              :data="dataList"
              @selection-change="selectionChangeHandle"
              border
              v-loading="dataListLoading"
              style
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
              ></el-table-column>
              <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="相机名称"
              ></el-table-column>
              <el-table-column
                prop="longitude"
                header-align="center"
                align="center"
                label="经度"
              ></el-table-column>
              <el-table-column
                prop="latitude"
                header-align="center"
                align="center"
                label="纬度"
              ></el-table-column>
              <el-table-column
                prop="cameraType"
                header-align="center"
                align="center"
                label="摄像头类型"
              ></el-table-column>
              <el-table-column
                prop="indexCode"
                header-align="center"
                align="center"
                label="设备编号"
              ></el-table-column>
              <el-table-column
                prop="crossingId"
                header-align="center"
                align="center"
                label="卡口编码"
              ></el-table-column>
              <el-table-column
                prop="businessCode"
                header-align="center"
                align="center"
                label="业务编码"
              ></el-table-column>
              <el-table-column
                prop="hardwareCode"
                header-align="center"
                align="center"
                label="硬件编码"
              ></el-table-column>
              <el-table-column
                prop="statusName"
                header-align="center"
                align="center"
                label="状态"
                width="70"
              ></el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                width="60"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="监控"
                    placement="top"
                  >
                    <span
                      class="button-monitor"
                      @click="openMonitor(scope.row)"
                    ></span>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="screenshot">
          <videoPreviewTreeCrud
            ref="resoureteamTreeCrud"
            @close="resoureteamTreeCrudVisible = false"
            :reportParams="reportParams"
            :selectInvitedToJoinList="selectInvitedToJoinList"
            @invitedToJoin="contactViewHandle"
          ></videoPreviewTreeCrud>
        </div>
      </div>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px"
      ></el-pagination>
    </el-header>
    <MonitorDialog ref="MonitorDialog" />
    <!-- 新增联系人视图 -->
    <linkman-draggable
      ref="commonLink"
      v-show="showcommonLink"
      @OnchildByValue="handelLinkdata"
    ></linkman-draggable>
  </div>
</template>

<script>
import AddOrUpdate from "./riskcamera-add-or-update";
import MonitorDialog from "./MonitorDialog.vue";
import videoPreviewGrouptreeCrud from "./videoPreview-groupTree-crud";
import videoPreviewTreeCrud from "./videoPreview-tree-crud";
import LinkmanDraggable from "../../risk/riskvehiclealarm/LinkmanDraggable ";

var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      invitedToJoinList: [],
      selectInvitedToJoinList: [],
      reportParams: "",
      showcommonLink: false,
      cameraData2: [],
      // 总条目数
      totalCount: 0,
      indexCode: "",
      resoureteamTreeCrudVisible: false,
      statusData: [
        { value: 1, label: "启用" },
        { value: 0, label: "未启用" },
      ],
      cameraSelect: [],
      cameraType: "", //相机类型
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      dataForm: {
        key: "",
        enclosure: "",
        fileName: "",
      },
    };
  },
  components: {
    AddOrUpdate,
    MonitorDialog,
    videoPreviewGrouptreeCrud,
    videoPreviewTreeCrud,
    LinkmanDraggable,
  },
  created() {
    this.getCameraType();
    this.getDataList();
  },
  methods: {
    // 表单复选框勾选ID
    selectionChangeHandle(dataIds) {
      this.dataIds = dataIds;
    },
    // 选择联系人视图
    contactViewHandle() {
      this.showcommonLink = true;
      this.$refs.commonLink.isShowAll = false;
      this.$nextTick(() => {
        this.$refs.commonLink.handleAddContacts(
          "/mail/mailgroup/list",
          "请选择"
        );
      });
    },
    // 选择联系人数据
    handelLinkdata({ linkman }) {
      this.selectInvitedToJoinList = [];
      for (var i = 0; i < linkman.length; i++) {
        this.selectInvitedToJoinList.push({
          name: linkman[i].name,
          openId: linkman[i].openId,
          id: linkman[i].id,
        });
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/risk/riskcamera/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          platformId: this.sharePlatformId,
          cameraType: this.cameraType,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.page.list.forEach((item, index, arr) => {
            if (item.status) {
              arr[index]["statusName"] = this.statusData.find(
                (items) => items.value === item.status
              ).label;
            } else {
              arr[index]["statusName"] = "未知";
            }
          });
          this.dataList = data.page.list;
          if (this.dataList.length > 0) {
            this.dataList.map((v) => {
              switch (v.cameraType) {
                case -100:
                  v.cameraType = "人脸";
                  break;
                case -200:
                  v.cameraType = "人群聚集";
                  break;
                case -300:
                  v.cameraType = "高点";
                  break;
                case -400:
                  v.cameraType = "市场";
                  break;
                case -500:
                  v.cameraType = "垃圾";
                  break;
                default:
                  v.cameraType = "";
              }
            });
          }
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 选择小区
    handleChangePlatform() {
      if (
        (this.sharePlatformId != null && this.sharePlatformId != "") ||
        this.cameraType != null
      ) {
        this.getDataList();
      } else {
        this.sharePlatformId = "";
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    /**
     * @method
     * @desc 打开监控视频弹窗
     */
    openMonitor(row) {
      let indexCode = "";
      if (
        row.indexCodeList &&
        row.indexCodeList.length &&
        row.indexCodeList[0]
      ) {
        indexCode = row.indexCodeList[0];
      } else {
        indexCode = row.indexCode.split(",")[0];
      }
      this.$refs.MonitorDialog.init(indexCode);
    },
    /**
     * @description: 获取相机类型
     * @param {*}
     * @return {*}
     */
    getCameraType() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=VIDEO_CAMERA_TYPE`
        ),
        method: "get",
        params: this.$http.adornParams({}),
      }).then((data) => {
        console.log("相机类型", data);
        this.cameraSelect = data.data.data;
        this.cameraSelect.unshift({
          code: "",
          name: "全部",
        });
      });
    },
  },
};
</script>
<style lang="less">
  .tableClass {
    padding: 3px;
    width: 82%;
    min-width: 540px;
    // 监控按钮及悬浮情况
    .button-monitor {
      display: inline-block;
      width: 18px;
      height: 19px;
      cursor: pointer;
      margin-top: 10px;
      background: no-repeat
        url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTggMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+55uR5o6nPC90aXRsZT4KICAgIDxnIGlkPSLpgJrnlKjlm77moIciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLooajmoLzpgJrnlKjlm77moIciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02ODAuMDAwMDAwLCAtOTguMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2Ni4wMDAwMDAsIDMwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjUuMDAwMDAwLCA2OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTUzLjQwNjY2NywxMC43Nzc5NDQzIEw1NTEuNzAzMzMzLDEwLjc3Nzk0NDMgTDU1MS43MDMzMzMsOC42NDg3Nzc2NyBMNTUwLDguMzM0NDcyMTIgTDU1MCwxNS4xOTQ0NDQyIEw1NTEuNzAzMzMzLDE0LjY0Mjg4ODcgTDU1MS43MDMzMzMsMTIuMjc2NDcyMSBMNTU0LjQ2MTExMSwxMi4yNzY0NzIxIEw1NTUuOTIxMTExLDEwLjMwNTQ3MjEgTDU1My45NzQ0NDQsOS4yNzk0MTY1NSBMNTUzLjQwNjY2NywxMC43Nzc5NDQzIFogTTU2Mi4yNDc3NzgsMTEuMTcxMzMzMiBMNTY2LjIyMjIyMiw4LjcyNTgzMzIzIEw1NTMuODkzMzMzLDEgTDU1Mi40MzMzMzMsMSBMNTUwLjQ4NjY2NywzLjkxNzk3MjE4IEw1NTAuNDg2NjY3LDQuOTQ0MDI3NzIgTDU2MS4zNTU1NTUsMTEuMjUyNDQ0MyBMNTYyLjI0Nzc3OCwxMS4xNzEzMzMyIFogTTU2MC43ODc3NzgsMTEuNzIyODg4NyBMNTUxLjQ2LDUuODg4OTcyMTYgTDU1MC40ODY2NjcsNi45MTUwMjc3IEw1NjEuMzU1NTU1LDEzLjIyMzQ0NDMgTDU2Mi4zMjg4ODksMTMuMjIzNDQ0MyBMNTYyLjgxNTU1NSwxMi43NDg5NDQzIEw1NjMuMzAyMjIyLDExLjMyOTQ5OTkgTDU2MS44NDIyMjIsMTIuMzU1NTU1NCBDNTYxLjE5MTMwNSwxMS44ODEwNTU0IDU2MC43ODc3NzgsMTEuNzIyODg4NyA1NjAuNzg3Nzc4LDExLjcyMjg4ODcgTDU2MC43ODc3NzgsMTEuNzIyODg4NyBaIiBpZD0i55uR5o6nIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);
      &:hover {
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTggMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+55uR5o6nPC90aXRsZT4KICAgIDxnIGlkPSLpgJrnlKjlm77moIciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLooajmoLzpgJrnlKjlm77moIciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02ODAuMDAwMDAwLCAtMTM0LjAwMDAwMCkiIGZpbGw9IiMwMDkxRkYiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY2LjAwMDAwMCwgMzAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uE5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NS4wMDAwMDAsIDEwNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTUzLjQwNjY2NywxMC43Nzc5NDQzIEw1NTEuNzAzMzMzLDEwLjc3Nzk0NDMgTDU1MS43MDMzMzMsOC42NDg3Nzc2NyBMNTUwLDguMzM0NDcyMTIgTDU1MCwxNS4xOTQ0NDQyIEw1NTEuNzAzMzMzLDE0LjY0Mjg4ODcgTDU1MS43MDMzMzMsMTIuMjc2NDcyMSBMNTU0LjQ2MTExMSwxMi4yNzY0NzIxIEw1NTUuOTIxMTExLDEwLjMwNTQ3MjEgTDU1My45NzQ0NDQsOS4yNzk0MTY1NSBMNTUzLjQwNjY2NywxMC43Nzc5NDQzIFogTTU2Mi4yNDc3NzgsMTEuMTcxMzMzMiBMNTY2LjIyMjIyMiw4LjcyNTgzMzIzIEw1NTMuODkzMzMzLDEgTDU1Mi40MzMzMzMsMSBMNTUwLjQ4NjY2NywzLjkxNzk3MjE4IEw1NTAuNDg2NjY3LDQuOTQ0MDI3NzIgTDU2MS4zNTU1NTUsMTEuMjUyNDQ0MyBMNTYyLjI0Nzc3OCwxMS4xNzEzMzMyIFogTTU2MC43ODc3NzgsMTEuNzIyODg4NyBMNTUxLjQ2LDUuODg4OTcyMTYgTDU1MC40ODY2NjcsNi45MTUwMjc3IEw1NjEuMzU1NTU1LDEzLjIyMzQ0NDMgTDU2Mi4zMjg4ODksMTMuMjIzNDQ0MyBMNTYyLjgxNTU1NSwxMi43NDg5NDQzIEw1NjMuMzAyMjIyLDExLjMyOTQ5OTkgTDU2MS44NDIyMjIsMTIuMzU1NTU1NCBDNTYxLjE5MTMwNSwxMS44ODEwNTU0IDU2MC43ODc3NzgsMTEuNzIyODg4NyA1NjAuNzg3Nzc4LDExLjcyMjg4ODcgTDU2MC43ODc3NzgsMTEuNzIyODg4NyBaIiBpZD0i55uR5o6nIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==);
      }
    }
  }
</style>
