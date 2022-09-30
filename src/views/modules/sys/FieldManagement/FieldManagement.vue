<template>
  <div :class="$style.container">
    <div :class="$style.tabs">
      <button
        :class="{ [$style.activeTab]: activeComponent === 'DistrictManagement' }"
        @click="activeComponent = 'DistrictManagement'"
      >
        区域管理
      </button>
      <button
        :class="{ [$style.activeTab]: activeComponent === 'EventType' }"
        @click="activeComponent = 'EventType'"
      >
        事件类型
      </button>
      <!-- 需求432 - 隐藏报告单位 -->
      <!-- <button
        :class="{ [$style.activeTab]: activeComponent === 'ReportingUnit' }"
        @click="activeComponent = 'ReportingUnit'"
      >
        报告单位
      </button> -->
    </div>
    <keep-alive>
      <component :is="activeComponent" />
    </keep-alive>
  </div>
</template>

<script>
import DistrictManagement from './modules/DistrictManagement/DistrictManagement.vue';
import EventType from './modules/EventType/EventType.vue';
import ReportingUnit from './modules/ReportingUnit/ReportingUnit.vue';

export default {
  name: 'FieldManagement',
  components: {
    // 区域管理
    DistrictManagement,
    // 事件类型
    EventType,
    // 报告单位
    ReportingUnit,
  },
  data() {
    return {
      activeComponent: 'DistrictManagement',
    };
  },
};
</script>

<style lang="scss" module>
.tabs {
  display: inline-block;
  font-size: 0;
  margin-bottom: 10px;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  & > button {
    border: none;
    outline: none;
    cursor: pointer;
    background: #FFF;
    padding: 0;
    margin: 0;
    font-size: 14px;
    width: 100px;
    height: 30px;
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    &:not(.activeTab):hover {
      color: #0091FF;
    }
    &.activeTab {
      background: #0091FF;
      color: #FFF;
    }
  }
}
.container {
  :global(.sv-template__container) {
    height: calc(100vh - 152px);
  }
}
</style>
