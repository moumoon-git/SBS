<template>
  <div>
    <mail-list ref="addOrUpdate" v-if="addOrUpdateVisible" class="mail_del" ></mail-list>
    <el-tabs type="border-card" @tab-click="slele($event)" class="tab">
      <el-tab-pane label="全部"></el-tab-pane>
      <el-tab-pane label="未接"></el-tab-pane>
      <el-tab-pane label="已接"></el-tab-pane>
      <el-tab-pane label="已拨"></el-tab-pane>
    </el-tabs>

    <aside class="screen">
<!--       筛选按钮-->
      <div class="all_btn">
        <button @click="ckDetil">查看联系人</button>
        <button >事件登记</button>
<!--        <button @click="harassment_Event">防骚扰</button>-->
        <button @click="export_human">导出</button>
      </div>
<!--      时间筛选-->
      <div class="time_sele">
        <div class="block">
          <span class="demonstration">从</span>
          <el-date-picker
            unlink-panels
            v-model="value1"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            format="yyyy - MM - dd "
            value-format="yyyy-MM-dd"
            @change="dates"
          >
          </el-date-picker>
        </div>

        <div class="block">
          <span class="demonstration">至</span>
          <el-date-picker
            unlink-panels
            v-model="value2"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            format="yyyy - MM - dd "
            value-format="yyyy-MM-dd"
            @change="dates"
          >
          </el-date-picker>
        </div>
      </div>
<!--      查找-->
      <div>
        <el-input placeholder="输入姓名/单位/职位/号码/备注"  v-model="input1" >
          <el-button slot="append" @click="seach" class="seach_btn">查询</el-button>
        </el-input>
      </div>

    </aside>
<!--    表格-->
    <div class="tables">
      <el-table
        ref="filterTable"
        :data="tableData"
        style="width: 100%"
        height="730"
        :row-class-name="indexMethod"
        @row-click="tabClick"
      >
        <el-table-column
          prop="date"
          label="类型/坐席"
          width="180"
          column-key="date"
        >
          <template slot-scope="scope">
            <img v-if="scope.row.status=='3'" src="../../../assets/img/hc.png" alt="">
            <img v-if="scope.row.status=='1'" src="../../../assets/img/wj.png" alt="">
            <img v-if="scope.row.status=='2'" src="../../../assets/img/ld.png" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="录音/下载"
          width="100"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <img class="Img" v-if="scope.row.recordFile" src="../../../assets/img/play.png" alt="">
<!--            <audio controls v-if="scope.row.recordFile">-->
<!--              <source src="http://scg.chinaemt.com/ser/phone/audios/+scope.row.recordFile" type="audio/ogg">-->
<!--              <source src="http://scg.chinaemt.com/ser/phone/audios/+scope.row.recordFile" type="audio/mpeg">-->
<!--            </audio>-->
          </template>

        </el-table-column>
        <el-table-column
          prop="address"
          label="联系人/联系电话"
          >
          <template slot-scope="scope">
            <p>{{scope.row.operatorName}}</p>
            <p>{{scope.row.callType==0?scope.row.phoneCalling:scope.row.phoneCalled}}</p>
          </template>
        </el-table-column>

        <el-table-column
          prop="job"
          label="工作单位/职位"
          width="180"
          column-key="date"
        >
          <template slot-scope="scope" class="HisHuman_input_big_wrap">
<!--            <p class="HisHuman_input_wrap" ><span>备注:</span><input class="HisHuman_input" type="text"></p>-->
<!--            <p class="HisHuman_input_wrap" ><span>事件:</span><input class="HisHuman_input" type="text"></p>-->
          </template>
        </el-table-column>

        <el-table-column
          prop="duty"
          label="值班员"
          width="180"
          column-key="date"
        >
        </el-table-column>

        <el-table-column
          prop="date"
          label="通话时间/通话时长"
          width="180"
          column-key="date"
          >
          <template slot-scope="scope">
            <p>{{scope.row.startTime}}</p>
            <p>{{parseInt(scope.row.duration/60/60)+':'+parseInt(scope.row.duration/60%60)+':'+scope.row.duration%60}}</p>
