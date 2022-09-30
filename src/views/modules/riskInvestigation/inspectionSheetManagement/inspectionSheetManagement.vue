<template>
  <div class="inspectionSheetManagement">
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      title="巡查管理"
      :date-select="true"
      :table-request="tableRequest"
      @tree-click="clickTree"
    >
      <template #middle__operation__select>
        <!-- 1. 检查状态 -->
        <sv-select
          v-model="queryList.type"
          placeholder="检查类型"
          clearable
          :options="checkTypeOptions"
          @change="getWorkData(1)"
        />
        <!-- 2. 处置状态 -->
        <sv-select
          v-model="queryList.status"
          class="task-content-header-cycle"
          placeholder="处置状态"
          clearable
          :options="handleStatusOptions"
          @change="getWorkData(1)"
        />
      </template>

      <template #middle__operation__button>
        <!-- 发布按钮 -->
        <sv-button
          type="primary"
          @click="showReleaseSheet(-1)"
        >
          发布工单
        </sv-button>
      </template>
      <template #middle__table>
        <!-- 1. 工单名称 -->
        <el-table-column
          header-align="center"
          align="center"
          prop="name"
          label="工单名称"
        />
        <!-- 2. 工单类型 -->
        <el-table-column
          header-align="center"
          align="center"
          prop="workType"
          label="工单类型"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.workType==0">自定义工单</span>
            <span v-if="scope.row.workType==1">巡查工单</span>
          </template>
        </el-table-column>
        <!-- 3. 工单属性 -->
        <el-table-column
          header-align="center"
          align="center"
          prop
          label="工单属性"
        >
          <template slot-scope="scope">
            <span>{{ workPropertyIdToName(scope.row.workProperty) }}</span>
          </template>
        </el-table-column>
        <!-- 4. 工单地点 -->
        <el-table-column
          header-align="center"
          align="center"
          prop="workPlace"
          label="工单地点"
        />
        <!-- 5. 发布时间 -->
        <el-table-column
          header-align="center"
          align="center"
          prop="gmtCreate"
          label="发布时间"
        />
        <!-- 6. 工单负责人 -->
        <el-table-column
          header-align="center"
          align="center"
          prop
          label="工单负责人"
        >
          <template slot-scope="scope">
            <span style="color:#0091FF">{{ scope.row.contactorIdString }}</span>
          </template>
        </el-table-column>
        <!-- 7. 工单时限 -->
        <el-table-column
          header-align="center"
          align="center"
          label="工单时限"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isEndtime==0">无限制时间</span>
            <span v-else>
              {{ scope.row.endDate }} {{ scope.row.endTime }}
              <br>
              <span
                v-if="isOutTime(scope.row.endDate, scope.row.endTime)"
              >{{ isOutTime(scope.row.endDate, scope.row.endTime) }}</span>
              <span
                v-else
                style="color:#F66E6E"
              >已超时</span>
            </span>
          </template>
        </el-table-column>
        <!-- 8. 工单状态 -->
        <el-table-column
          header-align="center"
          align="center"
          prop
          label="工单状态"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status==1"
              style="color:#0BD295"
            >已处置</span>
            <span
              v-if="scope.row.status==0"
              style="color:#F7B500"
            >处置中</span>
            <span
              v-if="scope.row.status==-1"
              style="color:#999999"
            >已取消</span>
          </template>
        </el-table-column>
        <!-- 9. 操作按钮 -->
        <el-table-column
          header-align="center"
          align="center"
          width="260"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="[
                'view',
                'edit',
                'delete'
              ]"
              @view="showViewSheet(scope.row.id)"
              @edit="showReleaseSheet(scope.row.id)"
              @delete="
                deleteIds = scope.row.id;
                $refs.delete_hint.visible = true;
              "
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 发布/编辑工单弹窗 -->
    <releaseSheet
      ref="releaseSheet"
      :work-property-list="workPropertyList"
      :get-work-data="getWorkData"
      :edit-which="editWhich"
    />
    <viewSheet ref="viewSheet" />
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="deletRow(deleteIds)"
    />
  </div>
