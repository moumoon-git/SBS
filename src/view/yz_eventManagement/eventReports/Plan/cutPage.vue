<template>
  <div >
    <el-row >
      <el-col :span="24">
        <el-tabs class="tabsClass"  type="border-card" v-model="leftTabsType" @tab-click="tabClick">
          <el-tab-pane label="传真" name="传真">
            <el-col :span="10">
              <el-card class="box-card cardCalss" shadow="hover">
                <el-scrollbar style="height: 100%">
                  <div style="min-height: 550px" :style="heightStyle">
                    <div style="width: 100%;margin: 0 auto">
                      <el-date-picker
                        style="width: 100%;margin: 15px auto"
                        v-model="queryFaxAllTime"
                        type="daterange"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">

                      </el-date-picker>
                    </div>
                    <div style="display: flex;">
                      <div style="flex: 5">
                        <!-- <el-select size="small" v-model="queryFaxAllSelect" placeholder="请选择">
                           <el-option
                             v-for="item in faxAllSelectData"
                             :key="item.id"
                             :label="item.label"
                             :value="item.id">
                           </el-option>
                         </el-select> -->
                        <el-input type="input"  placeholder="" v-model="queryFaxAllSelect"></el-input>
                      </div>
                      <div style="flex: 2">
                        <el-button   type="primary" @click='getUnhandledFax'>查询</el-button>
                      </div>
                    </div>

                    <div v-loading="treeLoading">
                      <el-scrollbar style="height: 100%">
                        <div :style="listHeight">
                          <div  style="margin-top: 10px;text-align: left" v-for="(item,index) in  list" :key="index" @click="changeItem(item,index)">
                            <el-card :class="{ cardModelDiv:changeIndex == index}" shadow="hover" :body-style="bodyStyle">

                              <div style="display: flex;height: 22px;">
                                <div style="font-size: 12px;width: 120px;">{{item.time}}</div>
                                <div class="ibackDiv">
                                  <i class="el-icon-connection" style="color: rgba(153,194,248,1);" @click.stop="eventRelevance(item)"></i>
                                  <i class="el-icon-edit" style="color: rgba(153,194,248,1);" @click.stop="editIndex = item.id" v-if="editIndex != item.id"></i>
                                  <i class="el-icon-s-order" style="color: rgba(153,194,248,1);" @click.stop="saveEdite(item,'fax')" v-if="editIndex == item.id"></i>
                                </div>
                                <div style="color: #F66E6E;background:rgb(254,237,237);border-radius: 40%;padding: 3px;font-size: 12px;" v-if="editIndex != item.id">{{item.status}}</div>
                                <div style="width: 80px;height: 22px;" v-if="editIndex == item.id" >
                                  <el-select v-model="selectState" placeholder="请选择" size="mini">
                                    <el-option
                                      v-for="item in options"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                                    </el-option>
                                  </el-select>
                                </div>
                              </div>

                              <div>
                                <div style="padding: 5px 0;display: flex">
                                  <div style="flex: 3">姓名:{{item.name}}</div>
                                </div>
                                <div style="padding: 5px 0;">单位:{{item.unit}}</div>
                                <div style="padding: 5px 0;">标题:{{item.title}}</div>
                                <div style="padding: 5px 0;">关联事件:{{item.event}}</div>
                              </div>
                            </el-card>
                          </div>
                        </div>
                      </el-scrollbar>
                      <div >
                        <el-pagination
                          center
                          small
                          layout="prev, pager, next,  total"
                          :page-size="pageFaxSize"
                          :total="totalFax"
                          :current-page.sync="currentFaxPage"
                          @current-change="getUnhandledFax"
                          :pager-count="5"
                        >
                        </el-pagination>
                      </div>
                    </div>


                  </div>
                </el-scrollbar>
              </el-card>
            </el-col>
            <el-col :span="14" id="faxCard">
              <el-card class="box-card cardCalss" shadow="hover" >
                <div >
                  <i class="el-icon-full-screen fullScreen" @click="dialogVisible = true"></i>
                  <el-scrollbar style="height: 100%;">
                    <el-tabs style="min-height: 330px"  :style="elTablePlanStyle">
                      <el-tab-pane label="原件预览">
                        <div :style="elTablePlanStyleNext">
                          <iframe :src="allFpxPreviewPath" id="fpxIframe" width="100%" height="100%" v-if="allFpxPreviewPath!=''"
                                  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"
                          ></iframe>
                          <div v-if="allFpxPreviewPath==''" style="
                      width: 100%;height: 100%;
                      background: url('/static/img/faxBack.png') center no-repeat;
                      background-size: 220px;">
                          </div>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </el-scrollbar>
                </div>
                <div>
                  <el-scrollbar style="height: 100%">
                    <el-tabs style="min-height: 330px" :style="elTablePlanStyle">
                      <el-tab-pane label="文本预览">
                        <!-- <div style="width: 100%;height: 300px;">
                          <el-scrollbar style="height: 100%">
                            <div style="text-indent: 20px;font-size: 14px;margin: 20px;">{{textShow}}</div>
                          </el-scrollbar>
                        </div> -->
                        <div style="height: 250px;border: 1px solid #ddd">
                          <el-scrollbar style="height: 100%;margin: 10px;text-align: left;">
                            <div style="text-indent: 20px;font-size: 14px" v-if="textShow!=''">{{textShow}}</div>
                            <div style="
                      width: 100%;height:250px;
                      background: url('/static/img/txtNull.png') center no-repeat;
                      background-size: 100px;" v-if="textShow==''"></div>
                          </el-scrollbar>
                        </div>
                        <div style="text-align: right;margin: 15px">
