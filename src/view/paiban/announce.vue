<!--
 * @Author: xurongyang
 * @Date: 2020-10-14 16:23:39
 * @Description: EBS政务排班
-->
<template>
  <div class="announce_wrap">
    <div class="contentStyle">
      <!-- el布局头部 -->
      <el-header class="header">
        <div class="tip-bar">
          <span>提示:</span><p style="padding-left:10px">🔒历史数据已锁定</p>
        </div>
        <div class="selectTime">
          <div class="lastMon" @click="getNowYearsData(-1)"></div>
          <div class="selectMon">{{setYear}}年</div>
          <div class="nextMon" @click="getNowYearsData(1)"></div>
        </div>
      </el-header>
      <!-- el布局内容区域 -->
      <el-main >
          <div class="allDuty" v-for="(item,index) in daysOfMonth" :key="index">
              <div class="monthBox">{{item.month}}月{{nowYear > setYear || (nowYear == setYear && nowMonth > item.month)  ? '🔒':''}}</div>
              <div class="dutyToday">
                  <!-- <div class="allDete">
                      <div class="deleteImg"></div>
                      <div class="date">日期</div>
                      <div class="week">周几</div>
                      <div class="displaySet">
                          <div class="displaySet_left">
                              <div class="displaySet_left_content" >
                                  班次
                              </div>
                          </div>
                          <div class="displaySet_right">
                              <div class="displaySet_right_content">
                                  姓名
                              </div>
                          </div>
                      </div>
                  </div> -->
                  <div class="allDete" v-for="(item2,index2) in item.day" :key="index2" >
                      <!-- <div class="deleteImg"  @click="deleteData(item2.day)"></div> -->
                      <div class="date">{{item2.day}}</div>
                      <div class="week">{{`（${item2.week == 1 ? '周一':'' || item2.week == 2 ? '周二':'' || item2.week == 3 ? '周三':'' || item2.week == 4 ? '周四':'' || item2.week == 5 ? '周五':'' || item2.week == 6 ? '周六':'' || item2.week == 7 ? '周日':''}）`}}</div>
                      <div class="displaySet">
                          <div class="displaySet_left">
                              <div class="displaySet_left_content" v-for="(item3,index3) in item2.banci" :key="index3" >
                                  {{item3.name}}
                              </div>
                          </div>
                          <div class="displaySet_right">
                              <div class="displaySet_right_content" v-for="(item4,index4) in item2.banci" :key="index4" @click="setPeople(item4,item2.day,item2.banci)">
                                  {{item4.people}}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <announce-search ref="announSearch" :title="dialogTitle" :limitNum="lastDutyLimit"  @childByValue="child"></announce-search>
      </el-main>
    </div>
  </div>
