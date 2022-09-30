<!--
 * @Author: liukanglin
 * @Date: 2020-12-01 15:08:59
 * @LastEditors: Liukanglin
 * @LastEditTime: 2021-01-05 19:48:59
 * @Desc: 工单总览头部
 * @FilePath: /SBS/src/views/modules/PerformanceStatistics/WorkOrderOverview/WorkOrderOverview-header.vue
-->
<template>
  <div>
    <div class="work-order-overview-header">
      <!-- 工单总览头部上部分 -->
      <div class="overview-header">
        <div class="header">
          <div class="header__left">
            工单总览
          </div>
          <div class="header__right">
            <div
              :class="['header__right__all',
                       {'header__right--active': selectStatus === 'all'}]"
              @click="emitDate('1','all')"
            >
              全部
            </div>
            <div
              :class="['header__right__week',
                       {'header__right--active': selectStatus === 'week'},
              ]"
              @click="emitDate('1','week')"
            >
              近7天
            </div>
            <div
              :class="['header__right__month',
                       {'header__right--active': selectStatus === 'month'},
              ]"
              @click="emitDate('1','month')"
            >
              近30天
            </div>
            <div class="header__right__date">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="((val) =>{emitDate(val,'select')})"
              />
            </div>
          </div>
        </div>
        <!-- 工单总览头部内容区 -->
        <div class="content">
          <div class="content__canvas">
            <div class="content__canvas__margin">
              <canvas id="telCanvas" />
            </div>
            <div class="content__canvas__list">
              <div><div>催办数量</div><div>{{ workOrderOverviewHeaderLeftData.urge }}</div></div>
              <div class="content__canvas__list__line" />
              <div><div>处置中</div><div>{{ workOrderOverviewHeaderLeftData.hadling }}</div></div>
              <div class="content__canvas__list__line" />
              <div><div>已处置</div><div>{{ workOrderOverviewHeaderLeftData.finish }}</div></div>
            </div>
          </div>
          <div
            v-loading="totalListLoading"
            class="content__left"
            element-loading-spinner="sv-loading"
          />
          <div
            v-loading="typeListLoading"
            class="content__right"
            element-loading-spinner="sv-loading"
          >
            <div
              :class="currentPosition === 0 ? 'content__btn__left': 'content__btn__left__dark'"
              @click="moveToLeft"
            />
            <!-- 工单列表 -->
            <div
              class="content__list"
            >
              <div
                ref="contentListBox"
                class="content__list__box"
              >
                <!-- 各类工单类型统计 -->
                <div
                  v-for="(item,index) in workOrderOverviewHeaderRightData"
                  :key="index"
                  class="content__list__box__list"
                >
                  <div
                    v-if="item.typeId === '3'"
                    class="content__list__box__list__title"
                  >
                    人员预警
                  </div>
                  <div
                    v-else-if="item.typeId === '4'"
                    class="content__list__box__list__title"
                  >
                    车辆预警
                  </div>
                  <div
                    v-else-if="item.typeId === '5'"
                    class="content__list__box__list__title"
                  >
                    小区隐患
                  </div>
                  <div
                    v-else-if="item.typeId === '6'"
                    class="content__list__box__list__title"
                  >
                    学校隐患
                  </div>
                  <div
                    v-else-if="item.typeId == '8'"
                    class="content__list__box__list__title"
                  >
                    违规预警
                  </div>
                  <div
                    v-else-if="item.typeId === '9'"
                    class="content__list__box__list__title"
                  >
                    视屏巡查
                  </div>
                  <div
                    v-else-if="item.typeId === '10'"
                    class="content__list__box__list__title"
                  >
                    巡查发现
                  </div>
                  <div class="content__list__box__list__bottom">
                    <div class="content__list__box__list__bottom__top">
                      <div class="content__list__box__list__bottom__top__number">
                        <div>{{ item.total }}</div>
                        <div>{{ parseFloat(item.ratio).toFixed(2) }}%</div>
                      </div>
                      <div class="content__list__box__list__bottom__top__line" />
                      <div class="content__list__box__list__bottom__top__total">
                        <div>总数</div>
                        <div>占比</div>
                      </div>
                    </div>
                    <div class="content__list__box__list__bottom__prescription">
                      <div>平均处理时效</div>
                      <div>{{ item.avghandleTime }}(小时)</div>
                    </div>
                    <div class="content__list__box__list__bottom__time">
                      <div>平均响应时效</div>
                      <div>{{ item.avgResponseTime }}(小时)</div>
                    </div>
                    <div class="content__list__box__list__bottom__response">
                      <div>响应率</div>
                      <div>{{ parseFloat(item.responseRatio).toFixed(2) }}%</div>
                    </div>
                    <div class="content__list__box__list__bottom__deel">
                      <div>处置率</div>
                      <div>{{ parseFloat(item.handleRatio).toFixed(2) }}%</div>
                    </div>
                    <div class="content__list__box__list__bottom__img" />
                  </div>
                </div>
              </div>
            </div>
            <div
              :class="currentPosition === workOrderOverviewHeaderRightData.length - 6 ?
                'content__btn__right__dark':'content__btn__right'"
              @click="moveToRight"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import circleUrl from './Image/circle.svg';