<!--                          <el-button type="primary" plain size="mini" @click="faxCheck">一键核实</el-button>-->
                          <el-button type="primary" plain size="mini"  v-clipboard:copy="textShow"
                                     v-clipboard:success="copyTextSuccess" v-clipboard:error="copyTextError">一键复制</el-button>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </el-scrollbar>
                </div>
              </el-card>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="电话" name="电话">
            <el-col :span="10">
              <el-card class="box-card cardCalss" shadow="hover">
                <el-scrollbar style="height: 100%">
                  <div style="min-height: 620px" :style="heightStyle">
                    <div style="width: 100%;margin: 0 auto">
                      <el-date-picker
                        style="width: 100%;margin: 15px auto"
                        v-model="queryFaxAllTime"
                        type="daterange"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">

                      </el-date-picker>
                    </div>
                    <div style="display: flex;">

                      <div style="flex: 5">
                        <el-input type="input"  placeholder="" v-model="queryFaxAllSelect"></el-input>
                        <!-- <el-select size="small" v-model="queryFaxAllSelect" placeholder="请选择">
                          <el-option
                            v-for="item in faxAllSelectData"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                          </el-option>
                        </el-select> -->
                      </div>
                      <div style="flex: 2">
                        <el-button   type="primary" @click='getUnhandledPhone'>查询</el-button>
                      </div>
                    </div>
                    <div v-loading="phoneTreeLoading">
                      <el-scrollbar style="height: 100%">
                        <div :style="listHeight">
                          <div  style="margin-top: 10px;text-align: left" v-for="(item,index) in  list" :key="item.id" @click="clickPhoneList(item,index)">
                            <el-card :class="{ cardModelDiv:changeIndex == index}" shadow="hover" :body-style="bodyStyle">
                              <div style="display: flex;">
                                <div style="font-size: 12px;">{{item.time}}</div>
                                <div class="ibackDiv">
                                  <i class="el-icon-connection" style="color: rgba(153,194,248,1);" @click.stop="eventRelevance(item)"></i>
                                  <i class="el-icon-edit" style="color: rgba(153,194,248,1);" @click.stop="editIndex = item.id" v-if="editIndex != item.id"></i>
                                  <i class="el-icon-s-order" style="color: rgba(153,194,248,1);" @click.stop="saveEdite(item,'phone')" v-if="editIndex == item.id"></i>
                                </div>
                                <div style="color: #F66E6E;background:rgb(254,237,237);border-radius: 40%;padding: 3px;font-size: 12px;" v-if="editIndex != item.id">{{item.status}}</div>
                                <div style="width: 80px;height: 22px;" v-if="editIndex == item.id">
                                  <el-select v-model="selectState" placeholder="请选择" size="mini">
                                    <el-option
                                      v-for="item in options"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                                    </el-option>
                                  </el-select>
                                </div>
                              </div>

                              <div>
                                <div style="padding: 5px 0;display: flex">
                                  <div style="flex: 3">姓名:{{item.name}}</div>
                                </div>

                                <div style="padding: 5px 0;">备注:{{item.title}}</div>
                                <div style="padding: 5px 0;">关联事件:{{item.event}}</div>
                              </div>

                            </el-card>

                          </div>
                        </div>
                      </el-scrollbar>
                      <div >
                        <el-pagination
                          center
                          small
                          layout="prev, pager, next,  total"
                          :page-size="pageFaxSize"
                          :total="totalFax"
                          :current-page.sync="currentFaxPage"
                          @current-change="getUnhandledPhone"
                          :pager-count="5"
                        >
                        </el-pagination>
                      </div>
                    </div>


                  </div>
                </el-scrollbar>
              </el-card>
            </el-col>
            <el-col :span="14">
              <el-card class="box-card cardCalss" shadow="hover" >
                <el-scrollbar style="height: 100%">
                  <div :style="turnTheText" style="border-bottom: 1px solid #ddd;min-height: 250px">
                    <!--                    <div>-->
                    <!--                      <audio-comp-name v-if="audioShow" :audioList = 'audioList'-->

                    <!--                      ></audio-comp-name>-->
                    <!--                    </div>-->

                    <div style="position:relative;width: 100%;height: 100%" >
                      <audio-plan ref="audioPlan"
                                  @sendPhoneText="sendPhoneText"
                                  v-if="testAudio==true"  :audioId="audioId" :audioUrlData="audioUrlData"></audio-plan>
                      <div v-if="testAudio==false" style="
                      width: 100%;height: 100%;
                      background: url('/static/img/phoneNull.png') center no-repeat;
                      background-size: 130px;">

                      </div>
                    </div>
                  </div>
                </el-scrollbar>
                <el-scrollbar style="height: 100%">
                  <div style="min-height: 360px" :style="turnTheText">
                    <div style="width: 100%;text-align: left">
                      <div style="font-weight: bold;padding: 10px 0">录音转文字:</div>
                      <div style="height: 250px;border: 1px solid #ddd" :style="backPhone">
                        <el-scrollbar style="height: 100%">
                          <div style="text-indent: 20px;font-size: 14px" >{{phoneText}}</div>
                        </el-scrollbar>
                      </div>
                      <div style="width: 100%;text-align: right;padding-top: 15px">
<!--                        <el-button type="primary" plain size="mini" @click="phoneVerification">一键核实</el-button>-->
                        <el-button type="primary" plain size="mini"  v-clipboard:copy="phoneText"
                                   v-clipboard:success="copyTextSuccess" v-clipboard:error="copyTextError">一键复制</el-button>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </el-card>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="短信" name="短信">
            <el-col :span="10">
              <el-card class="box-card cardCalss" shadow="hover">
                <el-scrollbar style="height: 100%">
                  <div style="min-height: 620px" :style="heightStyle">
                    <div style="width: 100%;margin: 0 auto">
                      <el-date-picker
                        style="width: 100%;margin: 15px auto"
                        v-model="queryFaxAllTime"
                        type="daterange"
                        size="small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">

                      </el-date-picker>
                    </div>
                    <div style="display: flex;">

                      <div style="flex: 5">
                        <el-input type="input"  placeholder="" v-model="queryFaxAllSelect"></el-input>
                        <!-- <el-select size="small" v-model="queryFaxAllSelect" placeholder="请选择">
                          <el-option
                            v-for="item in faxAllSelectData"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                          </el-option>
                        </el-select> -->
                      </div>
                      <div style="flex: 2">
                        <el-button   type="primary" @click='getUnhandledSms'>查询</el-button>
                      </div>
                    </div>
                    <div v-loading="smsTreeLoading">
                      <el-scrollbar style="height: 100%">
                        <div :style="listHeight">
                          <div  style="margin-top: 10px;text-align: left" v-for="(item,index) in  list" :key="item.id" @click="clickSmsList(item,index)">
                            <el-card :class="{ cardModelDiv:changeIndex == index}" shadow="hover" :body-style="bodyStyle">
                              <div style="display: flex;">
                                <div style="font-size: 12px;">{{item.time}}</div>
                                <div class="ibackDiv">
                                  <i class="el-icon-connection" style="color: rgba(153,194,248,1);" @click.stop="eventRelevance(item)"></i>
                                  <i class="el-icon-edit" style="color: rgba(153,194,248,1);" @click.stop="editIndex = item.id" v-if="editIndex != item.id"></i>
                                  <i class="el-icon-s-order" style="color: rgba(153,194,248,1);" @click.stop="saveEdite(item,'sms')" v-if="editIndex == item.id"></i>
                                </div>
                                <div style="color: #F66E6E;background:rgb(254,237,237);border-radius: 40%;padding: 3px;font-size: 12px;" v-if="editIndex != item.id">{{item.status}}</div>
                                <div style="width: 107px;height: 22px;" v-if="editIndex == item.id" >
                                  <el-select v-model="selectState" placeholder="请选择" size="mini">
                                    <el-option
                                      v-for="item in options"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.id">
                                    </el-option>
                                  </el-select>
                                </div>
                              </div>

                              <div>
                                <div style="padding: 5px 0;display: flex">
                                  <div style="flex: 3">姓名:{{item.name}}</div>
                                </div>
                                <div style="padding: 5px 0;">单位:{{item.unit}}</div>
                                <div style="padding: 5px 0;">内容:{{item.title}}</div>
                                <div style="padding: 5px 0;">关联事件:{{item.event}}</div>
                              </div>
                            </el-card>
                          </div>
                        </div>
                      </el-scrollbar>
                      <div>
                        <el-pagination
                          center
                          small
                          layout="prev, pager, next,  total"
                          :page-size="pageFaxSize"
                          :total="totalFax"
                          :current-page.sync="currentFaxPage"
                          @current-change="getUnhandledSms"
                          :pager-count="5"
                        >
                        </el-pagination>
                      </div>
                    </div>


                  </div>
                </el-scrollbar>
              </el-card>
            </el-col>
            <el-col :span="14">
              <el-card class="box-card cardCalss" shadow="hover" >
                <el-scrollbar style="height: 100%">
                  <div style="min-height: 620px" :style="heightStyle">
                    <el-tabs  :style="elTablePlanStyle">
                      <el-tab-pane label="短信内容">
                        <!-- <div style="width: 100%;height: 300px;">
                          <el-scrollbar style="height: 100%">
                            <div style="text-indent: 20px;font-size: 14px;margin: 20px;">{{textShow}}</div>
                          </el-scrollbar>
                        </div> -->
                        <div style="height: 250px;border: 1px solid #ddd" :style="backSms">
                          <el-scrollbar style="height: 100%;margin: 10px;text-align: left;">
                            <div style="text-indent: 20px;font-size: 14px">{{smsText}}</div>
                          </el-scrollbar>
                        </div>
                        <div style="width: 100%;text-align: right;padding-top: 30px">