</template>
  
  <script>
    import AnnounSearch from "./announSearch";
    export default {
        name: 'announceduty',
        components: {
            "announce-search": AnnounSearch
        },
        data() {
            return {
                dialogTitle:'政务排班',      // 子组件Search的标题
                nowYear:'',                 //  通过日期对象获取的当前年
                setYear:'',                 //  设置的当前年
                nowDate:'',                 //  通过日期对象获取的当前日期
                nowMonth:'',                //  通过日期对象获取的当前月    
                daysOfMonth: [],            //  所有数据
                lastDutyid:'',              //  最后一次点击的班次id
                lastDutyLimit:'',           //  最后一次点击的班次人数限制
                nowAday:'',                 //  通过日期对象获取的当前日
                baseUrl: window.g.ApiUrl,
            };
        },
        mounted() {
        this.initYear()
        this.getNowYearsData()
        // 所有数据需要处理成的渲染格式
        // this.daysOfMonth = [
        //     {month:'1',day:[{date:"2020-01-01",week:'星期一',banci:[{name:'早班',people:'测试数据'},{name:'午班',people:'测试数据'},]},
        //                     {date:"2020-01-02",week:'星期二',banci:[{name:'夜班',people:'测试数据'},{name:'凌晨班',people:'测试数据'},{name:'深夜班',people:'测试数据'}]},
        //                     {date:"2020-01-03",week:'星期三'},
        //                     {date:"2020-01-04",week:'星期四'},
        //                     {date:"2020-01-05",week:'星期五'},
        //                     {date:"2020-01-06",week:'星期六'},
        //                     {date:"2020-01-07",week:'星期日'},
        //                     ]
        //     }
        // ]
        },
        methods: {
        /*  初始化时间数据
        @Author xry
        @lastDate 2020-10-18
        @nowyer Date对象获取的当前年份
        @setYear 自己设置的年份
        */
        initYear() {
            let time = new Date()
            this.nowYear = time.getFullYear();
            this.nowMonth = time.getMonth() + 1
            this.setYear = this.nowYear
            this.nowAday = time.getDate()
            this.nowDate = time
        },
        /* 清除当天排班
        @Author xry
        @lastDate 2020-10-18
        @date 传入的点击的当前日期 'yyyy-mm-dd'
        @getAllData  获取数据
        */
        deleteData(date) {
            this.$http({
                method:'get',
                url:`${this.baseUrl}/duty/affairs/delete?date=${date}`
            }).then(res=>{
                this.getAllData()
                this.$message({type:"success",message:"清除当天排班人员信息成功"})
            })
        },
        /* 获取设置的年份下数据
        @Author xry
        @lastDate 2020-10-18
        @num 传入的年份+1 -1操作
        @getAllData  获取数据
        */
        getNowYearsData(num) {
            if(typeof num == 'number') {
                this.setYear += num
            }
            this.getAllData()
        },
        /* 获取数据
        @Author xry
        @lastDate 2020-10-18
        @daysOfMonth 需要储存渲染数据的数组
        */
        getAllData() {
            this.$http({
            method: "get",
            url: `${window.g.ApiUrl}/duty/affairs/list?date=${this.setYear}`
            })
            .then(res=>{
            let allData = res.data.data
            let day = []
            this.daysOfMonth = []
            for (let i = 0; i < allData.length; i++) {
                // 第一层所有月份
                if(!this.daysOfMonth[i]) {
                    this.daysOfMonth[i] = {}
                }
                this.daysOfMonth[i].month = allData[i].month
                this.daysOfMonth[i].day = []
                // 第二层每个月份同级下data的循环
                for(let j = 0;j < allData[i].data.length;j++){
                // 每一天的所有排班数据
                // console.log(allData[i].data[j])
                    allData[i].data[j].banci = []
                // 第三层每个data下, 一天里的不同的排班数据
                    for(let k = 0;k < allData[i].data[j].data.length;k++){
                // console.log(allData[i].data[j].data[k])
                // 处理想要的数据格式
                        if(allData[i].data[j].data[k].appSjsDutyContactorVo !== null) {
                            allData[i].data[j].data[k].people = allData[i].data[j].data[k].appSjsDutyContactorVo.name
                            allData[i].data[j].data[k].peopleid = allData[i].data[j].data[k].appSjsDutyContactorVo.id
                        }
                // console.log(allData[i].data[j].data[k])
                        allData[i].data[j].banci.push(allData[i].data[j].data[k])
                    }
                // 处理好的最终数据⭐⭐ 👇
                // console.log(allData[i].data[j])  
                    this.daysOfMonth[i].day.push(allData[i].data[j])
                }
            }
            })
        },
        /* 设置排班人员 
        @Author xry
        @lastDate 2020-10-18
        @item  当前点击班次的所在对象
        @appSjsDutyAffairsDateGroupId  需要作为传参的当前点击班次id
        @formatDate 点击日期转化为时间对象作比较：比较的实质为将比较双方时间对象的实例转换为s,该s数为到19xx年某一固定时间的s数
        @maxNumble 当前班次限制的排班人数
        */
        setPeople(item,date,banci) {
            let formatDate = new Date(date)
            if(this.nowDate > formatDate && !(this.setYear == this.nowYear && this.nowMonth == formatDate.getMonth()+1 && this.nowAday == formatDate.getDate()) ){
                this.$message({type:'warning',message:'该排班已被锁定'})
                return
            }
            // let chooseList = []; // 当前点击的班次的人员
            //  banci.forEach(element => {
            //    console.log('item', item);
            //    console.log('ele', element)
            //     if(item.appSjsDutyAffairsDateGroupId===element.appSjsDutyAffairsDateGroupId){
            //         chooseList.push(element.appSjsDutyContactorVo)
            //     }
            // });
            console.log('点击的人员数据', item, banci);
            const chooseList = banci.reduce((pre, ele) => {
              if (item.appSjsDutyAffairsDateGroupId === ele.appSjsDutyAffairsDateGroupId) {
                if (ele.appSjsDutyContactorVo) {
                  pre.push(ele.appSjsDutyContactorVo);
                }
              }
              return pre;
            }, []);
            let nameList = chooseList.reduce((pre, ele) => {
                if(ele.id){
                    pre.push(ele.id)
                }
                return pre;
            }, []);
            console.log('DGT测试：')
            console.log(chooseList,nameList)
            console.log(item,nameList)
            this.lastDutyid = item.appSjsDutyAffairsDateGroupId
            this.lastDutyLimit = item.maxNumble
            this.$refs.announSearch.childFn(nameList)
            this.$refs.announSearch.chooseList = chooseList
            this.$refs.announSearch.visible = true;
            this.$refs.announSearch.selectedNum = nameList ? nameList.length : 0;// 当前选择人数
        },
        /* 子组件选择完人员后的方法
        @Author xry
        @lastDate 2020-10-18
        @chooseList  选择好的人员对象数组
        @choosePeopleIds 需要作为传参的人员对应id
        */
        child(chooseList) {
            // console.log(chooseList)
            let choosePeopleIds = []
            for(let i = 0;i< chooseList.length;i++) {
                choosePeopleIds.push(chooseList[i].id)
            }
            // console.log(choosePeopleIds)
            let params = {}
            params.data ={
                id: this.lastDutyid, 
                contactorIds:choosePeopleIds
            }
            this.$http({
                method:'post',
                data:params,
                url:`${this.baseUrl}/duty/affairs/save`
            }).then(res=>{
                this.$message({type:'success',message:'添加成功'})
                this.getAllData()
            })
            
        }
        }
    };
  </script>

  <style scoped>
    .el-main {
        height: 700px;
        /**width: 1414px; **/
        width: 100%;
    }
    .closeDuty {
        position: absolute;
        top: 9px;
        left: 291px;
        background-color: #f0f0f0;
        height: calc(100% - 9px);
        display: none;
    }
    .displayDuty {
        width: 317px;
        height: 130px;
        border: 1px solid #ccc;
        background-color: #f0f0f0;
        padding: 20px 20px 10px 10px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: scroll;
        position: relative;
        text-align: left;
    }
    .allDete {
        position:relative;
        width: 100%;
        min-height: 70px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        line-height: 33px;
    }
    .allDuty {
        padding: 0 0 28px 0;
        display: flex;
        flex-flow:nowrap;
        text-align: center;
    }
    .monthBox {
        /* padding-top: 81px; */
        width: 100px;
        /* display: inline-table; */
        min-height: 197px;
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items:center;
    }
    .dutyToday {
        display: flex;
        flex-flow:nowrap;
        text-align: center;
    }
    .displaySet {
        display: flex;
        width: 317px;
        min-height: 130px;
        border: 1px solid #ccc;
        background-color: #f0f0f0;
        cursor: pointer;
        box-sizing: border-box;
        white-space: nowrap;
    }
    .displaySet_left {
        display: flex;
        flex-direction: column;
        flex:1;
        box-sizing: border-box;
    }
    .displaySet_right {
        display: flex;
        flex-direction: column;
        flex:3;
    }
    .displaySet_left_content {
        flex: 1;
        border:1px solid #ccc;
    }
    .displaySet_right_content {
        flex: 1;
        border:1px solid #ccc;
    }
    .displayDepart {
        width: 317px;
        height: 130px;
        line-height: 25px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        position: relative;
        overflow: scroll;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .closeDepart {
        position: absolute;
        top: 10px;
        right: 10px;
        display: none;
        cursor: pointer;
    }
    .contentStyle {
        margin: 16px 30px 0 30px;
        background-color: white;
        box-sizing: border-box;
        border: 1px solid rgba(219, 219, 219, 1);
        border-radius: 3px;
    }
    .header {
        height: 72px !important;
        line-height: 72px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .tip-bar {
        display: flex;
        align-items: center;
    }
    .tip-bar p {
        margin: 0;
    }
    .tableContainer {
        padding: 6px;
        box-sizing: border-box;
        border: 1px solid rgba(211, 215, 219, 1);
    }

    .element.style {
        text-align: left;
    }
    .dialog-footer {
        text-align: center;
    }
    ::-webkit-scrollbar-button {
        background-color: transparent;
    }
    ::-webkit-scrollbar-track {
        background-color: transparent;
    }
    ::-webkit-scrollbar-corner {
        background-color: transparent;
    }
    .selectTime {
        width: 60%;
        height: 100%;
        display: flex;
        align-items: center;
    }   
    .lastMon {
        width: 33px;
        height: 33px;
        border-radius: 50%;
        background: url(./img/left.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }
    .nextMon {
    width: 33px;
    height: 33px;
    border-radius: 50%;
    background: url(./img/you.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    }
    .selectMon {
    margin: 0 20px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    }
    .deleteImg {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 8px;
    right: 7px;
    background: url(./img/delete.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    }
  </style>
