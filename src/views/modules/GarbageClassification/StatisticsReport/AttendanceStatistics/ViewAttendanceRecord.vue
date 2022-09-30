<!--
 * @Author: yanghaohao
 * @Date: 2020-10-26 14:26:54
 * @LastEditTime: 2020-10-26 17:59:09
 * @LastEditors: Please set LastEditors
 * @Description: 签到打卡查看弹窗
 * @FilePath: \SBS\src\views\modules\GarbageClassification\StatisticsReport\AttendanceStatistics\viewAttendanceRecord.vue
-->

<template>
  <!-- 打卡记录弹窗 -->
  <el-dialog
    width="1000px"
    title="打卡记录"
    :visible.sync="dialogLookVisible"
    class="add-task-dialog"
    @closed="closeDialog"
  >
    <div class="container_front">
      <div class="front_span2">
        打卡地点：
        <span class="front_font">{{ dataFormCard.sortName }}</span>
      </div>
      <span class="front_span">
        考勤班次：
        <span class="front_font">{{ dataFormCard.startTime }}~{{ dataFormCard.endTime }}</span>
      </span>
      <span class="front_span">
        打卡人员：
        <span class="front_font">{{ dataFormCard.name }}({{ dataFormCard.phone }})</span>
      </span>
      <span class="front_span">
        打卡次数：
        <span class="front_font2">{{ dataFormCard.punchclockCount }}</span>
      </span>
    </div>

    <div
      v-for="(item, index) in dataFormCard.garbagePunchClockList"
      :key="`punchList${index}`"
      class="container_bottom"
    >
      <span class="bottom_span">{{ item.punchclockTime }}</span>
      <span
        v-if="item.type == 0"
        class="state_span2"
      >缺勤</span>
      <span
        v-else-if="item.type == 1"
        class="state_span"
      >签到打卡</span>
      <span
        v-else-if="item.type == 2"
        class="state_span"
      >离岗打卡</span>
      <span
        v-else-if="item.type == 3"
        class="state_span"
      >更新签到打卡</span>
      <span
        v-else-if="item.type == 4"
        class="state_span"
      >更新离岗打卡</span>

      <viewer :images="photoUrlList">
        <img
          v-for="(imageItem, imageIndex) in item.imgList"
          :key="`punchImg${imageIndex}`"
          :src="imageItem.allUrl"
          alt="签到图片"
          style="height: 150px"
        >
      </viewer>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    // 打卡弹窗的参数
    return {
      dataFormCard: {
        name: '',
        phone: '',
        sortName: '',
        startTime: '',
        endTime: '',
        punchclockCount: '',
        garbagePunchClockList: [
          {
            punchclockTime: '',
            type: '',
            imgList: '',
          },
        ],
      },
      photoUrlList: [],
      dialogLookVisible: false,
    };
  },

  methods: {
    init(id) {
      this.dialogLookVisible = true;
      this.$http({
        url: this.$http.adornUrl(`/garbage/garbagePunchClock/info?id=${id}`),
        method: 'get',
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataFormCard.name = data.data.memberEntity.name;
          this.dataFormCard.phone = data.data.memberEntity.phone;
          this.dataFormCard.sortName = data.data.sortName;
          this.dataFormCard.startTime = data.data.shiftEntity.startTime;
          this.dataFormCard.endTime = data.data.shiftEntity.endTime;
          this.dataFormCard.punchclockCount = data.data.punchclockCount;
          this.dataFormCard.garbagePunchClockList = data.data.shiftEntity.garbagePunchClockList;
          this.photoUrlList = [];
          this.dataFormCard.garbagePunchClockList.forEach((v) => {
            v.imgList.forEach((item) => {
              this.photoUrlList.push(item.allUrl);
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    closeDialog() {
      this.dialogLookVisible = false;
    },
  },
};
</script>