<!--                          <el-button type="primary" plain size="mini" @click="smsCheck">一键核实</el-button>-->
                          <el-button type="primary" plain size="mini"  v-clipboard:copy="smsText"
                                     v-clipboard:success="copyTextSuccess" v-clipboard:error="copyTextError">一键复制</el-button>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-scrollbar>
              </el-card>
            </el-col>
          </el-tab-pane>
        </el-tabs>

      </el-col>

    </el-row>
    <!--弹出事件列表关联-->
    <el-dialog title="关联事件" :visible.sync="eventList"
               :close-on-click-modal="false"
               append-to-body left
               :before-close="beforeClose"
               v-if="rushKist"
    >
      <div>
        <el-table :data="gridData"  stripe
                  border  v-loading="myLoading"
                  highlight-current-row
                  @row-click = "rowClick">
          <el-table-column property="title" label="事件标题" min-width="250"></el-table-column>
          <el-table-column property="caseClass" label="事件类型" min-width="250"></el-table-column>
          <el-table-column property="occurTime" label="事发时间" min-width="250"></el-table-column>
          <el-table-column property="receiveOperator" label="接报人" min-width="100"></el-table-column>
        </el-table>
        <el-pagination   :page-size="pageSize" :total="total"
                         :current-page.sync="currentPage" @current-change="getTabDatas"
                         layout="total, prev, pager, next, jumper"></el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="colser" size="mini">取 消</el-button>
        <el-button type="primary" @click="cufim" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 全屏预览传真 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      fullscreen>
      <iframe :src="allFpxPreviewPath" id="iframe" width="100%" height="900px" frameborder="no" border="0" marginwidth="0"
              marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
    </el-dialog>

  </div>
</template>

