<!--
 * @Author: yanghaohao
 * @Date: 2020-09-22 10:13:33
 * @LastEditTime: 2021-01-05 11:41:31
 * @LastEditors: Please set LastEditors
 * @Description: 垃圾分类的统计报告的临时收运点统计页面
 * @FilePath: \SBS\src\views\modules\GarbageClassification\
               StatisticsReport\StationStatistics\StationStatistics.vue
-->

<template>
  <div>
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      :search-setting="{
        width: '200px',
        placeholder: '请输入收运点名称关键字',
      }"
      :export-select-config="{
        api: '/garbage/garbageCollectionRegister/xlsOutputSelect',
        params: {},
      }"
      :export-query-config="{
        api: '/garbage/garbageCollectionRegister/xlsOutputCondition',
        params: { townId: typeId },
      }"
      :import-data-config="{
        api: '',
      }"
      title="临时收运点统计"
      :table-request="tableRequest"
      @refresh="getStatisticData"
      @tree-click="handleTreeClick"
    >
      <template #middle__operation__select>
        <sv-select
          v-model="typeId"
          :options="communityOptions"
          placeholder="请选择社区"
          @change="typeChange"
        />
      </template>

      <template #middle__statistics>
        <table class="statistic_table">
          <span class="statistic">
            <td class="span_td">{{ statisticList.totalCount }}</td>
            <tr class="span_tr">
              垃圾总量（吨）
            </tr>
          </span>
          <span class="span_line" />
          <span
            class="statistic"
          ><td class="span_td">{{ statisticList.foodWasteCount }}</td>
            <tr class="span_tr">
              餐余垃圾（吨）
            </tr>
          </span>
          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.otherWasteCount }}</td>
            <tr class="span_tr">
              其他垃圾（吨）
            </tr></span>
          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.recyclableWasteCount }}</td>
            <tr class="span_tr">
              可回收垃圾（吨）
            </tr></span>
          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.harmfulWasteCount }}</td>
            <tr class="span_tr">
              有害垃圾（吨）
            </tr></span>
          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.bigWasteCount }}</td>
            <tr class="span_tr">
              大件垃圾（吨）
            </tr></span>
        </table>
      </template>
      <template #middle__table>
        <el-table-column
          prop="collectionName"
          header-align="center"
          align="center"
          label="收运点名称"
        />
        <el-table-column
          prop="townName"
          header-align="center"
          align="center"
          label="所属社区"
        />
        <el-table-column
          prop="registerTime"
          header-align="center"
          align="center"
          label="转运时间"
        />
        <el-table-column
          prop="memberName"
          header-align="center"
          align="center"
          label="记录人员"
        />
        <el-table-column
          prop="foodWaste"
          header-align="center"
          align="center"
          label="餐余垃圾（吨）"
        />
        <el-table-column
          prop="otherWaste"
          header-align="center"
          align="center"
          label="其他垃圾（吨）"
        />
        <el-table-column
          prop="recyclableWaste"
          header-align="center"
          align="center"
          label="可回收垃圾（吨）"
        />
        <el-table-column
          prop="harmfulWaste"
          header-align="center"
          align="center"
          label="有害垃圾（吨）"
        />
        <el-table-column
          prop="bigWaste"
          header-align="center"
          align="center"
          label="大件垃圾（吨）"
        />
        <el-table-column
          prop="totalCount"
          header-align="center"
          align="center"
          label="垃圾总量（吨）"
        />
        <el-table-column
          header-align="center"
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
      width="1100px"
      title="转运记录"
      :visible.sync="dialogLookVisible"
      class="add-task-dialog"
      @closed="closeDialog"
    >
      <div class="container_front">
        <span class="front_span">转运时间： <span class="front_font">{{ registerTime }}</span></span>
        <span class="front_span">记录人员：
          <span class="front_font">{{ name }}({{ phone }})</span></span>
      </div>
      <div class="container_middle">
        <table>
          <div class="first_row">
            <span class="middle_span">
              <td class="span_td">{{ totalCount }}</td>
              <tr class="span_tr">
                垃圾总量（吨）
              </tr>
            </span>
            <span class="span_line" />

            <span class="middle_span">
              <td class="span_td">{{ foodWaste }}</td>
              <tr class="span_tr">
                餐余垃圾（吨）
              </tr>
            </span>
            <span class="span_line" />

            <span class="middle_span">
              <td class="span_td">{{ recyclableWaste }}</td>
              <tr class="span_tr">
                可回收（吨）
              </tr>
            </span>
            <span class="span_line" />

            <span class="middle_span">
              <td class="span_td">{{ otherWaste }}</td>
              <tr class="span_tr">
                其他（吨）
              </tr>
            </span>
            <span class="span_line" />

            <span class="middle_span">
              <td class="span_td">{{ harmfulWaste }}</td>
              <tr class="span_tr">
                有害（吨）
              </tr>
            </span>
            <span class="span_line" />

            <span class="middle_span">
              <td class="span_td">{{ bigWaste }}</td>
              <tr class="span_tr">
                大件（吨）
              </tr>
            </span>
          </div>
        </table>
      </div>
      <div class="container_bottom">
        <div class="bottom_title">
          转运照片
        </div>
        <viewer>
          <img
            v-for="(item, index) in imgList"
            :key="index"
            :src="item.allUrl"
            alt
            height="130"
            style="cursor: zoom-in; padding: 10px"
          >
        </viewer>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格上方的统计数据
      statisticList: [],
      // 社区表单
      communityOptions: [],
      typeId: '',
      // 新增弹窗
      dialogLookVisible: false,
      // 组Id
      groupIds: '',
      // 当前选择的树节点
      currentNode: '',
      pageIndex: 1,
      // 查看弹窗数据
      totalCount: '',
      name: '',
      phone: '',
      registerTime: '',
      bigWaste: '',
      imgList: '',
      harmfulWaste: '',
      recyclableWaste: '',
      otherWaste: '',
      foodWaste: '',
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
        api: ['/garbage/garbageCollectionpointGroup/list'],
        edit: false,
      },
      tableRequest: {
        api: '/garbage/garbageCollectionRegister/list',
        params: {
          groupIds: this.groupIds,
          townId: this.typeId,
        },
      },
      option: [
        {
          label: '类型一',
          value: 1,
        },
        {
          label: '类型二',
          value: 2,
        },
        {
          label: '类型三',
          value: 3,
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
            item.children.forEach((itemChildren) => {
              this.communityOptions.push({
                value: itemChildren.id,
                label: itemChildren.townName,
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
     * @param {Object} request 包含你所有的请求数据
     */
    getStatisticData(request) {
      this.$http({
        url: this.$http.adornUrl('/garbage/garbageCollectionRegister/count'),
        method: 'post',
        data: this.$http.adornData({
          search: request.data.search,
          startTime: request.data.startTime,
          endTime: request.data.endTime,
          townId: request.data.townId,
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
     * @description: 查看选择的表格行数据
     * @param {Number} id 选中的表格行数据的id
     */
    viewContent(id) {
      this.$http({
        url: this.$http.adornUrl(
          `/garbage/garbageCollectionRegister/info?id=${id}`,
        ),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.totalCount = data.data.totalCount;
          this.name = data.data.memberName;
          this.phone = data.data.memberPhone;
          this.registerTime = data.data.registerTime;
          this.bigWaste = data.data.bigWaste;
          this.imgList = data.data.imgList;
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
     * @description: 点击树触发的事件
     * @param {Object} obj 点击树节点结构
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
     * @param {Object} 数据列表，用了判断数据结构是否还含有children
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
     * @description:关闭转运记录弹窗
     */
    closeDialog() {
      this.dialogLookVisible = false;
    },
    /**
     * @description:下拉框变换触发搜索事件
     */
    typeChange() {
      this.tableRequest.params.townId = this.typeId;
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
    background: rgba(249, 251, 255, 1);
    padding: 20px;
    display: flex;
    flex: 1;
    justify-content: space-around;
    .front_span {
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
        display: inline-block;
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
