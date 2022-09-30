  <!--@author：wzm-->
  <template>
    <div class="out">
      <el-tabs type="border-card" class="card">
        <p class="top">
          <!--        <el-button type="primary" @click="handleRowDbClick">查看联系人</el-button>-->
          <el-button @click="openEvent" type="primary">登记事件</el-button>
          <el-button @click="byebye" type="primary">防骚扰</el-button>
          <el-button @click="out" type="primary">导出</el-button>
          <el-button @click="called" type="primary">呼叫</el-button>
          <span class="span">从</span>
          <el-date-picker v-model="data" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期"></el-date-picker>
          <el-input class="ipt" placeholder="输入电话/姓名" v-model="search" clearable></el-input>
          <el-button @click="lookup" type="primary">查找</el-button>
        </p>
        <!-- 表格-->
        <div class="tab">
          <el-row>
            <el-col :span="18">
              <my-table id="table-content" ref="singleTable"
                        :tableColumn="tableColumn" :tableData="tableData"
                        @handleRowDbClick="handleRowDbClick"
                        @handleCurrentChange="test"
              ></my-table>
            </el-col>
            <el-col :span="6">
              <el-form class="rigth_form" ref="rigth_form" :model="rigth_form" label-width="80px">
                <el-form-item label="录音：">
                  <audio-history :audioList = 'refUrl' @turTheText="turTheText" @downloadWav="downloadWav"></audio-history>
                </el-form-item>
                <el-form-item label="事件：">
                  <el-select v-model="rigth_form.eventId" clearable placeholder="请选择" @change="handleCheck">
                    <el-option
                      v-for="item in event_list"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="单位：">
                  <el-input v-model="rigth_form.company" disabled placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="rigth_form.emarks"
                    show-word-limit
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-checkbox :disabled="!rigth_form.eventId" v-model="rigth_form.checked">存为事件续报</el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="ok">保存</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>

        </div>
        <!-- 底部 -->
        <div class="bottom_">
          <!-- 分页器 -->
          <el-pagination :small="pagingSize" :page-size="pageSize" :total="total"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          layout="total, prev, pager, next, jumper"></el-pagination>
          <!--<div class="btm_">-->
            <!--&lt;!&ndash; 左侧 &ndash;&gt;-->
            <!--<div class="music" v-if="audioShow">-->
              <!--<audio-history :audioList = 'refUrl' @turTheText="turTheText" @downloadWav="downloadWav"></audio-history>-->
             <!--<div class="work">{{word}}</div>-->
           <!--</div>-->
           <!--&lt;!&ndash; 右侧 &ndash;&gt;-->
           <!--<div class="btm">-->
            <!--<el-form label-width="120px" :model="formLabelAlign">-->
              <!--<el-form-item label="备注">-->
                <!--<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="formLabelAlign.name">-->
                <!--</el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="关联事件">-->
                <!--<el-select v-model="todolist" filterable clearable  placeholder="" @change="eventReport = {id:0,title:''}">-->
                  <!--<el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id">-->
                  <!--</el-option>-->
                <!--</el-select>-->
                <!--<el-button type="primary" @click="selectEvent" size="mini">选择</el-button>-->
                                 <!--<el-button type="primary" @click="ok" size="mini">保存</el-button>-->
            <!--</el-form-item>-->
            <!--&lt;!&ndash; <el-form-item label="关联接报">-->
                 <!--<el-input v-model="eventReport.title" style="width:217px" placeholder=""></el-input>-->
                 <!--<el-button type="primary" @click="selectEventDeal" size="mini">选择</el-button>-->
                 <!--<el-button type="primary" @click="ok" size="mini">保存</el-button>-->
            <!--</el-form-item> &ndash;&gt;-->
            <!--&lt;!&ndash; <el-form-item label="">-->
              <!--<el-button @click="ok" type="primary">保存</el-button>-->
            <!--</el-form-item> &ndash;&gt;-->
          <!--</el-form>-->
        <!--</div>-->
      <!--</div>-->
      <contact-details-popup ref="ContactDetailsPopup" @getContactorList="getContactorList"></contact-details-popup>
      <!-- //弹框 -->
      <el-dialog class="msg_box" top='0' :close-on-click-modal="false" :modal='false' width='890px' title="选择事件"
                 :visible.sync="dialogTableVisible">
          <el-row>
            <el-col :span="13">
               <span>查询时间：</span>
               <el-date-picker v-model="data1" type="daterange" range-separator="至" start-placeholder="开始日期"
                               end-placeholder="结束日期"></el-date-picker>
            </el-col>
            <el-col :span="11" >
               <el-input class="ipt" placeholder="请输入搜索内容" v-model="box_ipt" clearable></el-input>
               <el-button type="primary" @click="box_lookup(0)">查询</el-button>
            </el-col>
            <!-- <span style="width:70px;display: inline-block;">关键字：</span> -->
          </el-row>

        <my-table @handleCurrentChange="click"
          :tableColumn="tableColumn1" :tableData="tableData1"
        ></my-table>
        <!-- 分页器 -->
          <el-pagination :small="pagingSize"  :total="selectTotal"
             @current-change="box_lookup"
             :current-page.sync="selectPage"
             layout="total, prev, pager, next, jumper">
           </el-pagination>
           <span slot="footer" class="dialog-footer">
               <el-button @click="dialogTableVisible = false">取 消</el-button>
               <el-button type="primary" @click="succees">确 定</el-button>
            </span>
      </el-dialog>

      <!-- //选择关联接报弹框 -->
      <el-dialog class="msg_box" top='0' :close-on-click-modal="false" :modal='false' width='890px' title="选择关联接报"
        :visible.sync="reportDialog">
        <el-row>
          <el-col :span="13">
            <span>报送单位：</span>
            <el-select v-model="reportUnit" filterable placeholder="" @change='changeSelectReport'>
              <el-option v-for="item in reportUnits" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <my-table @handleCurrentChange="clickReportRow" :tableColumn="tableColumn2" :tableData="tableData2"></my-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reportDialog = false">取 消</el-button>
          <el-button type="primary" @click="addReport">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-tabs>
