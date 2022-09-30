<!--通话记录组件-->
<template>
  <div>
    <el-card shadow="hover" v-for="(item,index) in logList" :key="index" style="margin: 10px 0">
      <div>
        <el-col :span="4" style="font-size: 45px;line-height: 80px;text-align: center;">
          <div v-if="item.direct=='已拨'" class="el-icon-top-right" style="color: greenyellow"></div>
          <div v-if="item.direct=='已接'" class="el-icon-bottom-left" style="color: blue"></div>
          <div v-if="item.direct=='未接'" class="el-icon-bottom-left" style="color: red"></div>
        </el-col>
        <el-col :span="20" style="text-align: left">
          <div style="height: 100%;width: 100%">
            <div style="padding-top: 10px;font-size: 14px;">
              时间:{{item.startTime}}
            </div>
            <div
              style="text-align:left;padding-top: 10px;display: flex;align-items: center;flex-wrap: nowrap;font-size: 10px">
              单位:
              <span style="flex: 1;font-size: 10px">
                  <el-link>{{item.workUnit}}</el-link>
                </span>
              <span style="flex: 1; overflow:auto;font-size: 10px">
                  <el-link @click="callPhone(item)">{{item.call}}</el-link>
                </span>
            </div>
          </div>
        </el-col>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "callLogModel",
    data() {
      return {
        logList: [],//历史列表
      }
    },
    mounted() {
      let data = {day:3}
      this.$api.recentDayContactor(data).then((res) => {
        if (res.errorcode == 0) {
          this.logList = res.data.data
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    methods: {
      callPhone(obj){
        this.$emit('callPhone',obj)
      }
    }
  }
</script>

<style scoped>

</style>
