<template>
  <div style="min-width: 1344px;">
    <el-form>
      <el-form-item style="">

        <el-select v-model="shareTownId"
                   filterable
                   default-first-option
                   clearable
                   placeholder="请选择镇街" style="width:200px;">
          <el-option v-for="item in shareTown"
                     :key="item.id"
                     :label="item.townName"
                     :value="item.id"
          ></el-option>
        </el-select>

        <el-date-picker v-model="value3" unlink-panels value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>

       <!-- <el-input style="width:300px;" v-model="value4" placeholder="请输入内容"></el-input>-->
        <el-button  @click="searchHandle()" style="background: #409eff;color: #fff;">搜索</el-button>

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

      }
    },


    mounted () {
      // 表格数据
      //this.getSharePlatformList()
      // 表格数据
      this.getTownList()
    },

    methods: {

      searchHandle () {
        this.$emit(
          'searchHandle',
          this.value3,
          this.value4,
          this.shareTownId
        )
      },
      getTownList () {
        this.$http({
          url: this.$http.adornUrl(
            '/sys/systown/list'
          ),
          method: 'post',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          // console.log('getTownList', data)

          // 说明有共享数据
          if (data.list.length > 0) {
            this.shareTown = data.list
          }
        }).then(() => {


        })
      }
    }
  }
</script>

<style scoped>
</style>