</div>
</template>

<script>
  import myTable from "@/yz_components/tables/tables"
  import ContactDetailsPopup from "@/view/yz_integratedCommunication/contactDetailsPopup";
  import audioHistory from '@/view/yz_History/phoneHistory/all/audioHistory'
  import audioPlan from '@/view/yz_eventManagement/informationDisposal/audioPlan'
    //导出表格的依赖
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    import {Url} from '../../../../assets/js/common'
    let change =1;
    export default {
      name: 'all',
      data() {
        return {
          IsZengChengProject: window.g.IsZengChengProject, // 增城项目
          seatNumber:sessionStorage.getItem("seat"),
          agent_id:sessionStorage.getItem("agent_id"),
          HWICP_Version: window.g.HWICP_Version,//icp版本
          // 弹窗
          //弹框的搜索内容
          box_ipt:'',
          contactorid:'',
          contactForm: {
                  id: "",//联系人id
                  name: "",//姓名
                  sex: '',//性别 默认为0（未知）
                  position: "",//职务
                  workUnit: "",//工作单位
                  mobile: "",//手机号码
                  otherTel: "",//备用手机
                  temobile: "",//手持终端
                  officeTel: "",//办公电话
                  homeTel: "",//应急电话
                  otherTel2: "",//其它电话
                  fax: "",//传真电话
                  email: "",//邮箱
                  importance: '',//紧急程度 默认为0（未知）
                  commonlyUsed: '',//常用联系人(大于0即为常用联系人，小于等于0取消常用联系人)
                  remark: "",//备注
            },//表单数据
            //点击确认之后发送的数据
            id_box:'',
            iCaseId_box:'',
            remark_box:'',
            contactorId:'',
        //todolist双向绑定
        todolist:'',
        todolistid:"",
        modal: false,
        tableColumn1: [
        {
          prop: "eventCode",
          label: "事件编号"
        },
        {
          prop: "title",
          label: "事件标题"
        }, {
          prop: "eventTypeName",
          label: "事件类型"
        }, {
          prop: "occurTime",
          label: "事发时间"
        }, {
          prop: "areaName",
          label: "事发区域"
        }
        , {
          prop: "eventLevelName",
          label: "事件等级"
        }
        , {
          prop: "operatorName",
          label: "接报人"
            }],//表头
            tableData1: [],
            pathname:'/eventReports',
            telephoneGrouping:'/icpPhone',
            dialogTableVisible: false,
            dialogFormVisible: false,
          // formLabelWidth: '720px',
          // 分页器
          total: null,//数据总数
          pageSize: 10,//每页条数
          currentPage: 1,//当前页数
          pagingSize: true,  //分页大小
          pickerOptions2: '',
          data: '',//全部/日期
          data1: '',//弹框时间
          textarea: '',
          // options:'',
          search: '',//全部/搜索
          date: '',
          // 保存
          eventId: '',
          id: '',
          tableColumn: [
              {
                prop: "direct",
                label: "类型"
              },
              {
                prop: "agentName",
                label: "坐席"
              }, {
                prop: "contactor",
                label: "联系人"
              }, {
                prop: "call",//condition
                label: "联系电话"
              }, {
                prop: "workUnit",
                label: "工作单位"
              }
              , {
                prop: "position",
                label: "职务"
              }
              , {
                prop: "operator",
                label: "值班员"
              }
              , {
                prop: "startTime",
                label: "呼叫时间"
              }
              , {
                prop: "connectedTime",
                label: "接通时间"
              }
              , {
                prop: "diffTime",
                label: "通话时长"
              }],//表头
          tableData: [],//表格数据
          formLabelAlign: {
            name: '',
            type: ''
          },
          // 选择框数据
          options: [],
          rowData:'',
          music:'',

          word:'',
          call:'',
          eventboxId:"",
          selectTotal:0,//弹框数据总数
          selectPage:1,//弹框当前页数
          clickQurey:[],
          tableColumn2:[
            {
              prop: "department",
              label: "报送单位"
            }, {
              prop: "dealTime",
              label: "报送时间"
            }, {
              prop: "description",
              label: "报送内容"
            },
          ],
          reportDialog:false,
          reportUnit:'0',
          reportUnits:[],
          tableData2:[],
          allTableData2:[],//存放当前事件的所有关联接报
          ReportRow:'',
          eventReport:{id:0,title:''},
          //yf amend
          controls:true,//是否显示播放录音控件
          refUrl:{
            //音频组件地址,只能传递一个,如果需要传递多个,可以自己修改源码  换成数组或者json
            url:'',
            //这个音频文件的长度,因为一般都是异步获取到音频地址才能初始化audio的,所以这个参数父传递给子合适点
            totalTime:'',
          },
          audioShow:false,//录音播放模块
          voiceUrl:'',//语音转文字链接
          rigth_form: {
            eventId: '', //事件
            company: '',  //单位
            emarks: '', //备注
            dealTime: '',  //呼叫时间
            checked: false  //事件续报
          },
          event_list: [],
        }
      },
      watch:{
        formLabelAlign(val){
          console.log(1111111)
        }
      },
      methods: {
          downloadWav(){//录音下载
            let extenion=this.music.split('.')
            this.$api.downloadRecord({
              url:window.g.recordingApi+'/cgi-bin/downfile?'+encodeURI(this.music),
              extenion:extenion[1],
              download:true
            }).then((res) => {
              if(res){
                let sliceSize =  512
                let byteCharacters = atob(res)
                let byteArrays = []
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  let slice = byteCharacters.slice(offset, offset + sliceSize)
                  let byteNumbers = new Array(slice.length)
                  for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i)
                  }
                  let byteArray = new Uint8Array(byteNumbers)
                  byteArrays.push(byteArray)
                }
                let blob = new Blob(byteArrays)

                let aTag = document.createElement('a');
                aTag.download = '电话录音.'+extenion[1];
                aTag.href =  URL.createObjectURL(blob);
                aTag.click();
                window.URL.revokeObjectURL(blob);
              }
            })

          },
          openEvent(){//打开具体事件
            this.$store.commit('setPhoneHistoryId', {'id':this.id,'remark':this.rowData.remark,'name':this.rowData.contactor,'iphone':this.rowData.call});
            this.$store.commit('setTurnOnEmergencyResponse',false);
            sessionStorage.setItem('newID', 'newID');
            /* console.log(this.rowData.remark);
            sessionStorage.setItem('remark', this.rowData.remark); */
            this.$router.push({
                path:this.pathname
            });
            },
            axios() {
              //需要传递的参数
              var cpage = this.currentPage;
              console.log(cpage)
              let data = {
                  // searchText: this.search,
                  page: cpage,
                  size: 10
                };
              //  请求
              this.$api.all(data).then((res) => {
                // console.log(res)
                  // 返回的数据赋值给table
                  this.tableData = res.data.data
                  this.rowData = res.data.data[0];
                  this.music = res.data.data[0].recordFile
                  // 把数据赋值给总共的数据总数total
                  this.total = res.data.totalElements;

                  this.formLabelAlign.name = res.data.data[0].remark;// 把remark（备注）赋值给name
                  this.todolist = res.data.data[0].eventId === 0? '':res.data.data[0].eventId;  //事件id
                  this.id = res.data.data[0].id;
                  // this.$refs.singleTable.tableLight(res.data.data[0]);//高亮第一行
                  //根据接报id查询接报名称
                  this.eventReport = {id:0,title:''};
                  if(res.data.data[0].eventDeal != 0){ //事件接报id
                     let data = {'eventDealId':res.data.data[0].eventDeal};
                     this.$api.findEventDealById(data).then((res) => {
                        console.log(res);
                        if (res.errorcode == 0) {
                            this.eventReport = {id:res.data.id,title:res.data.description};
                        }
                     })
                   }
                  console.log(this.tableData)
               })
              // .catch((err)=>{console.log(res)})
            },
        // 查询搜索请求
        lookup() {
            // 因为后台数据从0开始  所以请求之前-1
            console.log(this.data)
            var timer = this.currentPage
            if(this.data==''||this.data==null){
              let data = {
                dtStart: '',
                dtEnd: '',
                searchText: this.search,
                page: 0,
                size: 10
              };
              this.$api.all(data).then((res) => {
                    // 返回的数据赋值给table
                    this.tableData = res.data.data;
                    // 把数据赋值给总共的数据总数total
                    this.total = res.data.totalElements;
                    console.log(res.data.data);
                    // console.log(res.data.data[1].remark)
                    // 赋值备注
                    //   this.music=res.data.data.recordFile
                    this.formLabelAlign.name = res.data.data.remark
                    console.log(res.data.data.remark);
                  })
            }
            else{
                // console.log(this.data[0])
                // 判断选没选时间（没选会弹出警告后边的else）如果选了进行下一步
                // 把标准时间转为2018-01-01格式
                var time = this.data[0]

                function formatDateTime(time) {
                  var date = time;
                  var y = date.getFullYear();
                  var m = date.getMonth() + 1;
                  m = m < 10 ? ('0' + m) : m;
                  var d = date.getDate();
                  d = d < 10 ? ('0' + d) : d;
                  return y + '-' + m + '-' + d;
                };
                let time1 = formatDateTime(this.data[0])
                let time2 = formatDateTime(this.data[1])
                //运用方法转换时间
                console.log(time1)
                console.log(time2)
                // 请求发送后台的参数
                let data = {
                  dtStart: time1,
                  dtEnd: time2,
                  searchText: this.search,
                  page: timer,
                  size: 10
                };
                this.$api.all(data).then((res) => {
                    // 返回的数据赋值给table
                    this.tableData = res.data.data;
                    // 把数据赋值给总共的数据总数total
                    this.total = res.data.totalElements;
                    console.log(res.data.data);
                    // console.log(res.data.data[1].remark)
                    // 赋值备注
                    //   this.music=res.data.data.recordFile
                    this.formLabelAlign.name = res.data.data.remark
                    console.log(res.data.data.remark);
                  })
              }

            },
        //  分页器
        handleCurrentChange() {
          console.log(this.data)
          if (this.data != undefined || this.data != null) {
            this.searchApi();
          } else {
            this.axios();
          }
        },
        turTheText(){ //语音转文字
          if(this.voiceUrl==''||this.voiceUrl==null){
            return
          }
          let extenion=this.voiceUrl.split('.');
          console.log(extenion);
          let data={
            url:this.voiceUrl,
            extenion:extenion[4]
          }
          this.$api.downloadRecordToText(data).then((res) => {
            if(res.errorcode=='0'){
              console.log(res.data);
              this.word=res.data.result
            }
          })
        },
        test(row) {
          console.log(row);
          this.rowData = row
            this.id = row.id;
            this.call=row.call
            this.music = row.recordFile;
            this.handleCheck()
            this.rigth_form.emarks = row.remark
            this.rigth_form.company = row.workUnit
            this.rigth_form.dealTime = row.startTime
            //this.todolist = row.eventId === 0? '':row.eventId;  //事件id
            this.formLabelAlign.name = row.remark; //备注
            this.contactorid=row.contactorId;
            //后台存在event事件删除后id任然存在，以下接口来校验

          if(row.recordFile){//判断是否有文件，然后转换成秒数
            let extenion=row.recordFile.split('.');
            this.voiceUrl=window.g.recordingApi+'/cgi-bin/downfile?'+encodeURI(row.recordFile)
            this.$api.downloadRecord({
              url:window.g.recordingApi+'/cgi-bin/downfile?'+encodeURI(row.recordFile),
              extenion:extenion[1]
            }).then((res) => {
              if(res.errorcode=='0'){
                this.refUrl.url=window.g.ApiUrl+'/rec/'+res.data.filename
                let audio = document.createElement('audio') //生成一个audio元素
                audio.src =  this.refUrl.url //路径
                let _this=this
                audio.addEventListener("canplay", ()=> {
                  _this.refUrl.totalTime=parseInt(audio.duration)
                  _this.audioShow=true
                });
              }
            })

          }else {
            this.audioShow=false
          }

          if(row.eventId === 0){
                 this.todolist = '';
            this.rigth_form.eventId = ''
          }else{
                let data = {id: row.eventId};
                this.$api.findById(data).then((res) => {
                  //console.log(res)
                   if (res.errorcode != 0) {
                      this.todolist = '';
                    }else{
                      this.todolist = row.eventId;
                     this.rigth_form.eventId = row.eventId
                    }
                })
            }
            //根据接报id查询接报名称
            this.eventReport = {id:0,title:''};
            if(row.eventDeal != 0){ //事件接报id
               let data = {'eventDealId':row.eventDeal};
               this.$api.findEventDealById(data).then((res) => {
                  //console.log(res);
                  if (res.errorcode == 0) {
                      this.eventReport = {id:res.data.id,title:res.data.description};
                  }
               })
             }
          },
        // 切换事件续报未选中状态
        handleCheck(){
          this.rigth_form.checked = false
        },
          //点击事件接报
          selectEventDeal(){
             console.log(this.todolist);//事件id
             if(this.todolist){
                let data = {
                  eventId: this.todolist
                };
                this.$api.eventReport(data).then((res) => {
                  console.log(res);
                  if (res.errorcode != 0) {
                    this.$message({
                      message: res.msg,
                      type: "error"
                    });
                  }else{
                    this.reportDialog = true;
                    this.tableData2 = res.data.list;
                    this.allTableData2 = res.data.list;
                    this.reportUnit = 0;
                    this.reportUnits = [];
                    this.ReportRow = '';//解除初始点击table行
                    for(let i=0; i<res.data.workUnit.length; i++){
                       this.reportUnits.push({value: i,label: res.data.workUnit[i] == ''? '全部':res.data.workUnit[i]})
                    }
                  }
                })
             }else{
                this.$message({
                   message: '必须选择事件后才能关联接报哦！',
                   type: 'warning'
                 });
             }
          },
          changeSelectReport(index){
             let name = this.reportUnits[index].label;
             console.log(name);
             if(name == '全部'){
                this.tableData2 = this.allTableData2;
             }else{
                this.tableData2 = [];
                for(let i=0; i<this.allTableData2.length; i++){
                  if(name == this.allTableData2[i].department){
                     this.tableData2.push(this.allTableData2[i])
                  }
                }
             }
          },
          clickReportRow(row){
             this.ReportRow = row;
          },
          addReport(){
             console.log(this.ReportRow);
             if(this.ReportRow){
                 this.eventReport = {id:this.ReportRow.id,title:this.ReportRow.description};//接报id，内容
                 this.reportDialog = false;
             }else{
               this.$message({
                 message: '你还未点击选中报送内容呢！',
                 type: 'warning'
               });
             }
          },
       out() {
          //导出函数
          let time1=''
          let time2=''
          console.log(this.data)
          if(this.data==''||this.data==undefined){
            time1='';
            time2=''
          }
          else{
            time1=this.formatDateTime(this.data[0])
            time2=this.formatDateTime(this.data[1])
          }
          const UrlRoot = window.g.ApiUrl;
          console.log(this.search)
          console.log(UrlRoot+'/eos/history/exportPhoneList?callType=0&dtStart='+time1+'&dtEnd='+time2+'&searchText='+this.search)
          window.location.href = UrlRoot+'/eos/history/exportPhoneList?callType=&dtStart='+time1+'&dtEnd='+time2+'&searchText='+this.search

        },
        /* todelist() {
          let data = {
             page:this.selectPage -1,
             size:10
          };
          this.$api.todolist(data).then((res) => {
            // 返回的数据赋值给table
            // this.tableData=res.data.data;
            // 把数据赋值给总共的数据总数total
            // this.total=res.data.totalElements;
            console.log(res);
            // console.log(res.data.data[1].remark)
            // 赋值备注
            // this.options = res.data.data;
            this.selectTotal = res.data.totalElements;
            this.tableData1 = res.data.data;
          })
        }, */
        //事件选择弹框
        selectEvent(){
          this.dialogTableVisible = true;
          this.eventboxId = ''; //初始绑定的事件id，当用户没有选择时点击了确定，不会改变原来的选中
          this.clickQurey = [];
          this.box_ipt = '';
          this.data1 = '';
          this.selectPage = 1;
          this.box_lookup();
        },
          //下拉框数据
          select() {
            let data = {

            };
            this.$api.allEventlist(data).then((res) => {
                  // 返回的数据赋值给table
                  console.log(res.data);
                  // 赋值备注
                  this.options = res.data;
                  this.event_list = res.data
                  console.log(this.options);
                })
          },
          formatDateTime(time) {
            console.log(time);
            if(!time) return '';
            var date = time;
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d;
          },
          searchApi() {
          // 把标准时间转为2018-01-01格式
          let time1 = this.formatDateTime(this.data[0]);
          let time2 = this.formatDateTime(this.data[1]);
          //运用方法转换时间
          // 因为后台数据从0开始  所以请求之前-1
          var timer = this.currentPage;
          // 请求发送后台的参数
          let data = {
            dtStart: time1,
            dtEnd: time2,
            searchText: this.search,
            page: timer,
            size: 10
          };
          console.log(data);
          this.$api.all(data).then((res) => {
            // 返回的数据赋值给options
            this.tableData = res.data.data;
            // 把数据赋值给总共的数据总数tableData1
            this.total = res.data.totalElements;
          })
        },
        box_lookup(page) {
          let time1 = '';
          let time2 = '';
          if(page == 0){
             this.selectPage = 1;
             if(this.data1){
                 time1 = this.formatDateTime(this.data1[0]);
                 time2 = this.formatDateTime(this.data1[1]);
             }
             this.clickQurey = [time1,time2,this.box_ipt];
          }


          let data = {
            callType: 0,
            dtStart: this.clickQurey[0],
            dtEnd: this.clickQurey[1],
            searchText: this.clickQurey[2],
            page: this.selectPage -1,
            size: ''
          };
          this.$api.todolist(data).then((res) => {
            // 返回的数据赋值给options
            console.log(res);
            // this.options = res.data.data;
            // 把数据赋值给总共的数据总数tableData1
            this.tableData1 = res.data.data;
            this.selectTotal = res.data.totalElements;
          })
        },
        // 电话右边表单保存
        ok() {
          let data = {
            eventId: this.rigth_form.eventId,
            id: this.id,
            remark: this.rigth_form.emarks,
            eventDealId:this.eventReport.id
          };
          // 更新电话历史
          this.$api.ok(data).then((res) => {
            console.log(res)
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }else{
                this.$message({
                  message: '信息保存成功！',
                  type: 'success'
                });
                this.axios();
                this.eventboxId = '';
            }
          })
          // 保存事件续报
          if (this.rigth_form.checked){
            const parmas = {
              data:{
                eventProcessId: this.rigth_form.eventId,
                description: this.rigth_form.emarks,
                department: this.rigth_form.company,
                dealTime: this.rigth_form.dealTime
              }
            };
            this.$api.saveEventDeal(parmas).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }else{
                this.$message({
                  message: '已存为续报！',
                  type: 'success'
                });
              }
            })
          }
        },
        click(row){
          console.log(row);
          /* this.eventId_box=row.iCaseId,
          this.remark_box =row.content_box, */
          this.eventboxId=row.id;
        },
        succees(){
         /* let data = {
          id: this.id,
          iCaseId : this.eventId_box,
          remark  : this.content_box
        }; */
        if(this.eventboxId) this.todolist=this.eventboxId;
        this.dialogTableVisible=false;
       },
          //表格行双击方法
          handleRowDbClick(row){
            let data = {
              id: this.contactorid
            };
            this.$api.findContactorById(data).then((res) => {
              console.log(res)
              this.contactForm = res.data;
              this.$nextTick(() => {
                this.$refs.ContactDetailsPopup.isDialogVisible = true;
                this.$refs.ContactDetailsPopup.title = "查看联系人";
                this.$refs.ContactDetailsPopup.showData(this.contactForm);
              });
            })
          },
          //获取联系人数据
          getContactorList() {
            let data;
            if (this.searchText == "") {
              data = {
                groupId: this.id,
                page: this.currentPage,
                size: this.pageSize,
                searchText: this.searchText,
              };
            } else {
              data = {
                page: this.currentPage,
                size: this.pageSize,
                searchText: this.searchText,
              };
            }
            this.$api.contactorList(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.tableData = res.data.list;
              this.total = res.data.totalCount;
            })
          },
          song(){
            if(this.music==''){
              this.$message({
                message: '当前录音为空',
                type: "error"
              });
              return
            }
            else{
              this.refUrl=Url+'/rec/'+this.music
              let audio=document.getElementById('music1')
              if(audio.readyState==0){
                this.$message({
                  message: '当前录音不可以播放',
                  type: "error"
                });
              }
              else{

                audio.play()
              }
            }
          },
          songwork(){
            let data = {
              filename:this.music
            };
            this.$api.recordToText(data).then((res) => {
                console.log(res)
                if (res.data.code == -1) {
                    this.$message({
                        message: res.data.message,
                        type: "error"
                    })
                    return
                }
                this.$message({
                    message: '转文字成功',
                    type: "success"
                })
              console.log(res.data.result)
              this.word=res.data.result

            })
          },
          byebye(){
            if(this.call==''){
              this.$message({
                message: '请选择人员',
                type: "error"
              });
            }
            else{
              let data = {
                "data":{
                  "parameter":{
                    "phone":this.call,
                    "remark":null
                  },
                  "type":"add"
                }

              };
              this.$api.blackList(data).then((res) => {
                console.log(res)
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error"
                  });
                }
                else{
                  this.$message({
                    message: '启用防骚扰成功',
                    type: "success"
                  });
                }
              })
            }
          },
          /**
            * @lastEditor hexinting
            * @lastDate 2020-12-25
            * @description 呼叫电话
            */
          called(){
            if(this.call==''||this.call==undefined||this.call==null){
              this.$message({
                message: '选择的人员无效',
                type: "error"
              });
            }
            else{
              // sessionStorage.setItem('phoneCall', this.call);
              // this.$router.push({
              //   path:this.telephoneGrouping
              // });
              let self = this,
                mobile =  this.call;
              // bug9749 增城项目不需要呼叫确认框 author:hexinting date:2020-12-25
              if(this.IsZengChengProject) {
                if (self.HWICP_Version == 'HWICP-19.0') {
                    this.$icp19.MakeCall(Number(self.agent_id), mobile, self.seatNumber.toString());
                }
              } else {
                this.$confirm('确认呼叫当前号码?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (self.HWICP_Version == 'HWICP-19.0') {
                        this.$icp19.MakeCall(Number(self.agent_id), mobile, self.seatNumber.toString());
                    }
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消呼叫'
                    });
                });
              }
            }
          },
          // 电话右边表单保存
          rigthSubmit(){

          }
        },

        mounted() {
          // this.$store.commit('add',this.formLabelAlign.name)
          this.axios();
          //this.todelist()
          this.select();
      },
      components: {
        myTable,ContactDetailsPopup,audioHistory,audioPlan
      }
    }
  </script>

  <style scoped>
  .out {
    margin: 0 30px;
  }

  .card {
    height: 100%;
  }

  .top {
    display: flex;
    justify-content: flex-start;
    height: 40px;
    line-height: 40px;
  }

  .ipt {
    width: 300px;
  }

  .span {
    margin-left: 80px;
    margin-right: 10px;
  }

  .bottom_ {
    width: 100%;
    background-color: #fff;
    padding: 20px;
    bottom: 0px;
    left: 231px;
  }

  .music {
    text-align: left;
    position: absolute;
    left: 0;
    width: 300px;
    height: 200px;
    margin: 0 60px 0 20px;
  }

  .btm {
    margin-right: 168px;
    text-align: left;
  }

  .btm_{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .remarks {
    width: 500px;
    height: 80px !important;
    line-height: 0 !important;
  }

  #one {
    display: inline-block;
    height: 100px;
    line-height: 100px;
  }

  .msg_box {
    position: fixed;
    z-index: 9999;
  }
  .pp{

  }
  .work{
    margin-top: 10px;
    width: 200px;
    height: 100px;
    overflow-x: hidden;
    word-break:break-all;
    /*border: 1px solid black;*/
  }
  .rigth_form .el-form-item__content .el-select{
    width: 100%;
  }

  .rigth_form .el-form-item:nth-child(4){
    margin-bottom: 0;
  }
  .rigth_form .el-form-item:nth-child(5){
    text-align: left;
  }
</style>
