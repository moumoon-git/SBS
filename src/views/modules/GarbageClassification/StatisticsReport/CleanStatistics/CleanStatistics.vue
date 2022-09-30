<!--
 * @Author: yanghaohao
 * @Date: 2020-09-22 10:13:06
 * @LastEditTime: 2021-01-05 11:41:39
 * @LastEditors: Please set LastEditors
 * @Description: 垃圾分类中统计分析的保洁消杀页面
 * @FilePath: \SBS\src\views\modules\GarbageClassification\
              StatisticsReport\CleanStatistics\CleanStatistics.vue
-->

<template>
  <div>
    <sv-template
      ref="template"
      :search-setting="{
        width:'270px',
        placeholder:'请输入分类点、保洁人员名称关键字'
      }"
      title="保洁消杀"
      :table-request="tableRequest"
      @refresh="getStatisticData"
    >
      <template #left__container>
        <div />
      </template>
      <template #middle__operation__select>
        <sv-select
          v-model="townId"
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
              消杀总数
            </tr>
          </span>
          <span class="span_line" />
          <span class="statistic">
            <td class="span_td">{{ statisticList.memberCount }}</td>

            <tr class="span_tr">
              保洁人数
            </tr>
          </span>
        </table>
      </template>
      <template #middle__table>
        <el-table-column
          prop="withdrawTime"
          header-align="center"
          align="center"
          label="保洁时间"
        />
        <el-table-column
          prop="sortName"
          header-align="cneter"
          align="center"
          label="分类点名称"
        />
        <el-table-column
          prop="townName"
          header-align="cneter"
          align="center"
          label="所属社区"
        />
        <el-table-column
          prop="memberName"
          header-align="center"
          align="center"
          label="保洁人员"
        />
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="保洁情况"
        />

        <el-table-column
          header-align="center"
          align="center"
          width="150"
          label="保洁照片"
        >
          <template slot-scope="scope">
            <viewer>
              <img
                v-for="(item, index) in scope.row.imgList"
                :key="index"
                :src="item.allUrl"
                style="width:50px;"
              >
            </viewer>
          </template>
        </el-table-column>
      </template>
    </sv-template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      townId: '',
      communityOptions: [],
      statisticList: [],
      // 使用自定义模板参数
      tableRequest: {
        api: '/garbage/garbageWithdraw/list',
        params: {
          townId: this.townId,
          type: 2,
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
     * @param {Object}request 包含你所有的请求数据
     */
    getStatisticData(request) {
      this.$http({
        url: this.$http.adornUrl('/garbage/garbageWithdraw/count'),
        method: 'post',
        data: this.$http.adornData({
          search: request.data.search,
          startTime: request.data.startTime,
          endTime: request.data.endTime,
          townId: request.data.townId,
          type: 2,
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
     */
    viewContent() {
      this.dialogLookVisible = true;
    },
    /**
     * @description:选择下拉框时搜索更新表格
     */
    typeChange() {
      this.tableRequest.params.townId = this.townId;
      this.$refs.template.getTableList(this.tableRequest);
    },
  },
};
</script>
<style lang="less" scoped>
//统计数据样式
.statistic_table{
  display:flex;
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
      .span_line{
      display: block;
      width: 2px;
      height: 20px;
      margin: 9px 5px;
      background-color: rgba(0,0,0,.05);
    }}
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
