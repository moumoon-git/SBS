<!--
 * @Author: your name
 * @Date: 2020-12-23 10:57:29
 * @LastEditTime: 2021-01-29 15:59:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /SBS/src/views/modules/sys/duty/dateplug-in/datePlug.vue
-->
<template>
    <div>
      <!--    日历部分-->
      <div class="calender" >
        <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px',margin:'auto' }">
          <calendar :fullscreen="false" @panelChange="onPanelChange" @select="selectCalendar" :locale="{ lang: { month: '月', year: '年' } }" />
        </div>
      </div>
    </div>
</template>

<script>
  import calendar from 'ant-design-vue/lib/calendar' // 日期插件
  import 'ant-design-vue/dist/antd.css'
import Bus from '@/utils/bus'
  export default {
    name: 'datePlug',
    data () {
      return {

      }
    },
    methods: {
      // 格式化起始时间结束时间
      dateFormatter (str) { // 默认返回yyyy-MM-dd HH-mm-ss
        var hasTime = arguments[1] != false// 可传第二个参数false，返回yyyy-MM-dd
        var d = new Date(str)
        var year = d.getFullYear()
        var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
        var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
        var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
        var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
        var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
        if (hasTime) {
          return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
        } else {
          return [year, month, day].join('-')
        }
      },
      selectCalendar (moment) {
        // console.log('momentmomentmomentmoment', this.dateFormatter(moment['_d']).substr(0, 10))
        Bus.$emit('selMomentDate', this.dateFormatter(moment['_d']).substr(0, 10))
      },
      onPanelChange (value, mode) {
        this.$emit('time-type', mode);
      }
    },
    components: {
      calendar
    }
  }
</script>

<style scoped>

</style>
