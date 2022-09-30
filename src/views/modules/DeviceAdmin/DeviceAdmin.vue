<template>
  <div :class="[$style.DeviceAdmin,'device-admin']">
    <template>
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          style="letter-spacing: 1px"
          label="监控设备"
          name="0"
        >
          <DeviceAdminView
            v-if="activeName === '0'"
            title="监控视频管理"
            :uds="uds"
            type="0"
          />
        </el-tab-pane>
        <el-tab-pane
          style="letter-spacing: 1px"
          label="会场终端"
          name="1"
        >
          <DeviceAdminView
            v-if="activeName === '1'"
            title="会场终端管理"
            :uds="uds"
            type="1"
          />
        </el-tab-pane>
        <el-tab-pane
          style="letter-spacing: 1px"
          label="集群终端"
          name="2"
        >
          <DeviceAdminView
            v-if="activeName === '2'"
            title="集群终端管理"
            :uds="uds"
            type="2"
          />
        </el-tab-pane>
        <!-- <el-tab-pane
          style="letter-spacing: 1px"
          label="WeComm"
          name="3"
        >
          <DeviceAdminView
            v-if="activeName === '3'"
            title="WeComm管理"
            type="3"
          />
        </el-tab-pane> -->
        <el-tab-pane
          style="letter-spacing: 1px"
          label="会议软终端"
          name="4"
        >
          <DeviceAdminView
            v-if="activeName === '4'"
            title="会议软终端管理"
            :uds="uds"
            type="4"
          />
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
// uds
import { createClient } from '@/assets/js/uds/useUDS.js';
import DeviceAdminView from './DeviceAdminView.vue';

export default {
  components: {
    DeviceAdminView,
  },
  data() {
    return {
      activeName: '0',
      uds: {},
    };
  },
  created() {
    this.uds = createClient();
  },
  beforeDestroy() {
    this.uds.disconnect();
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name;
    },
  },
};

</script>

<style lang="scss" module>
.DeviceAdmin{
    width:100%;
    height:100%;
    &>div{
        height: 100%;
        display: flex;
        flex-direction: column;
        &>div{
            &:first-child{
                background: #Fff;
                border: none;
            }
            &:last-child{
                flex: 1;
                &>div{
                    height: 100%;
                }
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.device-admin{
    /deep/ .el-tabs__nav{
        border: none;
    }
    /deep/ .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item.is-top{
        color: #999;
        font-weight: bold;
        font-size: 14px;
        border: none;
    }
    /deep/ .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item.is-top.is-active {
        color: #333 !important;
        border-bottom: 2px solid #0091ff;
    }
}
</style>
