<!--
 * @Author: yanghaohao
 * @Date: 2020-09-22 10:13:55
 * @LastEditTime: 2021-01-05 11:37:49
 * @LastEditors: Please set LastEditors
 * @Description: 垃圾分类中的统计报告的中转统计页面
 * @FilePath:\SBS\src\views\modules\GarbageClassification\StatisticsReport\
              TransferStatistics\TransferStatistics.vue
-->
<template>
  <div>
    <sv-template
      ref="template"
      :search-setting="{
        width: '200px',
        placeholder: '请输入中转站名称关键字',
      }"
      :export-select-config="{
        api: '/garbage/garbageTransferRegister/xlsOutputSelect',
        params: {},
      }"
      :export-all-config="{
        api: '/garbage/garbageTransferRegister/xlsOutputCondition',
        params: {},
      }"
      :import-data-config="{
        api: '',
      }"
      :download-template-config="{
        api: '',
      }"
      :delete-selected-config="{ api: '' }"
      title="中转统计"
      :table-request="tableRequest"
      @refresh="getStatisticData"
    >
      <template #left__container>
        <div />
      </template>
      <!-- <template #middle__operation__select>
        <sv-select
          :options="communityOptions"
          v-model="communityType"
          placeholder="请选择社区"
          @change="typeChange"
        ></sv-select>
      </template> -->
      <template #middle__statistics>
        <table class="statistic_table">
          <span class="statistic"><td class="span_td">{{ statisticList.totalCount }}</td>
            <tr class="span_tr">
              垃圾总量（吨）
            </tr></span>
          <span class="span_line" />
          <span class="statistic"><td class="span_td">{{ statisticList.foodWasteCount }}</td>
            <tr class="span_tr">
              餐余垃圾（吨）
            </tr></span>
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
          <span class="statistic"><td class="span_td">{{ statisticList.greenWasteCount }}</td>
            <tr class="span_tr">
              绿色垃圾处理（吨）
            </tr></span>
        </table>
        <div class="statistic_second">
          <span class="statistic">
            <span v-if="statisticList.average != 0">餐余垃圾精准率：{{
              parseFloat(statisticList.average).toFixed(1)
            }}%</span>
            <span v-if="statisticList.average == 0">餐余垃圾精准率：{{ statisticList.average }}%</span>
          </span>
          <span class="statistic"><span v-if="statisticList.recyclablePercent != 0">生活垃圾回收利用率：{{
                                    parseFloat(statisticList.recyclablePercent).toFixed(1)
                                  }}%</span>
            <span v-if="statisticList.recyclablePercent == 0">
              生活垃圾回收利用率：{{ statisticList.recyclablePercent }}%</span>
          </span>
          <span class="statistic"><span v-if="statisticList.otherReduce != 0">其他垃圾减量率：{{
                                    parseFloat(statisticList.otherReduce).toFixed(1)
                                  }}%</span>
            <span v-if="statisticList.otherReduce == 0">
              其他垃圾减量率：{{ statisticList.otherReduce }}%</span>
          </span>
          <span class="statistic"><span v-if="statisticList.classAccuracy != 0">分类时效率：{{
                                    parseFloat(statisticList.classAccuracy).toFixed(1)
                                  }}%</span>
            <span v-if="statisticList.classAccuracy == 0">分类时效率：{{
              parseFloat(statisticList.classAccuracy).toFixed(1)
            }}%</span>
          </span>
        </div>
      </template>
      <template #middle__table>
        <el-table-column
          prop="transferPoint.name"
          header-align="center"
          align="center"
          label="中转站"
        />
        <el-table-column
          prop="withdrawTime"
          header-align="center"
          align="center"
          label="转运时间"
        />
        <el-table-column
          prop="garbageMemberEntity.name"
          header-align="center"
          align="center"
          label="记录人员"
        />
        <el-table-column
          prop="foodWaste"
          header-align="center"
          align="center"
          label="餐厨垃圾（吨）"
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
          prop="totalCount"
          header-align="center"
          align="center"
          label="垃圾总量（吨）"
        />
        <el-table-column
          prop="greenWaste"
          header-align="center"
          align="center"
          label="绿色垃圾处理（吨）"
        />
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
      width="1100px"
      title="街道垃圾中转站转运记录"
      :visible.sync="dialogLookVisible"
      class="add-task-dialog"
      @closed="closeDialog"
    >
      <div class="container_front">
        <span class="front_span">中转站： <span class="front_font">{{ pointName }}</span></span>
        <span class="front_span">转运时间： <span class="front_font">{{ withdrawTime }}</span></span>
        <span class="front_span">记录人员：
          <span class="front_font">{{ name }}({{ phone }})</span></span>
      </div>
      <div class="container_middle">
        <table>
          <div class="first_row">
            <span class="middle_span">
              <td class="span_td">{{ totalCount }}</td>
              <tr>
                垃圾总量（吨）
              </tr>
            </span>
            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ foodWaste }}</td>
              <tr>
                餐余垃圾（吨）
              </tr>
            </span>
            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ recyclableWaste }}</td>
              <tr>
                可回收（吨）
              </tr>
            </span>
            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ foodAccuracy }}%</td>
              <tr>
                餐余垃圾精准率
              </tr>
            </span>
            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ otherWaste }}</td>
              <tr>
                其他（吨）
              </tr>
            </span>
            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ harmfulWaste }}</td>
              <tr>
                有害（吨）
              </tr>
            </span>
            <span class="span_line" />
            <span class="middle_span">
              <td class="span_td">{{ greenWaste }}</td>
              <tr>
                绿色垃圾（吨）
              </tr>
            </span>
          </div>
          <div class="second_row">
            <span class="second_span">
              <td class="span_td">{{ foodDriName }}</td>
              <tr>
                餐余垃圾去向
              </tr>
            </span>
            <span class="span_line" />
            <span class="second_span">
              <td class="span_td">{{ recyclableDirName }}</td>
              <tr>
                可回收垃圾去向
              </tr>
            </span>
            <span class="span_line" />
            <span class="second_span">
              <td class="span_td">{{ harmfulDirName }}</td>
              <tr>
                有害垃圾去向
              </tr>
            </span>
            <span class="span_line" />
            <span class="second_span">
              <td class="span_td">{{ otherDirName }}</td>
              <tr>
                其他（吨）
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
        <viewer>
          <img
            v-for="(item, index) in imgList"
            :key="index"
            :src="item.allUrl"
            alt
            height="150"
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
      // 社区下拉框
      communityOptions: [],
      communityType: '',
      // 新增弹窗
      dialogLookVisible: false,
      // 垃圾统计的数量
      statisticList: [],
      totalCount: '',
      greenWaste: '',
      foodWaste: '',
      otherWaste: '',
      recyclableWaste: '',
      harmfulWaste: '',
      foodAccuracy: '',
      withdrawTime: '',
      foodDriName: '',
      otherDirName: '',
      recyclableDirName: '',
      harmfulDirName: '',
      name: '',
      phone: '',
      imgList: [
        {
          url: '',
          allUrl: '',
          name: '',
        },
      ],
      pointName: '',
      // 使用自定义模板参数

      tableRequest: {
        api: '/garbage/garbageTransferRegister/list',
        params: {
          townId: this.communityType,
        },
      },
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
     * @param {Object}request包含你所有的请求数据
     */
    getStatisticData(request) {
      this.$http({
        url: this.$http.adornUrl('/garbage/garbageTransferRegister/count'),
        method: 'post',
        data: this.$http.adornData({
          search: request.data.search,
          startTime: request.data.startTime,
          endTime: request.data.endTime,
          // townId: request.data.townId,
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
     * @param {Number}id 传入当前表格行的id
     */
    viewContent(id) {
      this.$http({
        url: this.$http.adornUrl(
          `/garbage/garbageTransferRegister/info?id=${id}`,
        ),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.totalCount = data.data.totalCount;
          this.greenWaste = data.data.greenWaste;
          this.foodWaste = data.data.foodWaste;
          this.otherWaste = data.data.otherWaste;
          this.recyclableWaste = data.data.recyclableWaste;
          this.harmfulWaste = data.data.harmfulWaste;
          this.foodAccuracy = data.data.foodAccuracy;
          this.withdrawTime = data.data.withdrawTime;
          this.foodDriName = data.data.foodDriName;
          this.otherDirName = data.data.otherDirName;
          this.recyclableDirName = data.data.recyclableDirName;
          this.harmfulDirName = data.data.harmfulDirName;
          this.name = data.data.garbageMemberEntity == null
            ? ''
            : data.data.garbageMemberEntity.name;
          this.phone = data.data.garbageMemberEntity == null
            ? ''
            : data.data.garbageMemberEntity.phone;
          this.imgList = data.data.imgList;
          this.pointName = data.data.transferPoint == null ? '' : data.data.transferPoint.name;
        } else {
          this.$message.error(data.msg);
        }
      });

      this.dialogLookVisible = true;
    },
    /**
     * @description: 点击树触发的事件
     * @param {Object}obj 树结点数据,包含该节点的子孙节点
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
        this.$refs.template.getTableList(this.tableRequest);
      }
    },
    /**
     * @description: 点击树结点获取相应的子节点
     * @param {Object}data 迭代树节点，判断data是否含有子节点
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
    /**
     * @description:下拉框变更触发搜索
     */
    typeChange() {
      this.tableRequest.params.townId = this.communityType;
      this.$refs.template.getTableList(this.tableRequest);
    },
  },
};
</script>
<style lang="less" scoped>
.add-task-dialog {
  //弹窗表头样式
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
      width: 1050px;
      display: flex;
      justify-content: space-around;
      white-space: nowrap;
      .middle_span {
        color: #999999;
        .span_td {
          font-weight: bold;
          text-align: center;
          color: #333333;
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
      padding: 10px;
      margin-left: 70px;
      display: flex;
      justify-content: space-around;
      white-space: nowrap;
      .second_span {
        color: #999999;
      }
      .span_td {
        font-weight: bold;
        text-align: center;
        color: #333333;
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
//统计数据样式
.statistic_table {
  display: flex;
  justify-content: space-around;
  .statistic {
    font-size: 14px;
    color: #333333;

    font-weight: bold;
    display: inline-block;
    padding-left: 50px;
    height: 50px;
    width: 210px;
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
  display: flex;
  padding-top: 10px;
  height: 40px;
  flex: 1;
  justify-content: space-around;
  background-color: #f4f4f4;
  .statistic {
    font-size: 15px;
    color: #333333;
    margin-left: 20px;
    font-weight: bold;
    display: inline-block;
    height: 30px;
    width: 200px;
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
