<!--
 * @Author: linhuiting
 * @Date: 2020-10-15 13:53:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-03 10:42:10
 * @Description: 要情记录之工单信息
 * @FilePath: \SBS\src\views\modules\event\emergency\emergencyhandleOrder.vue
-->
<template>
  <div>
    <div v-if="openView === '0'">
      <InspectionSheetManagement
        :sheet-data="sheetData"
        class="mainContent"
        @changeToView="changeToView"
      />
    </div>
    <div v-if="openView === '1'">
      <ViewSheetManagement
        ref="viewSheet"
        :sheet-data="sheetData"
        class="mainContent"
      />
    </div>
  </div>
</template>

<script>
import inspectionSheetManagement from '@/views/modules/riskInvestigation/inspectionSheetManagement/releaseSheet/releaseSheet-copy.vue';
import viewSheetManagement from '@/views/modules/riskInvestigation/inspectionSheetManagement/viewSheet/viewSheet-copy.vue';

export default {
  components: {
    InspectionSheetManagement: inspectionSheetManagement,
    ViewSheetManagement: viewSheetManagement,
  },
  props: {
    isOpen: {
      type: String,
      defalut: '0',
      required: true,
    },
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
        module: '1',
        property: '',
        status: '',
        type: '',
        search: '',
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
     * @description: 保存完后从新增页面转到详情页面
     * @param {*}
     * @return {*}
     */
    changeToView() {
      this.openView = '1';
      this.$nextTick(() => {
        this.$refs.viewSheet.init(this.sheetData.id);
      });
    },
    /**
     * @description:
     * @param {*}
     * @return {*}
     */
    viewSheetData() {
      this.openView = this.isOpen === '2' ? '0' : this.isOpen;
      if (this.openView === '1') {
        this.$nextTick(() => {
          this.$refs.viewSheet.init(this.sheetData.id);
        });
      }
    },
    /**
     * @description:
     * @param {*}
     * @return {*}
     */
    // addOrView() {
    //   this.$http({
    //     url: this.$http.adornUrl(
    //       '',
    //     ),
    //     method: 'post',
    //     params: this.$http.adornParams({
    //     }),
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       data.data.forEach((item) => {
    //         this.workListOptions.push({
    //           value: item.code,
    //           label: item.name,
    //         });
    //       });
    //     } else {
    //       this.$message.error(data.msg);
    //     }
    //   });
    // },
  },

};
</script>

<style scoped>

  .mainContent {
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
