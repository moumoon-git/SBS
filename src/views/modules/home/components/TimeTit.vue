<template>
  <el-dialog title="时间选择" :modal="true"  :visible.sync="dialogTableVisible" width="25%" v-dialogDrag>
    <div>
      <div class="block yearTime">
        <span class="demonstration">年份</span>
        <el-date-picker
          value-format="yyyy"
          v-model="yearTime"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </div>

      <div class="block monthTime">
        <span class="demonstration">月份</span>
        <el-date-picker
          value-format="yyyy-MM"
          v-model="monthTime"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </div>

      <div class="block dayTime">
        <span class="demonstration">日期</span>
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="dayTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">取消</el-button>
      <el-button @click="submitTimeTit" type="primary">确定</el-button>
    </div>

  </el-dialog>
</template>

<script>

import $ from "jquery";

export default {
  data() {
      return {
        dialogTableVisible: '',
        yearTime: '', //选择时间值
        monthTime: '',
        dayTime: [],
        item: '', //父组件传来的值
        linechartIndex: '', //父组件传来的索引
        timeFlag: '', //year/month/day
        startTime: '', //开始时间
        endTime: '', //结束时间
      }

    },
    components: {

    },
    computed:{

    },
    created() {

    },
    mounted () {

    },

    methods: {
      init(item,linechartIndex,timeFlag){
        this.dialogTableVisible = true;

        this.yearTime = '';
        this.monthTime ='';
        this.dayTime = [];
        this.item= '';
        this.linechartIndex = '';
        this.timeFlag = ''
        this.startTime = ''
        this.endTime= '';

        this.item = item;
        this.linechartIndex = linechartIndex;
        this.timeFlag = timeFlag;

        if(this.timeFlag === "year"){
          $(".yearTime").css("display","block")
          $(".monthTime").css("display","none")
          $(".dayTime").css("display","none")
        }else if(this.timeFlag == "month"){
          $(".monthTime").css("display","block")
          $(".yearTime").css("display","none")
          $(".dayTime").css("display","none")
        }else if(this.timeFlag == "day"){
          $(".dayTime").css("display","block")
          $(".yearTime").css("display","none")
          $(".monthTime").css("display","none")
        }
      },
      //时间确认
      submitTimeTit(){
        this.startTime = '';
        this.endTime = '';
        if(this.timeFlag === "year" && this.yearTime != null){
          //2019-01-01 00:00:00 2019-12-31 23:59:59
          this.startTime = this.yearTime+"-01-01 00:00:00"
          this.endTime = this.yearTime+"-12-31 23:59:59"
        }else if(this.timeFlag == "month" && this.monthTime != null){
          this.startTime = this.monthTime+"-01 00:00:00"
          this.endTime = this.monthTime+"-31 23:59:59"
        }else if(this.timeFlag == "day" && this.dayTime != null){
          this.startTime = this.dayTime[0]+" 00:00:00"
          this.endTime = this.dayTime[1]+" 23:59:59"
          //console.log("日开始时间-结束时间",this.startTime,this.endTime)
        }

        // console.log("时间确认",this.startTime,this.endTime)

          //this.dialogTableVisible = false;
        this.$nextTick(() => {
          this.$emit("selectTime",this.startTime,this.endTime,this.item,this.linechartIndex);
        });


      }
    },

};
</script>
<style lang="scss">

</style>
