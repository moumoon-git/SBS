<template>
  <div style="min-width: 1344px;">
    <el-form style="z-index: 999999 !important;">
      <el-form-item style="">
        <el-select v-model="vehicleType" multiple placeholder="全部车辆类型" style="width: 200px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="vehicleCamera" placeholder="全部摄相枪" style="width: 200px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-date-picker v-model="value3" unlink-panels value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>

       <!-- <el-input style="width:300px;" v-model="value4" placeholder="请输入内容"></el-input>-->
        <el-button  @click="searchHandle()" style="background: #409eff;color: #fff;margin-left: 10px">筛选</el-button>

        <el-button  @click="searchHandle()" style="background: #409eff;color: #fff;">导出</el-button>

      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    // headFlag = 1显示新增按钮，事件要接报，其他不显示
    props: ['headData', 'headFlag'],
    data () {
      return {

        //搜索数据
        value3: '',
        value4: '',

        //共享镇街
        shareTown: [],

        //共享镇街id
        shareTownId: '',

        //车辆类型
        vehicleType: '',
        //全部摄相枪
        vehicleCamera: '',
        //测试
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],

      }
    },


    mounted () {

    },

    methods: {

      searchHandle () {
        this.$emit(
          'searchHandle',
          this.value3,
          this.value4
        )
      },

      clickAllHandle(){
        this.$emit(
          'clickAllHandle'
        )
      }
    }
  }
</script>

<style scoped>
</style>