<!--            var num=3000;-->
<!--            var shi=parseInt(num/60/60);-->
<!--            var fen=num/60%60;-->
<!--            var miao=num%60;-->
<!--            console.log(shi,fen,miao)-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="position: relative">
<!--      <div class="back"  @click="tabGD2" >返回</div>-->
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage3"
          :page-size="20"
          :page-count="5"
          layout="prev, pager, next, jumper"
          :total="listLength">
        </el-pagination>
      </div>
    </div>

    <mobile-harassment class="harassment" v-if="harassment">

    </mobile-harassment>
  </div>
</template>

<script>
import Bus from '@/utils/bus'
import mailList from '@/views/modules/sys/mailList/mailList-See-or-update'
// eslint-disable-next-line camelcase
import mobile_harassment from '@/views/modules/communication/mobile_common/mobile_harassment'
// mobile_harassment

export default {
  name: 'history_human_all',
  data () {
    return {
        // 查看联系人详情
      addOrUpdateVisible: false,
        // 选择时间
      currentDate: new Date(),
      currentPage1: 0,
      currentPage2: 0,
      currentPage3: 0,
      currentPage4: 5,
      listLength: 0,
        // 请求参数
      page: 1,
      limit: 20,
      status: 0,
      search: '',
      startTime: '',
      endTime: '',
        // 搜索的内容
      input1: '',
        // 时间选择
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      value1: new Date().toLocaleDateString().split('/').join('-'),
      value2: new Date().toLocaleDateString().split('/').join('-'),
      //  联系人列表
      tableData: [],
      byArr: [],
      byFlag: true,
        // 单前页面tab的公共下标
      index: 0,
      //  防骚扰判断
      harassment: false,
      //  单前这条的数据
      Evemdata: '',
    //  插入元素
      tr: '',
    //  保存的数据
      incident: '',
      remark: ''
    }
  },
  methods: {
    slele (e) {
      // console.log('选择', e.label, e.index)
      var index = e.index
      this.index = e.index
      this.syArr(index)
      if (this.tr) {
        this.tr.remove()
      }
    },
    syArr (index) {
      this.status = Number(index)
      this.httpHumanAll()
        // //使用筛选方法
        // var newArr="";
        // if(this.byFlag){
        //   //第一次把值存储
        //   this.byArr=this.tableData;
        //   this.byFlag=false;
        //   newArr=this.tableData;
        // }else{
        //   newArr=this.byArr;
        // }
        // if(index==0){
        //   newArr=this.byArr
        //   this.tableData=newArr;
        //   this.arr=newArr;
        // }else if(index==1){
        //   newArr=this.sxArr(newArr,"wj")
        // }else if(index==2){
        //   newArr=this.sxArr(newArr,"ld")
        // }else if(index==3){
        //   newArr=this.sxArr(newArr,"hc")
        // }
        // this.tableData=newArr;
    },
    sxArr (listArray, condition) {
        // 筛选电话类型
        // var arr=[];
        // listArray.forEach(function (ele,ind) {
        //     if(ele.type==condition){
        //       arr.push(ele)
        //     }
        // })
        // return this.arr=arr;

    },
    seach () {
        // // 姓名/单位/职位/号码/备注
        // this.syArr(this.index)
        // var seachArr=this.arr;
      const input1 = this.input1
      // console.log(input1)
      this.search = input1
      this.httpHumanAll()
        // console.log(input1,this.index,seachArr)
        // // let
        // const reg = new RegExp(input1, "gi");
        // // 字母
        // const rega = new RegExp(/[a-z]/, "gi");
        // // 汉字
        // const hanReg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        // // 数字
        // const num=new RegExp(/[0-9]/);
        // var newArr2=[];
        //     if(input1&&input1!=" "){
        //       console.log(num.test(input1),input1)
        //       if (hanReg.test(input1)){
        //         seachArr.forEach(function (ele,ind) {
        //           if (reg.test(ele.contacts)){
        //             newArr2.push(ele)
        //           }else if (reg.test(ele.duty)){
        //             newArr2.push(ele)
        //           }else if (reg.test(ele.job)){
        //             newArr2.push(ele)
        //           }
        //         })
        //       }else if(num.test(input1)){
        //         seachArr.forEach(function (ele,ind) {
        //           if (reg.test(ele.phone)){
        //             newArr2.push(ele)
        //           }
        //         })
        //       }
        //       this.tableData=newArr2;
        //     }else{
        //       if(this.index==0){
        //         this.tableData=this.byArr;
        //       }else{
        //         this.tableData=seachArr;
        //       }
        //
        //     }
    },
    dates () {
      // console.log(this.value1, this.value2)
      this.startTime = this.value1 + ' 00:00:00'
      this.endTime = this.value2 + ' 23:59:59'
      this.httpHumanAll()
    },
    tabGD2 () {
      // console.log('点击了返回')
      this.$emit('tow', true)
    },
      // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.page = val
      this.httpHumanAll()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.httpHumanAll()
    },
    indexMethod ({row, rowIndex}) {
     // 把每一行的索引放进row
      row.index = rowIndex
      // console.log(row.index, rowIndex)
    },
    tabClick (row, event, column) {
      // eslint-disable-next-line no-unused-vars
      var that = this
      //   单元格点击事件
      // console.log(row)
      let data = this
      data = row
      //  拿到点击的元素
      if (this.tr) {
        this.tr.remove()
      }
      var tbady = document.querySelector('.tables tbody')
      this.tr = document.createElement('tr')
      this.tr.className = 'el-table__row'
      this.tr.innerHTML = `<td rowspan="1" colspan="3" class="el-table_39_column_229 " style="background: rgb(43,53,71);">
                           <div class="file_download" style="display: flex ;justify-content: center;">
                            <audio controls style="    height:40px;">
                              <source src="http://scg.chinaemt.com/ser/phone/audios/${data.recordFile}" type="audio/ogg">
                              <source src="http://scg.chinaemt.com/ser/phone/audios/${data.recordFile}" type="audio/mpeg">
                              您的浏览器不支持 audio 元素。
                            </audio>
                            </div>
                           </td>
                           <td rowspan="1" colspan="3" class="el-table_39_column_229  " style="background: rgb(43,53,71);">
                           <div class="Import" style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;position: relative;">
                              <lable style="margin-bottom: 5px;color: #fff;">备注:<input value="${data.recordFile}" class="incident" type="text" style="outline: none;margin-left: 5px;width: 300px;"></lable>
                              <lable style="color: #fff;">事件:<input value="${data.recordFile}" class="remark" type="text" style="outline: none;margin-left: 5px;width: 300px;"></lable>
                              <button class="save" style="position: absolute;width: 100px;height: 30px;outline: none;right: 15%;" class="save" >保存</button>
                            </div>
                           </td>`
      tbady.insertBefore(this.tr, tbady.children[data.index + 1])
      var incident = document.querySelector('.incident')// 事件
      var remark = document.querySelector('.remark')// 事件
      // console.log(incident.value, remark.value)
      // console.log(data, data.index, tbady.children[data.index], this.tr)
      var save = document.querySelector('.save')
      save.onclick = function (e) {
        sessionStorage.incident = incident.value
        sessionStorage.remark = remark.value
        // console.log('保存')
      }
      setInterval(() => {
        //  用浏览器的临时存储做介质incident remark
        if (!that.incident) {
          that.incident = sessionStorage.incident
          that.remark = sessionStorage.remark
          // console.log('保存incident remark')
          // eslint-disable-next-line eqeqeq
        } else if (that.incident != sessionStorage.incident) {
          that.incident = sessionStorage.incident
          that.remark = sessionStorage.remark
          // console.log('incident!=')
          // eslint-disable-next-line eqeqeq
        } else if (that.remark != sessionStorage.remark) {
          that.incident = sessionStorage.incident
          that.remark = sessionStorage.remark
          // console.log('remark!=')
        }
        // console.log(that.currentDate,sessionStorage.incident,sessionStorage.remark)
      }, 100)
      this.Evemdata = data
      Bus.$emit('cllaVal', {data, type: 'hisHuman'})
    },
    httpHumanAll () {
      var that = this
      this.$http({
        url: this.$http.adornUrl('/phone/phoneinfo/list'),
        method: 'POST',
        data: this.$http.adornParams({
          page: this.page,
          limit: this.limit,
          search: this.search,
          status: this.status,
          startTime: this.startTime,
          endTime: this.endTime
        })
      }).then((data) => {
        if (data.code === 0) {
          that.tableData = data.data.data.list
          that.listLength = data.data.data.list.length
          // console.log(data.data.data.list, that.tableData)
        } else {
          this.$message.error(data.msg);
        }
      })
    },
      //  查看详情
        // 查询联系人弹窗 / 修改联系人弹窗
    ckDetil () {
      if (this.Evemdata) {
        // console.log('查看联系人')
        // console.log()
        // this.addOrUpdateHandle(this.Evemdata.id, 1)// 实时的数据
        this.addOrUpdateHandle(530, 1)// 测试的数据
      }
    },
    addOrUpdateHandle (id, staus) {
      this.addOrUpdateVisible = true
      // eslint-disable-next-line eqeqeq
      if (staus == 0) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, staus)
        })
        // eslint-disable-next-line eqeqeq
      } else if (staus == 1) {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, staus)
        })
      }
    },
    harassment_Event () {
      if (this.Evemdata) {
        // console.log('防骚扰', this.Evemdata)
        this.harassment = true
        Bus.$emit('Event_harassment', this.Evemdata)
      }
    },
    export_human () {
      // eslint-disable-next-line one-var
      var ids = '', that = this
      this.tableData.forEach(function (ele, ind) {
        // eslint-disable-next-line eqeqeq
        if (ind != that.tableData.length - 1) {
          ids += ele.id + ','
        } else {
          ids += ele.id
        }
      })
      // console.log('导出联系人', this.tableData, ids)
      let httpaddress = window.SITE_CONFIG.baseUrl
      let token = document.cookie
        .substring(document.cookie.indexOf('token='))
        .substring('6')
      // console.log(token)
      // console.log('导出', `${httpaddress}/phone/phoneinfo/output-excel?ids=${ids}&token=${this.$cookie.get('token')}`)
      window.location.href = `${httpaddress}/phone/phoneinfo/output-excel?ids=${ids}&token=${this.$cookie.get('token')}`
    }
  },
  mounted () {
    this.httpHumanAll()
    Bus.$off('close')
    Bus.$on('close', (data) => {
      this.harassment = data
    })
  },
  components: {
    'mail-list': mailList,
    'mobile-harassment': mobile_harassment
  }
}
</script>