<script>
  import audioPlan from '@/view/yz_eventManagement/informationDisposal/audioPlan'
  export default {
    name: "cutPage",
    components:{
      audioPlan
    },

      data(){
          return{
              activeAllModel:'传真',//右边tabs选项
              leftTabsType:'传真',//左边tabs选项
              allFpxPreviewPath:'',//allModel选中传真的传真预览地址
              queryFaxAllTime:'',//allModel传真查询时间
              queryFaxAllSelect:'',//allModel传真下拉选中
              faxAllSelectData:'',//allModel传真获取到的数据
              list:[],
              pageFaxSize:10,//传真MODEL分页
              totalFax:0,//传真MODEL分页
              currentFaxPage:1,//传真MODEL分页
              bodyStyle:{
                  padding: '10px;',
                  backgroundColor:'transparent',
                  cursor: 'pointer'
              },//cred 默认的样式
              changeIndex:-1,//更改背景颜色
              eventList: false,//关联事件弹窗
              pageSize:10,
              currentPage:1,
              total:0,
              rushKist:true,
              gridData:[],
              myLoading: {
                  type: Boolean,
                  default: false
              },
              elTablePlanStyle:{
                  height:'',//中间的高度
              },
              elTablePlanStyleNext:{
                  height:''
              },
              heightStyle:{
                  height:''
              },
              rightHeightStyle:{
                  height:''
              },
              listHeight:{
                  height:''
              },
              messageCutHight:{
                  height:'',
              },
              saveEntering:{
                  height:'',
              },
              turnTheText:{
                  height:'',
              },
              changeRed:'信息处置',//默认显示信息处置
              InformationDisposalShow:true,//默认显示信息处置
              eventEnteringShow:false,//默认隐藏录入事件
              ruleForm:{//录入事件信息
                  serialNumber:'',//事件编号
                  eventTitle:'',//事件标题
                  reportedTime:'',//接报时间
                  incidentTime:'',//事发时间
                  incidenArea:'',//事发区域
                  incidentSite:'',//事发地点
                  submittedUnit:'',//报送单位
                  speakerName:'',//报告人姓名
                  speakerPhone:'',//报告人电话
                  incidenType:'',//事件类型
                  allCase:'',//突发事件报文
                  reportSituation:'',//上报情况
              },
              rules:{//录入事件表单验证
                  eventTitle: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  reportedTime: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  incidentTime: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  incidenArea: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  incidentSite: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  submittedUnit: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  incidenType: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  deathToll: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  bruiseToll: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
                  disappearToll: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],

                  allCase: [
                      {required: true, message: '不能为空', trigger: 'blur'},
                  ],
              },
              eventsParameters: false,//情景要素是否显示
              parameter: [],//情景要素参数
              audioList:{
                  //音频组件地址,只能传递一个,如果需要传递多个,可以自己修改源码  换成数组或者json
                  url:'',
                  //这个音频文件的长度,因为一般都是异步获取到音频地址才能初始化audio的,所以这个参数父传递给子合适点
                  totalTime:'',
              },
              dialogVisible:false,
              editIndex:'',
              options:'',
              selectState:'',
              textShow:'',
              row:'',//当前选中的事件
              nowTag:'fax',//当前的tag是传真、电话还是短信
              id:'',//当前左侧选中的的列表
              phoneText:'',
              smsText:'',
              addEventDialog: false,//选择是否弹窗
              title: '',//选择弹窗标题
              eventTree:[],//事件区域选中数据
              eventAddressBook:[],//事件联系人选中数据
              eventTypeList:[],//事件类型选中数据
              longitude: '',//经度
              latitude: '',//纬度
              asterisk:false,
              caseid:'',//事件类型ID
              addClass:'',//匹配出来的事件模板内容
              gutter:20,
              audioShow:false,
              leftEventId:'',
              testAudio:false,//
              audioUrlData:'',
              audioId:'',
              mapId:'informId',
              phonePerson:'',//电话联系人
              treeLoading:true,//传真loading加载
              phoneTreeLoading:true,//电话loading加载
              smsTreeLoading:true,//短信loading加载
              faxRushe:true,//刷新传真预览
              phoneRushe:true,//刷新电话预览
              backSms:{//短信区域给一个背景图
                  background:'',
                  backgroundSize:'',
              },
              backPhone:{//短信区域给一个背景图
                  background:'',
                  backgroundSize:'',
              },
          }
      },
      beforeDestroy() {
          window.removeEventListener('message', this.locationCallback);
          window.addEventListener("message", this.sendLocationMsg);
      },
      created(){
          window.addEventListener('resize', this.getHeight);
          this.getHeight();
          this.getTimes()
          this.getUnhandledFax();
          window.addEventListener("message", this.locationCallback);
          window.addEventListener("message", this.sendLocationMsg);
          //获取改变状态的列表
          let data={
              pcode:'information_processing_status'
          }
          this.$api.getByPcode(data).then((res) => {
              console.log(res)
              if (res.errorcode == 0) {
                  this.options = res.data;
                  console.log(this.options)
              }else {
                  //this.$message.error(res.msg)
              }
          })
          if(this.$store.getters.getDispositionType){
              this.leftTabsType=this.$store.getters.getDispositionType
              if(this.leftTabsType=='电话'){
                  this.getUnhandledPhone();
              }else if(this.leftTabsType=='短信'){
                  this.getUnhandledSms();
              }else if(this.leftTabsType=='传真'){
                  this.getUnhandledFax();
              }
          }
      },
      computed:{//获取悬浮球跳转过来时是跳哪个模块
          msgType() {
              return this.$store.getters.getDispositionType
          },
      },
      watch:{
          leftTabsType:{
              handler(valV,oldV){
                  if(valV=='电话'){
                      this.getUnhandledPhone();
                  }else if(valV=='短信'){
                      this.getUnhandledSms();
                  }else if(valV=='传真'){
                      this.getUnhandledFax();
                  }
              },
              deep:true
          },
          msgType(){
              this.leftTabsType=this.msgType
          },
          smsText:{
              handler(nV){
                  if(nV==''||nV==null){
                      this.backSms.background='url('+'/static/img/smsContent.png'+')center no-repeat'
                      this.backSms.backgroundSize='220px'
                  }else {
                      this.backSms.background='none'
                      this.backSms.backgroundSize='220px'
                  }
              },
              deep:true
          },
          phoneText:{
              handler(nV){
                  if(nV==''||nV==null){
                      this.backPhone.background='url('+'/static/img/txtNull.png'+')center no-repeat'
                      this.backPhone.backgroundSize='130px'
                  }else {
                      this.backPhone.background='none'
                      this.backPhone.backgroundSize='130px'
                  }
              },
              deep:true
          }
      },
      destroyed(){
          window.removeEventListener('resize', this.getHeight)

      },
      mounted(){
          this.backSms.background='url('+'/static/img/smsContent.png'+')center no-repeat'
          this.backSms.backgroundSize='220px'
          this.backPhone.background='url('+'/static/img/txtNull.png'+')center no-repeat'
          this.backPhone.backgroundSize='100px'
          this.getTabDatas()
          this.ruleForm.speakerName=sessionStorage.getItem('displayname')
          this.ruleForm.speakerPhone=sessionStorage.getItem('mobile')
          // this.amendParameter()
      },
      methods:{
          copyTextSuccess(e){
              console.log(e)
              //复制成功
              this.$message.success('复制成功');
              //把数据复制到文本域
              this.$refs.newFaxModel.copyToTextarea(e.text);
          },
          copyTextError(){
              this.$message.error('复制失败')
          },
          rowClick(row){
              this.row = row;
          },
          saveEdite(item,types){
              if(!this.selectState){
                  this.editIndex ='';
                  return;
              }
              let data={
                  type:types,
                  id:item.id,
                  statusId:this.selectState
              }
              console.log(data)
              this.$api.disposeEvent(data).then((res) => {
                  console.log(res)
                  if (res.errorcode == 0) {
                      this.editIndex ='';
                      if(types == 'fax') this.getUnhandledFax();
                      else if(types == 'phone') this.getUnhandledPhone();
                      else if(types == 'sms') this.getUnhandledSms();
                  }else {
                      //this.$message.error(res.msg)
                  }
              })
          },
          tabClick(tab, event){
              this.queryFaxAllTime = '';
              this.queryFaxAllSelect = '';
              this.phonePerson='';
              this.leftEventId='';
              this.changeIndex = -1;
              this.currentFaxPage = 1;
              this.InformationDisposalShow=false
              this.eventEnteringShow=true
              this.$nextTick(()=>{ //切换tabs时刷新右侧辅助页面的数据
                  this.activeAllModel='传真' //默认传真
                  this.InformationDisposalShow=true
                  this.eventEnteringShow=false
                  this.changeRed='信息处置'
              })
              if(tab.name == '传真'){
                  this.treeLoading=true
                  this.faxRushe=false
                  this.$nextTick(()=>{
                      this.allFpxPreviewPath=''
                      this.faxRushe=true
                  })
                  this.getUnhandledFax();
                  this.nowTag = 'fax';
              }else if(tab.name == '电话'){
                  this.phoneTreeLoading=true
                  this.phoneRushe=false
                  this.$nextTick(()=>{
                      this.testAudio=false
                      this.phoneRushe=true
                      this.audioUrlData=''
                      this.audioId=''
                      this.phoneText=''
                  })
                  this.getUnhandledPhone();
                  this.nowTag = 'phone';
              }else if(tab.name == '短信'){
                  this.smsTreeLoading=true
                  this.smsText=''
                  this.getUnhandledSms();
                  this.nowTag = 'sms';
              }
          },
          getHeight(){//自适应高度
              let h = document.documentElement.clientHeight || document.body.clientHeight
              this.elTablePlanStyle.height = (h - (68 + 235)+ 98)/2 + 'px'
              this.elTablePlanStyleNext.height = (h - (68 + 235)+ 98)/2 - 40 + 'px' //原件预览文件区域高度
              this.listHeight.height = h - (68 + 450)+ 120 + 'px'
              this.heightStyle.height = h - (68 + 235)+ 57 + 'px'
              this.rightHeightStyle.height = h - (68 + 163+40)+ 13 + 'px'
              this.messageCutHight.height = (h - (68 + 92)+ 13)/2 + 'px'
              this.saveEntering.height = h - (68 + 190) + 'px'
              this.turnTheText.height = ((h - (68 + 235)+54)/2)-34 + 'px'
          },
          getTabDatas(){//获取事件列表
              let data={
                  size:this.pageSize,
                  page:this.currentPage
              };
              this.myLoading =true;
              this.$api.eventHistory(data).then((res) => {
                  if(res.errorcode==0){
                      this.gridData=res.data.data
                      this.total=res.data.totalElements
                  }
                  this.myLoading = false;
              }).catch(() =>{
                  this.myLoading = false;
              })
          },
          allModelCloseDialog(){
              this.$emit('allModelCloseDialog')
          },
          closeDialog() {//colse关闭窗口
              this.addEventDialog = false;
              this.$refs.eventDialog.clearData()//刷新子组件数据
              // this.$emit('refreshEvent')

          },
          handleCurrentFaxChange(val){//传真model分页器
              this.$emit('handleCurrentFaxChange',val)
          },
          //点击传真列表
          changeItem(item,index){//点击每一条数据
              this.phonePerson='';
              this.leftEventId='';
              this.changeIndex=index;
              this.allFpxPreviewPath = '';
              this.textShow = '';
              this.leftEventId = item.id;
              this.phonePerson=item.phone;
              //获取pdf
              let data1={
                  faxId:item.id
              }
              this.$api.previewFax(data1).then((res) => {
                  if (res.errorcode == 0) {
                      this.allFpxPreviewPath = window.g.ApiUrl + '/fax/'+res.data;
                      this.imgToText(item.id);
                      console.log(this.allFpxPreviewPath)
                  }else {
                      //this.$message.error(res.msg)
                  }
              })

          },
          imgToText(id){
              //获取pdf转文字 文本预览
              let data={
                  id
              }
              this.$api.imgToText(data).then((res) => {
                  console.log(res)
                  if (res.errorcode == 0) {
                      this.textShow = res.data;
                  }else {
                      //this.$message.error(res.msg)
                  }
              })
          },
          //点击电话列表
          clickPhoneList(item,index){
              this.phonePerson='';
              this.leftEventId='';
              this.changeIndex=index;
              this.audioList = {};
              this.phoneText = '';
              this.leftEventId = item.id;
              console.log(item.phone);
              this.phonePerson=item.phone
              //获取录音文件
              let data={
                  phoneId:item.id
              }
              this.$api.audioUrl(data).then((res) => {
                  if (res.errorcode == 0) {
                      if(res.data.url){
                          this.testAudio=false
                          this.$nextTick(()=>{
                              this.testAudio=true
                              this.audioId=item.id
                              this.audioUrlData=window.g.ApiUrl+'/rec/'+res.data.url
                          })
                      }else {
                          this.testAudio=false
                      }
                  }else {
                      this.testAudio=false
                      this.audioUrlData=null
                      //this.$message.error(res.msg)
                  }
              })
              //获取录音转文本内容
              this.$api.findRecordTextByPhoneId({phoneId: item.id}).then(async (res) => {
                if(res.errorcode == 0){
                  this.phoneText = res.data.recordText;
                }else{
                  this.$message.error(res.msg)
                }
              })
          },
          //点击短信列表
          clickSmsList(item,index){
              this.phonePerson='';
              this.leftEventId='';
              this.changeIndex=index;
              this.smsText = item.title;
              this.leftEventId = item.id;
              this.phonePerson = item.phone;
          },
          eventRelevance(item){//事件关联
              this.eventList=true;
              this.id = item.id;
          },
          pageMode(){//监听是第几页

          },
          beforeClose(){//叉叉弹窗关闭销毁
              this.eventList=false
              this.rushKist=false  //放在关闭时能解决V-if闪屏问题
              this.$nextTick(()=>{
                  this.rushKist=true
              })
          },
          colser(){//取消
              this.eventList=false
              this.rushKist=false  //放在关闭时能解决V-if闪屏问题
              this.$nextTick(()=>{
                  this.rushKist=true
              })
          },
          cufim(){//确认
              this.eventList=false
              this.rushKist=false  //放在关闭时能解决V-if闪屏问题
              this.$nextTick(()=>{
                  this.rushKist=true
              });
              console.log(this.row);
              if(this.row){
                  let data={
                      eventId:this.row.id,
                      id:this.id,
                      type:this.nowTag
                  }
                  console.log(data)
                  this.$api.relateEvent(data).then((res) => {
                      if (res.errorcode == '0') {
                          console.log(res.data);
                          if(this.nowTag == 'fax'){
                              this.getUnhandledFax();
                          }else if(this.nowTag == 'phone'){
                              this.getUnhandledPhone();
                          }else if(this.nowTag == 'sms'){
                              this.getUnhandledSms();
                          }
                          this.$message({
                              message: '关联成功',
                              type: 'success'
                          })
                      }else {
                          //this.$message.error(res.msg)
                      }
                  })
              }
              this.row = '';
          },
          InformationDisposal(){//事件录入
              this.changeRed='信息处置'
              this.eventEnteringShow=false
              this.InformationDisposalShow=true
          },
          eventEntering(){//信息处置
              this.changeRed='事件录入'
              this.eventEnteringShow=true
              this.InformationDisposalShow=false
          },
          amendParameter(v){//根据事件类型获取事件参数
              console.log(v);
              if(v==''||v==null){
                  return
              }
              let data={
                  caseId:v
              }
              this.$api.defaultParameters(data).then((res) => {
                  if (res.errorcode == '0') {
                      console.log(res.data);
                      if(res.data.length>0){
                          this.eventsParameters=true
                          this.parameter=res.data
                      }
                  }else {
                      //this.$message.error(res.msg)
                  }
              })
          },
          getUnhandledFax(){//获取未处理的传真
              let time1 = '';
              let time2 = '';
              if(this.queryFaxAllTime){
                  console.log(this.queryFaxAllTime);
                  time1 = this.formatDateTime(this.queryFaxAllTime[0])
                  time2 = this.formatDateTime(this.queryFaxAllTime[1])
              }
              let data={
                  beginTime:time1,
                  endTime:time2,
                  key:this.queryFaxAllSelect,
                  page:this.currentFaxPage,
                  size:10,
                  blacklist: 0 // 不查询黑名单传真
              }
              console.log(data)
              this.$api.getUnhandledFax(data).then((res) => {
                  console.log(res);
                  if (res.errorcode == 0) {
                      this.list = res.data.data;
                      this.totalFax = res.data.total;
                      this.treeLoading=false
                  }else {
                      //this.$message.error(res.msg)
                  }
              })
          },
          getUnhandledPhone(){//获取未处理的电话
              let time1 = '';
              let time2 = '';
              this.phoneTreeLoading=true
              this.changeIndex = -1;
              this.nowTag = 'phone';
              this.phonePerson='';
              this.InformationDisposalShow=false
              this.eventEnteringShow=true
              this.$nextTick(()=>{ //切换tabs时刷新右侧辅助页面的数据
                  this.activeAllModel='传真' //默认传真
                  this.InformationDisposalShow=true
                  this.eventEnteringShow=false
                  this.changeRed='信息处置'
              })
              if(this.queryFaxAllTime){
                  console.log(this.queryFaxAllTime);
                  time1 = this.formatDateTime(this.queryFaxAllTime[0])
                  time2 = this.formatDateTime(this.queryFaxAllTime[1])
              }
              let data={
                  beginTime:time1,
                  endTime:time2,
                  key:this.queryFaxAllSelect,
                  page:this.currentFaxPage,
                  size:10
              }
              console.log(data)
              this.$api.getUnhandledPhone(data).then((res) => {
                  console.log(res);
                  if (res.errorcode == 0) {
                      this.list = res.data.data;
                      this.totalFax = res.data.total;
                      this.phoneTreeLoading=false
                  }else {
                      //this.$message.error(res.msg)
                  }
              })
          },
          getUnhandledSms(){//获取未处理的短信
              let time1 = '';
              let time2 = '';
              this.smsText=''
              this.smsTreeLoading=true
              this.changeIndex = -1;
              this.nowTag = 'sms';
              this.phonePerson='';
              this.InformationDisposalShow=false
              this.eventEnteringShow=true
              this.$nextTick(()=>{ //切换tabs时刷新右侧辅助页面的数据
                  this.activeAllModel='传真' //默认传真
                  this.InformationDisposalShow=true
                  this.eventEnteringShow=false
                  this.changeRed='信息处置'
              })
              if(this.queryFaxAllTime){
                  console.log(this.queryFaxAllTime);
                  time1 = this.formatDateTime(this.queryFaxAllTime[0])
                  time2 = this.formatDateTime(this.queryFaxAllTime[1])
              }
              let data={
                  beginTime:time1,
                  endTime:time2,
                  key:this.queryFaxAllSelect,
                  page:this.currentFaxPage,
                  size:10
              }
              console.log(data)
              this.$api.getUnhandledSms(data).then((res) => {
                  console.log(res);
                  if (res.errorcode == 0) {
                      this.list = res.data.data;
                      this.totalFax = res.data.total;
                      this.smsTreeLoading=false
                  }else {
                      //this.$message.error(res.msg)
                  }
              })
          },
          formatDateTime(time) {
              let date = time;
              let y = date.getFullYear();
              let m = date.getMonth() + 1;
              m = m < 10 ? ('0' + m) : m;
              let d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              return y + '-' + m + '-' + d;
          },
          eventMessage(){//生成事件报文模板
              if(this.caseid==''|| this.caseid==null){
                  this.$message({
                      message: '请选择事件类型',
                      type: 'warning'
                  });
                  return
              }
              let data={
                  caseId: this.caseid,
                  typeId:'699',
                  page:1,
                  size:10
              }
              this.$api.templateList(data).then((res) => {
                  if(res.errorcode==0){
                      console.log(res.data.data)
                      res.data.data.forEach((item,i)=>{
                          let addClass;

                          if(item.content.indexOf('事件标题')!=-1){
                              addClass = item.content.replace("【事件标题】",this.ruleForm.eventTitle);
                          }
                          if(item.content.indexOf('接报时间')!=-1){
                              addClass = addClass.replace("【接报时间】",this.ruleForm.reportedTime);
                          }
                          if(item.content.indexOf('事发时间')!=-1){
                              addClass = addClass.replace("【事发时间】",this.ruleForm.incidentTime);
                          }
                          if(item.content.indexOf('事发区域')!=-1){
                              addClass = addClass.replace("【事发区域】",this.ruleForm.incidenArea);
                          }
                          if(item.content.indexOf('事发地点')!=-1){
                              addClass = addClass.replace("【事发地点】",this.ruleForm.incidentSite);
                          }
                          if(item.content.indexOf('报送单位')!=-1){
                              addClass = addClass.replace("【报送单位】",this.ruleForm.submittedUnit);
                          }
                          if(item.content.indexOf('事件类型')!=-1){
                              addClass = addClass.replace("【事件类型】",this.ruleForm.incidenType);
                          }
                          if(item.content.indexOf('事件级别')!=-1){
                              addClass = addClass.replace("【事件级别】",this.ruleForm.incidenType);
                          }
                          if(item.content.indexOf('报告人-姓名')!=-1){
                              addClass = addClass.replace("【报告人-姓名】",this.ruleForm.speakerName);
                          }
                          if(item.content.indexOf('报送人-电话')!=-1){
                              addClass = addClass.replace("【报送人-电话】",this.ruleForm.speakerPhone);
                          }
                          if(item.content.indexOf('事发原因')!=-1){
                              addClass = addClass.replace("【事发原因】",this.ruleForm.incidentTime);
                          }
                          // if(item.content.indexOf('事发区域')!=-1){
                          //   addClass = addClass.replace("【事发区域】",this.ruleForm.incidenArea);
                          // }
                          // if(item.content.indexOf('事发地点')!=-1){
                          //   addClass = addClass.replace("【事发地点】",this.ruleForm.incidentSite);
                          // }
                          // if(item.content.indexOf('事件类型')!=-1){
                          //   addClass = addClass.replace("【事件类型】",this.ruleForm.incidentSite);
                          // }

                          let arr = [] // ！！
                          for(let item of this.parameter) {
                              console.log(item);
                              if (item.name === null|| item.value==undefined) {
                                  item.name = ' '
                              }
                              if(item.value === null|| item.value==undefined) {
                                  item.value = ' '
                              }
                              if(item.unit === null|| item.value==undefined) {
                                  item.unit = ' '
                              }
                              let paramString = item.name === '时间' ? `${item.name}: ${item.value};` : `${item.name}: ${item.value}(${item.unit});`
                              arr.push(paramString)
                          }

                          if (item.content.indexOf('参数项') !== -1) {
                              console.log(item.content.indexOf('【参数项】'));
                              let paramIndex = item.content.indexOf('【参数项】');
                              addClass = addClass.substr(0, paramIndex)

                              for (let param of arr) {
                                  addClass += param
                              }
                              console.log(addClass)
                              // addClass = item.content // !!!!!
                              // console.log(item.content)
                              // console.log('addClass', this.ruleForm)
                          }

                          // OK



                          // addClass = addClass.replace('【参数项】 【值】【单位】；', '')
                          // console.log(addClass)





                          console.log(arr) // ["受伤人数: 0(位);", "时间: null(null);", "死亡人数: 0(位);", "文本: null(本);"]

                          // if(item.content.indexOf('受伤人数')!=-1){
                          //   this.parameter.forEach((it,i)=>{//情景要素
                          //     if(it.name.indexOf('受伤人数')!=-1){
                          //       addClass = addClass.replace("【受伤人数】",it.value==(null||undefined)?0:it.value);
                          //     }
                          //
                          //   })
                          //
                          // }
                          // if(item.content.indexOf('时间')!=-1){
                          //   this.parameter.forEach((it,i)=>{//情景要素
                          //     if(it.name.indexOf('时间')!=-1){
                          //       addClass = addClass.replace("【时间】",it.value==(null||undefined)?'暂无时间':it.value);
                          //     }
                          //
                          //   })
                          // }
                          //
                          // if(item.content.indexOf('死亡人数')!=-1){
                          //   this.parameter.forEach((it,i)=>{//情景要素
                          //     if(it.name.indexOf('死亡人数')!=-1){
                          //       addClass = addClass.replace("【死亡人数】",it.value==(null||undefined)?0:it.value);
                          //     }
                          //
                          //   })
                          // }
                          //
                          // if(item.content.indexOf('文本')!=-1){
                          //   this.parameter.forEach((it,i)=>{//情景要素
                          //     if(it.name.indexOf('文本')!=-1){
                          //       addClass = addClass.replace("【文本】",it.value==(null||undefined)?0 :it.value);
                          //     }
                          //
                          //   })
                          // }
                          this.addClass=addClass
                          // this.ruleForm.allCase =addClass
                      })
                  }else {
                      //this.$message.error(res.msg)
                  }
              })
          },
          autoGenerAtion() {//生成事件报文
              this.eventMessage()
              if(this.ruleForm.reportedTime==''||this.ruleForm.reportedTime==null||this.ruleForm.reportedTime==undefined){
                  this.$message({
                      message: '请填写接报时间',
                      type: 'warning'
                  });
                  return
              }
              if(this.ruleForm.incidentTime==''||this.ruleForm.incidentTime==null||this.ruleForm.incidentTime==undefined){
                  this.$message({
                      message: '请填写事发时间',
                      type: 'warning'
                  });
                  return
              }
              if (this.ruleForm.allCase == '' || this.ruleForm.allCase == null || this.ruleForm.allCase == undefined) {
                  this.$refs.ruleForm.clearValidate()

                  this.ruleForm.allCase =this.addClass
//             `${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
// 事件过程:
// 事发原因: ${this.reason==null||undefined?'':this.reason}
// 已造成后果:${this.result==null||undefined?'':this.result}
// 事件发展趋势:${this.growing==null||undefined?'':this.growing}
// 已采取措施:${this.messure==null||undefined?'':this.messure}
//             `
              } else {
                  this.$confirm('基本情况已有内容, 是否覆盖?点击【取消】则自动生成的内容到末尾', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                      this.$refs.ruleForm.clearValidate()
                      this.ruleForm.allCase = '';
                      this.ruleForm.allCase =this.addClass
//             this.ruleForm.allCase =
//               `${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
// 事件过程:
// 事发原因: ${this.reason==null||undefined?'':this.reason}
// 已造成后果:${this.result==null||undefined?'':this.result}
// 事件发展趋势:${this.growing==null||undefined?'':this.growing}
// 已采取措施:${this.messure==null||undefined?'':this.messure}
//               `
                  }).catch(() => {
                      this.$refs.ruleForm.clearValidate()
                      console.log(this.ruleForm.allCase,this.addClass);
                      this.ruleForm.allCase += `\n\n${this.addClass}`
//               `\n\n${this.ruleForm.reportedTime}接报:${this.ruleForm.incidentTime},发生${this.ruleForm.incidenType}事故事件。
// 事件过程:
// 事发原因: ${this.reason==null||undefined?'':this.reason}
// 已造成后果:${this.result==null||undefined?'':this.result}
// 事件发展趋势:${this.growing==null||undefined?'':this.growing}
// 已采取措施:${this.messure==null||undefined?'':this.messure}
//               `

                  });
              }


          },
          getTimes(){//获取现在的时间
              let now = new Date();
              let year = now.getFullYear();       //年
              let month = now.getMonth() + 1;     //月
              let day = now.getDate();            //日
              let hh = now.getHours();            //时
              let mm = now.getMinutes();          //分
              let ss = now.getSeconds();           //秒
              let clock = year + "-";
              if(month < 10)
                  clock += "0";
              clock += month + "-";
              if(day < 10) clock += "0";
              clock += day + " ";
              if(hh < 10)
                  clock += "0";
              clock += hh + ":";
              if (mm < 10) clock += '0';
              clock += mm + ":";
              if (ss < 10) clock += '0';
              clock += ss;
              this.ruleForm.incidentTime=clock
              this.ruleForm.reportedTime=clock
          },
          saveEvent() {//保存事件
              if(this.changeIndex == -1){
                  this.$message.warning('请先选中关联左侧列表事件');
                  return false;
              }
              this.$refs['ruleForm'].validate((valid) => {
                  if (valid) {
                      let eventTreeId=this.eventTree
                      let eventTypeId=this.eventTypeList

                      if(eventTreeId.length==0){
                          eventTreeId=''
                      }else {
                          eventTreeId=eventTreeId[0].id
                      }
                      if(eventTypeId.length==0){
                          eventTypeId=''
                      }else {
                          eventTypeId=eventTypeId[0].id
                      }
                      if(this.longitude==''||this.longitude==undefined){
                          this.longitude=null
                      }
                      if(this.latitude==''||this.latitude==undefined){
                          this.latitude=null
                      }
                      console.log(eventTreeId, eventTypeId);
                      let data = {
                          // eventCode:this.ruleForm.serialNumber,
                          typeId:this.leftEventId,
                          type:this.nowTag, //fax,phone,sms
                          vcTitle: this.ruleForm.eventTitle,//事件标题
                          dtReportTime: this.ruleForm.reportedTime,//接报时间
                          dtOccurTime: this.ruleForm.incidentTime,//事发时间
                          iAreaId: eventTreeId,//事发区域ID
                          vcAddress: this.ruleForm.incidentSite,//事发地点
                          dLongitude: this.longitude,//经度
                          dLatitude: this.latitude,//纬度
                          vcReportDepart: this.ruleForm.submittedUnit,//报送单位
                          iCaseClassId:eventTypeId,//事件类型
                          // iEventLevel: this.test,//事件等级
                          iEvnetSetingParams: this.parameter,//事件参数
                          txtReportSuperior: this.ruleForm.reportSituation,//上报情况
                          txtReportDescription: this.ruleForm.allCase,//总体情况
                          vcReportMan:this.ruleForm.speakerName,
                          vcReportNum:this.ruleForm.speakerPhone,
                          phoneId:this.phoneHistalId==''||undefined?null:this.phoneHistalId,
                          remark:this.phoneHistalremack ==''||undefined?null:this.phoneHistalremack
                      };
                      this.$api.saveEventReceive(data).then((res) => {
                          if (res.errorcode == '0') {
                              this.$message({
                                  message: '保存事件成功!',
                                  type: 'success'
                              });
                              if(this.nowTag == 'fax'){
                                  this.getUnhandledFax();
                              }else if(this.nowTag == 'phone'){
                                  this.getUnhandledPhone();
                              }else if(this.nowTag == 'sms'){
                                  this.getUnhandledSms();
                              }
                              // let eventId = res.data.id;
                              // this.reload()
                          } else {
                              //this.$message.error(res.msg)
                          }
                      });
                  }
              });
          },
          close() { //弹出选择取消
              this.addEventDialog = false;
              // sessionStorage.setItem('caseID', this.caseFor)
              // sessionStorage.setItem('areaId',this.areaIdArr)
              // sessionStorage.setItem('area',this.areaNameArr)
              this.$refs.eventDialog.clearData()//刷新子组件数据
          },
          handleNodeClick(data) { //选择弹出树点击事件
              let type = this.title;
              switch (type) {
                  case '选择区域':
                      this.eventTree = [];
                      this.eventTree.push({name: data.name, id: data.id});
                      break;
                  case '选择联系人分组':
                      console.log(data.name);
                      this.eventAddressBook = [];
                      this.eventAddressBook.push({name: data.name, id: data.id});
                      break;
                  case '选择事件类型':
                      this.eventTypeList = [];
                      this.eventTypeList.push({name: data.name, id: data.id});
                      break;
                  default:
                      break;
              }
          },
          confirm() {//弹窗选择确定
              let type = this.title;
              switch (type) {
                  case '选择区域':
                      this.ruleForm.incidenArea = this.eventTree[0].name;
                      break;
                  case '选择联系人分组':
                      this.ruleForm.submittedUnit = this.eventAddressBook[0].name
                      break;
                  case '选择事件类型':
                      this.ruleForm.incidenType = this.eventTypeList[0].name
                      let data=this.eventTypeList[0].id
                      this.caseid=this.eventTypeList[0].id//给生成模板用
                      console.log(this.eventTypeList,this.caseid);
                      this.amendParameter(this.eventTypeList[0].id)
                      break;
                  default:
                      break;
              }
              this.$refs.eventDialog.clearData()//刷新子组件数据
              this.addEventDialog = false;

          },
          eventScene() {  //弹出选择事件区域选择
              this.title = '选择区域';
              this.addEventDialog = true;
              let data = {};
              this.$api.topTree(data).then((res) => {
                  if (res.errorcode == '0') {
                      this.$refs.eventDialog.lol(res.data);
                  }
              })
          },
          addressBook() {//弹出选择通讯录
              this.title = '选择联系人分组';
              this.addEventDialog = true;
              let data = {};
              this.$api.phoneGroupList(data).then((res) => {
                  if (res.errorcode == '0') {
                      this.$refs.eventDialog.lol(res.data);
                  }
              })
          },
          incidentType() {//弹出选择事件类型
              this.title = '选择事件类型';
              this.addEventDialog = true;
              let data = {};
              this.$api.getTree(data).then((res) => {
                  if (res.errorcode == '0') {
                      console.log(res);
                      this.$refs.eventDialog.lol(res.data);
                  }
              })
          },
          location() { //定位弹窗
              this.$refs.loction.visible = false;
              this.$refs.loction.rushLocation=false
              this.$nextTick(()=>{
                  this.$refs.loction.visible = true;
                  this.$refs.loction.rushLocation=true
              })
          },
          locationCallback(obj) {//定位
              if (obj.data.action && obj.data.action == "retpoint") {
                  let latlon = obj.data.object.point.split(",");
                  console.log(latlon[0], latlon[1]);
                  this.longitude = latlon[0];
                  this.latitude = latlon[1];
                  this.ruleForm.incidentSite = obj.data.object.address;
                  // this.$refs.loction.visible = false;
              }
          },

          sendLocationMsg(obj) {
              if (obj.data.action && obj.data.action == "ready") {
                  console.log(this.longitude);
                  console.log(this.latitude);
                  if (this.longitude && this.latitude) {
                      this.longitude = ''
                      this.latitude = ''
                      this.ruleForm.incidentSite=''
                      //var framew = window.mapFrame.contentWindow;
                      var mapFarme = document.getElementById("informId");
                      if (mapFarme) {
                          var data = {};
                          data.action = "getpoint";
                          var object = {};
                          object.center = this.longitude + "," + this.latitude;
                          object.address = this.ruleForm.incidentSite;
                          object.area = "";
                          data.object = object;
                          mapFarme.contentWindow.postMessage(JSON.stringify(data), "*");
                      }
                  }
              }
          },
          // turTheText(){ //语音转文字
          //   if(this.voiceUrl==''||this.voiceUrl==null){
          //     return
          //   }
          //   let extenion=this.voiceUrl.split('.');
          //   console.log(extenion);
          //   let data={
          //     url:this.voiceUrl,
          //     extenion:extenion[4]
          //   }
          //   this.$api.downloadRecordToText(data).then((res) => {
          //     if(res.errorcode=='0'){
          //       console.log(res.data);
          //       this.word=res.data.result
          //     }
          //   })
          // },
          //一键生成标题
          generateTheTitle(){
              let oneTime=this.ruleForm.incidentTime.substring(5,7)
              let towTime=this.ruleForm.incidentTime.substring(8,10)
              console.log(oneTime,towTime);
              this.ruleForm.eventTitle=`${oneTime}.${towTime}  ${this.ruleForm.incidenArea}  ${this.ruleForm.incidenType}`
              this.$message({
                  message: '生成成功',
                  type: 'success'
              })
          },

          //语音截取识别成功赋值文字
          sendPhoneText(val){
              this.phoneText=val
          },

          //电话一键核实
          phoneVerification(){
              if(this.phonePerson==''||this.leftEventId==''){
                  this.$message({
                      message: '请选择需要核实的内容!',
                      type: 'warning'
                  });
                  return
              }
              this.InformationDisposalShow=true
              this.eventEnteringShow=false
              this.$nextTick(()=>{
                  this.activeAllModel='电话'
                  this.changeRed='信息处置'
                  this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson)
              })

          },

          //短信一键核实
          smsCheck(){
              if(this.phonePerson==''||this.leftEventId==''){
                  this.$message({
                      message: '请选择需要核实的内容!',
                      type: 'warning'
                  });
                  return
              }
              this.InformationDisposalShow=true
              this.eventEnteringShow=false
              this.$nextTick(()=>{
                  this.activeAllModel='电话'
                  this.changeRed='信息处置'
                  this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson)
              })
          },

          //传真一键核实
          faxCheck(){
              if(this.phonePerson==''||this.leftEventId==''){
                  this.$message({
                      message: '请选择需要核实的内容!',
                      type: 'warning'
                  });
                  return
              }
              this.InformationDisposalShow=true
              this.eventEnteringShow=false
              this.$nextTick(()=>{
                  this.activeAllModel='电话'
                  this.changeRed='信息处置'
                  this.$refs.newPhoneModel.oneKeyCheck(this.phonePerson)
              })
          },
      }
  }