</template>

<script>
// 发布编辑工单弹窗组件
import releaseSheet from "./releaseSheet/releaseSheet";
// 查看工单弹窗组件
import viewSheet from "./viewSheet/viewSheet";

export default {
  components: {
    releaseSheet,
    viewSheet,
  },
  data() {
    return {
      searchName: '',
      // 查询条件
      queryList: {
        // page: 1,
        // limit: 10,
        groupIds: [-1],
        /**
         * @author tanjinfeng
         * @date 2020-11-28
         * @description 删除module=3
         */
        // *** 原来的代码 ***
        // module: "3",
        // *** 修改后的代码 ***
        module: '',
        // *** 结束 ***
        property: '',
        status: '',
        type: '',
        // search: '',
        targetId: '',
      },
      // 工单属性列表
      workPropertyList: [],
      // 检查类型可选值
      checkTypeOptions: [
        {
          value: '0',
          label: '自定义工单',
        },
        {
          value: '1',
          label: '巡查工单',
        },
      ],
      // 工单处置状态可选值
      handleStatusOptions: [
        {
          value: '-1',
          label: '已取消',
        },
        {
          value: '0',
          label: '处置中',
        },
        {
          value: '1',
          label: '已处置',
        },
      ],
      // 获取到的表单数据
      sheetTableData: [],
      // 判定弹窗是发布还是编辑
      editWhich: '',
      // 判定查看哪一行表单
      viewWhich: '',
      // 左侧搜索栏过滤关键词
      filterText: '',
      // 左侧搜索栏树形数据
      searchTreeData: [],
      // 树形配置
      treeProps: {
        value: 'id',
        children: 'children',
        label: 'name',
      },
      // 分页器显示数据总数
      totalCount: 0,
      // 使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        api: '/investigation/investigationTaskGroup/listTree', // 查找树接口
        edit: false,
        params: {},
      },
      tableRequest: {
        api: '/work/workSheet/list',
        params: {},
      },
    };
  },
  watch: {
    // 监控左侧搜索栏，变更则触发树形的过滤操作
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    console.log('this.emergnecy',this.emergencyId,this.$route.query.id)
    this.queryList.targetId = this.$route.query.id
    // 获取表单数据
    this.getWorkData();
    // 获取工单属性列表
    this.getWorkPropertyList();
    // 获取树形数据
    this.getTreeList();
  },
  methods: {
    // 获取表单数据
    getWorkData(hasTree) {
      if (hasTree !== 1) {
        this.queryList.groupIds = [];
        this.$refs.template.getTree();
      }
      this.tableRequest.params = this.queryList;
      this.$refs.template.getTableList(this.tableRequest);
    },
    // 获取工单属性列表
    getWorkPropertyList() {
      /**
       * @author tanjinfeng
       * @date 2020-11-28
       * @description 删除module
       */
      // *** 原来的代码 ***
      // let url =
      //   window.SITE_CONFIG['baseUrl'] + '/work/workProperty/treelist?module=3';
      // *** 修改后的代码 ***
      let url =
        window.SITE_CONFIG['baseUrl'] + '/work/workProperty/treelist?module=';
      // *** 结束 ***
      let that = this;
      this.$http.get(url).then(
        function (res) {
          // 工单属性列表保存在本地数组workPropertyList中
          for (var item of res.data.data) {
            that.workPropertyList.push({
              value: item.id,
              label: item.name,
            });
          }
        },
        function (res) {
       //   console.log('工单属性列表获取失败！\n错误信息：\n', res);
         // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        }
      );
    },
    // 根据工单属性id返回对应工单属性名
    workPropertyIdToName(id) {
      for (let item of this.workPropertyList) {
        if (id == item.value) {
          return item.label;
        }
      }
    },
    // 计算工单时限剩余时间
    isOutTime(date, time) {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let nowDate =
        year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':00';
      let inDate = date + ' ' + time + ':00';
      let dHour = Math.floor(
        (Date.parse(inDate) - Date.parse(nowDate)) / (3600 * 1000)
      );
      let dMin = Math.floor(
        (Date.parse(inDate) - Date.parse(nowDate)) / (600 * 1000)
      );
      //   console.log(
      //     '工单时间',
      //     nowDate,
      //     inDate,
      //     Date.parse(inDate),
      //     Date.parse(nowDate)
      //   );
      if (dHour < 0) {
        return false;
      } else {
        let leftDays = Math.floor(dHour / 24);
        // let leftHours = dHour % 24;
        let leftHours = ((dMin/60) % 24).toFixed(1);
        let res = '剩余：' + leftDays + '天' + leftHours + '小时';
        return res;
      }
    },
    // 删除该行数据
    deletRow(id) {
      const send = {
        ids: [id],
      };
      const url = `${window.SITE_CONFIG.baseUrl}/work/workSheet/delete`;
      this.$http.post(url, send, { emulateJSON: true }).then((res) => {
        if (res.data.code === 0) {
          this.$message.success('删除工单成功！');
          this.getWorkData();
        } else {
          this.$message.error('删除工单失败！\n错误信息：\n', res.data.msg);
        }
      });
    },
    // 点击显示“发布/编辑工单”弹窗, index==-1时是发布， else为编辑
    showReleaseSheet(id) {
      this.$refs.releaseSheet.releaseVisible = true;
      this.editWhich = id;
    },
    // 查看工单点击弹窗
    showViewSheet(id) {
      this.$nextTick(() => {
        this.$refs.viewSheet.init(id);
      });
      // this.$refs.viewSheet.viewSheetVisible = true;
      // this.viewWhich = id;
    },
    /**
     * @method
     * @desc 获取树形数据
     */
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl('/investigation/investigationTaskGroup/listTree'),
        method: 'get',
        params: this.$http.adornParams({
          name: this.searchName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.searchTreeData = [{
            id: 0,
            name: '全部',
            children: null,
          }, ...data.data]
          this.getWorkData();
        } else {
          this.$message.error(data.msg);
        }
      });
    //  let self = this;
    //  let url =
    ///    window.SITE_CONFIG['baseUrl'] +
    //    '/investigation/investigationTaskGroup/listTree';
    //  this.$http.get(url).then(
      //  (res) => {
     //     console.log('获取树形成功：【\n', res.data.data, '\n】');
     //     self.searchTreeData = res.data.data;
     //     self.searchTreeData.push({
      //      id: -1,
      //      name: "其他",
      //      children: null,
     //     });
     //   },
    //    (res) => {
      //    console.log("获取树形失败：【\n", res, "\n】");
    //    }
     // );
    },


    // 树形过滤规则
    //filterNode(value, data) {
    //  console.log("过滤的数据", value, data);
    //  if (!value) return true;
    //  return data.name.indexOf(value) !== -1;
   // },
    /**
     * @method
     * @desc 点击树形数据，传组id查询列表
     */
    clickTree(data) {
      let self = this;
      if (data == null) {
        this.queryList.groupIds = [];
        this.getWorkData(1);
        return;
      }
      console.log('点击树形的节点数据:', data);
      this.queryList.groupIds = [];
      (function getChild(data) {
        if(data.id == 0)
        {self.queryList.groupIds = []
         return  }
        self.queryList.groupIds.push(data.id);
        if (data.hasOwnProperty('children') && data.children !== null) {
          for (let item of data.children) {
            getChild(item);
          }
        }
      })(data);
      console.log('点击的节点及其子孙id集合：', this.queryList.groupIds);
      this.getWorkData(1);
    },
    /**
     * @method
     * @desc 点击全部，传空数组，查询所有列表
     */
    getAll() {
      this.queryList.groupIds = [];
      this.getWorkData();
      console.log('alll');
    },
    // 分页器操作
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryList.limit = val;
      this.getWorkData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryList.page = val;
      this.getWorkData();
    },
  },

};
</script>

<style lang='less' scoped>
* {
  font-family: PingFangSC-Regular, PingFang SC;
}
.inspectionSheetManagement{
  height: calc(100vh - 112px);
  display: flex;
  background: #F4F4F4;
}
</style>