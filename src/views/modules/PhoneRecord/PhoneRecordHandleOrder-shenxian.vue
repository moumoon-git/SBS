<!--
 * @Author: linhuiting
 * @Date: 2020-10-15 13:53:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-04 11:24:03
 * @Description: 要情记录之工单信息
 * @FilePath: \SBS\src\views\modules\event\emergency\emergencyhandleOrder.vue
-->
<template>
  <div>
    <div v-if="sheetData.isOpen === '1'">
      <ViewSheetManagement
        ref="viewSheet"
        :sheet-data="sheetData"
        class="mainContent"
      />
    </div>
    <div
      v-else
      class="no-data"
    >
    <template>
                <img
                  class="no-data__empty"
                  alt="暂无数据"
                  src="../../../sinvieUI/img/table_empty.svg"
                >
                <p class="no-data__font">暂无工单信息</p>
              </template>
    </div>
  </div>
</template>

<script>
import viewSheetManagement from '@/views/modules/riskInvestigation/inspectionSheetManagement/viewSheet/viewSheet-shenxian.vue';

export default {
  components: {
    ViewSheetManagement: viewSheetManagement,
  },
  props: {
    sheetData: {
      type: Object,
      defalut: {},
      required: true,
    },
  },
  data() {
    return {
      searchName: '',
      // 查询条件
      queryList: {
        page: 1,
        limit: 10,
        groupIds: [-1],
        startTime: '',
        endTime: '',
        module: '',
        property: '',
        status: '',
        type: '',
        search: '',
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
      openView: '',
      // 日期选择栏取值，是一个数组，dateValue[0, 1] = [startTime, endTime]
      dateValue: '',
      // 获取到的表单数据
      sheetTableData: [],
      // 判定弹窗是发布还是编辑
      editWhich: '',
      // 判定查看哪一行表单
      viewWhich: '',
      // 分页器显示数据总数
      totalCount: 0,
    };
  },

  mounted() {
    // this.addOrView();
    this.viewSheetData();
  },
  methods: {
    /**
     * @description:
     * @param {*}
     * @return {*}
     */
    viewSheetData() {
      this.queryList.targetId = this.sheetData.id;
      let url = window.SITE_CONFIG["baseUrl"] + "/work/workSheet/list";
      let that = this;
      this.$http.post(url, that.queryList, { emulateJSON: true }).then(
        function (res) {
          // 表单列表保存在本地数组sheetTableData中
          that.sheetTableData = res.data.page.list;
          that.totalCount = res.data.page.totalCount;
          console.log("获取表单数据：\n", res, that.totalCount);
          if (that.sheetData.isOpen === '1') {
 
             that.$refs.viewSheet.init(that.sheetTableData[0].id);
           
      }
        },
        function (res) {
          console.log("getWorkData()获取数据失败！\n错误信息：\n", res);
        }
      );
       
      
    },
  },

};
</script>

<style scoped lang="scss">

  .mainContent {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .no-data {
    background: #fff;
    width: 100%;
    height: 100%;
    position: relative;
    &__empty {
      display: flex;
      position: absolute;
      top: 33%;
      left: 49%
    }
    &__font {
      display: flex;
      position: absolute;
      top: 50%;
      left: 50%
    }
  }
</style>
