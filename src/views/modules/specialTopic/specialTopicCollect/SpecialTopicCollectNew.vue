<!--
 * @Author: yaoweixin
 * @Date: 2020-09-15 16:26:39
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-21 14:36:14
 * @Description: 专题收集更新
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicCollect\SpecialTopicCollectNew.vue
-->
<template>
  <div>
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-click="handleTreeClick"
      @tree-node-delete="handleNodeOperation"
      @tree-node-edit="handleNodeOperation"
      @tree-node-add="handleNodeOperation"
      :tableRequest="tableRequest"
      :searchSetting="{
        width:'200px',
        placeholder:'请输入采集内容关键字'
        }"
      title="专题采集"
    >
      <!-- 中间栏-头部-按钮 -->
      <template #middle__operation__button>
        <sv-button type="primary" @click="addTemplate">新增</sv-button>
      </template>
      <!-- 统计部分 -->
      <template #middle__statistics>
        <div class="leftContent">
          <div class="selectContainer">
            <select v-model="selectId">
              <option
                v-for="(item, index) in selectList"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
          <div class="remarkContainer">
            <div class="alreadyData">
              <div class="alreadyDataTitle">已登记数据:</div>
              <div class="number">{{ tableLength }}条</div>
            </div>
            <div class="deadLine">
              <div class="deadLineTitle">截止时间：</div>
              <div class="time">{{ endTime }}</div>
            </div>
            <div class="restTime">
              <div class="timeTitle">剩余时间：</div>
              <div class="day" v-if="restTime >= 0">{{ restTime }}天</div>
              <div class="day" v-else>已截止</div>
            </div>
            <div class="state">
              <div class="stateTitle">状态：</div>
              <div class="going">{{ templateStatus }}</div>
            </div>
          </div>
        </div>
      </template>
      <!-- 中间栏-表格内容 -->
      <template #middle__table>
        <el-table-column
          v-for="(value, key) in tableHeaderList[0]"
          :key="key"
          :prop="key"
          :label="key"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="registerTime"
          label="登记时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">{{
            scope.row.status == "1" ? "已上报" : "被驳回"
          }}</template>
        </el-table-column>
        <el-table-column
          prop="platform"
          label="来源"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view', 'edit', 'delete']"
              @view="handleLook(scope.row)"
              @edit="handleEdit(scope.row)"
              @delete="deleteIds = [scope.row.registerId];
                $refs.delete_hint.visible = true;"
            ></sv-table-operation>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 新增登记的弹框 -->
    <AddRegisterDialog
      ref="addRegisterDialog"
      @refresh="refreshList"
    ></AddRegisterDialog>
    <!-- 编辑弹框 -->
    <EditRegisterDialog ref="editRegisterDialog" @refreshList="refreshList"></EditRegisterDialog>
    <!--  查看弹框 -->
    <LookRegisterMessageDialog
      ref="lookRegisterDialog"
      @submitReject="submitReject"
    ></LookRegisterMessageDialog>
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
import axios from "axios";
import EditRegisterDialog from "./components/EditRegisterDialog.vue";
import AddRegisterDialog from "./components/addRegisterDialog.vue";
import LookRegisterMessageDialog from "./components/lookRegisterMessageDialog.vue";
export default {
  name: "specialTopicCollectTemplateNew",
  data() {
    return {
      platformId: -1,//平台id
      deleteIds: [],//删除某一行的id
      searchSetting:{
        width:'400px',
        placeholder:''
        },
      searchKeyWord: [],//搜索框关键字
      tableCopyList: [], //表格的复制数据
      treeSetting: {
        tab: [],
        api: ["/fk/fkTemplateGroup/list"],
        edit: false
      },
      tableRequest: {
        api: "/fk/fkTemplateInstance/list",
        params: {
          taskId: 0
        }
      },
      treeIdArr: [], //节点及其子节点
      selectList: [], //选择列表
      selectId: 0, //被选中的id
      tableLength: 0, //已登记数据
      endTime: 0, //截止时间
      restTime: 0, //剩余时间
      templateStatus: "进行中", //模板状态
      multipleSelection: [],
      tableHeaderList: [] //表头动态数据
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    submitReject() {
      this.refreshList()
    },
    /**
     * @description: 刷新表格
     * @param {*}
     * @return {*}
     */
    refreshList() {
        this.tableHeaderList = [];
        var includeArr = ["registerId", "registerTime", "platform", "status","searcList"];
        var taskId = parseInt(this.selectId);
        this.selectList.forEach((item, index) => {
          if (item.id === taskId) {
            this.endTime = item.endTime;
            this.platformId = item.platformId
            //计算剩余天数
            var oldDate = new Date(this.endTime);
            var nowDate = new Date();
            var restMSeconds = oldDate.getTime() - nowDate.getTime(); //剩余毫秒数
            var restDay = (restMSeconds / (24 * 60 * 60 * 1000)).toFixed(2); //剩余天数
            this.restTime = restDay;
            if (item.status == "1") {
              this.templateStatus = "进行中";
            } else if (item.status == "2") {
              this.templateStatus = "已完成";
            } else {
              this.templateStatus = "已过期";
            }
          }
        });
        this.tableRequest.params.taskId =  this.selectId;
        this.$refs.template.tableLoading = true;
        const data = Object.assign(
          {},
          {
            search: this.$refs.template.keyword,
            startTime: this.$refs.template.dateRange[0],
            endTime: this.$refs.template.dateRange[1],
            page: this.$refs.template.paginationConfig.currentIndex,
            limit: this.$refs.template.paginationConfig.pageSize
          },
          this.tableRequest.params
        );
        const request = {
          method: "post",
          url: this.tableRequest.api,
          baseURL: window.SITE_CONFIG.baseUrl,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            token: this.$refs.template.token
          },
          data
        };
        axios(request).then(response => {
          if (response.data.code == 0) {
            this.searchKeyWord = []
            this.searchSetting.placeholder = ''
            // 表格内容
            this.tableCopyList = response.data.page.list;
            if(this.tableCopyList.length != 0) {
              this.tableCopyList[0].searcList.forEach((item,index) => {
                this.searchKeyWord.push(item.title)
              })
            }
            if(this.searchKeyWord.length != 0) {
              this.searchSetting.placeholder = '请输入'+this.searchKeyWord.join("、") + '进行搜索'
            }
            this.tableLength = this.tableCopyList.length;
            this.tableCopyList.forEach((item, index) => {
              var obj = {};
              for (let key in item) {
                if (!includeArr.includes(key)) {
                  console.log("测试", key, item);
                  obj[key] = item[key];
                }
              }
              this.tableHeaderList.push(obj);
              console.log(obj, "obj");
            });
            this.$refs.template.tableList = this.tableCopyList;
            this.$refs.template.paginationConfig.totalCount =
              response.data.page.totalCount;
          }
          this.$refs.template.tableLoading = false;
        });
    },
    handleDelete(ids) {
      // let ids = []
      // ids.push(row.registerId)
      // this.$http({
      //   url: this.$http.adornUrl("/fk/fkTemplateInstance/delete"),
      //   method: "post",
      //   data: this.$http.adornData({
      //     ids: ids
      //   })
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.refreshList()
      //   }
      // });
      this.$http({
        url: this.$http.adornUrl("/fk/fkTemplateInstance/delete"),
        method: "post",
        data: this.$http.adornData({
          ids: ids
        })
      }).then(({ data }) => {
        console.log("删除后返回的数据为", data);
        if (data.code === 0) {
         this.refreshList()
        }else {
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${data.code}`;
        }
      });
    },
    /**
     * @description: 树节点的点击事件
     * @param {type} params
     * @return {type}
     */
    handleTreeClick(node, tabIndex) {
      this.treeIdArr = [];
      console.log("dianji", node);
      if (node != null) {
        this.addGroupIds(node);
      }
      console.log("点击获得得节点及子节点为", this.treeIdArr);
      this.getDataList();
    },
    getDataList() {
      this.$http({
        url: this.$http.adornUrl("/fk/fkTask/receiveTask"),
        method: "post",
        data: this.$http.adornData({
          groupIds: this.treeIdArr,
          page: "1",
          limit: "9999",
          search: ""
        })
      }).then(({ data }) => {
        console.log("下拉框数据为", data);
        if (data && data.code === 0) {
          this.selectList = data.page.list;
        }
      });
    },
    /**
     * @description: 获得当前节点及其子节点的id
     * @param {object} node: 当前节点对象
     * @return {type}
     */
    addGroupIds(node) {
      this.treeIdArr.push(node.id);
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          this.addGroupIds(node.children[i]);
        }
      }
      return;
    },
    handleNodeOperation() {},
    /**
     * @description: 打开新增专题的弹框
     * @param {type} 无
     * @return {type} 无
     */
    openAddRegisterDialog() {
      this.$refs.addRegisterDialog.init(this.selectId);
      this.$refs.addRegisterDialog.dialogVisible = true;
    },
    handleEdit(row) {
      console.log("row", row);
      this.$refs.editRegisterDialog.init(row.registerId, row.status,this.selectId);
      this.$refs.editRegisterDialog.dialogVisible = true;
    },
    handleLook(row) {
      this.$refs.lookRegisterDialog.init(row.registerId, row.status,this.platformId);
      this.$refs.lookRegisterDialog.dialogVisible = true;
    },
    addTemplate() {
      if(this.restTime < 0) {
        this.$message.error('时间已截止，无法新增')
        return
      }
      let selectIdIndex = this.selectList.findIndex(
        item => item.id == this.selectId
      );
      if (selectIdIndex > -1) {
        if (this.selectList[selectIdIndex].isCollect) {
          this.$refs.addRegisterDialog.init(this.selectId);
          this.$refs.addRegisterDialog.dialogVisible = true;
        } else {
          this.$message({
            message: "该平台不能采集数据",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "任务不存在",
          type: "warning"
        });
      }
    },
    refreshData() {
      const data = Object.assign(
        {},
        {
          search: this.$refs.template.keyword,
          startTime: this.$refs.template.dateRange[0],
          endTime: this.$refs.template.dateRange[1],
          page: this.$refs.template.paginationConfig.currentIndex,
          limit: this.$refs.template.paginationConfig.pageSize
        },
        this.tableRequest.params
      );
      const request = {
        method: "post",
        url: this.tableRequest.api,
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          token: this.$refs.template.token
        },
        data
      };
      axios(request).then(response => {
        if (response.data.code == 0) {
          // 表格内容
          this.tableCopyList = response.data.page.list;
          this.tableLength = this.tableCopyList.length;
          this.tableCopyList.forEach((item, index) => {
            var obj = {};
            for (let key in item) {
              if (!includeArr.includes(key)) {
                console.log("测试", key, item);
                obj[key] = item[key];
              }
            }
            this.tableHeaderList.push(obj);
            console.log(obj, "obj");
          });
          this.$refs.template.tableList = this.tableCopyList;
          this.$refs.template.paginationConfig.totalCount =
            response.data.page.totalCount;
        }
        this.$refs.template.tableLoading = false;
      });
    }
  },
  components: {
    AddRegisterDialog,
    EditRegisterDialog,
    LookRegisterMessageDialog
  },
  watch: {
    selectId: {
      handler(newVal, oldVal) {
        console.log("newVal", newVal);
        this.tableHeaderList = [];
        var includeArr = ["registerId", "registerTime", "platform", "status","searcList"];
        var taskId = parseInt(newVal);
        this.selectList.forEach((item, index) => {
          if (item.id == taskId) {
            this.endTime = item.endTime;
            this.platformId = item.platformId
            //计算剩余天数
            var oldDate = new Date(this.endTime);
            var nowDate = new Date();
              var restMSeconds = oldDate.getTime() - nowDate.getTime(); //剩余毫秒数
            var restDay = (restMSeconds / (24 * 60 * 60 * 1000)).toFixed(2); //剩余天数
            this.restTime = restDay;
            if (item.status == "1") {
              this.templateStatus = "进行中";
            } else if (item.status == "2") {
              this.templateStatus = "已完成";
            } else {
              this.templateStatus = "已过期";
            }
          }
        });
        this.tableRequest.params.taskId = newVal;
        this.$refs.template.tableLoading = true;
        const data = Object.assign(
          {},
          {
            search: this.$refs.template.keyword,
            startTime: this.$refs.template.dateRange[0],
            endTime: this.$refs.template.dateRange[1],
            page: this.$refs.template.paginationConfig.currentIndex,
            limit: this.$refs.template.paginationConfig.pageSize
          },
          this.tableRequest.params
        );
        const request = {
          method: "post",
          url: this.tableRequest.api,
          baseURL: window.SITE_CONFIG.baseUrl,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            token: this.$refs.template.token
          },
          data
        };
        axios(request).then(response => {
          if (response.data.code == 0) {
            this.searchKeyWord = []
            this.searchSetting.placeholder = ''
            // 表格内容
            this.tableCopyList = response.data.page.list;
            if(this.tableCopyList.length != 0) {
              this.tableCopyList[0].searcList.forEach((item,index) => {
                this.searchKeyWord.push(item.title)
              })
            }
            if(this.searchKeyWord.length != 0) {
              this.searchSetting.placeholder = '请输入'+this.searchKeyWord.join("、") + '进行搜索'
            }
            this.tableLength = this.tableCopyList.length;
            this.tableCopyList.forEach((item, index) => {
              var obj = {};
              for (let key in item) {
                if (!includeArr.includes(key)) {
                  console.log("测试", key, item);
                  obj[key] = item[key];
                }
              }
              this.tableHeaderList.push(obj);
              console.log(obj, "obj");
            });
            this.$refs.template.tableList = this.tableCopyList;
            this.$refs.template.paginationConfig.totalCount =
              response.data.page.totalCount;
          }
          this.$refs.template.tableLoading = false;
        });

        // this.$http({
        //     url: this.$http.adornUrl('/fk/fkTemplateInstance/list'),
        //     method: 'post',
        //     data: this.$http.adornData({
        //     page: "1",
        //     limit: "10",
        //     search: "",
        //     taskId: 16
        //     })
        // }).then(({data}) => {
        //   console.log('获得的表格数据为',data)
        //   if(data && data.code === 0) {
        //       this.$refs.template.tableList = data.page.list
        //       this.tableLength = this.$refs.template.tableList.length
        //        this.$refs.template.tableList.forEach((item,index) => {
        //           var obj = {}
        //           for(let key in item) {
        //              if(!includeArr.includes(key)) {
        //                obj[key] = item[key]
        //              }
        //           }
        //           console.log(obj,'obj')
        //           this.tableHeaderList.push(obj)
        //       })
        //   }
        // })
      }
    }
  }
};
</script>
<style lang="less" scoped>
.leftContent {
  padding-left: 20px;
  .selectContainer {
    width: 100px;
    select {
      width: 100px;
      option {
      }
    }
  }

  .remarkContainer {
    display: flex;
    .alreadyData {
      display: flex;
      .alreadyDataTitle {
      }

      .number {
      }
    }

    .deadLine {
      display: flex;
      margin-left: 10px;
      .deadLineTitle {
      }

      .time {
      }
    }

    .restTime {
      display: flex;
      margin-left: 10px;
      .timeTitle {
      }

      .day {
      }
    }

    .state {
      display: flex;
      margin-left: 10px;
      .stateTitle {
      }

      .going {
      }
    }
  }
}
</style>