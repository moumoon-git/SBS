<template>
  <div>
    <div class="headStyle">
      <el-steps
        :active="active"
        align-center
        finish-status="success"
      >
        <el-step
          v-for="(e, i) in [
            '版本信息',
            '参数设置',
            '专项指挥部',
            '现场指挥部',
            '预警响应',
            '应急响应',
            '应急保障',
            '文本目录',
            '完成']"
          :key="i"
          :title="e"
          style="cursor: pointer;"
          @click.native="changeStep(i)"
        />
      </el-steps>
    </div>
    <From1
      v-if="active == 0"
      @refreshList="nextStep"
    />
    <From2
      v-if="active == 1"
      @refreshList="nextStep"
      @refprev="frontStep"
    />
    <From3
      v-if="active == 2"
      @refreshList="nextStep"
      @refprev="frontStep"
    />
    <From32
      v-if="active == 3"
      @refreshList="nextStep"
      @refprev="frontStep"
    />
    <From4
      v-if="active == 4"
      @refreshList="nextStep"
      @refprev="frontStep"
    />
    <From5
      v-if="active == 5"
      @refreshList="nextStep"
      @refprev="frontStep"
    />
    <From6
      v-if="active == 6"
      @refreshList="nextStep"
      @refprev="frontStep"
    />
    <From7
      v-if="active == 7"
      @refreshList="nextStep"
      @refprev="frontStep"
    />
    <From8
      v-if="active == 8"
      @refprev="frontStep"
    />
  </div>
</template>

<script>
import From1 from './From1.vue';
import From2 from './From2.vue';
import From3 from './From3.vue';
import From32 from './From32.vue';
import From4 from './From4.vue';
import From5 from './From5.vue';
import From6 from './From6.vue';
import From7 from './From7.vue';
import From8 from './From8.vue';

export default {
  name: 'Organization',
  components: {
    From1,
    From2,
    From3,
    From32,
    From4,
    From5,
    From6,
    From7,
    From8,
  },
  data() {
    return {
      active: 0, // 步骤条
    };
  },
  created() {
    this.active = Number(sessionStorage.getItem('preplanActive'));
  },
  methods: {
    // 公用上一步函数
    frontStep() {
      this.active -= 1;
      if (this.active < 0) {
        this.active = 0;
      }
      sessionStorage.setItem('preplanActive', this.active);
    },
    // 公用下一步函数
    nextStep() {
      this.active += 1;
      if (this.active > 8) {
        this.active = 8;
      }
      sessionStorage.setItem('preplanActive', this.active);
    },
    // 点击流程任一点
    changeStep(i) {
      this.active = i;
      sessionStorage.setItem('preplanActive', this.active);
    },
  },
};
</script>

<style scoped>
  .headStyle {
    padding: 10px;
    position: relative;
    background: #fff;
    box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
    border-radius: 3px;
    margin-bottom: 10px;
  }
  .stepStyle {
    position: relative;
    display: flex;
    align-items: center;
  }
  .doing {
    width: 30px;
    height: 30px;
    text-align: center;
    cursor: pointer;
    border-radius: 50%;
    color: #fff;
    background: rgba(0, 145, 255, 1);
    line-height: 30px;
  }
  .hasdown {
    width: 30px;
    height: 30px;
    text-align: center;
    cursor: pointer;
    border-radius: 50%;
    color: #fff;
    background: rgba(11, 210, 149, 1);
    line-height: 30px;
  }
  .notdown {
    width: 30px;
    height: 30px;
    text-align: center;
    cursor: pointer;
    border: 2px solid #E5E9F1;
    border-radius: 50%;
    color: rgba(153, 153, 153, 1);
    line-height: 30px;
  }
  .doingtext {
    color: rgba(0, 145, 255, 1);
  }
  .hasdowntext {
    color: rgba(11, 210, 149, 1);
  }
  .notdowntext {
    color: rgba(153, 153, 153, 1);
  }
  .line {
    width: 9vw;
    height: 3px;
    background: #E5E9F1;
  }
  .blueline {
    width: 9vw;
    height: 3px;
    background: rgba(0, 145, 255, 1);
  }
  .greenline {
    width: 9vw;
    height: 3px;
    background: rgba(11, 210, 149, 1);
  }
  .el-steps .el-step>>>.el-step__main>.el-step__title.is-success {
    color: #0091FF;
  }
  .el-steps .el-step>>>.el-step__head.is-success {
    color: #0091FF;
    border-color: #0091FF;
  }
  .el-steps .el-step>>>.el-step__head.is-process {
    color: #0091FF;
    border-color: #0091FF;
  }
  .el-steps .el-step>>>.el-step__main>.el-step__title.is-process {
    color: #0091FF;
  }
</style>
