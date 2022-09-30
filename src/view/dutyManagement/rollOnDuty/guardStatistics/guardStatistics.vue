<!--@author：wzm-->
<template>
  <el-main style="margin:10px">
    <div class="out">
        <div class="top">
            <p>今日点名人数：<span class="one span">{{allman}}</span></p>
            <p>今日在岗人数：<span class="two span">{{man}}</span></p>
            <p>今日在岗率：<span class="three span">{{ondutyrate}}</span></p>
        </div>
        <div class="main">
            <div class="top_">
                <div class="block">
                    时间：
                    <el-date-picker  format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable='false'>
                    </el-date-picker>
                    <label class="export">点名方式:</label>
                     <el-select v-model="todolist"   placeholder="">
                    <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value"></el-option></el-select>
                    <el-button type="primary" @click="test">查找</el-button>
                    <el-button type="primary" @click="exportXlsy">导出</el-button>
                </div>
            </div>
           <nav-bar :selectedName="selectedName" :navBarList="navBarList"  class="narBar" @changTab="changTab"></nav-bar>
            <all  v-show="selectedName=='全部'" ref="all"></all>
            <onduty_ v-show="selectedName=='在岗'" ref="onduty_"></onduty_>
            <demobilized v-show="selectedName=='离岗'" ref="demobilized"></demobilized>
            <fault v-show="selectedName=='设备故障'" ref="fault"></fault>
        </div>
    </div>
  </el-main>
</template>
<script>
import navBar from "@/components/menu/navBar"
import all from "./all_/all"
import onduty_ from "./onduty_/onduty_"
import demobilized from "./demobilized/demobilized"
import fault from "./fault/fault"
const downLoadFile = require('@/utils/downloadFile.js').default;
    export default {
        name: "guardStatistics",

         data(){
          return{
              value1:'',
              value2:'',
              allman:'',
              man:'',
              ondutyrate:'',
              time:[],
              //菜单切换
              selectedName: "全部",//默认选中导航条
              navBarList: [
                {
                name: "全部"
                }, {
                name: "在岗"
                }, {
                name: "离岗"
                }, {
                name: "设备故障"
                }
              ],//导航条模块
              //选择时间
               pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        value5: '',
        //搜索
        options: [
          {
            value: '0',
            label: '电话点名'
          },
          // bug6828 隐藏视频点名、小程序点名 auth:hxt 2020-9-8
          // {
          //   value: '1',
          //   label: '视频点名'
          // },
          // {
          //   value: '2',
          //   label: '小程序点名'
          // }
        ],
        todolist: '0',//值
          }
          },
    methods:{
        //导出 exls siteType 0=>电话点名 1=>视频点名 2=>小程序点名 3=>普通会议  status 0=>在岗 1=>离岗 2=>设备故障
        exportXlsy(){
            let status;
            switch (this.selectedName) {
                case "全部":
                    status=-1;
                    break;
                case "在岗":
                    status=0;
                    break;
                case "离岗":
                    status=1;
                    break;
                case "设备故障":
                    status=2;
                    break;
                default:
                    break;

            }
            const request = {
              method: 'get',
              url: `/eos/duty/conferenceDuty/export?start=${this.time[0]}&&end=${this.time[1]}&&siteType=${this.todolist}&&status=${status}`,
              baseURL: window.g.ApiUrl,
              headers: {
                token: Cookies.get('token'),
              },
              responseType: 'arraybuffer',
            };
            downLoadFile(request);
        },
        // **************************************************************
         tableRowClassName({row, rowIndex}){
        if (rowIndex === 1) {
          return 'warning-row';
        }
        return '';
        },
        changTab(tabName){
            return this.selectedName=tabName;
          },

          test(){
            console.log(this.time,this.todolist)
            this.$nextTick(()=>{
              this.$refs.all.test(this.time,this.todolist)
              this.$refs.demobilized.test(this.time,this.todolist)
              this.$refs.fault.test(this.time,this.todolist)
              this.$refs.onduty_.test(this.time,this.todolist)
            })

            // console.log(this.todolist)

          },
          timer(){
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var day = d.getDate();
            day = day < 10 ? ('0' + day) : day;
            var time1=(y+'-'+m+'-'+day);
            var time2=(y+'-'+m+'-'+day);
            this.time.push(time1)
            this.time.push(time2)
          }
    },
    mounted(){
          this.timer()
          let data = { };
          this.test();
          this.$api.conferenceDuty_num(data).then((res) => {
              console.log(res)
              this.allman=res.total
              this.man=res.onDuty
              this.ondutyrate= res.rate * 100 + "%";
          })
    },
    components:{
          navBar,
          fault,
          onduty_,
          all,
          demobilized
        },

    }
</script>

<style scoped>
.out{
    margin: 0 auto;
    padding: 0;
}
.export{
    background-color: #F5F7FA;
    color: #909399;
    vertical-align: middle;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 0 10px;
    white-space: nowrap;
    font-size: 14px;
  }
.top{
    width: 100%;
    height:80px;
    background-color: #fff;
    font-size: 20px;
    display: flex;

}
.top_{
    text-align: left;
    margin-left: 30px;
    padding: 14px 0 26px 0;
}
.top p{
    width: 33.3%;
}
.span{
    font-size: 30px;
}
.one{
    color: #479DFF;
}
.two{
    color: #76D672;
}
.three{
    color: #F58D25;
}
.main{
    background-color: #fff;
    padding-bottom: 75px;
}
.el-input__icon,.el-icon-date{
    display: none;
}
.date{
    width: 140px;
}
.tab{
    padding: 0 30px;
}
/* ************************************************************************** */
.el-table .warning-row {
    background: #E6E6E6;
}

</style>
