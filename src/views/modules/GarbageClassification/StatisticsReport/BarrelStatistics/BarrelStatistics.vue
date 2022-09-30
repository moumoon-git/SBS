<!--
 * @Author: yanghaohao
 * @Date: 2020-09-22 10:12:36
 * @LastEditTime: 2020-10-27 16:37:05
 * @LastEditors: Please set LastEditors
 * @Description: 垃圾分类的统计报告中的分类点撤桶记录页面
 * @FilePath:\SBS\src\views\modules\GarbageClassification\
              StatisticsReport\BarrelStatistics\BarrelStatistics.vue
-->

<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      :search-setting="{
        width: '200px',
        placeholder: '请输入分类点名称关键字'
      }"
      :export-select-config="{
        api: '/garbage/garbageWithdraw/xlsOutputSelect',
        params: {
          type: 1
        }
      }"
      :export-query-config="{
        api: '/garbage/garbageWithdraw/xlsOutputCondition',
        params: { type: 1 }
      }"
      :import-data-config="{
        api: ''
      }"
      :download-template-config="{
        api: ''
      }"
      :delete-selected-config="{ api: '' }"
      title="撤桶统计"
      :table-request="tableRequest"
      @refresh="getStatisticData"
      @tree-click="handleTreeClick"
    >
      <template #middle__operation__select>
        <sv-select
          v-model="townId"
          :options="communityOptions"
          placeholder="请选择社区"
          @change="typeChange"
        />
        <sv-select
          v-model="status"
          :options="option"
          placeholder="请选择状态"
          @change="typeChange"
        />
      </template>
      <template #middle__statistics>
        <table class="statistic_table">
          <span class="statistic">
            <td class="span_td">{{ statisticList.totalCount }}</td>
            <tr class="span_tr">
              垃圾总量（桶）
            </tr></span>

          <span class="span_line" />
          <span class="statistic">
            <td class="span_td">{{ statisticList.foodWasteCount }}</td>
            <tr class="span_tr">
              餐余垃圾（桶）
            </tr></span>

          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.otherWasteCount }}</td>
            <tr class="span_tr">
              其他垃圾（桶）
            </tr></span>

          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.recyclableWasteCount }}</td>
            <tr class="span_tr">
              可回收垃圾（桶）
            </tr></span>

          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.harmfulWasteCount }}</td>
            <tr class="span_tr">
              有害垃圾（桶）
            </tr></span>
        </table>
        <div class="statistic_second">
          <span class="statistic">平均撤桶率：{{
            parseFloat(statisticList.withdrawPercent * 100).toFixed(1)
          }}%</span>
          <span class="statistic">分类精准率：{{
            parseFloat(statisticList.classAccuracy).toFixed(1)
          }}%</span>
          <span class="statistic">回收利用率：{{
            parseFloat(statisticList.recyclablePercent * 100).toFixed(1)
          }}%</span>
          <span class="statistic">其他垃圾减量率：{{
            parseFloat(statisticList.otherReduce * 100).toFixed(1)
          }}%</span>
          <span class="statistic">黄牌数：{{ statisticList.yellowCount }}</span>
          <span class="statistic">红牌数：{{ statisticList.redCount }}</span>
          <span class="statistic">拒收数：{{ statisticList.rejectCount }}</span>
        </div>
      </template>
      <template #middle__table>
        <el-table-column
          prop="sortName"
          header-align="center"
          align="center"
          label="分类点名称"
        />
        <el-table-column
          prop="townName"
          header-align="center"
          align="center"
          label="社区"
        />
        <el-table-column
          prop="foodWaste"
          header-align="center"
          align="center"
          label="餐余垃圾（桶）"
        />
        <el-table-column
          prop="otherWaste"
          header-align="center"
          align="center"
          label="其他垃圾（桶）"
        />
        <el-table-column
          prop="recyclableWaste"
          header-align="center"
          align="center"
          label="可回收垃圾（桶）"
        />
        <el-table-column
          prop="harmfulWaste"
          header-align="center"
          align="center"
          label="有害垃圾（桶）"
        />
        <el-table-column
          prop="totalCount"
          header-align="center"
          align="center"
          label="垃圾总量（桶）"
        />
        <el-table-column
          prop="classAccuracy"
          header-align="center"
          align="center"
          label="分类准确率"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.classAccuracy > 0">
              {{ parseFloat(scope.row.classAccuracy).toFixed(1) }}%</span>
            <span v-if="scope.row.classAccuracy == 0">{{ scope.row.classAccuracy }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="撤桶率"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.withdrawPercent > 0">{{
              parseFloat(scope.row.withdrawPercent * 100).toFixed(1)
            }}%</span>
            <span v-if="scope.row.withdrawPercent == 0">{{ scope.row.withdrawPercent }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已撤桶</span>
            <span v-if="scope.row.status != 1">未撤桶</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="cneter"
          align="center"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view']"
              @view="viewContent(scope.row.id)"
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <el-dialog
      width="60%"
      title="撤桶记录"
      :visible.sync="dialogLookVisible"
      class="add-task-dialog"
      @closed="closeDialog"
    >
      <div class="container_front">
        <span class="front_span">撤桶班次：
          <span class="front_font">{{ startTime }} ~ {{ endTime }}</span></span>
        <span class="front_span2">撤桶人员：
          <span class="front_font">{{ name }}({{ phone }})</span></span>
      </div>
      <div class="container_middle">
        <table>
          <div class="first_row">
            <span class="middle_span">
              <td class="span_td">{{ totalCount }}</td>
              <tr class="span_tr">
                垃圾总量（桶）
              </tr>
            </span>

            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ foodWaste }}</td>
              <tr class="span_tr">
                餐余垃圾（桶）
              </tr>
            </span>

            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ recyclableWaste }}</td>
              <tr class="span_tr">
                可回收（桶）
              </tr>
            </span>

            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ classAccuracy }}</td>
              <tr class="span_tr">
                分类精准率
              </tr>
            </span>

            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ otherWaste }}</td>
              <tr class="span_tr">
                其他（桶）
              </tr>
            </span>

            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ harmfulWaste }}</td>
              <tr class="span_tr">
                有害（桶）
              </tr>
            </span>

            <span class="span_line" />
            <span class="middle_span">
              <td
                v-if="isKeepbarrel == 1"
                class="span_td"
              >
                有
              </td>
              <td
                v-else-if="isKeepbarrel == 2"
                class="span_td"
              >
                无
              </td>
              <td
                v-else
                class="span_td"
              />
              <tr class="span_tr">
                是否有人守桶
              </tr>
            </span>

            <i />
          </div>
        </table>
      </div>
      <div class="container_bottom">
        <div class="bottom_title">
          转运照片
        </div>
        <template v-for="(item, index) in imgList">
          <viewer :key="index">
            <img
              :src="item.allUrl"
              alt
              height="150"
              style="cursor:zoom-in;padding:10px;"
            >
          </viewer>
        </template>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 新增弹窗
      dialogLookVisible: false,
      // 组Id
      groupIds: '',
      statisticList: [],
      // 当前选择的树节点
      currentNode: '',
      pageIndex: 1,
      townId: '',
      status: '',
      communityOptions: [],
      // 查看弹窗的数据
      foodWaste: '',
      totalCount: '',
      name: '',
      phone: '',
      startTime: '',
      endTime: '',
      imgList: [
        {
          url: '',
          allUrl: '',
          name: '',
        },
      ],
      withdrawTime: '',
      isKeepbarrel: '',
      classAccuracy: '',
      harmfulWaste: '',
      recyclableWaste: '',
      otherWaste: '',
      dataForm: {
        // 选择的分组名称，这个是保存在选择分组时在弹窗里选择的值
        selectTreeNodeName: '',
        // 已选择的分组名
        name: '',
        // 树的搜索值
        searchName: '',
        // 树Id
        treeId: '',
        // 分组描述
        groupDesc: '',
        // 父Id
        parentId: 0,
      },

      // 使用自定义模板参数
      treeSetting: {
        tab: [],
        api: ['/garbage/garbageSortpointGroup/list'],
        edit: false,
      },
      tableRequest: {
        api: '/garbage/garbageWithdraw/list',
        params: {
          groupIds: this.groupIds,
          type: 1,
          townId: this.townId,
          status: this.status,
        },
      },
      option: [
        {
          label: '已撤桶',
          value: 1,
        },
        {
          label: '未撤桶',
          value: 2,
        },
      ],
    };
  },
  mounted() {
    this.getCommunityType();
  },
  methods: {
    /**
     * @description: 获取社区下拉框列表数据
     */
    getCommunityType() {
      this.$http({
        url: this.$http.adornUrl('/sys/systown/treeList'),
        method: 'post',
        params: this.$http.adornParams({
          module: '1',
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.forEach((item) => {
            item.children.forEach((v) => {
              this.communityOptions.push({
                value: v.id,
                label: v.townName,
              });
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 获取统计的相关数据
     * @param {Object}obj 包含你所有的请求数据
     */
    getStatisticData(request) {
      // console.log("request",request)
      this.$http({
        url: this.$http.adornUrl('/garbage/garbageWithdraw/count'),
        method: 'post',
        data: this.$http.adornData({
          search: request.data.search,
          startTime: request.data.startTime,
          endTime: request.data.endTime,
          townId: request.data.townId,
          type: 1,
          status: request.data.status,
          groupIds: request.data.groupIds,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.statisticList = data.data;
        } else {
          this.statisticList = [];
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 编辑选择的表格行数据
     * @param {Number}点击的行id,用id获取该行的相关数据
     */
    viewContent(id) {
      this.$http({
        url: this.$http.adornUrl(`/garbage/garbageWithdraw/info?id=${id}`),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.totalCount = data.data.totalCount;
          this.name = data.data.memberName;
          this.phone = data.data.memberPhone;
          this.startTime = data.data.garbageShiftEntity.startTime;
          this.endTime = data.data.garbageShiftEntity.endTime;
          this.imgList = data.data.imgList;
          this.withdrawTime = data.data.withdrawTime;
          this.isKeepbarrel = data.data.isKeepbarrel;
          this.classAccuracy = data.data.classAccuracy;
          this.harmfulWaste = data.data.harmfulWaste;
          this.recyclableWaste = data.data.recyclableWaste;
          this.otherWaste = data.data.otherWaste;
          this.foodWaste = data.data.foodWaste;
        } else {
          this.$message.error(data.msg);
        }
      });
      this.dialogLookVisible = true;
    },
    /**
     * @description: 点击树节点触发的事件
     * @param {Object} 选中树节点的数据列表，包含其子孙信息
     */
    handleTreeClick(obj) {
      if (obj == null) {
        this.groupIds = [];
        this.tableRequest.params.groupIds = this.groupIds;
      } else {
        this.currentNode = obj;
        this.groupIds = [];
        this.tableRequest.params.groupIds = this.groupIds;
        this.pageIndex = 1;
        if (this.currentNode) {
          // 新增或者编辑分组时回显分组名称
          if (this.type === 1) this.dataForm.name = this.currentNode.name;
          else this.dataForm.name = '';
          this.dataForm.selectTreeNodeName = this.currentNode.name;
          this.dataForm.parentId = this.currentNode.parentId;
        } else {
          // 此处为搜索框右边的新增按钮触发，默认为顶级分组
          this.dataForm.selectTreeNodeName = '顶级分组节点';
          this.dataForm.parentId = 0;
        }

        if (obj.id === 0) {
          this.groupIds = [];
          this.tableRequest.params.groupIds = this.groupIds;
        } else {
          this.groupIds = [obj.id];
          this.tableRequest.params.groupIds = this.groupIds;
        }

        if (obj.children != null) this.getChildren(obj.children);

        this.dataForm.treeId = obj.id;
      }
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 点击树结点获取相应的子节点
     * @param {Object} 数据列表，用了判断数据结构是否含有children
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
     * @description:关闭弹窗
     */
    closeDialog() {
      this.dialogLookVisible = false;
    },
    typeChange() {
      this.tableRequest.params.townId = this.townId;
      this.tableRequest.params.status = this.status;
      this.$refs.template.getTableList(this.tableRequest);
    },
  },
};
</script>
<style lang="less" scoped>
.add-task-dialog {
  // 弹窗表头样式
  font-size: 14px;
  /deep/ .el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 23px 3px rgba(201, 201, 201, 0.27);
  }
  /deep/ .el-dialog__header {
    height: 40px;
    line-height: 40px;
    background-color: #f1f4f6;
    border-radius: 5px 5px 0px 0px;
    padding: 0px;
    /deep/ .el-dialog__title {
      font-size: 14px;
      padding-left: 20px;
    }
    /deep/.el-dialog__headerbtn {
      top: 0px;
    }
  }
  /deep/ .el-dialog__body {
    padding: 0px;
  }
  .container_front {
    background: #f9fbff;
    padding: 20px 0px 10px;
    display: flex;
    justify-content: space-around;
    .front_span {
      color: #999999;
    }
    .front_span2 {
      color: #999999;
    }
    .front_font {
      color: #333333;
    }
  }
  .container_middle {
    padding: 20px;
    .first_row {
      display: flex;
      justify-content: space-around;
      white-space: nowrap;
      width: 1050px;
      .middle_span {
        color: #999999;
        .span_td {
          font-weight: bold;
          text-align: center;
          color: #333333;
        }
        .span_tr {
          text-align: center;
          color: #555555;
          line-height: 50px;
        }
      }
      .span_line {
        display: block;
        width: 2px;
        height: 24px;
        margin: 13px 5px;
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    .second_row {
      white-space: nowrap;
      padding-left: 100px;
      .second_span {
        width: 250px;
        height: 70px;
        display: inline-block;
        color: #999999;
      }
      .span_td {
        font-weight: bold;
        text-align: center;
        color: #333333;
      }
    }
  }
  .container_bottom {
    padding: 20px;
    .bottom_title {
      border-left: 3px solid rgba(0, 145, 255, 1);
      font-size: 14px;
      font-weight: bold;
      display: inline-block;
      height: 14px;
      line-height: 14px;
      padding-left: 10px;
    }
  }
}
// 统计数据样式
.statistic_table {
  display: flex;
  justify-content: space-around;
  .statistic {
    font-size: 14px;
    color: #333333;
    padding-left: 70px;
    font-weight: bold;
    display: inline-block;
    height: 50px;
    width: 200px;
    .span_td {
      font-size: 13px;
      color: #333333;
      text-align: center;
    }
    .span_tr {
      color: #999999;
    }
  }
  .span_line {
    display: block;
    width: 2px;
    height: 20px;
    margin: 9px 5px;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
.statistic_second {
  padding-top: 10px;
  height: 40px;
  flex: 1;
  display: flex;
  justify-content: space-around;
  background-color: #f4f4f4;
  .statistic {
    font-size: 14px;
    color: #666666;
    margin-left: 20px;
    font-weight: bold;
    display: inline-block;
    height: 30px;
    width: 170px;
  }
}
.content_header_title {
  border-left: 3px solid rgba(0, 145, 255, 1);
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  height: 16px;
  line-height: 16px;
  padding-left: 14px;
}
</style>