<style scoped lang="less">
.screen{
  padding: 5px 0;
  display: flex;
  div{
    flex: 1;
  }
}
.tab{
  // padding:  5px 5px 0;
  min-width: 0;
}
.tab /deep/ .el-tabs__content{
  padding: 0;
}
.tab /deep/ .el-tabs--border-card>.el-tabs__header{
  border: none;
  background: none;
}
.tab{
  background: rgb(14,142,191);
}
.tab /deep/ .el-tabs__item {
  color: #444 !important;
}
.tab /deep/ .is-active{
  color: white !important;
  background-color: rgb(14,142,191) !important;
}
.tab /deep/ .el-tabs__nav-scroll{
  background: white !important;
}
.all_btn{
  white-space: nowrap;
  display: flex;
  padding: 5px;
  button{
    margin-right: 5px;
    flex: 1;
    font-size: 14px;
    outline: none;
    border: none;
    color: #fff;
    background: rgb(14,142,191) ;
    padding: 5px ;
    border-radius: 5px;
  }
}
.time_sele{
  display: flex;
  margin-right: 30px;
  div{
    display: flex;
    align-items: center;
    span{
      margin:0 10px;
    }
  }
}
.seach_btn{
  background: rgb(14,142,191) !important;
  color: #F4f4f4 !important;
}

.tables  /deep/ .cell{
   display: flex;
  flex-wrap: wrap;
  justify-content: center;
  p{
    width: 100%;
    text-align: center;
    margin: 0;
  }
  img{
    width: 20%;
  }
  .Img{
    width: 50%;
  }
}
.back{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #0f4782;
  display: flex;
  align-items: center;
  color: #fff;
  border-radius: 15px;
  font-size: 14px;
  padding: 5px 15px;
}
.HisHuman_input_big_wrap{
  p:nth-child(2){
    margin: 0 !important;
  }
}
.HisHuman_input_wrap{
  display: flex;
  margin-bottom: 10px !important;
}
.HisHuman_input{
  width: 80%;
  outline: none;
}
  /*防骚扰*/
  .harassment{

  }
  /*查看编辑联系人*/
  .mail_del{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
    z-index: 2004;
  }
  .file_download{
    width: 100% !important;
  }
</style>