import mainUrl from './Image/main.svg';

export default {
  props: {
    workOrderOverviewHeaderLeftData: {
      type: Object,
      default: () => ({}),
    },
    workOrderOverviewHeaderRightData: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      currentPosition: 0, // 标记当前位置
      dateRange: ['', ''], // 选择日期
      dateLimit: ['', ''], // 限制日期
      // 工单类型列表数据请求中
      typeListLoading: false,
      // 工单总量数据请求中
      totalListLoading: false,
      // 当前选中状态
      selectStatus: '',
    };
  },
  mounted() {
    // 渲染电话总量图
    this.drawPhone();
  },
  methods: {
    /**
     * @description: canvas画出电话总量图
     */
    drawPhone() {
      const canvas = document.getElementById('telCanvas');
      const ctx = canvas.getContext('2d');
      const canvasWidth = 140;
      const canvasHeight = 140;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const circleImg = new Image();
      circleImg.src = circleUrl;
      const mainImg = new Image();
      mainImg.src = mainUrl;
      let alp = 1;
      let lighter = false;
      const render = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(circleImg, 0, 0, canvasWidth, canvasHeight);
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.globalAlpha = alp;
        // 保存当前的绘图状态
        ctx.save();
        ctx.translate(15, 22);
        ctx.drawImage(mainImg, 0, -10, 110, 110);
        // 恢复之前保存的绘图状态
        ctx.restore();
        // 保存当前的绘图状态
        ctx.save();
        ctx.translate(15, 22);
        ctx.rotate((180 * Math.PI) / 180);
        ctx.drawImage(mainImg, -110, -110, 110, 110);
        // 恢复之前保存的绘图状态
        ctx.restore();
        // ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        // 轻微模糊阴影
        ctx.shadowBlur = 2;
        ctx.globalAlpha = 1;
        ctx.font = 'bold 34px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(this.workOrderOverviewHeaderLeftData.total, 70, 80);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('工单总量', 70, 100);
        if (alp <= 1 && alp >= 0) {
          requestAnimationFrame(render);
          if (lighter) {
            if (alp + 0.005 > 1) {
              lighter = !lighter;
            } else {
              alp += 0.005;
            }
          } else {
            if (alp - 0.005 < 0.1) {
              lighter = !lighter;
            } else {
              alp -= 0.005;
            }
          }
        }
      };
      mainImg.onload = () => {
        requestAnimationFrame(render);
      };
    },
    /**
     * @description: 选择日期
     * @param {val} 传入自定义的值或者时间选择器绑定的值
     * @param {type} 选中的类型 all(全部) week(近七天) month(近一个月) select(手动选择时间)
     */
    emitDate(val, type) {
      const dateTime = new Date();
      if (val === null) {
        this.dateRange = ['', ''];
        this.selectStatus = '';
        this.$emit('change-date', this.dateRange);
        return;
      }
      if (this.dateLimit === null) {
        this.dateLimit = ['', ''];
        this.selectStatus = '';
        this.$emit('change-date', this.dateLimit);
        return;
      }
      switch (type) {
        case 'select': {
          this.dateRange[1] = `${(this.dateRange[1].split('00:00:00'))[0]}23:59:59`;
          this.selectStatus = '';
          this.$emit('change-date', this.dateRange);
          break;
        }
        case 'all': {
          this.dateLimit = ['', ''];
          this.selectStatus = 'all';
          this.$emit('change-date', this.dateLimit);
          break;
        }
        case 'week': {
          const beginTime = new Date(dateTime.getTime() - 7 * 24 * 60 * 60 * 1000);
          this.formatDate(beginTime, new Date());
          this.selectStatus = 'week';
          this.$emit('change-date', this.dateLimit);
          break;
        }
        case 'month': {
          const beginTime = new Date(dateTime.getTime() - 30 * 24 * 60 * 60 * 1000);
          this.formatDate(beginTime, new Date());
          this.selectStatus = 'month';
          this.$emit('change-date', this.dateLimit);
          break;
        }
        default:
      }
    },
    /**
     * @description: 整理时间格式
     * @param {Object} beginTime 开始时间
     * @param {Object} dateTime 当前时间
     */
    formatDate(beginTime, dateTime) {
      const beginYear = new Date(beginTime).getFullYear();
      const beginMonth = new Date(beginTime).getMonth() + 1 < 10 ? (`0${new Date(beginTime).getMonth()}${1}`) : new Date(beginTime).getMonth() + 1;
      const beginDate = new Date(beginTime).getDate() < 10 ? (`0${new Date(beginTime).getDate()}`) : new Date(beginTime).getDate();
      const endYear = new Date(dateTime).getFullYear();
      const endMonth = new Date(dateTime).getMonth() + 1 < 10 ? (`0${new Date(dateTime).getMonth()}${1}`) : new Date(dateTime).getMonth() + 1;
      const endDate = new Date(dateTime).getDate() < 10 ? (`0${new Date(dateTime).getDate()}`) : new Date(dateTime).getDate();
      this.dateLimit[0] = `${beginYear}-${beginMonth}-${beginDate} 00:00:00`;
      this.dateLimit[1] = `${endYear}-${endMonth}-${endDate} 23:59:59`;
    },
    /**
     * @description: 工单列表向左移动
     */
    moveToLeft() {
      if (this.currentPosition === 0) {
        return;
      }
      this.currentPosition -= 1;
      if (this.currentPosition >= 0) {
        this.$refs.contentListBox.style.marginLeft = `${-(this.currentPosition * 220)}px`;
      }
    },
    /**
     * @description: 工单列表向右移动
     */
    moveToRight() {
      if (this.currentPosition === this.workOrderOverviewHeaderRightData.length - 6) {
        return;
      }
      this.currentPosition += 1;
      const index = this.currentPosition + 6;
      if (index <= this.workOrderOverviewHeaderRightData.length) {
        this.$refs.contentListBox.style.marginLeft = `${-(this.currentPosition * 220)}px`;
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .work-order-overview-header {
    .overview-header{
      box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
      background-color: #ffffff;
      // height: calc(100vh - 673px);
    // 工单总览头部上部分
    .header {
      border-radius: 4px;
      background-color: #ffffff;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header__left {
        font-size: 16px;
        height: 16px;
        line-height: 16px;
        // font-weight: bold;
        border-left: 3px solid #15a6fc;
        margin-left: 20px;
        padding-left: 10px;
      }
      .header__right {
        display: flex;
        align-items: center;
        //全部时间
        .header__right__all {
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          border: 1px solid #dddddd;
          border-right: 0.5px solid #dddddd;
          border-radius: 4px 0 0 4px;
          color: #b4b4b4;
          &:hover {
            border-color: #b4b4b4;
            cursor: pointer;
          }
        }
        //近七天时间
        .header__right__week {
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          border: 1px solid #dddddd;
          border-right: 0.5px solid #dddddd;
          color: #b4b4b4;
          &:hover {
            border-color: #b4b4b4;
            cursor: pointer;
          }
        }
        // 近三十天时间
        .header__right__month {
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          border: 1px solid #dddddd;
          border-left: 0.5px solid #dddddd;
          margin-right: 5px;
          border-radius: 0 4px 4px 0;
          color: #b4b4b4;
          &:hover {
            border-color: #b4b4b4;
            cursor: pointer;
          }
        }
        //激活状态
        .header__right--active{
          border: 1px solid #0091FF;
          border-color: #0091FF;
          color: #0091FF;
          &:hover {
            border-color: #0091FF;
            cursor: pointer;
          }
        }
        // 自定义时间
        .header__right__date {
          display: inline-block;
          flex-shrink: 0;
          margin-right: 5px;
          /deep/.el-date-editor {
            width: 250px;
            height: 30px;
            padding: 0 5px 0 10px;
            border: 1px solid #dddddd;
            position: relative;
            .el-range-input {
              margin: 0;
              width: 90px;
              color: #666666;
              &::-webkit-input-placeholder {
                color: #b4b4b4;
              }
              &:-moz-placeholder {
                color: #b4b4b4;
              }
              &::-moz-placeholder {
                color: #b4b4b4;
              }
              &:-ms-input-placeholder {
                color: #b4b4b4;
              }
            }
            .el-range-separator {
              width: 30px;
              margin: 0;
              padding: 0;
              color: #666666;
            }
            .el-range__icon {
              position: static;
              float: none;
            }
            .el-range__close-icon {
              font-size: 18px;
              color: #999999;
              transition: none;
              &:hover {
                color: #dbdbdb;
              }
            }
            &:hover {
              border-color: #b4b4b4;
            }
            &:focus-within {
              border-color: #0091ff;
            }
          }
        }
      }
    }
    // 工单总览头部内容区
    .content {
      border-radius: 4px;
      // height: 175px;
      height: 215px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      // 画布
      &__canvas{
        margin-left: 60px;
        // margin-top: -40px;
        &__margin{
          margin-left: 26px;
        }
        &__list{
          display: flex;
          color: #999999;
          height: 50px;
          align-items: center;
          width: 192px;
          >div{
            text-align: center;
            margin-right: 10px;
            >div{
              &:nth-last-child(1){
                color: #333333;
                font-weight: bold;
              }
            }
          }
          &__line{
            height: 20px;
            width: 1px;
            background-color: #E6E6E6;
          }
        }
      }
      // 工单总览头部左侧
      &__left{
        display: flex;
        align-items: center;
      // 工单总量
      &__total {
        margin-left: 20px;
        margin-right: 20px;
        width: 150px;
        height: 150px;
        // border: 1px solid #ccc;
        box-shadow: 0 0 6px #ccc;
        text-align: center;
        .total__number {
          margin: 40px auto 10px auto;
          color: blue;
        }
        .total__name {
          // font-weight: bold;
        }
      }
      // 工单状态
      &__status {
        margin-right: 20px;
        > div {
          width: 200px;
          height: 50px;
          margin-top: 5px;
          box-shadow: 0 0 6px #ccc;
          display: flex;
          text-align: center;
          &:nth-child(1) {
            margin-top: 0;
          }
          > div {
            &:nth-child(1) {
              width: 70%;
            }
            &:nth-last-child(1) {
              width: 30%;
              height: 30px;
              line-height: 30px;
              margin: 10px;
              border-radius: 4px;
              background-color: #f0f0f0;
            }
          }
        }
      }
      }
      // 工单总览头部右侧
      &__right{
        display: flex;
        align-items: center;
        overflow: hidden;
        // 左箭头浅色
        .content__btn__left{
          flex-shrink: 0;
          cursor: not-allowed;
          width: 14px;
          height: 32px;
          margin: 0 30px 0 20px;
          background: url('./Image/arrow__left.png');
        }
        // 左箭头深色
        .content__btn__left__dark{
          flex-shrink: 0;
          cursor: pointer;
          width: 14px;
          height: 32px;
          margin: 0 30px 0 20px;
          transform: rotate(180deg);
          background: url('./Image/arrow__right.png');
        }
        // 右箭头深色
        .content__btn__right{
          flex-shrink: 0;
          cursor: pointer;
          width: 14px;
          height: 32px;
          margin: 0 30px 0 20px;
          background: url('./Image/arrow__right.png');
          margin-left: 30px;
        }
        // 右箭头浅色
        .content__btn__right__dark{
          flex-shrink: 0;
          cursor: not-allowed;
          width: 14px;
          height: 32px;
          margin: 0 30px 0 20px;
          transform: rotate(180deg);
          background: url('./Image/arrow__left.png');
          margin-left: 30px;
        }
      // 工单列表
      .content__list {
        // width: 880px;
        width: 1320px;
        overflow: hidden;
        // height: 170px;
        height: 200px;
        margin-left: 0px;
        .content__list__box {
          display: flex;
          padding: 10px 10px;
          transition: margin-left 1s;
          > div {
            flex-shrink: 0;
            width: 200px;
            // height: 150px;
            height: 180px;
            color: #333333;
            // box-shadow: 0 0 6px #ccc;
            color: #999999;
            margin-left: 20px;
            &:nth-child(1) {
              margin-left: 0;
            }
          }
          // 各类工单类型统计
          .content__list__box__list {
            position: relative;
            overflow: hidden;
            background: url('./Image/wave.png') no-repeat bottom center;
            &__title {
              text-align: center;
              height: 28px;
              line-height: 28px;
              background-color: #F6F8FB;
              color: #666666;
              border: 1px solid #D1DDF1;
              border-radius: 5px 5px 0 0;
              border-bottom: none;
            }
            &__bottom{
              border-radius: 0 0 5px 5px;
              border: 1px solid #D1DDF1;
              border-top: none;
              height: 152px;
              &__top{
                padding: 5px 0;
                position: relative;
               &__number {
              display: flex;
              // justify-content: space-around;
              color: #333333;
              font-weight: bold;
              font-size: 20px;
              div{
                width: 50%;
                flex-shrink: 0;
                text-align: center;
              }
               }
               &__line{
                 width: 1px;
                 height: 30px;
                 background-color: #E6E6E6;
                 position: absolute;
                 left: 50%;
                 top: 30%;
               }
               &__total {
              display: flex;
              // justify-content: space-around;
              div{
                width: 50%;
                flex-shrink: 0;
                text-align: center;
              }
               }
              }
               &__prescription {
              display: flex;
              justify-content: space-between;
              div{
                &:nth-child(1){
                  margin-left: 10px;
                }
                &:nth-child(2){
                  color: #333333;
                  margin-right: 10px;
                }
              }
               }
               &__time {
              display: flex;
              justify-content: space-between;
              div{
                &:nth-child(1){
                  margin-left: 10px;
                }
                &:nth-child(2){
                  color: #333333;
                  margin-right: 10px;
                }
              }
               }
               &__response {
              display: flex;
              justify-content: space-between;
              div{
                &:nth-child(1){
                  margin-left: 10px;
                }
                &:nth-child(2){
                  color: #333333;
                  margin-right: 10px;
                }
              }
               }
               &__deel {
              display: flex;
              justify-content: space-between;
              div{
                &:nth-child(1){
                  margin-left: 10px;
                }
                &:nth-child(2){
                  color: #333333;
                  margin-right: 10px;
                }
              }
              }
              &__img{
                width: 200px;
                height: 50px;
                position: absolute;
                bottom: 1px;
                right: -2px;
                // background: url('./Image/wave.png');
              }
            }
          }
        }
      }
      }
    }
    }
  }
</style>
