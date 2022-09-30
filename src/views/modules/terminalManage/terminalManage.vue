/**
 * @author chenbin
 * @date 2020-11-04
 * @desc 会场终端管理页面
 */
<template>
  <div>
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-click="handleTreeClick"
      title="会场终端管理"
      :dateSelect="false"
      :searchSetting="{
        width: '280px',
        placeholder: '请输入设备名称/号码',
      }"
      :deleteSelectedConfig="{ api: '/meeting/meetingCluster/delete' }"
      :tableRequest="tableRequest"
    >
      <template #middle__operation__button>
        <sv-button type="primary" @click="openAddOrEditDialog('add')"
          >新增终端</sv-button
        >
        <!-- <sv-button type="primary" @click="updateTerminal()">同步终端</sv-button> -->
        <!-- <sv-button type="primary" @click="updateGroup()">同步分组</sv-button> -->
        <sv-button type="primary" @click="confirmUpdate()">同步终端</sv-button>
      </template>
      <template #middle__table>
        <el-table-column header-align="center" align="center" label="设备名称">
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="终端号码">
          <template slot-scope="scope">
            <!-- <sv-table-tooltip :content="scope.row.codeNum" /> -->
            {{ scope.row.codeNum }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="所属分组">
          <template slot-scope="scope">
            {{ scope.row.groupIdName }}
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="位置">
          <template slot-scope="scope">
            {{ scope.row.place }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="170px"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view', 'edit', 'delete']"
              @view="openViewDetailDialog(scope.row)"
              @edit="openAddOrEditDialog('edit', scope.row.id)"
              @delete="
                deleteIds = [scope.row.id];
                $refs.delete_hint.visible = true;
              "
            ></sv-table-operation>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 新增/编辑弹窗 -->
    <AddOrEditDialog
      ref="AddOrEditDialog"
      :currentNode="currentNode"
      @refresh="$refs.template.getTableList(tableRequest)"
    />
    <!-- 查看详情弹窗 -->
    <ViewDetailDialog ref="ViewDetailDialog" />
    <!-- 选择分组弹窗 -->
    <ChoiceGroup ref="ChoiceGroup" @choiceGroup="confirmUpdate"></ChoiceGroup>
    <!-- 删除提示弹窗 -->
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="handleDelete(deleteIds)"
    />
    <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败" />
  </div>
</template>

<script>
// 新增、编辑弹窗
import AddOrEditDialog from "./AddOrEditDialog/AddOrEditDialog.vue";
// 查看详情弹窗
import ViewDetailDialog from "./ViewDetailDialog/ViewDetailDialog.vue";
// 选择分组弹窗
import ChoiceGroup from "./AddOrEditDialog/ChoiceGroup.vue";
export default {
  components: {
    AddOrEditDialog,
    ViewDetailDialog,
    ChoiceGroup,
  },
  data() {
    return {
      // 树形接口
      treeSetting: {
        api: "/meeting/meetingTerminalGroup/listTree",
        edit: {
          add: "/meeting/meetingTerminalGroup/save",
          update: "/meeting/meetingTerminalGroup/update",
          delete: "/meeting/meetingTerminalGroup/delete",
        },
        // edit: false,
      },
      // 表格数据接口
      tableRequest: {
        api: "/meeting/meetingTerminal/list",
        params: {
          groupIds: [],
        },
      },
      // 准备删除的数据的id数组
      deleteIds: [],
      groupId: "",
      user: "",
      password: "",
      smcUrl: "",
      currentNode:''
    };
  },
  methods: {
    test(sth) {
      console.log("test", sth);
    },
    /**
     * @method
     * @desc 获取表格数据
     */
    getTableList() {
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @method
     * @desc 点击树形，获取表格数据
     */
    handleTreeClick(data, tabIndex) {
      this.currentNode=data
      this.tableRequest.params.groupIds = data ? [data.id] : [];
      this.getTableList();
    },
    /**
     * @method
     * @desc 打开查看详情弹窗
     * @param {Object} row 表格该行的数据
     */
    openViewDetailDialog(row) {
      this.$refs.ViewDetailDialog.init(row.id);
    },
    /**
     * @method
     * @desc 打开新增/编辑分类点弹窗
     * @param {String} type 弹窗类型：add新增、edit编辑
     * @param {Object} id 编辑时该行的数据的id
     */
    openAddOrEditDialog(type, id) {
      this.$refs.AddOrEditDialog.init(type, id);
    },
    /**
     * @method
     * @desc 删除数据
     * @param 需要删除的数据的id数组
     */
    handleDelete(ids) {
      const request = {
        method: "post",
        url: "/meeting/meetingTerminal/delete",
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code == 0) {
            // 提交成功后，刷新表格
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            console.log("删除失败！错误信息：【\n", response, "\n】");
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          console.log("删除失败！错误信息：【\n", error, "\n】");
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
    updateTerminal() {
      this.$refs.ChoiceGroup.init();
    },
    confirmUpdate(id) {
      // console.log("所选分组id", id);
      // this.groupId = id;
      var sendMsg = [];
      this.getSmcUrl();
      this.getSmcPassword();
      this.getSmcUser();
      // data: that.$http.adornData(id)
      setTimeout(() => {
        this.sendWS();
      }, 1000);
    },
    // 发送websocket
    sendWS() {
      var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      var sendMsg = {
        group: "0",
        type: "Update_VideoTerminal",
        ip: this.smcUrl,
        user: this.user,
        pwd: this.password,
      };

      // sendMsg.platformId = data[0].platformId;
      // sendMsg.type = "CreateConf";
      console.log("发送data", sendMsg, "json", JSON.stringify(sendMsg));
      ws.onopen = function () {
        ws.send(JSON.stringify(sendMsg));
        console.log("WebSocket发送的内容：", sendMsg);
        console.log("WebSocket地址：", ws);
      };
      ws.onmessage = function (evt) {
        console.log("WebSocket接收到的数据：", evt);
      };
      ws.onerror = function (evt) {
        console.log("WebSocket错误信息：", evt);
      };
    },
    updateGroup() {
      this.getSmcUrl();
      this.getSmcUser();
      this.getSmcPassword();
      setTimeout(() => {
        var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
        var sendMsg = {
          group: "0",
          type: "Update_VideoTerminalGroup",
          ip: this.smcUrl,
          user: this.user,
          pwd: this.password,
        };

        // sendMsg.platformId = data[0].platformId;
        // sendMsg.type = "CreateConf";
        console.log("发送data", sendMsg, "json", JSON.stringify(sendMsg));
        ws.onopen = function () {
          ws.send(JSON.stringify(sendMsg));
          console.log("WebSocket发送的内容：", sendMsg);
          console.log("WebSocket地址：", ws);
        };
        ws.onmessage = function (evt) {
          console.log("WebSocket接收到的数据：", evt);
        };
        ws.onerror = function (evt) {
          console.log("WebSocket错误信息：", evt);
        };
      }, 1000);
    },
    getSmcUrl() {
      this.$http({
        url: this.$http.adornUrl(`/sys/config/infoByKey?key=SMC_URL`),
        method: "get",
        param: this.$http.adornParams({
          key: "SMC_URL",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("cscscsc123131", data);
          this.smcUrl = data.config.paramValue;
        }
      });
    },
    getSmcUser() {
      this.$http({
        url: this.$http.adornUrl(`/sys/config/infoByKey?key=SMC_USER`),
        method: "get",
        param: this.$http.adornParams({
          key: "SMC_USER",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.user = data.config.paramValue;
        }
      });
    },
    getSmcPassword() {
      this.$http({
        url: this.$http.adornUrl(`/meeting/meetingTerminal/getEncryption`),
        method: "get",
        param: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.password = data.config.paramValue;
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.terminal-manage {
  /deep/ .icon {
    font-size: 12px;
    color: #16c88b;
    background: #e8f9f4;
    border-radius: 5px;
    padding: 2px 10px;
    user-select: none;
    &.yellow {
      color: #f8b10c;
      background: #fff8ea;
    }
    &.red {
      color: #f94e36;
      background: #ffefed;
    }
    &.grey {
      color: #000000;
      background: #e6e6e6;
    }
    &.blue {
      color: #368bf9;
      background: #ecf5fc;
    }
    &.pink {
      color: #ff8171;
      background: #ffffff;
      border: 1px solid #ff8171;
    }
  }
}
</style>