<!-- 报告单位表单项 需求432-->
<template>
  <div class="report-unit-container">
    <el-autocomplete
      v-model="unitName"
      :fetch-suggestions="queryReportingUnit"
      :title="unitName"
      :placeholder="placeholder"
      style="width: 100%"
      @change="$emit('input', unitName)"
      @select="$emit('select', unitName)"
    >
      <template slot-scope="{ item }">
        <div class="autocomplete-item">
          <span class="autocomplete-item-left">{{ item.value }}</span>
          <i
            class="el-icon-close autocomplete-item-right"
            @click.stop="deleteReportingUnit(item)"
          />
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'ReportUnit',
  props: {
    unit: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      unitName: '',
      reportingUnitList: [],
    };
  },
  watch: {
    unit: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.unitName = newVal;
        console.log('监听报告单位：', newVal);
      },
    },
  },
  mounted() {
    this.unitName = this.unit;
    this.reportingUnitList = this.getReportingUnitListFromStorage();
  },
  methods: {
    /**
     * @description 删除报告单位
     */
    deleteReportingUnit(item) {
      const _index = this.reportingUnitList.findIndex((el) => el.value === item.value);
      this.reportingUnitList.splice(_index, 1);
      sessionStorage.setItem('reportingUnitList', JSON.stringify([...new Set(this.reportingUnitList)]));
    },
    /**
     * @description 从缓存里获取报告单位
     */
    getReportingUnitListFromStorage() {
      return JSON.parse(sessionStorage.getItem('reportingUnitList')) || [];
    },
    /**
     * @description 将报告单位输入记录保存到缓存里
     */
    setReportingUnitListFromStorage(reportUnit) {
      if (reportUnit) {
        const _index = this.reportingUnitList.findIndex((el) => el.value === reportUnit);
        if (_index < 0) {
          this.reportingUnitList.unshift({ value: reportUnit });
          if (this.reportingUnitList.length > 10) {
            this.reportingUnitList.splice(10, 1); // 只保存最新10条数据
          }
          sessionStorage.setItem('reportingUnitList', JSON.stringify([...new Set(this.reportingUnitList)]));
        }
      }
    },
    /**
     * @description 搜索报告单位
     */
    queryReportingUnit(queryString, cb) {
      const filterData = this.reportingUnitList.filter((el) => queryString === el.value);
      const results = queryString && filterData.length > 0 ? filterData : this.reportingUnitList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
  },
};
</script>

<style lang="scss">
@use './assets/ReportUnit.scss';
</style>
