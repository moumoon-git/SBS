<template lang="">
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    highlight-current-row
    row-key="id"
    @row-click="handleClick"
  >
    <el-table-column
      label="通话类型"
      align="center"
    >
      <template slot-scope="scope">
        <div v-if="scope.row.direct === '已拨'">
          <img
            style="height: 16px; width: 16px"
            src="data:image/png;base64,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"
            alt
          >
          已拨
        </div>
        <div
          v-else-if="scope.row.direct === '未接'"
          style="color: #ff0000"
        >
          <img
            style="height: 16px; width: 16px"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB6klEQVQ4T42TT0jTYRjHvz9NIZmgIOix444FBgYLAz0YeBh0yEHgwA5CQRuxQyRktA5BscU6DBZkIDRoHTrtYAcPDZUOGSEsQrwkBB0aEUhazc/j3slvc81eePc+/77f9/s872+eWFVp7LeU9qRT2NkT0i1sQo2L3CiRL+Q2LUPBJY+fy9gLBOcp2MDOcS52SYlmgj0pRN2zTin8h3ryFSP4hpHg1gUD7EqnO6R3f6Wz3dJ6C5JxSIrEC2AiRlCl+Iy/mNgKRQVueuQnQFmAm4vk1rEnyEc9ZL0nkIbtuetrhvMJpOeaFQC+aa0DfPxLCnJmPIL3YBuG4OIPaaCn1lIEP98sv5Xv7TB5BvYZNhvQGvK3OLP4D/6LwIpQkUGyqTiPPUnoJQQXICodR0KN9F3q65U+4jwFeNe1NetUfWpHckBgy73xEqArBF9BkmI2U/gT+B+sBh+RGsTfruMOCXwvkHagkiO5Si7GrtjrsIcgegvTLOCNBgI3jxsUJJ2S1wx1mvhDdoA5xcktk7uNH+a0j+roAhQlmiOZ5Ku8b/8Lm1N/TUW95RSGtdd68UmPAH7BjV+RG7Mn9lfS3jVyc/8kcEMz2XcovM5ehTDPLhMLGZiaSFuC+o0/GdxJbgQYBhAEXCYX5wN8sw9Dp48fbCixtwAAAABJRU5ErkJggg=="
            alt
          >
          未接
        </div>

        <div v-else>
          <img
            style="height: 16px; width: 16px"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACdUlEQVQ4T42TTUhUURTHz7l3psQ2SUUhE7UQomyRWWCEYB8bE4IgIUiKkMaZN2AzhlDq6J0RCqLmjU4zOk8wo8JFLaJNtGgRGK6SirQWQVBBYkpNgWZv7j3dN/qCSMu7ufed8z+/83HvQ9ArGIlWI/KMPpZIpVqzyfiwY1/JQiMiyrRwRCl1mhRNci9/KG1Zm011v1gOEGyOVvb1dj9z/GiExQ0ieNfXI+KOoSkc3ccZv59JiI3LAJykT0CpO5meeBZDETFjS6qwemPvFwO0oOtt3v5ZZ12//MaFGJHOCAFbW8iKUAQEraTgFIZaxDyzV/lSqbbPBbEQzMjR67yERg0dcQH+sNjNUa5Z+MYyRHYNpaxFo6VrVOapI9sbf1xooVkc4RysjCl8S7ZQSAATNsGJgaR4jgFdGkN2XPe83wnQ5ffoUsf6zK6bK7qFhSAxkSdIWklhGUb7ZizyvkwnRMmKAYFmsZNxGv2Ymyt9MHjlu34XbQz40bQpqv4HQVcQCHee5AxjUx8mtpWXl9NUDka0cz5tjh8GuCv1dd9GBoeUVE/ncqxhaEj8KIzTBdTX1/MNvh0JbarOmLCnpgbY9gqIIaggAJvWwmkF0ACKGhnTO+GxdFKM/QY4IL/f7/UUl/YD0q6MGat0bKHQxXWKe7Z66OurVCo179gC4Y6DDPmwtLHuD4ALYcWbopyxhm+zUHWrX0wtNYdgRHQgQdFfAPcxNX1RZzyMJSSphJqdvGRZlu2CFv4feqQUGUsDFpWN59u3rFaeq3ouNUA0SAw/oYL1enJ+RXChPykG/wlwM549F93rRXZAA3yo1IyNdG/A7B53/L8AmboBY5+D+twAAAAASUVORK5CYII="
            alt
          >
          <span>{{ scope.row.direct }}</span>
          <!-- <span v-if="scope.row.callType === 0">呼入</span>
            <span v-if="scope.row.callType === 1">呼出</span> -->
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="联系人"
      align="center"
    >
      <template slot-scope="scope">
        <span v-if="scope.row.callType !== 4">
          {{ scope.row.contactor ? scope.row.contactor : '未知' }}
        </span>
        <span v-else>
          {{ scope.row.operator ? scope.row.operator : '未知' }}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="工作单位"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.workUnit ? scope.row.workUnit : '未知' }}
      </template>
    </el-table-column>
    <el-table-column
      label="职务"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.position ? scope.row.position : '未知' }}
      </template>
    </el-table-column>
    <el-table-column
      label="通话号码"
      align="center"
    >
      <template slot-scope="scope">
        <span v-if="scope.row.callType === 0">
          {{ scope.row.calling }}
        </span>
        <span v-else>
          {{ scope.row.callType === 1 ? scope.row.called : '无' }}
        </span>
      </template>
    </el-table-column>
    <el-table-column
      label="通话时间"
      align="center"
    >
      <template slot-scope="scope">
        {{ scope.row.startTime ? scope.row.startTime : '未知' }}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'PhoneTable',
  props: {
    tableData: {
      type: Array,
      default: () => ([]),
    },
    handleClick: {
      type: Function,
      default: () => null,
    },
  },
  data() {
    return {

    };
  },
};
</script>
<style lang="scss">

</style>