</script>

<style scoped>
  >>>.el-dialog--center .el-dialog__body{
    padding: 5px 0 0 0 ;
  }
  #faxCard >>>.el-card__body{
    padding:0px;
  }
  .iBack_img{
    display: inline-block;
    height:16px;
    width:16px;
    background-image: url('../../../../../static/img/icon/getBack.png');
    background-size: 100%;
  }
  .iSave_img{
    display: inline-block;
    height:16px;
    width:16px;
    background-image: url('../../../../../static/img/icon/save.png');
    background-size: 100%;
  }
  .ibackDiv{
    flex: 1;
    font-size: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8A8A8A;
  }
  .ibackDiv i{
    margin: 0 5px;
    cursor: pointer;
  }
  .cardModelDiv{
    /* background-color: cornflowerblue !important;
    color: white !important; */
    border-bottom:5px solid cornflowerblue;
  }
  .messageDiv{
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 2px;
  }
  .messsagColor{
    background-color: #F0F6FF;
    color: #0091FF;
    border-left: 3px solid #0091FF;
    box-sizing: border-box;
  }
  .messageDiv:first-child{
    border-bottom: 1px solid #ddd;
  }
  .messageCut{
    margin: 0 auto;
    width: 25px;
    font-size: 20px;
  }
  .addButton {
    height: 70px;
    line-height: 70px;
    width: 100%;
    background-color: white;
    text-align: left;
    text-indent: 40px;
  }
  #itemCalss >>> .el-form-item__content {
    margin-left: 0 !important;
  }
  .fullScreen{
    position: absolute;
    right: 30px;
    top: 30px;
    z-index: 999;
    cursor: pointer;
  }
  .tabsClass{
    background: #FFFFFF;
  }

  /* >>> .el-tabs__item{
     font-size: 16px;
     margin: 10px 30px;
   } */
  >>>.el-tabs__header.is-top{
    margin: 0;
  }

  >>>.el-tabs__nav-wrap.is-top {
    color: #A2A2A2 !important;
    background: #F0F6FF;
  }

  >>>.el-tabs__item{
    font-size:14px;
    color: #A2A2A2;
  }

  >>>.el-tabs__item.is-active {
    color: #409EFF;
  }

  >>>.el-tabs__item:hover {
    color: #6B7280;
  }
  >>>.el-tabs__nav-next,>>>.el-tabs__nav-prev{
    font-size: 20px;
  }

  #itemCalss >>> .el-form-item__content {
    margin-left: 0 !important;
  }
  #serial >>>.el-input.is-disabled .el-input__inner:nth-child(1){
    background-color: black !important;
    color: yellow !important;
  }

  >>> .el-input.is-disabled .el-input__inner {
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    white-space: nowrap;
  }
  >>>.el-input-number--mini{
    width: 193px;
  }
  .formContent>>>.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 15px;
  }
  >>>.el-form--label-left .el-form-item__label{
    letter-spacing: 1px;
    position: relative;
  }
  >>>.el-form-item .el-form-item__label:before{
    padding: 0;
    position: absolute;
    left: -10px;
  }
  >>>.el-form-item__label-wrap{
    margin-left: 15px !important;
  }
  >>>.el-form-item__content{
    margin-left: 105px !important;
  }
  #reporter >>>.el-col-10 {
    padding: 0 !important;
  }
  #reporter >>>.el-col-14{
    padding-right: 0 !important;
  }
  #itemCalss >>> .el-form-item__content {
    margin-left: 0 !important;
  }
  #baowen >>> .el-form-item__content{
    margin-left: 0 !important;
  }
  #baowenNeiRon >>> .el-form-item__content textarea{
    background-color: #F9F9F9;
    padding-right: 80px;
  }
  #baowen>>>.el-form-item__label:before{
    content: '';
    color: #F56C6C;
    margin-right: 4px;
  }
  .el-pagination__jump{
    margin-left: 0;
  }
  >>>.phoneCall .el-form-item__content {
    margin-left: 0 !important;
  }
  #titleEvent >>>.el-input__inner{
    padding-right: 84px !important;
  }
</style>
